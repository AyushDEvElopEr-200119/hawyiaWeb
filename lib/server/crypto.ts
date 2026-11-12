import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { ConfigError } from "./errors";

/** An encrypted value as stored in the database: AES-256-GCM, all parts base64. */
export type Sealed = { iv: string; tag: string; data: string };

/** The 32-byte key comes only from EMAIL_SECRET_KEY (base64 or hex), never from the database. */
function key() {
  const raw = process.env.EMAIL_SECRET_KEY?.trim();
  if (!raw) throw new ConfigError("EMAIL_SECRET_KEY is not set, so secrets can't be stored safely.");
  const buf = /^[0-9a-f]{64}$/i.test(raw) ? Buffer.from(raw, "hex") : Buffer.from(raw, "base64");
  if (buf.length !== 32) throw new ConfigError("EMAIL_SECRET_KEY must be 32 bytes (64 hex characters or 44 base64 characters).");
  return buf;
}

export function seal(plain: string): Sealed {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return { iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: data.toString("base64") };
}

export function unseal(s: Sealed): string {
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(s.iv, "base64"));
  decipher.setAuthTag(Buffer.from(s.tag, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(s.data, "base64")), decipher.final()]).toString("utf8");
}

/** A short, non-reversible fingerprint (for caches), never the secret itself. */
export const fingerprint = (v: string) => createHash("sha256").update(v).digest("hex").slice(0, 16);
