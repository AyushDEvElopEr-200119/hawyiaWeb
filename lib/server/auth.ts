import "server-only";
import { cookies } from "next/headers";
import { AuthError } from "./errors";
import { adminEmails, readSession, SESSION_COOKIE, type AdminSession } from "./session";

export async function currentAdmin(): Promise<AdminSession | null> {
  const session = await readSession((await cookies()).get(SESSION_COOKIE)?.value);
  // access is re-checked on every request, so removing someone from ADMIN_EMAILS takes effect at once
  if (!session || !adminEmails().includes(session.email.toLowerCase())) return null;
  return session;
}

/** Throws 401 unless the request comes from a signed-in administrator. */
export async function requireAdmin(): Promise<AdminSession> {
  const admin = await currentAdmin();
  if (!admin) throw new AuthError();
  return admin;
}
