import { Hono } from "hono";
import { getUserById, registerUser, verifyCredentials } from "./db";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";

const app = new Hono();

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

import { savePageConfig, getPageConfig, getPublishedPageConfig } from "./db/index.js";

app.get("/api/me", requireAuth, async c => {
  const token = c.get("jwtPayload") as any;
  const id = token?.sub as string;
  if (!id) return c.json({ error: "Unauthorized" }, 401);
  const user = await getUserById(c.env as Env, id);
  return c.json(user as any);
});

// Config API endpoints
app.get("/api/config/:pageName", async c => {
  const pageName = c.req.param("pageName");

  try {
    // Try to get published config first (for public access)
    const publishedConfig = await getPublishedPageConfig(c.env as Env, pageName);
    if (publishedConfig.ok) {
      return c.json({
        success: true,
        data: {
          config: publishedConfig.config,
          metadata: publishedConfig.metadata,
          isPublished: true,
        }
      });
    }

    // If no published config, return error
    return c.json({ success: false, error: "Config not found" }, 404);
  } catch (error) {
    console.error("Error fetching config:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

app.post("/api/config/:pageName", requireAuth, async c => {
  const pageName = c.req.param("pageName");
  const userId = (c as any).get("userId") as string;

  try {
    const payload = await c.req.json<{
      config: any;
      isPublish?: boolean;
      metadata?: any;
    }>();

    const result = await savePageConfig(c.env as Env, userId, {
      config: payload.config,
      pageName: pageName,
      isPublish: payload.isPublish,
      metadata: payload.metadata,
    });

    if (result.ok) {
      return c.json({
        success: true,
        message: payload.isPublish ? "Config published successfully" : "Config saved successfully",
        id: result.id
      });
    } else {
      return c.json({ success: false, error: result.error }, 500);
    }
  } catch (error) {
    console.error("Error saving config:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// Get user's draft config (not published)
app.get("/api/config/:pageName/draft", requireAuth, async c => {
  const pageName = c.req.param("pageName");
  const userId = (c as any).get("userId") as string;

  try {
    const config = await getPageConfig(c.env as Env, userId, pageName);
    if (config.ok) {
      return c.json({
        success: true,
        data: {
          config: config.config,
          metadata: config.metadata,
          isPublished: config.isPublished,
          updatedAt: config.updatedAt,
        }
      });
    } else {
      return c.json({ success: false, error: config.error }, 404);
    }
  } catch (error) {
    console.error("Error fetching draft config:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// Serve static assets and SPA fallback via the ASSETS binding for any
// non-API routes that weren't handled above. The `assets` block in
// `wrangler.jsonc` uploads files from `./src/assets/` and binds them to
// `env.ASSETS`. The `not_found_handling: "single-page-application"` setting
// ensures unknown paths fall back to `index.html`.
//
// Note: This catch-all must be registered after API routes.
app.all("*", async (c) => {
  const url = new URL(c.req.url);
  const isHtmlRoute = c.req.method === "GET" && (!url.pathname.includes(".") || url.pathname.endsWith("/"));

  if (isHtmlRoute) {
    // Force-serve index.html for SPA routes and ensure correct headers.
    const indexUrl = new URL("/index.html", url.origin);
    const req = new Request(indexUrl.toString(), c.req.raw);
    const resp = await (c.env as Env).ASSETS.fetch(req);
    const out = new Response(resp.body, resp);
    out.headers.set("Content-Type", "text/html; charset=utf-8");
    out.headers.delete("Content-Disposition");
    return out;
  }

  // Delegate other requests (JS/CSS/assets) to the asset handler as-is.
  return (c.env as Env).ASSETS.fetch(c.req.raw);
});

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>;
