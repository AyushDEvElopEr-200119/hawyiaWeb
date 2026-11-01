// Homepage content. Original Hawyia copy; edit here rather than in app/page.tsx.
import type { Pair } from "./content";

export const productRows: { title: string; photo: string; href: string; desc: string; points: Pair[] }[] = [
  {
    title: "White-label booking platform", photo: "tileWL", href: "/solutions/white-label-travel-booking-software/",
    desc: "Flights, hotels, buses and holidays in one portal under your brand. Choose the modules and suppliers, set your markups, and go live on web and mobile without building from scratch.",
    points: [["Your brand", "Logo, colours and domain"], ["Every product", "Flights, hotels, holidays & more"], ["Your pricing", "Markups and offers you control"]],
  },
  {
    title: "B2B travel agent portal", photo: "tileB2B", href: "/solutions/b2b-travel-portal/",
    desc: "Onboard sub-agents and distributors with their own logins, credit limits, wallets and commission rules. Works for B2B2C and multi-level B2B2B networks.",
    points: [["Agent onboarding", "Logins, documents, approval"], ["Credit & wallets", "Limits, top-ups, statements"], ["Commissions", "By agent, product or route"]],
  },
  {
    title: "Corporate travel software", photo: "tileCorp", href: "/solutions/corporate-travel-software/",
    desc: "A B2E portal where employees book within policy, managers approve requests, and finance sees one view of spend with consolidated billing.",
    points: [["Travel policies", "Class, fare limits, preferred suppliers"], ["One-tap approvals", "By team, grade or trip value"], ["Spend visibility", "Cost centres and one invoice"]],
  },
  {
    title: "Travel management back-office", photo: "tileAdmin", href: "/solutions/travel-management-software/",
    desc: "Bookings, amendments, cancellations, refunds, invoices, markups and reports in one admin, covering everything that happens after the customer clicks “book”.",
    points: [["One ledger", "Online and offline bookings"], ["After-sales", "Changes, refunds, invoices"], ["Reports", "Sales, margins, suppliers"]],
  },
];

export const devServices: [href: string, title: string, sub: string][] = [
  ["/custom-development/custom-travel-website-development/", "Websites", "Brand-first and fast"],
  ["/custom-development/booking-engine-development/", "Booking engines", "Built around your inventory"],
  ["/custom-development/travel-mobile-app-development/", "Mobile apps", "Android & iOS"],
  ["/custom-development/custom-travel-portal-development/", "Portals", "B2B, B2C and hybrid"],
  ["/custom-development/crm-back-office-development/", "CRM & back-office", "Operations and finance"],
  ["/custom-development/custom-software-integrations/", "Integrations", "Connect what you use"],
];

export const marqueeItems = [
  "✈ Airline & LCC APIs", "◎ GDS · Amadeus", "◎ GDS · Sabre", "◎ GDS · Travelport", "◇ NDC content",
  "⌂ Hotel suppliers", "▭ Bus networks", "⛟ Car rental", "⇄ Airport transfers",
  "☀ Tours & activities", "☂ Travel insurance", "⚓ Cruise", "₹ Payment gateways", "⚡ Recharge & bill payments", "⌘ Visa CMS",
];

export const apiCategories: Pair[] = [
  ["Flight APIs", "GDS, low-cost carriers, NDC and consolidator content, with fare rules and ancillaries."],
  ["Hotel APIs", "Wholesalers and aggregators with live rates, room mapping and de-duplication."],
  ["Bus APIs", "Routes, live seat layouts, boarding points and instant ticketing."],
  ["Car & transfer APIs", "Rental fleets and point-to-point airport and city transfers."],
  ["Insurance, activities & bills", "Trip protection, things to do, and mobile recharge or bill payments from the same wallet."],
  ["Payment gateways", "Local and international gateways, wallets and multi-currency checkout."],
];

