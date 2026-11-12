import { NextResponse, type NextRequest } from "next/server";
import { adminEmails, readSession, SESSION_COOKIE } from "@/lib/server/session";

/**
 * Guards the admin dashboard: anyone without a valid admin session is sent to /admin/login/.
 * (The admin API routes check the session themselves and answer 401.)
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin/login")) return NextResponse.next();
  const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (session && adminEmails().includes(session.email.toLowerCase())) return NextResponse.next();
  const login = new URL("/admin/login/", request.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
