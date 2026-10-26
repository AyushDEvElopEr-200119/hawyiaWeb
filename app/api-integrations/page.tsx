import Link from "next/link";
import { CtaBand, JsonLd, PageHero, ProcessTable } from "@/components/sections";
import { apiProcessSteps } from "@/lib/content";
import { apis } from "@/lib/site";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";

const path = "/api-integrations/";
const trail = [{ label: "API Integrations" }];

export const metadata = pageMeta({
  title: "Travel API Integrations",
  description: "Travel API integration directory: flight and GDS, hotel, car rental, bus, transfers, activities, insurance and payment gateways.",
  path,
});

const directory = [
  ...apis.map((a) => ({ cat: a.cat, name: a.name, desc: a.short, href: `/api-integrations/${a.slug}/` })),
  { cat: "Flights", name: "NDC content", desc: "Airline NDC offers and ancillaries", href: "/api-integrations/flight-gds-api/" },
  { cat: "Flights", name: "Consolidator fares", desc: "Aggregated wholesale fares", href: "/api-integrations/flight-gds-api/" },
  { cat: "Hotels", name: "Channel managers", desc: "Direct hotel connectivity", href: "/api-integrations/hotel-api/" },
  { cat: "Experiences", name: "Travel insurance", desc: "Trip protection at checkout", href: "/api-integrations/transfers-activities-api/" },
  { cat: "Experiences", name: "Cruise", desc: "Sailings and cabins, where supported", href: "/contact/" },
  { cat: "Business", name: "Accounting & ERP", desc: "Invoices and ledgers synced", href: "/custom-development/custom-software-integrations/" },
  { cat: "Business", name: "CRM & marketing", desc: "Customer and booking data", href: "/custom-development/custom-software-integrations/" },
  { cat: "Payments", name: "Wallets & UPI", desc: "Popular digital payment methods", href: "/api-integrations/payment-gateway-integration/" },
];
const categories = ["All", ...new Set(directory.map((d) => d.cat))];

export default function ApiIntegrationsPage() {
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="Supplier connectivity"
        title="Travel API<br />integrations"
        intro="Connect flights, hotels, cars, buses, transfers, activities and payments to your platform. Integrations are subject to supplier access and agreements."
        image="p-api-integrations"
        highlights={[["Flights", "GDS, LCC, NDC and consolidators"], ["Stays & ground", "Hotels, cars, buses and transfers"], ["Payments", "Gateways, wallets and currencies"]]}
      />

      <section className="directory container">
        <div className="filters reveal" role="group" aria-label="Filter by category">
          {categories.map((c, i) => (
            <button className="filter press" aria-pressed={i === 0} data-filter={c} key={c}>{c}</button>
          ))}
        </div>
        <div className="dir-grid" data-directory>
          {directory.map((d) => (
            <Link href={d.href} className="dir-item press" data-cat={d.cat} key={d.name}>
              <small>{d.cat}</small><h3>{d.name}</h3><p>{d.desc}</p>
            </Link>
          ))}
        </div>
        <p className="fineprint">We list supplier brands by name only for integrations we have delivered. Ask us about a specific supplier.</p>
      </section>

      <ProcessTable steps={apiProcessSteps} title="How integration works" id="integration-process" />
      <CtaBand title="Plan your integration" preset="API integration" />
      <JsonLd data={breadcrumbSchema(trail, path)} />
    </>
  );
}
