// Company details and navigation used by every page.
// Replace the placeholder contact details once they are confirmed.

/**
 * The site's public address, used for canonical links, the sitemap and social previews.
 * Set NEXT_PUBLIC_SITE_URL once a custom domain is live (e.g. https://www.elyra.com).
 * Until then, Vercel's production address is used automatically.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:5178");

/** Search engines may index the site only when SITE_INDEXABLE=true (turn on with the real domain). */
export const indexable = process.env.SITE_INDEXABLE === "true";

export const company = {
  name: "Hawyia",
  legal: "HAWYIA",
  url: siteUrl.replace(/\/$/, ""),
  email: "info@hawyiapremium.com",
  phone: "+968 9705 7071",
  whatsapp: "",       // e.g. "910000000000" (digits only, used for wa.me)
  address: "",        // office address
  tagline: "We help you automate your business",
};

/** Automation solutions, grouped by what they automate. */
export const solutions = [
  { slug: "business-process-automation", name: "Business Process Automation", short: "Approvals, invoices, reports and routine tasks", group: "area" },
  { slug: "household-automation", name: "Household Automation", short: "Bills, reminders, schedules and smart homes", group: "area" },
  { slug: "marketing-automation", name: "Marketing Automation", short: "Campaigns, social posts and lead nurturing", group: "area" },
  { slug: "promotions-automation", name: "Promotions & Loyalty Automation", short: "Offers, coupons, points and referrals", group: "area" },
  { slug: "sales-automation", name: "Sales Automation", short: "Leads, follow-ups, quotes and pipeline", group: "team" },
  { slug: "finance-automation", name: "Finance & Accounting Automation", short: "Invoicing, collections and reconciliation", group: "team" },
  { slug: "hr-automation", name: "HR Automation", short: "Onboarding, attendance, leave and payroll steps", group: "team" },
  { slug: "customer-support-automation", name: "Customer Support Automation", short: "Tickets, routing, replies and SLAs", group: "team" },
  { slug: "ai-assistants-chatbots", name: "AI Assistants & Chatbots", short: "Answers for customers and staff, around the clock", group: "ai" },
  { slug: "document-automation", name: "Document & Data Entry Automation", short: "Read, extract and file documents automatically", group: "ai" },
  { slug: "reporting-dashboards", name: "Reports & Dashboards Automation", short: "Live figures, scheduled reports and alerts", group: "ai" },
];

/** Ready-made business software modules. */
export const products = [
  { slug: "crm-software", name: "CRM Software", short: "Leads, customers, deals and follow-ups" },
  { slug: "hrms-software", name: "HRMS Software", short: "People, attendance, leave and payroll" },
  { slug: "erp-software", name: "ERP Software", short: "Finance, inventory, purchase and sales in one system" },
  { slug: "project-management-software", name: "Project Management Software", short: "Tasks, timelines, timesheets and budgets" },
  { slug: "helpdesk-software", name: "Helpdesk & Ticketing Software", short: "Support tickets, SLAs and a knowledge base" },
  { slug: "inventory-pos-software", name: "Inventory & POS Software", short: "Stock, billing counters and branches" },
  { slug: "expense-management-software", name: "Expense Management Software", short: "Claims, approvals, cards and reimbursements" },
];

/** Custom development services. */
export const services = [
  { slug: "custom-software-development", name: "Custom Software Development", short: "Web apps and platforms built around your work" },
  { slug: "mobile-app-development", name: "Mobile App Development", short: "Android & iOS apps for customers and teams" },
  { slug: "workflow-automation-development", name: "Workflow Automation Development", short: "Bots and workflows that run your routine work" },
  { slug: "ai-integration-development", name: "AI Integration Development", short: "AI added to your apps and processes" },
  { slug: "crm-back-office-development", name: "CRM & Back-Office Development", short: "Operations, finance and customer tools" },
  { slug: "custom-software-integrations", name: "Custom Software Integrations", short: "Connect the systems you already use" },
];

/** Integrations with the tools businesses already use (served under /api-integrations/). */
export const apis = [
  { slug: "payment-gateway-integration", name: "Payment Gateway Integration", short: "Cards, wallets, bank transfers and refunds", cat: "Payments" },
  { slug: "whatsapp-sms-email-integration", name: "WhatsApp, SMS & Email Integration", short: "Messages and notifications from your systems", cat: "Messaging" },
  { slug: "accounting-software-integration", name: "Accounting Software Integration", short: "Invoices and ledgers synced to your books", cat: "Finance" },
  { slug: "crm-marketing-integration", name: "CRM & Marketing Tool Integration", short: "Contacts, deals and campaigns kept in step", cat: "Sales & marketing" },
  { slug: "ecommerce-integration", name: "E-commerce Integration", short: "Orders, stock and customers from your store", cat: "Commerce" },
  { slug: "google-microsoft-integration", name: "Google Workspace & Microsoft 365 Integration", short: "Mail, calendars, files and sign-in", cat: "Productivity" },
  { slug: "ai-model-integration", name: "AI Model Integration", short: "Large language models connected to your data", cat: "AI" },
];

