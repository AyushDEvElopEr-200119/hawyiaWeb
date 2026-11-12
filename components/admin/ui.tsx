"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Check, CircleAlert, CircleCheck, CircleX, Clock, Copy, Eye, EyeOff, Info, LoaderCircle, Power, TriangleAlert, X } from "lucide-react";

/* ---------------- API helper ---------------- */
export class ApiError extends Error {
  constructor(message: string, public status: number, public fields: Record<string, string> = {}) { super(message); }
}

/** Calls an admin API route; unwraps { ok, data } and throws ApiError otherwise. */
export async function api<T = unknown>(url: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, ...rest } = init;
  const res = await fetch(url, {
    ...rest,
    headers: { ...(json !== undefined ? { "Content-Type": "application/json" } : {}), ...(rest.headers ?? {}) },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
    cache: "no-store",
  });
  const body = (await res.json().catch(() => null)) as { ok?: boolean; data?: T; error?: string; fields?: Record<string, string> } | null;
  if (res.status === 401) {
    window.location.href = `/admin/login/?next=${encodeURIComponent(window.location.pathname)}`;
    throw new ApiError("Your session has ended. Please sign in again.", 401);
  }
  if (!res.ok || !body?.ok) throw new ApiError(body?.error ?? `Request failed (${res.status}).`, res.status, body?.fields ?? {});
  return body.data as T;
}

/* ---------------- toasts ---------------- */
type Toast = { id: number; kind: "success" | "error" | "info"; title: string; text?: string };
const ToastCtx = createContext<(t: Omit<Toast, "id">) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

/* ---------------- confirm dialog ---------------- */
type ConfirmOptions = { title: string; text: string; confirm?: string; danger?: boolean };
const ConfirmCtx = createContext<(o: ConfirmOptions) => Promise<boolean>>(async () => false);
export const useConfirm = () => useContext(ConfirmCtx);

export function AdminProviders({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((all) => [...all.slice(-3), { ...t, id }]);
    setTimeout(() => setToasts((all) => all.filter((x) => x.id !== id)), t.kind === "error" ? 8000 : 4500);
  }, []);

  const dialog = useRef<HTMLDialogElement>(null);
  const resolver = useRef<(v: boolean) => void>(() => {});
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const confirm = useCallback((o: ConfirmOptions) => {
    setOpts(o);
    requestAnimationFrame(() => dialog.current?.showModal());
    return new Promise<boolean>((resolve) => { resolver.current = resolve; });
  }, []);
  const close = (v: boolean) => { dialog.current?.close(); resolver.current(v); };

  return (
    <ToastCtx.Provider value={push}>
      <ConfirmCtx.Provider value={confirm}>
        {children}
        <div className="adm-toasts" aria-live="polite">
          {toasts.map((t) => (
            <div key={t.id} className={`adm-toast is-${t.kind}`} role={t.kind === "error" ? "alert" : "status"}>
              {t.kind === "success" ? <CircleCheck size={18} /> : t.kind === "error" ? <CircleX size={18} /> : <Info size={18} />}
              <div><b>{t.title}</b>{t.text && <p>{t.text}</p>}</div>
              <button type="button" aria-label="Dismiss" onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}><X size={16} /></button>
            </div>
          ))}
        </div>
        <dialog ref={dialog} className="adm-dialog" onCancel={(e) => { e.preventDefault(); close(false); }}>
          {opts && (
            <div className="adm-dialog-body">
              <span className={`adm-dialog-icon${opts.danger ? " is-danger" : ""}`}>{opts.danger ? <TriangleAlert size={22} /> : <CircleAlert size={22} />}</span>
              <h2>{opts.title}</h2>
              <p>{opts.text}</p>
              <div className="adm-dialog-actions">
                <button type="button" className="adm-btn is-ghost" onClick={() => close(false)}>Cancel</button>
                <button type="button" className={`adm-btn ${opts.danger ? "is-danger" : "is-primary"}`} onClick={() => close(true)} autoFocus>{opts.confirm ?? "Confirm"}</button>
              </div>
            </div>
          )}
        </dialog>
      </ConfirmCtx.Provider>
    </ToastCtx.Provider>
  );
}

