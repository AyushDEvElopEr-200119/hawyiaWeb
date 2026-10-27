import Link from "next/link";
import { company, services, type NavLink } from "@/lib/site";
import { Chev, LogoMark } from "./Brand";

function Col({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div className="fx-col">
      <p className="fx-label">{title}</p>
      <ul>
        {links.map((l) => (
          <li key={l.href}>
            {l.href.startsWith("http")
              ? <a href={l.href} target="_blank" rel="noopener">{l.label}<i className="fx-ext" aria-hidden="true">↗</i></a>
              : <Link href={l.href}>{l.label}</Link>}
          </li>
        ))}
      </ul>
    </div>
  );
}

// line icons for the social links, drawn at 20px on a 24 grid
const socialIcon: Record<string, React.ReactNode> = {
  LinkedIn: <><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M8 10.5V16M8 7.6v.1M11.5 16v-3.2a2.3 2.3 0 0 1 4.6 0V16M11.5 10.5V16" /></>,
  YouTube: <><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10.2 9.4 4.4 2.6-4.4 2.6z" /></>,
  Facebook: <><circle cx="12" cy="12" r="9.5" /><path d="M13.2 21.4V13.5h2.4l.4-2.8h-2.8V9c0-.8.3-1.4 1.4-1.4h1.5V5.2a19 19 0 0 0-2.2-.1c-2.2 0-3.6 1.3-3.6 3.7v1.9H8v2.8h2.3v7.9" /></>,
  Instagram: <><rect x="3" y="3" width="18" height="18" rx="5.5" /><circle cx="12" cy="12" r="4" /><path d="M17.3 6.7v.1" /></>,
};

const contacts = [
  { label: "Email", value: company.email, href: `mailto:${company.email}` },
  { label: "Call", value: company.phone, href: `tel:${company.phone.replace(/\s/g, "")}` },
  { label: "WhatsApp", value: company.mobile, href: `https://wa.me/${company.whatsapp}` },
  { label: "Head office", value: "Vikhroli (West), Mumbai", href: `https://www.google.com/maps?q=${encodeURIComponent(company.address)}`, title: company.address },
];

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

      {/* one dark panel: brand and links, contact tiles, credentials, the base line, and a giant
          wordmark that rises into the bottom edge as you arrive (initSite: footer wordmark) */}
      <div className="fx" id="footerPanel">
        <span className="fx-glow" aria-hidden="true" />
        <div className="fx-top">
          <div className="fx-brand">
            <Link href="/" className="fx-logo" aria-label={`${company.name} home`}><LogoMark inner="#0c1f1c" /><span>elyra</span></Link>
            <p>{company.footerLine}</p>
            <div className="fx-actions">
              <Link href="/contact/#enquire" className="fx-btn press">Start an enquiry <Chev /></Link>
              <Link href="/travgenie/" className="fx-btn ghost press">Try Travgenie</Link>
            </div>
          </div>
          <nav className="fx-cols" aria-label="Footer">
            <Col title="Services" links={services.map((x) => ({ href: `/${x.slug}/`, label: x.name }))} />
            <Col title="Company" links={[
              { href: "/about-us/", label: "About" }, { href: "/team/", label: "Team" }, { href: "/testimonial/", label: "Testimonials" },
              { href: "/partner-with-us/", label: "Partner with us" }, { href: "/blog/", label: "Journal" }, { href: "/contact/", label: "Contact" },
            ]} />
            <Col title="Platform" links={[{ href: "/services/", label: "All services" }, { href: "/travgenie/", label: "Travgenie" }, { href: company.travgenie, label: "travgenie.com" }]} />
          </nav>
        </div>

        <ul className="fx-contact">
          {contacts.map((c) => (
            <li key={c.label}>
              <a href={c.href} title={c.title} {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})} className="press">
                <small>{c.label}</small><b>{c.value}</b><i className="fx-arrow" aria-hidden="true">↗</i>
              </a>
            </li>
          ))}
        </ul>

        <div className="fx-creds">
          <p className="fx-label">Certified &amp; accredited</p>
          <ul>
            {company.badges.map((b) => {
              const mark = b.alt.split(/\s+—\s+/)[0];
              return <li key={b.src} title={b.alt}><i aria-hidden="true" />{mark === "ISO certified" ? "ISO 9001 · 27001" : mark}</li>;
            })}
          </ul>
        </div>

        <div className="fx-base">
          <p>© {new Date().getFullYear()} {company.legal}. All rights reserved.</p>
          <nav aria-label="Legal"><Link href="/privacy-policy/">Privacy Policy</Link><Link href="/terms-conditions/">Terms &amp; Conditions</Link></nav>
          <div className="fx-social">
            {company.social.map((x) => (
              <a href={x.href} key={x.label} target="_blank" rel="noopener" aria-label={x.label} className="press">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{socialIcon[x.label]}</svg>
              </a>
            ))}
          </div>
        </div>

        <div className="fx-word" aria-hidden="true"><span>elyra</span></div>
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
