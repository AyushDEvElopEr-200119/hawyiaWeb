import Link from "next/link";
import { Fragment } from "react";
import { company } from "@/lib/site";
import type { Pair } from "@/lib/content";
import type { Crumb } from "@/lib/seo";
import { Chev } from "./Brand";
import { Photo } from "./Photo";
import { ChoiceCards } from "./cinematic";

/* ---------------- structured data ---------------- */
export function JsonLd({ data }: { data: object | object[] }) {
  const list = Array.isArray(data) ? data : [data];
  return (
    <>
      {list.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
    </>
  );
}

/* ---------------- text helpers ---------------- */
/** Title text where "<br />" marks a line break; each word becomes a span the hero animates. */
export function SplitTitle({ text }: { text: string }) {
  const lines = text.split(/<br\s*\/?>/);
  let n = 0;   // word index across lines, so CSS can stagger the rise (--i)
  return (
    <>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.trim().split(/\s+/).map((w, wi) => (
            <Fragment key={wi}>{wi > 0 && " "}<span className="w" style={{ "--i": n++ } as React.CSSProperties}>{w}</span></Fragment>
          ))}
        </Fragment>
      ))}
    </>
  );
}

/** A large statement whose words brighten one by one as it scrolls past. */
export function Statement({ text, className = "" }: { text: string; className?: string }) {
  return (
    <h2 className={`statement-text reveal ${className}`}>
      {text.split(/\s+/).map((w, i) => (
        <Fragment key={i}>{i > 0 && " "}<span className="sw">{w}</span></Fragment>
      ))}
    </h2>
  );
}

/* ---------------- navigation aids ---------------- */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {trail.map((t) => (
        <Fragment key={t.label}>
          <span>/</span>
          {t.href ? <Link href={t.href}>{t.label}</Link> : <span aria-current="page">{t.label}</span>}
        </Fragment>
      ))}
    </nav>
  );
}

/* ---------------- page hero ---------------- */
/** Inner-page hero: serif title and intro, then a full photo band (it expands to fill the
    screen as you scroll) with a glass strip of three real highlights for the page. */
