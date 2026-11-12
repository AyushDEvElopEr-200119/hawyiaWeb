import "server-only";
import { db, dbConfigured } from "./db";
import { RateLimitError } from "./errors";
import { RateLimit } from "./models";

// Used only when there is no database (one server instance): better than no limit at all.
const memory = new Map<string, { count: number; expires: number }>();

/** Allows `limit` calls per `windowSeconds` for a key, shared across instances via MongoDB. */
export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const now = Date.now();
  if (!dbConfigured()) {
    const hit = memory.get(key);
    const entry = hit && hit.expires > now ? hit : { count: 0, expires: now + windowSeconds * 1000 };
    entry.count++;
    memory.set(key, entry);
    if (entry.count > limit) throw new RateLimitError();
    return;
  }
  await db();
  const expiresAt = new Date(now + windowSeconds * 1000);
  const doc = await RateLimit.findOneAndUpdate(
    { key, expiresAt: { $gt: new Date(now) } },
    { $inc: { count: 1 } },
    { new: true },
  );
  if (!doc) {
    await RateLimit.findOneAndUpdate({ key }, { $set: { count: 1, expiresAt } }, { upsert: true });
    return;
  }
  if (doc.count > limit) throw new RateLimitError();
}

/** The caller's address, as forwarded by Vercel. */
export const clientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "local";
