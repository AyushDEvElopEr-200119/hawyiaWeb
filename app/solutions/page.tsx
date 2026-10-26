import Link from "next/link";
import { Chev } from "@/components/Brand";
import { CtaBand, JsonLd, PageHero } from "@/components/sections";
import { solutions } from "@/lib/site";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";

const path = "/solutions/";
const trail = [{ label: "Solutions" }];

export const metadata = pageMeta({
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

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="Ready-made software"
        title="Travel booking software,<br />ready to launch"
        intro="Eight platforms built on one engine. Pick the ones that fit your business, brand them as your own, and add more as you grow."
        image="p-solutions"
        highlights={[["8 platforms", "One engine, configured for you"], ["White-label", "Your brand, domain and pricing"], ["Grow in steps", "Switch on modules any time"]]}
      />

      <section className="container" id="all">
        <div className="sol-grid">
          {solutions.map((s, i) => (
            <Link href={`/solutions/${s.slug}/`} className="sol press reveal" key={s.slug}>
              <small>{String(i + 1).padStart(2, "0")}</small><h3>{s.name}</h3><p>{s.short}</p>
            </Link>
          ))}
        </div>
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
