# Elyra — Corporate Worldwide Stay website

Website for Corporate Worldwide Stay (CWS), a corporate travel management company in Mumbai, built on the Elyra design. The copy, images and page addresses come from corporate-stay.com. Built with Next.js (App Router), React and TypeScript, with GSAP and Lenis for motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:5178
npm run build      # production build (every page is pre-rendered as static HTML)
npm start          # serve the production build
```

Photos and videos are committed in `public/assets/media`. To re-download them (or add new ones), list them in `lib/media.ts` and run `npm run media`.

## Where things live

| Path | What it is |
|---|---|
| `lib/site.ts` | Company details (phones, emails, address, social links, accreditation badges) and navigation |
| `lib/data/cws-pages.json` | Copy for the home, service and company pages, as lists of sections |
| `lib/data/cws-posts.json` | The 13 blog articles |
| `lib/data/cws-legal.json` | Privacy Policy and Terms & Conditions |
| `lib/cws.ts`, `lib/blog.ts`, `lib/legal.ts` | Types and helpers over that content |
| `components/cws/Blocks.tsx` | Renders each kind of section (cards, steps, stats, FAQ, testimonials, logos…) in the site's design |
| `app/[page]/` | `/about-us/`, `/services/`, `/hotel/`, `/mice/` and the other top-level pages, generated from `cws-pages.json` |
| `app/team/`, `app/contact/`, `app/blog/`, `app/privacy-policy/`, `app/terms-conditions/` | The remaining pages |
| `public/assets/cws/` | Photos, logos and badges from corporate-stay.com |
| `lib/media.ts` | Hero and background video manifest (Unsplash / Pexels licences) |
| `components/motion/initSite.ts` | All motion and interactions (GSAP, ScrollTrigger, Flip, Lenis). Runs after every route change and cleans up before the next |
| `app/globals.css` | Styles (CWS sections are under "CWS CONTENT") |

## Before launch

- Set `NEXT_PUBLIC_SITE_URL` to the live domain and `SITE_INDEXABLE=true`.
- Connect the enquiry forms: pass an `endpoint` to `<LeadForm>` (CRM or email service). Without one, forms open a pre-filled email.

## Notes for developers

- Pinned scroll sections must sit **inside** a page's top-level `<section>`, never be one. GSAP wraps pinned elements in a spacer, and React needs each top-level section to still be a direct child of `<main>` when it swaps pages. Development builds warn if this rule is broken.
- Markup is rendered by React; `initSite` only animates and wires behaviour, so it never creates or replaces React-owned DOM.

See `docs/website-plan.md` for the business model, sitemap and content plan.