export function PageHero({ trail, eyebrow, title, intro, ctas = true, image, highlights = [] }: {
  trail: Crumb[]; eyebrow?: string; title: string; intro: string; ctas?: boolean; image?: string; highlights?: Pair[];
}) {
  return (
    <section className="page-hero">
      <div className="container ph-head">
        <Breadcrumbs trail={trail} />
        <div className="ph-split">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1 className="ph-title" data-split><SplitTitle text={title} /></h1>
          </div>
          <div className="ph-intro">
            <p>{intro}</p>
            {ctas && (
              <div className="cta-row left">
                <Link href="/request-demo/" className="btn-pill press">Request a Demo <Chev /></Link>
                <Link href="/contact/" className="link">Get a quote <Chev /></Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="xp ph-stage" data-expand>
        <div className="ph-media xp-frame" data-ph-media>
          {image && <Photo name={image} className="ph-bg" priority />}
          {highlights.length > 0 && (
            <ul className="ph-highlights" data-ph-hl>
              {highlights.map(([t, d], i) => (
                <li key={t}><span className="mono">{String(i + 1).padStart(2, "0")}</span><b>{t}</b><p>{d}</p></li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- content blocks ---------------- */
export function FaqBlock({ faq, title = "Questions, answered", id = "faq" }: { faq: Pair[]; title?: string; id?: string }) {
  return (
    <section className="faq container" id={id}>
      <h2 className="h2 center reveal">{title}</h2>
      <div className="faq-list">
        {faq.map(([q, a]) => (
          <details className="reveal" key={q}><summary>{q}</summary><p>{a}</p></details>
        ))}
      </div>
    </section>
  );
}

export function ProcessTable({ steps, title = "How we work", id = "process" }: { steps: Pair[]; title?: string; id?: string }) {
  return (
    <section className="process container" id={id}>
      <h2 className="h2 center reveal">{title}</h2>
      <div className="table">
        {steps.map(([b, m], i) => (
          <div className="tr reveal" key={b}><span className="mono">{String(i + 1).padStart(2, "0")}</span><b>{b}</b><span className="muted">{m}</span></div>
        ))}
      </div>
    </section>
  );
}

export function CardGrid({ items }: { items: Pair[] }) {
  return (
    <div className="engine-grid">
      {items.map(([t, d], i) => (
        <article className="engine press reveal" key={t}><span className="eng-ico mono">{String(i + 1).padStart(2, "0")}</span><h3>{t}</h3><p>{d}</p></article>
      ))}
    </div>
  );
}

/** Tabs whose panels list features. Selection and the sliding indicator are wired by the motion controller. */
export function TabsBlock({ id, groups }: { id: string; groups: Record<string, string[]> }) {
  const keys = Object.keys(groups);
  return (
    <>
      <div className="tabs reveal" role="tablist" data-tabs>
        <span className="tab-ind" aria-hidden="true" />
        {keys.map((k, i) => (
          <button key={k} role="tab" id={`${id}-t${i}`} aria-controls={`${id}-p${i}`} aria-selected={i === 0} tabIndex={i === 0 ? 0 : -1}>{k}</button>
        ))}
      </div>
      <div className="panels">
        {keys.map((k, i) => (
          <div key={k} className={`panel${i === 0 ? " is-on" : ""}`} role="tabpanel" id={`${id}-p${i}`} aria-labelledby={`${id}-t${i}`} hidden={i !== 0}>
            {groups[k].map((f) => <div className="feat" key={f}><h3>{f}</h3></div>)}
          </div>
        ))}
      </div>
    </>
  );
}

export function RelatedCards({ items, base }: { items: { slug: string; name: string; short: string }[]; base: string }) {
  return (
    <section className="related container">
      <p className="eyebrow-serif">Related</p>
      <div className="sol-grid three">
        {items.map((s) => (
          <Link href={`${base}${s.slug}/`} className="sol press reveal" key={s.slug}>
            <small>{s.short}</small><h3>{s.name}</h3><span className="link">Explore <Chev /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Engagement() {
  return (
    <ChoiceCards title="Engagement models" items={[
      { tag: "A", title: "Fixed scope", text: "A defined scope, timeline and price. Best when requirements are clear." },
      { tag: "B", title: "Milestones", text: "Delivered and paid in stages, with reviews at each milestone. Best for larger builds." },
      { tag: "C", title: "Dedicated team", text: "Developers working as part of your team, month to month.", link: { href: "/hire-developers/", label: "Hire developers" } },
    ]} />
  );
}

export const footnote = <p className="fineprint container">Feature availability depends on chosen product, supplier contracts, integrations and requirements.</p>;

/* ---------------- forms ---------------- */
const businessTypes = ["Travel agency", "OTA", "Tour operator", "DMC", "Corporate travel / TMC", "Consolidator / wholesaler", "Travel startup", "Other"];
const needs = ["White-label platform", "Custom development", "API integration", "Extranet / CMS", "Mobile app", "Hire developers", "Not sure yet"];
const timelines = ["As soon as possible", "1–3 months", "3–6 months", "6+ months", "Just exploring"];

/** Enquiry form. Validation and sending are wired by the motion controller. Set `endpoint`
    to your form handler (CRM, email service); without it the form opens a pre-filled email. */
export function LeadForm({ id = "leadForm", submit = "Request a Demo", preset = "", endpoint = "" }: { id?: string; submit?: string; preset?: string; endpoint?: string }) {
  return (
    <form className="lead reveal" id={id} noValidate data-endpoint={endpoint} data-mailto={company.email}>
      <div className="f"><label htmlFor={`${id}-name`}>Full name</label><input id={`${id}-name`} name="name" autoComplete="name" required /><small className="err" aria-live="polite" /></div>
      <div className="f"><label htmlFor={`${id}-email`}>Business email</label><input id={`${id}-email`} name="email" type="email" autoComplete="email" required /><small className="err" aria-live="polite" /></div>
      <div className="f"><label htmlFor={`${id}-company`}>Company</label><input id={`${id}-company`} name="company" autoComplete="organization" /></div>
      <div className="f"><label htmlFor={`${id}-country`}>Country</label><input id={`${id}-country`} name="country" autoComplete="country-name" /></div>
      <div className="f"><label htmlFor={`${id}-phone`}>Phone or WhatsApp</label><input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" /></div>
      <div className="f"><label htmlFor={`${id}-type`}>Type of travel business</label>
        <select id={`${id}-type`} name="business" defaultValue=""><option value="">Select…</option>{businessTypes.map((o) => <option key={o}>{o}</option>)}</select></div>
      <div className="f"><label htmlFor={`${id}-need`}>What do you need?</label>
        <select id={`${id}-need`} name="need" defaultValue={preset}><option value="">Select…</option>{needs.map((o) => <option key={o}>{o}</option>)}</select></div>
      <div className="f"><label htmlFor={`${id}-timeline`}>Estimated timeline</label>
        <select id={`${id}-timeline`} name="timeline" defaultValue=""><option value="">Select…</option>{timelines.map((o) => <option key={o}>{o}</option>)}</select></div>
      <div className="f full"><label htmlFor={`${id}-msg`}>Project requirements</label><textarea id={`${id}-msg`} name="message" rows={4} placeholder="Products, markets, suppliers, integrations…" /></div>
      <div className="f full actions">
        <button type="submit" className="btn-pill press">{submit} <Chev /></button>
        <p className="form-status" role="status" />
      </div>
    </form>
  );
}

export function CtaBand({ title = "Let's scope your platform", text = "Tell us what you sell and who you sell to. We'll recommend the fastest route and send a timeline.", preset = "" }: { title?: string; text?: string; preset?: string }) {
  return (
    <section className="cta-band container" id="enquire">
      <div className="cta-band-inner">
        <div className="cta-band-copy reveal">
          <h2 className="h2">{title}</h2>
          <p>{text}</p>
          <ul className="ticks">
            <li>Reply within one business day</li>
            <li>Live demo on your own use case</li>
            <li>No obligation proposal</li>
          </ul>
        </div>
        <LeadForm id="enq" submit="Send enquiry" preset={preset} />
      </div>
    </section>
  );
}
