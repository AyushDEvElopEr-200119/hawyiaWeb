"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Code, Eye, FileText, Plus, RotateCcw, Save, Search, Send, Sparkles, Trash2 } from "lucide-react";
import { api, ApiError, Banner, Field, fmtDate, Skeleton, Spinner, Toggle, useConfirm, useDebounced, useToast } from "./ui";

type Template = {
  id: string; key: string; name: string; description: string; subject: string; html: string; text: string;
  variables: string[]; enabled: boolean; system: boolean; updatedAt: string | null; updatedBy: string;
};
type Draft = Pick<Template, "key" | "name" | "description" | "subject" | "html" | "text" | "enabled">;
const NEW: Draft = {
  key: "", name: "", description: "", enabled: true, text: "",
  subject: "Hello {{name}}",
  html: '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#0b1020">\n  <p>Hi {{name}},</p>\n  <p>Write your message here.</p>\n</div>',
};
const toDraft = (t: Template): Draft => ({ key: t.key, name: t.name, description: t.description, subject: t.subject, html: t.html, text: t.text, enabled: t.enabled });

export function TemplatesPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [list, setList] = useState<Template[] | null>(null);
  const [stored, setStored] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selected, setSelected] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const [filter, setFilter] = useState("");
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [preview, setPreview] = useState<{ subject: string; html: string; variables: string[] } | null>(null);
  const [testTo, setTestTo] = useState("");
  const htmlRef = useRef<HTMLTextAreaElement>(null);

  const load = useCallback(async (keep?: string) => {
    try {
      const data = await api<{ templates: Template[]; stored: boolean }>("/api/admin/email/templates/");
      setList(data.templates); setStored(data.stored); setLoadError("");
      const pick = data.templates.find((t) => t.id === keep) ?? data.templates[0];
      if (pick && keep !== "new") { setSelected(pick.id); setDraft(toDraft(pick)); }
    } catch (e) { setLoadError((e as Error).message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const current = list?.find((t) => t.id === selected) ?? null;
  const dirty = selected === "new" ? true : !!(current && draft && JSON.stringify(toDraft(current)) !== JSON.stringify(draft));

  // live preview with sample values
  const debounced = useDebounced(draft ? { subject: draft.subject, html: draft.html, text: draft.text } : null, 450);
  useEffect(() => {
    if (!debounced) return;
    let stale = false;
    api<{ subject: string; html: string; variables: string[] }>("/api/admin/email/templates/preview/", { method: "POST", json: debounced })
      .then((p) => { if (!stale) setPreview(p); })
      .catch(() => {});
    return () => { stale = true; };
  }, [debounced]);

  const choose = async (t: Template | "new") => {
    if (dirty && selected && !(await confirm({ title: "Discard unsaved changes?", text: "Your edits to this template haven't been saved.", confirm: "Discard", danger: true }))) return;
    setErrors({}); setTab("edit");
    if (t === "new") { setSelected("new"); setDraft({ ...NEW }); } else { setSelected(t.id); setDraft(toDraft(t)); }
  };

  const insertVar = (name: string) => {
    const el = htmlRef.current;
    if (!el || !draft) return;
    const token = `{{${name}}}`;
    const [s, e] = [el.selectionStart, el.selectionEnd];
    const html = draft.html.slice(0, s) + token + draft.html.slice(e);
    setDraft({ ...draft, html });
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + token.length, s + token.length); });
  };

  async function save() {
    if (!draft) return;
    setBusy("save");
    try {
      const saved = selected === "new"
        ? await api<Template>("/api/admin/email/templates/", { method: "POST", json: draft })
        : await api<Template>(`/api/admin/email/templates/${selected}/`, { method: "PUT", json: draft });
      setErrors({});
      toast({ kind: "success", title: selected === "new" ? "Template created" : "Template saved" });
      await load(saved.id);
    } catch (e) {
      if (e instanceof ApiError) setErrors(e.fields);
      toast({ kind: "error", title: "Couldn't save", text: (e as Error).message });
    } finally { setBusy(""); }
  }

  async function toggle(t: Template, enabled: boolean) {
    try {
      await api(`/api/admin/email/templates/${t.id}/`, { method: "PUT", json: { enabled } });
      setList((all) => all?.map((x) => (x.id === t.id ? { ...x, enabled } : x)) ?? all);
      if (t.id === selected) setDraft((d) => (d ? { ...d, enabled } : d));
      toast({ kind: "success", title: `${t.name} ${enabled ? "enabled" : "disabled"}` });
    } catch (e) { toast({ kind: "error", title: "Couldn't update", text: (e as Error).message }); }
  }

  async function remove() {
    if (!current) return;
    const warn = current.system ? " This is a built-in template the website uses; it will fall back to its original version." : "";
    if (!(await confirm({ title: `Delete "${current.name}"?`, text: `This can't be undone.${warn}`, confirm: "Delete", danger: true }))) return;
    setBusy("delete");
    try {
      await api(`/api/admin/email/templates/${current.id}/`, { method: "DELETE" });
      toast({ kind: "success", title: "Template deleted" });
      setSelected(null); setDraft(null); await load();
    } catch (e) { toast({ kind: "error", title: "Couldn't delete", text: (e as Error).message }); }
    finally { setBusy(""); }
  }

  async function resetTemplate() {
    if (!current) return;
    if (!(await confirm({ title: "Restore the original?", text: "The subject, HTML and text go back to the built-in version.", confirm: "Restore", danger: true }))) return;
    try {
      const t = await api<Template>(`/api/admin/email/templates/${current.id}/reset/`, { method: "POST" });
      toast({ kind: "success", title: "Template restored" }); await load(t.id);
    } catch (e) { toast({ kind: "error", title: "Couldn't restore", text: (e as Error).message }); }
  }

  async function sendTest() {
    if (!current) return;
    setBusy("test");
    try {
      const data = await api<{ result: { ok: boolean; status?: string; error?: string } }>(`/api/admin/email/templates/${current.id}/test/`, { method: "POST", json: { to: testTo } });
      if (data.result.ok) toast({ kind: "success", title: "Test sent", text: `Sample version of "${current.name}" sent to ${testTo}.` });
      else toast({ kind: "error", title: data.result.status ?? "Not sent", text: data.result.error });
    } catch (e) { toast({ kind: "error", title: "Couldn't send", text: (e as Error).message }); }
    finally { setBusy(""); }
  }

  const shown = useMemo(() => (list ?? []).filter((t) => `${t.name} ${t.key}`.toLowerCase().includes(filter.toLowerCase())), [list, filter]);

  if (loadError) return <Banner kind="bad" title="Templates couldn't be loaded"><p>{loadError}</p></Banner>;

  return (
    <div className="adm-page">
      <div className="adm-head">
        <div>
          <p className="adm-eyebrow"><FileText size={14} /> Communication Settings</p>
          <h1>Email Templates</h1>
          <p className="adm-sub">The emails the website sends. Use <code>{"{{variable}}"}</code> for values filled in when each email goes out.</p>
        </div>
        <div className="adm-head-actions">
          <button type="button" className="adm-btn is-primary" onClick={() => choose("new")} disabled={!stored}><Plus size={16} /> New template</button>
        </div>
      </div>

      {!stored && (
        <Banner kind="info" title="Read-only until the database is connected">
          <p>These are the built-in templates the site uses. Add <code>MONGODB_URI</code> to edit them, create new ones and switch them on or off.</p>
        </Banner>
      )}

      <div className="adm-split">
        <aside className="adm-card adm-tpl-list" aria-label="Templates">
          <div className="adm-search"><Search size={16} /><input aria-label="Search templates" placeholder="Search templates" value={filter} onChange={(e) => setFilter(e.target.value)} /></div>
          {!list ? (
            <ul>{Array.from({ length: 7 }, (_, i) => <li key={i} className="adm-tpl-item"><Skeleton h={14} w="70%" /><Skeleton h={10} w="45%" /></li>)}</ul>
          ) : (
            <ul>
              {selected === "new" && <li><button type="button" className="adm-tpl-item is-active"><b>New template</b><small>unsaved</small></button></li>}
              {shown.map((t) => (
                <li key={t.id}>
                  <div className={`adm-tpl-item${t.id === selected ? " is-active" : ""}`}>
                    <button type="button" className="adm-tpl-pick" onClick={() => choose(t)}>
                      <b>{t.name}</b>
                      <small><code>{t.key}</code>{t.system && <span className="adm-chip">Built-in</span>}</small>
                    </button>
                    <Toggle id={`tpl-${t.id}`} checked={t.enabled} onChange={(v) => toggle(t, v)} label="" disabled={!stored} />
                  </div>
                </li>
              ))}
              {list && !shown.length && <li className="adm-empty">No templates match.</li>}
            </ul>
          )}
        </aside>

        <section className="adm-card adm-tpl-editor">
          {!draft ? (
            <div className="adm-empty is-big"><Sparkles size={22} /><p>Choose a template to edit.</p></div>
          ) : (
            <>
              <header className="adm-card-head">
                <div>
                  <h2>{selected === "new" ? "New template" : current?.name}</h2>
                  <p>{current ? <>Key <code>{current.key}</code> · updated {fmtDate(current.updatedAt)}{current.updatedBy ? ` by ${current.updatedBy}` : ""}</> : "Create an email the site can send by key."}</p>
                </div>
                <div className="adm-tabs" role="tablist">
                  <button type="button" role="tab" aria-selected={tab === "edit"} className={tab === "edit" ? "is-active" : ""} onClick={() => setTab("edit")}><Code size={15} /> Edit</button>
                  <button type="button" role="tab" aria-selected={tab === "preview"} className={tab === "preview" ? "is-active" : ""} onClick={() => setTab("preview")}><Eye size={15} /> Preview</button>
                </div>
              </header>

              {tab === "edit" ? (
                <div className="adm-form">
                  <Field label="Name" htmlFor="tpl-name" error={errors.name}><input id="tpl-name" className="adm-input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} disabled={!stored} /></Field>
                  <Field label="Key" htmlFor="tpl-key" error={errors.key} hint="Used in code: sendEmail({ template: key })">
                    <input id="tpl-key" className="adm-input is-mono" value={draft.key} onChange={(e) => setDraft({ ...draft, key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_") })} disabled={!stored || !!current?.system} />
                  </Field>
                  <Field label="Description" htmlFor="tpl-desc" full><input id="tpl-desc" className="adm-input" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} disabled={!stored} /></Field>
                  <Field label="Subject" htmlFor="tpl-subject" error={errors.subject} full><input id="tpl-subject" className="adm-input" value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} disabled={!stored} /></Field>
                  <div className="adm-field is-full">
                    <span className="adm-label">Variables <small className="adm-muted">click to insert into the HTML</small></span>
                    <div className="adm-chips">
                      {(preview?.variables ?? current?.variables ?? []).map((v) => <button type="button" key={v} className="adm-chip is-button" onClick={() => insertVar(v)} disabled={!stored}>{`{{${v}}}`}</button>)}
                      {["name", "email", "otp", "orderId"].filter((v) => !(preview?.variables ?? []).includes(v)).map((v) => <button type="button" key={v} className="adm-chip is-button is-faint" onClick={() => insertVar(v)} disabled={!stored}>{`+ {{${v}}}`}</button>)}
                    </div>
                  </div>
                  <Field label="HTML" htmlFor="tpl-html" error={errors.html} hint="{{name}} is escaped; {{{name}}} inserts trusted HTML." full>
                    <textarea id="tpl-html" ref={htmlRef} className="adm-input is-code" rows={16} spellCheck={false} value={draft.html} onChange={(e) => setDraft({ ...draft, html: e.target.value })} disabled={!stored} />
                  </Field>
                  <Field label="Plain-text version" htmlFor="tpl-text" hint="Shown by email apps that don't display HTML. Leave empty to generate it." full>
                    <textarea id="tpl-text" className="adm-input is-code" rows={5} value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} disabled={!stored} />
                  </Field>
                  <Toggle id="tpl-enabled" checked={draft.enabled} onChange={(v) => setDraft({ ...draft, enabled: v })} label={draft.enabled ? "Enabled" : "Disabled"} disabled={!stored} />
                </div>
              ) : (
                <div className="adm-preview">
                  <p className="adm-preview-subject"><span>Subject</span> {preview?.subject ?? "…"}</p>
                  <iframe title="Email preview" sandbox="" srcDoc={preview?.html ?? ""} />
                  <p className="adm-muted">Preview uses sample values. Scripts and forms are blocked.</p>
                </div>
              )}

              <footer className="adm-card-foot is-wrap">
                <div className="adm-inline">
                  {current && (
                    <>
                      <input className="adm-input is-sm" type="email" placeholder="Send a test to…" aria-label="Test recipient" value={testTo} onChange={(e) => setTestTo(e.target.value)} />
                      <button type="button" className="adm-btn is-ghost is-sm" onClick={sendTest} disabled={!testTo || busy === "test" || dirty}>{busy === "test" ? <Spinner /> : <Send size={15} />} Send test</button>
                    </>
                  )}
                </div>
                <div className="adm-inline">
                  {current?.system && <button type="button" className="adm-btn is-ghost is-sm" onClick={resetTemplate} disabled={!stored}><RotateCcw size={15} /> Restore original</button>}
                  {current && <button type="button" className="adm-btn is-danger-ghost is-sm" onClick={remove} disabled={!stored || busy === "delete"}><Trash2 size={15} /> Delete</button>}
                  <button type="button" className="adm-btn is-primary" onClick={save} disabled={!stored || !dirty || busy === "save"}>{busy === "save" ? <Spinner /> : <Save size={16} />} {selected === "new" ? "Create template" : "Save template"}</button>
                </div>
              </footer>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
