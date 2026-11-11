import { setLang, type LangParams } from "@/lib/i18n";
import Link from "next/link";
import { Chev } from "@/components/Brand";
import { BgVideo, Photo } from "@/components/Photo";
import { FaqBlock, JsonLd, ProcessTable, Statement, Lines } from "@/components/sections";
import {
  aiCapabilities, apiCategories, automationTabs, devServices, expertise, homeFaq, homeSteps,
  industries, marqueeItems, productRows, whyItems,
} from "@/lib/home";
import { faqSchema, metaFor, siteDescription } from "@/lib/seo";

export const generateMetadata = metaFor({
  description: siteDescription,
  path: "/",
});

const pad = (i: number) => String(i + 1).padStart(2, "0");

const heroServices: [string, string][] = [
  ["Custom development", "/custom-development/"],
  ["Automation", "/automation/"],
  ["API integrations", "/api-integrations/"],
  ["Business software", "/business-software/"],
];
export default async function HomePage({ params }: LangParams) {
  setLang((await params).lang);
  const tabKeys = Object.keys(automationTabs);
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero hero-video" id="hero">
        <div className="hero-sticky">
          <div className="hero-media" id="heroMedia">
            <BgVideo name="team" poster="/assets/media/team-poster.jpg" eager />
            <div className="hero-grain" />
          </div>
          <div className="hero-content">
            <div className="hero-copy">
            <h1 className="hero-title" id="heroTitle">
              <span className="hl" style={{ "--i": 0 } as React.CSSProperties}><span>We help you automate</span></span>
              <span className="hl" style={{ "--i": 1 } as React.CSSProperties}><span><em>your business.</em></span></span>
            </h1>
            <div className="hero-side">
              <p className="hero-lead">We design, build and connect the software that runs your business, so the repetitive work takes care of itself and your team can focus on growth.</p>
              <div className="hero-ctas">
                <Link href="/request-demo/" className="hero-btn hero-btn-primary press">Request a demo <Chev /></Link>
                <a href="#expertise" className="hero-btn hero-btn-ghost press">Explore what we do <Chev /></a>
              </div>
            </div>
            </div>
          </div>
          <nav className="hero-strip" aria-label="What we do">
            {heroServices.map(([label, href], i) => (
              <Link href={href} key={href} style={{ "--i": i } as React.CSSProperties}>
                <span className="mono">{pad(i)}</span>
                <b>{label}</b>
                <Chev />
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* ============ STATEMENT ============ */}
      <section className="statement">
        <Statement text="Every business loses time to work that technology could handle. We bring software, automation and AI together to make your work simpler, faster and smarter, whether that means automating one task or building a complete system." />
        <div className="cta-row reveal">
          <Link href="/contact/" className="btn-pill press">Let&apos;s talk <Chev /></Link>
          <a href="#expertise" className="link">Explore what we do <Chev /></a>
        </div>
      </section>

      {/* ============ EXPERTISE ============ */}
      <section className="expertise container" id="expertise">
        <div className="split-head">
          <h2 className="h2 reveal">We build. We connect.<br />We automate.</h2>
          <p className="reveal">Most projects need more than one of these. We handle all four, so you don&apos;t have to coordinate separate suppliers.</p>
        </div>
        <div className="api-grid two">
          {expertise.map(([t, d]) => <article className="api reveal" key={t}><h3>{t}</h3><p>{d}</p></article>)}
        </div>
      </section>

      {/* ============ READY-TO-USE SOLUTIONS: one split card per area ============ */}
      <section className="products" id="solutions">
        <div className="products-head container">
          <h2 className="h2 reveal">You may not need to<br />start from scratch</h2>
          <div className="products-intro reveal">
            <p>Ready-to-deploy platforms get you moving sooner, and we can tailor them to the way you work.</p>
            <Link href="/contact/" className="link">Find the right fit <Chev /></Link>
          </div>
        </div>

        <div className="product-rows container">
          {productRows.map((row, i) => (
            <article className="prow reveal" key={row.title}>
              <Link href={row.href} className="prow-media press" aria-label={row.title}>
                <Photo name={row.photo} sizes="(min-width: 861px) 56vw, 92vw" className="tile-bg" />
                <ul className="tile-hl">
                  {row.points.map(([t, d], j) => <li key={t}><span className="mono">{pad(j)}</span><b>{t}</b><p>{d}</p></li>)}
                </ul>
              </Link>
              <div className="prow-copy">
                <span className="prow-num mono">{pad(i)}</span>
                <h3 className="prow-title">{row.title}</h3>
                <p>{row.desc}</p>
                <Link href={row.href} className="link">Explore {row.title.toLowerCase()} <Chev /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ============ CUSTOM DEVELOPMENT: photo expands to full screen ============ */}
      {/* Pinned stages sit inside a section: GSAP wraps whatever it pins, and React must still
          find each top-level section directly in <main> when it swaps pages. */}
      <section className="bleed-sec" id="custom">
      <div className="bleed xp" data-expand>
        <div className="xp-frame bleed-frame">
          <div className="bleed-media"><Photo name="bleed" className="media-bg" /></div>
          <div className="cd-layout">
            <div className="cd-head">
              <p className="eyebrow light">Custom software</p>
              <h2 className="bleed-title">Have an idea?<br />Let&apos;s build it.</h2>
              <p className="cd-text">When existing software doesn&apos;t fit the way you operate, we&apos;ll build what does. We stay with you from planning and design through development and deployment.</p>
              <Link href="/contact/" className="btn-pill press cd-cta">Build your software with us <Chev /></Link>
            </div>
            <ul className="cd-grid">
              {devServices.map(([href, title, sub], i) => (
                <li key={href}>
                  <Link href={href} className="cd-item press"><span className="mono">{pad(i)}</span><b>{title}</b><small>{sub}</small><Chev /></Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      </section>

      {/* ============ AUTOMATION ============ */}
      <section className="features container" id="automation">
        <h2 className="h2 center reveal">Stop repeating.<br />Start automating.</h2>
        <p className="sub reveal">If a task follows the same steps every time, it&apos;s worth asking whether a person still needs to do it. Choose an area to see where automation can give you time back.</p>
        <div className="tabs reveal" role="tablist" data-tabs>
          <span className="tab-ind" aria-hidden="true" />
          {tabKeys.map((k, i) => (
            <button key={k} role="tab" id={`ft-${i}`} aria-controls={`fp-${i}`} aria-selected={i === 0} tabIndex={i === 0 ? 0 : -1}>{k}</button>
          ))}
        </div>
        <div className="panels">
          {tabKeys.map((k, i) => (
            <div key={k} className={`panel${i === 0 ? " is-on" : ""}`} role="tabpanel" id={`fp-${i}`} aria-labelledby={`ft-${i}`} hidden={i !== 0}>
              {automationTabs[k].map(([t, d]) => <div className="feat" key={t}><h3>{t}</h3><p>{d}</p></div>)}
            </div>
          ))}
        </div>
        <p className="fineprint"><Link className="link" href="/automation/">See how automation works <Chev /></Link></p>
      </section>

      {/* ============ ARTIFICIAL INTELLIGENCE ============ */}
      <section className="engines container" id="ai">
        <div className="split-head">
          <h2 className="h2 reveal">AI that does real work<br />in your business</h2>
          <p className="reveal">AI is already a practical tool. We add it to the systems you have and the applications you&apos;re building, where it makes a real difference.</p>
        </div>
        <div className="engine-grid bento">
          {aiCapabilities.map(([icon, t, d], i) => (
            <article className={`engine press reveal${i === 0 ? " eng-hero" : ""}`} key={t}>
              <span className="eng-ico">{icon}</span>
              <h3>{t}</h3><p>{d}</p>
              {i === 0 && <Link href="/contact/" className="link">Explore AI possibilities <Chev /></Link>}
            </article>
          ))}
        </div>
      </section>

      {/* ============ INTEGRATION ============ */}
      <section className="marquee-sec" id="integrations">
        <div className="split-head container">
          <h2 className="h2 reveal">Your systems should<br />work together</h2>
          <p className="reveal">Problems start when your applications don&apos;t talk to each other. We connect them into one working environment, with fewer complications along the way.</p>
        </div>
        <div className="marquee" aria-label="What we connect">
          {[0, 1].map((copy) => (
            <div className="marquee-track" aria-hidden={copy === 1 || undefined} key={copy}>
              {marqueeItems.map((m) => <span key={m}>{m}</span>)}
            </div>
          ))}
        </div>
        <div className="api-grid container">
          {apiCategories.map(([t, d]) => <article className="api reveal" key={t}><h3>{t}</h3><p>{d}</p></article>)}
        </div>
        <p className="fineprint">
          <Link className="link" href="/contact/">Tell us what you need to connect <Chev /></Link><br />
          Some integrations depend on access and agreements with the third-party provider.
        </p>
      </section>

      {/* ============ INDUSTRIES: pinned gallery ============ */}
      <section className="carousel-sec" id="industries">
        <p className="eyebrow-serif">Industries we help work smarter</p>
        <div className="carousel xp" data-hscroll>
          <button className="car-arrow prev press" aria-label="Previous">‹</button>
          <div className="car-viewport xp-frame">
            <div className="car-track">
              {industries.map((m) => (
                <article className="car-slide" style={{ "--g1": m.g1, "--g2": m.g2 } as React.CSSProperties} key={m.tag}>
                  <div className="car-art"><Photo name={m.photo} sizes="100vw" /></div>
                  <div className="car-glass"><small>{m.tag}</small><h3>{m.title}</h3><p>{m.text}</p></div>
                </article>
              ))}
            </div>
          </div>
          <button className="car-arrow next press" aria-label="Next">›</button>
          <div className="car-dots" role="tablist" aria-label="Choose an industry">
            {industries.map((m, i) => (
              <button key={m.tag} role="tab" aria-label={`${m.tag} (${i + 1} of ${industries.length})`} aria-selected={i === 0} tabIndex={i === 0 ? 0 : -1} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY HAWYIA ============ */}
      <section className="why container" id="why">
        <h2 className="h2 center reveal">We understand technology.<br />We understand business.</h2>
        <div className="why-grid">
          {whyItems.map(([t, d], i) => (
            <article className="why-item reveal" key={t}><span className="mono">{pad(i)}</span><h3>{t}</h3><p>{d}</p></article>
          ))}
        </div>
      </section>

      {/* ============ THE HAWYIA DIFFERENCE ============ */}
      <section className="effect-sec">
      <div className="effect xp" data-expand>
        <div className="effect-media xp-frame" id="effectMedia">
          <Photo name="d-custom-software-integrations" className="media-bg" />
          <svg className="routes" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <radialGradient id="rg" cx="50%" cy="55%" r="60%">
                <stop offset="0" stopColor="#1546b0" />
                <stop offset="1" stopColor="#071a4d" />
              </radialGradient>
            </defs>
            <rect width="1200" height="700" fill="url(#rg)" opacity=".55" />
            <g className="rings" fill="none" stroke="rgba(252,215,122,.18)">
              <circle cx="600" cy="400" r="120" /><circle cx="600" cy="400" r="210" /><circle cx="600" cy="400" r="310" /><circle cx="600" cy="400" r="420" />
            </g>
            <g className="arcs" fill="none" stroke="rgba(253,226,160,.7)" strokeWidth="1.4">
              <path d="M120 520 Q 360 120 600 400" /><path d="M600 400 Q 860 80 1080 300" />
              <path d="M220 200 Q 420 300 600 400" /><path d="M600 400 Q 820 620 1040 560" />
              <path d="M600 400 Q 640 120 760 90" />
            </g>
            <g fill="#e8eefb">
              <circle cx="120" cy="520" r="5" /><circle cx="1080" cy="300" r="5" /><circle cx="220" cy="200" r="5" />
              <circle cx="1040" cy="560" r="5" /><circle cx="760" cy="90" r="5" /><circle cx="600" cy="400" r="8" />
            </g>
          </svg>
          <h2 className="effect-title"><Lines text="Simple<br />by<br />design" /></h2>
          <div className="effect-copy">
            <p>You don&apos;t always need a new system. Sometimes it&apos;s a matter of connecting what you already have, or automating a single process. Sometimes a new application is the right answer. We help you choose the right approach, without technology for its own sake.</p>
            <Link href="/contact/" className="link light">Talk it through with us <Chev /></Link>
          </div>
        </div>
      </div>
      </section>

      <ProcessTable steps={homeSteps} title="How ideas become solutions" />
      <FaqBlock faq={homeFaq} />
      <JsonLd data={faqSchema(homeFaq)} />
    </>
  );
}
