import { createAuth } from "../auth";
import { Hono } from "hono";

const app = new Hono<{ Bindings: Cloudflare.Env }>();

app.on(["POST", "GET"], "/auth/*", async (c) => {
  const auth = createAuth(c.env);
  return auth.handler(c.req.raw);
});

export default app;