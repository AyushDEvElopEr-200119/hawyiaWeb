import { getLang, localePath, t } from "./i18n";
// The Hawyia Journal: articles for /blog/ and /blog/[slug]/.
// Draft copy about business and household automation. Review the wording and the
// publish dates before launch; add a post by adding an entry here (newest first).

export type Block =
  | { p: string }
  | { h2: string }
  | { list: string[] }
  | { quote: string }
  | { note: { title: string; text: string } };

export type Post = {
  slug: string;
  tag: "Guide" | "Insight";
  title: string;
  excerpt: string;
  date: string;          // ISO date, YYYY-MM-DD
  photo: string;         // a key in lib/media.ts
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "what-to-automate-first",
    tag: "Guide",
    title: "What to automate first: a practical guide for growing businesses",
    excerpt: "How to pick the first process to automate, so you see results in weeks rather than months.",
    date: "2026-10-21",
    photo: "post1",
    body: [
      { p: "Almost every business has more work that could be automated than it has time to automate. The trick is choosing where to start. The right first project pays for itself quickly and builds confidence for the next one. The wrong one drags on and convinces people that automation is harder than it is." },
      { h2: "Look for work that repeats" },
      { p: "The best candidates are tasks that happen often, follow the same steps each time and take up a real share of someone's day. If a person could write the steps down on one page, a system can probably run them." },
      { list: [
        "Approvals that wait in inboxes until someone chases them.",
        "Invoices typed from details that already exist in another system.",
        "Reminders and follow-ups that depend on someone remembering.",
        "Reports assembled by hand from the same sources every week.",
      ] },
      { h2: "Score each candidate" },
      { p: "For each process, ask three questions: how often does it happen, how long does it take each time, and how much does it cost when it goes wrong? Multiply the first two to estimate the hours you'd win back, and use the third to break ties." },
      { quote: "Start with the boring process everyone complains about. That's usually where the hours are hiding." },
      { h2: "Keep the first project small" },
      { p: "Automate one process end to end, with clear rules for the exceptions. Measure the time it saves for a month. That evidence makes the case for the next project far better than any plan." },
      { note: { title: "Our approach", text: "We review how your operations run today, pick the process with the best return, automate it, and then help you choose what's next." } },
    ],
  },
  {
    slug: "ready-made-vs-custom-software",
    tag: "Guide",
    title: "Ready-made modules or custom software: how to choose",
    excerpt: "Time to launch, cost, flexibility and ownership: what each route really means for your business.",
    date: "2026-10-14",
    photo: "post2",
    body: [
      { p: "When a business decides to replace spreadsheets with proper software, it reaches a fork in the road. You can start on ready-made modules configured for you, or build software around the way you already work. Both lead to a working system. They differ in speed, cost and how much room you have to grow." },
      { h2: "What ready-made really means" },
      { p: "A ready-made module such as a CRM, HRMS or ERP already exists and already works. Your project is configuration: your fields, your approval rules, your branding and the integrations you need." },
      { list: [
        "Launch in days or weeks, because the core product is finished.",
        "Lower upfront cost, since development is shared with other businesses.",
        "Proven workflows that have already handled real edge cases.",
        "Improvements reach you as the product evolves.",
      ] },
      { h2: "When custom development pays off" },
      { p: "Custom software is the right call when the thing that makes your business different is something no off-the-shelf product does: an unusual process, deep integration with systems you already run, or a customer experience a standard tool would flatten." },
      { quote: "If the feature is the reason customers choose you, build it. If it's table stakes, configure it." },
      { note: { title: "The honest answer", text: "Many businesses don't need to choose once and for all. Start on ready-made modules, then add custom pieces where your business genuinely differs." } },
    ],
  },
  {
    slug: "crm-hrms-erp-which-first",
    tag: "Guide",
    title: "CRM, HRMS or ERP: which system should you set up first?",
    excerpt: "A simple way to decide which module will make the biggest difference to your business right now.",
    date: "2026-10-07",
    photo: "post3",
    body: [
      { p: "CRM, HRMS and ERP each solve a different problem. Setting up all three at once is rarely the best idea. The right first module is the one closest to your biggest daily pain." },
      { h2: "Start with CRM if sales slip through the cracks" },
      { p: "If leads go unanswered, follow-ups depend on memory or nobody knows what's in the pipeline, a CRM pays off fastest. It puts every customer and conversation in one place and reminds people what to do next." },
      { h2: "Start with HRMS if people admin eats your week" },
      { p: "If attendance, leave and payroll live in spreadsheets and messages, an HRMS gives HR and managers back hours every month, and gives employees answers without waiting." },
      { h2: "Start with ERP if the numbers never agree" },
      { p: "If stock, purchases and accounts are tracked separately and month-end is a scramble, an ERP connects them so everyone works from the same figures." },
      { list: [
        "Biggest pain is losing customers or deals: CRM.",
        "Biggest pain is people admin and payroll: HRMS.",
        "Biggest pain is stock, purchasing and accounts: ERP.",
      ] },
      { note: { title: "They work better together", text: "Whichever you start with, choose modules that connect, so the next one shares the same customers, people and ledgers." } },
    ],
  },
  {
    slug: "whatsapp-automation-for-business",
    tag: "Insight",
    title: "WhatsApp automation: what businesses can do, and what to avoid",
    excerpt: "Confirmations, reminders and two-way conversations on the channel your customers actually read.",
    date: "2026-09-30",
    photo: "post4",
    body: [
      { p: "For many customers, WhatsApp is the app they check first. Automating the messages you already send there, such as confirmations, reminders and status updates, can cut missed appointments and late payments noticeably." },
      { h2: "Good uses" },
      { list: [
        "Order, booking and appointment confirmations.",
        "Payment and renewal reminders before the due date.",
        "Delivery and service status updates.",
        "A first reply to every new enquiry, any time of day.",
      ] },
      { h2: "What to avoid" },
      { p: "Automation should respect customers. Send only what people have agreed to receive, use approved message templates, and make it easy to reply to a person or to stop messages." },
      { quote: "Useful messages build trust. Unwanted ones get you blocked." },
      { note: { title: "Getting set up", text: "Automated WhatsApp messages need an approved WhatsApp Business Platform account and templates. We help you set both up and connect them to your systems." } },
    ],
  },
  {
    slug: "automating-household-duties",
    tag: "Guide",
    title: "Automating household duties: bills, schedules and smart-home routines",
    excerpt: "The everyday admin of running a home can run itself too. Here's where to begin.",
    date: "2026-09-23",
    photo: "post5",
    body: [
      { p: "Automation isn't only for businesses. Running a home involves the same kind of repeating work: bills, renewals, appointments, shopping and maintenance. Most of it can be tracked and reminded automatically." },
      { h2: "Start with money and deadlines" },
      { p: "Missed bills and renewals cost real money. Put every recurring payment in one place with reminders a few days before each due date, or pay automatically where you're comfortable." },
      { h2: "Share the family calendar" },
      { p: "One shared schedule for appointments, school events and chores, with reminders on each person's phone, removes a lot of last-minute scrambling." },
      { h2: "Let the home follow your routine" },
      { list: [
        "Lights and climate that adjust to the time of day.",
        "Appliances that run on schedules.",
        "Alerts when a door is left open or a device needs attention.",
        "Service reminders for cars, appliances and repairs.",
      ] },
      { note: { title: "Privacy first", text: "Household automation should be private by default, with each family member seeing only what's shared with them." } },
    ],
  },
  {
    slug: "ai-assistants-without-the-risk",
    tag: "Insight",
    title: "AI assistants for business, without the risk",
    excerpt: "How to get useful answers from AI while keeping accuracy, privacy and control.",
    date: "2026-09-16",
    photo: "post6",
    body: [
      { p: "AI assistants can answer customer questions around the clock, help staff find information in seconds and draft routine documents. The concern most businesses have is control: what if it says something wrong?" },
      { h2: "Ground it in your own content" },
      { p: "An assistant should answer from your approved documents, policies and product data, not from general knowledge. When it can't find an answer there, it should say so and hand over to a person." },
      { h2: "Limit what it can do" },
      { list: [
        "Decide which topics it may answer and which it must hand over.",
        "Allow actions, such as booking or checking status, one at a time.",
        "Keep a person in the loop for anything sensitive.",
        "Review conversations regularly and improve the content.",
      ] },
      { quote: "The goal isn't an assistant that knows everything. It's one that knows your business and knows its limits." },
      { note: { title: "Start small", text: "Begin with the twenty questions you answer most often. Measure the results, then expand." } },
    ],
  },
];

