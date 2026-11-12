import "server-only";
import mongoose from "mongoose";
import { ConfigError } from "./errors";

/** True when MONGODB_URI is set. Without it, email still sends (from .env.local) but nothing is stored. */
export const dbConfigured = () => !!process.env.MONGODB_URI?.trim();

// One connection per server instance, reused across requests (and across hot reloads in dev).
const cache = globalThis as unknown as { __hawyiaMongo?: { conn?: typeof mongoose; promise?: Promise<typeof mongoose> } };

export async function db() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new ConfigError("The database isn't connected yet. Add MONGODB_URI to the environment.");
  const c = (cache.__hawyiaMongo ??= {});
  if (c.conn) return c.conn;
  c.promise ??= mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB?.trim() || "hawyia",
    bufferCommands: false,
    serverSelectionTimeoutMS: 8000,
  });
  try {
    c.conn = await c.promise;
  } catch (error) {
    c.promise = undefined;
    throw new ConfigError(`Couldn't connect to the database: ${(error as Error).message.split("\n")[0]}`);
  }
  return c.conn;
}
