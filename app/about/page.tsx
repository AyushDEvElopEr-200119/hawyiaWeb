import Link from "next/link";
import { Chev } from "@/components/Brand";
import { CtaBand, JsonLd, PageHero, ProcessTable, Statement } from "@/components/sections";
import { processSteps } from "@/lib/content";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";

const path = "/about/";
const trail = [{ label: "About" }];

export const metadata = pageMeta({
  title: "About Us",
  description: "About Elyra, a travel technology company building white-label and custom travel booking software, integrations and apps.",
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

export default function AboutPage() {
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="About Elyra"
        title="We build the technology<br />behind travel businesses"
        intro="Elyra is a travel technology and software development company. We help agencies, tour operators, OTAs and corporate travel providers launch and scale their own booking platforms."
        ctas={false}
        image="p-about"
        highlights={[["Ready-made platforms", "White-label, configured for you"], ["Custom development", "Built around your business"], ["API integrations", "Suppliers and payments"]]}
      />

      <section className="statement inner">
        <Statement text="We believe every travel business should own its brand, its customers and its data. Technology should make that easier, not lock you in." />
      </section>

      <section className="why container">
        <h2 className="h2 center reveal">What we do</h2>
        <div className="why-grid">
          <article className="why-item reveal"><span className="mono">01</span><h3>Ready-made platforms</h3><p>White-label software for B2C, B2B, corporate and back-office. <Link className="link" href="/solutions/">Solutions <Chev /></Link></p></article>
          <article className="why-item reveal"><span className="mono">02</span><h3>Custom development</h3><p>Websites, engines, portals, apps and CRMs built around you. <Link className="link" href="/custom-development/">Services <Chev /></Link></p></article>
          <article className="why-item reveal"><span className="mono">03</span><h3>API integrations</h3><p>Flights, hotels, ground, experiences and payments. <Link className="link" href="/api-integrations/">Integrations <Chev /></Link></p></article>
        </div>
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

      <ProcessTable steps={processSteps} />
      <CtaBand title="Let's talk" />
      <JsonLd data={breadcrumbSchema(trail, path)} />
    </>
  );
}
