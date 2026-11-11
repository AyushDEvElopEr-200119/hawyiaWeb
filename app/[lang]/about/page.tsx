import { setLang, type LangParams } from "@/lib/i18n";
import { PosterGrid, StepLine } from "@/components/cinematic";
import { CtaBand, JsonLd, PageHero, Statement } from "@/components/sections";
import { processSteps } from "@/lib/content";
import { breadcrumbSchema, metaFor } from "@/lib/seo";

const path = "/about/";
const trail = [{ label: "About" }];

export const generateMetadata = metaFor({
  title: "About Us",
  description: "About Hawyia, a business automation and software company: automation, ready-made modules such as CRM, HRMS and ERP, custom development, AI and integrations.",
  path,
});

const values = [
  ["Honest advice", "We'll recommend a ready-made module when it's enough, and custom only when it's needed."],
  ["Accurate claims", "We promise what we can deliver, and we put it in writing."],
  ["Clear ownership", "Your brand, your customers, your data, your payments."],
  ["Security first", "HTTPS everywhere, role-based access and careful data handling."],
  ["Visible progress", "Milestones, demos and a single point of contact."],
  ["Long-term support", "Maintenance, hosting and updates long after launch."],
];

// Forward-looking only: no company history is claimed here.
const roadmap: [string, string][] = [
  ["Ask in plain words", "Natural-language requests like “send me this month's overdue invoices” turned into results."],
  ["Less manual work", "More of the routine steps automated across modules, so teams handle exceptions only."],
  ["Clearer numbers", "Dashboards that show what's working across sales, finance and operations, not just totals."],
  ["Practical AI", "Summaries, reply drafts and assistants built into every module, always with a person in control."],
];

// Confirm this list against the team's real stack before launch.
const stack = ["Next.js", "React", "TypeScript", "Node.js", "Python", "React Native", "Flutter", "PostgreSQL", "AWS", "REST & GraphQL APIs", "Leading AI models"];

export default async function AboutPage({ params }: LangParams) {
  setLang((await params).lang);
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="About Hawyia"
        title="We help you<br />automate everything"
        intro="Hawyia is a business automation and software company. We automate the routine work of businesses and households, provide ready-made modules such as CRM, HRMS and ERP, and build custom software, AI tools and integrations."
        ctas={false}
        image="p-about"
        highlights={[["Automation", "Business, home, marketing and promotions"], ["Ready-made modules", "CRM, HRMS, ERP and more"], ["Custom & AI", "Built around how you work"]]}
      />

      <section className="statement inner">
        <Statement text="We believe people should spend their time on work that needs a person. Everything that repeats should run on its own, with you in control." />
      </section>

      <section className="container posters-sec">
        <PosterGrid title="What we do" items={[
          { href: "/solutions/", title: "Automation solutions", text: "Business, household, marketing, promotions and every team.", image: "p-solutions" },
          { href: "/business-software/", title: "Ready-made modules", text: "CRM, HRMS, ERP, projects, helpdesk, POS and expenses.", image: "p-business-software" },
          { href: "/custom-development/", title: "Custom development", text: "Apps, automations, AI tools and back-office systems built around you.", image: "p-custom-development" },
          { href: "/api-integrations/", title: "Integrations", text: "Payments, messaging, accounting, CRM, e-commerce and AI.", image: "p-api-integrations" },
        ]} />
      </section>

      <section className="mission container" id="mission">
        <div className="mv reveal"><p className="eyebrow">Mission</p><h3>Help businesses and households automate their routine work, quickly, safely and honestly.</h3></div>
        <div className="mv reveal"><p className="eyebrow">Vision</p><h3>A world where every business, whatever its size, runs on the same smart automation as the largest companies.</h3></div>
      </section>

      <section className="why container">
        <h2 className="h2 center reveal">How we work with you</h2>
        <div className="why-grid">
          {values.map(([t, d], i) => (
            <article className="why-item reveal" key={t}><span className="mono">{String(i + 1).padStart(2, "0")}</span><h3>{t}</h3><p>{d}</p></article>
          ))}
        </div>
      </section>

      <section className="why container" id="roadmap">
        <h2 className="h2 center reveal">What we're building next</h2>
        <div className="why-grid">
          {roadmap.map(([t, d], i) => (
            <article className="why-item reveal" key={t}><span className="mono">{String(i + 1).padStart(2, "0")}</span><h3>{t}</h3><p>{d}</p></article>
          ))}
        </div>
      </section>

      <section className="who container" id="technologies">
        <div className="split-head">
          <h2 className="h2 reveal">Technologies we use</h2>
          <ul className="chips reveal">{stack.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </section>

      <section className="impl container" id="process">
        <div className="split-head">
          <h2 className="h2 reveal">How we work</h2>
          <p className="reveal">Ten steps from understanding your business to supporting the live platform.</p>
        </div>
        <StepLine steps={processSteps} />
      </section>
      <CtaBand title="Let's talk" />
      <JsonLd data={breadcrumbSchema(trail, path)} />
    </>
  );
}
