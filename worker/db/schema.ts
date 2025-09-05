import { sqliteTable, text, integer, blob, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey().notNull(),
    username: text("username").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    salt: blob("salt").notNull(),
    profile: text("profile"),
    createdAt: integer("created_at", { mode: "number" }).notNull(),
  },
);

export const pageConfigs = sqliteTable(
  "page_configs",
  {
    id: text("id").primaryKey().notNull(),
    pageName: text("page_name").notNull(),
    configData: text("config_data").notNull(),
    metadata: text("metadata"),
    userId: text("user_id"),
    isPublished: integer("is_published", { mode: "boolean" }).default(false),
    createdAt: integer("created_at", { mode: "number" }).notNull(),
    updatedAt: integer("updated_at", { mode: "number" }).notNull(),
  },
  (t) => ({
    pageUserUnique: uniqueIndex("page_user_unique").on(t.pageName, t.userId),
  }),
);

