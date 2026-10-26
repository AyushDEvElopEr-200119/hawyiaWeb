// Shared page chrome and reusable sections.
import { company, nav, solutions, services, apis } from "./site.mjs";
import { img } from "./media.mjs";

export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const logoSvg = (inner = "var(--bg)") => `
  <svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="16" cy="16" r="14" fill="currentColor" />
    <path d="M4 18 Q16 8 28 14" stroke="${inner}" stroke-width="2.4" fill="none" stroke-linecap="round" />
    <circle cx="24" cy="12.6" r="2.4" fill="${inner}" />
  </svg>`;

export const chev = `<i class="chev"></i>`;

/* ---------------- head ---------------- */
function head({ title, description, path, schema = [] }) {
  const full = path === "/" ? `${company.name} — ${company.tagline}` : `${title} | ${company.name}`;
  const canonical = company.url + path;
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: company.url,
    ...(company.email && { email: company.email }),
  };
  const ld = [org, ...schema].map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n  ");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script>document.documentElement.classList.add("js")</script>
  <title>${esc(full)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(full)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta name="theme-color" content="#0f3e39" />
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Fragment+Mono&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/assets/vendor/lenis.css" />
  <link rel="stylesheet" href="/assets/css/style.css" />
  ${ld}
</head>`;
}

/* ---------------- header + mega menu ---------------- */
function megaPanel(item, i) {
  const m = item.mega;
  const cols = m.columns.map((c) => `
          <div class="mega-col">
            <p class="mega-title">${esc(c.title)}</p>
            <ul>${c.links.map((l) => `
              <li><a href="${l.href}" class="mega-link"><b>${esc(l.label)}</b>${l.desc ? `<span>${esc(l.desc)}</span>` : ""}</a></li>`).join("")}
            </ul>
          </div>`).join("");
  const aside = m.aside ? `
          <div class="mega-aside">
            <p class="mega-aside-title">${esc(m.aside.title)}</p>
            <p>${esc(m.aside.text)}</p>
            ${m.aside.links.map((l) => `<a href="${l.href}" class="link">${esc(l.label)} ${chev}</a>`).join("")}
          </div>` : "";
  return `
        <div class="mega" id="mega-${i}" role="region" aria-label="${esc(item.label)}">
          <div class="mega-inner${m.aside ? "" : " no-aside"}">${cols}${aside}
          </div>
        </div>`;
}

function header(path) {
  const items = nav.map((item, i) => {
    if (item.href) {
      const current = path.startsWith(item.href) ? ` aria-current="page"` : "";
      return `<li><a href="${item.href}" class="nav-link"${current}>${esc(item.label)}</a></li>`;
    }
    return `<li class="has-mega">
        <button class="nav-link" aria-expanded="false" aria-controls="mega-${i}">${esc(item.label)}<i class="caret"></i></button>${megaPanel(item, i)}
      </li>`;
  }).join("\n      ");

  return `
  <a class="skip" href="#main">Skip to content</a>
  <header class="header" id="header">
    <a href="/" class="logo" aria-label="${company.name} home">${logoSvg()}<span>elyra</span></a>
    <nav class="nav" aria-label="Primary">
      <ul>
      ${items}
      </ul>
    </nav>
    <a href="/request-demo/" class="btn-nav press">Request a Demo</a>
    <button class="menu-btn press" id="menuBtn" aria-expanded="false" aria-controls="mobileMenu">Menu</button>
  </header>
  ${mobileMenu()}`;
}

function mobileMenu() {
  const groups = nav.map((item) => {
    if (item.href) return `<a href="${item.href}" class="mm-link">${esc(item.label)}</a>`;
    const links = item.mega.columns.flatMap((c) => c.links).concat(item.mega.aside?.links || []);
    return `<details class="mm-group">
      <summary class="mm-link">${esc(item.label)}</summary>
      <div class="mm-sub">${links.map((l) => `<a href="${l.href}">${esc(l.label)}</a>`).join("")}</div>
    </details>`;
  }).join("\n    ");
  return `<div class="mobile-menu" id="mobileMenu" aria-hidden="true">
    ${groups}
    <a href="/request-demo/" class="btn-pill press">Request a Demo ${chev}</a>
  </div>`;
}

/* ---------------- footer ring ----------------
   A soft, scalloped ring: an 8-lobed wave around a circle, drawn as a thick mint
   band with a blurred white core on top, so the edges stay crisp and mint while the
   middle of the band fades to white. Generated here, so the shape is just numbers. */
function ringSvg({ radius = 420, depth = 0.07, lobes = 8, band = 190 } = {}) {
  const pts = [];
  for (let deg = 0; deg < 360; deg += 1) {
    const t = (deg * Math.PI) / 180;
    // + PI puts a soft dip at the top centre, between two lobes
    const r = radius * (1 + depth * Math.cos(lobes * t + Math.PI));
    pts.push(`${(r * Math.cos(t - Math.PI / 2)).toFixed(1)} ${(r * Math.sin(t - Math.PI / 2)).toFixed(1)}`);
  }
  const d = `M${pts.join("L")}Z`;
  return `<svg class="ring" viewBox="-600 -600 1200 1200" focusable="false">
        <defs><filter id="ringSoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="30" /></filter></defs>
        <g fill="none" stroke-linejoin="round">
          <path d="${d}" stroke="rgb(130 213 199)" stroke-width="${band}" />
          <path d="${d}" stroke="#fff" stroke-width="${Math.round(band * 0.56)}" filter="url(#ringSoft)" />
        </g>
      </svg>`;
}

/* ---------------- footer ---------------- */
function footer() {
  const col = (title, links) => `
        <div class="fcol">
          <p class="fcol-title">${title}</p>
          ${links.map((l) => `<a href="${l.href}">${esc(l.label)}</a>`).join("")}
        </div>`;
  const contact = [
    company.email && `<a href="mailto:${company.email}">${company.email}</a>`,
    company.phone && `<a href="tel:${company.phone.replace(/\s/g, "")}">${company.phone}</a>`,
    company.whatsapp && `<a href="https://wa.me/${company.whatsapp}" rel="noopener">WhatsApp</a>`,
    company.address && `<span>${esc(company.address)}</span>`,
  ].filter(Boolean).join("");

  return `
  <footer class="footer">
    <div class="footer-cta container reveal">
      <h2 class="cta-title"><span>Ready to</span><em>launch your platform?</em></h2>
      <div class="cta-row">
        <a href="/request-demo/" class="btn-pill press">Request a Demo ${chev}</a>
        <a href="/contact/" class="link">Discuss your project ${chev}</a>
      </div>
    </div>
    <div class="footer-inner">
      <div class="fcols">${col("Solutions", solutions.map((s) => ({ href: `/solutions/${s.slug}/`, label: s.name })).concat({ href: "/pricing/", label: "Pricing" }))}${col("Services", services.map((s) => ({ href: `/custom-development/${s.slug}/`, label: s.name })).concat({ href: "/hire-developers/", label: "Hire Developers" }))}${col("Integrations", apis.map((a) => ({ href: `/api-integrations/${a.slug}/`, label: a.name })))}${col("Company", [
        { href: "/about/", label: "About" }, { href: "/industries/", label: "Industries" }, { href: "/resources/", label: "Resources" },
        { href: "/resources/#faq", label: "FAQ" }, { href: "/contact/", label: "Contact" }, { href: "/request-demo/", label: "Request a Demo" },
      ])}
      </div>
      ${contact ? `<div class="fcontact">${contact}</div>` : ""}
      <div class="footer-legal">
        <a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/cookies/">Cookies</a><a href="/disclaimer/">Disclaimer</a>
      </div>
      <p class="copyright">© <span data-year></span> ${company.legal}. Software provider. Feature availability depends on chosen product, supplier contracts, integrations and requirements.</p>
    </div>
    <!-- the footer ends on the ring: its top half rises from the page edge, the logo sits in its opening -->
    <div class="footer-mark">
      <div class="ring-wrap" aria-hidden="true">${ringSvg()}</div>
      <a href="/" class="fm-logo" aria-label="${company.name} home">${logoSvg("var(--bg)")}<span>elyra</span></a>
    </div>
  </footer>`;
}

/* ---------------- page shell ---------------- */
export function page({ title, description, path, body, schema = [], bodyClass = "" }) {
  return `${head({ title, description, path, schema })}
<body class="${bodyClass}">
  ${header(path)}
  <main id="main" tabindex="-1">
${body}
  </main>
${footer()}
  <script src="/assets/vendor/lenis.min.js"></script>
  <script src="/assets/vendor/gsap.min.js"></script>
  <script src="/assets/vendor/ScrollTrigger.min.js"></script>
  <script src="/assets/vendor/Flip.min.js"></script>
  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/micro.js"></script>
</body>
</html>
`;
}

/* ---------------- reusable sections ---------------- */
export function breadcrumbs(trail) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${trail.map((t) =>
    t.href ? `<span>/</span><a href="${t.href}">${esc(t.label)}</a>` : `<span>/</span><span aria-current="page">${esc(t.label)}</span>`).join("")}</nav>`;
}

