// Homepage content. Original Hawyia copy; edit here rather than in app/page.tsx.
import type { Pair } from "./content";

export const expertise: Pair[] = [
  ["Software development", "Web apps, mobile apps and enterprise platforms, shaped around the problem you need solved."],
  ["Business automation", "Approvals, reports and routine workflows that run on their own, so your team doesn't have to chase them."],
  ["Artificial intelligence", "AI built into your applications and processes wherever it saves time or helps people decide faster."],
  ["System integration", "Your applications, APIs and third-party services connected, so information only has to be entered once."],
];

export const productRows: { title: string; photo: string; href: string; desc: string; points: Pair[] }[] = [
  {
    title: "Business management", photo: "s-erp-software", href: "/business-software/",
    desc: "Run people, finance and operations from connected systems instead of scattered spreadsheets. Take one product or all of them.",
    points: [["ERP", "Finance, operations and stock"], ["HR management", "People, records and processes"], ["Procurement", "Purchasing and inventory"]],
  },
  {
    title: "Workflow automation", photo: "p-hire-developers", href: "/automation/",
    desc: "Clear out the routine work first. Start with the approvals, data handling and messages that take up your team's day.",
    points: [["Workflows", "Tasks that move themselves on"], ["Approvals", "Requests sent to the right person"], ["Communication", "Updates that go out on time"]],
  },
  {
    title: "Marketing & promotions", photo: "s-marketing-automation", href: "/solutions/marketing-automation/",
    desc: "Campaigns, social posts, offers and loyalty rewards that go out on time and reach the right people, without managing every step by hand.",
    points: [["Campaigns", "Email, WhatsApp and social"], ["Promotions", "Coupons, offers and loyalty"], ["Lead nurturing", "Follow-ups that send themselves"]],
  },
  {
    title: "Household duties", photo: "s-household-automation", href: "/solutions/household-automation/",
    desc: "The everyday admin of running a home, handled for you: bills, reminders, family schedules and smart-home routines.",
    points: [["Bills & renewals", "Reminders before every due date"], ["Family calendar", "One shared schedule"], ["Smart home", "Routines that run themselves"]],
  },
];

export const devServices: [href: string, title: string, sub: string][] = [
  ["/custom-development/custom-software-development/", "Web applications", "Built around how you work"],
  ["/custom-development/mobile-app-development/", "Mobile apps", "Android & iOS"],
  ["/business-software/", "SaaS & enterprise", "Products and internal platforms"],
  ["/custom-development/workflow-automation-development/", "Workflow automation", "Bots and workflows for routine work"],
  ["/custom-development/ai-integration-development/", "AI integration", "Assistants, documents and search"],
  ["/custom-development/custom-software-integrations/", "Dashboards & APIs", "Your data, connected and visible"],
];

export const automationTabs: Record<string, Pair[]> = {
  Operations: [
    ["Approvals", "Requests go to the right person and move on as soon as they're answered."],
    ["Invoices", "Generate and process invoices without retyping the same details."],
    ["Reports", "The figures you need, prepared and ready when you need them."],
    ["Data entry", "Move information between systems without copying it by hand."],
    ["Team notifications", "Staff hear about what needs their attention, when it needs it."],
    ["Customer follow-ups", "Routine check-ins go out on time, even on a busy week."],
  ],
  "Sales & customers": [
    ["Leads and first replies", "Collect enquiries in one place and answer them straight away."],
    ["Customer onboarding", "Take every new customer through the same steps, with nothing missed."],
    ["Reminders and pipeline", "Prompt the next follow-up and keep your sales pipeline up to date."],
  ],
  Administration: [
    ["Documents", "Keep files organised and easy to find."],
    ["Tasks and scheduling", "Assign work and arrange time without the long email threads."],
    ["Emails and internal reports", "Regular messages and summaries that send themselves."],
  ],
  Marketing: [
    ["Social media", "Plan content in advance and publish it on schedule."],
    ["Campaigns", "Run promotions without managing every step by hand."],
    ["Customer engagement", "Keep in touch with your audience between campaigns."],
  ],
  "Everyday life": [
    ["Household routines", "Let smart home devices handle the things you do every day."],
    ["Reminders", "Bills, appointments and renewals, flagged before they're missed."],
    ["Personal scheduling", "Keep everyday tasks and plans organised in one place."],
  ],
};

export const aiCapabilities: [icon: string, title: string, text: string][] = [
  ["✦", "Customer support", "Assistants that answer customers' questions and help them get support faster."],
  ["▤", "Document processing", "Pull out, organise and process the information held in your documents."],
  ["◎", "Business assistants", "Ask for a report or a piece of company knowledge and get it without digging."],
  ["⌕", "Search & recommendations", "Help people find what's relevant, faster."],
  ["⇄", "AI in your workflows", "Add AI to a business process so fewer steps need a person to step in."],
];

