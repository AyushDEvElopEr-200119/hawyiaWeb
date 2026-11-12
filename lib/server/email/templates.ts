import "server-only";
import { audit } from "../audit";
import { dbConfigured, isId, sql } from "../db";
import { ConfigError, HttpError, ValidationError } from "../errors";

export type TemplateData = {
  key: string; name: string; description: string; subject: string; html: string; text: string;
  variables: string[]; enabled: boolean; system: boolean;
};
export type TemplateView = TemplateData & { id: string; updatedAt: string | null; updatedBy: string };

/* ---------------- rendering ---------------- */
const escapeHtml = (v: string) => v.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const lookup = (vars: Record<string, unknown>, name: string) => {
  const v = vars[name];
  return v === undefined || v === null ? "" : String(v);
};

/** {{name}} is escaped in HTML; {{{name}}} inserts trusted HTML as is; subjects and text are plain. */
export function render(t: Pick<TemplateData, "subject" | "html" | "text">, vars: Record<string, unknown>) {
  const plain = (s: string) => s.replace(/\{\{\{?\s*([\w.]+)\s*\}?\}\}/g, (_, n) => lookup(vars, n));
  return {
    subject: plain(t.subject).replace(/[\r\n]+/g, " ").slice(0, 250),
    html: t.html
      .replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (_, n) => lookup(vars, n))
      .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, n) => escapeHtml(lookup(vars, n))),
    text: plain(t.text || t.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()),
  };
}

/** The variables a template uses, found in its subject, HTML and text. */
export const findVariables = (t: Pick<TemplateData, "subject" | "html" | "text">) =>
  [...new Set([...`${t.subject} ${t.html} ${t.text}`.matchAll(/\{\{\{?\s*([\w.]+)\s*\}?\}\}/g)].map((m) => m[1]))];

/* ---------------- built-in templates ---------------- */
const layout = (heading: string, body: string, dir: "ltr" | "rtl" = "ltr") => `<!doctype html>
<html><body style="margin:0;background:#f4f6fb;padding:24px 12px">
<div dir="${dir}" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:#0b1020;font-size:15px;line-height:1.6">
  <div style="background:#0a2463;padding:20px 28px"><span style="color:#ffffff;font-size:18px;font-weight:700">Hawyia</span> <span style="color:#fbb31c;font-size:18px;font-weight:700">Premium</span></div>
  <div style="padding:28px">
    <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3">${heading}</h1>
${body}
  </div>
  <div style="padding:16px 28px;background:#f4f6fb;color:#556070;font-size:12px">Hawyia Premium · info@hawyiapremium.com</div>
</div></body></html>`;
const btn = (href: string, label: string) =>
  `    <p><a href="${href}" style="display:inline-block;padding:12px 22px;border-radius:99px;background:#fbb31c;color:#0b1020;font-weight:700;text-decoration:none">${label}</a></p>`;

const d = (key: string, name: string, description: string, subject: string, body: string, text: string, heading = subject, dir: "ltr" | "rtl" = "ltr"): TemplateData => {
  const html = layout(heading, body, dir);
  return { key, name, description, subject, html, text, variables: findVariables({ subject, html, text }), enabled: true, system: true };
};

