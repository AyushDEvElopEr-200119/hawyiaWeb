import { notFound } from "next/navigation";
import { CardGrid, CtaBand, Engagement, FaqBlock, JsonLd, PageHero, ProcessTable } from "@/components/sections";
import { processSteps, servicePages } from "@/lib/content";
import { services } from "@/lib/site";
import { breadcrumbSchema, faqSchema, pageMeta, serviceSchema } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const meta = services.find((s) => s.slug === slug);
  const c = servicePages[slug];
  if (!meta || !c) return {};
  return pageMeta({ title: meta.name, description: c.meta, path: `/custom-development/${slug}/` });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const meta = services.find((s) => s.slug === slug);
  const c = servicePages[slug];
  if (!meta || !c) notFound();
  const path = `/custom-development/${slug}/`;
  const trail = [{ label: "Custom Development", href: "/custom-development/" }, { label: meta.name }];

  return (
    <>
      <PageHero trail={trail} eyebrow={c.eyebrow} title={c.h1} intro={c.intro} image={`c-${slug}`} highlights={c.build.slice(0, 3)} />

      <section className="statement inner">
        <p className="eyebrow center reveal">The business need</p>
        <h2 className="statement-text reveal">{c.need}</h2>
      </section>

      <section className="engines container">
        <div className="split-head">
          <h2 className="h2 reveal">What we build</h2>
          <p className="reveal">Scoped with you, designed in your brand, and built in milestones you can review.</p>
        </div>
        <CardGrid items={c.build} />
      </section>

      <section className="stack container">
        <div className="split-head">
          <h2 className="h2 reveal">Technology</h2>
          <p className="reveal">We choose proven, well-supported tools, so your platform is easy to maintain and to hire for.</p>
        </div>
        <ul className="chips big reveal">{c.stack.map((s) => <li key={s}>{s}</li>)}</ul>
      </section>

      <section className="extranet container">
        <article className="ext-card reveal">
          <div className="ext-copy">
            <span className="tag">Deliverables</span>
            <h2 className="h2">What you<br />receive</h2>
            <p>Clear deliverables at every milestone, with documentation and handover included.</p>
          </div>
          <ul className="ext-list">{c.deliverables.map((x) => <li key={x}><b>{x}</b></li>)}</ul>
        </article>
      </section>

      <Engagement />
      <ProcessTable steps={processSteps} />
      <FaqBlock faq={c.faq} />
      <CtaBand title="Discuss your project" text="Share your idea and we'll come back with a recommended approach, a rough timeline and next steps." preset="Custom development" />
      <JsonLd data={[
        breadcrumbSchema(trail, path),
        serviceSchema({ name: meta.name, description: c.meta, path, type: "Travel software development" }),
        faqSchema(c.faq),
      ]} />
    </>
  );
}
