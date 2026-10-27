import Link from "next/link";
import { preload } from "react-dom";
import { Chev } from "@/components/Brand";
import { BgVideo, Photo } from "@/components/Photo";
import { Block, Logos, Pay, Quotes, Stats } from "@/components/cws/Blocks";
import { CtaBand, CwsAnchor, JsonLd, Statement } from "@/components/sections";
import { cwsPage, type Card, type Section } from "@/lib/cws";
import { company } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

const home = cwsPage("home");
const find = (kind: Section["kind"], variant?: string) =>
  home.sections.find((s) => s.kind === kind && (!variant || s.variant === variant))!;

export const metadata = pageMeta({ description: home.meta, path: "/" });

const pad = (i: number) => String(i + 1).padStart(2, "0");

export default function HomePage() {
  // the hero poster is the first big paint: fetch it alongside the HTML, before the video
  preload("/assets/media/hero-poster.jpg", { as: "image", fetchPriority: "high" });
  const hero = find("hero");
  const [tagline, ...rotating] = [hero.title!, ...(hero.text ?? []).slice(0, -1)];
  const intro = hero.text?.at(-1) ?? "";
  const heroStats = hero.stats ?? [];
  const solutions = find("cards", "solutions");
  const why = find("cards", "why");
  const reach = find("reach");
  const genie = find("genie");
  const cta = find("cta");
  const [line1, line2] = tagline.split(/,\s*/);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero" id="hero">
        <div className="hero-sticky">
          <div className="hero-media" id="heroMedia">
            <BgVideo name="hero" poster="/assets/media/hero-poster.jpg" wide eager />
            <div className="hero-grain" />
          </div>
          <h1 className="hero-title" id="heroTitle">
            <span style={{ "--i": 0 } as React.CSSProperties}>{line1},</span>
            <span style={{ "--i": 1 } as React.CSSProperties}>{line2}</span>
          </h1>
        </div>
      </section>

      {/* ============ STATEMENT ============ */}
      <section className="statement">
        <p className="eyebrow-serif">{hero.eyebrow}</p>
        <p className="taglines reveal">{rotating.join(" · ")}</p>
        <Statement text={intro} />
        <div className="cta-row reveal">
          {hero.links?.map((l, i) => <CwsAnchor key={l.href} link={l} className={i === 0 ? "btn-pill press" : "link"} />)}
        </div>
        <ul className="hero-stats reveal">
          {heroStats.map(([v, l]) => <li key={l}><b>{v}</b><span>{l}</span></li>)}
        </ul>
      </section>

      <Block s={find("answer")} />
      <Logos s={find("logos", "group")} />
      <Stats s={{ kind: "stats", title: "Elyra by the numbers", items: [["150+", "Corporate Clients"], ["185+", "Countries"], ["30,000+", "Bookings"], ["1.5M+", "Room Nights Booked"]] }} />

      {/* ============ SOLUTIONS: tiles grow to full screen as you scroll ============ */}
      <section className="products" id="solutions">
        <div className="products-head container">
          <div>
            <p className="eyebrow reveal">{solutions.eyebrow}</p>
            <h2 className="h2 reveal">{solutions.title}</h2>
          </div>
          <div className="products-intro reveal">
            {solutions.text?.map((t) => <p key={t}>{t}</p>)}
            <Link href="/services/" className="link">View all services <Chev /></Link>
          </div>
        </div>

        <div className="product-rows">
          {(solutions.items as Card[]).map((row) => (
            <article className="product-row" key={row.title}>
              <h3 className="product-title">{row.title}</h3>
              <div className="product-tile">
                {row.img && <Photo name={row.img.src} alt={row.title} sizes="(min-width: 861px) 100vw, 92vw" className="tile-bg" />}
                <p className="tile-cap" aria-hidden="true">{row.title}</p>
                <ul className="tile-hl">
                  <li><span className="mono">01</span><b>{row.kicker}</b><p>{row.text?.[0]}</p></li>
                </ul>
              </div>
              <p className="product-desc">
                {row.text?.[0]}{" "}
                {row.href && <CwsAnchor link={{ href: row.href, text: row.cta ?? "Explore" }} />}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ============ TRAVGENIE: photo expands to full screen ============ */}
      {/* Pinned stages sit inside a section: GSAP wraps whatever it pins, and React must still
          find each top-level section directly in <main> when it swaps pages. */}
      <section className="bleed-sec" id="travgenie">
      <div className="bleed xp" data-expand>
        <div className="xp-frame bleed-frame">
          <div className="bleed-media">{genie.image && <Photo name={genie.image.src} alt={genie.image.alt} className="media-bg" />}</div>
          <div className="cd-layout">
            <div className="cd-head">
              <p className="eyebrow light">{genie.eyebrow}</p>
              <h2 className="bleed-title">{genie.title}</h2>
              {genie.text?.map((t) => <p className="cd-text" key={t}>{t}</p>)}
              {genie.links?.[0] && <CwsAnchor link={genie.links[0]} className="btn-pill press cd-cta" />}
            </div>
            <ul className="cd-grid">
              {genie.bullets?.map(([b], i) => (
                <li key={b}>
                  <span className="cd-item"><span className="mono">{pad(i)}</span><b>{b}</b></span>
                </li>
              ))}
              {genie.links?.[1] && (
                <li><Link href="/contact/#enquire" className="cd-item press"><span className="mono">{pad(genie.bullets?.length ?? 0)}</span><b>{genie.links[1].text}</b><Chev /></Link></li>
              )}
            </ul>
          </div>
        </div>
      </div>
      </section>

      {/* ============ WHY ELYRA ============ */}
      <section className="why container" id="whyus">
        <div className="cws-head">
          <p className="eyebrow reveal">{why.eyebrow}</p>
          <h2 className="h2 reveal">{why.title}</h2>
          {why.text?.map((t) => <p className="reveal" key={t}>{t}</p>)}
          {why.links?.map((l) => <CwsAnchor key={l.href} link={l} />)}
        </div>
        <div className="why-grid">
          {(why.items as Card[]).map((c, i) => (
            <article className="why-item reveal" key={c.title}><span className="mono">{pad(i)}</span><h3>{c.title}</h3><p>{c.text?.[0]}</p></article>
          ))}
        </div>
      </section>

      {/* ============ GLOBAL REACH ============ */}
      <section className="effect-sec" id="reach">
      <div className="effect xp" data-expand>
        <div className="effect-media xp-frame" id="effectMedia">
          <BgVideo name="effect" />
          <svg className="routes" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <radialGradient id="rg" cx="50%" cy="55%" r="60%">
                <stop offset="0" stopColor="#2f8f84" />
                <stop offset="1" stopColor="#0a2724" />
              </radialGradient>
            </defs>
            <rect width="1200" height="700" fill="url(#rg)" opacity=".55" />
            <g className="rings" fill="none" stroke="rgba(170,235,224,.18)">
              <circle cx="600" cy="400" r="120" /><circle cx="600" cy="400" r="210" /><circle cx="600" cy="400" r="310" /><circle cx="600" cy="400" r="420" />
            </g>
            <g className="arcs" fill="none" stroke="rgba(200,250,240,.7)" strokeWidth="1.4">
              <path d="M120 520 Q 360 120 600 400" /><path d="M600 400 Q 860 80 1080 300" />
              <path d="M220 200 Q 420 300 600 400" /><path d="M600 400 Q 820 620 1040 560" />
              <path d="M600 400 Q 640 120 760 90" />
            </g>
            <g fill="#d8f2ee">
              <circle cx="120" cy="520" r="5" /><circle cx="1080" cy="300" r="5" /><circle cx="220" cy="200" r="5" />
              <circle cx="1040" cy="560" r="5" /><circle cx="760" cy="90" r="5" /><circle cx="600" cy="400" r="8" />
            </g>
          </svg>
          <h2 className="effect-title">Global<br />Reach &amp;<br />Network</h2>
          <div className="effect-copy">
            <p><b>{reach.title}</b></p>
            {reach.text?.map((t) => <p key={t}>{t}</p>)}
            <ul className="reach-places" aria-label="Where we operate">
              {(reach.items as string[]).map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        </div>
      </div>
      </section>

      <Pay s={find("pay")} />
      <Logos s={find("logos", "clients")} marquee />
      <Logos s={find("logos", "network")} />
      <Quotes s={find("quotes")} />
      <CtaBand eyebrow={cta.eyebrow} title={cta.title} text={cta.text} links={cta.links?.filter((l) => !l.href.startsWith("/contact"))} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "@id": `${company.url}/#agency`,
        name: company.name,
        url: company.url,
        telephone: company.phone,
        email: company.email,
        address: { "@type": "PostalAddress", streetAddress: "A-904/5/6, Kailas Business Park, Hiranandani Link Road, Vikhroli (West)", addressLocality: "Mumbai", postalCode: "400079", addressCountry: "IN" },
        foundingDate: "2016",
      }} />
    </>
  );
}