export const DEFAULT_TEMPLATES: TemplateData[] = [
  d("welcome", "Welcome Email", "Sent when a new account is created.", "Welcome to Hawyia Premium, {{name}}",
    `    <p>Hi {{name}},</p>\n    <p>Welcome aboard. Your account is ready, and we're glad to have you with us.</p>\n${btn("{{loginLink}}", "Sign in")}`,
    "Hi {{name}},\n\nWelcome aboard. Your account is ready.\nSign in: {{loginLink}}", "Welcome, {{name}}"),
  d("otp_verification", "OTP Verification", "One-time code for sign-in or verification.", "Your Hawyia verification code: {{otp}}",
    `    <p>Hi {{name}},</p>\n    <p>Your verification code is:</p>\n    <p style="font-size:30px;font-weight:700;letter-spacing:6px;margin:8px 0 16px">{{otp}}</p>\n    <p style="color:#556070">It expires in {{minutes}} minutes. If you didn't ask for it, you can ignore this email.</p>`,
    "Hi {{name}},\n\nYour verification code is {{otp}}. It expires in {{minutes}} minutes.", "Your verification code"),
  d("forgot_password", "Forgot Password", "Password reset link.", "Reset your Hawyia password",
    `    <p>Hi {{name}},</p>\n    <p>We received a request to reset your password. The link below works for {{minutes}} minutes.</p>\n${btn("{{resetLink}}", "Reset password")}\n    <p style="color:#556070">If you didn't ask for this, no action is needed.</p>`,
    "Hi {{name}},\n\nReset your password (valid {{minutes}} minutes): {{resetLink}}", "Reset your password"),
  d("account_activation", "Account Activation", "Confirms a new account's email address.", "Activate your Hawyia account",
    `    <p>Hi {{name}},</p>\n    <p>Please confirm your email address to activate your account.</p>\n${btn("{{activationLink}}", "Activate account")}`,
    "Hi {{name}},\n\nActivate your account: {{activationLink}}", "Activate your account"),
  d("order_confirmation", "Order Confirmation", "Confirms an order.", "Order {{orderId}} confirmed",
    `    <p>Hi {{name}},</p>\n    <p>Thank you for your order. Here are the details:</p>\n    <p><b>Order:</b> {{orderId}}<br /><b>Total:</b> {{total}}</p>`,
    "Hi {{name}},\n\nYour order {{orderId}} is confirmed. Total: {{total}}.", "Your order is confirmed"),
  d("payment_confirmation", "Payment Confirmation", "Confirms a payment.", "Payment received for {{orderId}}",
    `    <p>Hi {{name}},</p>\n    <p>We've received your payment.</p>\n    <p><b>Reference:</b> {{orderId}}<br /><b>Amount:</b> {{amount}}<br /><b>Method:</b> {{paymentMethod}}</p>`,
    "Hi {{name}},\n\nPayment received for {{orderId}}: {{amount}} by {{paymentMethod}}.", "Payment received"),
  d("invoice", "Invoice Email", "Sends an invoice.", "Invoice {{invoiceNumber}} from Hawyia Premium",
    `    <p>Hi {{name}},</p>\n    <p>Your invoice is ready.</p>\n    <p><b>Invoice:</b> {{invoiceNumber}}<br /><b>Amount:</b> {{amount}}<br /><b>Due:</b> {{dueDate}}</p>\n${btn("{{invoiceLink}}", "View invoice")}`,
    "Hi {{name}},\n\nInvoice {{invoiceNumber}}: {{amount}}, due {{dueDate}}.\n{{invoiceLink}}", "Your invoice"),
  d("contact_form_notification", "Contact Form Notification", "Sent to the team when someone submits a website form.", "Website enquiry: {{company}}",
    `    <p>A new enquiry arrived from the website. Reply to this email to answer {{name}} directly.</p>\n    <table cellpadding="6" style="border-collapse:collapse;width:100%">{{{detailsHtml}}}</table>`,
    "New website enquiry\n\n{{detailsText}}", "New website enquiry"),
  d("contact_acknowledgement", "Contact Form Confirmation (English)", "Sent to the visitor after they submit a form.", "We've received your message",
    `    <p>Hi {{name}},</p>\n    <p>Thanks for contacting Hawyia Premium. We've received your message and a specialist will reply within one business day.</p>\n    <p>If you need to add anything, just reply to this email.</p>\n    <p>— The Hawyia Premium team</p>`,
    "Hi {{name}},\n\nThanks for contacting Hawyia Premium. We've received your message and a specialist will reply within one business day.\n\nIf you need to add anything, just reply to this email.\n\n— The Hawyia Premium team",
    "Thanks for getting in touch"),
  d("contact_acknowledgement_ar", "Contact Form Confirmation (Arabic)", "Sent to visitors who used the Arabic site.", "تلقّينا رسالتك",
    `    <p>مرحبًا {{name}}،</p>\n    <p>شكرًا لتواصلك مع هاوية بريميوم. تلقّينا رسالتك وسيرد عليك أحد المختصين خلال يوم عمل واحد.</p>\n    <p>إذا أردت إضافة أي شيء، فقط رد على هذه الرسالة.</p>\n    <p>— فريق هاوية بريميوم</p>`,
    "مرحبًا {{name}}،\n\nشكرًا لتواصلك مع هاوية بريميوم. تلقّينا رسالتك وسيرد عليك أحد المختصين خلال يوم عمل واحد.\n\n— فريق هاوية بريميوم",
    "شكرًا لتواصلك معنا", "rtl"),
  d("admin_notification", "Admin Notification", "Internal alerts for administrators.", "[Hawyia] {{title}}",
    `    <p>{{message}}</p>\n${btn("{{link}}", "Open")}`,
    "{{title}}\n\n{{message}}\n{{link}}", "{{title}}"),
];

const defaultFor = (key: string) => DEFAULT_TEMPLATES.find((t) => t.key === key);

