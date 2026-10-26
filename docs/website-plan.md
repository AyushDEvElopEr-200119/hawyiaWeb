# Company Website — Business Model & Content Plan (no design yet)

## Context
We are building the marketing website for a **B2B Travel Technology & Software Development company** (working name **Elyra — to be confirmed**). It sells **ready-made white-label travel booking software** and **custom travel software development**, plus **travel API / supplier integrations**, to agencies, tour operators, OTAs, DMCs, startups and corporate travel companies worldwide.

Provab, SRDV, Glidova, Corporate-Stay, MakeMyTrip, ixigo and Skyscanner are **references for business model and functionality only**. Nothing from them (names, branding, content, demos, screenshots) appears on our site. The visual identity is original.

The project folder is empty (only package.json + node_modules). This phase covers business model, sitemap and content. Design and code come after you approve it.

**Positioning statement:** "We help travel businesses launch, customize, and scale their own online travel booking platforms through ready-made white-label solutions and custom travel software development."

**Core principles:** we look like a tech provider, not a travel agency. White-label and Custom are clearly separate. We only claim what we can deliver, with no invented clients, logos, stats, certifications or partnerships. Real screenshots and demos. Easy demo and quote requests.

---

## 1. What we take from the references (functionality, not content)
| Reference | Idea we adapt |
|---|---|
| Provab | One page per product, API and service (SEO depth), portfolio, FAQ, blog, "Get a Quote" on every page |
| SRDV | Clear split between ready-made and custom, live-demo request flow, integration directory by category, WhatsApp and callback CTAs, pricing visibility |
| Glidova / MakeMyTrip / ixigo / Skyscanner | Booking features our B2C product shows: multi-product search, filters, fare calendar, OTP login, multi-currency, promo codes |
| Corporate-Stay | Corporate travel features: policy-based self-booking, approvals, spend tracking, consolidated billing, stays and ground transport |

Where we aim to beat them: a premium, uncluttered international B2B brand, fewer but stronger pages, honest claims, and "starting from" pricing.

---

## 2. Business model

### A. Ready-made / white-label software (fast launch)
Client branding (logo, colours, domain), configurable modules and admin. Sold as setup fee + subscription or license.
- White-Label Travel Booking Software (combined OTA platform)
- Flight Booking Software
- Hotel Booking Software
- Holiday & Tour Package Booking Software
- B2C Travel Portal
- B2B Travel Agent Portal (also B2B2C)
- Corporate Travel Software
- Travel Management Software (admin / back-office)

### B. Custom travel software development
Custom travel websites · flight booking engines · hotel reservation systems · holiday/tour platforms · custom travel portals · mobile apps · travel management software · custom dashboards and workflows · third-party integrations · new modules on request.

### C. Travel API & supplier integrations
Shown with the line "subject to supplier access and agreements": Airline APIs · GDS (Amadeus, Sabre, Travelport) · hotel suppliers/aggregators · car rental · bus · airport transfers · tours/activities · cruise (where supported) · payment gateways · other third-party services.
Supplier logos appear only for integrations we have actually built.

### D. Travel business management systems
Admin dashboard · booking management · agent management · customer management / CRM · markups and commissions · credit limits and agent balances · invoices and payment tracking · reports and analytics · cancellations and amendments · supplier management · back-office and accounting integrations.

### E. Mobile apps
Android and iOS booking apps (flight, hotel, holiday), agent apps, and connection to the web booking platforms.

### F. Platform types we explain (one section with 7 cards)
B2C · B2B · B2B2C · White-label · Corporate travel · Tour operator platform · OTA platform.

### G. Revenue streams
White-label license (setup + subscription) · custom project fees · per-supplier integration fees · annual maintenance and support · hosting and cloud management add-on · dedicated developer hire (optional, later).

### H. Target customers (Industries We Serve)
Travel agencies · OTAs · tour operators · DMCs · corporate travel companies / TMCs · travel startups · consolidators / B2B wholesalers.

---

## 3. Sitemap (follows your structure)

