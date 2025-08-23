// D1-backed primitives: auth and users + migrations

type JsonValue = any;

export type RegisterPayload = { username: string; password: string; profile?: JsonValue };
export type VerifyPayload = { username: string; password: string };

async function hashPassword(password: string, salt: Uint8Array): Promise<string> {
  const enc = new TextEncoder();
  const data = new Uint8Array(salt.length + enc.encode(password).length);
  data.set(salt, 0);
  data.set(enc.encode(password), salt.length);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function runMigrations(env: Env) {
  const db = (env as any).D1 as D1Database;
  // Create migrations table
  await db.prepare("CREATE TABLE IF NOT EXISTS __schema_migrations (version INTEGER PRIMARY KEY)").run();
  // Determine current version
  const current = await db.prepare("SELECT MAX(version) as v FROM __schema_migrations").first<{ v: number | null }>();
  const from = (current?.v ?? 0) | 0;

  const migrations: { version: number; sql: string; seed?: (db: D1Database) => Promise<void> }[] = [
    {
      version: 1,
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          salt BLOB NOT NULL,
          profile TEXT,
          created_at INTEGER NOT NULL
        );
      `,
      seed: async (db) => {
        // seed admin user if not present
        const row = await db.prepare("SELECT id FROM users WHERE username = ?").bind("admin").first();
        if (!row) {
          const id = crypto.randomUUID();
          const salt = crypto.getRandomValues(new Uint8Array(16));
          const passwordHash = await hashPassword("admin", salt);
          await db
            .prepare(
              "INSERT INTO users (id, username, password_hash, salt, profile, created_at) VALUES (?, ?, ?, ?, ?, ?)"
            )
            .bind(id, "admin", passwordHash, salt, JSON.stringify({ role: "admin" }), Date.now())
            .run();
        }
      },
    },
  ];

  for (const m of migrations) {
    if (m.version > from) {
      await db.prepare(m.sql).run();
      if (m.seed) await m.seed(db);
      await db.prepare("INSERT INTO __schema_migrations (version) VALUES (?)").bind(m.version).run();
    }
  }
}

export async function registerUser(env: Env, payload: RegisterPayload) {
  const db = (env as any).D1 as D1Database;
  const exists = await db.prepare("SELECT id FROM users WHERE username = ?").bind(payload.username).first();
  if (exists) return { ok: false, error: "Username taken" };
  const id = crypto.randomUUID();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordHash = await hashPassword(payload.password, salt);
  await db
    .prepare(
      "INSERT INTO users (id, username, password_hash, salt, profile, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(id, payload.username, passwordHash, salt, JSON.stringify(payload.profile ?? {}), Date.now())
    .run();
  return { ok: true, id };
}

export async function verifyCredentials(env: Env, payload: VerifyPayload) {
  const db = (env as any).D1 as D1Database;
  const row = await db
    .prepare("SELECT id, password_hash as passwordHash, salt FROM users WHERE username = ?")
    .bind(payload.username)
    .first<{ id: string; passwordHash: string; salt: Uint8Array }>();
  if (!row) return { ok: false };
  const hash = await hashPassword(payload.password, new Uint8Array(row.salt as any));
  const match = hash === row.passwordHash;
  return { ok: match, id: match ? row.id : undefined };
}

export async function getUserById(env: Env, id: string) {
  const db = (env as any).D1 as D1Database;
  const user = await db
    .prepare("SELECT id, username, profile, created_at as createdAt FROM users WHERE id = ?")
    .bind(id)
    .first<{ id: string; username: string; profile: string; createdAt: number }>();
  if (!user) return null;
  return { ...user, profile: safeParse(user.profile) };
}

function safeParse(s: string | null | undefined) {
  if (!s) return {};
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}

