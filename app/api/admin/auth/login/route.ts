import { NextResponse } from "next/server";
import { startLogin, STATE_COOKIE } from "@/lib/server/oidc";
import { clientIp, rateLimit } from "@/lib/server/rateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const safeReturn = (v: string | null) => (v && /^\/admin(\/[\w\-/]*)?$/.test(v) ? v : "/admin/");

/** GET /api/admin/auth/login/: sends the browser to Microsoft to sign in. */
export async function GET(request: Request) {
  const back = (error: string) => NextResponse.redirect(new URL(`/admin/login/?error=${encodeURIComponent(error)}`, request.url));
  try {
    await rateLimit(`login:${clientIp(request)}`, 20, 600);
    const { url, cookie } = await startLogin(request, safeReturn(new URL(request.url).searchParams.get("next")));
    const res = NextResponse.redirect(url);
    res.cookies.set(STATE_COOKIE, cookie, { httpOnly: true, secure: url.startsWith("https") && !request.url.startsWith("http://localhost"), sameSite: "lax", path: "/api/admin/auth/", maxAge: 600 });
    return res;
  } catch (error) {
    return back((error as Error).message);
  }
}
