import "server-only";
import { dbConfigured, isId, sql } from "../db";
import { ConfigError, HttpError } from "../errors";

export type LogStatus = "queued" | "sent" | "failed";
export type LogRow = {
  id: string; to: string[]; subject: string; templateKey: string; status: LogStatus; error: string;
  attempts: number; nextRetryAt: string | null; source: string; sentAt: string | null; createdAt: string;
};
export type LogDetail = LogRow & { messageId: string; replyTo: string; html: string; text: string; attachments: string[] };

type StoredMessage = { replyTo?: string; html?: string; text?: string; attachments?: { filename?: string; contentBase64?: string; contentType?: string }[] };
type DbLog = {
  id: string; recipients: string[]; subject: string; template_key: string; status: LogStatus; error: string; attempts: number;
  next_retry_at: Date | null; message_id: string; source: string; sent_at: Date | null; created_at: Date; message?: StoredMessage | null;
};

const MAX_ATTEMPTS = 3;
const BACKOFF_MIN = [5, 30, 120];
// list views never load the stored message body
const COLUMNS = "id, recipients, subject, template_key, status, error, attempts, next_retry_at, message_id, source, sent_at, created_at";

const iso = (d: Date | null) => (d ? new Date(d).toISOString() : null);
const row = (d: DbLog): LogRow => ({
  id: String(d.id), to: d.recipients, subject: d.subject, templateKey: d.template_key, status: d.status, error: d.error,
  attempts: d.attempts, nextRetryAt: iso(d.next_retry_at), source: d.source, sentAt: iso(d.sent_at), createdAt: new Date(d.created_at).toISOString(),
});

export type NewLog = {
  to: string[]; subject: string; templateKey: string; source: string; replyTo?: string; html: string; text: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
};

/** Writes a "queued" entry before sending. Returns its id, or null when there's no database. */
export async function createLog(l: NewLog): Promise<string | null> {
  if (!dbConfigured()) return null;
  try {
    const message: StoredMessage = {
      replyTo: l.replyTo ?? "", html: l.html, text: l.text,
      attachments: (l.attachments ?? []).map((a) => ({ filename: a.filename, contentBase64: a.content.toString("base64"), contentType: a.contentType ?? "" })),
    };
    const [r] = await sql<{ id: string }>(
      "INSERT INTO email_logs (recipients, subject, template_key, source, status, message) VALUES ($1, $2, $3, $4, 'queued', $5) RETURNING id",
      [l.to, l.subject, l.templateKey, l.source, JSON.stringify(message)],
    );
    return String(r.id);
  } catch (error) {
    console.error("Email log couldn't be written:", (error as Error).message);
    return null;
  }
}

export async function markSent(id: string | null, messageId: string) {
  if (!id) return;
  await sql(
    "UPDATE email_logs SET status = 'sent', sent_at = now(), message_id = $2, error = '', next_retry_at = NULL, attempts = attempts + 1, updated_at = now() WHERE id = $1",
    [id, messageId],
  ).catch(() => {});
}

/** Records a failure; schedules an automatic retry unless the attempts are used up or retrying can't help. */
export async function markFailed(id: string | null, error: string, retryable: boolean) {
  if (!id) return;
  try {
    const [d] = await sql<{ attempts: number }>("SELECT attempts FROM email_logs WHERE id = $1", [id]);
    if (!d) return;
    const attempts = d.attempts + 1;
    const nextRetryAt = retryable && attempts < MAX_ATTEMPTS ? new Date(Date.now() + BACKOFF_MIN[attempts - 1] * 60_000) : null;
    await sql(
      "UPDATE email_logs SET status = 'failed', error = $2, attempts = $3, next_retry_at = $4, updated_at = now() WHERE id = $1",
      [id, error.slice(0, 1000), attempts, nextRetryAt],
    );
  } catch { /* the send result matters more than the log */ }
}

const needDb = () => { if (!dbConfigured()) throw new ConfigError("Email logs need the database. Add DATABASE_URL, then reload."); };

export type LogQuery = { q?: string; status?: string; from?: string; to?: string; page?: number; pageSize?: number };

