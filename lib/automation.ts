// Copy for the /automation/ page. The areas themselves come from automationTabs in lib/home.ts.
import type { Pair } from "./content";

export const automationHighlights: Pair[] = [
  ["Less repetition", "Routine steps run on their own"],
  ["Fewer delays", "Work moves on as soon as it can"],
  ["More time", "For the work that needs a person"],
];

export const automationFlows: Record<string, string[]> = {
  "Approval request": ["A request is submitted", "It goes to the right approver", "The decision is recorded", "The next step starts"],
  "New invoice": ["A job or order is completed", "The invoice is generated", "It goes to your customer", "Your records are updated"],
  "New enquiry": ["An enquiry comes in", "A reply goes out straight away", "It's added to your pipeline", "Your team is reminded to follow up"],
};

export const automationPrinciples: Pair[] = [
  ["Keep what you have", "Automation can often work with your current applications, through APIs and other integrations."],
  ["Start with one process", "Pick one task that eats up time. Automate it, see the difference, then choose the next."],
  ["Stay in control", "Routine steps run on their own. Decisions that need judgement still go to your people."],
];

export const automationSteps: Pair[] = [
  ["Review", "How your operations run today"],
  ["Identify", "The repetitive work worth removing"],
  ["Automate", "Build it into your workflows"],
  ["Improve", "Refine it and find what's next"],
];

export const automationFaq: Pair[] = [
  ["What should we automate first?", "Start with a task that happens often, follows the same steps each time and takes up your team's day. Approvals, invoices and follow-ups are common places to begin."],
  ["Do we need to replace our existing software?", "Not necessarily. We can often add automation to the applications you already use, through APIs and other integration methods."],
  ["Can automation include AI?", "Yes. AI can be added to a workflow to handle steps like reading documents or answering common questions, so fewer steps need a person to step in."],
  ["What happens when something unusual comes up?", "Exceptions can be sent to a person instead of being forced through. We agree which steps run on their own and which need someone's decision."],
  ["How long does it take?", "That depends on the process and the systems involved. A single workflow is a smaller job than automating across departments, so we'll give you a timeline once we've reviewed what you need."],
  ["Do you support it after launch?", "Yes. We provide ongoing support, and keep looking for what to improve and automate next."],
  ["Is automation only for businesses?", "No. The same thinking applies to marketing and social media, and to everyday life, such as household routines, reminders and scheduling."],
];

export const automationSigns: Pair[] = [
  ["The same data gets typed twice", "Details entered in one system are retyped into the next."],
  ["Approvals stall in inboxes", "Requests wait until someone remembers to chase them."],
  ["Reports take too long", "Figures are gathered by hand every time someone asks."],
  ["Follow-ups rely on memory", "Customers hear back only when someone has time."],
  ["Systems don't talk to each other", "Your team moves information between applications."],
  ["Work stops when someone's away", "Only one person knows the steps, or has the access."],
];

export const automationCompare: [task: string, manual: string, automated: string][] = [
  ["Approvals", "Requests sit in inboxes and need chasing", "Requests reach the right person and move on once answered"],
  ["Invoices", "Details are retyped for every invoice", "Invoices are generated from details you already have"],
  ["Enquiries", "Replies depend on who's free", "A first reply goes out straight away"],
  ["Reports", "Figures are collected by hand each time", "Reports are prepared and ready when needed"],
  ["Follow-ups", "Easy to miss on a busy week", "Reminders go out on time"],
];

export const automationConnects = [
  "CRM and ERP systems",
  "Payment gateways",
  "WhatsApp and other communication channels",
  "Cloud-based applications",
  "Third-party software, through APIs",
];

export const automationAiUses = ["Reading documents", "Answering common questions", "Finding information", "Drafting reports"];

export const automationIndustries: Pair[] = [
  ["Retail & e-commerce", "Order updates, stock levels and payment records that stay in step."],
  ["Real estate", "Enquiries, viewing bookings and follow-ups that don't slip through."],
  ["Restaurants & hospitality", "Order updates, guest messages, shifts and back-office tasks."],
  ["Households", "Bills, reminders, family schedules and smart-home routines."],
  ["Education", "Student records, notifications and everyday administration."],
  ["Professional services", "Appointments, documents and client updates."],
  ["Corporate & enterprise", "HR requests, approvals and reporting across teams."],
];
