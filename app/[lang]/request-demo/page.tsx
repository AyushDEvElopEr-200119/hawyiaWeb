import { setLang, type LangParams } from "@/lib/i18n";
import { Breadcrumbs, JsonLd, LeadForm, SplitTitle } from "@/components/sections";
import { breadcrumbSchema, metaFor } from "@/lib/seo";

const path = "/request-demo/";
const trail = [{ label: "Request a Demo" }];

export const generateMetadata = metaFor({
  title: "Request a Demo",
  description: "Request a live demo of Hawyia travel booking software, configured around your business.",
  path,
});

const steps = [
  ["Share your requirements", "Products, markets, suppliers and timeline."],
  ["We prepare your demo", "Configured around your business model."],
  ["Live walkthrough", "Traveller, agent and admin views, plus your questions."],
  ["Proposal", "An itemised recommendation and timeline."],
];

export default async function RequestDemoPage({ params }: LangParams) {
  setLang((await params).lang);
  return (
    <section className="contact-hero container">
      <Breadcrumbs trail={trail} />
      <div className="contact-grid">
        <div className="contact-copy">
          <h1 className="ph-title" data-split><SplitTitle text="See Hawyia on<br />your use case" /></h1>
          <p>Tell us about your business and we&apos;ll set up a live demo of the modules that matter to you.</p>
          <ul className="steps">
            {steps.map(([t, d], i) => (
              <li key={t}><span className="mono">{String(i + 1).padStart(2, "0")}</span><div><b>{t}</b><p>{d}</p></div></li>
            ))}
          </ul>
        </div>
        <div><LeadForm id="demoForm" submit="Request a Demo" preset="White-label platform" /></div>
      </div>
      <JsonLd data={breadcrumbSchema(trail, path)} />
    </section>
  );
}
