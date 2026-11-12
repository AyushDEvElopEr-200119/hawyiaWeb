import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { audit } from "@/lib/server/audit";
import { finishLogin, STATE_COOKIE } from "@/lib/server/oidc";
import { clientIp } from "@/lib/server/rateLimit";
import { adminEmails, SESSION_COOKIE, SESSION_HOURS, signSession } from "@/lib/server/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET /api/admin/auth/callback/: Microsoft returns here; we verify the account and start a session. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const back = (error: string) => {
    const res = NextResponse.redirect(new URL(`/admin/login/?error=${encodeURIComponent(error)}`, request.url));
    res.cookies.delete({ name: STATE_COOKIE, path: "/api/admin/auth/" });
    return res;
  };
  if (url.searchParams.get("error")) return back(url.searchParams.get("error_description")?.split("\n")[0] || "Sign-in was cancelled.");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) return back("Sign-in response was incomplete. Please try again.");

  try {
    const { email, name, returnTo } = await finishLogin(request, code, state, (await cookies()).get(STATE_COOKIE)?.value);
    if (!adminEmails().includes(email)) {
      await audit(email, "admin.login.refused", "", [], clientIp(request));
      return back(`${email} isn't allowed to use the admin dashboard. Ask an administrator to add it to ADMIN_EMAILS.`);
    }
    const token = await signSession({ email, name, role: "admin" });
    await audit(email, "admin.login", "", [], clientIp(request));
    const res = NextResponse.redirect(new URL(returnTo, request.url));
    res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, secure: url.protocol === "https:", sameSite: "lax", path: "/", maxAge: SESSION_HOURS * 3600 });
    res.cookies.delete({ name: STATE_COOKIE, path: "/api/admin/auth/" });
    return res;
  } catch (error) {
    return back((error as Error).message);
  }
}