export function breadcrumbSchema(trail, path) {
  const items = [{ name: "Home", item: company.url + "/" }, ...trail.map((t) => ({ name: t.label, item: company.url + (t.href || path) }))];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, ...it })),
  };
}

export function faqSchema(faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

// Inner-page hero: big serif title + intro, then a full photo band that opens on load,
// with a glass strip of three real highlights for the page along its bottom edge.
export function pageHero({ trail, eyebrow, title, intro, ctas = true, image = "", highlights = [] }) {
  return `
    <section class="page-hero">
      <div class="container ph-head">
        ${breadcrumbs(trail)}
        <div class="ph-split">
          <div>
            ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ""}
            <h1 class="ph-title" data-split>${title}</h1>
          </div>
          <div class="ph-intro">
            <p>${intro}</p>
            ${ctas ? `<div class="cta-row left">
              <a href="/request-demo/" class="btn-pill press">Request a Demo ${chev}</a>
              <a href="/contact/" class="link">Get a quote ${chev}</a>
            </div>` : ""}
          </div>
        </div>
      </div>
      <div class="xp ph-stage" data-expand>
        <div class="ph-media xp-frame" data-ph-media>
          ${image ? img(image, { cls: "ph-bg", eager: true }) : ""}
          ${highlights.length ? `<ul class="ph-highlights" data-ph-hl>
            ${highlights.map(([t, d], i) => `<li><span class="mono">${String(i + 1).padStart(2, "0")}</span><b>${esc(t)}</b><p>${esc(d)}</p></li>`).join("\n            ")}
          </ul>` : ""}
        </div>
      </div>
    </section>`;
}

export function faqBlock(faq, { title = "Questions, answered", id = "faq" } = {}) {
  return `
    <section class="faq container" id="${id}">
      <h2 class="h2 center reveal">${title}</h2>
      <div class="faq-list">
        ${faq.map((f) => `<details class="reveal"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("\n        ")}
      </div>
    </section>`;
}

export function leadForm({ id = "leadForm", submit = "Request a Demo", preset = "" } = {}) {
  const opt = (arr, sel) => arr.map((o) => `<option${o === sel ? " selected" : ""}>${o}</option>`).join("");
  return `
      <!-- Set data-endpoint to your form handler (CRM, email service). Without it, the form opens an email draft. -->
      <form class="lead reveal" id="${id}" novalidate data-endpoint="" data-mailto="${company.email}">
        <div class="f"><label for="${id}-name">Full name</label><input id="${id}-name" name="name" autocomplete="name" required /><small class="err" aria-live="polite"></small></div>
        <div class="f"><label for="${id}-email">Business email</label><input id="${id}-email" name="email" type="email" autocomplete="email" required /><small class="err" aria-live="polite"></small></div>
        <div class="f"><label for="${id}-company">Company</label><input id="${id}-company" name="company" autocomplete="organization" /></div>
        <div class="f"><label for="${id}-country">Country</label><input id="${id}-country" name="country" autocomplete="country-name" /></div>
        <div class="f"><label for="${id}-phone">Phone or WhatsApp</label><input id="${id}-phone" name="phone" type="tel" autocomplete="tel" /></div>
        <div class="f"><label for="${id}-type">Type of travel business</label>
          <select id="${id}-type" name="business"><option value="">Select…</option>${opt(["Travel agency", "OTA", "Tour operator", "DMC", "Corporate travel / TMC", "Consolidator / wholesaler", "Travel startup", "Other"])}</select></div>
        <div class="f"><label for="${id}-need">What do you need?</label>
          <select id="${id}-need" name="need"><option value="">Select…</option>${opt(["White-label platform", "Custom development", "API integration", "Extranet / CMS", "Mobile app", "Hire developers", "Not sure yet"], preset)}</select></div>
        <div class="f"><label for="${id}-timeline">Estimated timeline</label>
          <select id="${id}-timeline" name="timeline"><option value="">Select…</option>${opt(["As soon as possible", "1–3 months", "3–6 months", "6+ months", "Just exploring"])}</select></div>
        <div class="f full"><label for="${id}-msg">Project requirements</label><textarea id="${id}-msg" name="message" rows="4" placeholder="Products, markets, suppliers, integrations…"></textarea></div>
        <div class="f full actions">
          <button type="submit" class="btn-pill press">${submit} ${chev}</button>
          <p class="form-status" role="status"></p>
        </div>
      </form>`;
}

export function ctaBand({ title = "Let's scope your platform", text = "Tell us what you sell and who you sell to. We'll recommend the fastest route and send a timeline.", preset = "" } = {}) {
  return `
    <section class="cta-band container" id="enquire">
      <div class="cta-band-inner">
        <div class="cta-band-copy reveal">
          <h2 class="h2">${title}</h2>
          <p>${text}</p>
          <ul class="ticks">
            <li>Reply within one business day</li>
            <li>Live demo on your own use case</li>
            <li>No obligation proposal</li>
          </ul>
        </div>
        ${leadForm({ id: "enq", submit: "Send enquiry", preset })}
      </div>
    </section>`;
}
