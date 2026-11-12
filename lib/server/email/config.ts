import "server-only";
import { company } from "@/lib/site";
import { audit } from "../audit";
import { seal, unseal } from "../crypto";
import { dbConfigured, sql } from "../db";
import { ConfigError, ValidationError } from "../errors";

/** The stored settings row (table email_configuration), in the code's camelCase. */
type EmailConfigurationDoc = {
  key: string; provider: string; host: string; port: number; security: string; username: string; senderEmail: string;
  senderName: string; notifyEmails: string[]; enabled: boolean; tenantId: string; clientId: string; objectId: string;
  clientSecretEnc: { iv?: string; tag?: string; data?: string } | null; secretUpdatedAt: Date | null;
  lastTest: { at?: string; status?: string; message?: string } | null;
};
// editable field → column
const COLUMN: Record<string, string> = {
  provider: "provider", host: "host", port: "port", security: "security", authType: "auth_type", username: "username",
  senderEmail: "sender_email", senderName: "sender_name", notifyEmails: "notify_emails", enabled: "enabled",
  tenantId: "tenant_id", clientId: "client_id", objectId: "object_id",
};
const fromRow = (r: Record<string, unknown>): EmailConfigurationDoc => ({
  key: String(r.key), provider: String(r.provider), host: String(r.host), port: Number(r.port), security: String(r.security),
  username: String(r.username), senderEmail: String(r.sender_email), senderName: String(r.sender_name),
  notifyEmails: (r.notify_emails as string[]) ?? [], enabled: !!r.enabled, tenantId: String(r.tenant_id), clientId: String(r.client_id),
  objectId: String(r.object_id), clientSecretEnc: (r.client_secret_enc as EmailConfigurationDoc["clientSecretEnc"]) ?? null,
  secretUpdatedAt: (r.secret_updated_at as Date | null) ?? null, lastTest: (r.last_test as EmailConfigurationDoc["lastTest"]) ?? null,
});
/** Writes the given camelCase fields to the settings row. */
async function saveFields(set: Record<string, unknown>, actor: string, extra: Record<string, unknown> = {}) {
  const cols = Object.entries(set).map(([k, v]) => [COLUMN[k], v] as const).concat(Object.entries(extra));
  const assignments = cols.map(([c], i) => `${c} = $${i + 2}`).concat(["updated_at = now()"]);
  await sql(`UPDATE email_configuration SET ${assignments.join(", ")}, updated_by = $1 WHERE key = 'default'`, [actor, ...cols.map(([, v]) => v)]);
}

/** Everything needed to send, including the decrypted secret. Server-side only, never returned by an API. */
export type EffectiveConfig = {
  provider: string; host: string; port: number; security: "STARTTLS" | "SSL/TLS"; authType: "oauth2";
  username: string; senderEmail: string; senderName: string; notifyEmails: string[]; enabled: boolean;
  tenantId: string; clientId: string; objectId: string; clientSecret: string;
  secretUpdatedAt: string | null; lastTest: { at: string; status: string; message: string } | null;
  source: "database" | "environment";
  /** Temporary Gmail sending for local testing (EMAIL_TEST_MODE=gmail). Read from the environment only. */
  testMode: TestMode | null;
};

export type TestMode = { provider: "gmail"; user: string; pass: string; redirectTo: string[] };

/** What the dashboard sees: the same, minus the secrets. */
export type ConfigView = Omit<EffectiveConfig, "clientSecret" | "testMode"> & {
  secretSet: boolean; databaseConnected: boolean; encryptionReady: boolean;
  testMode: { provider: "gmail"; user: string; redirectTo: string[]; ready: boolean } | null;
};

const env = (k: string) => process.env[k]?.trim() || "";

/**
 * Gmail test mode: on only when EMAIL_TEST_MODE=gmail is set explicitly, so the site never switches
 * provider on its own. GMAIL_TEST_TO (optional) redirects team notifications to the tester's inbox.
 */
function testModeFromEnvironment(): TestMode | null {
  if (env("EMAIL_TEST_MODE").toLowerCase() !== "gmail") return null;
  return {
    provider: "gmail",
    user: env("GMAIL_USER"),
    pass: env("GMAIL_APP_PASSWORD").replace(/\s+/g, ""), // Google shows it in groups of four
    redirectTo: env("GMAIL_TEST_TO").split(",").map((e) => e.trim()).filter(Boolean),
  };
}

const withTestMode = (c: Omit<EffectiveConfig, "testMode">): EffectiveConfig => {
  const testMode = testModeFromEnvironment();
  return { ...c, testMode, notifyEmails: testMode?.redirectTo.length ? testMode.redirectTo : c.notifyEmails };
};
const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HOST = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

const parseFrom = (from: string) => {
  const m = from.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  return m ? { name: m[1].trim(), email: m[2].trim() } : { name: "", email: from.trim() };
};

