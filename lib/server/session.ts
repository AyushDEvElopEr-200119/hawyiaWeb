// Admin session cookie: a short-lived signed JWT. No server-only marker, because proxy.ts reads it too.
import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "hw_admin";
export const SESSION_HOURS = 8;

export type AdminSession = { email: string; name: string; role: "admin" };

const secret = () => {
  const s = process.env.ADMIN_SESSION_SECRET?.trim();
  return s && s.length >= 32 ? new TextEncoder().encode(s) : null;
};

export async function signSession(s: AdminSession) {
  const key = secret();
  if (!key) throw new Error("ADMIN_SESSION_SECRET is missing or shorter than 32 characters.");
  return new SignJWT({ name: s.name, role: s.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(s.email)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .setAudience("hawyia-admin")
    .sign(key);
}

export async function readSession(token: string | undefined): Promise<AdminSession | null> {
  const key = secret();
  if (!token || !key) return null;
  try {
    const { payload } = await jwtVerify(token, key, { audience: "hawyia-admin", algorithms: ["HS256"] });
    if (payload.role !== "admin" || typeof payload.sub !== "string") return null;
    return { email: payload.sub, name: String(payload.name ?? payload.sub), role: "admin" };
  } catch {
    return null;
  }
}

/** Who may administer the site: comma-separated ADMIN_EMAILS (case-insensitive). */
export const adminEmails = () =>
  (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