export const engines: [icon: string, title: string, text: string][] = [
  ["✈", "Flights", "One-way, return and multi-city search, fare calendar, fare rules, seats, meals and baggage."],
  ["⌂", "Hotels", "Room types, rate plans, maps, filters, cancellation policies and instant vouchers."],
  ["▭", "Buses", "Live seat maps, boarding and drop points, operator filters and e-tickets."],
  ["⛟", "Cars & transfers", "Rentals by location and date, plus airport and city transfers."],
  ["☀", "Holidays & tours", "Day-wise itineraries, departure dates, inclusions and enquiry or instant booking."],
  ["◈", "Activities", "Tours, tickets and experiences sold on their own or added to a trip."],
  ["☂", "Travel insurance", "Trip protection offered at checkout, with the policy issued alongside the booking."],
  ["⚓", "Cruise", "Sailings, cabins and fares, where supplier connectivity supports it."],
];

export const businessModels: { tag: string; title: string; text: string; photo: string; g1: string; g2: string }[] = [
  { tag: "B2C", title: "A booking site your travellers will actually use", text: "Your own brand and domain, with self-service booking, accounts and payments.", photo: "carB2C", g1: "#0a2463", g2: "#4f7fe0" },
  { tag: "B2B", title: "An agent network with credit, commissions and control", text: "Agent onboarding, credit limits, wallets and agent-wise markups.", photo: "carB2B", g1: "#14303f", g2: "#6aa9c4" },
  { tag: "B2B2C", title: "Your agents sell to their own customers on your engine", text: "Each agent gets a branded storefront powered by your inventory.", photo: "carB2B2C", g1: "#23352a", g2: "#9cc79a" },
  { tag: "B2B2B", title: "Multi-level distribution, from distributor to sub-agent", text: "Distributors manage their own agents, with margins set at every level.", photo: "carB2B2B", g1: "#2e2a40", g2: "#b6a6e0" },
  { tag: "B2E · Corporate", title: "Policy-based self-booking with approvals built in", text: "Travel policies, approval chains, cost centres and consolidated billing.", photo: "carB2E", g1: "#2b2b3d", g2: "#a2a6d9" },
  { tag: "Tour operator", title: "Packages, itineraries and departures, sold online", text: "Build packages in a CMS and sell them direct or through agents.", photo: "carTour", g1: "#3a2a1f", g2: "#e0b48a" },
  { tag: "OTA", title: "Multi-product search across flights, stays and more", text: "Every engine, every supplier and every payment option on one platform.", photo: "carOTA", g1: "#0d2d3a", g2: "#62c4d6" },
];

export const featureTabs: Record<string, Pair[]> = {
  Flight: [
    ["Fare calendar", "Show date-wise fares so travellers can spot the cheapest day at a glance."],
    ["Smart search & filters", "Results ranked by relevance, with filters for stops, times, airlines and baggage."],
    ["Fare comparison", "Compare fares, inclusions and rules across suppliers side by side."],
    ["Supplier priority", "Prefer certain suppliers, or switch automatically to an equivalent fare with a better price or margin."],
    ["Ancillaries & SSR", "Sell seats, meals, extra baggage and special requests during booking."],
    ["Post-booking automation", "Handle cancellations, reissues, refunds and schedule changes in one workflow."],
  ],
  Hotel: [
    ["Room mapping", "Merge the same hotel from several suppliers into one clean listing."],
    ["Maps & rich content", "Photos, amenities, reviews and location in a clear hotel page."],
    ["Rate plans & policies", "Show meal plans and refundable or non-refundable rates with clear cancellation terms."],
    ["Hold & pay later", "Hold bookings where the supplier allows, with reminders before the deadline."],
    ["Instant vouchers", "Branded confirmations by email and in the customer's account."],
    ["Contracted inventory", "Sell your own directly contracted hotels alongside supplier content."],
  ],
  "Bus & Car": [
    ["Live seat layouts", "Sleeper and seater maps that update in real time."],
    ["Boarding & drop points", "Choose pickup and drop-off points, with times and landmarks."],
    ["Operator filters", "Filter by operator, bus type, departure time and price."],
    ["Car rentals", "Search rentals by location and dates, with vehicle class and inclusions."],
    ["Transfers", "Airport, hotel and city transfers at fixed prices."],
    ["E-tickets & SMS", "Tickets sent instantly by email, SMS or WhatsApp where configured."],
  ],
  Holidays: [
    ["Package builder", "Create day-wise itineraries with hotels, transfers and activities."],
    ["Departures & pricing", "Fixed departures, seasonal prices and per-person pricing by room type."],
    ["Enquiry or instant book", "Take a lead for tailor-made trips, or sell fixed packages straight away."],
    ["Visa CMS", "Publish visa requirements and take applications for the destinations you sell."],
    ["Brochures & vouchers", "Generate PDF itineraries and service vouchers automatically."],
    ["Landing pages", "Destination and theme pages your marketing team can edit."],
  ],
  Admin: [
    ["Markup management", "Set markups by airline, supplier, route, cabin, agent or channel."],
    ["Offers & coupons", "Run promo codes, discounted fares and cashback campaigns."],
    ["Multi-currency & language", "Show local currencies and languages to international travellers."],
    ["Roles & permissions", "Role-based access for staff, agents and supplier partners."],
    ["Page-wise theming", "Brand the landing, search, booking and account pages separately."],
    ["Sales & revenue reports", "Track bookings, revenue, margins, commissions and supplier performance."],
  ],
};

