import { setLang, type LangParams } from "@/lib/i18n";
import Link from "next/link";
import { Chev } from "@/components/Brand";
import { PosterGrid } from "@/components/cinematic";
import { CtaBand, JsonLd, PageHero } from "@/components/sections";
import { solutions } from "@/lib/site";
import { breadcrumbSchema, metaFor } from "@/lib/seo";

const path = "/solutions/";
const trail = [{ label: "Solutions" }];

export const generateMetadata = metaFor({
  title: "Travel Booking Software Solutions",
  description: "White-label travel booking software: OTA platforms, flight, hotel and holiday engines, B2B and B2C portals, corporate travel and back-office.",
  path,
});

const comparison: [string, string, string][] = [
  ["Time to launch", "Weeks", "Months, in milestones"],
  ["Cost", "Lower setup + subscription", "Project-based"],
  ["Flexibility", "Configurable modules", "Anything you can specify"],
  ["Maintenance", "Included in subscription", "Support plan"],
  ["Best for", "Launching fast on a proven model", "Unique models and workflows"],
];

const groups = [
  { id: "platform", title: "Booking platforms", text: "An engine for each product, or every product in one OTA." },
  { id: "portal", title: "Portals by business model", text: "The same engine, shaped around who you sell to." },
  { id: "office", title: "Back-office & inventory", text: "Everything that happens before and after the booking." },
];

export default async function SolutionsPage({ params }: LangParams) {
  setLang((await params).lang);
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="Ready-made software"
        title="Travel booking software,<br />ready to launch"
        intro={`${solutions.length} platforms built on one engine. Pick the ones that fit your business, brand them as your own, and add more as you grow.`}
        image="p-solutions"
        highlights={[[`${solutions.length} platforms`, "One engine, configured for you"], ["White-label", "Your brand, domain and pricing"], ["Grow in steps", "Switch on modules any time"]]}
      />

      <section className="container posters-sec" id="all">
        {groups.map((g) => (
          <PosterGrid
            key={g.id}
            title={g.title}
            text={g.text}
            items={solutions.filter((s) => s.group === g.id).map((s) => ({ href: `/solutions/${s.slug}/`, title: s.name, text: s.short, image: `d-${s.slug}` }))}
          />
        ))}
      </section>

      <section className="compare container">
        <h2 className="h2 center reveal">White-label or custom?</h2>
        <p className="sub reveal">Both are good choices. Here&apos;s how they differ.</p>
        <div className="cmp reveal" role="table">
          <div className="cmp-row head" role="row"><span role="columnheader" /><span role="columnheader">White-label</span><span role="columnheader">Custom</span></div>
          {comparison.map(([a, b, c]) => (
            <div className="cmp-row" role="row" key={a}><b role="rowheader">{a}</b><span role="cell">{b}</span><span role="cell">{c}</span></div>
          ))}
        </div>
        <div className="cta-row">
          <Link href="/pricing/" className="btn-pill press">See pricing <Chev /></Link>
          <Link href="/custom-development/" className="link">Custom development <Chev /></Link>
        </div>
      </section>

      <CtaBand preset="White-label platform" />
      <JsonLd data={breadcrumbSchema(trail, path)} />
    </>
  );
}
