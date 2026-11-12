import { mailConfigured } from "@/lib/mail-config";
import { company } from "@/lib/site";

/** Booking stays off until Google Calendar and a mail sender (Microsoft 365, or Resend) are set;
    the demo form then sends a plain enquiry instead. */
export const bookingConfigured = () =>
  ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_CALENDAR_USER"].every((k) => process.env[k]) &&
  (mailConfigured() || ["RESEND_API_KEY", "DEMO_EMAIL_FROM"].every((k) => process.env[k]));

/** Who attends every demo: a comma-separated list, or the company inbox. */
export const teamEmails = () =>
  (process.env.DEMO_TEAM_EMAILS || company.email).split(",").map((e) => e.trim()).filter(Boolean);
