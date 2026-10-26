import Link from "next/link";
import { CtaBand, Engagement, JsonLd, PageHero, ProcessTable } from "@/components/sections";
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
      <section className="container">
        <div className="sol-grid three">
          {services.map((s, i) => (
            <Link href={`/custom-development/${s.slug}/`} className="sol press reveal" key={s.slug}>
              <small>{String(i + 1).padStart(2, "0")}</small><h4>{s.name}</h4><p>{s.short}</p>
            </Link>
          ))}
        </div>
      </section>
      <Engagement />
      <ProcessTable steps={processSteps} />
      <CtaBand title="Discuss your project" preset="Custom development" />
      <JsonLd data={breadcrumbSchema(trail, path)} />
    </>
  );
}
