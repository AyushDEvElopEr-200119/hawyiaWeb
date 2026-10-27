import { PosterGrid, StepLine } from "@/components/cinematic";
import { CtaBand, Engagement, JsonLd, PageHero } from "@/components/sections";
import { processSteps } from "@/lib/content";
import { services } from "@/lib/site";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";

const path = "/custom-development/";
const trail = [{ label: "Custom Development" }];

export const metadata = pageMeta({
  title: "Custom Travel Software Development",
  description: "Custom travel software development: websites, booking engines, mobile apps, portals, CRM, back-office and integrations.",
  path,
});

export default function CustomDevelopmentPage() {
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="Custom development"
        title="Travel software,<br />built for you"
        intro="When ready-made won't fit, we design and build travel websites, booking engines, portals, apps and back-office systems around your business."
        image="p-custom-development"
        highlights={[["Websites & engines", "Built around your inventory"], ["Apps & portals", "For travellers, agents and staff"], ["Milestones", "Delivered in stages you review"]]}
      />
      <section className="container posters-sec">
        <PosterGrid items={services.map((s) => ({ href: `/custom-development/${s.slug}/`, title: s.name, text: s.short, image: `d-${s.slug}` }))} />
      </section>
      <Engagement />
      <section className="impl container" id="process">
        <div className="split-head">
          <h2 className="h2 reveal">How we work</h2>
          <p className="reveal">Ten steps from understanding your business to supporting the live platform.</p>
        </div>
        <StepLine steps={processSteps} />
      </section>
      <CtaBand title="Discuss your project" preset="Custom development" />
      <JsonLd data={breadcrumbSchema(trail, path)} />
    </>
  );
}
