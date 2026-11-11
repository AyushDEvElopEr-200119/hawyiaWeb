import { asLocale, setLang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { ExtraSection, PhotoSplit, StepLine } from "@/components/cinematic";
import { CtaBand, FaqBlock, JsonLd, PageHero } from "@/components/sections";
import { apiPages, apiProcessSteps } from "@/lib/content";
import { apis } from "@/lib/site";
import { breadcrumbSchema, faqSchema, pageMeta, serviceSchema } from "@/lib/seo";

type Props = { params: Promise<{ slug: string; lang: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return apis.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug, lang } = await params;
  const meta = apis.find((a) => a.slug === slug);
  const c = apiPages[slug];
  if (!meta || !c) return {};
  return pageMeta({ title: meta.name, description: c.meta, path: `/api-integrations/${slug}/` }, asLocale(lang));
}

export default async function ApiPage({ params }: Props) {
  const { slug, lang } = await params;
  setLang(lang);
  const meta = apis.find((a) => a.slug === slug);
  const c = apiPages[slug];
  if (!meta || !c) notFound();
  const path = `/api-integrations/${slug}/`;
  const trail = [{ label: "Integrations", href: "/api-integrations/" }, { label: meta.name }];

  return (
    <>
      <PageHero trail={trail} eyebrow={c.eyebrow} title={c.h1} intro={c.intro} image={`a-${slug}`} highlights={c.covers.slice(0, 3)} />

      <PhotoSplit image={`d-${slug}`} eyebrow="What it enables" title="Everything your customers and team can do" items={c.enables} />

      <ExtraSection title="What it covers" intro="The tools and channels this integration connects, subject to your own accounts and each provider's terms." items={c.covers} style="duo" />

      <section className="impl container" id="integration-process">
        <div className="split-head">
          <h2 className="h2 reveal">Integration process</h2>
          <p className="reveal">From account access to live data flowing, with testing at every step.</p>
        </div>
        <StepLine steps={apiProcessSteps} />
      </section>

      <section className="resp container">
        <div className="resp-card reveal">
          <div>
            <p className="eyebrow light">Good to know</p>
            <h3>Your accounts stay yours.</h3>
          </div>
          <p>You hold the account with each provider and own those terms. We handle the technical work: integration, testing, approvals and monitoring. <b>Typical timeline:</b> {c.timeline}</p>
        </div>
      </section>

      <FaqBlock faq={c.faq} />
      <CtaBand title="Plan your integration" text="Tell us which tools you use, or want to use, and we'll map out the integration." preset="Integration" />
      <JsonLd data={[breadcrumbSchema(trail, path), serviceSchema({ name: meta.name, description: c.meta, path, type: "Software integration" }), faqSchema(c.faq)]} />
    </>
  );
}
