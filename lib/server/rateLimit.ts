import "server-only";
import { dbConfigured, sql } from "./db";
import { RateLimitError } from "./errors";

// Used only when there is no database (one server instance): better than no limit at all.
const memory = new Map<string, { count: number; expires: number }>();

/** Allows `limit` calls per `windowSeconds` for a key, shared across instances via PostgreSQL. */
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
  // one atomic upsert: count up inside the window, start a new window once it has expired
  const [row] = await sql<{ count: number }>(
    `INSERT INTO rate_limits (key, count, expires_at) VALUES ($1, 1, now() + make_interval(secs => $2))
     ON CONFLICT (key) DO UPDATE SET
       count = CASE WHEN rate_limits.expires_at > now() THEN rate_limits.count + 1 ELSE 1 END,
       expires_at = CASE WHEN rate_limits.expires_at > now() THEN rate_limits.expires_at ELSE EXCLUDED.expires_at END
     RETURNING count`,
    [key, windowSeconds],
  );
  // now and then, clear out old windows
  if (Math.random() < 0.02) sql("DELETE FROM rate_limits WHERE expires_at < now() - interval '1 day'").catch(() => {});
  if (row.count > limit) throw new RateLimitError();
}

/** The caller's address, as forwarded by the host (Vercel, nginx…). */
export const clientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "local";