**Header:** Logo · Home · Solutions ▾ · Custom Development ▾ · API Integrations ▾ · Industries · Portfolio · Resources ▾ · Company ▾ · Contact · **[Request a Demo]**
(Pricing sits under Solutions, in the footer and on each product page. "About Us" is under Company.)

```
/                                   Home
/solutions                          Overview + Pricing link
  /white-label-travel-booking-software
  /flight-booking-software
  /hotel-booking-software
  /holiday-package-booking-software
  /b2b-travel-portal
  /b2c-travel-portal
  /corporate-travel-software
  /travel-management-software
/pricing                            Starting-from tiers
/custom-development                 Overview
  /custom-travel-website-development
  /booking-engine-development
  /travel-mobile-app-development
  /custom-travel-portal-development
  /crm-back-office-development
  /custom-software-integrations
/api-integrations                   Overview + filterable directory
  /flight-gds-api  /hotel-api  /car-rental-api  /bus-api
  /transfers-activities-api  /payment-gateway-integration
/industries                         (one section per segment; sub-pages later)
/portfolio  → /portfolio/[case-study]
/resources
  /blog  /industry-insights  /guides (API & integration)  /faq  /brochures
/company
  /about  /mission-vision  /team  /process  /careers (if applicable)
/contact                            Contact + quote + consultation booking
/request-demo                       Demo form
/privacy  /terms  /cookies  /disclaimer (software-provider role)
```

---

## 4. Page content

### 4.1 Home (your 17-section order)
1. **Header**: logo, nav, Request a Demo.
2. **Hero**: "Build the Future of Online Travel." Supporting copy is the positioning statement. Alternative headline: "Your Technology Partner for Next-Generation Travel Booking Platforms."
3. **CTAs**: Explore Solutions · Discuss Your Project.
4. **Company intro**: who we are, what we build, who we serve. Short paragraph plus 3 value points.
5. **White-label vs Custom**: two-column comparison (time to launch, cost, flexibility, best for) with a CTA in each column.
6. **Solutions grid**: the 8 products from 2A.
7. **Booking modules**: flight, hotel, holiday, car, bus, transfers, activities, cruise.
8. **API and supplier integrations**: category tiles (logos only where genuine) and the disclaimer about supplier agreements.
9. **Platform types**: B2B, B2C, B2B2C and corporate cards.
10. **Product screenshots / interactive demo**: tabs for traveler site, agent portal and admin dashboard. Screenshots must be real; placeholders until then.
11. **Key capabilities and differentiators**: features from section 5 plus why us.
12. **Development process**: the 10 steps, shown condensed.
13. **Case studies / portfolio**: hidden until real case studies exist.
14. **Security, support and technical expertise**: HTTPS, data protection, role-based access, tech stack, support model.
15. **FAQ**: 6 questions, e.g. white-label vs custom, launch time, supplier contracts, who owns bookings and payments, mobile apps, support.
16. **Final CTA**: demo or enquiry form.
17. **Footer**: contact, page links, social links, legal pages.

### 4.2 Solution (product) page template
Hero (name, promise, screenshot, Demo and Quote CTAs) → who it's for → key modules → features split into traveler, agent and admin views → screenshots → supported integrations → customization options → implementation steps and typical timeline → "starting from" price → related solutions → FAQ → enquiry form.
Footnote on every page: "Feature availability depends on chosen product, supplier contracts, integrations and requirements."

### 4.3 Custom development page template
Business need → what we build → approach → tech stack → deliverables → engagement model (fixed scope or milestone) → process → related case study → FAQ → "Discuss Your Project" form.

### 4.4 API integration pages
For each category: what it enables, the supplier types it covers, the integration process (credentials, certification, testing, go-live), the client's responsibility for supplier contracts, typical timeline, and a CTA. The overview page has a directory that filters by category.

### 4.5 Industries We Serve
For each segment: challenges → recommended solution bundle → features that matter → CTA.

