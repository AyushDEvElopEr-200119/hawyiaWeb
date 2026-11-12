// The two confirmation emails, sent through Resend: one for the customer in their language and
// time zone, one for the team in English and Oman time.
import { tr, type Locale } from "@/lib/i18n";
import { mailConfigured } from "@/lib/mail-config";
import { sendEmail } from "@/lib/server/email";
import { DEMO, slotEnd } from "./slots";

export type Booking = {
  start: Date;
  meetLink: string;
  lang: Locale;
  timeZone: string;
  name: string;
  email: string;
  /** Everything else from the form, as label and value, for the team. */
  details: [string, string][];
};

const escapeHtml = (v: string) => v.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function when(start: Date, lang: Locale, timeZone: string) {
  const date = new Intl.DateTimeFormat(lang, { dateStyle: "full", timeZone }).format(start);
  const time = new Intl.DateTimeFormat(lang, { timeStyle: "short", timeZone }).format(start);
  return `${date}, ${time} (${timeZone})`;
}

/** A calendar file, so the meeting can be added to any calendar app. */
function calendarFile({ start, meetLink, name }: Booking) {
  const stamp = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
  const text = (v: string) => v.replace(/[\\;,]/g, "\\$&").replace(/\r?\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Hawyia//Demo booking//EN", "METHOD:PUBLISH", "BEGIN:VEVENT",
    `UID:demo-${start.getTime()}@hawyiapremium.com`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(slotEnd(start))}`,
    `SUMMARY:${text(`Hawyia demo with ${name}`)}`, `LOCATION:${text(meetLink)}`, `URL:${meetLink}`, `DESCRIPTION:${text(`Join with Google Meet: ${meetLink}`)}`,
    "END:VEVENT", "END:VCALENDAR", "",
  ].join("\r\n");
}

async function send(message: { to: string[]; replyTo: string; subject: string; html: string; text: string; ics: string }) {
  // Microsoft 365 (lib/server/email, logged in Email Logs) when it's configured; Resend only on
  // deployments that have no Microsoft 365 settings at all. Never one as a fallback for the other.
  if (mailConfigured()) {
    const result = await sendEmail({
      to: message.to, replyTo: message.replyTo, subject: message.subject, html: message.html, text: message.text, source: "demo-booking",
      attachments: [{ filename: "hawyia-demo.ics", content: message.ics, contentType: "text/calendar; charset=utf-8; method=PUBLISH" }],
    });
    if (!result.ok) throw new Error(`${result.status}: ${result.error}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.DEMO_EMAIL_FROM,
      to: message.to,
      reply_to: message.replyTo,
      subject: message.subject,
      html: message.html,
      text: message.text,
      attachments: [{ filename: "hawyia-demo.ics", content: Buffer.from(message.ics).toString("base64") }],
    }),
  });
  if (!res.ok) throw new Error(`Resend failed: ${res.status} ${await res.text()}`);
}

const shell = (lang: Locale, body: string) =>
  `<div lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#0b1020;max-width:560px">${body}</div>`;
const button = (href: string, label: string) =>
  `<p><a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 22px;border-radius:99px;background:#fdc12a;color:#0b1020;font-weight:600;text-decoration:none">${escapeHtml(label)}</a></p>`;

export function emailCustomer(b: Booking, teamEmail: string) {
  const t = (s: string) => tr(b.lang, s);
  const time = when(b.start, b.lang, b.timeZone);
  const lines = {
    intro: t("Thanks for your request. Here are your meeting details."),
    whenLabel: t("Date and time"),
    join: t("Join with Google Meet"),
    change: t("Need to change the time? Reply to this email and we'll help."),
    file: t("The attached calendar file adds this meeting to your calendar."),
  };
  return send({
    to: [b.email],
    replyTo: teamEmail,
    subject: t("Your Hawyia demo is booked"),
    ics: calendarFile(b),
    text: [b.name, lines.intro, `${lines.whenLabel}: ${time}`, `${lines.join}: ${b.meetLink}`, lines.file, lines.change].join("\n\n"),
    html: shell(b.lang, `
      <p><b>${escapeHtml(b.name)}</b></p>
      <p>${escapeHtml(lines.intro)}</p>
      <p><b>${escapeHtml(lines.whenLabel)}</b><br />${escapeHtml(time)}</p>
      ${button(b.meetLink, lines.join)}
      <p>${escapeHtml(lines.file)}</p>
      <p>${escapeHtml(lines.change)}</p>`),
  });
}

export function emailTeam(b: Booking, team: string[]) {
  const time = when(b.start, "en", DEMO.timeZone);
  const rows: [string, string][] = [["Name", b.name], ["Email", b.email], ...b.details.filter(([, v]) => v)];
  return send({
    to: team,
    replyTo: b.email,
    subject: `New demo booked: ${b.name}, ${time}`,
    ics: calendarFile(b),
    text: [`When: ${time}`, `Join: ${b.meetLink}`, ...rows.map(([k, v]) => `${k}: ${v}`)].join("\n"),
    html: shell("en", `
      <p><b>A new demo has been booked.</b></p>
      <p><b>When</b><br />${escapeHtml(time)}</p>
      ${button(b.meetLink, "Join with Google Meet")}
      <table cellpadding="4" style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td valign="top"><b>${escapeHtml(k)}</b></td><td>${escapeHtml(v).replace(/\n/g, "<br />")}</td></tr>`).join("")}</table>`),
  });
}
