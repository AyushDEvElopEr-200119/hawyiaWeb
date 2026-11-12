"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AtSign, Building2, Clock, Database, Fingerprint, Hash, Inbox, KeyRound, Lock, Mail, Plug, RotateCcw, Save, Send, Server,
  ShieldCheck, Activity, TriangleAlert,
} from "lucide-react";
import { api, ApiError, Banner, CopyButton, Field, fmtDate, SecretInput, Skeleton, Spinner, StatusBadge, Toggle, useConfirm, useToast } from "./ui";

type Config = {
  provider: string; host: string; port: number; security: "STARTTLS" | "SSL/TLS"; authType: string;
  username: string; senderEmail: string; senderName: string; notifyEmails: string[]; enabled: boolean;
  tenantId: string; clientId: string; objectId: string; secretSet: boolean; secretUpdatedAt: string | null;
  lastTest: { at: string; status: string; message: string } | null; source: "database" | "environment";
  databaseConnected: boolean; encryptionReady: boolean;
  testMode: { provider: "gmail"; user: string; redirectTo: string[]; ready: boolean } | null;
};
type Stats = { sent: number | null; failed: number | null; queued: number | null };
type TestResult = { status: string; message: string; detail?: string; roles?: string[]; testedAt: string };

const EDITABLE = ["host", "port", "security", "username", "senderEmail", "senderName", "notifyEmails", "enabled", "tenantId", "clientId"] as const;
type Form = Record<(typeof EDITABLE)[number], string | number | boolean>;
const toForm = (c: Config): Form => ({
  host: c.host, port: c.port, security: c.security, username: c.username, senderEmail: c.senderEmail, senderName: c.senderName,
  notifyEmails: c.notifyEmails.join(", "), enabled: c.enabled, tenantId: c.tenantId, clientId: c.clientId,
});