### 4.6 Pricing
Three tiers with "starting from" prices: **Starter** (B2C, one or two modules), **Business** (B2C + B2B, more modules), **Enterprise** (all modules, apps, custom work). Includes what's in each tier, add-ons (extra supplier API, mobile app, hosting, maintenance), "Custom development = quote", and a note that supplier fees and contracts are separate. Comparison table and FAQ.

### 4.7 Portfolio / Case studies
Client (named or anonymised with permission), country, challenge, solution, modules, integrations, results (real only), screenshots and testimonial.

### 4.8 Company
About (story, what we do, where we are) · Mission & Vision · Team & Leadership (real people only) · Development Process (the 10 steps below) · Careers (if applicable).

**Development process (10 steps):** Understand business model → Gather requirements → Recommend white-label or custom → Plan user journeys and architecture → UI/UX design → Build website and backend → Integrate approved suppliers and payments → Test search, pricing, booking, payment and admin → Deploy → Agreed maintenance and support.

### 4.9 Resources
Blog (travel tech) · Industry Insights · API & Integration Guides · FAQ hub · Product Brochures and Company Profile (downloads that require a short form) · Case studies link.

### 4.10 Contact / lead forms
- **Forms:** Request a Demo · Discuss Your Project · Request a Quote · Contact · Schedule a Consultation (calendar booking) · brochure and company-profile download.
- **Fields:** name, business email, company, country, type of travel business, required platform or service, required integrations, estimated timeline, project requirements, phone or WhatsApp.
- **Extras:** WhatsApp button, office address, email, phone, confirmation and error messages, spam protection.

### 4.11 Legal
Privacy policy · terms · cookie consent where legally required · a clear statement that we are a **software provider**, with responsibility for bookings, payments, refunds and end-customer support stated · accurate wording about supplier relationships.

---

## 5. Product features list (reused across pages)
Flight search and booking · hotel search and booking · holiday packages and itineraries · filters and sorting · pricing and availability · booking confirmation and notifications · customer registration and login · booking history · payment gateways · cancellations and amendments · admin and booking management · agent accounts and permissions · markups and commissions · supplier connectivity · multi-currency and multilingual · mobile-first responsive design · reports and analytics · email and SMS notifications · customer support integrations.

## 6. Trust rules
Trust comes from a genuine company profile and team, real testimonials and case studies (with permission), accurate capability statements, genuine certifications and partners, real demos and screenshots, clear contact details, implementation and support details, HTTPS and secure forms.
**Never invent** logos, partnerships, certifications, results or statistics. Any section without real data stays hidden.

## 7. SEO & technical (for the build phase)
- **SEO:** a unique title, meta description and H1 for each page; one target keyword per page; internal links between related services; XML sitemap; robots.txt; structured data (Organization, Service/Product, FAQ, Article, Breadcrumb); optimized images with alt text; good Core Web Vitals; analytics with conversion tracking for enquiries.
- **Tech:** HTTPS, responsive layouts, secure forms with spam protection, backups, a CMS for blog, case studies and resources, privacy-friendly analytics, cross-browser and accessibility testing.
- **Suggested stack, to confirm:** Next.js + Tailwind, a headless CMS or MDX for content, and form submissions sent to email or a CRM.

## 8. Phased rollout
- **Phase 1 (launch):** Home, Solutions overview + 8 solution pages, Custom Development overview, API Integrations overview, Pricing, About, Process, Contact, Request a Demo, legal pages.
- **Phase 2:** 6 custom-development pages, 6 API pages, Industries, Mission/Vision, Team, FAQ, Blog.
- **Phase 3:** Portfolio and case studies (once real ones exist), Insights, Guides, Brochures, Careers, multi-language.

## 9. Inputs needed from you
Final company name, logo and domain · office address, phone, email, WhatsApp · which products and integrations are ready today · real screenshots and demo access · pricing numbers for the tiers · team and leadership details · any certifications and partnerships · case studies and testimonials (with permission) · social links · preferred tech stack and CMS.

## Next step after approval
Design direction: brand identity, colour palette, typography, icon style, homepage wireframe. Then build Phase 1.
