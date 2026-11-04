import { setLang, type LangParams } from "@/lib/i18n";
import { ExtraSection, PosterGrid, StepLine } from "@/components/cinematic";
import { CtaBand, JsonLd, PageHero } from "@/components/sections";
import { products } from "@/lib/site";
import { breadcrumbSchema, metaFor } from "@/lib/seo";

const path = "/business-software/";
const trail = [{ label: "Business Software" }];

export const generateMetadata = metaFor({
  title: "Business Software: HRMS, ERP & Expense Management",
  description: "HRMS, ERP and expense management software from Hawyia. Use each on its own or connect them so people, money and stock share the same records.",
  path,
});

export default async function BusinessSoftwarePage({ params }: LangParams) {
  setLang((await params).lang);
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="Business software"
        title="The back office,<br />finally connected"
        intro="HR, finance and operations software built by the team behind our travel platforms. Start with the product you need most, and connect the rest when you're ready."
        image="p-business-software"
        highlights={[[`${products.length} products`, "HRMS, ERP and expense management"], ["Works together", "Shared employees, cost centres and ledgers"], ["Configured for you", "Your policies, approvals and reports"]]}
      />

      <section className="container posters-sec" id="all">
        <PosterGrid
          title="Pick where to start"
          text="Each product runs on its own, with its own admin, mobile access and reports."
          items={products.map((p) => ({ href: `/business-software/${p.slug}/`, title: p.name, text: p.short, image: `d-${p.slug}` }))}
        />
      </section>

      <ExtraSection
        title="Better together"
        style="duo"
        intro="Connect the products and the hand-offs between teams happen on their own."
        items={[
          ["HRMS → ERP", "Payroll runs post salary journals to accounting automatically, split by department and cost centre."],
          ["Expenses → ERP", "Approved claims and card spend become journal entries and payouts without re-keying."],
          ["HRMS → Expenses", "Employees, grades and reporting lines set who can claim what and who approves it."],
          ["Travel → Expenses", "Trips booked on our corporate travel software appear in expense reports, so nothing is claimed twice."],
        ]}
      />

      <section className="impl container" id="implementation">
        <div className="split-head">
          <h2 className="h2 reveal">Implementation</h2>
          <p className="reveal">A phased rollout, one team at a time, so day-to-day work never stops.</p>
        </div>
        <StepLine steps={[
          ["Discovery", "Your processes, policies and current tools"],
          ["Configuration", "Rules, approvals, roles and templates"],
          ["Data migration", "Masters, balances and open documents"],
          ["Integrations", "Accounting, banks, devices and apps"],
          ["Training", "Admins, managers and employees"],
          ["Go-live & support", "Launch, monitoring and updates"],
        ]} />
      </section>

      <CtaBand title="Let's map your back office" text="Tell us how your teams work today. We'll recommend where to start and send a rollout plan." preset="Business software" />
      <JsonLd data={breadcrumbSchema(trail, path)} />
    </>
  );
}