export type NavLink = { href: string; label: string; desc?: string };
export type MegaMenu = {
  columns: { title: string; links: NavLink[] }[];
  aside?: { title: string; text: string; links: NavLink[] };
};
export type NavItem = { label: string; href: string; mega?: undefined } | { label: string; mega: MegaMenu; href?: undefined };

const solutionLinks = (group: string): NavLink[] =>
  solutions.filter((s) => s.group === group).map((s) => ({ href: `/solutions/${s.slug}/`, label: s.name, desc: s.short }));

// Primary navigation. `mega` entries open a panel on desktop and an accordion on mobile.
export const nav: NavItem[] = [
  {
    label: "Solutions",
    mega: {
      columns: [
        { title: "Automate by area", links: solutionLinks("area") },
        { title: "Automate by team", links: solutionLinks("team") },
        { title: "AI & data", links: [
          ...solutionLinks("ai"),
          { href: "/solutions/", label: "All solutions", desc: "Every automation solution side by side" },
          { href: "/pricing/", label: "Pricing", desc: "Starting-from plans by product" },
        ] },
      ],
    },
  },
  {
    label: "Services",
    mega: {
      columns: [
        { title: "Custom development", links: services.map((s) => ({ href: `/custom-development/${s.slug}/`, label: s.name, desc: s.short })) },
        { title: "Hire developers", links: [
          { href: "/hire-developers/#web", label: "Web Developers", desc: "Front-end, back-end and full-stack" },
          { href: "/hire-developers/#mobile", label: "Mobile Developers", desc: "Native Android & iOS" },
          { href: "/hire-developers/#cross-platform", label: "Cross-Platform Developers", desc: "One codebase, both stores" },
        ] },
      ],
      aside: {
        title: "Have something unique in mind?",
        text: "We'll scope it, recommend ready-made or custom, and plan it in milestones.",
        links: [{ href: "/custom-development/", label: "Custom development" }, { href: "/contact/", label: "Discuss your project" }],
      },
    },
  },
  { label: "Automation", href: "/automation/" },
  {
    label: "Integrations",
    mega: {
      columns: [
        { title: "Connect your tools", links: apis.map((a) => ({ href: `/api-integrations/${a.slug}/`, label: a.name, desc: a.short })) },
      ],
      aside: {
        title: "Integration directory",
        text: "Browse every tool and service we connect, by category.",
        links: [{ href: "/api-integrations/", label: "View directory" }],
      },
    },
  },
  {
    label: "Business Software",
    mega: {
      columns: [
        { title: "Ready-made modules", links: products.map((p) => ({ href: `/business-software/${p.slug}/`, label: p.name, desc: p.short })) },
      ],
      aside: {
        title: "One login for the whole business",
        text: "Use each module on its own, or connect them so customers, people, money and stock share the same records.",
        links: [{ href: "/business-software/", label: "All business software" }, { href: "/request-demo/", label: "Request a demo" }],
      },
    },
  },
  { label: "Industries", href: "/industries/" },
  {
    label: "Company",
    mega: {
      columns: [
        { title: "Company", links: [
          { href: "/about/", label: "About Hawyia", desc: "Who we are and what we build" },
          { href: "/about/#mission", label: "Mission & Vision", desc: "Why we do it" },
          { href: "/about/#process", label: "How We Work", desc: "Our 10-step delivery process" },
          { href: "/about/#technologies", label: "Technologies", desc: "The stack behind our platforms" },
          { href: "/testimonials/", label: "Client Stories", desc: "Businesses in their own words" },
          { href: "/contact/", label: "Contact", desc: "Talk to a specialist" },
        ] },
        { title: "Resources", links: [
          { href: "/blog/", label: "Blog", desc: "The Hawyia Journal: guides and insights" },
          { href: "/resources/", label: "Resources", desc: "Automation, explained plainly" },
          { href: "/resources/#faq", label: "FAQ", desc: "Answers before you ask" },
          { href: "/pricing/", label: "Pricing", desc: "Starting-from tiers" },
        ] },
      ],
    },
  },
  { label: "Contact", href: "/contact/" },
];
