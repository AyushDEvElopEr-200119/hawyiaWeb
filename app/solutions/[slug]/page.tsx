import Link from "next/link";
import { notFound } from "next/navigation";
import { Chev } from "@/components/Brand";
import { ExtraSection, IntegrationReel, ModuleCinema, Personas, StepLine, WhoLine } from "@/components/cinematic";
import { CtaBand, FaqBlock, JsonLd, PageHero, RelatedCards, footnote } from "@/components/sections";
import { solutionPages } from "@/lib/content";
import { apis, solutions } from "@/lib/site";
import { breadcrumbSchema, faqSchema, pageMeta, serviceSchema } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const meta = solutions.find((s) => s.slug === slug);
  const c = solutionPages[slug];
  if (!meta || !c) return {};
  return pageMeta({ title: meta.name, description: c.meta, path: `/solutions/${slug}/` });
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const meta = solutions.find((s) => s.slug === slug);
  const c = solutionPages[slug];
  if (!meta || !c) notFound();
  const path = `/solutions/${slug}/`;
  const trail = [{ label: "Solutions", href: "/solutions/" }, { label: meta.name }];
  const related = c.related.map((r) => solutions.find((s) => s.slug === r)!).filter(Boolean);

  return (
    <>
      <PageHero trail={trail} eyebrow={c.eyebrow} title={c.h1} intro={c.intro} image={`s-${slug}`} highlights={c.modules.slice(0, 3)} />

      <WhoLine who={c.who} />

      <ModuleCinema
        title="Key modules"
        intro="Every module is configurable from the admin panel. Switch on what you need today, and add more as you grow."
        image={`d-${slug}`}
        modules={c.modules}
      />

      <Personas groups={c.features} />

      {c.extras?.map((x) => <ExtraSection key={x.title} {...x} />)}

      <section className="extranet container">
        <article className="ext-card reveal">
          <div className="ext-copy">
            <span className="tag">Make it yours</span>
            <h2 className="h2">Customization<br />options</h2>
            <p>Start from a proven platform, then shape it around your brand and business model. When you need something truly unique, our custom development team takes over.</p>
            <Link href="/custom-development/" className="link">Custom development <Chev /></Link>
          </div>
          <ul className="ext-tiles">{c.customize.map((x, i) => <li key={x}><small>{String(i + 1).padStart(2, "0")}</small><b>{x}</b></li>)}</ul>
        </article>
      </section>

      <IntegrationReel items={apis.map((a) => ({ href: `/api-integrations/${a.slug}/`, label: a.name }))} />

      <section className="impl container" id="implementation">
        <div className="split-head">
          <h2 className="h2 reveal">Implementation</h2>
          <p className="reveal">Six stages from first call to go-live, each with a clear owner and checklist.</p>
        </div>
        <StepLine steps={[
          ["Discovery call", "Your model, markets and must-haves"],
          ["Configuration plan", "Modules, suppliers, pricing rules"],
          ["Branding & setup", "Domain, theme, content"],
          ["Supplier & payment integration", "Your approved accounts"],
          ["Testing & training", "End-to-end checks, team onboarding"],
          ["Go-live & support", "Launch, monitoring, updates"],
        ]} />
      </section>

      <section className="price-callout container">
        <div className="pc-inner reveal">
          <div><p className="eyebrow">Pricing</p><h3>Setup fee plus subscription, priced by the modules and integrations you choose.</h3></div>
          <Link href="/pricing/" className="btn-pill press">See starting-from pricing <Chev /></Link>
        </div>
      </section>

      <RelatedCards items={related} base="/solutions/" />
      <FaqBlock faq={c.faq} />
      <CtaBand title={`Get a demo of ${meta.name}`} preset="White-label platform" />
      {footnote}
      <JsonLd data={[
        breadcrumbSchema(trail, path),
        serviceSchema({ name: meta.name, description: c.meta, path, type: "Travel booking software" }),
        faqSchema(c.faq),
      ]} />
    </>
  );
}
