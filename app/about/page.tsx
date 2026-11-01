import { PosterGrid, StepLine } from "@/components/cinematic";
import { CtaBand, JsonLd, PageHero, Statement } from "@/components/sections";
import { processSteps } from "@/lib/content";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";

const path = "/about/";
const trail = [{ label: "About" }];

export const metadata = pageMeta({
  title: "About Us",
  description: "About Hawyia, a travel technology company building white-label and custom travel booking software, integrations and apps.",
  path,
});

const values = [
  ["Honest advice", "We'll recommend white-label when it's enough, and custom only when it's needed."],
  ["Accurate claims", "We promise what we can deliver, and we put it in writing."],
  ["Clear ownership", "Your brand, your customers, your bookings, your payments."],
  ["Security first", "HTTPS everywhere, role-based access and careful data handling."],
  ["Visible progress", "Milestones, demos and a single point of contact."],
  ["Long-term support", "Maintenance, hosting and updates long after launch."],
];

// Forward-looking only: no company history is claimed here.
const roadmap: [string, string][] = [
  ["Smarter search", "Natural-language and voice search that turns a request like “Goa next weekend under ₹20k” into results."],
  ["Less manual work", "Automated reissues, refunds, reminders and reconciliations, so teams handle exceptions only."],
  ["Clearer numbers", "Dashboards that show margin by supplier, route and agent, not just bookings."],
  ["Practical AI", "Enquiry summaries, reply drafts and support assistants, always with a person in control."],
];

// Confirm this list against the team's real stack before launch.
const stack = ["Next.js", "React", "TypeScript", "Node.js", "Python", "React Native", "PostgreSQL", "AWS", "REST, SOAP & XML APIs"];

export default function AboutPage() {
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="About Hawyia"
        title="We build the technology<br />behind travel businesses"
        intro="Hawyia is a travel technology and software development company. We help agencies, tour operators, OTAs and corporate travel providers launch and scale their own booking platforms."
        ctas={false}
        image="p-about"
        highlights={[["Ready-made platforms", "White-label, configured for you"], ["Custom development", "Built around your business"], ["API integrations", "Suppliers and payments"]]}
      />

      <section className="statement inner">
        <Statement text="We believe every travel business should own its brand, its customers and its data. Technology should make that easier, not lock you in." />
      </section>

      <section className="container posters-sec">
        <PosterGrid title="What we do" items={[
          { href: "/solutions/", title: "Ready-made platforms", text: "White-label software for B2C, B2B, corporate and back-office.", image: "p-solutions" },
          { href: "/custom-development/", title: "Custom development", text: "Websites, engines, portals, apps and CRMs built around you.", image: "p-custom-development" },
          { href: "/api-integrations/", title: "API integrations", text: "Flights, hotels, ground, experiences and payments.", image: "p-api-integrations" },
        ]} />
      </section>

      <section className="mission container" id="mission">
        <div className="mv reveal"><p className="eyebrow">Mission</p><h3>Help travel businesses launch, customize and scale their own booking platforms, quickly and honestly.</h3></div>
        <div className="mv reveal"><p className="eyebrow">Vision</p><h3>A travel industry where independent businesses compete on equal technology with the largest players.</h3></div>
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
