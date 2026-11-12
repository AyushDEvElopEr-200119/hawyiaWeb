// Whether outgoing email (lib/mail.ts) is set up. Kept separate from lib/mail.ts so components can
// check it without pulling the mail library into any bundle.
export const mailConfigured = () =>
  (process.env.EMAIL_TEST_MODE?.trim().toLowerCase() === "gmail" && !!process.env.GMAIL_USER?.trim() && !!process.env.GMAIL_APP_PASSWORD?.trim()) ||
  ["SMTP_HOST", "SMTP_USER", "MS_TENANT_ID", "MS_CLIENT_ID", "MS_CLIENT_SECRET"].every((k) => process.env[k]?.trim());
