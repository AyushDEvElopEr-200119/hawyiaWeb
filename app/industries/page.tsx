import Link from "next/link";
import { Chev } from "@/components/Brand";
import { Photo } from "@/components/Photo";
import { CtaBand, JsonLd, PageHero } from "@/components/sections";
import { industries } from "@/lib/content";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";

const path = "/industries/";
const trail = [{ label: "Industries" }];

export const metadata = pageMeta({
  title: "Industries We Serve",
  description: "Travel software for agencies, OTAs, tour operators, DMCs, corporate travel, startups and consolidators.",
  path,
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="Industries we serve"
        title="Built for every kind<br />of travel business"
        intro="Different businesses sell travel in different ways. Here's the platform bundle we recommend for each, and why."
        ctas={false}
        image="p-industries"
        highlights={[["7 business types", "From agencies to wholesalers"], ["Matched bundles", "Built around how you sell"], ["One platform", "Add products as you grow"]]}
      />
      <section className="industries container">
        {industries.map((ind, i) => (
          <article className="ind reveal" id={ind.id} key={ind.id}>
            <div className="ind-head">
              <Photo name={`i-${ind.id}`} sizes="(min-width: 861px) 420px, 92vw" className="ind-img" />
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              <h2>{ind.name}</h2>
            </div>
            <div className="ind-body">
              <p className="ind-challenge"><b>The challenge.</b> {ind.challenge}</p>
              <div className="ind-cols">
                <div><p className="eyebrow">Recommended bundle</p><ul className="ticks">{ind.bundle.map((b) => <li key={b}>{b}</li>)}</ul></div>
                <div><p className="eyebrow">Features that matter</p><ul className="ticks">{ind.features.map((b) => <li key={b}>{b}</li>)}</ul></div>
              </div>
              <Link href="/request-demo/" className="link">Get a demo for {ind.name.toLowerCase()} <Chev /></Link>
            </div>
          </article>
        ))}
      </section>
      <CtaBand />
      <JsonLd data={breadcrumbSchema(trail, path)} />
    </>
  );
}
