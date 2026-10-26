import { CtaBand, FaqBlock, JsonLd, PageHero, ProcessTable } from "@/components/sections";
import type { Pair } from "@/lib/content";
import { breadcrumbSchema, faqSchema, pageMeta } from "@/lib/seo";

const path = "/hire-developers/";
const trail = [{ label: "Hire Developers" }];

export const metadata = pageMeta({
  title: "Hire Travel Software Developers",
  description: "Hire dedicated web, mobile and cross-platform developers with travel technology experience.",
  path,
});

const roles = [
  { id: "web", name: "Web Developers", text: "Front-end, back-end and full-stack developers experienced with travel booking flows and supplier APIs.", skills: ["React / Next.js", "Node.js", "Java / .NET", "PostgreSQL", "REST & XML APIs", "Cloud & DevOps"] },
  { id: "mobile", name: "Mobile Developers", text: "Native Android and iOS developers who build fast, polished booking apps.", skills: ["Swift / SwiftUI", "Kotlin / Jetpack", "Push & deep links", "In-app payments", "App Store & Play releases"] },
  { id: "cross-platform", name: "Cross-Platform Developers", text: "One codebase for both stores, which suits most booking and agent apps.", skills: ["Flutter", "React Native", "Shared design systems", "Offline storage", "CI/CD"] },
];

const faq: Pair[] = [
  ["How quickly can developers start?", "We'll confirm availability after understanding your needs. Typically we share profiles soon after the first call."],
  ["Who manages the developers?", "They work in your processes and tools, with Elyra handling HR, replacements and quality."],
  ["Can I scale the team up or down?", "Yes, with notice periods agreed in the contract."],
];

export default function HireDevelopersPage() {
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="Dedicated developers"
        title="Extend your team<br />with travel-tech talent"
        intro="Hire developers who already understand bookings, fares and supplier APIs. They work as part of your team, and we handle the rest."
        image="p-hire-developers"
        highlights={[["Web", "Front-end, back-end, full-stack"], ["Mobile", "Native Android & iOS"], ["Cross-platform", "Flutter & React Native"]]}
      />

      <section className="roles container">
        {roles.map((r, i) => (
          <article className="ind reveal" id={r.id} key={r.id}>
            <div className="ind-head"><span className="mono">{String(i + 1).padStart(2, "0")}</span><h2>{r.name}</h2></div>
            <div className="ind-body"><p>{r.text}</p><ul className="chips">{r.skills.map((s) => <li key={s}>{s}</li>)}</ul></div>
          </article>
        ))}
      </section>

      <section className="engage container">
        <h2 className="h2 center reveal">Ways to hire</h2>
        <div className="why-grid">
          <article className="why-item reveal"><span className="mono">A</span><h4>Full-time</h4><p>A dedicated developer working with you every day, billed monthly.</p></article>
          <article className="why-item reveal"><span className="mono">B</span><h4>Part-time</h4><p>Half-day commitment, for ongoing improvements and maintenance.</p></article>
          <article className="why-item reveal"><span className="mono">C</span><h4>Hourly</h4><p>A block of hours for short tasks and fixes.</p></article>
        </div>
      </section>

      <ProcessTable
        title="How it works"
        id="how"
        steps={[["Share requirements", "Skills, seniority, time zone"], ["Review profiles", "Shortlisted developers"], ["Interview", "Meet and assess"], ["Onboard", "Your tools, your processes"], ["Ongoing management", "Reviews, replacements, reporting"]]}
      />
      <FaqBlock faq={faq} />
      <CtaBand title="Tell us who you need" preset="Hire developers" />
      <JsonLd data={[breadcrumbSchema(trail, path), faqSchema(faq)]} />
    </>
  );
}
