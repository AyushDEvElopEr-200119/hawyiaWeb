import "server-only";
// The one way the site sends email:
//   await sendEmail({ to: "customer@example.com", template: "order_confirmation", variables: { name: "Customer", orderId: "ORD-1001" } });
//   await sendEmail({ to: [...], subject: "…", html: "…", text: "…" });
// It loads the active configuration, renders the template, writes an Email Log entry, sends through
// Microsoft 365 (SMTP + OAuth 2.0) and records the outcome. Failures are retried automatically
// (Vercel Cron) and can be retried by hand from the dashboard. It never switches to another provider.
import { getEffectiveConfig } from "./config";
import { createLog, dueForRetry, markFailed, markSent, messageForRetry } from "./logs";
import { deliver, DeliveryError, type ConnectionStatus, type OutgoingMessage } from "./smtp";
import { render, templateForSending } from "./templates";

export type SendEmailInput = {
  to: string | string[];
  replyTo?: string;
  source?: string;
  attachments?: { filename: string; content: Buffer | string; contentType?: string }[];
} & (
  | { template: string; variables?: Record<string, unknown>; subject?: never; html?: never; text?: never }
  | { template?: never; variables?: never; subject: string; html: string; text: string }
);

export type SendResult =
  | { ok: true; logId: string | null; messageId: string }
  | { ok: false; logId: string | null; status: ConnectionStatus | "Template Unavailable"; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendEmail(input: SendEmailInput): Promise<SendResult> {
  const to = (Array.isArray(input.to) ? input.to : [input.to]).map((t) => t.trim()).filter(Boolean);
  if (!to.length || to.some((t) => !EMAIL.test(t))) return { ok: false, logId: null, status: "Configuration Incomplete", error: "Invalid recipient address." };

  let subject: string, html: string, text: string, templateKey = "";
  if (input.template) {
    const { template, note } = await templateForSending(input.template);
    if (!template) {
      console.error(`Email not sent: ${note}`);
      return { ok: false, logId: null, status: "Template Unavailable", error: note };
    }
    if (note) console.warn(`Email template note: ${note}`);
    ({ subject, html, text } = render(template, input.variables ?? {}));
    templateKey = input.template;
  } else {
    ({ subject, html, text } = input as { subject: string; html: string; text: string });
  }

  const attachments = (input.attachments ?? []).map((a) => ({ filename: a.filename, content: Buffer.isBuffer(a.content) ? a.content : Buffer.from(a.content), contentType: a.contentType }));
  const message: OutgoingMessage = { to, subject, html, text, replyTo: input.replyTo, attachments };
  const logId = await createLog({ to, subject, templateKey, source: input.source ?? "", replyTo: input.replyTo, html, text, attachments });
  return attempt(logId, message);
}

async function attempt(logId: string | null, message: OutgoingMessage): Promise<SendResult> {
  const cfg = await getEffectiveConfig();
  try {
    const { messageId } = await deliver(cfg, message);
    await markSent(logId, messageId);
    return { ok: true, logId, messageId };
  } catch (error) {
    const d = error instanceof DeliveryError ? error : new DeliveryError("SMTP Connection Failed", (error as Error).message);
    // retrying won't help a disabled service or missing settings; it may help auth and network problems once fixed
    await markFailed(logId, `${d.status}: ${d.message}`, d.status !== "Service Disabled" && d.status !== "Configuration Incomplete");
    console.error(`Email to ${message.to.join(", ")} failed: ${d.status}: ${d.message}`);
    return { ok: false, logId, status: d.status, error: d.message };
  }
}

/** Sends a logged email again (button in Email Logs, and the retry cron). */
export async function retryEmail(logId: string): Promise<SendResult> {
  const { message } = await messageForRetry(logId);
  return attempt(logId, message);
}

/** Retries everything that is due. Used by /api/cron/email-retry. */
export async function processDueRetries() {
  const ids = await dueForRetry();
  const results = [];
  for (const id of ids) results.push(await retryEmail(id));
  return { attempted: ids.length, sent: results.filter((r) => r.ok).length };
}

export { getEffectiveConfig } from "./config";
