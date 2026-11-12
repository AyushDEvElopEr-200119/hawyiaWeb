import "server-only";
type Filter = Record<string, unknown>;
import { db, dbConfigured } from "../db";
import { ConfigError, HttpError } from "../errors";
import { EmailLog, type EmailLogDoc } from "../models";

export type LogStatus = "queued" | "sent" | "failed";
export type LogRow = {
  id: string; to: string[]; subject: string; templateKey: string; status: LogStatus; error: string;
  attempts: number; nextRetryAt: string | null; source: string; sentAt: string | null; createdAt: string;
};
export type LogDetail = LogRow & { messageId: string; replyTo: string; html: string; text: string; attachments: string[] };

const MAX_ATTEMPTS = 3;
const BACKOFF_MIN = [5, 30, 120];

const row = (d: EmailLogDoc): LogRow => ({
  id: String(d._id), to: d.to, subject: d.subject, templateKey: d.templateKey, status: d.status as LogStatus, error: d.error,
  attempts: d.attempts, nextRetryAt: d.nextRetryAt ? new Date(d.nextRetryAt).toISOString() : null, source: d.source,
  sentAt: d.sentAt ? new Date(d.sentAt).toISOString() : null, createdAt: new Date(d.createdAt).toISOString(),
});

export type NewLog = {
  to: string[]; subject: string; templateKey: string; source: string; replyTo?: string; html: string; text: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
};

/** Writes a "queued" entry before sending. Returns its id, or null when there's no database. */
export async function createLog(l: NewLog): Promise<string | null> {
  if (!dbConfigured()) return null;
  try {
    await db();
    const doc = await EmailLog.create({
      to: l.to, subject: l.subject, templateKey: l.templateKey, source: l.source, status: "queued",
      message: {
        replyTo: l.replyTo ?? "", html: l.html, text: l.text,
        attachments: (l.attachments ?? []).map((a) => ({ filename: a.filename, contentBase64: a.content.toString("base64"), contentType: a.contentType ?? "" })),
      },
    });
    return String(doc._id);
  } catch (error) {
    console.error("Email log couldn't be written:", (error as Error).message);
    return null;
  }
}

export async function markSent(id: string | null, messageId: string) {
  if (!id) return;
  await EmailLog.updateOne({ _id: id }, { $set: { status: "sent", sentAt: new Date(), messageId, error: "", nextRetryAt: null }, $inc: { attempts: 1 } }).catch(() => {});
}

/** Records a failure; schedules an automatic retry unless the attempts are used up or retrying can't help. */
export async function markFailed(id: string | null, error: string, retryable: boolean) {
  if (!id) return;
  const doc = await EmailLog.findById(id).catch(() => null);
  if (!doc) return;
  const attempts = doc.attempts + 1;
  const nextRetryAt = retryable && attempts < MAX_ATTEMPTS ? new Date(Date.now() + BACKOFF_MIN[attempts - 1] * 60_000) : null;
  await EmailLog.updateOne({ _id: id }, { $set: { status: "failed", error: error.slice(0, 1000), attempts, nextRetryAt } }).catch(() => {});
}

const needDb = () => { if (!dbConfigured()) throw new ConfigError("Email logs need the database. Add MONGODB_URI, then reload."); };

export type LogQuery = { q?: string; status?: string; from?: string; to?: string; page?: number; pageSize?: number };

function filter(q: LogQuery): Filter {
  const f: Filter = {};
  if (q.q?.trim()) f.to = { $regex: q.q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  if (q.status && ["queued", "sent", "failed"].includes(q.status)) f.status = q.status;
  const range: Record<string, Date> = {};
  if (q.from && !Number.isNaN(Date.parse(q.from))) range.$gte = new Date(`${q.from}T00:00:00Z`);
  if (q.to && !Number.isNaN(Date.parse(q.to))) range.$lte = new Date(`${q.to}T23:59:59.999Z`);
  if (Object.keys(range).length) f.createdAt = range;
  return f;
}

export async function listLogs(q: LogQuery) {
  needDb();
  await db();
  const pageSize = Math.min(100, Math.max(5, q.pageSize ?? 20));
  const page = Math.max(1, q.page ?? 1);
  const f = filter(q);
  const [items, total] = await Promise.all([
    EmailLog.find(f, { message: 0 }).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
    EmailLog.countDocuments(f),
  ]);
  return { items: items.map((d) => row(d as EmailLogDoc)), total, page, pageSize };
}

export async function getLog(id: string): Promise<LogDetail> {
  needDb();
  await db();
  const d = await EmailLog.findById(id).lean().catch(() => null);
  if (!d) throw new HttpError(404, "Email not found.", "not_found");
  const doc = d as EmailLogDoc;
  return {
    ...row(doc), messageId: doc.messageId, replyTo: doc.message?.replyTo ?? "", html: doc.message?.html ?? "", text: doc.message?.text ?? "",
    attachments: (doc.message?.attachments ?? []).map((a) => a.filename ?? ""),
  };
}

/** The stored message, ready to send again. */
export async function messageForRetry(id: string) {
  needDb();
  await db();
  const doc = await EmailLog.findById(id).catch(() => null);
  if (!doc) throw new HttpError(404, "Email not found.", "not_found");
  return {
    doc,
    message: {
      to: doc.to, subject: doc.subject, html: doc.message?.html ?? "", text: doc.message?.text ?? "",
      replyTo: doc.message?.replyTo || undefined,
      attachments: (doc.message?.attachments ?? []).map((a) => ({ filename: a.filename ?? "attachment", content: Buffer.from(a.contentBase64 ?? "", "base64"), contentType: a.contentType || undefined })),
    },
  };
}

export async function dueForRetry(limit = 20) {
  if (!dbConfigured()) return [];
  await db();
  const docs = await EmailLog.find({ status: "failed", nextRetryAt: { $ne: null, $lte: new Date() } }, { _id: 1 }).limit(limit).lean();
  return docs.map((d) => String(d._id));
}

export async function logStats() {
  if (!dbConfigured()) return { sent: null, failed: null, queued: null };
  try {
    await db();
    const [sent, failed, queued] = await Promise.all((["sent", "failed", "queued"] as const).map((status) => EmailLog.countDocuments({ status })));
    return { sent, failed, queued };
  } catch {
    return { sent: null, failed: null, queued: null };
  }
}

/** CSV export of the current filter (up to 5,000 rows). */
export async function logsCsv(q: LogQuery) {
  needDb();
  await db();
  const items = await EmailLog.find(filter(q), { message: 0 }).sort({ createdAt: -1 }).limit(5000).lean();
  const cell = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;   // stop spreadsheet formula injection
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const head = ["Email ID", "Recipient", "Subject", "Template", "Status", "Attempts", "Created", "Sent At", "Source", "Error"];
  const lines = items.map((d) => {
    const r = row(d as EmailLogDoc);
    return [r.id, r.to.join("; "), r.subject, r.templateKey, r.status, r.attempts, r.createdAt, r.sentAt, r.source, r.error].map(cell).join(",");
  });
  return [head.map(cell).join(","), ...lines].join("\r\n");
}
