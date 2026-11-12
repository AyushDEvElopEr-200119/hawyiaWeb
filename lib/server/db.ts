import "server-only";
import { Pool, type QueryResultRow } from "pg";
import { ConfigError } from "./errors";
import { SCHEMA_SQL } from "./schema";

/**
 * PostgreSQL storage for email settings, templates, logs, the audit trail and rate limits.
 * Works with any PostgreSQL 13+ host (Neon, Supabase, Azure, AWS RDS, a self-hosted server…):
 * set DATABASE_URL, e.g. postgres://user:pass@host:5432/hawyia?sslmode=require
 * Without it, email still sends (settings from the environment) but nothing is stored.
 */
export const dbConfigured = () => !!process.env.DATABASE_URL?.trim();

// One pool per server instance, reused across requests and hot reloads; small, because serverless
// functions each hold their own pool.
const cache = globalThis as unknown as { __hawyiaPg?: { pool?: Pool; ready?: Promise<void> } };

function pool() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new ConfigError("The database isn't connected yet. Add DATABASE_URL to the environment.");
  const c = (cache.__hawyiaPg ??= {});
  if (!c.pool) {
    // DATABASE_SSL=false turns TLS off (a database on the same server); otherwise sslmode in the URL decides
    const ssl = process.env.DATABASE_SSL?.trim().toLowerCase() === "false" ? false : undefined;
    c.pool = new Pool({ connectionString: url, max: Number(process.env.DATABASE_POOL_MAX) || 5, connectionTimeoutMillis: 8000, idleTimeoutMillis: 30_000, ...(ssl === false && { ssl }) });
    c.pool.on("error", (error) => console.error("Database pool error:", error.message));
  }
  return c;
}

/** Creates the tables on first use (idempotent: CREATE … IF NOT EXISTS). */
async function ready() {
  const c = pool();
  c.ready ??= c.pool!.query(SCHEMA_SQL).then(() => undefined);
  try {
    await c.ready;
  } catch (error) {
    c.ready = undefined;
    throw new ConfigError(`Couldn't connect to the database: ${(error as Error).message.split("\n")[0]}`);
  }
  return c.pool!;
}

/** Runs one parameterised query and returns its rows. */
export async function sql<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<T[]> {
  const p = await ready();
  return (await p.query<T>(text, params)).rows;
}

/** Postgres ids are bigint; anything else can't exist, so it's treated as not found. */
export const isId = (id: string) => /^\d{1,18}$/.test(id);
