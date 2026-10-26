// Page builders. Each returns { path, title, description, body, schema }.
import { solutions, services, apis, company } from "./site.mjs";
import { page, esc, chev, pageHero, faqBlock, ctaBand, leadForm, breadcrumbSchema, faqSchema } from "./layout.mjs";
import { solutionPages, servicePages, apiPages, apiProcessSteps, industries, guides, generalFaq, processSteps } from "./content.mjs";
import { readFileSync } from "node:fs";
import { img, photos } from "./media.mjs";

// Background video with poster; JS pauses it off-screen and skips autoplay for reduced motion.
const video = (key, { cls = "bg-video", poster = "" } = {}) => `<video class="${cls}" data-autoplay muted loop playsinline preload="metadata"${poster ? ` poster="${poster}"` : ""} aria-hidden="true">
            ${key === "hero" ? `<source src="/assets/media/hero-1920.mp4" type="video/mp4" media="(min-width: 1100px)" />` : ""}
            <source src="/assets/media/${key}-1280.mp4" type="video/mp4" />
          </video>`;

const faqObjs = (arr) => arr.map(([q, a]) => ({ q, a }));
const footnote = `<p class="fineprint container">Feature availability depends on chosen product, supplier contracts, integrations and requirements.</p>`;

const processTable = (steps, { title = "How we work", id = "process" } = {}) => `
    <section class="process container" id="${id}">
      <h2 class="h2 center reveal">${title}</h2>
      <div class="table">
        ${steps.map(([b, m], i) => `<div class="tr reveal"><span class="mono">${String(i + 1).padStart(2, "0")}</span><b>${esc(b)}</b><span class="muted">${esc(m)}</span></div>`).join("\n        ")}
      </div>
    </section>`;

const cardGrid = (items, cls = "engine-grid") => `
      <div class="${cls}">
        ${items.map(([t, d], i) => `<article class="engine press reveal"><span class="eng-ico mono">${String(i + 1).padStart(2, "0")}</span><h4>${esc(t)}</h4><p>${esc(d)}</p></article>`).join("\n        ")}
      </div>`;

