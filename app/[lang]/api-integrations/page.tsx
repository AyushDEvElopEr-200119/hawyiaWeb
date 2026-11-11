import { setLang, type LangParams } from "@/lib/i18n";
import Link from "next/link";
import { PosterGrid, StepLine } from "@/components/cinematic";
import { CtaBand, JsonLd, PageHero } from "@/components/sections";
import { apiProcessSteps } from "@/lib/content";
import { apis } from "@/lib/site";
import { breadcrumbSchema, metaFor } from "@/lib/seo";

const path = "/api-integrations/";
const trail = [{ label: "Integrations" }];

export const generateMetadata = metaFor({
  title: "Integrations",
  description: "Integration directory: payment gateways, WhatsApp, SMS and email, accounting software, CRM and marketing tools, e-commerce, Google Workspace, Microsoft 365 and AI models.",
  path,
});

const directory = [
  ...apis.map((a) => ({ cat: a.cat, name: a.name, desc: a.short, href: `/api-integrations/${a.slug}/` })),
  { cat: "Payments", name: "Stripe & PayPal", desc: "International cards and wallets", href: "/api-integrations/payment-gateway-integration/" },
  { cat: "Payments", name: "Telr, PayTabs & Thawani", desc: "Regional gateways in the Middle East", href: "/api-integrations/payment-gateway-integration/" },
  { cat: "Messaging", name: "WhatsApp Business Platform", desc: "Notifications and two-way chat", href: "/api-integrations/whatsapp-sms-email-integration/" },
  { cat: "Finance", name: "QuickBooks, Xero & Zoho Books", desc: "Invoices, bills and payments synced", href: "/api-integrations/accounting-software-integration/" },
  { cat: "Sales & marketing", name: "Salesforce, HubSpot & Zoho CRM", desc: "Contacts and deals in step", href: "/api-integrations/crm-marketing-integration/" },
  { cat: "Commerce", name: "Shopify & WooCommerce", desc: "Orders, stock and customers", href: "/api-integrations/ecommerce-integration/" },
  { cat: "Productivity", name: "Single sign-on", desc: "Google and Microsoft accounts", href: "/api-integrations/google-microsoft-integration/" },
  { cat: "AI", name: "Large language models", desc: "Assistants grounded in your data", href: "/api-integrations/ai-model-integration/" },
  { cat: "Business", name: "ERP & HR systems", desc: "People, money and stock in sync", href: "/custom-development/custom-software-integrations/" },
  { cat: "Business", name: "Smart-home devices", desc: "Routines for household automation", href: "/solutions/household-automation/" },
];
const categories = ["All", ...new Set(directory.map((d) => d.cat))];

export default async function ApiIntegrationsPage({ params }: LangParams) {
  setLang((await params).lang);
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="Connect your tools"
        title="Integrations that<br />end the double entry"
        intro="Connect payments, messaging, accounting, CRM, e-commerce, productivity tools and AI to your systems, so information is entered once and flows everywhere it's needed."
        image="p-api-integrations"
        highlights={[["Payments & finance", "Gateways and accounting"], ["Messaging", "WhatsApp, SMS and email"], ["Business tools", "CRM, store, Google, Microsoft and AI"]]}
      />

      <section className="container posters-sec">
        <PosterGrid
          title="Browse by category"
          text="Each category has its own page with coverage, process and timelines."
          items={apis.map((a) => ({ href: `/api-integrations/${a.slug}/`, title: a.name, text: a.short, image: `d-${a.slug}`, tag: a.cat }))}
        />
      </section>

      <section className="directory container">
        <h2 className="h2 reveal dir-title">Integration directory</h2>
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
        <p className="fineprint">Brand names are listed to show the kinds of tools we connect, through each provider&apos;s public APIs. Ask us about a specific tool.</p>
      </section>

      <section className="impl container" id="integration-process">
        <div className="split-head">
          <h2 className="h2 reveal">How integration works</h2>
          <p className="reveal">From account access to live data flowing, with testing at every step.</p>
        </div>
        <StepLine steps={apiProcessSteps} />
      </section>
      <CtaBand title="Plan your integration" preset="Integration" />
      <JsonLd data={breadcrumbSchema(trail, path)} />
    </>
  );
}
