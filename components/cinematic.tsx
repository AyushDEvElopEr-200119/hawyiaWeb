import Link from "next/link";
import type { CSSProperties } from "react";
import type { Pair } from "@/lib/content";
import { Chev } from "./Brand";
import { Photo } from "./Photo";

/* Visual building blocks for the solution pages: fewer text boxes, more picture. */

const pad = (i: number) => String(i + 1).padStart(2, "0");

/** "Built for" set as one large sentence, each audience a pill inside the line. */
export function WhoLine({ who }: { who: string[] }) {
  return (
    <section className="who-line container">
      <p className="eyebrow reveal">Who it&apos;s for</p>
      <p className="wl-text reveal">
        Built for{" "}
        {who.map((w, i) => (
          <span key={w}>
            <em>{/^[A-Z][a-z]/.test(w) ? w[0].toLowerCase() + w.slice(1) : w}</em>
            {i < who.length - 2 ? ", " : i === who.length - 2 ? " and " : "."}
          </span>
        ))}
      </p>
    </section>
  );
}

/** Dark full-bleed band over the page photo: the modules read like a film's chapter list. */
export function ModuleCinema({ title, intro, image, modules }: { title: string; intro: string; image: string; modules: Pair[] }) {
  return (
    <section className="cine">
      <div className="cine-media" aria-hidden="true"><Photo name={image} className="cine-bg" /></div>
      <div className="cine-inner container">
        <div className="cine-head">
          <p className="eyebrow">Inside the platform</p>
          <h2 className="h2 reveal">{title}</h2>
          <p className="reveal">{intro}</p>
        </div>
        <ol className="cine-list">
          {modules.map(([t, d], i) => (
            <li className="reveal" key={t}>
              <span className="cine-num">{pad(i)}</span>
              <div><h3>{t}</h3><p>{d}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const roleIcon: Record<string, string> = { Traveler: "✈", Agent: "⌘", Admin: "◎" };
const roleLabel: Record<string, string> = { Traveler: "For travellers", Agent: "For agents", Admin: "For your team" };

/** One card per user type, side by side, instead of hiding two of them behind tabs. */
export function Personas({ groups }: { groups: Record<string, string[]> }) {
  const keys = Object.keys(groups);
  return (
    <section className="personas container">
      <h2 className="h2 center reveal">Features for every user</h2>
      <p className="sub reveal">What travellers, agents and your own team get out of the box.</p>
      <div className="pers-grid">
        {keys.map((k, i) => (
          <article className={`pers reveal${i === 1 ? " pers-dark" : ""}`} key={k}>
            <span className="pers-ico" aria-hidden="true">{roleIcon[k] ?? "•"}</span>
            <p className="pers-label">{roleLabel[k] ?? k}</p>
            <h3>{k}</h3>
            <ul>{groups[k].map((f) => <li key={f}>{f}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  );
}

const tones: [string, string][] = [
  ["#0f3b36", "#5fb3a5"], ["#14303f", "#6aa9c4"], ["#2e2a40", "#b6a6e0"], ["#3a2a1f", "#e0b48a"], ["#23352a", "#9cc79a"],
];

export type ExtraStyle = "rail" | "duo" | "bento" | "steps";

/** An extra section on a solution page, drawn in one of four visual layouts. */
export function ExtraSection({ title, intro, items, style = "bento" }: { title: string; intro: string; items: Pair[]; style?: ExtraStyle }) {
  return (
    <section className={`xs xs-${style} container`}>
      <div className="split-head">
        <h2 className="h2 reveal">{title}</h2>
        <p className="reveal">{intro}</p>
      </div>
      {style === "rail" && (
        <div className="rail" tabIndex={0} aria-label={title}>
          {items.map(([t, d], i) => {
            const [g1, g2] = tones[i % tones.length];
            return (
              <article className="rail-card reveal" style={{ "--g1": g1, "--g2": g2 } as CSSProperties} key={t}>
                <span className="rail-big" aria-hidden="true">{t.split(/[ /]/)[0]}</span>
                <div className="rail-glass"><small>{pad(i)}</small><h3>{t}</h3><p>{d}</p></div>
              </article>
            );
          })}
        </div>
      )}
      {style === "duo" && (
        <div className="duo">
          {items.map(([t, d], i) => (
            <article className={`duo-card reveal${i % 3 === 0 ? " is-dark" : ""}`} key={t}>
              <span className="duo-num">{pad(i)}</span><h3>{t}</h3><p>{d}</p>
            </article>
          ))}
        </div>
      )}
      {style === "bento" && (
        <div className="bx">
          {items.map(([t, d], i) => (
            <article className={`bx-card reveal${i === 0 ? " bx-hero" : ""}`} key={t}>
              <span className="mono">{pad(i)}</span><h3>{t}</h3><p>{d}</p>
            </article>
          ))}
        </div>
      )}
      {style === "steps" && <StepLine steps={items} />}
    </section>
  );
}

/** Numbered stops on a single line: a journey rather than a table. */
export function StepLine({ steps }: { steps: Pair[] }) {
  const n = steps.length;
  const cols = n <= 5 ? n : n % 5 === 0 ? 5 : n % 3 === 0 ? 3 : 4;
  return (
    <ol className="stepline" style={{ "--n": cols } as CSSProperties}>
      {steps.map(([t, d], i) => (
        <li className={`reveal${(i + 1) % cols === 0 ? " sl-end" : ""}`} key={t}>
          <span className="sl-dot">{pad(i)}</span>
          <h3>{t.replace(/^\d+\.\s*/, "")}</h3>
          <p>{d}</p>
        </li>
      ))}
    </ol>
  );
}

/** Supplier categories drifting past, with direct links underneath. */
export function IntegrationReel({ items }: { items: { href: string; label: string }[] }) {
  return (
    <section className="reel">
      <div className="split-head container">
        <h2 className="h2 reveal">Supported integrations</h2>
        <p className="reveal">Connect the suppliers and payment providers you work with. Integrations are subject to supplier access and agreements.</p>
      </div>
      <div className="marquee reel-marquee" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div className="marquee-track" key={copy}>
            {items.map((a) => <span key={a.href}>{a.label.replace(/ (API )?Integration$| API$/, "")}<i>✦</i></span>)}
          </div>
        ))}
      </div>
      <div className="chip-links container reveal">
        {items.map((a) => <Link href={a.href} className="press" key={a.href}>{a.label} <Chev /></Link>)}
      </div>
    </section>
  );
}

/** A large photo with a glass panel of points laid over its edge. */
export function PhotoSplit({ image, eyebrow, title, items, flip = false }: { image: string; eyebrow: string; title: string; items: string[]; flip?: boolean }) {
  return (
    <section className={`psplit container${flip ? " flip" : ""}`}>
      <div className="ps-media reveal"><Photo name={image} className="ps-img" sizes="(min-width: 861px) 60vw, 92vw" /></div>
      <div className="ps-panel reveal">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="h2">{title}</h2>
        <ul>{items.map((x, i) => <li key={x}><span>{pad(i)}</span>{x}</li>)}</ul>
      </div>
    </section>
  );
}

export type Poster = { href: string; title: string; text: string; image: string; tag?: string };

/** Portrait photo cards, like film posters: the picture first, the words on top of it. */
export function PosterGrid({ items, title, text }: { items: Poster[]; title?: string; text?: string }) {
  const n = items.length;
  const cols = n <= 5 ? n : n % 4 === 0 ? 4 : 3;
  return (
    <div className="pgroup">
      {title && (
        <div className="pg-head reveal">
          <h2 className="h2">{title}</h2>
          {text && <p>{text}</p>}
        </div>
      )}
      <div className="posters" data-cols={cols} style={{ "--cols": cols } as CSSProperties}>
        {items.map((p, i) => (
          <Link href={p.href} className="poster press reveal" key={p.href}>
            <Photo name={p.image} className="poster-img" sizes={`(min-width: 861px) ${Math.round(100 / cols)}vw, 92vw`} />
            <div className="poster-copy">
              <small>{p.tag ?? pad(i)}</small>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <span className="poster-go" aria-hidden="true"><Chev /></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Three side-by-side options, the middle one emphasised. */
export function ChoiceCards({ title, items }: { title: string; items: { tag: string; title: string; text: string; link?: { href: string; label: string } }[] }) {
  return (
    <section className="choices container">
      <h2 className="h2 center reveal">{title}</h2>
      <div className="pers-grid">
        {items.map((c, i) => (
          <article className={`pers reveal${i === 1 ? " pers-dark" : ""}`} key={c.title}>
            <span className="pers-ico" aria-hidden="true">{c.tag}</span>
            <h3>{c.title}</h3>
            <p className="choice-text">{c.text}</p>
            {c.link && <Link className="link" href={c.link.href}>{c.link.label} <Chev /></Link>}
          </article>
        ))}
      </div>
    </section>
  );
}
