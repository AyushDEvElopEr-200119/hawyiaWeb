import Link from "next/link";
import { Chev } from "@/components/Brand";
import { CtaBand, FaqBlock, JsonLd, PageHero } from "@/components/sections";
import type { Pair } from "@/lib/content";
import { breadcrumbSchema, faqSchema, pageMeta } from "@/lib/seo";

const path = "/pricing/";
const trail = [{ label: "Pricing" }];

export const metadata = pageMeta({
  title: "Pricing",
  description: "Starting-from pricing for Elyra travel software by product: booking websites, custom platforms, supplier APIs, holiday sites, hotel extranet, itinerary builder and CRM.",
  path,
});

// One plan per product. Set real "starting from" prices when confirmed; null shows "On request".
const plans: { name: string; for: string; setup: string | null; yearly: string | null; featured?: boolean; items: string[] }[] = [
  { name: "Launch Website", for: "A ready-made booking site under your brand", setup: null, yearly: null, items: ["Choose B2C, B2B, B2B2B or corporate", "Flights, hotels, buses, cars, transfers", "Holidays, activities and bill payments", "Admin, markups and reports"] },
  { name: "Platform Pro", for: "Your own platform, shaped around your workflows", setup: null, yearly: null, featured: true, items: ["Any mix of B2C, B2B, B2B2B and corporate", "The travel products you choose", "Website plus Android and iOS apps", "Custom modules and integrations"] },
  { name: "Supplier APIs", for: "Connect the supplier accounts you hold", setup: null, yearly: null, items: ["Flight, hotel, bus, car and transfer APIs", "Recharge and bill payment APIs", "Mapping, testing and certification", "Per supplier, priced by scope"] },
  { name: "Holiday Website", for: "Sell packages online, direct or through agents", setup: null, yearly: null, items: ["B2C or B2B package site", "Itineraries, inclusions and pricing", "Enquiry or instant booking", "Web, Android or iOS"] },
  { name: "Hotel Extranet", for: "Load and sell your contracted hotels", setup: null, yearly: null, items: ["Properties, rooms and rate plans", "Allotments and stop-sales", "Hotel partner logins", "Web, Android or iOS"] },
  { name: "Itinerary Builder", for: "Tour CMS for tailor-made and fixed trips", setup: null, yearly: null, items: ["Day-wise itinerary builder", "Seasonal and per-person pricing", "PDF quotes and vouchers", "Web, Android or iOS"] },
  { name: "Travel CRM", for: "Enquiries, quotes and follow-ups in one place", setup: null, yearly: null, items: ["Lead capture and assignment", "Quote versions and reminders", "Sales reports", "Web, Android or iOS"] },
];

const addons: Pair[] = [
  ["Extra business model", "Add B2B, B2B2B or corporate to a live site."],
  ["Extra travel product", "Switch on buses, cars, transfers, holidays or activities."],
  ["Payment gateway", "Connect another gateway or payment method."],
  ["Extra supplier API", "Add more flight, hotel or ground suppliers."],
  ["Mobile apps", "Android & iOS booking apps."],
  ["Hosting & cloud management", "Managed hosting, backups and monitoring."],
  ["Maintenance & support", "Updates, fixes and supplier changes."],
  ["Extranet & CMS", "Sell your own inventory."],
  ["Custom development", "Quoted after scoping."],
];

const faq: Pair[] = [
  ["Are supplier fees included?", "No. Supplier, GDS and payment gateway fees are separate and contracted directly by your business."],
  ["Is custom development included?", "Custom work is quoted separately after scoping, or included in Enterprise as agreed."],
  ["Can I upgrade later?", "Yes. Add products, business models, apps or integrations as your business grows. Each change is quoted before work starts."],
  ["What does the yearly fee cover?", "Maintenance, updates and support for the modules you use. It can rise with your number of users or the data the platform handles, and the proposal says exactly how."],
  ["Are taxes included?", "No. Prices are shown before applicable taxes."],
  ["Are the prices fixed?", "They are starting points for one product with standard features. Your final quote depends on the products, business models, platforms, integrations and support you choose."],
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="Pricing"
        title="Simple, honest<br />starting points"
        intro="Pick the product you need. Each has a one-time setup fee and a yearly fee for updates and support, and every proposal is itemised."
        ctas={false}
        image="p-pricing"
        highlights={[["Setup + yearly fee", "Itemised in every proposal"], ["Seven products", "Start with one, add more later"], ["Supplier fees separate", "Contracted directly by you"]]}
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
        <p className="fineprint">Supplier, GDS and payment gateway fees and contracts are separate and agreed directly with each provider.</p>
      </section>

      <FaqBlock faq={faq} />
      <CtaBand title="Get an itemised quote" />
      <JsonLd data={[breadcrumbSchema(trail, path), faqSchema(faq)]} />
    </>
  );
}