/* ---------------- helpers ---------------- */
export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);

/** "October 21, 2026", fixed to UTC so server and browser always agree. */
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString(getLang() === "ar" ? "ar-OM-u-nu-latn" : "en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

const words = (b: Block) =>
  "p" in b ? b.p : "h2" in b ? b.h2 : "quote" in b ? b.quote : "list" in b ? b.list.join(" ") : `${b.note.title} ${b.note.text}`;

/** Minutes to read at about 220 words a minute, never less than 2. */
export const readMinutes = (post: Post) =>
  Math.max(2, Math.round(post.body.map(words).join(" ").split(/\s+/).length / 220));

/** Heading text as a URL fragment, for the contents list. */
export const anchor = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** The card-sized view of a post, safe to pass to client components. */
export type PostCardData = Pick<Post, "slug" | "tag" | "title" | "excerpt" | "photo"> & {
  href: string; tagLabel: string; date: string; minutes: string; read: string;
};
export const toCard = (p: Post): PostCardData => {
  const lang = getLang();
  return {
    slug: p.slug, tag: p.tag, tagLabel: t(p.tag), title: t(p.title), excerpt: t(p.excerpt), photo: p.photo,
    href: localePath(lang, `/blog/${p.slug}/`), date: formatDate(p.date),
    minutes: lang === "ar" ? `${readMinutes(p)} ${t("min read")}` : `${readMinutes(p)} min read`, read: t("Read"),
  };
};