const tabsBlock = (id, groups) => {
  const keys = Object.keys(groups);
  return `
      <div class="tabs reveal" role="tablist" data-tabs>
        <span class="tab-ind" aria-hidden="true"></span>
        ${keys.map((k, i) => `<button role="tab" id="${id}-t${i}" aria-controls="${id}-p${i}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ""}>${esc(k)}</button>`).join("")}
      </div>
      <div class="panels">
        ${keys.map((k, i) => `<div class="panel${i === 0 ? " is-on" : ""}" role="tabpanel" id="${id}-p${i}" aria-labelledby="${id}-t${i}"${i ? " hidden" : ""}>
          ${groups[k].map((f) => `<div class="feat"><h4>${esc(f)}</h4></div>`).join("")}
        </div>`).join("\n        ")}
      </div>`;
};

const relatedCards = (items, base) => `
    <section class="related container">
      <p class="eyebrow-serif">Related</p>
      <div class="sol-grid three">
        ${items.map((s) => `<a href="${base}${s.slug}/" class="sol press reveal"><small>${esc(s.short)}</small><h4>${esc(s.name)}</h4><span class="link">Explore ${chev}</span></a>`).join("\n        ")}
      </div>
    </section>`;

/* ======================= HOME ======================= */
function home() {
  const src = readFileSync(new URL("./pages/home.source.html", import.meta.url), "utf8");
  let body = src.slice(src.indexOf("<main>") + 6, src.indexOf("</main>"));
  // the shared footer carries the closing CTA, so drop the page's own contact block
  body = body.replace(/<!-- =+ CONTACT =+ -->[\s\S]*?<span id="pricing"><\/span>/, "");
  let n = 0, t = 0, c = 0, m = 0, p = 0;
  const tiles = ["tileWL", "tileB2B", "tileCorp", "tileAdmin"];
  const cars = ["carB2C", "carB2B", "carB2B2C", "carB2B2B", "carB2E", "carTour", "carOTA"];
  const minis = ["miniCode", "miniApi", "miniApp"];
  body = body
    // real media
    .replace(/<!--img:([\w-]+)\|([^|]*)\|([^>]*)-->/g, (m, key, sizes, cls) => img(key, { sizes, cls }))
    .replace('<canvas id="globe" aria-hidden="true"></canvas>', video("hero", { poster: "/assets/media/hero-poster.jpg" }))
    .replace(/<div class="product-tile">/g, () => `<div class="product-tile">${img(tiles[t++], { sizes: "(min-width: 861px) 360px, 92vw", cls: "tile-bg" })}`)
    .replace('<div class="bleed-media">', `<div class="bleed-media">${img("bleed", { cls: "media-bg" })}`)
    .replace(/<div class="car-art[^"]*"><span><\/span><span><\/span><span><\/span><\/div>/g, () => `<div class="car-art">${img(cars[c++], { sizes: "(min-width: 861px) 820px, 84vw" })}</div>`)
    .replace('<div class="feature-media">', `<div class="feature-media">${img("ways", { sizes: "(min-width: 861px) 389px, 92vw", cls: "media-bg" })}`)
    .replace(/<div class="mini-media m\d"><span>[^<]*<\/span><\/div>/g, () => `<div class="mini-media">${img(minis[m++], { sizes: "90px" })}</div>`)
    .replace('<div class="effect-media xp-frame" id="effectMedia">', `<div class="effect-media xp-frame" id="effectMedia">\n          ${video("effect")}`)
    .replace('<rect width="1200" height="700" fill="url(#rg)" />', '<rect width="1200" height="700" fill="url(#rg)" opacity=".55" />')
    .replace(/<div class="post-media pm\d"><\/div>/g, () => `<div class="post-media">${img(`post${++p}`, { sizes: "(min-width: 861px) 320px, 92vw" })}</div>`)
    .replace(/<a href="#contact" class="sol press reveal">/g, () => `<a href="/solutions/${solutions[n++].slug}/" class="sol press reveal">`)
    .replace('href="#all-solutions" class="link">View all solutions', 'href="/solutions/" class="link">View all solutions')
    .replace('href="#contact" class="link">Discuss your project', 'href="/contact/" class="link">Discuss your project')
    .replace('<a href="#contact" class="link">Ask about extranet', '<a href="/contact/" class="link">Ask about extranet')
    .replace('<h4>Custom software development</h4><a href="#contact"', '<h4>Custom software development</h4><a href="/custom-development/"')
    .replace('<h4>Travel API &amp; supplier integrations</h4><a href="#integrations"', '<h4>Travel API &amp; supplier integrations</h4><a href="/api-integrations/"')
    .replace('<h4>Android &amp; iOS booking apps</h4><a href="#apps"', '<h4>Android &amp; iOS booking apps</h4><a href="/custom-development/travel-mobile-app-development/"')
    .replace(/<a href="#" class="link">Read more/g, '<a href="/resources/" class="link">Read more')
    .replace(/<div class="tabs reveal" role="tablist" id="featTabs">/, '<div class="tabs reveal" role="tablist" data-tabs>')
    .replace('<p class="fineprint">Integrations are subject', '<p class="fineprint"><a class="link" href="/api-integrations/">Browse the integration directory ' + chev + '</a><br />Integrations are subject');
  return {
    path: "/",
    title: "Home",
    description: "Elyra helps travel businesses launch, customize and scale their own online booking platforms with white-label solutions, custom development and travel API integrations.",
    body,
    bodyClass: "is-home",
    schema: [faqSchema(faqObjs(generalFaq.slice(0, 6)))],
  };
}

/* ======================= SOLUTION PAGE ======================= */
function solutionPage(meta) {
  const c = solutionPages[meta.slug];
  const path = `/solutions/${meta.slug}/`;
  const trail = [{ label: "Solutions", href: "/solutions/" }, { label: meta.name }];
  const faq = faqObjs(c.faq);
  const body = `
${pageHero({ trail, eyebrow: c.eyebrow, title: c.h1, intro: c.intro, image: `s-${meta.slug}`, highlights: c.modules.slice(0, 3) })}

    <section class="who container">
      <div class="split-head">
        <h2 class="h2 reveal">Who it's for</h2>
        <ul class="chips reveal">${c.who.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>
      </div>
    </section>

    <section class="engines container">
      <div class="split-head">
        <h2 class="h2 reveal">Key modules</h2>
        <p class="reveal">Every module is configurable from the admin panel. Switch on what you need today, and add more as you grow.</p>
      </div>
      ${cardGrid(c.modules)}
    </section>

    <section class="features container">
      <h2 class="h2 center reveal">Features for every user</h2>
      <p class="sub reveal">What travellers, agents and your own team get out of the box.</p>
      ${tabsBlock("ft", c.features)}
    </section>

    <section class="extranet container">
      <article class="ext-card reveal">
        <div class="ext-copy">
          <span class="tag">Make it yours</span>
          <h2 class="h2">Customization<br />options</h2>
          <p>Start from a proven platform, then shape it around your brand and business model. When you need something truly unique, our custom development team takes over.</p>
          <a href="/custom-development/" class="link">Custom development ${chev}</a>
        </div>
        <ul class="ext-list">${c.customize.map((x) => `<li><b>${esc(x)}</b></li>`).join("")}</ul>
      </article>
    </section>

    <section class="integrations-strip container">
      <div class="split-head">
        <h2 class="h2 reveal">Supported integrations</h2>
        <p class="reveal">Connect the suppliers and payment providers you work with. Integrations are subject to supplier access and agreements.</p>
      </div>
      <div class="chip-links reveal">${apis.map((a) => `<a href="/api-integrations/${a.slug}/" class="press">${esc(a.name)} ${chev}</a>`).join("")}</div>
    </section>

${processTable([
    ["Discovery call", "Your model, markets and must-haves"],
    ["Configuration plan", "Modules, suppliers, pricing rules"],
    ["Branding & setup", "Domain, theme, content"],
    ["Supplier & payment integration", "Your approved accounts"],
    ["Testing & training", "End-to-end checks, team onboarding"],
    ["Go-live & support", "Launch, monitoring, updates"],
  ], { title: "Implementation", id: "implementation" })}

    <section class="price-callout container">
      <div class="pc-inner reveal">
        <div><p class="eyebrow">Pricing</p><h3>Setup fee plus subscription, priced by the modules and integrations you choose.</h3></div>
        <a href="/pricing/" class="btn-pill press">See starting-from pricing ${chev}</a>
      </div>
    </section>

${relatedCards(c.related.map((s) => solutions.find((x) => x.slug === s)), "/solutions/")}
${faqBlock(faq)}
${ctaBand({ title: `Get a demo of ${esc(meta.name)}`, preset: "White-label platform" })}
${footnote}`;
  return {
    path, title: meta.name, description: c.meta, body,
    schema: [breadcrumbSchema(trail, path), faqSchema(faq), { "@context": "https://schema.org", "@type": "Product", name: meta.name, description: c.meta, brand: { "@type": "Brand", name: company.name } }],
  };
}

/* ======================= SERVICE PAGE ======================= */
function servicePage(meta) {
  const c = servicePages[meta.slug];
  const path = `/custom-development/${meta.slug}/`;
  const trail = [{ label: "Custom Development", href: "/custom-development/" }, { label: meta.name }];
  const faq = faqObjs(c.faq);
  const body = `
${pageHero({ trail, eyebrow: c.eyebrow, title: c.h1, intro: c.intro, image: `c-${meta.slug}`, highlights: c.build.slice(0, 3) })}

    <section class="statement inner">
      <p class="eyebrow center reveal">The business need</p>
      <h2 class="statement-text reveal">${esc(c.need)}</h2>
    </section>

    <section class="engines container">
      <div class="split-head">
        <h2 class="h2 reveal">What we build</h2>
        <p class="reveal">Scoped with you, designed in your brand, and built in milestones you can review.</p>
      </div>
      ${cardGrid(c.build)}
    </section>

    <section class="stack container">
      <div class="split-head">
        <h2 class="h2 reveal">Technology</h2>
        <p class="reveal">We choose proven, well-supported tools, so your platform is easy to maintain and to hire for.</p>
      </div>
      <ul class="chips big reveal">${c.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
    </section>

    <section class="extranet container">
      <article class="ext-card reveal">
        <div class="ext-copy">
          <span class="tag">Deliverables</span>
          <h2 class="h2">What you<br />receive</h2>
          <p>Clear deliverables at every milestone, with documentation and handover included.</p>
        </div>
        <ul class="ext-list">${c.deliverables.map((x) => `<li><b>${esc(x)}</b></li>`).join("")}</ul>
      </article>
    </section>

${engagement()}
${processTable(processSteps)}
${faqBlock(faq)}
${ctaBand({ title: "Discuss your project", text: "Share your idea and we'll come back with a recommended approach, a rough timeline and next steps.", preset: "Custom development" })}`;
  return { path, title: meta.name, description: c.meta, body, schema: [breadcrumbSchema(trail, path), faqSchema(faq), { "@context": "https://schema.org", "@type": "Service", name: meta.name, description: c.meta, provider: { "@type": "Organization", name: company.name } }] };
}

const engagement = () => `
    <section class="engage container">
      <h2 class="h2 center reveal">Engagement models</h2>
      <div class="why-grid">
        <article class="why-item reveal"><span class="mono">A</span><h4>Fixed scope</h4><p>A defined scope, timeline and price. Best when requirements are clear.</p></article>
        <article class="why-item reveal"><span class="mono">B</span><h4>Milestones</h4><p>Delivered and paid in stages, with reviews at each milestone. Best for larger builds.</p></article>
        <article class="why-item reveal"><span class="mono">C</span><h4>Dedicated team</h4><p>Developers working as part of your team, month to month. <a class="link" href="/hire-developers/">Hire developers ${chev}</a></p></article>
      </div>
    </section>`;

/* ======================= API PAGE ======================= */
function apiPage(meta) {
  const c = apiPages[meta.slug];
  const path = `/api-integrations/${meta.slug}/`;
  const trail = [{ label: "API Integrations", href: "/api-integrations/" }, { label: meta.name }];
  const faq = faqObjs(c.faq);
  const body = `
${pageHero({ trail, eyebrow: c.eyebrow, title: c.h1, intro: c.intro, image: `a-${meta.slug}`, highlights: c.covers.slice(0, 3) })}

    <section class="apps container">
      <div class="apps-copy">
        <h2 class="h2 reveal">What it enables</h2>
        <ul class="ticks reveal">${c.enables.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>
      </div>
      <div class="api-grid two reveal">
        ${c.covers.map(([t, d]) => `<article class="api"><h4>${esc(t)}</h4><p>${esc(d)}</p></article>`).join("")}
      </div>
    </section>

${processTable(apiProcessSteps, { title: "Integration process", id: "integration-process" })}

    <section class="resp container">
      <div class="resp-card reveal">
        <div>
          <p class="eyebrow light">Good to know</p>
          <h3>Supplier contracts are between you and the supplier.</h3>
        </div>
        <p>You sign up with each supplier and own those commercial terms. We handle the technical work: integration, certification, testing and monitoring. <b>Typical timeline:</b> ${esc(c.timeline)}</p>
      </div>
    </section>

${faqBlock(faq)}
${ctaBand({ title: "Plan your integration", text: "Tell us which suppliers you work with, or want to work with, and we'll map out the integration.", preset: "API integration" })}`;
  return { path, title: meta.name, description: c.meta, body, schema: [breadcrumbSchema(trail, path), faqSchema(faq)] };
}

/* ======================= OVERVIEWS ======================= */
function solutionsIndex() {
  const path = "/solutions/";
  const trail = [{ label: "Solutions" }];
  const body = `
${pageHero({ trail, eyebrow: "Ready-made software", title: "Travel booking software,<br />ready to launch", intro: "Eight platforms built on one engine. Pick the ones that fit your business, brand them as your own, and add more as you grow.", image: "p-solutions", highlights: [["8 platforms", "One engine, configured for you"], ["White-label", "Your brand, domain and pricing"], ["Grow in steps", "Switch on modules any time"]] })}

    <section class="container" id="all">
      <div class="sol-grid">
        ${solutions.map((s, i) => `<a href="/solutions/${s.slug}/" class="sol press reveal"><small>${String(i + 1).padStart(2, "0")}</small><h4>${esc(s.name)}</h4><p>${esc(s.short)}</p></a>`).join("\n        ")}
      </div>
    </section>

    <section class="compare container">
      <h2 class="h2 center reveal">White-label or custom?</h2>
      <p class="sub reveal">Both are good choices. Here's how they differ.</p>
      <div class="cmp reveal" role="table">
        <div class="cmp-row head" role="row"><span role="columnheader"></span><span role="columnheader">White-label</span><span role="columnheader">Custom</span></div>
        ${[["Time to launch", "Weeks", "Months, in milestones"], ["Cost", "Lower setup + subscription", "Project-based"], ["Flexibility", "Configurable modules", "Anything you can specify"], ["Maintenance", "Included in subscription", "Support plan"], ["Best for", "Launching fast on a proven model", "Unique models and workflows"]]
          .map(([a, b, c]) => `<div class="cmp-row" role="row"><b role="rowheader">${a}</b><span role="cell">${b}</span><span role="cell">${c}</span></div>`).join("\n        ")}
      </div>
      <div class="cta-row"><a href="/pricing/" class="btn-pill press">See pricing ${chev}</a><a href="/custom-development/" class="link">Custom development ${chev}</a></div>
    </section>
${ctaBand({ preset: "White-label platform" })}`;
  return { path, title: "Travel Booking Software Solutions", description: "White-label travel booking software: OTA platforms, flight, hotel and holiday engines, B2B and B2C portals, corporate travel and back-office.", body, schema: [breadcrumbSchema(trail, path)] };
}

function servicesIndex() {
  const path = "/custom-development/";
  const trail = [{ label: "Custom Development" }];
  const body = `
${pageHero({ trail, eyebrow: "Custom development", title: "Travel software,<br />built for you", intro: "When ready-made won't fit, we design and build travel websites, booking engines, portals, apps and back-office systems around your business.", image: "p-custom-development", highlights: [["Websites & engines", "Built around your inventory"], ["Apps & portals", "For travellers, agents and staff"], ["Milestones", "Delivered in stages you review"]] })}

    <section class="container">
      <div class="sol-grid three">
        ${services.map((s, i) => `<a href="/custom-development/${s.slug}/" class="sol press reveal"><small>${String(i + 1).padStart(2, "0")}</small><h4>${esc(s.name)}</h4><p>${esc(s.short)}</p></a>`).join("\n        ")}
      </div>
    </section>
${engagement()}
${processTable(processSteps)}
${ctaBand({ title: "Discuss your project", preset: "Custom development" })}`;
  return { path, title: "Custom Travel Software Development", description: "Custom travel software development: websites, booking engines, mobile apps, portals, CRM, back-office and integrations.", body, schema: [breadcrumbSchema(trail, path)] };
}

function apisIndex() {
  const path = "/api-integrations/";
  const trail = [{ label: "API Integrations" }];
  const dir = [
    ...apis.map((a) => ({ cat: a.cat, name: a.name, desc: a.short, href: `/api-integrations/${a.slug}/` })),
    { cat: "Flights", name: "NDC content", desc: "Airline NDC offers and ancillaries", href: "/api-integrations/flight-gds-api/" },
    { cat: "Flights", name: "Consolidator fares", desc: "Aggregated wholesale fares", href: "/api-integrations/flight-gds-api/" },
    { cat: "Hotels", name: "Channel managers", desc: "Direct hotel connectivity", href: "/api-integrations/hotel-api/" },
    { cat: "Experiences", name: "Travel insurance", desc: "Trip protection at checkout", href: "/api-integrations/transfers-activities-api/" },
    { cat: "Experiences", name: "Cruise", desc: "Sailings and cabins, where supported", href: "/contact/" },
    { cat: "Business", name: "Accounting & ERP", desc: "Invoices and ledgers synced", href: "/custom-development/custom-software-integrations/" },
    { cat: "Business", name: "CRM & marketing", desc: "Customer and booking data", href: "/custom-development/custom-software-integrations/" },
    { cat: "Payments", name: "Wallets & UPI", desc: "Popular digital payment methods", href: "/api-integrations/payment-gateway-integration/" },
  ];
  const cats = ["All", ...new Set(dir.map((d) => d.cat))];
  const body = `
${pageHero({ trail, eyebrow: "Supplier connectivity", title: "Travel API<br />integrations", intro: "Connect flights, hotels, cars, buses, transfers, activities and payments to your platform. Integrations are subject to supplier access and agreements.", image: "p-api-integrations", highlights: [["Flights", "GDS, LCC, NDC and consolidators"], ["Stays & ground", "Hotels, cars, buses and transfers"], ["Payments", "Gateways, wallets and currencies"]] })}

    <section class="directory container">
      <div class="filters reveal" role="group" aria-label="Filter by category">
        ${cats.map((c, i) => `<button class="filter press" aria-pressed="${i === 0}" data-filter="${c}">${c}</button>`).join("")}
      </div>
      <div class="dir-grid" data-directory>
        ${dir.map((d) => `<a href="${d.href}" class="dir-item press" data-cat="${d.cat}"><small>${d.cat}</small><h4>${esc(d.name)}</h4><p>${esc(d.desc)}</p></a>`).join("\n        ")}
      </div>
      <p class="fineprint">We list supplier brands by name only for integrations we have delivered. Ask us about a specific supplier.</p>
    </section>
${processTable(apiProcessSteps, { title: "How integration works", id: "integration-process" })}
${ctaBand({ title: "Plan your integration", preset: "API integration" })}`;
  return { path, title: "Travel API Integrations", description: "Travel API integration directory: flight and GDS, hotel, car rental, bus, transfers, activities, insurance and payment gateways.", body, schema: [breadcrumbSchema(trail, path)] };
}

function industriesPage() {
  const path = "/industries/";
  const trail = [{ label: "Industries" }];
  const body = `
${pageHero({ trail, eyebrow: "Industries we serve", title: "Built for every kind<br />of travel business", intro: "Different businesses sell travel in different ways. Here's the platform bundle we recommend for each, and why.", ctas: false, image: "p-industries", highlights: [["7 business types", "From agencies to wholesalers"], ["Matched bundles", "Built around how you sell"], ["One platform", "Add products as you grow"]] })}

    <section class="industries container">
      ${industries.map((ind, i) => `
      <article class="ind reveal" id="${ind.id}">
        <div class="ind-head">${img(`i-${ind.id}`, { sizes: "(min-width: 861px) 420px, 92vw", cls: "ind-img" })}<span class="mono">${String(i + 1).padStart(2, "0")}</span><h2>${esc(ind.name)}</h2></div>
        <div class="ind-body">
          <p class="ind-challenge"><b>The challenge.</b> ${esc(ind.challenge)}</p>
          <div class="ind-cols">
            <div><p class="eyebrow">Recommended bundle</p><ul class="ticks">${ind.bundle.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div>
            <div><p class="eyebrow">Features that matter</p><ul class="ticks">${ind.features.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div>
          </div>
          <a href="/request-demo/" class="link">Get a demo for ${esc(ind.name.toLowerCase())} ${chev}</a>
        </div>
      </article>`).join("")}
    </section>
${ctaBand()}`;
  return { path, title: "Industries We Serve", description: "Travel software for agencies, OTAs, tour operators, DMCs, corporate travel, startups and consolidators.", body, schema: [breadcrumbSchema(trail, path)] };
}

function pricingPage() {
  const path = "/pricing/";
  const trail = [{ label: "Pricing" }];
  // Set real "starting from" prices here when confirmed; null shows "On request".
  const tiers = [
    { name: "Starter", price: null, for: "Launching a B2C site with one or two products", items: ["B2C portal", "1–2 booking modules", "1 supplier integration", "1 payment gateway", "Admin & reports", "Email support"] },
    { name: "Business", price: null, for: "Selling direct and through agents", featured: true, items: ["Everything in Starter", "B2B agent portal", "Up to 4 booking modules", "Multiple suppliers", "Markups, credit & wallets", "Priority support"] },
    { name: "Enterprise", price: null, for: "All products, apps and custom work", items: ["Everything in Business", "All booking modules", "Android & iOS apps", "Extranet & CMS", "Custom modules", "Dedicated account manager"] },
  ];
  const faq = faqObjs([
    ["Are supplier fees included?", "No. Supplier, GDS and payment gateway fees are separate and contracted directly by your business."],
    ["Is custom development included?", "Custom work is quoted separately after scoping, or included in Enterprise as agreed."],
    ["Can I upgrade later?", "Yes. Move between tiers or add modules as your business grows."],
  ]);
  const body = `
${pageHero({ trail, eyebrow: "Pricing", title: "Simple, honest<br />starting points", intro: "A one-time setup fee plus a subscription, based on the modules and integrations you choose. Every proposal is itemised.", ctas: false, image: "p-pricing", highlights: [["Setup + subscription", "Itemised in every proposal"], ["Three tiers", "Starter, Business, Enterprise"], ["Supplier fees separate", "Contracted directly by you"]] })}

    <section class="tiers container">
      ${tiers.map((t) => `
      <article class="tier${t.featured ? " featured" : ""} reveal">
        ${t.featured ? `<span class="tag">Most popular</span>` : ""}
        <h3>${t.name}</h3>
        <p class="tier-for">${t.for}</p>
        <p class="tier-price"><small>Starting from</small><b>${t.price ?? "On request"}</b></p>
        <ul class="ticks">${t.items.map((x) => `<li>${x}</li>`).join("")}</ul>
        <a href="/request-demo/" class="btn-pill press">Get a quote ${chev}</a>
      </article>`).join("")}
    </section>

    <section class="addons container">
      <h2 class="h2 center reveal">Add-ons</h2>
      <div class="api-grid">
        ${[["Extra supplier API", "Add more flight, hotel or ground suppliers."], ["Mobile apps", "Android & iOS booking apps."], ["Hosting & cloud management", "Managed hosting, backups and monitoring."], ["Maintenance & support", "Updates, fixes and supplier changes."], ["Extranet & CMS", "Sell your own inventory."], ["Custom development", "Quoted after scoping."]].map(([t, d]) => `<article class="api reveal"><h4>${t}</h4><p>${d}</p></article>`).join("")}
      </div>
      <p class="fineprint">Supplier, GDS and payment gateway fees and contracts are separate and agreed directly with each provider.</p>
    </section>
${faqBlock(faq)}
${ctaBand({ title: "Get an itemised quote" })}`;
  return { path, title: "Pricing", description: "Starting-from pricing for Elyra travel booking software: Starter, Business and Enterprise tiers, plus add-ons.", body, schema: [breadcrumbSchema(trail, path), faqSchema(faq)] };
}

function hirePage() {
  const path = "/hire-developers/";
  const trail = [{ label: "Hire Developers" }];
  const roles = [
    { id: "web", name: "Web Developers", text: "Front-end, back-end and full-stack developers experienced with travel booking flows and supplier APIs.", skills: ["React / Next.js", "Node.js", "Java / .NET", "PostgreSQL", "REST & XML APIs", "Cloud & DevOps"] },
    { id: "mobile", name: "Mobile Developers", text: "Native Android and iOS developers who build fast, polished booking apps.", skills: ["Swift / SwiftUI", "Kotlin / Jetpack", "Push & deep links", "In-app payments", "App Store & Play releases"] },
    { id: "cross-platform", name: "Cross-Platform Developers", text: "One codebase for both stores, which suits most booking and agent apps.", skills: ["Flutter", "React Native", "Shared design systems", "Offline storage", "CI/CD"] },
  ];
  const faq = faqObjs([
    ["How quickly can developers start?", "We'll confirm availability after understanding your needs. Typically we share profiles soon after the first call."],
    ["Who manages the developers?", "They work in your processes and tools, with Elyra handling HR, replacements and quality."],
    ["Can I scale the team up or down?", "Yes, with notice periods agreed in the contract."],
  ]);
  const body = `
${pageHero({ trail, eyebrow: "Dedicated developers", title: "Extend your team<br />with travel-tech talent", intro: "Hire developers who already understand bookings, fares and supplier APIs. They work as part of your team, and we handle the rest.", image: "p-hire-developers", highlights: [["Web", "Front-end, back-end, full-stack"], ["Mobile", "Native Android & iOS"], ["Cross-platform", "Flutter & React Native"]] })}

    <section class="roles container">
      ${roles.map((r, i) => `
      <article class="ind reveal" id="${r.id}">
        <div class="ind-head"><span class="mono">${String(i + 1).padStart(2, "0")}</span><h2>${r.name}</h2></div>
        <div class="ind-body"><p>${r.text}</p><ul class="chips">${r.skills.map((s) => `<li>${s}</li>`).join("")}</ul></div>
      </article>`).join("")}
    </section>

    <section class="engage container">
      <h2 class="h2 center reveal">Ways to hire</h2>
      <div class="why-grid">
        <article class="why-item reveal"><span class="mono">A</span><h4>Full-time</h4><p>A dedicated developer working with you every day, billed monthly.</p></article>
        <article class="why-item reveal"><span class="mono">B</span><h4>Part-time</h4><p>Half-day commitment, for ongoing improvements and maintenance.</p></article>
        <article class="why-item reveal"><span class="mono">C</span><h4>Hourly</h4><p>A block of hours for short tasks and fixes.</p></article>
      </div>
    </section>
${processTable([["Share requirements", "Skills, seniority, time zone"], ["Review profiles", "Shortlisted developers"], ["Interview", "Meet and assess"], ["Onboard", "Your tools, your processes"], ["Ongoing management", "Reviews, replacements, reporting"]], { title: "How it works", id: "how" })}
${faqBlock(faq)}
${ctaBand({ title: "Tell us who you need", preset: "Hire developers" })}`;
  return { path, title: "Hire Travel Software Developers", description: "Hire dedicated web, mobile and cross-platform developers with travel technology experience.", body, schema: [breadcrumbSchema(trail, path), faqSchema(faq)] };
}

function aboutPage() {
  const path = "/about/";
  const trail = [{ label: "About" }];
  const body = `
${pageHero({ trail, eyebrow: "About Elyra", title: "We build the technology<br />behind travel businesses", intro: "Elyra is a travel technology and software development company. We help agencies, tour operators, OTAs and corporate travel providers launch and scale their own booking platforms.", ctas: false, image: "p-about", highlights: [["Ready-made platforms", "White-label, configured for you"], ["Custom development", "Built around your business"], ["API integrations", "Suppliers and payments"]] })}

    <section class="statement inner">
      <h2 class="statement-text reveal">We believe every travel business should own its brand, its customers and its data. Technology should make that easier, not lock you in.</h2>
    </section>

    <section class="why container">
      <h2 class="h2 center reveal">What we do</h2>
      <div class="why-grid">
        <article class="why-item reveal"><span class="mono">01</span><h4>Ready-made platforms</h4><p>White-label software for B2C, B2B, corporate and back-office. <a class="link" href="/solutions/">Solutions ${chev}</a></p></article>
        <article class="why-item reveal"><span class="mono">02</span><h4>Custom development</h4><p>Websites, engines, portals, apps and CRMs built around you. <a class="link" href="/custom-development/">Services ${chev}</a></p></article>
        <article class="why-item reveal"><span class="mono">03</span><h4>API integrations</h4><p>Flights, hotels, ground, experiences and payments. <a class="link" href="/api-integrations/">Integrations ${chev}</a></p></article>
      </div>
    </section>

    <section class="mission container" id="mission">
      <div class="mv reveal"><p class="eyebrow">Mission</p><h3>Help travel businesses launch, customize and scale their own booking platforms, quickly and honestly.</h3></div>
      <div class="mv reveal"><p class="eyebrow">Vision</p><h3>A travel industry where independent businesses compete on equal technology with the largest players.</h3></div>
    </section>

    <section class="why container">
      <h2 class="h2 center reveal">How we work with you</h2>
      <div class="why-grid">
        <article class="why-item reveal"><span class="mono">01</span><h4>Honest advice</h4><p>We'll recommend white-label when it's enough, and custom only when it's needed.</p></article>
        <article class="why-item reveal"><span class="mono">02</span><h4>Accurate claims</h4><p>We promise what we can deliver, and we put it in writing.</p></article>
        <article class="why-item reveal"><span class="mono">03</span><h4>Clear ownership</h4><p>Your brand, your customers, your bookings, your payments.</p></article>
        <article class="why-item reveal"><span class="mono">04</span><h4>Security first</h4><p>HTTPS everywhere, role-based access and careful data handling.</p></article>
        <article class="why-item reveal"><span class="mono">05</span><h4>Visible progress</h4><p>Milestones, demos and a single point of contact.</p></article>
        <article class="why-item reveal"><span class="mono">06</span><h4>Long-term support</h4><p>Maintenance, hosting and updates long after launch.</p></article>
      </div>
    </section>
${processTable(processSteps)}
${ctaBand({ title: "Let's talk" })}`;
  return { path, title: "About Us", description: "About Elyra, a travel technology company building white-label and custom travel booking software, integrations and apps.", body, schema: [breadcrumbSchema(trail, path)] };
}

function resourcesPage() {
  const path = "/resources/";
  const trail = [{ label: "Resources" }];
  const faq = faqObjs(generalFaq);
  const body = `
${pageHero({ trail, eyebrow: "Resources", title: "Travel technology,<br />explained plainly", intro: "Guides and insights for travel businesses choosing, launching and growing their booking platforms.", ctas: false, image: "p-resources", highlights: [["Guides", "Practical and plain-spoken"], ["Insights", "What is changing in travel tech"], ["FAQ", "Answers before you ask"]] })}

    <section class="edit container">
      <div class="edit-grid">
        ${guides.map((g, i) => `<article class="post reveal">
          <div class="post-media">${img(`post${i + 1}`, { sizes: "(min-width: 861px) 320px, 92vw" })}</div>
          <small>${g.tag} · Coming soon</small>
          <h3>${esc(g.title)}</h3>
          <p>${esc(g.text)}</p>
        </article>`).join("\n        ")}
      </div>
      <p class="fineprint">Want a guide when it's published? <a class="link" href="/contact/">Ask us to send it ${chev}</a></p>
    </section>
${faqBlock(faq, { title: "Frequently asked questions" })}
${ctaBand()}`;
  return { path, title: "Resources & FAQ", description: "Travel technology guides, insights and answers to common questions about white-label and custom booking software.", body, schema: [breadcrumbSchema(trail, path), faqSchema(faq)] };
}

function contactPage() {
  const path = "/contact/";
  const trail = [{ label: "Contact" }];
  const details = [
    company.email && `<a href="mailto:${company.email}" class="cd"><small>Email</small><b>${company.email}</b></a>`,
    company.phone && `<a href="tel:${company.phone.replace(/\s/g, "")}" class="cd"><small>Phone</small><b>${company.phone}</b></a>`,
    company.whatsapp && `<a href="https://wa.me/${company.whatsapp}" class="cd" rel="noopener"><small>WhatsApp</small><b>Chat with us</b></a>`,
    company.address && `<div class="cd"><small>Office</small><b>${esc(company.address)}</b></div>`,
  ].filter(Boolean).join("");
  const body = `
    <section class="contact-hero container">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">Contact</span></nav>
      <div class="contact-grid">
        <div class="contact-copy">
          <h1 class="ph-title" data-split>Let's build your<br />travel platform</h1>
          <p>Request a demo, ask for a quote, or book a consultation. A travel technology specialist will reply within one business day.</p>
          <div class="contact-options">
            <a href="/request-demo/" class="opt press"><b>Request a demo</b><span>See the platform on your use case</span></a>
            <a href="#enquire" class="opt press"><b>Get a quote</b><span>Itemised by modules and integrations</span></a>
            <a href="#enquire" class="opt press"><b>Book a consultation</b><span>Talk through white-label vs custom</span></a>
          </div>
          ${details ? `<div class="contact-details">${details}</div>` : ""}
        </div>
        <div id="enquire">${leadForm({ id: "contactForm", submit: "Send message" })}</div>
      </div>
    </section>`;
  return { path, title: "Contact", description: "Contact Elyra: request a demo, get a quote or book a consultation about travel booking software.", body, schema: [breadcrumbSchema(trail, path)] };
}

function demoPage() {
  const path = "/request-demo/";
  const trail = [{ label: "Request a Demo" }];
  const body = `
    <section class="contact-hero container">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">Request a Demo</span></nav>
      <div class="contact-grid">
        <div class="contact-copy">
          <h1 class="ph-title" data-split>See Elyra on<br />your use case</h1>
          <p>Tell us about your business and we'll set up a live demo of the modules that matter to you.</p>
          <ul class="steps">
            <li><span class="mono">01</span><div><b>Share your requirements</b><p>Products, markets, suppliers and timeline.</p></div></li>
            <li><span class="mono">02</span><div><b>We prepare your demo</b><p>Configured around your business model.</p></div></li>
            <li><span class="mono">03</span><div><b>Live walkthrough</b><p>Traveller, agent and admin views, plus your questions.</p></div></li>
            <li><span class="mono">04</span><div><b>Proposal</b><p>An itemised recommendation and timeline.</p></div></li>
          </ul>
        </div>
        <div>${leadForm({ id: "demoForm", submit: "Request a Demo", preset: "White-label platform" })}</div>
      </div>
    </section>`;
  return { path, title: "Request a Demo", description: "Request a live demo of Elyra travel booking software, configured around your business.", body, schema: [breadcrumbSchema(trail, path)] };
}

/* ======================= LEGAL ======================= */
// Starter wording only — have these reviewed by a qualified lawyer before launch.
const legalDocs = {
  privacy: { title: "Privacy Policy", sections: [
    ["Who we are", `${company.name} is a travel technology and software development company. This policy explains how we handle personal information collected through this website.`],
    ["What we collect", "Information you submit in our forms (such as name, business email, company, country, phone and project details), and basic analytics about how the site is used."],
    ["How we use it", "To respond to enquiries, prepare demos and proposals, and improve our website. We do not sell your personal information."],
    ["Sharing", "We share information only with service providers that help us operate (for example email or hosting providers), under appropriate safeguards."],
    ["Your rights", `You can ask to access, correct or delete your information by contacting ${company.email}.`],
  ] },
  terms: { title: "Terms of Use", sections: [
    ["Use of this website", "This website provides information about our products and services. Content may change without notice."],
    ["No offer", "Information on this website is not a binding offer. Commercial terms are set out in a signed agreement."],
    ["Intellectual property", `Content on this website belongs to ${company.name} unless stated otherwise.`],
    ["Liability", "We take care to keep information accurate but cannot guarantee it is complete or current."],
  ] },
  cookies: { title: "Cookie Policy", sections: [
    ["What cookies we use", "Essential cookies needed for the site to work, and, where you consent, analytics cookies that help us understand usage."],
    ["Managing cookies", "You can control cookies through your browser settings and our consent banner where applicable."],
  ] },
  disclaimer: { title: "Disclaimer", sections: [
    ["Software provider", `${company.name} is a software provider. We do not sell travel to the public and are not a party to bookings made on platforms we build.`],
    ["Bookings, payments and support", "Responsibility for bookings, payments, refunds and end-customer support rests with the business operating the platform."],
    ["Suppliers", "Supplier integrations are subject to each supplier's access requirements and agreements with the operating business. Supplier names are trademarks of their owners."],
    ["Feature availability", "Feature availability depends on the chosen product, supplier contracts, integrations and requirements."],
  ] },
};
function legalPage(key) {
  const d = legalDocs[key];
  const path = `/${key}/`;
  const trail = [{ label: d.title }];
  const body = `
    <section class="legal container">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">${d.title}</span></nav>
      <h1 class="ph-title">${d.title}</h1>
      <p class="muted-sm">Last updated: <span data-year></span></p>
      ${d.sections.map(([h, t]) => `<h2>${h}</h2><p>${t}</p>`).join("\n      ")}
    </section>`;
  return { path, title: d.title, description: `${d.title} for ${company.name}.`, body, schema: [breadcrumbSchema(trail, path)] };
}

function notFound() {
  return {
    path: "/404.html", title: "Page not found", description: "The page you're looking for doesn't exist.",
    body: `
    <section class="contact-hero container nf">
      <p class="eyebrow">404</p>
      <h1 class="ph-title">This page took<br />a different route</h1>
      <p>The page you're looking for doesn't exist or has moved.</p>
      <div class="cta-row left"><a href="/" class="btn-pill press">Back to home ${chev}</a><a href="/solutions/" class="link">Browse solutions ${chev}</a></div>
    </section>`,
  };
}

/* ======================= ALL ======================= */
export function allPages() {
  return [
    home(),
    solutionsIndex(), ...solutions.map(solutionPage),
    servicesIndex(), ...services.map(servicePage),
    apisIndex(), ...apis.map(apiPage),
    industriesPage(), pricingPage(), hirePage(), aboutPage(), resourcesPage(), contactPage(), demoPage(),
    ...Object.keys(legalDocs).map(legalPage),
    notFound(),
  ].map((p) => ({ ...p, html: page(p) }));
}

