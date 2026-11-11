import { setLang, type LangParams } from "@/lib/i18n";
import { PosterGrid, StepLine } from "@/components/cinematic";
import { CtaBand, Engagement, JsonLd, PageHero } from "@/components/sections";
import { processSteps } from "@/lib/content";
import { services } from "@/lib/site";
import { breadcrumbSchema, metaFor } from "@/lib/seo";

const path = "/custom-development/";
const trail = [{ label: "Custom Development" }];

export const generateMetadata = metaFor({
  title: "Custom Software Development",
  description: "Custom software development: web applications, mobile apps, workflow automation, AI integration, CRM, back-office and integrations.",
  path,
});

export default async function CustomDevelopmentPage({ params }: LangParams) {
  setLang((await params).lang);
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="Custom development"
        title="Software and automation,<br />built for you"
        intro="When ready-made won't fit, we design and build web apps, mobile apps, automations, AI tools and back-office systems around your business."
        image="p-custom-development"
        highlights={[["Apps & platforms", "Built around your processes"], ["Automation & AI", "Routine work that runs itself"], ["Milestones", "Delivered in stages you review"]]}
      />
      <section className="container posters-sec">
        <PosterGrid items={services.map((s) => ({ href: `/custom-development/${s.slug}/`, title: s.name, text: s.short, image: `d-${s.slug}` }))} />
      </section>
      <Engagement />
      <section className="impl container" id="process">
        <div className="split-head">
          <h2 className="h2 reveal">How we work</h2>
          <p className="reveal">Ten steps from understanding your business to supporting the live system.</p>
        </div>
        <StepLine steps={processSteps} />
      </section>
      <CtaBand title="Discuss your project" preset="Custom development" />
      <JsonLd data={breadcrumbSchema(trail, path)} />
    </>
  );
}
