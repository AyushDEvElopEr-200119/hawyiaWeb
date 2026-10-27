import Link from "next/link";
import { Chev } from "@/components/Brand";
import { BgVideo, Photo } from "@/components/Photo";
import { Kinetic } from "@/components/sections";

const pad = (i: number) => String(i + 1).padStart(2, "0");
const poster = (video: string) => `/assets/media/${video}-poster.jpg`;

type ReelItem = { title: string; kicker: string; href: string; img: string; alt: string; video?: string };

// the six services, as a film strip: a short film where there is one, a photo otherwise
const services: ReelItem[] = [
  { title: "Hotels", kicker: "Negotiated corporate rates", href: "/hotel/", img: poster("hotel"), alt: "Guests walking through an elegant hotel lobby", video: "hotel" },
  { title: "Serviced apartments", kicker: "Long stays that feel like home", href: "/service-apartments/", img: "h-apartment", alt: "Apartment living room overlooking the city" },
  { title: "Chauffeur-driven cars", kicker: "Airport to boardroom", href: "/car-rentals-ground-transport/", img: poster("chauffeur"), alt: "Chauffeur opening the rear door of a black sedan", video: "chauffeur" },
  { title: "MICE & events", kicker: "Offsites, conferences, launches", href: "/mice/", img: poster("events"), alt: "Speaker presenting at a business conference", video: "events" },
  { title: "Relocation & logistics", kicker: "Moves handled end to end", href: "/relocation-logistics/", img: "h-movein", alt: "Couple carrying boxes into a new home" },
  { title: "Corporate holidays", kicker: "Rewards your teams remember", href: "/holidays/", img: "h-resort", alt: "Seaside resort with an infinity pool at sunset", video: "effect" },
];

/** Film strip of the services. On desktop the stage is pinned and scroll carries it sideways
    (initSite: "services reel"); phones swipe it natively. `exclude` drops the current page. */
export function Reel({
  eyebrow = "Six services · one accountable team",
  title = "Every part of the journey, handled.",
  exclude,
}: { eyebrow?: string; title?: string; exclude?: string }) {
  const items = services.filter((r) => r.href !== exclude);
  return (
    <section className="reel" aria-label={title}>
      <div className="reel-stage">
        <div className="reel-head container">
          <p className="eyebrow reveal">{eyebrow}</p>
          <h2 className="h2 kinetic"><Kinetic text={title} /></h2>
        </div>
        <div className="reel-scroller">
          <ul className="reel-track">
            {items.map((r, i) => (
              <li className="reel-item" key={r.title}>
                <Link href={r.href} className="reel-card">
                  <div className="reel-media">
                    {r.video ? <BgVideo name={r.video} poster={r.img.startsWith("/") ? r.img : `/assets/media/${r.img}-1600.webp`} /> : <Photo name={r.img} alt={r.alt} />}
                  </div>
                  <span className="reel-no mono">{pad(i)}</span>
                  <div className="reel-cap">
                    <h3>{r.title}</h3>
                    <p>{r.kicker} <Chev /></p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="reel-progress container" aria-hidden="true"><i /></div>
      </div>
    </section>
  );
}

/** A full-width frame that opens as it scrolls in, with the night-city film behind one line. */
export function Vista({ line, eyebrow = "Corporate travel management · since 2016", cta = "Plan your programme", href = "#enquire" }: {
  line: string; eyebrow?: string; cta?: string; href?: string;
}) {
  return (
    <section className="vista" aria-label="Elyra">
      <div className="vista-frame">
        <div className="vista-img"><BgVideo name="city" poster={poster("city")} /></div>
        <div className="vista-copy">
          <p className="eyebrow light">{eyebrow}</p>
          <h2 className="vista-title kinetic"><Kinetic text={line} /></h2>
          <Link href={href} className="btn-pill press">{cta} <Chev /></Link>
        </div>
      </div>
    </section>
  );
}