/* ---------------- small building blocks ---------------- */
export function Skeleton({ h = 16, w = "100%", r = 8 }: { h?: number; w?: number | string; r?: number }) {
  return <span className="adm-skel" style={{ height: h, width: w, borderRadius: r }} aria-hidden="true" />;
}

export function Spinner({ size = 16 }: { size?: number }) {
  return <LoaderCircle size={size} className="adm-spin" aria-hidden="true" />;
}

const STATUS: Record<string, { cls: string; icon: ReactNode }> = {
  Connected: { cls: "ok", icon: <CircleCheck size={14} /> },
  "Authentication Failed": { cls: "bad", icon: <CircleX size={14} /> },
  "SMTP Connection Failed": { cls: "warn", icon: <TriangleAlert size={14} /> },
  "Configuration Incomplete": { cls: "warn", icon: <CircleAlert size={14} /> },
  "Service Disabled": { cls: "off", icon: <Power size={14} /> },
  sent: { cls: "ok", icon: <CircleCheck size={14} /> },
  failed: { cls: "bad", icon: <CircleX size={14} /> },
  queued: { cls: "info", icon: <Clock size={14} /> },
  "Not tested": { cls: "off", icon: <Clock size={14} /> },
};
export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { cls: "off", icon: <Info size={14} /> };
  return <span className={`adm-badge is-${s.cls}`}>{s.icon}{status === "sent" ? "Sent" : status === "failed" ? "Failed" : status === "queued" ? "Queued" : status}</span>;
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  const toast = useToast();
  return (
    <button
      type="button"
      className="adm-icon-btn"
      aria-label={label}
      title={label}
      disabled={!value}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          toast({ kind: "error", title: "Couldn't copy", text: "Your browser blocked clipboard access." });
        }
      }}
    >
      {done ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

/** A password-style input with show/hide. Used only for entering a new secret; stored secrets are never shown. */
export function SecretInput({ id, value, onChange, placeholder, error }: { id: string; value: string; onChange: (v: string) => void; placeholder?: string; error?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className={`adm-input-wrap${error ? " has-error" : ""}`}>
      <input
        id={id}
        className="adm-input"
        type={show ? "text" : "password"}
        autoComplete="new-password"
        spellCheck={false}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
      />
      <button type="button" className="adm-icon-btn" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide secret" : "Show secret"} title={show ? "Hide" : "Show"}>
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

export function Field({ label, htmlFor, hint, error, children, full }: { label: string; htmlFor: string; hint?: ReactNode; error?: string; children: ReactNode; full?: boolean }) {
  return (
    <div className={`adm-field${full ? " is-full" : ""}${error ? " has-error" : ""}`}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? <small className="adm-err" role="alert">{error}</small> : hint ? <small className="adm-hint">{hint}</small> : null}
    </div>
  );
}

export function Toggle({ id, checked, onChange, label, disabled }: { id: string; checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <label className={`adm-toggle${disabled ? " is-disabled" : ""}`} htmlFor={id}>
      <input id={id} type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className="adm-toggle-track" aria-hidden="true"><span /></span>
      <span>{label}</span>
    </label>
  );
}

export function Banner({ kind = "info", title, children, action }: { kind?: "info" | "warn" | "bad" | "ok"; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className={`adm-banner is-${kind}`} role={kind === "bad" ? "alert" : undefined}>
      <span className="adm-banner-icon">{kind === "ok" ? <CircleCheck size={18} /> : kind === "info" ? <Info size={18} /> : <TriangleAlert size={18} />}</span>
      <div className="adm-banner-body"><b>{title}</b>{children}</div>
      {action}
    </div>
  );
}

/** Debounces a value (for live previews). */
export function useDebounced<T>(value: T, ms = 400) {
  const [v, setV] = useState(value);
  useEffect(() => { const id = setTimeout(() => setV(value), ms); return () => clearTimeout(id); }, [value, ms]);
  return v;
}

export const fmtDate = (iso: string | null | undefined) =>
  iso ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso)) : "—";
