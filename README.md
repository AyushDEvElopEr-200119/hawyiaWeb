# Hawyia — company website

Marketing site for Hawyia, a software, automation and AI company with ready-made business and travel platforms, in English and Arabic. Built with Next.js (App Router), React and TypeScript, with GSAP and Lenis for motion.

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
| `lib/site.ts` | Company details (email, phone, domain) and navigation |
| `lib/content.ts` | Copy for solution, service and API pages, industries, FAQ |
| `lib/home.ts` | Homepage copy |
| `lib/media.ts` | Photo and video manifest (Unsplash / Pexels licences) |
| `lib/legal.ts` | Starter legal text (have it reviewed before launch) |
| `app/` | Routes. `solutions/[slug]`, `custom-development/[slug]` and `api-integrations/[slug]` are generated from `lib/content.ts` |
| `components/` | Header, footer, page sections, photos |
| `components/motion/initSite.ts` | All motion and interactions (GSAP, ScrollTrigger, Flip, Lenis). Runs after every route change and cleans up before the next |
| `app/globals.css` | Styles |

## Before launch

- Fill in real contact details and the domain in `lib/site.ts`.
- Add "starting from" prices in `app/pricing/page.tsx`.
- Set up demo booking (see "Demo booking" below).
- Connect the other enquiry forms: pass an `endpoint` to `<LeadForm>` (CRM or email service). Without one, forms open a pre-filled email.
- Have the legal pages reviewed.

## Demo booking

On `/request-demo/`, customers pick a free time. The site then creates a Google Calendar event with a Meet link and emails the details to the customer and the team. Until the keys below are set, or if times can't be loaded, the form opens a pre-filled email draft instead.

