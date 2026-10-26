import { notFound } from "next/navigation";
import { CtaBand, FaqBlock, JsonLd, PageHero, ProcessTable } from "@/components/sections";
import { apiPages, apiProcessSteps } from "@/lib/content";
import { apis } from "@/lib/site";
import { breadcrumbSchema, faqSchema, pageMeta, serviceSchema } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return apis.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const meta = apis.find((a) => a.slug === slug);
  const c = apiPages[slug];
  if (!meta || !c) return {};
  return pageMeta({ title: meta.name, description: c.meta, path: `/api-integrations/${slug}/` });
}

export default async function ApiPage({ params }: Props) {
  const { slug } = await params;
  const meta = apis.find((a) => a.slug === slug);
  const c = apiPages[slug];
  if (!meta || !c) notFound();
  const path = `/api-integrations/${slug}/`;
  const trail = [{ label: "API Integrations", href: "/api-integrations/" }, { label: meta.name }];

  return (
    <>
      <PageHero trail={trail} eyebrow={c.eyebrow} title={c.h1} intro={c.intro} image={`a-${slug}`} highlights={c.covers.slice(0, 3)} />

      <section className="apps container api-enables">
        <div className="split-head">
          <h2 className="h2 reveal">What it enables</h2>
          <ul className="ticks reveal">{c.enables.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
        <div className="api-grid two reveal">
          {c.covers.map(([t, d]) => <article className="api" key={t}><h3>{t}</h3><p>{d}</p></article>)}
        </div>
      </section>

      <ProcessTable steps={apiProcessSteps} title="Integration process" id="integration-process" />

      <section className="resp container">
        <div className="resp-card reveal">
          <div>
            <p className="eyebrow light">Good to know</p>
            <h3>Supplier contracts are between you and the supplier.</h3>
          </div>
          <p>You sign up with each supplier and own those commercial terms. We handle the technical work: integration, certification, testing and monitoring. <b>Typical timeline:</b> {c.timeline}</p>
        </div>
      </section>

      <FaqBlock faq={c.faq} />
      <CtaBand title="Plan your integration" text="Tell us which suppliers you work with, or want to work with, and we'll map out the integration." preset="API integration" />
      <JsonLd data={[breadcrumbSchema(trail, path), serviceSchema({ name: meta.name, description: c.meta, path, type: "Travel API integration" }), faqSchema(c.faq)]} />
    </>
  );
}
