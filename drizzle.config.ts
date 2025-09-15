import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./worker/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "d1-http",
  verbose: true,
  strict: true,
  dbCredentials: {
    databaseId: "5b09f2ee-bd0f-402a-aa24-ac5c84e07834",
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    token: process.env.CLOUDFLARE_API_TOKEN!
  }
});

