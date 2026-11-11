import { setLang, type LangParams } from "@/lib/i18n";
import Link from "next/link";
import { Chev } from "@/components/Brand";
import { CtaBand, FaqBlock, JsonLd, PageHero } from "@/components/sections";
import type { Pair } from "@/lib/content";
import { breadcrumbSchema, faqSchema, metaFor } from "@/lib/seo";

const path = "/pricing/";
const trail = [{ label: "Pricing" }];

export const generateMetadata = metaFor({
  title: "Pricing",
  description: "Starting-from pricing for Hawyia: automation packages, CRM, HRMS, ERP, helpdesk, inventory & POS, AI assistants, integrations and custom platforms.",
  path,
});

// One plan per product. Set real "starting from" prices when confirmed; null shows "On request".
const plans: { name: string; for: string; setup: string | null; yearly: string | null; featured?: boolean; items: string[] }[] = [
  { name: "Automation Starter", for: "Automate your first processes", setup: null, yearly: null, items: ["Up to three automated workflows", "Approvals, invoices or reminders", "Email and WhatsApp notifications", "Connected to the tools you use"] },
  { name: "Business Suite", for: "Ready-made modules, connected and automated", setup: null, yearly: null, featured: true, items: ["Choose CRM, HRMS, ERP and more", "Automation built into every module", "Web plus Android and iOS apps", "Data migration and training"] },
  { name: "CRM & Sales", for: "Leads, deals and follow-ups in one place", setup: null, yearly: null, items: ["Lead capture and assignment", "Quotes and follow-up reminders", "WhatsApp and email on each contact", "Sales reports"] },
  { name: "HRMS & Payroll", for: "People, attendance, leave and payroll", setup: null, yearly: null, items: ["Employee records and self-service", "Attendance, shifts and leave", "Payroll and payslips", "Web, Android or iOS"] },
  { name: "Inventory & POS", for: "Billing counters and stock across branches", setup: null, yearly: null, items: ["POS billing that works offline", "Stock by branch and warehouse", "Purchase orders and reorder alerts", "Online store sync"] },
  { name: "AI Assistant", for: "Answers for customers and staff, around the clock", setup: null, yearly: null, items: ["Trained on your content", "Website and WhatsApp channels", "Arabic and English", "Human handover"] },
  { name: "Household Automation", for: "Bills, schedules and home routines", setup: null, yearly: null, items: ["Bill and renewal reminders", "Shared family calendar", "Smart-home routines", "Mobile app"] },
];

const addons: Pair[] = [
  ["Extra workflow", "Automate another process."],
  ["Extra module", "Add CRM, HRMS, ERP, helpdesk, projects or POS."],
  ["Payment gateway", "Connect another gateway or payment method."],
  ["Extra integration", "Connect another tool or service."],
  ["Mobile apps", "Android & iOS apps for customers or staff."],
  ["Hosting & cloud management", "Managed hosting, backups and monitoring."],
  ["Maintenance & support", "Updates, fixes and improvements."],
  ["AI features", "Assistants, document reading and smart search."],
  ["Custom development", "Quoted after scoping."],
];

const faq: Pair[] = [
  ["Are third-party fees included?", "No. Fees for payment gateways, WhatsApp, SMS, AI providers and other services are separate and paid directly by your business."],
  ["Is custom development included?", "Custom work is quoted separately after scoping, or included as agreed in your proposal."],
  ["Can I upgrade later?", "Yes. Add workflows, modules, apps or integrations as your business grows. Each change is quoted before work starts."],
  ["What does the yearly fee cover?", "Maintenance, updates and support for the modules and automations you use. It can rise with your number of users or the data handled, and the proposal says exactly how."],
  ["Are taxes included?", "No. Prices are shown before applicable taxes."],
  ["Are the prices fixed?", "They are starting points with standard features. Your final quote depends on the modules, workflows, platforms, integrations and support you choose."],
];

export default async function PricingPage({ params }: LangParams) {
  setLang((await params).lang);
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="Pricing"
        title="Simple, honest<br />starting points"
        intro="Pick the product you need. Each has a one-time setup fee and a yearly fee for updates and support, and every proposal is itemised."
        ctas={false}
        image="p-pricing"
        highlights={[["Setup + yearly fee", "Itemised in every proposal"], ["Seven plans", "Start with one, add more later"], ["Third-party fees separate", "Paid directly by you"]]}
      />

      <section className="tiers container">
        {plans.map((t) => (
          <article className={`tier${t.featured ? " featured" : ""} reveal`} key={t.name}>
            {t.featured && <span className="tag">Most flexible</span>}
            <h3>{t.name}</h3>
            <p className="tier-for">{t.for}</p>
            <div className="tier-price">
              <small>Setup from</small><b>{t.setup ?? "On request"}</b>
              <small>Yearly fee {t.yearly ?? "quoted with setup"}</small>
            </div>
            <ul className="ticks">{t.items.map((x) => <li key={x}>{x}</li>)}</ul>
            <Link href="/request-demo/" className="btn-pill press">Get a quote <Chev /></Link>
          </article>
        ))}
      </section>

      <section className="addons container">
        <h2 className="h2 center reveal">Add-ons</h2>
        <div className="api-grid">
          {addons.map(([t, d]) => <article className="api reveal" key={t}><h3>{t}</h3><p>{d}</p></article>)}
        </div>
        <p className="fineprint">Payment gateway, messaging, AI and other third-party fees are separate and agreed directly with each provider.</p>
      </section>

      <FaqBlock faq={faq} />
      <CtaBand title="Get an itemised quote" />
      <JsonLd data={[breadcrumbSchema(trail, path), faqSchema(faq)]} />
    </>
  );
}
