# Hawyia website: deployment guide

For the team deploying this site to the production server. It's a **Next.js 16** app
(website, API and admin dashboard in one), so it needs a Node.js server. It can't be
uploaded as static HTML files.

## 1. Requirements

- **Node.js 20.9 or newer** (22 LTS recommended) and npm
- HTTPS on the final domain (needed for the admin sign-in cookie)
- Outbound access to `smtp.office365.com:587` and `login.microsoftonline.com:443`.
  Some hosts block port 587; ask your provider to open it if Test Connection reports *SMTP Connection Failed*.
- Optional: a **PostgreSQL 13+** database on any host (Neon, Supabase, Azure, AWS RDS or the same server), for
  email logs, editable settings and templates. Tables are created automatically; `db/schema.sql` has the same SQL.

## 2. Build and run

```bash
git clone https://github.com/AyushDEvElopEr-200119/hawyiaWeb.git
cd hawyiaWeb
npm ci
# create .env.production.local with the variables in section 3 BEFORE building
npm run build
npx next start -p 3000      # or any port; keep it running with pm2 / systemd
```

Example with pm2: `pm2 start "npx next start -p 3000" --name hawyia && pm2 save`

Put a reverse proxy (nginx, Apache, IIS or a load balancer) in front, with HTTPS, and pass the original
host and protocol through. nginx example:

```nginx
location / {
  proxy_pass http://127.0.0.1:3000;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

The admin sign-in builds its return address from the incoming host, so the `Host` and
`X-Forwarded-Proto` headers must reach the app unchanged.

**To update later:** `git pull && npm ci && npm run build`, then restart the process.

## 3. Environment variables

Put these in `.env.production.local` on the server, or in the hosting panel. **Never commit them to git.**
Get the secret values from the developer over a secure channel, not by email or chat.

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://<final-domain>` | **Set before `npm run build`.** Used for canonical links, sitemap and social previews |
| `SITE_INDEXABLE` | `true` | Only on the real domain; lets Google index the site |
| `SMTP_HOST` | `smtp.office365.com` | |
| `SMTP_PORT` | `587` | |
| `SMTP_USER` | `Info@hawyiapremium.com` | The mailbox the website sends from |
| `MS_TENANT_ID` | Directory (tenant) ID | From Azure → App registrations |
| `MS_CLIENT_ID` | Application (client) ID | |
| `MS_CLIENT_SECRET` | Client secret **Value** | Secret |
| `MS_OBJECT_ID` | App registration Object ID | Reference only |
| `ADMIN_EMAILS` | `info@hawyiapremium.com` | Microsoft 365 accounts allowed into `/admin`, comma-separated |
| `ADMIN_SESSION_SECRET` | 64 random characters | Secret. Signs admin sessions |
| `EMAIL_SECRET_KEY` | 32 random bytes (base64) | Secret. Encrypts stored secrets; **never change it once set** |
| `CRON_SECRET` | random string | Secret. Protects the email-retry job |
| `DATABASE_URL` | `postgres://user:pass@host:5432/hawyia?sslmode=require` | Optional: PostgreSQL for email logs, templates and editable settings |
| `DATABASE_SSL` | `false` | Optional: only for a database on the same server without TLS |

Generate new random secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Don't set** `EMAIL_TEST_MODE`, `GMAIL_USER`, `GMAIL_APP_PASSWORD` or `GMAIL_TEST_TO`. They are for local testing only.

## 4. Microsoft 365 / Azure (done once by the client's Microsoft 365 admin)

Without this, every form shows *"Something went wrong"*, because Microsoft answers `535 5.7.3 Authentication unsuccessful`.

1. **Azure → App registrations → the app → API permissions:** *Office 365 Exchange Online → Application
   permissions → SMTP.SendAsApp*, then **Grant admin consent**. (Already present; check it shows "Granted".)
2. **Azure → App registrations → the app → Authentication → Add a platform → Web**, redirect URI:
   ```
   https://<final-domain>/api/admin/auth/callback/
   ```
   (keep the slash at the end). Add one per domain the admin is used on.
3. **Exchange Online PowerShell.** Use the Object ID from **Enterprise applications** (not App registrations):
   ```powershell
   Install-Module ExchangeOnlineManagement -Scope CurrentUser
   Connect-ExchangeOnline
   New-ServicePrincipal -AppId <client-id> -ObjectId <enterprise-app-object-id>
   Add-MailboxPermission -Identity "Info@hawyiapremium.com" -User <enterprise-app-object-id> -AccessRights FullAccess
   Set-CASMailbox -Identity "Info@hawyiapremium.com" -SmtpClientAuthenticationDisabled $false
   Set-TransportConfig -SmtpClientAuthenticationDisabled $false
   ```
   Changes can take up to 30 minutes to apply.

## 5. Scheduled retry of failed emails

Failed emails are retried by calling `/api/cron/email-retry/` with the cron secret.
On Vercel this is automatic (`vercel.json`). **On your own server**, add a cron job, for example every 10 minutes:

```cron
*/10 * * * * curl -fsS -H "Authorization: Bearer <CRON_SECRET>" https://<final-domain>/api/cron/email-retry/ > /dev/null
```

(Only useful when `DATABASE_URL` is set, because failed emails are stored there.)

## 6. Check after deploying

1. Open `https://<final-domain>/`. Pages load in English, and `/ar/` in Arabic.
2. The green WhatsApp button opens a chat with +968 9705 7071.
3. Open `https://<final-domain>/admin/` and sign in with Microsoft as Info@hawyiapremium.com.
4. **Settings › Communication Settings › Email Configuration → Test Connection** must show **Connected**.
   If it shows *Authentication Failed*, finish section 4; the page shows the exact commands with a Copy button.
5. Use **Send Test Email**, then submit the Contact form. Info@hawyiapremium.com should receive the
   enquiry, and the visitor gets a confirmation email.

## Notes

- `/admin/` and `/api/` are never indexed by search engines.
- The client secret is never sent to the browser or written to logs. When stored in PostgreSQL it is encrypted (AES-256-GCM).
- Azure client secrets expire. When it is renewed, update `MS_CLIENT_SECRET` (or use **Rotate secret** in the dashboard when the database is connected) and restart.
