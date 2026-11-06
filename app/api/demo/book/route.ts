import { NextResponse } from "next/server";
import { bookingConfigured, teamEmails } from "@/lib/demo/config";
import { emailCustomer, emailTeam, type Booking } from "@/lib/demo/emails";
import { busyPeriods, createMeeting, SlotTakenError } from "@/lib/demo/google-calendar";
import { candidateSlots, DEMO, freeSlots, slotEnd } from "@/lib/demo/slots";
import { asLocale, tr } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const validTimeZone = (zone: string) => {
  try { new Intl.DateTimeFormat("en", { timeZone: zone }); return !!zone; } catch { return false; }
};

/** Books a demo: checks the slot is still free, creates the meeting, then emails everyone. */
export async function POST(request: Request) {
  const body: Record<string, unknown> = await request.json().catch(() => ({}));
  const field = (name: string, max = 200) => (typeof body[name] === "string" ? (body[name] as string).trim().slice(0, max) : "");
  const lang = asLocale(field("lang"));
  const fail = (message: string, status: number) => NextResponse.json({ message: tr(lang, message) }, { status });

  if (!bookingConfigured()) return fail("Online booking isn't available right now. Please email us.", 503);

  const name = field("name");
  const email = field("email");
  const start = new Date(field("slot"));
  // bots fill in the hidden "website" field
  if (field("website") || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Please check your details and try again.", 400);
  // only real slots: this also limits how many emails anyone can make this send
  if (!candidateSlots().some((s) => s.getTime() === start.getTime())) return fail("That time has just been taken. Please choose another.", 409);

  try {
    const busy = await busyPeriods(start, slotEnd(start));
    if (!freeSlots([start], busy).length) return fail("That time has just been taken. Please choose another.", 409);

    const details: [string, string][] = [
      ["Company", field("company")],
      ["Country", field("country")],
      ["Phone", field("phone")],
      ["Business type", field("business")],
      ["Needs", field("need")],
      ["Timeline", field("timeline")],
      ["Requirements", field("message", 2000)],
      ["Customer's language", lang],
    ];
    const team = teamEmails();
    const { meetLink } = await createMeeting({
      start,
      summary: `Hawyia demo: ${field("company") || name}`,
      description: [["Name", name], ["Email", email], ...details].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n"),
      attendees: [email, ...team],
    });

    const booking: Booking = { start, meetLink, lang, name, email, details, timeZone: validTimeZone(field("timeZone")) ? field("timeZone") : DEMO.timeZone };
    // The meeting exists by now, so a failed email must not read as a failed booking.
    const [customer, staff] = await Promise.allSettled([emailCustomer(booking, team[0]), emailTeam(booking, team)]);
    for (const sent of [customer, staff]) if (sent.status === "rejected") console.error("Demo email failed:", sent.reason);

    return NextResponse.json({ meetLink, slot: start.toISOString(), emailed: customer.status === "fulfilled" });
  } catch (error) {
    if (error instanceof SlotTakenError) return fail("That time has just been taken. Please choose another.", 409);
    console.error("Demo booking failed:", error);
    return fail("We couldn't book your demo. Please try again, or email us directly.", 502);
  }
}
