import { notFound } from "next/navigation";
import { ModuleCinema, StepLine } from "@/components/cinematic";
import { CtaBand, Engagement, FaqBlock, JsonLd, PageHero } from "@/components/sections";
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

      <ModuleCinema
        title="What we build"
        intro="Scoped with you, designed in your brand, and built in milestones you can review."
        image={`d-${slug}`}
        modules={c.build}
      />

      <section className="reel stack-reel">
        <div className="split-head container">
          <h2 className="h2 reveal">Technology</h2>
          <p className="reveal">We choose proven, well-supported tools, so your platform is easy to maintain and to hire for.</p>
        </div>
        <div className="marquee reel-marquee" aria-label="Technologies">
          {[0, 1].map((copy) => (
            <div className="marquee-track" aria-hidden={copy === 1 || undefined} key={copy}>
              {c.stack.map((t) => <span key={t}>{t}<i>✦</i></span>)}
            </div>
          ))}
        </div>
      </section>

      <section className="extranet container">
        <article className="ext-card reveal">
          <div className="ext-copy">
            <span className="tag">Deliverables</span>
            <h2 className="h2">What you<br />receive</h2>
            <p>Clear deliverables at every milestone, with documentation and handover included.</p>
          </div>
          <ul className="ext-tiles">{c.deliverables.map((x, i) => <li key={x}><small>{String(i + 1).padStart(2, "0")}</small><b>{x}</b></li>)}</ul>
        </article>
      </section>

      <Engagement />

      <section className="impl container" id="process">
        <div className="split-head">
          <h2 className="h2 reveal">How we work</h2>
          <p className="reveal">Ten steps from understanding your business to supporting the live platform.</p>
        </div>
        <StepLine steps={processSteps} />
      </section>

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
