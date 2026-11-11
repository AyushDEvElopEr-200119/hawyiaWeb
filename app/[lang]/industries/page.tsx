import { setLang, type LangParams } from "@/lib/i18n";
import Link from "next/link";
import { Chev } from "@/components/Brand";
import { Photo } from "@/components/Photo";
import { CtaBand, JsonLd, PageHero } from "@/components/sections";
import { industries } from "@/lib/content";
import { breadcrumbSchema, metaFor } from "@/lib/seo";

const path = "/industries/";
const trail = [{ label: "Industries" }];

export const generateMetadata = metaFor({
  title: "Industries We Serve",
  description: "Business automation and software for retail, professional services, clinics, real estate, education, manufacturing, hospitality and households.",
  path,
});

export default async function IndustriesPage({ params }: LangParams) {
  setLang((await params).lang);
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="Industries we serve"
        title="Automation for every<br />kind of business"
        intro="Every business repeats different work. Here's the bundle of automation and modules we recommend for each, and why."
        ctas={false}
        image="p-industries"
        highlights={[[`${industries.length} sectors`, "From shops to households"], ["Matched bundles", "Built around how you work"], ["One partner", "Add modules as you grow"]]}
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