export function EmailConfigPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [config, setConfig] = useState<Config | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [secret, setSecret] = useState("");
  const [secretError, setSecretError] = useState("");
  const [rotating, setRotating] = useState(false);
  const [testing, setTesting] = useState(false);
  const [test, setTest] = useState<TestResult | null>(null);
  const [mail, setMail] = useState({ to: "", subject: "Test email from Hawyia Premium", message: "This is a test email sent through Microsoft 365 from the Hawyia admin dashboard." });
  const [mailErrors, setMailErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api<{ config: Config; stats: Stats }>("/api/admin/email/config/");
      setConfig(data.config); setStats(data.stats); setForm(toForm(data.config)); setLoadError("");
    } catch (e) {
      setLoadError((e as Error).message);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const dirty = !!(config && form && JSON.stringify(toForm(config)) !== JSON.stringify(form));
  const canSave = !!config?.databaseConnected && config.encryptionReady;
  const set = (k: keyof Form, v: string | number | boolean) => { setForm((f) => (f ? { ...f, [k]: v } : f)); setErrors((e) => ({ ...e, [k]: "" })); };

  async function save() {
    if (!form) return;
    setSaving(true);
    try {
      const data = await api<{ changed: string[]; config: Config }>("/api/admin/email/config/", { method: "PUT", json: { ...form, port: Number(form.port) } });
      setConfig(data.config); setForm(toForm(data.config)); setErrors({});
      toast({ kind: "success", title: data.changed.length ? "Configuration saved" : "No changes to save" });
    } catch (e) {
      if (e instanceof ApiError) setErrors(e.fields);
      toast({ kind: "error", title: "Couldn't save", text: (e as Error).message });
    } finally { setSaving(false); }
  }

  async function reset() {
    if (!(await confirm({ title: "Reset SMTP settings?", text: "Host, port, security, username and sender go back to the Microsoft 365 defaults. Azure IDs and the client secret are kept.", confirm: "Reset", danger: true }))) return;
    try {
      const data = await api<{ config: Config }>("/api/admin/email/config/reset/", { method: "POST" });
      setConfig(data.config); setForm(toForm(data.config));
      toast({ kind: "success", title: "Settings reset to Microsoft 365 defaults" });
    } catch (e) { toast({ kind: "error", title: "Couldn't reset", text: (e as Error).message }); }
  }

  async function rotate() {
    if (!secret.trim()) { setSecretError("Paste the new secret's Value."); return; }
    if (!(await confirm({ title: "Replace the client secret?", text: "The new secret is encrypted and stored. Emails will use it straight away; the old value can't be recovered from here.", confirm: "Replace secret" }))) return;
    setRotating(true);
    try {
      const data = await api<{ config: Config }>("/api/admin/email/config/secret/", { method: "POST", json: { clientSecret: secret } });
      setConfig(data.config); setSecret(""); setSecretError("");
      toast({ kind: "success", title: "Client secret updated", text: "Run Test Connection to confirm it works." });
    } catch (e) {
      if (e instanceof ApiError) setSecretError(e.fields.clientSecret ?? e.message);
      toast({ kind: "error", title: "Couldn't update the secret", text: (e as Error).message });
    } finally { setRotating(false); }
  }

  async function runTest() {
    setTesting(true);
    try {
      const data = await api<{ result: TestResult; config: Config }>("/api/admin/email/test-connection/", { method: "POST" });
      setTest(data.result); setConfig(data.config);
      toast({ kind: data.result.status === "Connected" ? "success" : "error", title: data.result.status, text: data.result.message });
    } catch (e) { toast({ kind: "error", title: "Test couldn't run", text: (e as Error).message }); }
    finally { setTesting(false); }
  }

  async function sendTest() {
    setSending(true);
    try {
      const data = await api<{ result: { ok: boolean; status?: string; error?: string } }>("/api/admin/email/send-test/", { method: "POST", json: mail });
      setMailErrors({});
      if (data.result.ok) toast({ kind: "success", title: "Test email sent", text: `Delivered to Microsoft 365 for ${mail.to}.` });
      else toast({ kind: "error", title: data.result.status ?? "Not sent", text: data.result.error });
      load();
    } catch (e) {
      if (e instanceof ApiError) setMailErrors(e.fields);
      toast({ kind: "error", title: "Couldn't send", text: (e as Error).message });
    } finally { setSending(false); }
  }

  if (loadError) return <Banner kind="bad" title="The email settings couldn't be loaded">{<p>{loadError}</p>}</Banner>;
  if (!config || !form) return <LoadingView />;

  const status = test?.status ?? config.lastTest?.status ?? "Not tested";
  const shownTest = test ?? (config.lastTest ? { ...config.lastTest, testedAt: config.lastTest.at } : null);

  return (
    <div className="adm-page">
      <div className="adm-head">
        <div>
          <p className="adm-eyebrow"><Mail size={14} /> Communication Settings</p>
          <h1>Email Configuration</h1>
          <p className="adm-sub">Microsoft 365 sends every email from the website: enquiries, confirmations and notifications.</p>
        </div>
        <div className="adm-head-actions">
          <a href="#send-test" className="adm-btn is-ghost"><Send size={16} /> Send test email</a>
          <button type="button" className="adm-btn is-primary is-lg" onClick={runTest} disabled={testing}>
            {testing ? <Spinner /> : <Plug size={18} />} {testing ? "Testing…" : "Test Connection"}
          </button>
        </div>
      </div>

      {config.testMode && (
        <Banner kind="warn" title="Test mode: emails are sent through Gmail, not Microsoft 365">
          {config.testMode.ready ? (
            <p>
              Every email from the website is sent from <strong>{config.testMode.user}</strong>
              {config.testMode.redirectTo.length > 0 && <> and team notifications go to <strong>{config.testMode.redirectTo.join(", ")}</strong> instead of the addresses below</>}.
              {" "}When the Microsoft 365 Exchange step is done, remove <code>EMAIL_TEST_MODE</code> from <code>.env.local</code> and restart to go back to Microsoft 365.
            </p>
          ) : (
            <p><code>EMAIL_TEST_MODE=gmail</code> is set, but <code>GMAIL_USER</code> or <code>GMAIL_APP_PASSWORD</code> is missing in <code>.env.local</code>, so nothing can be sent.</p>
          )}
        </Banner>
      )}
      {!config.databaseConnected && (
        <Banner kind="info" title="Showing settings from the environment">
          <p>The database isn&apos;t connected, so these values come from <code>.env.local</code> / Vercel and can&apos;t be edited here. Test Connection and Send Test Email still work. Add <code>MONGODB_URI</code> to save settings, manage templates and keep email logs.</p>
        </Banner>
      )}
      {config.databaseConnected && !config.encryptionReady && (
        <Banner kind="warn" title="Secrets can't be stored yet"><p>Set <code>EMAIL_SECRET_KEY</code> (32 bytes) on the server to save settings securely.</p></Banner>
      )}

      {/* ---------------- overview ---------------- */}
      <section className="adm-stats" aria-label="Email service overview">
        <Stat icon={<Building2 size={18} />} label="Email provider" value={config.testMode ? "Gmail (test mode)" : "Microsoft 365"} />
        <Stat icon={<Server size={18} />} label="SMTP host" value={config.testMode ? "smtp.gmail.com" : config.host || "—"} />
        <Stat icon={<Hash size={18} />} label="SMTP port" value={config.testMode ? "465 · SSL/TLS" : `${config.port} · ${config.security}`} />
        <Stat icon={<AtSign size={18} />} label="Sender email" value={(config.testMode ? config.testMode.user : config.senderEmail) || "—"} />
        <Stat icon={<Activity size={18} />} label="Connection status" value={<StatusBadge status={status === "Connected" ? "Connected" : status} />} />
        <Stat icon={<Clock size={18} />} label="Last tested" value={fmtDate(shownTest?.testedAt)} />
        <Stat icon={<Send size={18} />} label="Emails sent" value={stats?.sent ?? "—"} hint={stats?.sent === null ? "Needs the database" : undefined} />
        <Stat icon={<TriangleAlert size={18} />} label="Failed emails" value={stats?.failed ?? "—"} tone={stats?.failed ? "bad" : undefined} hint={stats?.failed === null ? "Needs the database" : undefined} />
      </section>

      {shownTest && (
        <section className={`adm-card adm-test is-${shownTest.status === "Connected" ? "ok" : "bad"}`} aria-live="polite">
          <div className="adm-test-head">
            <StatusBadge status={shownTest.status} />
            <span className="adm-muted">Tested {fmtDate(shownTest.testedAt)}</span>
          </div>
          <p>{shownTest.message}</p>
          {test?.detail && (
            <div className="adm-code">
              <div className="adm-code-head"><span>Exchange Online PowerShell (run by a Microsoft 365 admin)</span><CopyButton value={test.detail} label="Copy commands" /></div>
              <pre>{test.detail}</pre>
            </div>
          )}
          {test?.roles && test.roles.length > 0 && <p className="adm-muted">App permissions in the token: {test.roles.map((r) => <code key={r}>{r}</code>)}</p>}
        </section>
      )}

      <div className="adm-grid-2">
        {/* ---------------- SMTP ---------------- */}
        <section className="adm-card">
          <header className="adm-card-head">
            <span className="adm-card-icon"><Server size={18} /></span>
            <div><h2>SMTP Configuration</h2><p>How the site connects to Microsoft 365.</p></div>
            <Toggle id="enabled" checked={!!form.enabled} onChange={(v) => set("enabled", v)} label={form.enabled ? "Enabled" : "Disabled"} disabled={!canSave} />
          </header>
          <div className="adm-form">
            <Field label="SMTP provider" htmlFor="provider"><input id="provider" className="adm-input" value="Microsoft 365" readOnly /></Field>
            <Field label="SMTP authentication" htmlFor="authType"><input id="authType" className="adm-input" value="OAuth 2.0 (XOAUTH2)" readOnly /></Field>
            <Field label="SMTP host" htmlFor="host" error={errors.host}>
              <input id="host" className="adm-input" value={String(form.host)} onChange={(e) => set("host", e.target.value)} disabled={!canSave} />
            </Field>
            <Field label="SMTP port" htmlFor="port" error={errors.port}>
              <input id="port" className="adm-input" inputMode="numeric" value={String(form.port)} onChange={(e) => set("port", e.target.value.replace(/\D/g, ""))} disabled={!canSave} />
            </Field>
            <Field label="SMTP security" htmlFor="security" error={errors.security}>
              <select id="security" className="adm-input" value={String(form.security)} onChange={(e) => set("security", e.target.value)} disabled={!canSave}>
                <option value="STARTTLS">STARTTLS (port 587)</option>
                <option value="SSL/TLS">SSL/TLS (port 465)</option>
              </select>
            </Field>
            <Field label="SMTP username" htmlFor="username" error={errors.username} hint="The mailbox the app signs in as.">
              <input id="username" className="adm-input" type="email" value={String(form.username)} onChange={(e) => set("username", e.target.value)} disabled={!canSave} />
            </Field>
            <Field label="Sender email" htmlFor="senderEmail" error={errors.senderEmail} hint="Must be the mailbox above or one it may send as.">
              <input id="senderEmail" className="adm-input" type="email" value={String(form.senderEmail)} onChange={(e) => set("senderEmail", e.target.value)} disabled={!canSave} />
            </Field>
            <Field label="Sender name" htmlFor="senderName" error={errors.senderName}>
              <input id="senderName" className="adm-input" value={String(form.senderName)} onChange={(e) => set("senderName", e.target.value)} disabled={!canSave} />
            </Field>
            <Field label="Enquiries go to" htmlFor="notifyEmails" error={errors.notifyEmails} hint="Where website form submissions are sent. Separate several with commas." full>
              <input id="notifyEmails" className="adm-input" value={String(form.notifyEmails)} onChange={(e) => set("notifyEmails", e.target.value)} disabled={!canSave} />
            </Field>
          </div>
          <footer className="adm-card-foot">
            <button type="button" className="adm-btn is-ghost" onClick={reset} disabled={!canSave}><RotateCcw size={16} /> Reset</button>
            <button type="button" className="adm-btn is-primary" onClick={save} disabled={!canSave || !dirty || saving}>{saving ? <Spinner /> : <Save size={16} />} Save configuration</button>
          </footer>
        </section>

        {/* ---------------- Azure ---------------- */}
        <section className="adm-card">
          <header className="adm-card-head">
            <span className="adm-card-icon is-blue"><ShieldCheck size={18} /></span>
            <div><h2>Microsoft Azure App Registration</h2><p>The Entra ID app that signs in to Exchange with OAuth 2.0.</p></div>
          </header>
          <div className="adm-form is-single">
            <Field label="Application (client) ID" htmlFor="clientId" error={errors.clientId}>
              <div className="adm-input-wrap">
                <input id="clientId" className="adm-input is-mono" value={String(form.clientId)} onChange={(e) => set("clientId", e.target.value.trim())} disabled={!canSave} spellCheck={false} />
                <CopyButton value={String(form.clientId)} label="Copy client ID" />
              </div>
            </Field>
            <Field label="Directory (tenant) ID" htmlFor="tenantId" error={errors.tenantId}>
              <div className="adm-input-wrap">
                <input id="tenantId" className="adm-input is-mono" value={String(form.tenantId)} onChange={(e) => set("tenantId", e.target.value.trim())} disabled={!canSave} spellCheck={false} />
                <CopyButton value={String(form.tenantId)} label="Copy tenant ID" />
              </div>
            </Field>
            <Field label="Object ID" htmlFor="objectId" hint="Reference only (from the app registration page). Exchange needs the Enterprise application's Object ID instead.">
              <div className="adm-input-wrap">
                <input id="objectId" className="adm-input is-mono" value={config.objectId || "—"} readOnly />
                <CopyButton value={config.objectId} label="Copy object ID" />
              </div>
            </Field>
            <div className="adm-secret-state">
              <span className={`adm-card-icon ${config.secretSet ? "is-green" : "is-red"}`}><Lock size={16} /></span>
              <div>
                <b>Client secret {config.secretSet ? "stored" : "missing"}</b>
                <small>{config.secretSet ? `Encrypted · ${config.source === "database" ? `updated ${fmtDate(config.secretUpdatedAt)}` : "from the environment"}. The value is never shown.` : "Add the secret's Value from Entra ID → Certificates & secrets."}</small>
              </div>
            </div>
            <Field label={config.secretSet ? "Rotate client secret" : "Client secret"} htmlFor="clientSecret" error={secretError} hint="Paste the secret's Value (not its Secret ID). It's encrypted before it's stored.">
              <SecretInput id="clientSecret" value={secret} onChange={(v) => { setSecret(v); setSecretError(""); }} placeholder="Paste a new client secret" error={secretError} />
            </Field>
          </div>
          <footer className="adm-card-foot">
            <span className="adm-muted"><KeyRound size={14} /> Secrets never leave the server.</span>
            <button type="button" className="adm-btn is-primary" onClick={rotate} disabled={!canSave || !secret || rotating}>{rotating ? <Spinner /> : <KeyRound size={16} />} {config.secretSet ? "Rotate secret" : "Save secret"}</button>
          </footer>
        </section>
      </div>

      {/* ---------------- Send test ---------------- */}
      <section className="adm-card" id="send-test">
        <header className="adm-card-head">
          <span className="adm-card-icon is-amber"><Send size={18} /></span>
          <div><h2>Send Test Email</h2><p>Sends a real email through Microsoft 365 with the current settings.</p></div>
        </header>
        <div className="adm-form">
          <Field label="Recipient email" htmlFor="to" error={mailErrors.to}>
            <input id="to" className="adm-input" type="email" placeholder="you@example.com" value={mail.to} onChange={(e) => { setMail({ ...mail, to: e.target.value }); setMailErrors({ ...mailErrors, to: "" }); }} />
          </Field>
          <Field label="Subject" htmlFor="subject" error={mailErrors.subject}>
            <input id="subject" className="adm-input" value={mail.subject} onChange={(e) => setMail({ ...mail, subject: e.target.value })} />
          </Field>
          <Field label="Message" htmlFor="message" error={mailErrors.message} full>
            <textarea id="message" className="adm-input" rows={4} value={mail.message} onChange={(e) => setMail({ ...mail, message: e.target.value })} />
          </Field>
        </div>
        <footer className="adm-card-foot">
          <span className="adm-muted"><Inbox size={14} /> Limited to 5 test emails every 10 minutes.</span>
          <button type="button" className="adm-btn is-accent" onClick={sendTest} disabled={sending || !mail.to}>{sending ? <Spinner /> : <Send size={16} />} Send test email</button>
        </footer>
      </section>

      <p className="adm-foot-note"><Database size={14} /> Source: {config.source === "database" ? "saved in the database" : "environment variables"} · <Fingerprint size={14} /> Every change is recorded in the audit log.</p>
    </div>
  );
}