/** Settings from .env.local / Vercel, used until the database holds its own copy. */
function fromEnvironment(): Omit<EffectiveConfig, "testMode"> {
  const from = parseFrom(env("MAIL_FROM"));
  const notify = (env("DEMO_TEAM_EMAILS") || company.email).split(",").map((e) => e.trim()).filter(Boolean);
  return {
    provider: "microsoft365", host: env("SMTP_HOST") || "smtp.office365.com", port: Number(env("SMTP_PORT") || 587),
    security: env("SMTP_PORT") === "465" ? "SSL/TLS" : "STARTTLS", authType: "oauth2",
    username: env("SMTP_USER"), senderEmail: from.email || env("SMTP_USER"), senderName: from.name || `${company.name} Premium`,
    notifyEmails: notify, enabled: env("EMAIL_DISABLED") !== "true",
    tenantId: env("MS_TENANT_ID"), clientId: env("MS_CLIENT_ID"), objectId: env("MS_OBJECT_ID"), clientSecret: env("MS_CLIENT_SECRET"),
    secretUpdatedAt: null, lastTest: null, source: "environment",
  };
}

function fromDocument(doc: EmailConfigurationDoc): Omit<EffectiveConfig, "testMode"> {
  let clientSecret = "";
  if (doc.clientSecretEnc?.data) {
    try { clientSecret = unseal(doc.clientSecretEnc as { iv: string; tag: string; data: string }); }
    catch { console.error("Stored client secret couldn't be decrypted (was EMAIL_SECRET_KEY changed?)."); }
  }
  return {
    provider: doc.provider, host: doc.host, port: doc.port, security: doc.security === "SSL/TLS" ? "SSL/TLS" : "STARTTLS", authType: "oauth2",
    username: doc.username, senderEmail: doc.senderEmail, senderName: doc.senderName, notifyEmails: doc.notifyEmails ?? [],
    enabled: doc.enabled, tenantId: doc.tenantId, clientId: doc.clientId, objectId: doc.objectId, clientSecret,
    secretUpdatedAt: doc.secretUpdatedAt ? new Date(doc.secretUpdatedAt).toISOString() : null,
    lastTest: doc.lastTest?.at ? { at: new Date(doc.lastTest.at).toISOString(), status: doc.lastTest.status ?? "", message: doc.lastTest.message ?? "" } : null,
    source: "database",
  };
}

const encryptionReady = () => {
  try { seal("check"); return true; } catch { return false; }
};

/** The stored settings, created from the environment on first use. */
async function document(): Promise<EmailConfigurationDoc | null> {
  let [row] = await sql("SELECT * FROM email_configuration WHERE key = 'default'");
  if (!row && encryptionReady()) {
    const e = fromEnvironment();
    await sql(
      `INSERT INTO email_configuration (key, provider, host, port, security, username, sender_email, sender_name, notify_emails, enabled,
         tenant_id, client_id, object_id, client_secret_enc, secret_updated_at, updated_by)
       VALUES ('default', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'imported from environment')
       ON CONFLICT (key) DO NOTHING`,
      [e.provider, e.host, e.port, e.security, e.username, e.senderEmail, e.senderName, e.notifyEmails, e.enabled,
        e.tenantId, e.clientId, e.objectId, e.clientSecret ? JSON.stringify(seal(e.clientSecret)) : null, e.clientSecret ? new Date() : null],
    );
    [row] = await sql("SELECT * FROM email_configuration WHERE key = 'default'");
  }
  return row ? fromRow(row) : null;
}

/** The configuration used for sending: the database copy when there is one, otherwise the environment. */
export async function getEffectiveConfig(): Promise<EffectiveConfig> {
  if (!dbConfigured()) return withTestMode(fromEnvironment());
  try {
    const doc = await document();
    return withTestMode(doc ? fromDocument(doc) : fromEnvironment());
  } catch (error) {
    // the database being down must not stop the site's emails
    console.error("Email config: database unavailable, using environment settings.", (error as Error).message);
    return withTestMode(fromEnvironment());
  }
}

export async function getConfigView(): Promise<ConfigView> {
  const c = await getEffectiveConfig();
  const { clientSecret, testMode, ...rest } = c;
  return {
    ...rest, secretSet: !!clientSecret, databaseConnected: c.source === "database", encryptionReady: encryptionReady(),
    testMode: testMode && { provider: testMode.provider, user: testMode.user, redirectTo: testMode.redirectTo, ready: !!(testMode.user && testMode.pass) },
  };
}

/* ---------------- updates (need the database) ---------------- */
async function editable() {
  if (!dbConfigured()) throw new ConfigError("Saving settings needs the database. Add DATABASE_URL, then reload.");
  if (!encryptionReady()) throw new ConfigError("EMAIL_SECRET_KEY is missing or invalid, so settings can't be stored safely.");
  const doc = await document();
  if (!doc) throw new ConfigError("The configuration couldn't be created.");
  return doc;
}

