import { asLocale, setLang } from "@/lib/i18n";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Chev } from "@/components/Brand";
import { ExtraSection, ModuleCinema, Personas, StepLine, WhoLine } from "@/components/cinematic";
import { CtaBand, FaqBlock, JsonLd, PageHero, RelatedCards, Lines } from "@/components/sections";
import { productPages } from "@/lib/content";
import { products } from "@/lib/site";
import { breadcrumbSchema, faqSchema, pageMeta, serviceSchema } from "@/lib/seo";

type Props = { params: Promise<{ slug: string; lang: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug, lang } = await params;
  const meta = products.find((p) => p.slug === slug);
  const c = productPages[slug];
  if (!meta || !c) return {};
  return pageMeta({ title: meta.name, description: c.meta, path: `/business-software/${slug}/` }, asLocale(lang));
}

export default async function ProductPage({ params }: Props) {
  const { slug, lang } = await params;
  setLang(lang);
  const meta = products.find((p) => p.slug === slug);
  const c = productPages[slug];
  if (!meta || !c) notFound();
  const path = `/business-software/${slug}/`;
  const trail = [{ label: "Business Software", href: "/business-software/" }, { label: meta.name }];
  const related = c.related.map((r) => products.find((p) => p.slug === r)!).filter(Boolean);

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

      <Personas groups={c.features} sub="What each person in your organisation gets out of the box." />

      {c.extras?.map((x) => <ExtraSection key={x.title} {...x} />)}

      <section className="extranet container">
        <article className="ext-card reveal">
          <div className="ext-copy">
            <span className="tag">Make it yours</span>
            <h2 className="h2"><Lines text="Customization<br />options" /></h2>
            <p>Start from a proven product, then shape it around your policies and processes. When you need something truly unique, our custom development team takes over.</p>
            <Link href="/custom-development/" className="link">Custom development <Chev /></Link>
          </div>
          <ul className="ext-tiles">{c.customize.map((x, i) => <li key={x}><small>{String(i + 1).padStart(2, "0")}</small><b>{x}</b></li>)}</ul>
        </article>
      </section>

      <section className="impl container" id="implementation">
        <div className="split-head">
          <h2 className="h2 reveal">Implementation</h2>
          <p className="reveal">Six stages from first call to go-live, each with a clear owner and checklist.</p>
        </div>
        <StepLine steps={[
          ["Discovery call", "Your teams, policies and current tools"],
          ["Configuration plan", "Modules, rules, approvals and roles"],
          ["Data migration", "Records and balances from your current system"],
          ["Integrations", "Accounting, banks, devices and apps"],
          ["Testing & training", "End-to-end checks, team onboarding"],
          ["Go-live & support", "Launch, monitoring, updates"],
        ]} />
      </section>

      <section className="price-callout container">
        <div className="pc-inner reveal">
          <div><p className="eyebrow">Pricing</p><h3>Setup fee plus subscription, priced by the modules and number of users you choose.</h3></div>
          <Link href="/request-demo/" className="btn-pill press">Get a quote <Chev /></Link>
        </div>
      </section>

      <RelatedCards items={related} base="/business-software/" />
      <FaqBlock faq={c.faq} />
      <CtaBand title={`Get a demo of ${meta.name}`} preset="Ready-made module (CRM, HRMS, ERP…)" />
      <JsonLd data={[
        breadcrumbSchema(trail, path),
        serviceSchema({ name: meta.name, description: c.meta, path, type: "Business software" }),
        faqSchema(c.faq),
      ]} />
    </>
  );
}
