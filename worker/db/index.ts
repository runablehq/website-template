// D1-backed primitives using Drizzle ORM
import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { pageConfigs, users } from "./schema";

type JsonValue = any;

export type RegisterPayload = {
  username: string;
  password: string;
  profile?: JsonValue;
};
export type VerifyPayload = { username: string; password: string };

async function hashPassword(
  password: string,
  salt: Uint8Array
): Promise<string> {
  const enc = new TextEncoder();
  const data = new Uint8Array(salt.length + enc.encode(password).length);
  data.set(salt, 0);
  data.set(enc.encode(password), salt.length);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Migrations are handled externally via Drizzle Kit. Remove in-app migration logic.

export async function registerUser(env: Env, payload: RegisterPayload) {
  try {
    const db = drizzle((env as any).D1 as D1Database);
    const exists = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, payload.username))
      .limit(1);
    if (exists.length > 0) return { ok: false, error: "Username taken" };
    const id = crypto.randomUUID();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const passwordHash = await hashPassword(payload.password, salt);
    await db.insert(users).values({
      id,
      username: payload.username,
      passwordHash,
      salt: salt as unknown as ArrayBuffer,
      profile: JSON.stringify(payload.profile ?? {}),
      createdAt: Date.now(),
    });
    return { ok: true, id };
  } catch (error) {
    console.error("Error registering user:", error as Error);
    return {
      ok: false,
      error: "Failed to register user, error: " + (error as Error).message,
    };
  }
}

export async function verifyCredentials(env: Env, payload: VerifyPayload) {
  const db = drizzle((env as any).D1 as D1Database);
  const rows = await db
    .select({
      id: users.id,
      passwordHash: users.passwordHash,
      salt: users.salt,
    })
    .from(users)
    .where(eq(users.username, payload.username))
    .limit(1);
  const row = rows[0];
  if (!row) return { ok: false };
  const saltBuf = row.salt as unknown as ArrayBuffer;
  const hash = await hashPassword(payload.password, new Uint8Array(saltBuf));
  const match = hash === row.passwordHash;
  return { ok: match, id: match ? row.id : undefined };
}

export async function getUserById(env: Env, id: string) {
  const db = drizzle((env as any).D1 as D1Database);
  const rows = await db
    .select({
      id: users.id,
      username: users.username,
      profile: users.profile,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  const user = rows[0];
  if (!user) return null;
  return { ...user, profile: safeParse(user.profile) };
}

// Page Config Database Functions
export type PageConfigData = {
  config: any;
  pageName: string;
  isPublish?: boolean;
  metadata?: any;
};

export async function savePageConfig(
  env: Env,
  userId: string,
  data: PageConfigData
) {
  const db = drizzle((env as any).D1 as D1Database);
  const id = crypto.randomUUID();
  const now = Date.now();

  try {
    // Upsert on (page_name, user_id)
    await db
      .insert(pageConfigs)
      .values({
        id,
        pageName: data.pageName,
        configData: JSON.stringify(data.config),
        metadata: JSON.stringify(data.metadata || {}),
        userId,
        isPublished: !!data.isPublish,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [pageConfigs.pageName, pageConfigs.userId],
        set: {
          configData: JSON.stringify(data.config),
          metadata: JSON.stringify(data.metadata || {}),
          isPublished: !!data.isPublish,
          updatedAt: now,
        },
      });

    return { ok: true, id };
  } catch (error) {
    console.error("Error saving page config:", error);
    return { ok: false, error: "Failed to save config" };
  }
}

export async function getPageConfig(
  env: Env,
  userId: string,
  pageName: string
) {
  const db = drizzle((env as any).D1 as D1Database);

  try {
    const rows = await db
      .select({
        configData: pageConfigs.configData,
        metadata: pageConfigs.metadata,
        isPublished: pageConfigs.isPublished,
        createdAt: pageConfigs.createdAt,
        updatedAt: pageConfigs.updatedAt,
      })
      .from(pageConfigs)
      .where(
        and(eq(pageConfigs.pageName, pageName), eq(pageConfigs.userId, userId))
      )
      .orderBy(desc(pageConfigs.updatedAt))
      .limit(1);

    const row = rows[0];
    if (!row) {
      return { ok: false, error: "Config not found" };
    }

    return {
      ok: true,
      config: safeParse(row.configData),
      metadata: safeParse(row.metadata),
      isPublished: !!row.isPublished,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  } catch (error) {
    console.error("Error getting page config:", error);
    return { ok: false, error: "Failed to get config" };
  }
}

export async function getPublishedPageConfig(env: Env, pageName: string) {
  const db = drizzle((env as any).D1 as D1Database);

  try {
    const rows = await db
      .select({
        configData: pageConfigs.configData,
        metadata: pageConfigs.metadata,
        userId: pageConfigs.userId,
        createdAt: pageConfigs.createdAt,
        updatedAt: pageConfigs.updatedAt,
      })
      .from(pageConfigs)
      .where(
        and(
          eq(pageConfigs.pageName, pageName),
          eq(pageConfigs.isPublished, true)
        )
      )
      .orderBy(desc(pageConfigs.updatedAt))
      .limit(1);

    const row = rows[0];
    if (!row) {
      return { ok: false, error: "Published config not found" };
    }

    return {
      ok: true,
      config: safeParse(row.configData),
      metadata: safeParse(row.metadata),
      userId: row.userId!,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  } catch (error) {
    console.error("Error getting published page config:", error);
    return { ok: false, error: "Failed to get published config" };
  }
}

function safeParse(s: string | null | undefined) {
  if (!s) return {};
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
