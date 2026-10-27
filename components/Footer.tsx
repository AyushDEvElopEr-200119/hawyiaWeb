import Link from "next/link";
import { apis, company, services, solutions, type NavLink } from "@/lib/site";
import { Chev, LogoMark, Ring } from "./Brand";

function Col({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div className="fcol">
      <p className="fcol-title">{title}</p>
      {links.map((l) =>
        l.href.startsWith("http")
          ? <a href={l.href} key={l.href} target="_blank" rel="noopener">{l.label}</a>
          : <Link href={l.href} key={l.href}>{l.label}</Link>,
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-cta container reveal">
        <h2 className="cta-title"><span>You Travel,</span><em>We Accommodate.</em></h2>
        <div className="cta-row">
          <Link href="/contact/" className="btn-pill press">Book Now <Chev /></Link>
          <a href={`https://wa.me/${company.whatsapp}`} className="link" target="_blank" rel="noopener">WhatsApp us <Chev /></a>
        </div>
      </div>

      <div className="footer-inner">
        <div className="fbrand">
          <span className="logo fbrand-logo"><LogoMark /><span>elyra</span></span>
          <p>{company.footerLine}</p>
          <div className="fsocial">
            {company.social.map((s) => <a href={s.href} key={s.label} target="_blank" rel="noopener">{s.label}</a>)}
          </div>
        </div>
        <div className="fcols">
          <Col title="Solutions" links={[...solutions.map((s) => ({ href: `/solutions/${s.slug}/`, label: s.name })), { href: "/pricing/", label: "Pricing" }]} />
          <Col title="Services" links={[...services.map((s) => ({ href: `/custom-development/${s.slug}/`, label: s.name })), { href: "/hire-developers/", label: "Hire Developers" }]} />
          <Col title="Integrations" links={apis.map((a) => ({ href: `/api-integrations/${a.slug}/`, label: a.name }))} />
          <Col title="Company" links={[
            { href: "/about/", label: "About" }, { href: "/industries/", label: "Industries" }, { href: "/blog/", label: "Blog" }, { href: "/resources/", label: "Resources" },
            { href: "/resources/#faq", label: "FAQ" }, { href: "/contact/", label: "Contact" }, { href: "/request-demo/", label: "Request a Demo" },
          ]} />
        </div>
        <div className="fcontact">
          <a href={`mailto:${company.email}`}>{company.email}</a>
          <a href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone}</a>
          <a href={`https://wa.me/${company.whatsapp}`} rel="noopener">WhatsApp</a>
          <span>{company.address}</span>
        </div>
        <div className="fbadges">
          <p className="fcol-title">Certified &amp; Accredited</p>
          <ul>
            {company.badges.map((b) => (
              // eslint-disable-next-line @next/next/no-img-element
              <li key={b.src}><img src={b.src} alt={b.alt} loading="lazy" decoding="async" /></li>
            ))}
          </ul>
        </div>
        <div className="footer-legal">
          <Link href="/privacy/">Privacy</Link><Link href="/terms/">Terms</Link><Link href="/cookies/">Cookies</Link><Link href="/disclaimer/">Disclaimer</Link>
        </div>
        <p className="copyright">© {new Date().getFullYear()} {company.legal}.</p>
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

/** Small fixed UI the motion controller drives: reading progress, back-to-top and a toast,
    plus the WhatsApp button the original site keeps on every page. */
export function PageChrome() {
  return (
    <>
      <div className="progress" aria-hidden="true" />
      <a className="float-wa press" href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener" aria-label={`Chat with ${company.short} on WhatsApp`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.5 3.4l-5 1.1z" /><path d="M9 9.2c0 3 2.4 5.2 5 5.6.6.1 1.2-.3 1.3-.9l.1-.7-2-.9-.8.9a5 5 0 0 1-2.1-2.2l.9-.8-.9-2-.7.1c-.5.1-.8.5-.8 1z" /></svg>
        <span>WhatsApp</span>
      </a>
      <button className="to-top" aria-label="Back to top"><i className="chev up" /></button>
      <div className="toast" role="status" />
    </>
  );
}