export type ConfigInput = Partial<{
  host: string; port: number; security: string; username: string; senderEmail: string; senderName: string;
  notifyEmails: string[] | string; enabled: boolean; tenantId: string; clientId: string; objectId: string;
}>;

/** Validates and saves editable fields. Returns the names of the fields that changed. */
export async function updateConfig(input: Record<string, unknown>, actor: string, ip: string) {
  const errors: Record<string, string> = {};
  const set: Record<string, unknown> = {};
  const str = (k: string, max = 254) => (typeof input[k] === "string" ? (input[k] as string).trim().slice(0, max) : undefined);

  const host = str("host");
  if (host !== undefined) { if (!HOST.test(host)) errors.host = "Enter a valid host name, e.g. smtp.office365.com."; else set.host = host.toLowerCase(); }
  if (input.port !== undefined) {
    const port = Number(input.port);
    if (!Number.isInteger(port) || port < 1 || port > 65535) errors.port = "Port must be a number from 1 to 65535."; else set.port = port;
  }
  const security = str("security");
  if (security !== undefined) { if (!["STARTTLS", "SSL/TLS"].includes(security)) errors.security = "Choose STARTTLS or SSL/TLS."; else set.security = security; }
  for (const k of ["username", "senderEmail"] as const) {
    const v = str(k);
    if (v !== undefined) { if (!EMAIL.test(v)) errors[k] = "Enter a valid email address."; else set[k] = v; }
  }
  const senderName = str("senderName", 80);
  if (senderName !== undefined) set.senderName = senderName.replace(/[<>"\r\n]/g, "");
  if (input.notifyEmails !== undefined) {
    const list = (Array.isArray(input.notifyEmails) ? input.notifyEmails : String(input.notifyEmails).split(","))
      .map((e) => String(e).trim()).filter(Boolean);
    if (!list.length || list.some((e) => !EMAIL.test(e)) || list.length > 10) errors.notifyEmails = "Enter up to 10 valid email addresses, separated by commas.";
    else set.notifyEmails = list;
  }
  if (input.enabled !== undefined) {
    if (typeof input.enabled !== "boolean") errors.enabled = "Must be on or off."; else set.enabled = input.enabled;
  }
  for (const k of ["tenantId", "clientId"] as const) {
    const v = str(k, 36);
    if (v !== undefined) { if (!GUID.test(v)) errors[k] = "Must be a GUID like 00000000-0000-0000-0000-000000000000."; else set[k] = v.toLowerCase(); }
  }
  const objectId = str("objectId", 36);
  if (objectId !== undefined) { if (objectId && !GUID.test(objectId)) errors.objectId = "Must be a GUID, or empty."; else set.objectId = objectId.toLowerCase(); }

  if (Object.keys(errors).length) throw new ValidationError("Please fix the highlighted fields.", errors);

  const doc = await editable();
  const changed = Object.keys(set).filter((k) => JSON.stringify((doc as unknown as Record<string, unknown>)[k]) !== JSON.stringify(set[k]));
  if (changed.length) {
    await saveFields(Object.fromEntries(changed.map((k) => [k, set[k]])), actor);
    await audit(actor, "email.config.updated", "email_configuration", changed, ip);
  }
  return changed;
}

/** Replaces the client secret (encrypted before it is stored). */
export async function rotateSecret(secret: unknown, actor: string, ip: string) {
  const value = typeof secret === "string" ? secret.trim() : "";
  if (value.length < 8 || value.length > 256 || /\s/.test(value)) throw new ValidationError("Enter the full client secret value.", { clientSecret: "Enter the secret's Value (not its ID)." });
  await editable();
  await saveFields({}, actor, { client_secret_enc: JSON.stringify(seal(value)), secret_updated_at: new Date() });
  await audit(actor, "email.config.secret_rotated", "email_configuration", ["clientSecret"], ip);
}

/** Restores the Microsoft 365 SMTP defaults; Azure IDs and the secret are kept. */
export async function resetConfig(actor: string, ip: string) {
  const doc = await editable();
  const e = fromEnvironment();
  await saveFields({
    provider: "microsoft365", host: "smtp.office365.com", port: 587, security: "STARTTLS", authType: "oauth2",
    username: e.username || doc.username, senderEmail: e.senderEmail || doc.senderEmail, senderName: e.senderName, enabled: true,
  }, actor);
  await audit(actor, "email.config.reset", "email_configuration", ["host", "port", "security", "username", "senderEmail", "senderName", "enabled"], ip);
}

export async function recordTest(status: string, message: string) {
  if (!dbConfigured()) return;
  try {
    await sql("UPDATE email_configuration SET last_test = $1 WHERE key = 'default'", [JSON.stringify({ at: new Date().toISOString(), status, message })]);
  } catch { /* the test result is informational only */ }
}
