import { setLang, type LangParams } from "@/lib/i18n";
import { ExtraSection, PosterGrid, StepLine } from "@/components/cinematic";
import { CtaBand, JsonLd, PageHero } from "@/components/sections";
import { products } from "@/lib/site";
import { breadcrumbSchema, metaFor } from "@/lib/seo";

const path = "/business-software/";
const trail = [{ label: "Business Software" }];

export const generateMetadata = metaFor({
  title: "Business Software: CRM, HRMS, ERP & More",
  description: "Ready-made business modules from Hawyia: CRM, HRMS, ERP, project management, helpdesk, inventory & POS and expense management, connected and automated.",
  path,
});

export default async function BusinessSoftwarePage({ params }: LangParams) {
  setLang((await params).lang);
  return (
    <>
      <PageHero
        trail={trail}
        eyebrow="Business software"
        title="Every module your<br />business runs on"
        intro="CRM, HR, finance, projects, support and stock, with automation built in. Start with the module you need most, and connect the rest when you're ready."
        image="p-business-software"
        highlights={[[`${products.length} modules`, "CRM, HRMS, ERP and more"], ["Works together", "Shared customers, people and ledgers"], ["Automated", "Reminders, approvals and reports built in"]]}
      />

      <section className="container posters-sec" id="all">
        <PosterGrid
          title="Pick where to start"
          text="Each module runs on its own, with its own admin, mobile access and reports."
          items={products.map((p) => ({ href: `/business-software/${p.slug}/`, title: p.name, text: p.short, image: `d-${p.slug}` }))}
        />
      </section>

      <ExtraSection
        title="Better together"
        style="duo"
        intro="Connect the modules and the hand-offs between teams happen on their own."
        items={[
          ["CRM → ERP", "Accepted quotes become sales orders and invoices without re-keying."],
          ["HRMS → ERP", "Payroll runs post salary journals to accounting automatically, split by department and cost centre."],
          ["POS → ERP", "Store sales and stock movements flow into accounting and inventory every day."],
          ["Helpdesk → CRM", "Every support ticket appears on the customer's record, so sales and support see the same history."],
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

      <CtaBand title="Let's map your back office" text="Tell us how your teams work today. We'll recommend where to start and send a rollout plan." preset="Ready-made module (CRM, HRMS, ERP…)" />
      <JsonLd data={breadcrumbSchema(trail, path)} />
    </>
  );
}
