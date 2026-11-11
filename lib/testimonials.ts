// Client stories for /testimonials/.
// Every entry below is a SAMPLE that shows the layout. Replace each one with a real, approved
// quote (name, role, company and the client's written permission), then set `sample: false`.
// While any sample remains, the page carries a visible "Sample" label on those stories, is kept
// out of search engines and is left out of the sitemap.

export type Story = {
  id: string;
  cat: "Business teams" | "Retail" | "Services" | "Healthcare" | "Households";
  quote: string;
  name: string;
  role: string;
  company: string;
  place: string;
  photo: string;            // a photo from lib/media.ts that shows the client's kind of business
  built: string[];          // what we delivered, shown as chips
  sample: boolean;
};

export const featured: Story = {
  id: "featured",
  cat: "Business teams",
  quote: "Approvals, invoices and follow-ups used to live in inboxes and spreadsheets. Now they run on their own, and our team finally works from one screen.",
  name: "Client name",
  role: "Founder",
  company: "Trading company",
  place: "City, Country",
  photo: "t-partnership",
  built: ["Business process automation", "CRM", "ERP", "WhatsApp notifications"],
  sample: true,
};

export const stories: Story[] = [
  {
    id: "finance-team", cat: "Business teams",
    quote: "Invoices go out automatically and bank lines match themselves. Month-end went from days to an afternoon.",
    name: "Client name", role: "Finance Manager", company: "Distribution company", place: "City, Country",
    photo: "d-finance-automation", built: ["Finance automation", "ERP", "Accounting integration"], sample: true,
  },
  {
    id: "retail-chain", cat: "Retail",
    quote: "Stock now syncs between our stores and the website, and loyalty offers go out on their own. Fewer stock-outs, more repeat customers.",
    name: "Client name", role: "Operations Head", company: "Retail chain", place: "City, Country",
    photo: "d-inventory-pos-software", built: ["Inventory & POS", "E-commerce integration", "Promotions & loyalty"], sample: true,
  },
  {
    id: "agency", cat: "Services",
    quote: "Every enquiry gets a reply within seconds and a follow-up the next day. We stopped losing leads on busy weeks.",
    name: "Client name", role: "Director", company: "Marketing agency", place: "City, Country",
    photo: "d-sales-automation", built: ["Sales automation", "CRM", "WhatsApp integration"], sample: true,
  },
  {
    id: "hr-team", cat: "Business teams",
    quote: "Onboarding checklists, leave approvals and payroll inputs run themselves now. HR spends its time on people instead of paperwork.",
    name: "Client name", role: "HR Manager", company: "Services company", place: "City, Country",
    photo: "d-hr-automation", built: ["HRMS", "HR automation", "Biometric integration"], sample: true,
  },
  {
    id: "clinic", cat: "Healthcare",
    quote: "Patients book online and get WhatsApp reminders automatically. Missed appointments dropped and the front desk is calmer.",
    name: "Client name", role: "Clinic Manager", company: "Medical clinic", place: "City, Country",
    photo: "i-healthcare", built: ["Appointment automation", "WhatsApp reminders", "Digital forms"], sample: true,
  },
  {
    id: "support-desk", cat: "Services",
    quote: "Our AI assistant answers the common questions instantly, and everything else arrives as a ticket with the full conversation.",
    name: "Client name", role: "Support Lead", company: "Software company", place: "City, Country",
    photo: "d-customer-support-automation", built: ["AI assistant", "Helpdesk", "Support automation"], sample: true,
  },
  {
    id: "family", cat: "Households",
    quote: "Bills, school events and home maintenance are all in one place with reminders. We haven't missed a payment since.",
    name: "Client name", role: "Parent", company: "Family household", place: "City, Country",
    photo: "d-household-automation", built: ["Household automation", "Bill reminders", "Smart-home routines"], sample: true,
  },
];

export const storyCats = ["All", ...new Set(stories.map((s) => s.cat))];
export const hasSamples = [featured, ...stories].some((s) => s.sample);
