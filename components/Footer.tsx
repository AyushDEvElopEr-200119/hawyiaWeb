import Link from "next/link";
import { apis, company, products, services, solutions, type NavLink } from "@/lib/site";
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
    company.whatsapp && { href: `https://wa.me/${company.whatsapp}`, label: "WhatsApp" },
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
            <ul className="f-contact">{contact.map((c) => <li key={c.href}><a href={c.href}>{c.label}</a></li>)}</ul>
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

/** Small fixed UI the motion controller drives: reading progress, back-to-top and a toast. */
export function PageChrome() {
  return (
    <>
      <div className="progress" aria-hidden="true" />
      <button className="to-top" aria-label="Back to top"><i className="chev up" /></button>
      <div className="toast" role="status" />
    </>
  );
}
