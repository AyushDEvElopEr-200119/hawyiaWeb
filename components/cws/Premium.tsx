import Link from "next/link";
import { Chev } from "@/components/Brand";
import { BgVideo, Photo } from "@/components/Photo";
import { Count, Kinetic } from "@/components/sections";
import type { Section } from "@/lib/cws";
import { inner, spotIndex, type BentoBlock, type ChaptersBlock, type Tile } from "@/lib/inner";

const pad = (i: number) => String(i + 1).padStart(2, "0");

/** One photo or film. `manual` films are played by their section, not by visibility. */
function Media({ media, video, alt, manual = false, sizes }: { media: string; video?: string; alt: string; manual?: boolean; sizes?: string }) {
  return (
    <>
      <Photo name={media} alt={video ? "" : alt} sizes={sizes} />
      {video && <BgVideo name={video} poster={media.startsWith("/") ? media : undefined} manual={manual} />}
    </>
  );
}

/* ---------- chapters: the photo column stays put while the story scrolls past it ----------
   Desktop: a sticky stage cross-fades to each chapter's photo or film as that chapter reaches
   the middle of the screen, and a segmented bar tracks progress through it (initSite: chapters).
   Phones: every chapter carries its own photo inline and the stage is not drawn. */
export function Chapters({ b }: { b: ChaptersBlock }) {
  return (
    <section className="chapters container" data-chapters aria-label={b.title}>
      <div className="ch-head">
        <p className="eyebrow reveal">{b.eyebrow}</p>
        <h2 className="h2 kinetic"><Kinetic text={b.title} /></h2>
        {b.intro && <p className="ch-intro reveal">{b.intro}</p>}
      </div>
      <div className="ch-body">
        <div className="ch-stage" aria-hidden="true">
          <div className="ch-frame">
            {b.items.map((c, i) => (
              <div className={`ch-layer${i === 0 ? " on" : ""}`} key={c.title}>
                <Media media={c.media} video={c.video} alt={c.alt} manual sizes="(min-width: 861px) 50vw, 1px" />
              </div>
            ))}
            <div className="ch-bars">{b.items.map((c) => <span key={c.title}><i /></span>)}</div>
            <p className="ch-caption">
              {b.items.map((c, i) => <span className={i === 0 ? "on" : ""} key={c.title}>{c.caption ?? c.kicker}</span>)}
            </p>
          </div>
        </div>
        <ol className="ch-steps">
          {b.items.map((c, i) => (
            <li className={`ch-step${i === 0 ? " on" : ""}`} key={c.title}>
              <div className="ch-inline"><Media media={c.media} video={c.video} alt={c.alt} sizes="92vw" /></div>
              <span className="ch-no mono">{pad(i)} — {c.kicker}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              {c.points && <ul className="ch-points">{c.points.map((p) => <li key={p}>{p}</li>)}</ul>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- bento: a grid of unequal tiles — a film, photos, a figure, a note, a checklist ---------- */
function TileBody({ t }: { t: Tile }) {
  switch (t.kind) {
    case "film":
    case "photo":
      return (
        <>
          <div className="bt-media"><Media media={t.media!} video={t.video} alt={t.alt ?? t.title ?? ""} sizes="(min-width: 861px) 50vw, 92vw" /></div>
          <div className="bt-glass">
            {t.kicker && <small className="mono">{t.kicker}</small>}
            {t.title && <h3>{t.title}</h3>}
            {t.text && <p>{t.text}</p>}
          </div>
        </>
      );
    case "stat":
      return (
        <>
          {t.kicker && <small className="mono">{t.kicker}</small>}
          <b className="bt-figure" data-count><Count value={t.value!} /></b>
          {t.title && <h3>{t.title}</h3>}
          {t.text && <p>{t.text}</p>}
        </>
      );
    case "list":
      return (
        <>
          {t.kicker && <small className="mono">{t.kicker}</small>}
          {t.title && <h3>{t.title}</h3>}
          <ul className="bt-checks">{t.items?.map((x) => <li key={x}>{x}</li>)}</ul>
        </>
      );
    default:
      return (
        <>
          {t.kicker && <small className="mono">{t.kicker}</small>}
          {t.title && <h3 className="bt-quote">{t.title}</h3>}
          {t.text && <p>{t.text}</p>}
          {t.href && <Link href={t.href} className="link">{t.cta ?? "Find out more"} <Chev /></Link>}
        </>
      );
  }
}

export function Bento({ b }: { b: BentoBlock }) {
  return (
    <section className="bento-sec container" aria-label={b.title}>
      <div className="cws-head center">
        <div>
          <p className="eyebrow reveal">{b.eyebrow}</p>
          <h2 className="h2 kinetic"><Kinetic text={b.title} /></h2>
        </div>
        {b.intro && <p className="reveal">{b.intro}</p>}
      </div>
      <div className="bento-grid">
        {b.tiles.map((t, i) => (
          <article className={`bt bt-${t.kind}${t.size ? ` bt-${t.size}` : ""} reveal`} key={i}>
            <TileBody t={t} />
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- ribbon: two lines of oversized words drifting in opposite directions; scroll speed
   leans them (initSite: ribbon). Decorative — the same words are said elsewhere on the page. ---------- */
export function Ribbon({ words }: { words: string[] }) {
  const rows = [words, [...words.slice(Math.ceil(words.length / 2)), ...words.slice(0, Math.ceil(words.length / 2))]];
  return (
    <section className="ribbon" aria-hidden="true">
      <div className="ribbon-lean">
        {rows.map((row, r) => (
          <div className={`ribbon-row${r ? " rev" : ""}`} key={r}>
            {[0, 1].map((copy) => (
              <div className="ribbon-track" key={copy}>
                {row.map((w) => <span key={w}>{w}<i /></span>)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/** The page's extra blocks (lib/inner.ts), grouped by the section index each one goes in front of. */
export function extrasFor(slug: string, sections: Section[]): Map<number, React.ReactNode[]> {
  const x = inner[slug];
  const out = new Map<number, React.ReactNode[]>();
  if (!x) return out;
  const put = (i: number | undefined, node: React.ReactNode) => {
    if (i === undefined) return;
    out.set(i, [...(out.get(i) ?? []), node]);
  };
  if (x.ribbon) put(spotIndex(sections, x.ribbon.before), <Ribbon key="ribbon" words={x.ribbon.words} />);
  if (x.chapters) put(spotIndex(sections, x.chapters.before), <Chapters key="chapters" b={x.chapters} />);
  if (x.bento) put(spotIndex(sections, x.bento.before), <Bento key="bento" b={x.bento} />);
  return out;
}
