import { NextResponse } from "next/server";
import { asLocale, tr } from "@/lib/i18n";
import { clientIp, rateLimit } from "@/lib/server/rateLimit";
import { RateLimitError } from "@/lib/server/errors";
import { getEffectiveConfig, sendEmail } from "@/lib/server/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const escapeHtml = (v: string) => v.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * The website's enquiry forms. Emails the team (templates: contact_form_notification) with every
 * field, replies going straight to the visitor, and sends the visitor a confirmation
 * (contact_acknowledgement / _ar). Everything goes through Microsoft 365 via lib/server/email and
 * is recorded in Email Logs, where a failed send can be retried.
 */
export async function POST(request: Request) {
  const body: Record<string, unknown> = await request.json().catch(() => ({}));
  const field = (name: string, max = 200) => (typeof body[name] === "string" ? (body[name] as string).trim().slice(0, max) : "");
  const lang = asLocale(field("lang"));
  const fail = (message: string, status: number) => NextResponse.json({ message: tr(lang, message) }, { status });

  const name = field("name");
  const email = field("email");
  // bots fill in hidden fields; people don't
  if (field("website") || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Please check your details and try again.", 400);
  try {
    await rateLimit(`contact:${clientIp(request)}`, 5, 600);
  } catch (error) {
    if (error instanceof RateLimitError) return fail("Too many requests. Please try again in a few minutes.", 429);
    throw error;
  }

  const rows = ([
    ["Name", name],
    ["Email", email],
    ["Company", field("company")],
    ["Country", field("country")],
    ["Phone / WhatsApp", field("phone")],
    ["Business type", field("business")],
    ["Needs", field("need")],
    ["Timeline", field("timeline")],
    ["Requirements", field("message", 4000)],
    ["Page", field("page")],
    ["Language", lang],
  ] as [string, string][]).filter(([, v]) => v);

  const detailsHtml = rows
    .map(([k, v]) => `<tr><td valign="top" style="color:#556070;white-space:nowrap"><b>${escapeHtml(k)}</b></td><td>${escapeHtml(v).replace(/\n/g, "<br />")}</td></tr>`)
    .join("");
  const detailsText = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const cfg = await getEffectiveConfig();
  const team = await sendEmail({
    to: cfg.notifyEmails,
    replyTo: email,
    template: "contact_form_notification",
    variables: { name, email, company: field("company") || name, detailsHtml, detailsText, page: field("page") },
    source: `form:${field("page") || "contact"}`,
  });
  if (!team.ok) {
    // kept in Email Logs (when the database is connected) so it can be retried; also in the server log
    console.error("Contact enquiry not delivered:", JSON.stringify(Object.fromEntries(rows)));
    return fail("Something went wrong. Please try again, or email us directly.", 502);
  }

  // a courtesy; the enquiry itself has been delivered
  await sendEmail({
    to: email,
    replyTo: cfg.senderEmail,
    template: lang === "ar" ? "contact_acknowledgement_ar" : "contact_acknowledgement",
    variables: { name },
    source: "form:acknowledgement",
  });
  return NextResponse.json({ ok: true });
}
