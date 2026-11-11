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
  title: "Business Automation Solutions",
  description: "Business automation solutions: approvals, invoices, marketing, promotions, household duties, sales, finance, HR, customer support, AI assistants, documents and reports.",
  path,
});

const comparison: [string, string, string][] = [
  ["Time to launch", "Days to weeks", "Months, in milestones"],
  ["Cost", "Lower setup + subscription", "Project-based"],
  ["Flexibility", "Configurable workflows", "Anything you can specify"],
  ["Maintenance", "Included in subscription", "Support plan"],
  ["Best for", "Common processes, done fast", "Unique processes and systems"],
];

const groups = [
  { id: "area", title: "Automate by area", text: "Business, home, marketing and promotions: the routine work in each, handled for you." },
  { id: "team", title: "Automate by team", text: "Sales, finance, HR and support, each with its repetitive steps taken off their plate." },
  { id: "ai", title: "AI & data", text: "Assistants, document reading and live reports that turn information into action." },
];

export default async function SolutionsPage({ params }: LangParams) {
  setLang((await params).lang);
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="Automation solutions"
        title="Automate everything,<br />one process at a time"
        intro={`${solutions.length} automation solutions for business, home, marketing and every team. Start with the process that costs you the most time, then add the next.`}
        image="p-solutions"
        highlights={[[`${solutions.length} solutions`, "For every area and team"], ["Works with your tools", "No need to replace what you use"], ["Grow in steps", "Automate one process at a time"]]}
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
        <h2 className="h2 center reveal">Ready-made or custom?</h2>
        <p className="sub reveal">Both are good choices. Here&apos;s how they differ.</p>
        <div className="cmp reveal" role="table">
          <div className="cmp-row head" role="row"><span role="columnheader" /><span role="columnheader">Ready-made</span><span role="columnheader">Custom</span></div>
          {comparison.map(([a, b, c]) => (
            <div className="cmp-row" role="row" key={a}><b role="rowheader">{a}</b><span role="cell">{b}</span><span role="cell">{c}</span></div>
          ))}
        </div>
        <div className="cta-row">
          <Link href="/pricing/" className="btn-pill press">See pricing <Chev /></Link>
          <Link href="/custom-development/" className="link">Custom development <Chev /></Link>
        </div>
      </section>

      <CtaBand preset="Business automation" />
      <JsonLd data={breadcrumbSchema(trail, path)} />
    </>
  );
}
