import Link from "next/link";
import { notFound } from "next/navigation";
import { Chev } from "@/components/Brand";
import { CardGrid, CtaBand, FaqBlock, JsonLd, PageHero, ProcessTable, RelatedCards, TabsBlock, footnote } from "@/components/sections";
import { solutionPages } from "@/lib/content";
import { apis, company, solutions } from "@/lib/site";
import { breadcrumbSchema, faqSchema, pageMeta } from "@/lib/seo";

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

      <section className="who container">
        <div className="split-head">
          <h2 className="h2 reveal">Who it&apos;s for</h2>
          <ul className="chips reveal">{c.who.map((w) => <li key={w}>{w}</li>)}</ul>
        </div>
      </section>

      <section className="engines container">
        <div className="split-head">
          <h2 className="h2 reveal">Key modules</h2>
          <p className="reveal">Every module is configurable from the admin panel. Switch on what you need today, and add more as you grow.</p>
        </div>
        <CardGrid items={c.modules} />
      </section>

      <section className="features container">
        <h2 className="h2 center reveal">Features for every user</h2>
        <p className="sub reveal">What travellers, agents and your own team get out of the box.</p>
        <TabsBlock id="ft" groups={c.features} />
      </section>

      <section className="extranet container">
        <article className="ext-card reveal">
          <div className="ext-copy">
            <span className="tag">Make it yours</span>
            <h2 className="h2">Customization<br />options</h2>
            <p>Start from a proven platform, then shape it around your brand and business model. When you need something truly unique, our custom development team takes over.</p>
            <Link href="/custom-development/" className="link">Custom development <Chev /></Link>
          </div>
          <ul className="ext-list">{c.customize.map((x) => <li key={x}><b>{x}</b></li>)}</ul>
        </article>
      </section>

      <section className="integrations-strip container">
        <div className="split-head">
          <h2 className="h2 reveal">Supported integrations</h2>
          <p className="reveal">Connect the suppliers and payment providers you work with. Integrations are subject to supplier access and agreements.</p>
        </div>
        <div className="chip-links reveal">
          {apis.map((a) => <Link href={`/api-integrations/${a.slug}/`} className="press" key={a.slug}>{a.name} <Chev /></Link>)}
        </div>
      </section>

      <ProcessTable
        title="Implementation"
        id="implementation"
        steps={[
          ["Discovery call", "Your model, markets and must-haves"],
          ["Configuration plan", "Modules, suppliers, pricing rules"],
          ["Branding & setup", "Domain, theme, content"],
          ["Supplier & payment integration", "Your approved accounts"],
          ["Testing & training", "End-to-end checks, team onboarding"],
          ["Go-live & support", "Launch, monitoring, updates"],
        ]}
      />

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
        faqSchema(c.faq),
        { "@context": "https://schema.org", "@type": "Product", name: meta.name, description: c.meta, brand: { "@type": "Brand", name: company.name } },
      ]} />
    </>
  );
}
