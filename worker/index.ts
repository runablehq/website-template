import { Hono } from "hono";
import { cors } from "hono/cors";
import { authenticatedOnly, authMiddleware } from "./middleware/auth";
import routes from "./routes/auth-routes";

const app = new Hono<{ Bindings: Cloudflare.Env }>();

app.use("*", cors());

// Global error handler
app.onError((err, c) => {
  console.error("Global error handler:", err);
  return c.json(
    {
      error: "Internal Server Error",
      message: "An unexpected error occurred",
      details: err.message,
    },
    500
  );
});

app.get("/ping", (c) => c.json({ message: "ok", timestamp: Date.now() }));

app.use("*", authMiddleware);

// protected route example
app.get("/protected", authenticatedOnly, (c) =>
  c.json({ message: "ok", timestamp: Date.now() })
);

app.get("/me", authenticatedOnly, (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ message: "You are not authenticated" }, 401);
  }
  return c.json(user);
});

app.route("/api", routes);

// Serve static assets and SPA fallback via the ASSETS binding for any
// non-API routes that weren't handled above. The `assets` block in
// `wrangler.jsonc` uploads files from `./src/assets/` and binds them to
// `env.ASSETS`. The `not_found_handling: "single-page-application"` setting
// ensures unknown paths fall back to `index.html`.
//
// Note: This catch-all must be registered after API routes.
app.all("*", async (c) => {
  const url = new URL(c.req.url);
  const isHtmlRoute =
    c.req.method === "GET" &&
    (!url.pathname.includes(".") || url.pathname.endsWith("/"));

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
