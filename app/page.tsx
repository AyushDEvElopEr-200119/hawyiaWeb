import Link from "next/link";
import { preload } from "react-dom";
import { Chev } from "@/components/Brand";
import { BgVideo, Photo } from "@/components/Photo";
import { FaqBlock, JsonLd, ProcessTable, Statement } from "@/components/sections";
import { generalFaq, processSteps } from "@/lib/content";
import { posts } from "@/lib/blog";
import {
  apiCategories, appFeatures, businessModels, devServices, engines, extranetItems,
  featureTabs, marqueeItems, miniCards, productRows, whyItems,
} from "@/lib/home";
import { faqSchema, pageMeta, siteDescription } from "@/lib/seo";
import { solutions } from "@/lib/site";

export const metadata = pageMeta({
  description: siteDescription,
  path: "/",
});

const pad = (i: number) => String(i + 1).padStart(2, "0");
const homeFaq = generalFaq.slice(0, 7);

export default function HomePage() {
  // the hero poster is the first big paint: fetch it alongside the HTML, before the video
  preload("/assets/media/hero-poster.jpg", { as: "image", fetchPriority: "high" });
  const tabKeys = Object.keys(featureTabs);
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
            <span style={{ "--i": 0 } as React.CSSProperties}>Build the future</span>
            <span style={{ "--i": 1 } as React.CSSProperties}>of online travel.</span>
          </h1>
        </div>
      </section>

      {/* ============ STATEMENT ============ */}
      <section className="statement">
        <Statement text="Elyra builds the booking technology behind travel businesses. We help agencies, tour operators and OTAs launch, customize and scale their own platforms, under their own brand." />
        <div className="cta-row reveal">
          <a href="#solutions" className="btn-pill press">Explore Solutions <Chev /></a>
          <Link href="/contact/" className="link">Discuss your project <Chev /></Link>
        </div>
      </section>

      {/* ============ SOLUTIONS: tiles grow to full screen as you scroll ============ */}
      <section className="products" id="solutions">
        <div className="products-head container">
          <h2 className="h2 reveal">Ready-made platforms,<br />launched as your own</h2>
          <div className="products-intro reveal">
            <p>You keep your brand, your domain and your customers. We supply the engine underneath it. Configurable modules and one admin panel, ready to launch.</p>
            <Link href="/solutions/" className="link">View all solutions <Chev /></Link>
          </div>
        </div>

        <div className="product-rows">
          {productRows.map((row) => (
            <article className="product-row" key={row.title}>
              <h3 className="product-title">{row.title}</h3>
              <div className="product-tile">
                <Photo name={row.photo} sizes="(min-width: 861px) 100vw, 92vw" className="tile-bg" />
                <p className="tile-cap" aria-hidden="true">{row.title}</p>
                <ul className="tile-hl">
                  {row.points.map(([t, d], i) => <li key={t}><span className="mono">{pad(i)}</span><b>{t}</b><p>{d}</p></li>)}
                </ul>
              </div>
              <p className="product-desc">{row.desc}</p>
            </article>
          ))}
        </div>

        <div className="container" id="all-solutions">
          <p className="eyebrow-serif">Every solution</p>
          <div className="sol-grid">
            {solutions.map((s, i) => (
              <Link href={`/solutions/${s.slug}/`} className="sol press reveal" key={s.slug}>
                <small>{pad(i)}</small><h3>{s.name}</h3><p>{s.short}</p>
              </Link>
            ))}
          </div>
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
              <p className="eyebrow light">Custom development</p>
              <h2 className="bleed-title">From brief<br />to booking</h2>
              <p className="cd-text">Some businesses need to launch this quarter. Others need something nobody sells yet. We tell you honestly which one you are, then configure a ready-made platform or build yours from scratch.</p>
              <Link href="/custom-development/" className="btn-pill press cd-cta">Explore custom development <Chev /></Link>
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

      {/* ============ INTEGRATIONS ============ */}
      <section className="marquee-sec" id="integrations">
        <p className="eyebrow-serif">Connects with</p>
        <div className="marquee" aria-label="Integration categories">
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
          <Link className="link" href="/api-integrations/">Browse the integration directory <Chev /></Link><br />
          Integrations are subject to supplier access and agreements. We list suppliers by name only for integrations we have delivered.
        </p>
      </section>

      {/* ============ BOOKING ENGINES ============ */}
      <section className="engines container" id="engines">
        <div className="split-head">
          <h2 className="h2 reveal">A booking engine<br />for every journey</h2>
          <p className="reveal">Each engine covers the whole trip: search, pricing, booking, payment, and the changes that come after. Launch with one engine and add more as you grow.</p>
        </div>
        <div className="engine-grid">
          {engines.map(([icon, t, d]) => (
            <article className="engine press reveal" key={t}><span className="eng-ico">{icon}</span><h3>{t}</h3><p>{d}</p></article>
          ))}
        </div>
      </section>

      {/* ============ BUSINESS MODELS: pinned gallery ============ */}
      <section className="carousel-sec" id="platforms">
        <p className="eyebrow-serif">Business models we power</p>
        <div className="carousel xp" data-hscroll>
          <button className="car-arrow prev press" aria-label="Previous">‹</button>
          <div className="car-viewport xp-frame">
            <div className="car-track">
              {businessModels.map((m) => (
                <article className="car-slide" style={{ "--g1": m.g1, "--g2": m.g2 } as React.CSSProperties} key={m.tag}>
                  <div className="car-art"><Photo name={m.photo} sizes="100vw" /></div>
                  <div className="car-glass"><small>{m.tag}</small><h3>{m.title}</h3><p>{m.text}</p></div>
                </article>
              ))}
            </div>
          </div>
          <button className="car-arrow next press" aria-label="Next">›</button>
          <div className="car-dots" role="tablist" aria-label="Choose a business model">
            {businessModels.map((m, i) => (
              <button key={m.tag} role="tab" aria-label={`${m.tag} (${i + 1} of ${businessModels.length})`} aria-selected={i === 0} tabIndex={i === 0 ? 0 : -1} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="features container" id="features">
        <h2 className="h2 center reveal">Everything from search<br />to post-booking</h2>
        <p className="sub reveal">Choose a product to see what comes built in.</p>
        <div className="tabs reveal" role="tablist" data-tabs>
          <span className="tab-ind" aria-hidden="true" />
          {tabKeys.map((k, i) => (
            <button key={k} role="tab" id={`ft-${i}`} aria-controls={`fp-${i}`} aria-selected={i === 0} tabIndex={i === 0 ? 0 : -1}>{k}</button>
          ))}
        </div>
        <div className="panels">
          {tabKeys.map((k, i) => (
            <div key={k} className={`panel${i === 0 ? " is-on" : ""}`} role="tabpanel" id={`fp-${i}`} aria-labelledby={`ft-${i}`} hidden={i !== 0}>
              {featureTabs[k].map(([t, d]) => <div className="feat" key={t}><h3>{t}</h3><p>{d}</p></div>)}
            </div>
          ))}
        </div>
      </section>

      {/* ============ EXTRANET & CMS ============ */}
      <section className="extranet container" id="extranet">
        <article className="ext-card reveal">
          <div className="ext-copy">
            <span className="tag">Extranet &amp; CMS</span>
            <h2 className="h2">Your inventory.<br />Your rules.</h2>
            <p>Sell more than supplier content. Load your own series fares, contracted hotels and packages, control availability in real time, and book them on the same platform as everything else.</p>
            <Link href="/contact/" className="link">Ask about extranet <Chev /></Link>
          </div>
          <ul className="ext-list">
            {extranetItems.map(([b, s]) => <li key={b}><b>{b}</b><span>{s}</span></li>)}
          </ul>
        </article>
      </section>

      {/* ============ TWO WAYS ============ */}
      <section className="ways container">
        <p className="eyebrow-serif">Two ways to build</p>
        <article className="feature-card reveal">
          <div className="feature-media">
            <Photo name="ways" sizes="(min-width: 861px) 389px, 92vw" className="media-bg" />
            <div className="fm-compare">
              <div className="fm-col"><small>White-label</small><b>Weeks</b><span>to launch</span></div>
              <div className="fm-div" />
              <div className="fm-col"><small>Custom</small><b>Months</b><span>to launch</span></div>
            </div>
          </div>
          <div className="feature-body">
            <span className="tag">Compare</span>
            <h3>White-label or custom: which one fits?</h3>
            <p>White-label is the faster and cheaper route, built on proven modules. Custom gives you full flexibility for a business model nobody else sells. Plenty of clients start with one and add the other later.</p>
            <a href="#faq" className="link">Learn more <Chev /></a>
          </div>
        </article>
        <div className="mini-grid">
          {miniCards.map(([photo, title, href]) => (
            <article className="mini-card press reveal" key={title}>
              <div className="mini-media"><Photo name={photo} sizes="90px" /></div>
              <div><h3>{title}</h3><Link href={href} className="link">Read more <Chev /></Link></div>
            </article>
          ))}
        </div>
      </section>

      {/* ============ MOBILE APPS: bento ============ */}
      <section className="apps container" id="apps">
        <div className="split-head">
          <h2 className="h2 reveal">Your booking engine,<br />in their pocket</h2>
          <p className="reveal">Android and iOS apps for travellers and agents, connected to the same engine, suppliers and payment gateway as your website. One inventory, one admin, one set of reports.</p>
        </div>
        <div className="bento">
          <article className="b-card b-photo b-lg reveal">
            <Photo name="c-travel-mobile-app-development" sizes="(min-width: 861px) 50vw, 92vw" className="b-img" />
            <div className="b-cap">
              <p className="eyebrow light">Mobile apps</p>
              <h3>Apps that feel native</h3>
              <p>Designed for touch and fast on every network, with booking, payments and trips in one place.</p>
              <Link href="/custom-development/travel-mobile-app-development/" className="link light">Mobile app development <Chev /></Link>
            </div>
          </article>
          {appFeatures.map((f) => (
            <article className={`b-card${f.tone ? ` b-${f.tone}` : ""} reveal`} key={f.title}>
              <svg className="b-ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: f.icon }} />
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
          <article className="b-card b-photo b-wide reveal">
            <Photo name="miniApp" sizes="(min-width: 861px) 50vw, 92vw" className="b-img" />
            <div className="b-cap">
              <h3>The whole trip, in one app</h3>
              <p>Search, book, pay, check details and change plans.</p>
            </div>
          </article>
        </div>
      </section>

      {/* ============ THE ELYRA EFFECT ============ */}
      <section className="effect-sec">
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
          <h2 className="effect-title">The<br />Elyra<br />Effect</h2>
          <div className="effect-copy">
            <p>Good travel technology goes unnoticed. Searches return fast, prices are correct, bookings confirm, and the admin still makes sense a year later. That is the standard we build to. It covers HTTPS everywhere, role-based access, careful data handling, tested releases and support after launch.</p>
            <a href="#why" className="link light">Why Elyra <Chev /></a>
          </div>
        </div>
      </div>
      </section>

      {/* ============ WHY ELYRA ============ */}
      <section className="why container" id="why">
        <h2 className="h2 center reveal">Why travel businesses<br />build with Elyra</h2>
        <div className="why-grid">
          {whyItems.map(([t, d], i) => (
            <article className="why-item reveal" key={t}><span className="mono">{pad(i)}</span><h3>{t}</h3><p>{d}</p></article>
          ))}
        </div>
      </section>

      {/* ============ RESOURCES ============ */}
      <section className="edit container" id="resources">
        <h2 className="h2 center reveal">The Travel Tech Edit</h2>
        <div className="edit-grid">
          {posts.slice(0, 3).map((g) => (
            <article className="post press reveal" key={g.slug}>
              <div className="post-media"><Photo name={g.photo} sizes="(min-width: 861px) 320px, 92vw" /></div>
              <small>{g.tag}</small>
              <h3>{g.title}</h3>
              <p>{g.excerpt}</p>
              <Link href={`/blog/${g.slug}/`} className="link">Read article <Chev /></Link>
            </article>
          ))}
        </div>
      </section>

      <ProcessTable steps={processSteps} />
      <FaqBlock faq={homeFaq} />
      <JsonLd data={faqSchema(homeFaq)} />
    </>
  );
}
