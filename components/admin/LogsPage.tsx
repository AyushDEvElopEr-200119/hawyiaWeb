"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Eye, Inbox, RefreshCw, RotateCcw, ScrollText, Search, X } from "lucide-react";
import { api, Banner, CopyButton, fmtDate, Skeleton, Spinner, StatusBadge, useDebounced, useToast } from "./ui";

type Row = {
  id: string; to: string[]; subject: string; templateKey: string; status: "queued" | "sent" | "failed"; error: string;
  attempts: number; nextRetryAt: string | null; source: string; sentAt: string | null; createdAt: string;
};
type Detail = Row & { messageId: string; replyTo: string; html: string; text: string; attachments: string[] };
type Page = { items: Row[]; total: number; page: number; pageSize: number };

export function LogsPage() {
  const toast = useToast();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState<Detail | null>(null);
  const [retrying, setRetrying] = useState("");
  const drawer = useRef<HTMLDialogElement>(null);
  const query = useDebounced(q, 350);

  const params = useCallback((extra: Record<string, string> = {}) => {
    const p = new URLSearchParams({ page: String(page), pageSize: "20", ...extra });
    if (query) p.set("q", query);
    if (status) p.set("status", status);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    return p.toString();
  }, [page, query, status, from, to]);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await api<Page>(`/api/admin/email/logs/?${params()}`)); setError(""); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, [params]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [query, status, from, to]);

  async function open(id: string) {
    try {
      setDetail(await api<Detail>(`/api/admin/email/logs/${id}/`));
      drawer.current?.showModal();
    } catch (e) { toast({ kind: "error", title: "Couldn't open this email", text: (e as Error).message }); }
  }

  async function retry(id: string) {
    setRetrying(id);
    try {
      const res = await api<{ result: { ok: boolean; status?: string; error?: string }; log: Detail }>(`/api/admin/email/logs/${id}/retry/`, { method: "POST" });
      if (res.result.ok) toast({ kind: "success", title: "Email sent", text: `Delivered to Microsoft 365 for ${res.log.to.join(", ")}.` });
      else toast({ kind: "error", title: res.result.status ?? "Still failing", text: res.result.error });
      if (detail?.id === id) setDetail(res.log);
      load();
    } catch (e) { toast({ kind: "error", title: "Retry failed", text: (e as Error).message }); }
    finally { setRetrying(""); }
  }

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  const notConnected = /database/i.test(error);

  return (
    <div className="adm-page">
      <div className="adm-head">
        <div>
          <p className="adm-eyebrow"><ScrollText size={14} /> Communication Settings</p>
          <h1>Email Logs</h1>
          <p className="adm-sub">Every email the website tried to send, with its delivery status. Failed emails retry automatically up to 3 times.</p>
        </div>
        <div className="adm-head-actions">
          <button type="button" className="adm-btn is-ghost" onClick={load} disabled={loading}><RefreshCw size={16} className={loading ? "adm-spin" : ""} /> Refresh</button>
          <a className={`adm-btn is-primary${!data?.total ? " is-disabled" : ""}`} href={`/api/admin/email/logs/?${params({ format: "csv" })}`} aria-disabled={!data?.total}><Download size={16} /> Export CSV</a>
        </div>
      </div>

      {notConnected ? (
        <Banner kind="info" title="Email logs need the database"><p>Add <code>MONGODB_URI</code> on the server, then reload. Until then, failed sends are written to the server log.</p></Banner>
      ) : error ? (
        <Banner kind="bad" title="Logs couldn't be loaded"><p>{error}</p></Banner>
      ) : null}

      <section className="adm-card is-flush">
        <div className="adm-toolbar">
          <div className="adm-search"><Search size={16} /><input aria-label="Search by recipient" placeholder="Search by recipient" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <select className="adm-input is-sm" aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option><option value="sent">Sent</option><option value="failed">Failed</option><option value="queued">Queued</option>
          </select>
          <label className="adm-date"><span>From</span><input className="adm-input is-sm" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
          <label className="adm-date"><span>To</span><input className="adm-input is-sm" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
          {(q || status || from || to) && <button type="button" className="adm-btn is-ghost is-sm" onClick={() => { setQ(""); setStatus(""); setFrom(""); setTo(""); }}><X size={15} /> Clear</button>}
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>Email ID</th><th>Recipient</th><th>Subject</th><th>Template</th><th>Status</th><th>Sent at</th><th>Error</th><th aria-label="Actions" /></tr>
            </thead>
            <tbody>
              {loading && !data ? Array.from({ length: 6 }, (_, i) => (
                <tr key={i}>{Array.from({ length: 8 }, (_, j) => <td key={j}><Skeleton h={14} w={j === 2 ? "90%" : "70%"} /></td>)}</tr>
              )) : data?.items.length ? data.items.map((r) => (
                <tr key={r.id}>
                  <td data-label="Email ID"><code title={r.id}>{r.id.slice(-8)}</code></td>
                  <td data-label="Recipient" className="adm-cell-strong">{r.to.join(", ")}</td>
                  <td data-label="Subject" className="adm-cell-clip">{r.subject}</td>
                  <td data-label="Template">{r.templateKey ? <code>{r.templateKey}</code> : <span className="adm-muted">custom</span>}</td>
                  <td data-label="Status"><StatusBadge status={r.status} />{r.attempts > 1 && <small className="adm-muted"> ×{r.attempts}</small>}</td>
                  <td data-label="Sent at">{r.sentAt ? fmtDate(r.sentAt) : <span className="adm-muted">{fmtDate(r.createdAt)}</span>}</td>
                  <td data-label="Error" className="adm-cell-clip adm-cell-error" title={r.error}>{r.error || <span className="adm-muted">—</span>}</td>
                  <td className="adm-cell-actions">
                    <button type="button" className="adm-icon-btn" aria-label="View details" title="View details" onClick={() => open(r.id)}><Eye size={16} /></button>
                    {r.status === "failed" && <button type="button" className="adm-icon-btn" aria-label="Retry" title="Retry" onClick={() => retry(r.id)} disabled={retrying === r.id}>{retrying === r.id ? <Spinner /> : <RotateCcw size={16} />}</button>}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={8}><div className="adm-empty is-big"><Inbox size={22} /><p>{notConnected ? "No logs yet." : "No emails match these filters."}</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>

        {data && data.total > 0 && (
          <div className="adm-pager">
            <span className="adm-muted">{(data.page - 1) * data.pageSize + 1}–{Math.min(data.total, data.page * data.pageSize)} of {data.total}</span>
            <div className="adm-inline">
              <button type="button" className="adm-icon-btn" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={18} /></button>
              <span>Page {page} of {pages}</span>
              <button type="button" className="adm-icon-btn" aria-label="Next page" disabled={page >= pages} onClick={() => setPage(page + 1)}><ChevronRight size={18} /></button>
            </div>
          </div>
        )}
      </section>

      <dialog ref={drawer} className="adm-drawer" onClick={(e) => { if (e.target === drawer.current) drawer.current?.close(); }}>
        {detail && (
          <div className="adm-drawer-body">
            <header>
              <div><h2>{detail.subject || "(no subject)"}</h2><StatusBadge status={detail.status} /></div>
              <button type="button" className="adm-icon-btn" aria-label="Close" onClick={() => drawer.current?.close()}><X size={18} /></button>
            </header>
            <dl className="adm-dl">
              <dt>Email ID</dt><dd><code>{detail.id}</code> <CopyButton value={detail.id} label="Copy ID" /></dd>
              <dt>Recipient</dt><dd>{detail.to.join(", ")}</dd>
              {detail.replyTo && <><dt>Reply-to</dt><dd>{detail.replyTo}</dd></>}
              <dt>Template</dt><dd>{detail.templateKey || "custom"}</dd>
              <dt>Source</dt><dd>{detail.source || "—"}</dd>
              <dt>Created</dt><dd>{fmtDate(detail.createdAt)}</dd>
              <dt>Sent at</dt><dd>{fmtDate(detail.sentAt)}</dd>
              <dt>Attempts</dt><dd>{detail.attempts}{detail.nextRetryAt ? ` · next automatic retry ${fmtDate(detail.nextRetryAt)}` : ""}</dd>
              {detail.messageId && <><dt>Message ID</dt><dd className="adm-break">{detail.messageId}</dd></>}
              {detail.attachments.length > 0 && <><dt>Attachments</dt><dd>{detail.attachments.join(", ")}</dd></>}
            </dl>
            {detail.error && <Banner kind="bad" title="Last error"><p>{detail.error}</p></Banner>}
            <p className="adm-label">Message</p>
            <iframe title="Email content" sandbox="" srcDoc={detail.html || `<pre>${detail.text.replace(/</g, "&lt;")}</pre>`} className="adm-drawer-frame" />
            {detail.status === "failed" && (
              <button type="button" className="adm-btn is-primary" onClick={() => retry(detail.id)} disabled={retrying === detail.id}>{retrying === detail.id ? <Spinner /> : <RotateCcw size={16} />} Retry now</button>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}