export const marqueeItems = [
  "⇄ APIs", "◇ Third-party software", "◈ Payment gateways", "◎ CRM", "▤ ERP",
  "✉ Communication tools", "☏ WhatsApp", "☁ Cloud applications", "↻ Data sync",
];

export const apiCategories: Pair[] = [
  ["APIs", "New APIs built where you need them, and existing ones connected to your systems."],
  ["Third-party software", "The tools your team already relies on, connected rather than replaced."],
  ["Payment gateways", "Take payments inside your application, with the records kept in step."],
  ["CRM & ERP", "Customer, sales and operational data that agrees across systems."],
  ["Communication", "WhatsApp and other channels connected to your business processes."],
  ["Cloud & data sync", "Cloud-based applications that keep the same information up to date everywhere."],
];

export const industries: { tag: string; title: string; text: string; photo: string; g1: string; g2: string }[] = [
  { tag: "Corporate & enterprise", title: "Bring people, processes and data into one place", text: "ERP, HR management, workflow management and enterprise software.", photo: "d-business-process-automation", g1: "#14303f", g2: "#6aa9c4" },
  { tag: "Retail & e-commerce", title: "Take orders from checkout to fulfilment with less manual work", text: "Online stores, inventory, payment integrations and automated order management.", photo: "miniApi", g1: "#0a2463", g2: "#4f7fe0" },
  { tag: "Real estate", title: "Turn listings and enquiries into organised follow-up", text: "Property management platforms, listing portals and booking automation.", photo: "carB2B2B", g1: "#2e2a40", g2: "#b6a6e0" },
  { tag: "Education", title: "Spend less time on administration and more on learning", text: "Learning platforms, student management and educational administration.", photo: "carB2B2C", g1: "#23352a", g2: "#9cc79a" },
  { tag: "Professional services", title: "Give clients an easier way to work with you", text: "Customer portals, appointments, document management and process automation.", photo: "t-partnership", g1: "#2b2b3d", g2: "#a2a6d9" },
  { tag: "Households & families", title: "Let the home run itself", text: "Bill reminders, family schedules, shopping lists and smart-home routines.", photo: "i-households", g1: "#0d2d3a", g2: "#62c4d6" },
  { tag: "Startups & entrepreneurs", title: "Go from an idea to a working product", text: "Custom applications, SaaS products, digital platforms and technology advice.", photo: "i-startups", g1: "#3a2a1f", g2: "#e0b48a" },
];

export const whyItems: Pair[] = [
  ["The problem comes first", "We start by understanding the challenge, not by pushing a product."],
  ["An eye for repetition", "If your team does the same thing over and over, we'll ask whether they still need to."],
  ["Modern technology", "We work with current software, integrations and AI, and use them where they earn their place."],
  ["Ready-made or custom", "Start on an existing platform or build from scratch, whichever suits the job."],
  ["Built for results", "Productivity, efficiency and growth are how we judge whether a solution is working."],
  ["One partner", "Development, automation, integration and ongoing support, all from one team."],
];

export const homeSteps: Pair[] = [
  ["Understand", "Your ideas, challenges and requirements"],
  ["Discover", "Where software, integration or automation can help"],
  ["Design", "A solution that fits your goals"],
  ["Develop", "Build, configure and integrate"],
  ["Deliver", "Deploy it and help you put it to work"],
  ["Improve", "Keep finding what to refine and automate next"],
];

export const homeFaq: Pair[] = [
  ["What does Hawyia Premium do?", "We automate business and household processes, develop software, add AI to applications and connect systems. We also offer ready-made modules, including CRM, HRMS, ERP, project management, helpdesk and POS."],
  ["Do you build custom software?", "Yes. We build web and mobile applications, enterprise systems and digital platforms to your requirements."],
  ["Can you automate the processes we already have?", "Yes. We review how your operations run today, identify the repetitive work and automate it to simplify your workflows."],
  ["Will we have to replace our existing software?", "Not necessarily. Automation can often be added to the applications you already use, through APIs and other integration methods."],
  ["How can AI help my business?", "Common uses include assistants for customers and staff, document processing, smarter search and automated workflows. We'll help you work out where it's useful for you."],
  ["Do you offer ready-made software?", "Yes. We have ready-to-deploy modules such as CRM, HRMS, ERP, helpdesk, inventory & POS and expense management, and can tailor them to how you work."],
  ["Do you work with startups?", "Yes. We work with businesses and entrepreneurs to turn ideas into working digital products."],
  ["How do we get started?", "Contact us and tell us what you want to build, improve or automate. We'll explore the options with you from there."],
];