function Stat({ icon, label, value, hint, tone }: { icon: React.ReactNode; label: string; value: React.ReactNode; hint?: string; tone?: "bad" }) {
  return (
    <div className={`adm-stat${tone ? ` is-${tone}` : ""}`}>
      <span className="adm-stat-icon">{icon}</span>
      <span className="adm-stat-label">{label}</span>
      <span className="adm-stat-value">{value}</span>
      {hint && <small className="adm-muted">{hint}</small>}
    </div>
  );
}

function LoadingView() {
  return (
    <div className="adm-page" aria-busy="true">
      <div className="adm-head"><div><Skeleton h={14} w={160} /><div style={{ height: 10 }} /><Skeleton h={30} w={300} /></div></div>
      <section className="adm-stats">{Array.from({ length: 8 }, (_, i) => <div className="adm-stat" key={i}><Skeleton h={36} w={36} r={10} /><Skeleton h={12} w="60%" /><Skeleton h={20} w="80%" /></div>)}</section>
      <div className="adm-grid-2">{[0, 1].map((i) => <section className="adm-card" key={i}>{Array.from({ length: 6 }, (_, j) => <div key={j} style={{ marginBottom: 14 }}><Skeleton h={12} w="35%" /><div style={{ height: 8 }} /><Skeleton h={44} r={12} /></div>)}</section>)}</div>
    </div>
  );
}
