import { NextResponse } from "next/server";
import { processDueRetries } from "@/lib/server/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Called by Vercel Cron (vercel.json). Vercel sends "Authorization: Bearer <CRON_SECRET>". */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json({ ok: true, data: await processDueRetries() });
  } catch (error) {
    console.error("Email retry cron failed:", (error as Error).message);
    return NextResponse.json({ ok: false, error: "Retry run failed." }, { status: 500 });
  }
}