/** WHERE clause and its parameters for the dashboard's search and filters. */
function where(q: LogQuery): { clause: string; params: unknown[] } {
  const parts: string[] = [];
  const params: unknown[] = [];
  if (q.q?.trim()) {
    params.push(`%${q.q.trim().replace(/[\\%_]/g, "\\$&")}%`);
    parts.push(`array_to_string(recipients, ' ') ILIKE $${params.length}`);
  }
  if (q.status && ["queued", "sent", "failed"].includes(q.status)) { params.push(q.status); parts.push(`status = $${params.length}`); }
  if (q.from && !Number.isNaN(Date.parse(q.from))) { params.push(`${q.from}T00:00:00Z`); parts.push(`created_at >= $${params.length}`); }
  if (q.to && !Number.isNaN(Date.parse(q.to))) { params.push(`${q.to}T23:59:59.999Z`); parts.push(`created_at <= $${params.length}`); }
  return { clause: parts.length ? `WHERE ${parts.join(" AND ")}` : "", params };
}

export async function listLogs(q: LogQuery) {
  needDb();
  const pageSize = Math.min(100, Math.max(5, q.pageSize ?? 20));
  const page = Math.max(1, q.page ?? 1);
  const { clause, params } = where(q);
  const [items, [{ total }]] = await Promise.all([
    sql<DbLog>(`SELECT ${COLUMNS} FROM email_logs ${clause} ORDER BY created_at DESC LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`, params),
    sql<{ total: string }>(`SELECT count(*) AS total FROM email_logs ${clause}`, params),
  ]);
  return { items: items.map(row), total: Number(total), page, pageSize };
}

async function find(id: string) {
  if (!isId(id)) return null;
  const [d] = await sql<DbLog>(`SELECT ${COLUMNS}, message FROM email_logs WHERE id = $1`, [id]);
  return d ?? null;
}

export async function getLog(id: string): Promise<LogDetail> {
  needDb();
  const d = await find(id);
  if (!d) throw new HttpError(404, "Email not found.", "not_found");
  return {
    ...row(d), messageId: d.message_id, replyTo: d.message?.replyTo ?? "", html: d.message?.html ?? "", text: d.message?.text ?? "",
    attachments: (d.message?.attachments ?? []).map((a) => a.filename ?? ""),
  };
}

/** The stored message, ready to send again. */
export async function messageForRetry(id: string) {
  needDb();
  const d = await find(id);
  if (!d) throw new HttpError(404, "Email not found.", "not_found");
  return {
    message: {
      to: d.recipients, subject: d.subject, html: d.message?.html ?? "", text: d.message?.text ?? "",
      replyTo: d.message?.replyTo || undefined,
      attachments: (d.message?.attachments ?? []).map((a) => ({ filename: a.filename ?? "attachment", content: Buffer.from(a.contentBase64 ?? "", "base64"), contentType: a.contentType || undefined })),
    },
  };
}

export async function dueForRetry(limit = 20) {
  if (!dbConfigured()) return [];
  const rows = await sql<{ id: string }>(
    "SELECT id FROM email_logs WHERE status = 'failed' AND next_retry_at IS NOT NULL AND next_retry_at <= now() ORDER BY next_retry_at LIMIT $1",
    [limit],
  );
  return rows.map((r) => String(r.id));
}

export async function logStats() {
  if (!dbConfigured()) return { sent: null, failed: null, queued: null };
  try {
    const rows = await sql<{ status: LogStatus; n: string }>("SELECT status, count(*) AS n FROM email_logs GROUP BY status");
    const n = (s: LogStatus) => Number(rows.find((r) => r.status === s)?.n ?? 0);
    return { sent: n("sent"), failed: n("failed"), queued: n("queued") };
  } catch {
    return { sent: null, failed: null, queued: null };
  }
}

/** CSV export of the current filter (up to 5,000 rows). */
export async function logsCsv(q: LogQuery) {
  needDb();
  const { clause, params } = where(q);
  const items = await sql<DbLog>(`SELECT ${COLUMNS} FROM email_logs ${clause} ORDER BY created_at DESC LIMIT 5000`, params);
  const cell = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;   // stop spreadsheet formula injection
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const head = ["Email ID", "Recipient", "Subject", "Template", "Status", "Attempts", "Created", "Sent At", "Source", "Error"];
  const lines = items.map((d) => {
    const r = row(d);
    return [r.id, r.to.join("; "), r.subject, r.templateKey, r.status, r.attempts, r.createdAt, r.sentAt, r.source, r.error].map(cell).join(",");
  });
  return [head.map(cell).join(","), ...lines].join("\r\n");
}
