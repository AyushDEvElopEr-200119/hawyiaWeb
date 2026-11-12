import Link from "next/link";
import { apis, company, products, services, solutions, whatsappLink, type NavLink } from "@/lib/site";
import { getLang } from "@/lib/i18n";
import { Logo } from "./Brand";

const byGroup = (g: string): NavLink[] =>
  solutions.filter((s) => s.group === g).map((s) => ({ href: `/solutions/${s.slug}/`, label: s.name }));

// Directory columns, in the order a visitor scans them: what we sell, how we build, who we are.
const columns: { title: string; links: NavLink[] }[] = [
  { title: "Automate by area", links: byGroup("area") },
  { title: "Automate by team", links: byGroup("team") },
  { title: "AI & data", links: [...byGroup("ai"), { href: "/solutions/", label: "All solutions" }, { href: "/pricing/", label: "Pricing" }] },
  { title: "Business software", links: [...products.map((p) => ({ href: `/business-software/${p.slug}/`, label: p.name })), { href: "/business-software/", label: "All business software" }] },
  { title: "Custom development", links: [...services.map((s) => ({ href: `/custom-development/${s.slug}/`, label: s.name })), { href: "/hire-developers/", label: "Hire Developers" }] },
  { title: "Integrations", links: [...apis.map((a) => ({ href: `/api-integrations/${a.slug}/`, label: a.name })), { href: "/api-integrations/", label: "Integration directory" }] },
  { title: "Company", links: [
    { href: "/automation/", label: "Automation" }, { href: "/about/", label: "About Hawyia" }, { href: "/testimonials/", label: "Client Stories" }, { href: "/industries/", label: "Industries" },
    { href: "/blog/", label: "Blog" }, { href: "/resources/", label: "Resources" }, { href: "/resources/#faq", label: "FAQ" },
    { href: "/contact/", label: "Contact" }, { href: "/request-demo/", label: "Request a Demo" },
  ] },
];

const legal: NavLink[] = [
  { href: "/privacy/", label: "Privacy Policy" }, { href: "/terms/", label: "Terms of Use" },
  { href: "/cookies/", label: "Cookies" }, { href: "/disclaimer/", label: "Disclaimer" }, { href: "/sitemap.xml", label: "Site Map" },
];

/**
 * Footer: a quiet directory of every page and a single fine-print line.
 * On phones the directory folds into one row per column.
 */
export function Footer() {
  const contact = [
    company.email && { href: `mailto:${company.email}`, label: company.email },
    company.phone && { href: `tel:${company.phone.replace(/\s/g, "")}`, label: company.phone },
    company.whatsapp && { href: whatsappLink(getLang()), label: "WhatsApp" },
  ].filter(Boolean) as NavLink[];

  return (
    <footer className="footer">
      <div className="f-body">
        <div className="f-top container">
          <Link href="/" className="f-brand" aria-label={`${company.name} home`}>
            <Logo />
          </Link>
          <p className="f-tagline">Software development, automation and AI solutions, for businesses that want simpler operations and more time for the work that matters.</p>
          {contact.length > 0 && (
            <ul className="f-contact">{contact.map((c) => <li key={c.href}><a href={c.href} {...(c.href.startsWith("https://wa.me") && { target: "_blank", rel: "noopener" })}>{c.label}</a></li>)}</ul>
          )}
        </div>

        <nav className="f-dir container" aria-label="Footer">
          {columns.map((c) => (
            <div className="f-col" key={c.title}>
              <h3>{c.title}</h3>
              <ul>{c.links.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
            </div>
          ))}
        </nav>

        {/* phones: one tappable row per column, the way a long directory stays scannable */}
        <nav className="f-acc container" aria-label="Footer">
          {columns.map((c) => (
            <details key={c.title}>
              <summary>{c.title}<i aria-hidden="true" /></summary>
              <ul>{c.links.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
            </details>
          ))}
        </nav>

        <div className="f-legal container">
          <p className="f-fine">
            Feature availability depends on the chosen product, integrations and requirements.
            Hawyia is the software provider: your data, customers, payments and third-party accounts stay with your business.
          </p>
          <div className="f-legal-row">
            <p>Copyright © {new Date().getFullYear()} {company.legal}. All rights reserved.</p>
            <ul>{legal.map((l) => <li key={l.href}>{l.href.endsWith(".xml") ? <a href={l.href}>{l.label}</a> : <Link href={l.href}>{l.label}</Link>}</li>)}</ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Small fixed UI: reading progress, the WhatsApp chat button, back-to-top and a toast. */
export function PageChrome() {
  return (
    <>
      <div className="progress" aria-hidden="true" />
      {company.whatsapp && (
        <a href={whatsappLink(getLang())} className="wa-float" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp" data-cursor="disc">
          <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" fill="currentColor">
            <path d="M16.04 3C9 3 3.3 8.7 3.3 15.73c0 2.25.59 4.45 1.71 6.38L3.2 28.8l6.86-1.8a12.7 12.7 0 0 0 5.98 1.52h.01c7.03 0 12.74-5.7 12.74-12.73 0-3.4-1.33-6.6-3.73-9A12.65 12.65 0 0 0 16.04 3Zm0 23.37h-.01a10.57 10.57 0 0 1-5.39-1.48l-.39-.23-4.07 1.07 1.09-3.97-.25-.41a10.56 10.56 0 0 1-1.62-5.62c0-5.84 4.76-10.59 10.6-10.59 2.83 0 5.49 1.1 7.49 3.1a10.52 10.52 0 0 1 3.1 7.5c0 5.84-4.75 10.6-10.55 10.6Zm5.81-7.93c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.19.21-.37.24-.69.08-.32-.16-1.34-.5-2.56-1.58-.95-.85-1.59-1.89-1.77-2.21-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.98-2.34-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.08 1.3 3.29c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.14-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z" />
          </svg>
        </a>
      )}
      <button className="to-top" aria-label="Back to top"><i className="chev up" /></button>
      <div className="toast" role="status" />
    </>
  );
}