/* ---------------- storage ---------------- */
type DbTemplate = {
  id: string; key: string; name: string; description: string; subject: string; html: string; text: string;
  variables: string[]; enabled: boolean; system: boolean; updated_by: string; updated_at: Date | null;
};
const view = (d: DbTemplate): TemplateView => ({
  id: String(d.id), key: d.key, name: d.name, description: d.description ?? "", subject: d.subject, html: d.html, text: d.text ?? "",
  variables: d.variables ?? [], enabled: !!d.enabled, system: !!d.system,
  updatedAt: d.updated_at ? new Date(d.updated_at).toISOString() : null, updatedBy: d.updated_by ?? "",
});

const insertTemplate = (t: TemplateData, actor: string) => sql<DbTemplate>(
  `INSERT INTO email_templates (key, name, description, subject, html, text, variables, enabled, system, updated_by)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (key) DO NOTHING RETURNING *`,
  [t.key, t.name, t.description, t.subject, t.html, t.text, t.variables, t.enabled, t.system, actor],
);

/** Adds any missing built-in templates (never overwrites edits). Runs once per server instance. */
const seeded = globalThis as unknown as { __hawyiaSeeded?: Promise<void> };
async function seed() {
  seeded.__hawyiaSeeded ??= (async () => {
    const existing = new Set((await sql<{ key: string }>("SELECT key FROM email_templates")).map((t) => t.key));
    for (const t of DEFAULT_TEMPLATES.filter((t) => !existing.has(t.key))) await insertTemplate(t, "built-in");
  })().catch((error) => { seeded.__hawyiaSeeded = undefined; throw error; });
  await seeded.__hawyiaSeeded;
}

async function findTemplate(id: string) {
  if (!isId(id)) return null;
  const [d] = await sql<DbTemplate>("SELECT * FROM email_templates WHERE id = $1", [id]);
  return d ?? null;
}

export async function listTemplates(): Promise<{ templates: TemplateView[]; stored: boolean }> {
  if (!dbConfigured()) return { templates: DEFAULT_TEMPLATES.map((t) => ({ ...t, id: t.key, updatedAt: null, updatedBy: "built-in" })), stored: false };
  await seed();
  const rows = await sql<DbTemplate>("SELECT * FROM email_templates ORDER BY system DESC, name ASC");
  return { templates: rows.map(view), stored: true };
}

/** The template to send with: the stored one when enabled; the built-in one when the database is unavailable. */
export async function templateForSending(key: string): Promise<{ template: TemplateData | null; note: string }> {
  if (dbConfigured()) {
    try {
      await seed();
      const [doc] = await sql<DbTemplate>("SELECT * FROM email_templates WHERE key = $1", [key]);
      if (doc) {
        if (!doc.enabled) return { template: null, note: `Template "${key}" is disabled.` };
        return { template: view(doc), note: "" };
      }
      const fallback = defaultFor(key);
      return fallback ? { template: fallback, note: `Template "${key}" was deleted; used the built-in version.` } : { template: null, note: `Template "${key}" doesn't exist.` };
    } catch (error) {
      const fallback = defaultFor(key);
      if (fallback) return { template: fallback, note: "Database unavailable; used the built-in template." };
      throw error;
    }
  }
  const fallback = defaultFor(key);
  return { template: fallback ?? null, note: fallback ? "" : `Template "${key}" doesn't exist.` };
}

/* ---------------- edits (need the database) ---------------- */
const needDb = () => { if (!dbConfigured()) throw new ConfigError("Saving templates needs the database. Add DATABASE_URL, then reload."); };

function validate(input: Record<string, unknown>, partial: boolean) {
  const errors: Record<string, string> = {};
  const out: Record<string, unknown> = {};
  const s = (k: string, max: number) => (typeof input[k] === "string" ? (input[k] as string).slice(0, max) : undefined);
  const key = s("key", 60)?.trim();
  if (key !== undefined || !partial) { if (!key || !/^[a-z][a-z0-9_]{1,59}$/.test(key)) errors.key = "Use lowercase letters, numbers and underscores, e.g. order_shipped."; else out.key = key; }
  for (const [k, max, label] of [["name", 100, "Name"], ["subject", 250, "Subject"], ["html", 100_000, "HTML"]] as const) {
    const v = s(k, max)?.trim();
    if (v !== undefined || !partial) { if (!v) errors[k] = `${label} is required.`; else out[k] = v; }
  }
  const description = s("description", 300);
  if (description !== undefined) out.description = description.trim();
  const text = s("text", 50_000);
  if (text !== undefined) out.text = text;
  if (input.enabled !== undefined) { if (typeof input.enabled !== "boolean") errors.enabled = "Must be on or off."; else out.enabled = input.enabled; }
  if (Object.keys(errors).length) throw new ValidationError("Please fix the highlighted fields.", errors);
  return out;
}

const UPDATE_TEMPLATE = `UPDATE email_templates SET key = $2, name = $3, description = $4, subject = $5, html = $6, text = $7,
  variables = $8, enabled = $9, updated_by = $10, updated_at = now() WHERE id = $1 RETURNING *`;

