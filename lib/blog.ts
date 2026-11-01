// The Hawyia Journal: articles for /blog/ and /blog/[slug]/.
// Draft copy written from what the site says Hawyia does. Review the wording and the
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
    slug: "white-label-vs-custom-travel-software",
    tag: "Guide",
    title: "White-label vs custom travel software: how to choose",
    excerpt: "Time to launch, cost, flexibility and ownership: what each route really means for your business.",
    date: "2026-10-21",
    photo: "post1",
    body: [
      { p: "Every travel business that sells online reaches the same fork in the road. You can launch on a ready-made platform configured under your brand, or build software around the way you already work. Both routes lead to a working booking website. They differ in how fast you get there, what it costs, and how much room you have to grow." },
      { h2: "What white-label really means" },
      { p: "A white-label platform is software that already exists and already works. Search, booking, payments, the admin panel and the agent tools are built and tested. Your project is configuration: your brand, your domain, the modules you need and the suppliers you have contracts with." },
      { list: [
        "Launch in weeks rather than months, because the core product is finished.",
        "Lower upfront cost, since you share the platform's development with other businesses.",
        "Proven booking flows that have already handled real bookings and edge cases.",
        "Improvements to the platform reach you as it evolves.",
      ] },
      { p: "The trade-off is shape. A white-label platform is built for the way most travel businesses work. If your model is close to that, it is usually the fastest and safest route." },
      { h2: "When custom development pays off" },
      { p: "Custom software starts from your workflows instead of a template. It is the right call when the thing that makes your business different is something no off-the-shelf product does: an unusual pricing model, a niche inventory type, deep integration with systems you already run, or a customer journey that a standard booking engine would flatten." },
      { quote: "If the feature you need is the reason customers choose you, it is worth building. If it is table stakes, configure it." },
      { p: "Custom projects take longer and cost more upfront, and they are planned in milestones you can review as they are built. In return you own a product shaped around your business, with no compromises forced by someone else's roadmap." },
      { h2: "Four questions that decide it" },
      { list: [
        "How soon do you need to be selling? If it is this quarter, start white-label.",
        "Does your business model match a standard B2C, B2B or corporate flow? If yes, white-label will fit.",
        "Is your edge in the software itself? If it is, custom is worth the investment.",
        "What will you need in two years? Some businesses launch white-label and add custom modules later.",
      ] },
      { note: { title: "The honest answer", text: "Many businesses don't need to choose once and for all. Launch on a white-label platform to start earning, then commission custom modules where your business genuinely differs. We recommend whichever route fits, even when that is the smaller project." } },
    ],
  },
  {
    slug: "gds-ndc-airline-apis-explained",
    tag: "Guide",
    title: "GDS, NDC and airline APIs, explained for agency owners",
    excerpt: "What credentials, certification and supplier agreements are involved before your first live booking.",
    date: "2026-10-07",
    photo: "post2",
    body: [
      { p: "Selling flights online means connecting your website to where the fares live. That sounds like one integration. In practice it is a handful of different sources, each with its own contracts, credentials and rules. Here is the landscape in plain terms." },
      { h2: "The three main sources of flight content" },
      { list: [
        "GDS (Global Distribution Systems): the long-standing networks that aggregate fares from many airlines in one connection.",
        "NDC (New Distribution Capability): an airline-led standard that lets carriers sell richer offers, such as bundles, seats and extras, directly through modern APIs.",
        "Direct and low-cost carrier APIs: individual airline connections, common for low-cost carriers that don't distribute through a GDS.",
      ] },
      { p: "Consolidators sit alongside these. They hold their own agreements with airlines and give smaller agencies access to fares and ticketing they could not get alone." },
      { h2: "What you need before going live" },
      { p: "The technical integration is the part we handle. The commercial side belongs to your business, because suppliers contract with the seller, not the software provider." },
      { list: [
        "A supplier agreement with each GDS, airline or consolidator you plan to use.",
        "Test credentials for development, then production credentials once approved.",
        "Certification: many suppliers review your booking flow before switching you to live.",
        "Ticketing authority, directly or through a consolidator, so bookings can become tickets.",
      ] },
      { quote: "The integration is software. The access is a relationship. You need both before your first live booking." },
      { h2: "Choosing a starting mix" },
      { p: "Most agencies don't start with every source at once. A sensible first launch connects the content your customers actually buy, often one GDS or consolidator plus the low-cost carriers on your key routes. Add NDC and further carriers as volume grows and as airlines move more of their best offers there." },
      { note: { title: "Where Hawyia fits", text: "We integrate GDS, LCC, NDC and consolidator content once you have access, take the build through each supplier's certification, and test search, pricing and booking end to end before launch." } },
    ],
  },
  {
    slug: "launching-a-b2b-agent-portal",
    tag: "Guide",
    title: "Launching a B2B agent portal: a practical checklist",
    excerpt: "Credit limits, markups, commissions and onboarding: what to settle before you invite your first agent.",
    date: "2026-09-23",
    photo: "post3",
    body: [
      { p: "A B2B portal lets travel agents search and book your inventory under their own logins, often on credit, with your markups applied. The software is the easy part to picture. The decisions behind it are what make a portal run smoothly from day one." },
      { h2: "Commercial rules to decide first" },
      { list: [
        "Markups: a flat amount or a percentage, set globally, per product, or per agent group.",
        "Commissions: what agents earn, and whether it is shown in the price or settled later.",
        "Credit limits: how much each agent can book before paying, and what happens at the limit.",
        "Deposits and top-ups: whether agents prepay into a wallet instead of, or as well as, credit.",
      ] },
      { p: "Write these down before configuration starts. Each rule becomes a setting in the admin panel, and changing them after agents are live is harder than getting them right first." },
      { h2: "Onboarding agents" },
      { p: "Decide how agents join: by invitation only, or by applying with documents you approve. Agree what they need to provide, who on your team approves them, and how quickly. A clear onboarding flow is the difference between a portal agents trust and one they abandon after a first try." },
      { quote: "Agents judge a portal in their first five searches. Make sure those searches return what they expect, at a price they can sell." },
      { h2: "Operations after launch" },
      { list: [
        "Statements and invoices agents can download without emailing you.",
        "Booking amendments and cancellations, and who handles them.",
        "Sub-agent accounts, if your agents run teams.",
        "Reports on volume, credit used and margin by agent.",
      ] },
      { note: { title: "Before you invite anyone", text: "Run a full test: create an agent, book on credit, amend, cancel and refund, then check the statement. If every step makes sense to someone outside your team, you are ready." } },
    ],
  },
  {
    slug: "why-hotel-mapping-decides-conversion",
    tag: "Insight",
    title: "Why hotel mapping decides your conversion rate",
    excerpt: "Duplicate listings confuse travellers. Here's how mapping fixes the problem, and what good mapping looks like.",
    date: "2026-09-09",
    photo: "post4",
    body: [
      { p: "Connect more than one hotel supplier and the same property starts to appear several times. One supplier calls it by its full name, another abbreviates it, a third has an old address. Without mapping, a traveller sees three near-identical listings at three prices and trusts none of them." },
      { h2: "What mapping does" },
      { p: "Mapping matches each supplier's version of a hotel to a single master record. Search then shows one listing with the best available rate across your suppliers, one set of photos and one accurate description." },
      { list: [
        "One result per hotel, so search pages stay clean and scannable.",
        "The best rate wins, because offers from every supplier compete on one listing.",
        "Consistent content: the same name, location, photos and facilities everywhere.",
      ] },
      { quote: "Travellers don't compare suppliers. They compare hotels. Mapping lets your search work the way they think." },
      { h2: "What good mapping looks like" },
      { p: "Good mapping goes beyond matching names. It also checks coordinates, addresses and chain codes, and it handles the hard cases: properties that renamed, moved, or exist as separate towers under one brand. It needs ongoing upkeep too, because suppliers add and change hotels constantly." },
      { list: [
        "Automated matching for the clear cases, with review for the uncertain ones.",
        "Room-type mapping, so a double room from one supplier is the same as another's.",
        "A way to correct mistakes quickly when a traveller or your team spots one.",
      ] },
      { note: { title: "The conversion link", text: "A cleaner results page is faster to choose from, and a listing that shows the best rate is easier to say yes to. That is why mapping quality shows up directly in how many searches become bookings." } },
    ],
  },
  {
    slug: "payments-for-travel-platforms",
    tag: "Guide",
    title: "Payments for travel platforms: gateways, refunds and reconciliation",
    excerpt: "Choosing gateways, handling refunds and keeping your books clean as volumes grow.",
    date: "2026-08-26",
    photo: "post5",
    body: [
      { p: "Taking payment is the moment a search becomes revenue. In travel it is also where things get complicated: bookings change, suppliers are paid on different terms, and refunds can arrive weeks after the original charge. A little planning keeps money moving cleanly." },
      { h2: "Choosing a gateway" },
      { list: [
        "Market fit: the cards, wallets and local methods your customers actually use.",
        "Currencies: whether you charge in the traveller's currency and how settlement works.",
        "Fees and payout timing, which matter more than they first appear at volume.",
        "Fraud tools, since travel is a common target for stolen-card bookings.",
      ] },
      { p: "Your platform should connect to your own gateway account. Payments land with your business, under your merchant agreement, not with your software provider." },
      { h2: "Refunds and changes" },
      { p: "Cancellations and amendments are routine in travel. Decide how each is handled: full or partial refunds, supplier penalties passed on or absorbed, and refunds to the original card or to a wallet. Your booking engine should calculate these consistently, so your support team isn't working them out by hand." },
      { quote: "The worst refund is the one nobody can explain. Make the rules visible to customers, agents and your own team." },
      { h2: "Reconciliation" },
      { p: "Every booking touches at least two ledgers: what the customer paid you and what you owe the supplier. Reconciliation checks that they match, booking by booking. Done in a spreadsheet, it breaks down quickly as volume grows. Done in the back office, it runs every day." },
      { list: [
        "Match gateway settlements to bookings automatically.",
        "Track supplier payables and due dates.",
        "Flag mismatches, such as a refund issued without a supplier cancellation.",
      ] },
      { note: { title: "Start simple", text: "One reliable gateway, clear refund rules and daily reconciliation will carry most businesses a long way. Add methods and currencies as your markets grow." } },
    ],
  },
  {
    slug: "corporate-travel-policy-people-follow",
    tag: "Insight",
    title: "Building a corporate travel policy that people follow",
    excerpt: "Policies that are clear, fair and enforced by the booking tool, not by email chains.",
    date: "2026-08-12",
    photo: "post6",
    body: [
      { p: "Most travel policies fail quietly. They live in a PDF, employees book whatever is convenient, and finance finds out at the end of the month. The fix is not a longer document. It is a policy that the booking tool applies as people book." },
      { h2: "Keep the rules few and clear" },
      { list: [
        "Cabin class by trip length, not by job title alone.",
        "A hotel nightly cap by city, because one number never fits everywhere.",
        "An advance booking window, with sensible exceptions for urgent travel.",
        "Preferred suppliers where you have negotiated rates.",
      ] },
      { p: "If a rule needs a paragraph to explain, simplify it. People follow rules they can remember." },
      { h2: "Let the tool enforce it" },
      { p: "In a corporate booking platform, policy becomes configuration. Out-of-policy options can be hidden, flagged, or allowed with a reason. Travellers see what is in policy as they search, so the right choice is also the easy one." },
      { quote: "A policy enforced at checkout gets followed. A policy enforced at month-end gets argued about." },
      { h2: "Approvals that don't stall trips" },
      { p: "Route only exceptions for approval, not every trip. Send approvals to the right manager automatically, with the reason and the price difference attached, and let them approve from a phone. Fast approvals stop people booking around the system." },
      { list: [
        "Automatic approval for in-policy bookings.",
        "One-tap approvals with the context managers need.",
        "Spend reports by team, traveller and supplier, ready for finance.",
      ] },
      { note: { title: "Fair beats strict", text: "Policies that feel fair get followed. Review them every few months with the people who travel most, and adjust caps that reality has outgrown." } },
    ],
  },
];

/* ---------------- helpers ---------------- */
export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);

/** "October 21, 2026", fixed to UTC so server and browser always agree. */
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

const words = (b: Block) =>
  "p" in b ? b.p : "h2" in b ? b.h2 : "quote" in b ? b.quote : "list" in b ? b.list.join(" ") : `${b.note.title} ${b.note.text}`;

/** Minutes to read at about 220 words a minute, never less than 2. */
export const readMinutes = (post: Post) =>
  Math.max(2, Math.round(post.body.map(words).join(" ").split(/\s+/).length / 220));

/** Heading text as a URL fragment, for the contents list. */
export const anchor = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** The card-sized view of a post, safe to pass to client components. */
export type PostCardData = Pick<Post, "slug" | "tag" | "title" | "excerpt" | "photo"> & { date: string; minutes: number };
export const toCard = (p: Post): PostCardData => ({
  slug: p.slug, tag: p.tag, title: p.title, excerpt: p.excerpt, photo: p.photo, date: formatDate(p.date), minutes: readMinutes(p),
});