Booking rules (Sunday to Thursday, 9:00 to 17:00 Oman time, 30-minute slots, 4 hours' notice, 30 days ahead) are in `lib/demo/slots.ts`. Anything on the calendar blocks the slots it overlaps. Cancelling a meeting frees its slot.

**1. Google Workspace** (needs a Workspace admin)

1. In [Google Cloud](https://console.cloud.google.com), create a project and enable the **Google Calendar API**.
2. Create a **service account** and download a JSON key. Its `client_email` and `private_key` are `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY`.
3. In the [Workspace admin console](https://admin.google.com), go to Security > Access and data control > API controls > **Domain-wide delegation**. Add the service account's client ID with these scopes:
   `https://www.googleapis.com/auth/calendar.events,https://www.googleapis.com/auth/calendar.freebusy`
4. Set `GOOGLE_CALENDAR_USER` to the real Workspace user whose calendar holds the demos. A group address won't work.

**2. Resend**

1. In the Vercel project that hosts the site, add **Resend** from the Marketplace and connect it to the project. This sets `RESEND_API_KEY`.
2. In Resend, verify the sending domain by adding the DNS records it lists.
3. Set `DEMO_EMAIL_FROM` to an address on that domain, such as `Hawyia <demos@hawyiapremium.com>`.

**3. Team**

Set `DEMO_TEAM_EMAILS` to a comma-separated list of the people to invite, or leave it empty to use the company email in `lib/site.ts`. The address has to be able to receive mail.

Add the variables to the Vercel project (see `.env.example`) and redeploy. For local work, put them in `.env.local`.

## Notes for developers

- Pinned scroll sections must sit **inside** a page's top-level `<section>`, never be one. GSAP wraps pinned elements in a spacer, and React needs each top-level section to still be a direct child of `<main>` when it swaps pages. Development builds warn if this rule is broken.
- Markup is rendered by React; `initSite` only animates and wires behaviour, so it never creates or replaces React-owned DOM.

See `docs/website-plan.md` for the business model, sitemap and content plan.

## Languages

English lives at bare URLs (`/about/`) and Arabic under `/ar/` (`/ar/about/`). Pages are written in English under `app/[lang]/`; `next.config.ts` rewrites bare URLs to `/en/...`, and `/en/...` redirects back to the bare URL.

- `lib/i18n/ar.json` maps each English string to its Arabic translation. A string with no entry shows in English.
- A custom JSX runtime (`lib/i18n/jsx`) swaps text and internal links on Arabic pages, so components stay in English. Client components don't get translations from it, so pass them translated text as props.
- `npm run i18n:missing` builds the site and lists every string the Arabic pages render without a translation. Brand and technology names are expected there.
- The stylesheet uses logical properties (`margin-inline-start`, not `margin-left`) so the layout mirrors by itself. Keep new rules logical; what doesn't mirror on its own is at the end of `app/globals.css`.

## Email (Microsoft 365) and the admin dashboard

All site email (contact forms, demo confirmations, tests) goes through one service,
`sendEmail()` in `lib/server/email`, which sends from `SMTP_USER` via `smtp.office365.com:587` (STARTTLS)
signing in as an Entra ID app with OAuth 2.0 (XOAUTH2). Every attempt is written to **Email Logs**;
failures are retried by Vercel Cron (`vercel.json`) and from the dashboard. There is no fallback provider.

```ts
import { sendEmail } from "@/lib/server/email";
await sendEmail({ to: "customer@example.com", template: "order_confirmation", variables: { name: "Customer", orderId: "ORD-1001" } });
```

**Admin dashboard:** `/admin/` → Settings › Communication Settings › Email Configuration, Email Templates and Email Logs.
Admins sign in with Microsoft 365; only addresses in `ADMIN_EMAILS` get in. Without `MONGODB_URI` the dashboard
shows the environment settings read-only (Test Connection and Send Test Email still work) and uses the built-in templates.

### One-time setup

1. **MongoDB Atlas:** create a free cluster, allow network access from anywhere (0.0.0.0/0, needed for Vercel),
   create a database user, and put the connection string in `MONGODB_URI`.
2. **Entra ID → App registrations → the app → Authentication:** add the *Web* redirect URIs
   `http://localhost:5178/api/admin/auth/callback/` and `https://<your-domain>/api/admin/auth/callback/`.
3. **API permissions:** *Office 365 Exchange Online → Application → SMTP.SendAsApp*, then grant admin consent
   (sign-in uses the default *openid / profile / email* delegated permissions).
4. **Exchange Online** (an Exchange admin, once). The Object ID here is the *Enterprise application* Object ID:

   ```powershell
   Install-Module ExchangeOnlineManagement -Scope CurrentUser
   Connect-ExchangeOnline
   New-ServicePrincipal -AppId <client-id> -ObjectId <enterprise-app-object-id>
   Add-MailboxPermission -Identity "Info@hawyiapremium.com" -User <enterprise-app-object-id> -AccessRights FullAccess
   Set-CASMailbox -Identity "Info@hawyiapremium.com" -SmtpClientAuthenticationDisabled $false
   Set-TransportConfig -SmtpClientAuthenticationDisabled $false
   ```

   Until this is done Microsoft answers `535 5.7.3 Authentication unsuccessful` and **Test Connection** shows
   *Authentication Failed* with these commands.
5. **Vercel → Settings → Environment Variables:** add every key from `.env.local` (`SMTP_*`, `MS_*`, `MONGODB_URI`,
   `EMAIL_SECRET_KEY`, `ADMIN_SESSION_SECRET`, `ADMIN_EMAILS`, `CRON_SECRET`), then redeploy.
   Do **not** copy the Gmail test-mode keys.

### Gmail test mode (before the Exchange step is done)

To see real emails arrive while waiting for step 4, set in `.env.local` and restart `npm run dev`:

```env
EMAIL_TEST_MODE=gmail
GMAIL_USER=you@gmail.com
GMAIL_APP_PASSWORD=abcdabcdabcdabcd   # Google Account → Security → 2-Step Verification → App passwords
GMAIL_TEST_TO=you@gmail.com           # optional: team notifications come here instead of info@
```

Every email (contact form, confirmation, demo, dashboard tests) is then sent from that Gmail account, and the
dashboard shows a **Test mode** banner. Test mode is only on when `EMAIL_TEST_MODE=gmail` is set; remove it to
go back to Microsoft 365. It is meant for local testing only.

Security: the client secret is encrypted with AES-256-GCM (`EMAIL_SECRET_KEY`, never stored in the database) and
is never returned by any API or written to logs. All `/api/admin/*` routes require an admin session; test sends and
sign-in are rate-limited; configuration changes are recorded in the `auditlogs` collection.