export async function createTemplate(input: Record<string, unknown>, actor: string, ip: string) {
  needDb();
  const data = validate(input, false);
  await seed();
  const t: TemplateData = {
    key: String(data.key), name: String(data.name), description: String(data.description ?? ""), subject: String(data.subject),
    html: String(data.html), text: String(data.text ?? ""), enabled: data.enabled === undefined ? true : !!data.enabled, system: false,
    variables: findVariables({ subject: String(data.subject), html: String(data.html), text: String(data.text ?? "") }),
  };
  const [doc] = await insertTemplate(t, actor);
  if (!doc) throw new ValidationError("A template with this key already exists.", { key: "Choose a different key." });
  await audit(actor, "email.template.created", t.key, Object.keys(data), ip);
  return view(doc);
}

export async function updateTemplate(id: string, input: Record<string, unknown>, actor: string, ip: string) {
  needDb();
  const doc = await findTemplate(id);
  if (!doc) throw new HttpError(404, "Template not found.", "not_found");
  const data = validate(input, true);
  if (doc.system && data.key && data.key !== doc.key) throw new ValidationError("Built-in template keys can't be changed.", { key: "This key is used by the website." });
  const next = { ...view(doc), ...data } as TemplateView;
  next.variables = findVariables({ subject: next.subject, html: next.html, text: next.text ?? "" });
  let saved: DbTemplate[];
  try {
    saved = await sql<DbTemplate>(UPDATE_TEMPLATE, [doc.id, next.key, next.name, next.description, next.subject, next.html, next.text, next.variables, next.enabled, actor]);
  } catch (error) {
    if ((error as { code?: string }).code === "23505") throw new ValidationError("A template with this key already exists.", { key: "Choose a different key." });
    throw error;
  }
  await audit(actor, "email.template.updated", next.key, Object.keys(data), ip);
  return view(saved[0]);
}

export async function resetTemplate(id: string, actor: string, ip: string) {
  needDb();
  const doc = await findTemplate(id);
  if (!doc) throw new HttpError(404, "Template not found.", "not_found");
  const original = defaultFor(doc.key);
  if (!original) throw new ValidationError("Only built-in templates can be reset.");
  const [saved] = await sql<DbTemplate>(UPDATE_TEMPLATE, [doc.id, original.key, original.name, original.description, original.subject, original.html, original.text, original.variables, original.enabled, actor]);
  await audit(actor, "email.template.reset", doc.key, ["subject", "html", "text"], ip);
  return view(saved);
}

export async function deleteTemplate(id: string, actor: string, ip: string) {
  needDb();
  if (!isId(id)) throw new HttpError(404, "Template not found.", "not_found");
  const [doc] = await sql<{ key: string }>("DELETE FROM email_templates WHERE id = $1 RETURNING key", [id]);
  if (!doc) throw new HttpError(404, "Template not found.", "not_found");
  await audit(actor, "email.template.deleted", doc.key, [], ip);
}

export async function getTemplate(id: string): Promise<TemplateView> {
  if (!dbConfigured()) {
    const t = defaultFor(id);
    if (!t) throw new HttpError(404, "Template not found.", "not_found");
    return { ...t, id: t.key, updatedAt: null, updatedBy: "built-in" };
  }
  const doc = await findTemplate(id);
  if (!doc) throw new HttpError(404, "Template not found.", "not_found");
  return view(doc);
}

/** Sample values for previews and test sends. */
export const sampleVariables = (variables: string[]): Record<string, string> => {
  const samples: Record<string, string> = {
    name: "Aisha Rahman", email: "aisha@example.com", otp: "482913", minutes: "10", orderId: "ORD-1001", total: "OMR 120.000",
    amount: "OMR 120.000", paymentMethod: "Card", invoiceNumber: "INV-2026-001", dueDate: "30 Nov 2026", company: "Example Trading LLC",
    title: "Test notification", message: "This is a test message from the Hawyia admin dashboard.",
    loginLink: "https://www.hawyiapremium.com/", resetLink: "https://www.hawyiapremium.com/", activationLink: "https://www.hawyiapremium.com/",
    invoiceLink: "https://www.hawyiapremium.com/", link: "https://www.hawyiapremium.com/",
    detailsHtml: '<tr><td style="color:#556070"><b>Name</b></td><td>Aisha Rahman</td></tr><tr><td style="color:#556070"><b>Message</b></td><td>Sample enquiry</td></tr>',
    detailsText: "Name: Aisha Rahman\nMessage: Sample enquiry",
  };
  return Object.fromEntries(variables.map((v) => [v, samples[v] ?? `[${v}]`]));
};
