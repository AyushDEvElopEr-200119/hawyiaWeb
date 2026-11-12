import { adminRoute, jsonBody, ok } from "@/lib/server/api";
import { ValidationError } from "@/lib/server/errors";
import { sendEmail } from "@/lib/server/email";
import { rateLimit } from "@/lib/server/rateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const escapeHtml = (v: string) => v.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** POST /api/admin/email/send-test: sends a real email through Microsoft 365. Limited to 5 per 10 minutes. */
export const POST = adminRoute(async ({ request, admin }) => {
  await rateLimit(`send-test:${admin.email}`, 5, 600);
  const body = await jsonBody(request);
  const to = typeof body.to === "string" ? body.to.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim().slice(0, 200) : "";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 5000) : "";
  const errors: Record<string, string> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) errors.to = "Enter a valid email address.";
  if (!subject) errors.subject = "Subject is required.";
  if (!message) errors.message = "Message is required.";
  if (Object.keys(errors).length) throw new ValidationError("Please fix the highlighted fields.", errors);

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#0b1020">${escapeHtml(message).replace(/\n/g, "<br />")}<p style="color:#556070;font-size:12px;margin-top:24px">Test email sent by ${escapeHtml(admin.email)} from the Hawyia admin dashboard.</p></div>`;
  const result = await sendEmail({ to, subject, html, text: `${message}\n\n— Test email sent by ${admin.email} from the Hawyia admin dashboard.`, source: "admin:test" });
  return ok({ result });
});
