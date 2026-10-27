import Link from "next/link";
import { Chev } from "@/components/Brand";
import { Photo } from "@/components/Photo";
import { Brighten, Count, CtaBand, CwsAnchor, FaqBlock, Kinetic, PageHero, ProcessTable, Statement } from "@/components/sections";
import type { Card, Img, Pair, Quote, Section } from "@/lib/cws";
import type { Crumb } from "@/lib/seo";

const pad = (i: number) => String(i + 1).padStart(2, "0");

function Head({ s, center = false }: { s: Section; center?: boolean }) {
  return (
    <div className={center ? "cws-head center" : "split-head"}>
      <div>
        {s.eyebrow && <p className="eyebrow reveal">{s.eyebrow}</p>}
        {s.title && <h2 className="h2 kinetic"><Kinetic text={s.title} /></h2>}
      </div>
      {(s.text?.length || s.links?.length) ? (
        <div className="reveal">
          {s.text?.map((t) => <p key={t}>{t}</p>)}
          {s.links?.map((l) => <CwsAnchor key={l.href + l.text} link={l} />)}
        </div>
      ) : null}
    </div>
  );
}

/* ---------- hero ---------- */
export function CwsHero({ s, trail, video }: { s: Section; trail: Crumb[]; video?: string }) {
  const img = s.images?.[0];
  const highlights = (s.stats ?? []).filter((x) => x.length === 2).slice(0, 4) as Pair[];
  return (
    <PageHero
      trail={trail}
      eyebrow={s.eyebrow}
      title={s.title ?? ""}
      intro={s.text ?? []}
      links={s.links}
      image={img?.src}
      alt={img?.alt}
      video={video}
      highlights={highlights}
    />
  );
}

/* ---------- copy blocks ---------- */
/** `photos` float beside the copy on wide screens, each drifting at its own depth (data-speed). */
export function Answer({ s, photos }: { s: Section; photos?: string[] }) {
  return (
    <section className="statement inner cws-answer">
      <span className="aurora" aria-hidden="true" />
      {photos && (
        <div className="float-ph" aria-hidden="true">
          {photos.map((p, i) => (
            <span className="fp" key={p} data-speed={[0.6, 1.2, 0.9, 0.5][i % 4]} style={{ "--i": i } as React.CSSProperties}><Photo name={p} /></span>
          ))}
        </div>
      )}
      {s.eyebrow && <p className="eyebrow-serif">{s.eyebrow}</p>}
      {s.title && <h2 className="h2 center kinetic"><Kinetic text={s.title} /></h2>}
      <div className="cws-answer-body reveal">{s.text?.map((t) => <Brighten key={t} text={t} />)}</div>
    </section>
  );
}

function Prose({ s }: { s: Section }) {
  const [lead, ...rest] = s.text ?? [];
  return (
    <section className="statement inner cws-prose">
      {s.eyebrow && <p className="eyebrow-serif">{s.eyebrow}</p>}
      {s.title && <Statement text={s.title} />}
      {lead && <p className="cws-prose-lead reveal">{lead}</p>}
      <div className="cws-answer-body reveal">{rest.map((t) => <p key={t}>{t}</p>)}</div>
    </section>
  );
}

function Split({ s }: { s: Section }) {
  return (
    <section className={`cws-split container${s.reverse ? " reverse" : ""}`}>
      {s.image && (
        <div className="cws-split-media reveal"><Photo name={s.image.src} alt={s.image.alt} sizes="(min-width: 861px) 50vw, 92vw" /></div>
      )}
      <div className="cws-split-copy">
        {s.eyebrow && <p className="eyebrow reveal">{s.eyebrow}</p>}
        {s.title && <h2 className="h2 kinetic"><Kinetic text={s.title} /></h2>}
        {s.text?.map((t) => <p className="reveal" key={t}>{t}</p>)}
        {s.bullets && s.bullets.length > 0 && (
          <ul className="cws-bullets reveal">
            {s.bullets.map(([b, t]) => <li key={b}><b>{b}</b>{t && <span>{t}</span>}</li>)}
          </ul>
        )}
        {s.links?.map((l) => <CwsAnchor key={l.href + l.text} link={l} />)}
      </div>
    </section>
  );
}

