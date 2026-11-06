import { NextResponse } from "next/server";
import { bookingConfigured } from "@/lib/demo/config";
import { busyPeriods } from "@/lib/demo/google-calendar";
import { candidateSlots, freeSlots, slotEnd } from "@/lib/demo/slots";

export const dynamic = "force-dynamic";

/** The demo times still free. Only the times leave here, never what's on the team's calendar. */
export async function GET() {
  if (!bookingConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  try {
    const slots = candidateSlots();
    if (!slots.length) return NextResponse.json({ slots: [] });
    const busy = await busyPeriods(slots[0], slotEnd(slots[slots.length - 1]));
    return NextResponse.json({ slots: freeSlots(slots, busy) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Demo slots failed:", error);
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }
}
