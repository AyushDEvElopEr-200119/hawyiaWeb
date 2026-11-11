import { setLang, type LangParams } from "@/lib/i18n";
import { Photo } from "@/components/Photo";
import { ChoiceCards, StepLine } from "@/components/cinematic";
import { CtaBand, FaqBlock, JsonLd, PageHero } from "@/components/sections";
import type { Pair } from "@/lib/content";
import { breadcrumbSchema, faqSchema, metaFor } from "@/lib/seo";

const path = "/hire-developers/";
const trail = [{ label: "Hire Developers" }];

export const generateMetadata = metaFor({
  title: "Hire Software & Automation Developers",
  description: "Hire dedicated web, mobile, cross-platform and automation developers experienced with business systems, integrations and AI.",
  path,
});

const roles = [
  { id: "web", name: "Web Developers", text: "Front-end, back-end and full-stack developers experienced with business systems, workflows and integrations.", skills: ["React / Next.js", "Node.js", "Python", "PostgreSQL", "REST & GraphQL APIs", "Cloud & DevOps"] },
  { id: "mobile", name: "Mobile Developers", text: "Native Android and iOS developers who build fast, polished apps for customers and teams.", skills: ["Swift / SwiftUI", "Kotlin / Jetpack", "Push & deep links", "In-app payments", "App Store & Play releases"] },
  { id: "cross-platform", name: "Cross-Platform Developers", text: "One codebase for both stores, which suits most business and employee apps.", skills: ["Flutter", "React Native", "Shared design systems", "Offline storage", "CI/CD"] },
];

const faq: Pair[] = [
  ["How quickly can developers start?", "We'll confirm availability after understanding your needs. Typically we share profiles soon after the first call."],
  ["Who manages the developers?", "They work in your processes and tools, with Hawyia handling HR, replacements and quality."],
  ["Can I scale the team up or down?", "Yes, with notice periods agreed in the contract."],
];

export default async function HireDevelopersPage({ params }: LangParams) {
  setLang((await params).lang);
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="Dedicated developers"
        title="Extend your team<br />with automation talent"
        intro="Hire developers who already understand business systems, integrations and automation. They work as part of your team, and we handle the rest."
        image="p-hire-developers"
        highlights={[["Web", "Front-end, back-end, full-stack"], ["Mobile", "Native Android & iOS"], ["Cross-platform", "Flutter & React Native"]]}
      />

      <section className="roles container">
        {roles.map((r, i) => (
          <article className="ind reveal" id={r.id} key={r.id}>
            <div className="ind-head">
              <Photo name={`r-${r.id}`} sizes="(min-width: 861px) 420px, 92vw" className="ind-img" />
              <span className="mono">{String(i + 1).padStart(2, "0")}</span><h2>{r.name}</h2>
            </div>
            <div className="ind-body"><p>{r.text}</p><ul className="chips">{r.skills.map((s) => <li key={s}>{s}</li>)}</ul></div>
          </article>
        ))}
      </section>

      <ChoiceCards title="Ways to hire" items={[
        { tag: "A", title: "Full-time", text: "A dedicated developer working with you every day, billed monthly." },
        { tag: "B", title: "Part-time", text: "Half-day commitment, for ongoing improvements and maintenance." },
        { tag: "C", title: "Hourly", text: "A block of hours for short tasks and fixes." },
      ]} />

      <section className="impl container" id="how">
        <div className="split-head">
          <h2 className="h2 reveal">How it works</h2>
          <p className="reveal">From your first brief to a developer working in your tools, usually within days.</p>
        </div>
        <StepLine steps={[["Share requirements", "Skills, seniority, time zone"], ["Review profiles", "Shortlisted developers"], ["Interview", "Meet and assess"], ["Onboard", "Your tools, your processes"], ["Ongoing management", "Reviews, replacements, reporting"]]} />
      </section>
      <FaqBlock faq={faq} />
      <CtaBand title="Tell us who you need" preset="Hire developers" />
      <JsonLd data={[breadcrumbSchema(trail, path), faqSchema(faq)]} />
    </>
  );
}
