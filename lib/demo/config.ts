import { company } from "@/lib/site";

/** Booking stays off until every key is set; the demo form then falls back to an email draft. */
export const bookingConfigured = () =>
  ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_CALENDAR_USER", "RESEND_API_KEY", "DEMO_EMAIL_FROM"].every((k) => process.env[k]);

/** Who attends every demo: a comma-separated list, or the company inbox. */
export const teamEmails = () =>
  (process.env.DEMO_TEAM_EMAILS || company.email).split(",").map((e) => e.trim()).filter(Boolean);
