import { Hono } from "hono";
import { getUserById, registerUser, runMigrations, verifyCredentials } from "./db";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";

const app = new Hono();

// Run migrations on first request in this runtime instance
let didMigrate = false;
app.use("/*", async (c, next) => {
  if (!didMigrate) {
    await runMigrations(c.env as Env);
    didMigrate = true;
  }
  await next();
});

app.get("/api/hello", c => c.json({ message: "Hello from Hono" }));

app.get("/api/hello/:name", c => {
  const name = c.req.param("name");
  return c.json({ message: `Hello, ${name}!` });
});

// Auth: register, login, logout
app.post("/api/auth/register", async c => {
  const payload = await c.req.json<{ username: string; password: string; profile?: any }>();
  const res = await registerUser(c.env as Env, payload);
  if (!res.ok) return c.json({ error: res.error || "Unable to register" }, 409);
  return c.json(res as any);
});

app.post("/api/auth/login", async c => {
  const { username, password } = await c.req.json<{ username: string; password: string }>();
  const res = (await verifyCredentials(c.env as Env, { username, password })) as { ok?: boolean; id?: string };
  if (!res || !res.ok || !res.id) return c.json({ error: "Invalid credentials" }, 401);
  const secret = (c.env as any).AUTH_SECRET || "dev-secret-change-me";
  const token = await sign({ sub: res.id, u: username }, secret);
  // Set httpOnly cookie
  setCookie(c, "auth", token, { httpOnly: true, path: "/", sameSite: "Lax", maxAge: 60 * 60 * 24 * 7 });
  return c.json({ ok: true });
});

app.post("/api/auth/logout", c => {
  deleteCookie(c, "auth", { path: "/" });
  return c.json({ ok: true });
});

// JWT verification middleware reading from httpOnly cookie
const requireAuth = async (c: any, next: any) => {
  const cookie = getCookie(c, "auth");
  if (!cookie) return c.json({ error: "Unauthorized" }, 401);
  try {
    const secret = (c.env as any).AUTH_SECRET || "dev-secret-change-me";
    const payload = await verify(cookie, secret);
    c.set("userId", (payload as any).sub);
    c.set("jwtPayload", payload);
    await next();
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
};

app.get("/api/me", requireAuth, async c => {
  const token = c.get("jwtPayload") as any;
  const id = token?.sub as string;
  if (!id) return c.json({ error: "Unauthorized" }, 401);
  const user = await getUserById(c.env as Env, id);
  return c.json(user as any);
});

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>;
