import { notFound } from "next/navigation";
import { Block, CwsHero } from "@/components/cws/Blocks";
import { Reel, Vista } from "@/components/cws/Cinematic";
import { extrasFor } from "@/components/cws/Premium";
import { CtaBand, JsonLd } from "@/components/sections";
import { cwsPage, topPages, type Pair } from "@/lib/cws";
import { breadcrumbSchema, faqSchema, pageMeta, serviceSchema } from "@/lib/seo";

// The service and company pages, kept at their original addresses (/hotel/, /about-us/ …).
type Props = { params: Promise<{ page: string }> };

const servicePages = ["hotel", "service-apartments", "car-rentals-ground-transport", "holidays", "mice", "relocation-logistics", "umrah-tourism", "travgenie"];

// which enquiry desk the form on each page starts on
const desk: Record<string, string> = {
  hotel: "Hotel & Accommodation",
  "service-apartments": "Hotel & Accommodation",
  "car-rentals-ground-transport": "Car Rentals",
  holidays: "Leisure Holidays",
  "umrah-tourism": "Leisure Holidays",
  mice: "MICE & Events",
  "relocation-logistics": "Relocation & Logistics",
  travgenie: "Travgenie Demo",
};

// a short film over the hero photo, where one fits the page
const heroFilm: Record<string, string> = {
  hotel: "hotel",
  "service-apartments": "apartment",
  "car-rentals-ground-transport": "chauffeur",
  mice: "events",
  holidays: "resort",
  "relocation-logistics": "relocation",
  travgenie: "workspace",
  testimonial: "handshake",
  "partner-with-us": "housekeeping",
  "about-us": "skyline",
  services: "city",
};

export const dynamicParams = false;
export function generateStaticParams() {
  return topPages.map((p) => ({ page: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { page } = await params;
  const entry = topPages.find((p) => p.slug === page);
  if (!entry) return {};
  const c = cwsPage(page);
  return pageMeta({ title: c.title, description: c.meta, path: `/${page}/` });
}

export default async function CwsTopPage({ params }: Props) {
  const { page } = await params;
  const entry = topPages.find((p) => p.slug === page);
  if (!entry) notFound();
  const c = cwsPage(page);
  const path = `/${page}/`;
  const trail = servicePages.includes(page)
    ? [{ label: "Services", href: "/services/" }, { label: entry.label }]
    : [{ label: entry.label }];
  const [hero, ...rest] = c.sections;
  const faq = rest.find((s) => s.kind === "faq")?.items as Pair[] | undefined;
  // chapters, bento and ribbon blocks written for this page (lib/inner.ts)
  const extras = extrasFor(page, rest);

  return (
    <>
      <CwsHero s={hero} trail={trail} video={heroFilm[page]} />
      {rest.map((s, i) => {
        const before = extras.get(i) ?? [];
        // service pages show their sister services as the film strip, not a card grid
        if (s.kind === "cards" && s.variant === "siblings") return [...before, <Reel key={i} exclude={path} eyebrow={s.eyebrow ?? "More from Elyra"} title={s.title ?? "One team for the rest of the trip."} />];
        const block = <Block s={s} key={i} preset={desk[page]} />;
        // the services hub opens on the film strip; the city film plays just before the enquiry form
        if (page === "services" && s.kind === "answer") return [...before, block, <Reel key={`r${i}`} />];
        if (s.kind === "cta") return [...before, <Vista key={`v${i}`} line="We don’t just move people, We move possibilities." />, block];
        return [...before, block];
      })}
      {/* the partner page ends on its own enquiry form */}
      {page === "partner-with-us" && (
        <CtaBand
          id="partner-enquiry"
          eyebrow="Partner with Elyra"
          title="Tell us about your property"
          text="Our team in Mumbai reviews your details and contacts you to discuss rates and terms."
          withDepartment={false}
        />
      )}
      <JsonLd data={[
        breadcrumbSchema(trail, path),
        ...(servicePages.includes(page) ? [serviceSchema({ name: entry.label, description: c.meta, path, type: "Corporate travel management" })] : []),
        ...(faq ? [faqSchema(faq)] : []),
      ]} />
    </>
  );
}
