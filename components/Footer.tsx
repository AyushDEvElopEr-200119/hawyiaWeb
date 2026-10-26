import Link from "next/link";
import { apis, company, services, solutions, type NavLink } from "@/lib/site";
import { Chev, LogoMark, Ring } from "./Brand";

function Col({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div className="fcol">
      <p className="fcol-title">{title}</p>
      {links.map((l) => <Link href={l.href} key={l.href}>{l.label}</Link>)}
    </div>
  );
}

export function Footer() {
  const hasContact = company.email || company.phone || company.whatsapp || company.address;
  return (
    <footer className="footer">
      <div className="footer-cta container reveal">
        <h2 className="cta-title"><span>Ready to</span><em>launch your platform?</em></h2>
        <div className="cta-row">
          <Link href="/request-demo/" className="btn-pill press">Request a Demo <Chev /></Link>
          <Link href="/contact/" className="link">Discuss your project <Chev /></Link>
        </div>
      </div>

      <div className="footer-inner">
        <div className="fcols">
          <Col title="Solutions" links={[...solutions.map((s) => ({ href: `/solutions/${s.slug}/`, label: s.name })), { href: "/pricing/", label: "Pricing" }]} />
          <Col title="Services" links={[...services.map((s) => ({ href: `/custom-development/${s.slug}/`, label: s.name })), { href: "/hire-developers/", label: "Hire Developers" }]} />
          <Col title="Integrations" links={apis.map((a) => ({ href: `/api-integrations/${a.slug}/`, label: a.name }))} />
          <Col title="Company" links={[
            { href: "/about/", label: "About" }, { href: "/industries/", label: "Industries" }, { href: "/resources/", label: "Resources" },
            { href: "/resources/#faq", label: "FAQ" }, { href: "/contact/", label: "Contact" }, { href: "/request-demo/", label: "Request a Demo" },
          ]} />
        </div>
        {hasContact && (
          <div className="fcontact">
            {company.email && <a href={`mailto:${company.email}`}>{company.email}</a>}
            {company.phone && <a href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone}</a>}
            {company.whatsapp && <a href={`https://wa.me/${company.whatsapp}`} rel="noopener">WhatsApp</a>}
            {company.address && <span>{company.address}</span>}
          </div>
        )}
        <div className="footer-legal">
          <Link href="/privacy/">Privacy</Link><Link href="/terms/">Terms</Link><Link href="/cookies/">Cookies</Link><Link href="/disclaimer/">Disclaimer</Link>
        </div>
        <p className="copyright">
          © {new Date().getFullYear()} {company.legal}. Software provider. Feature availability depends on chosen product, supplier contracts, integrations and requirements.
        </p>
      </div>

      {/* the footer ends on the ring: its top half rises from the page edge, the logo sits in its opening */}
      <div className="footer-mark">
        <div className="ring-wrap" aria-hidden="true"><Ring /></div>
        <Link href="/" className="fm-logo" aria-label={`${company.name} home`}>
          <LogoMark inner="var(--bg)" />
          <span>elyra</span>
        </Link>
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
