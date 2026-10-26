import Link from "next/link";
import { Chev } from "@/components/Brand";
import { CtaBand, FaqBlock, JsonLd, PageHero } from "@/components/sections";
import type { Pair } from "@/lib/content";
import { breadcrumbSchema, faqSchema, pageMeta } from "@/lib/seo";

const path = "/pricing/";
const trail = [{ label: "Pricing" }];

export const metadata = pageMeta({
  title: "Pricing",
  description: "Starting-from pricing for Elyra travel booking software: Starter, Business and Enterprise tiers, plus add-ons.",
  path,
});

// Set real "starting from" prices here when confirmed; null shows "On request".
const tiers: { name: string; price: string | null; for: string; featured?: boolean; items: string[] }[] = [
  { name: "Starter", price: null, for: "Launching a B2C site with one or two products", items: ["B2C portal", "1–2 booking modules", "1 supplier integration", "1 payment gateway", "Admin & reports", "Email support"] },
  { name: "Business", price: null, for: "Selling direct and through agents", featured: true, items: ["Everything in Starter", "B2B agent portal", "Up to 4 booking modules", "Multiple suppliers", "Markups, credit & wallets", "Priority support"] },
  { name: "Enterprise", price: null, for: "All products, apps and custom work", items: ["Everything in Business", "All booking modules", "Android & iOS apps", "Extranet & CMS", "Custom modules", "Dedicated account manager"] },
];

const addons: Pair[] = [
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
  ["Can I upgrade later?", "Yes. Move between tiers or add modules as your business grows."],
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="Pricing"
        title="Simple, honest<br />starting points"
        intro="A one-time setup fee plus a subscription, based on the modules and integrations you choose. Every proposal is itemised."
        ctas={false}
        image="p-pricing"
        highlights={[["Setup + subscription", "Itemised in every proposal"], ["Three tiers", "Starter, Business, Enterprise"], ["Supplier fees separate", "Contracted directly by you"]]}
      />

      <section className="tiers container">
        {tiers.map((t) => (
          <article className={`tier${t.featured ? " featured" : ""} reveal`} key={t.name}>
            {t.featured && <span className="tag">Most popular</span>}
            <h3>{t.name}</h3>
            <p className="tier-for">{t.for}</p>
            <p className="tier-price"><small>Starting from</small><b>{t.price ?? "On request"}</b></p>
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
