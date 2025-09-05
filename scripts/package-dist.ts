/*
 Package the dist folder into a .zip

 Usage examples:
   bun scripts/package-dist.ts
   bun scripts/package-dist.ts --dir dist --out ./.artifacts/dist.zip

 Notes:
 - On macOS, uses `ditto -c -k --keepParent` (falls back to `zip`).
 - On Linux/Unix, uses `zip -r`.
 - On Windows, uses PowerShell `Compress-Archive`.
 - Produces `.artifacts/dist-<timestamp>.zip` by default.
*/

import { execFile } from "node:child_process";
import { mkdirSync, existsSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { dirname, join, resolve, basename } from "node:path";

type Args = {
  dir: string;
  out?: string;
  overwrite?: boolean;
};

function parseArgs(argv: string[]): Args {
  const out: any = { dir: "dist", overwrite: false };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    const v = argv[i + 1];
    if (k === "--dir" || k === "--dist") {
      out.dir = v; i++;
    } else if (k === "--out" || k === "--zip") {
      out.out = v; i++;
    } else if (k === "--overwrite") {
      out.overwrite = true;
    }
  }
  return out as Args;
}

function execFileAsync(cmd: string, args: string[], cwd?: string): Promise<{ code: number }>{
  return new Promise((resolvePromise, reject) => {
    const child = execFile(cmd, args, { cwd }, (error, stdout, stderr) => {
      if (error) {
        error.message += `\nSTDOUT: ${stdout}\nSTDERR: ${stderr}`;
        reject(error);
      } else {
        resolvePromise({ code: 0 });
      }
    });
    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);
  });
}

async function ensureZip(dir: string, outPath: string) {
  const absDir = resolve(dir);
  const absOut = resolve(outPath);

  if (!existsSync(absDir) || !statSync(absDir).isDirectory()) {
    throw new Error(`Directory not found: ${absDir}`);
  }
  const contents = await readdir(absDir).catch(() => []);
  if (contents.length === 0) {
    throw new Error(`Directory is empty: ${absDir}`);
  }

  // Ensure parent exists
  mkdirSync(dirname(absOut), { recursive: true });

  const folderName = basename(absDir);

  // Platform-specific strategies
  if (process.platform === "darwin") {
    // Prefer ditto on macOS to preserve folder structure
    try {
      await execFileAsync("ditto", [
        "-c",
        "-k",
        "--sequesterRsrc",
        "--keepParent",
        absDir,
        absOut,
      ]);
      return;
    } catch {
      // fall through to zip
    }
  }

  if (process.platform === "win32") {
    // Use PowerShell Compress-Archive
    const psCmd = [
      "-NoProfile",
      "-Command",
      // Use -Path <dir> to include the parent folder name inside the zip
      `Compress-Archive -Path '${absDir}' -DestinationPath '${absOut}' -Force`
    ];
    await execFileAsync("powershell", psCmd);
    return;
  }

  // Try GNU/Info-ZIP `zip` on Unix-like systems
  try {
    // Run from parent to ensure zip contains the folder name, not just contents
    const parent = dirname(absDir);
    await execFileAsync("zip", [
      "-r",
      "-q",
      absOut,
      folderName,
      "-x",
      "*.DS_Store",
    ], parent);
    return;
  } catch (err) {
    // As a last resort on macOS, try ditto (if initial branch didn't run)
    if (process.platform === "darwin") {
      await execFileAsync("ditto", [
        "-c",
        "-k",
        "--sequesterRsrc",
        "--keepParent",
        absDir,
        absOut,
      ]);
      return;
    }
    throw err;
  }
}

function defaultOutPath(dir: string) {
  const ts = new Date().toISOString().replace(/[-:TZ]/g, "").slice(0, 14);
  const name = basename(resolve(dir));
  return join(".artifacts", `${name}-${ts}.zip`);
}

async function main() {
  const cli = parseArgs(process.argv);
  const out = cli.out || defaultOutPath(cli.dir);
  const absOut = resolve(out);

  if (existsSync(absOut) && !cli.overwrite) {
    throw new Error(`Output exists: ${absOut} (pass --overwrite to replace)`);
  }

  console.log(`Zipping '${cli.dir}' -> '${out}'...`);
  await ensureZip(cli.dir, out);
  console.log(`Created: ${absOut}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

