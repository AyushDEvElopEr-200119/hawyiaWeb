import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/server/session";

export const dynamic = "force-dynamic";

/** POST /api/admin/auth/logout/: ends the admin session. */
export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL("/admin/login/?signedOut=1", request.url), 303);
  res.cookies.delete({ name: SESSION_COOKIE, path: "/" });
  return res;
}
