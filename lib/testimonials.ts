// Client stories for /testimonials/.
// Every entry below is a SAMPLE that shows the layout. Replace each one with a real, approved
// quote (name, role, company and the client's written permission), then set `sample: false`.
// While any sample remains, the page carries a visible "Sample" label on those stories, is kept
// out of search engines and is left out of the sitemap.

export type Story = {
  id: string;
  cat: "Agencies" | "Tour operators" | "B2B & wholesale" | "Corporate" | "Ground transport";
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
  cat: "Agencies",
  quote: "We went from phone and spreadsheet bookings to our own branded booking site and agent portal, and our team finally works from one screen.",
  name: "Client name",
  role: "Founder",
  company: "Travel agency",
  place: "City, Country",
  photo: "t-partnership",
  built: ["White-label platform", "B2B agent portal", "Flight & hotel APIs", "Payment gateway"],
  sample: true,
};

export const stories: Story[] = [
  {
    id: "agency-desk", cat: "Agencies",
    quote: "Counter sales, phone bookings and online orders now sit in one ledger. Month-end reconciliation went from days to an afternoon.",
    name: "Client name", role: "Managing Director", company: "Travel agency", place: "City, Country",
    photo: "d-travel-agency-software", built: ["Travel agency software", "Offline bookings", "Invoices"], sample: true,
  },
  {
    id: "tour-operator", cat: "Tour operators",
    quote: "The itinerary builder lets us quote a tailor-made trip while the customer is still on the call, with seasonal prices already applied.",
    name: "Client name", role: "Head of Operations", company: "Tour operator", place: "City, Country",
    photo: "d-tour-operator-software", built: ["Itinerary builder", "Package CMS", "Agent distribution"], sample: true,
  },
  {
    id: "consolidator", cat: "B2B & wholesale",
    quote: "Our distributors onboard their own sub-agents now, and every level has its own margin and credit limit. Support calls dropped noticeably.",
    name: "Client name", role: "Director", company: "Flight consolidator", place: "City, Country",
    photo: "d-b2b2b-travel-portal", built: ["B2B2B portal", "Flight extranet", "Wallets & credit"], sample: true,
  },
  {
    id: "corporate", cat: "Corporate",
    quote: "Employees book inside policy, managers approve from their phone, and finance gets one invoice a month instead of a pile of receipts.",
    name: "Client name", role: "Travel Manager", company: "Corporate travel company", place: "City, Country",
    photo: "d-corporate-travel-software", built: ["Corporate travel software", "Approvals", "Consolidated billing"], sample: true,
  },
  {
    id: "bus-operator", cat: "Ground transport",
    quote: "Live seat maps ended our double bookings, and agents in smaller towns now sell our routes straight from the portal.",
    name: "Client name", role: "Owner", company: "Bus operator", place: "City, Country",
    photo: "d-bus-car-booking-software", built: ["Bus booking software", "Bus extranet", "Agent portal"], sample: true,
  },
  {
    id: "hotel-dmc", cat: "B2B & wholesale",
    quote: "Our contracted hotels appear next to bed-bank content in one clean listing, so agents always see our rates first.",
    name: "Client name", role: "Contracting Manager", company: "DMC", place: "City, Country",
    photo: "d-hotel-booking-software", built: ["Hotel extranet", "Hotel API mapping", "B2B portal"], sample: true,
  },
  {
    id: "ota-app", cat: "Agencies",
    quote: "Launching the app on the same platform as the website meant one set of prices, one set of bookings and no second system to maintain.",
    name: "Client name", role: "Co-founder", company: "Online travel startup", place: "City, Country",
    photo: "d-b2c-travel-portal", built: ["B2C portal", "Android & iOS apps", "Promo codes"], sample: true,
  },
];

export const storyCats = ["All", ...new Set(stories.map((s) => s.cat))];
export const hasSamples = [featured, ...stories].some((s) => s.sample);