export const extranetItems: Pair[] = [
  ["Flight extranet", "Series fares, private fares and seat blocks"],
  ["Hotel extranet", "Contracts, room allocation and rates"],
  ["Holiday package CMS", "Itineraries, pricing and vouchers"],
  ["Bus extranet", "Routes, schedules and seat inventory"],
  ["Car extranet", "Vehicles, locations and availability"],
  ["Visa CMS", "Requirements, documents and applications"],
  ["Offline bookings", "Record phone and walk-in sales in one ledger"],
];

export const miniCards: [photo: string, title: string, href: string][] = [
  ["miniCode", "Custom software development", "/custom-development/"],
  ["miniApi", "Travel API & supplier integrations", "/api-integrations/"],
  ["miniApp", "Android & iOS booking apps", "/custom-development/travel-mobile-app-development/"],
];

// Line icons for the app bento (24px grid, stroked)
export const appFeatures: { icon: string; title: string; text: string; tone?: "dark" | "mint" }[] = [
  { icon: '<rect x="3" y="4" width="11" height="16" rx="2"/><rect x="15.5" y="8" width="5.5" height="12" rx="1.5"/><path d="M7.5 17h2"/>', title: "Android & iOS", text: "One codebase for both stores, released and updated by us." },
  { icon: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>', title: "Live fares", text: "Real-time prices and availability from your suppliers." },
  { icon: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><path d="M12 15v2"/>', title: "Secure checkout", text: "Cards, wallets and saved travellers through your own gateway.", tone: "dark" },
  { icon: '<path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z"/><path d="M13 7v2.5M13 12v0M13 14.5V17"/>', title: "Trips offline", text: "Tickets and vouchers available without a signal." },
  { icon: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>', title: "Push notifications", text: "Trip updates, reminders and offers at the right moment." },
  { icon: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.6A5 5 0 0 1 21 19.5"/>', title: "Agent apps too", text: "Bookings, wallet and commission tools for your network.", tone: "mint" },
];

export const whyItems: Pair[] = [
  ["Travel-first thinking", "Every workflow is designed around how agencies and operators really sell and service trips."],
  ["One connected platform", "Engines, suppliers, payments, extranet and admin share a single data model."],
  ["Built to scale", "The architecture handles more suppliers, markets and bookings as you add them."],
  ["Security & quality", "Secure coding, role-based access and end-to-end testing before every release."],
  ["Clear delivery", "Milestones, demos and honest timelines, so you always know where your project stands."],
  ["Support after launch", "Maintenance, hosting and updates on a support plan you choose."],
];
