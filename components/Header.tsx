import Link from "next/link";
import { company, nav, type MegaMenu } from "@/lib/site";
import { Chev, Logo } from "./Brand";

function MegaPanel({ mega, id, label }: { mega: MegaMenu; id: string; label: string }) {
  return (
    <div className="mega" id={id} role="region" aria-label={label}>
      <div className={`mega-inner${mega.aside ? "" : " no-aside"}`}>
        {mega.columns.map((c) => (
          <div className="mega-col" key={c.title}>
            <p className="mega-title">{c.title}</p>
            <ul>
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="mega-link">
                    <b>{l.label}</b>
                    {l.desc && <span>{l.desc}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {mega.aside && (
          <div className="mega-aside">
            <p className="mega-aside-title">{mega.aside.title}</p>
            <p>{mega.aside.text}</p>
            {mega.aside.links.map((l) => (
              <Link href={l.href} className="link" key={l.href}>
                {l.label} <Chev />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Header and mobile menu. Open/close, hover and scroll behaviour live in the motion controller. */
export function Header() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="header" id="header">
        <Link href="/" className="logo" aria-label={`${company.name} home`}>
          <Logo />
        </Link>
        <nav className="nav" aria-label="Primary">
          <ul>
            <li className="nav-hover" role="presentation" aria-hidden="true" />
            {nav.map((item, i) =>
              item.mega ? (
                <li className="has-mega" key={item.label}>
                  <button className="nav-link" aria-expanded="false" aria-controls={`mega-${i}`}>
                    {item.label}
                    <i className="caret" />
                  </button>
                  <MegaPanel mega={item.mega} id={`mega-${i}`} label={item.label} />
                </li>
              ) : (
                <li key={item.label}>
                  <Link href={item.href} className="nav-link">{item.label}</Link>
                </li>
              ),
            )}
          </ul>
        </nav>
        <Link href="/request-demo/" className="btn-nav press">Request a Demo</Link>
        <button className="menu-btn press" id="menuBtn" aria-expanded="false" aria-controls="mobileMenu">Menu</button>
      </header>

      <div className="mobile-menu" id="mobileMenu" aria-hidden="true">
        {nav.map((item) => {
          if (!item.mega) {
            return <Link href={item.href} className="mm-link" key={item.label}>{item.label}</Link>;
          }
          const links = item.mega.columns.flatMap((c) => c.links).concat(item.mega.aside?.links ?? []);
          return (
            <details className="mm-group" key={item.label}>
              <summary className="mm-link">{item.label}</summary>
              <div className="mm-sub">
                {links.map((l) => <Link href={l.href} key={l.href + l.label}>{l.label}</Link>)}
              </div>
            </details>
          );
        })}
        <Link href="/request-demo/" className="btn-pill press">Request a Demo <Chev /></Link>
      </div>
    </>
  );
}
