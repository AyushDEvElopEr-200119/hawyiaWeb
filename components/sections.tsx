import Link from "next/link";
import { Fragment } from "react";
import { company } from "@/lib/site";
import type { CwsLink, Pair } from "@/lib/cws";
import type { Crumb } from "@/lib/seo";
import { Chev } from "./Brand";
import { BgVideo, Photo } from "./Photo";

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

/** Heading words, each rising out of its own mask when the heading scrolls in (.kinetic). */
export function Kinetic({ text }: { text: string }) {
  return (
    <>
      {text.split(/\s+/).map((w, i) => (
        <Fragment key={i}>{i > 0 && " "}<span className="kw" style={{ "--i": i } as React.CSSProperties}><span>{w}</span></span></Fragment>
      ))}
    </>
  );
}

/** Body copy whose words brighten as it scrolls past, like a Statement but at reading size. */
export function Brighten({ text }: { text: string }) {
  return (
    <p data-brighten>
      {text.split(/\s+/).map((w, i) => (
        <Fragment key={i}>{i > 0 && " "}<span className="sw">{w}</span></Fragment>
      ))}
    </p>
  );
}

/** A figure that counts up when it scrolls in. The final value is always rendered (and holds the
    width, so nothing reflows); the motion script writes the running count into the empty slot. */
export function Count({ value }: { value: string }) {
  return <><span className="cnt" aria-hidden="true" /><span className="cnt-final">{value}</span></>;
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
export function PageHero({ trail, eyebrow, title, intro, ctas = true, links, image, alt, video, highlights = [] }: {
  trail: Crumb[]; eyebrow?: string; title: string; intro: string | string[]; ctas?: boolean; links?: CwsLink[];
  /** a film (lib/media.ts) that plays over the photo once it can */
  image?: string; alt?: string; video?: string; highlights?: Pair[];
}) {
  const paras = Array.isArray(intro) ? intro : [intro];
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
            {paras.map((p) => <p key={p}>{p}</p>)}
            {ctas && (
              <div className="cta-row left">
                {links?.length ? (
                  links.map((l, i) => <CwsAnchor key={l.href + l.text} link={l} className={i === 0 ? "btn-pill press" : "link"} />)
                ) : (
                  <>
                    <Link href="/contact/#enquire" className="btn-pill press">Start an enquiry <Chev /></Link>
                    <a href={`https://wa.me/${company.whatsapp}`} className="link" target="_blank" rel="noopener">WhatsApp us <Chev /></a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="xp ph-stage" data-expand>
        <div className="ph-media xp-frame" data-ph-media>
          {image && <Photo name={image} alt={alt} className="ph-bg" priority />}
          {video && <BgVideo name={video} poster={`/assets/media/${video}-poster.jpg`} eager />}
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
      <h2 className="h2 center kinetic"><Kinetic text={title} /></h2>
      <div className="faq-list">
        {faq.map(([q, a]) => (
          <details className="reveal" key={q}><summary>{q}</summary>{a.split(/\n\n+/).map((x) => <p key={x}>{x}</p>)}</details>
        ))}
      </div>
    </section>
  );
}

export function ProcessTable({ steps, title = "How we work", id = "process" }: { steps: Pair[]; title?: string; id?: string }) {
  return (
    <section className="process container" id={id}>
      <h2 className="h2 center kinetic"><Kinetic text={title} /></h2>
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

/* ---------------- links ---------------- */
/** A link from the CWS content: internal paths use the router, everything else opens normally. */
export function CwsAnchor({ link, className = "link" }: { link: CwsLink; className?: string }) {
  const external = /^https?:/.test(link.href);
  if (!external && link.href.startsWith("/")) return <Link href={link.href} className={className}>{link.text} <Chev /></Link>;
  return (
    <a href={link.href} className={className} {...(external ? { target: "_blank", rel: "noopener" } : {})}>{link.text} <Chev /></a>
  );
}

/* ---------------- forms ---------------- */
export const departments = ["Hotel & Accommodation", "Car Rentals", "MICE & Events", "Relocation & Logistics", "Travgenie Demo", "Leisure Holidays", "General Enquiry"];

/** Enquiry form. Validation and sending are wired by the motion controller. Set `endpoint`
    to your form handler (CRM, email service); without it the form opens a pre-filled email.
    `departments={false}` drops the "which team" question (the partner form). */
export function LeadForm({ id = "leadForm", submit = "Send enquiry", preset = "", endpoint = "", withDepartment = true }: { id?: string; submit?: string; preset?: string; endpoint?: string; withDepartment?: boolean }) {
  return (
    <form className="lead reveal" id={id} noValidate data-endpoint={endpoint} data-mailto={company.email}>
      <div className="f"><label htmlFor={`${id}-name`}>Name *</label><input id={`${id}-name`} name="name" autoComplete="name" required /><small className="err" aria-live="polite" /></div>
      <div className="f"><label htmlFor={`${id}-email`}>Work email *</label><input id={`${id}-email`} name="email" type="email" autoComplete="email" required /><small className="err" aria-live="polite" /></div>
      <div className="f"><label htmlFor={`${id}-phone`}>Phone *</label><input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" required /></div>
      {withDepartment ? (
        <div className="f"><label htmlFor={`${id}-dept`}>Which team do you need? *</label>
          <select id={`${id}-dept`} name="department" defaultValue={preset}><option value="">Choose a department</option>{departments.map((o) => <option key={o}>{o}</option>)}</select></div>
      ) : (
        <div className="f"><label htmlFor={`${id}-company`}>Property or company</label><input id={`${id}-company`} name="company" autoComplete="organization" /></div>
      )}
      <div className="f full"><label htmlFor={`${id}-msg`}>Message</label><textarea id={`${id}-msg`} name="message" rows={4} /></div>
      <div className="f full actions">
        <button type="submit" className="btn-pill press">{submit} <Chev /></button>
        <p className="form-status" role="status" />
      </div>
      <p className="f full form-note">We reply to every enquiry. Nothing here is added to a marketing list.</p>
    </form>
  );
}

export function CtaBand({ eyebrow = "Talk to us", title = "Tell us where your people need to be.", text = "Send us your travel pattern — routes, volumes, the policy you are working to — and we will come back with a costed programme, not a brochure.", links = [], preset = "", id = "enquire", withDepartment = true }: {
  eyebrow?: string; title?: string; text?: string | string[]; links?: CwsLink[]; preset?: string; id?: string; withDepartment?: boolean;
}) {
  const paras = Array.isArray(text) ? text : [text];
  return (
    <section className="cta-band container" id={id}>
      <div className="cta-band-inner">
        <div className="cta-band-copy reveal">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="h2 kinetic"><Kinetic text={title} /></h2>
          {paras.map((p) => <p key={p}>{p}</p>)}
          <ul className="cta-contact">
            <li><small>Call</small><a href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone}</a></li>
            <li><small>Call</small><a href={`tel:${company.mobile.replace(/\s/g, "")}`}>{company.mobile}</a></li>
            <li><small>Email</small><a href={`mailto:${company.email}`}>{company.email}</a></li>
            <li><small>Corporate head office</small><span>{company.address}</span></li>
          </ul>
          {links.length > 0 && (
            <div className="cta-row left">{links.map((l) => <CwsAnchor key={l.href + l.text} link={l} />)}</div>
          )}
        </div>
        <LeadForm id={`${id}-form`} submit="Send enquiry" preset={preset} withDepartment={withDepartment} />
      </div>
    </section>
  );
}