/* ---------- cards ---------- */
function CardBody({ c }: { c: Card }) {
  return (
    <>
      {c.kicker && <small className="cws-kicker">{c.kicker}</small>}
      {c.title && <h3>{c.title}</h3>}
      {c.text?.map((t) => <p key={t}>{t}</p>)}
      {c.list && c.list.length > 0 && <ul className="cws-list">{c.list.map((li) => <li key={li}>{li}</li>)}</ul>}
      {c.meta && c.meta.length > 0 && (
        <dl className="cws-meta">{c.meta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      )}
    </>
  );
}

function CardLink({ c, children, className }: { c: Card; children: React.ReactNode; className: string }) {
  if (!c.href) return <article className={className}>{children}</article>;
  if (/^https?:/.test(c.href)) return <a href={c.href} className={`${className} press`} target="_blank" rel="noopener">{children}</a>;
  return <Link href={c.href} className={`${className} press`}>{children}</Link>;
}

/** Text cards in Elyra's numbered grid: features, strengths, reasons. */
function NumberedCards({ s }: { s: Section }) {
  const items = s.items as Card[];
  return (
    <section className="why container" id={s.id}>
      <Head s={s} center />
      <div className="why-grid">
        {items.map((c, i) => (
          <article className="why-item reveal" key={c.title ?? i}><span className="mono">{pad(i)}</span><CardBody c={c} /></article>
        ))}
      </div>
    </section>
  );
}

/** Photo cards: services, tiles, team, activities. */
function PhotoCards({ s }: { s: Section }) {
  const items = s.items as Card[];
  const cols = items.length === 4 || s.variant === "team" ? " four" : items.length <= 2 ? " two" : "";
  return (
    <section className={`cws-cards-sec container cws-${s.variant}`} id={s.id}>
      <Head s={s} />
      <div className={`cws-cards${cols}`}>
        {items.map((c, i) => (
          <CardLink c={c} key={c.title ?? i} className="cws-card reveal">
            {c.img && <div className="cws-card-media"><Photo name={c.img.src} alt={c.img.alt || c.title} sizes="(min-width: 861px) 33vw, 92vw" /></div>}
            <div className="cws-card-copy">
              <CardBody c={c} />
              {c.href && <span className="link">{c.cta ?? "Explore"} <Chev /></span>}
            </div>
          </CardLink>
        ))}
      </div>
    </section>
  );
}

/** Plain list of places with an optional photo beside it (contact page). */
function Places({ s }: { s: Section }) {
  const items = s.items as Card[];
  const img = s.images?.[0];
  return (
    <section className={`cws-split container${s.title?.startsWith("International") ? " reverse" : ""}`}>
      {img && <div className="cws-split-media reveal"><Photo name={img.src} alt={img.alt} sizes="(min-width: 861px) 50vw, 92vw" /></div>}
      <div className="cws-split-copy">
        {s.eyebrow && <p className="eyebrow reveal">{s.eyebrow}</p>}
        <h2 className="h2 kinetic"><Kinetic text={s.title ?? ""} /></h2>
        <ul className="cws-places reveal">
          {items.map((c) => <li key={c.title}><b>{c.title}</b>{c.kicker && <small>{c.kicker}</small>}</li>)}
        </ul>
      </div>
    </section>
  );
}

export function Cards({ s }: { s: Section }) {
  if (s.variant === "places") return <Places s={s} />;
  const items = s.items as Card[];
  const photos = items.some((c) => c.img) || ["siblings", "group", "solutions", "team-compact"].includes(s.variant ?? "");
  return photos ? <PhotoCards s={s} /> : <NumberedCards s={s} />;
}

/* ---------- numbers, steps, payments ---------- */
export function Stats({ s }: { s: Section }) {
  const items = s.items as string[][];
  return (
    <section className="cws-stats container">
      {s.title && <p className="eyebrow-serif lined">{s.title}</p>}
      <ul className="cws-stats-grid">
        {items.map(([v, l]) => <li className="reveal" key={l}><b data-count><Count value={v} /></b><span>{l}</span></li>)}
      </ul>
    </section>
  );
}

function Steps({ s }: { s: Section }) {
  const items = s.items as { title: string; text: string }[];
  return <ProcessTable title={s.title} id={s.id ?? "steps"} steps={items.map((i) => [i.title, i.text] as Pair)} />;
}

export function Pay({ s }: { s: Section }) {
  const items = s.items as Pair[];
  return (
    <section className="engines container cws-pay">
      <Head s={s} />
      <div className="engine-grid">
        {items.map(([t, d], i) => (
          <article className="engine press reveal" key={t}><span className="eng-ico mono">{pad(i)}</span><h3>{t}</h3><p>{d}</p></article>
        ))}
      </div>
    </section>
  );
}

/* ---------- people and proof ---------- */
export function Quotes({ s }: { s: Section }) {
  const items = s.items as Quote[];
  if (s.variant === "pull") {
    const q = items[0];
    return (
      <section className="cws-pull container">
        <blockquote className="reveal">
          <p>&ldquo;{q.quote}&rdquo;</p>
          <footer><b>{q.name ?? q.by}</b>{q.org && <span>{q.org}</span>}</footer>
        </blockquote>
        {s.links?.map((l) => <CwsAnchor key={l.href} link={l} />)}
      </section>
    );
  }
  return (
    <section className="cws-quotes container" id={s.id}>
      <Head s={s} />
      <div className="cws-quote-grid">
        {items.map((q) => (
          <figure className="cws-quote reveal" key={q.quote}>
            <span className="cws-quote-mark" aria-hidden="true">&ldquo;</span>
            <blockquote><p>{q.quote}</p></blockquote>
            <figcaption><b>{q.name}</b><span>{q.org}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Logos({ s, marquee = false }: { s: Section; marquee?: boolean }) {
  const items = s.items as Img[];
  return (
    <section className={`cws-logos container cws-logos-${s.variant}`}>
      <Head s={s} center />
      {marquee ? (
        <div className="marquee cws-logo-marquee" aria-label={s.title}>
          {[0, 1].map((copy) => (
            <div className="marquee-track" aria-hidden={copy === 1 || undefined} key={copy}>
              {items.map((l) => <span key={l.src}><Photo name={l.src} alt={copy ? "" : l.alt} priority /></span>)}
            </div>
          ))}
        </div>
      ) : (
        <ul className="cws-logo-grid" data-stagger>
          {items.map((l, i) => <li key={l.src} style={{ "--i": i } as React.CSSProperties}><Photo name={l.src} alt={l.alt} /></li>)}
        </ul>
      )}
    </section>
  );
}

export function Founder({ s }: { s: Section }) {
  return (
    <section className="cws-split container cws-founder">
      {s.image && <div className="cws-split-media reveal"><Photo name={s.image.src} alt={s.image.alt} sizes="(min-width: 861px) 40vw, 92vw" /></div>}
      <div className="cws-split-copy">
        {s.eyebrow && <p className="eyebrow reveal">{s.eyebrow}</p>}
        <h2 className="h2 kinetic"><Kinetic text={s.title ?? ""} /></h2>
        {s.role && <p className="cws-role reveal">{s.role}</p>}
        {s.lead && <p className="cws-lead reveal">{s.lead}</p>}
        {s.text?.map((t) => <p className="reveal" key={t}>{t}</p>)}
        {s.links?.map((l) => <CwsAnchor key={l.href} link={l} />)}
      </div>
    </section>
  );
}

function Timeline({ s }: { s: Section }) {
  const items = s.items as Card[];
  return (
    <section className="cws-cards-sec container cws-timeline">
      <Head s={s} />
      <ol className="cws-cards">
        {items.map((c) => (
          <li className="cws-card reveal" key={c.title}>
            {c.img && <div className="cws-card-media"><Photo name={c.img.src} alt={c.img.alt} sizes="(min-width: 861px) 33vw, 92vw" /></div>}
            <div className="cws-card-copy"><b className="cws-year">{c.title}</b>{c.text?.map((t) => <p key={t}>{t}</p>)}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Gallery({ s }: { s: Section }) {
  const items = s.items as Img[];
  return (
    <section className="cws-gallery container">
      <Head s={s} />
      <ul className="cws-gallery-grid">
        {items.map((im) => <li className="reveal" key={im.src}><Photo name={im.src} alt={im.alt} sizes="(min-width: 861px) 25vw, 46vw" /></li>)}
      </ul>
    </section>
  );
}

/* ---------- platform & calls to action ---------- */
export function Genie({ s }: { s: Section }) {
  return (
    <section className="extranet container cws-genie">
      <article className="ext-card reveal">
        <div className="ext-copy">
          {s.eyebrow && <span className="tag">{s.eyebrow}</span>}
          <h2 className="h2">{s.title}</h2>
          {s.text?.map((t) => <p key={t}>{t}</p>)}
          <div className="cta-row left">
            {s.links?.map((l, i) => <CwsAnchor key={l.href + l.text} link={l} className={i === 0 ? "btn-pill press" : "link"} />)}
          </div>
        </div>
        {(s.image || s.bullets?.length) && (
          <div className="cws-genie-side">
            {s.image && <div className="cws-genie-media"><Photo name={s.image.src} alt={s.image.alt} sizes="(min-width: 861px) 40vw, 92vw" /></div>}
            {s.bullets && s.bullets.length > 0 && (
              <ul className="ext-list">{s.bullets.map(([b, t]) => <li key={b}><b>{b}</b>{t && <span>{t}</span>}</li>)}</ul>
            )}
          </div>
        )}
      </article>
    </section>
  );
}

export function Cta({ s, preset }: { s: Section; preset?: string }) {
  return <CtaBand eyebrow={s.eyebrow} title={s.title} text={s.text} links={s.links?.filter((l) => !l.href.startsWith("/contact"))} preset={preset} />;
}

/** Renders one section of a CWS page. The hero is drawn by the page itself. */
export function Block({ s, preset }: { s: Section; preset?: string }) {
  switch (s.kind) {
    case "answer": return <Answer s={s} />;
    case "prose": return <Prose s={s} />;
    case "split": return <Split s={s} />;
    case "cards": return <Cards s={s} />;
    case "steps": return <Steps s={s} />;
    case "stats": return <Stats s={s} />;
    case "faq": return <FaqBlock faq={s.items as Pair[]} title={s.title} />;
    case "quotes": return <Quotes s={s} />;
    case "pay": return <Pay s={s} />;
    case "cta": return <Cta s={s} preset={preset} />;
    case "logos": return <Logos s={s} />;
    case "genie": return <Genie s={s} />;
    case "founder": return <Founder s={s} />;
    case "timeline": return <Timeline s={s} />;
    case "gallery": return <Gallery s={s} />;
    default: return null;
  }
}
