import "server-only";
import { company } from "@/lib/site";
import { audit } from "../audit";
import { seal, unseal } from "../crypto";
import { db, dbConfigured } from "../db";
import { ConfigError, ValidationError } from "../errors";
import { EmailConfiguration, type EmailConfigurationDoc } from "../models";

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

/** The stored configuration document, created from the environment on first use. */
async function document() {
  await db();
  let doc = await EmailConfiguration.findOne({ key: "default" });
  if (!doc && encryptionReady()) {
    const e = fromEnvironment();
    doc = await EmailConfiguration.create({
      key: "default", provider: e.provider, host: e.host, port: e.port, security: e.security, username: e.username,
      senderEmail: e.senderEmail, senderName: e.senderName, notifyEmails: e.notifyEmails, enabled: e.enabled,
      tenantId: e.tenantId, clientId: e.clientId, objectId: e.objectId,
      ...(e.clientSecret ? { clientSecretEnc: seal(e.clientSecret), secretUpdatedAt: new Date() } : {}),
      updatedBy: "imported from environment",
    });
  }
  return doc;
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
  if (!dbConfigured()) throw new ConfigError("Saving settings needs the database. Add MONGODB_URI, then reload.");
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
    await EmailConfiguration.updateOne({ _id: doc._id }, { $set: { ...set, updatedBy: actor } });
    await audit(actor, "email.config.updated", "EmailConfiguration", changed, ip);
  }
  return changed;
}

/** Replaces the client secret (encrypted before it is stored). */
export async function rotateSecret(secret: unknown, actor: string, ip: string) {
  const value = typeof secret === "string" ? secret.trim() : "";
  if (value.length < 8 || value.length > 256 || /\s/.test(value)) throw new ValidationError("Enter the full client secret value.", { clientSecret: "Enter the secret's Value (not its ID)." });
  const doc = await editable();
  await EmailConfiguration.updateOne({ _id: doc._id }, { $set: { clientSecretEnc: seal(value), secretUpdatedAt: new Date(), updatedBy: actor } });
  await audit(actor, "email.config.secret_rotated", "EmailConfiguration", ["clientSecret"], ip);
}

/** Restores the Microsoft 365 SMTP defaults; Azure IDs and the secret are kept. */
export async function resetConfig(actor: string, ip: string) {
  const doc = await editable();
  const e = fromEnvironment();
  await EmailConfiguration.updateOne({ _id: doc._id }, { $set: {
    provider: "microsoft365", host: "smtp.office365.com", port: 587, security: "STARTTLS", authType: "oauth2",
    username: e.username || doc.username, senderEmail: e.senderEmail || doc.senderEmail, senderName: e.senderName, enabled: true, updatedBy: actor,
  } });
  await audit(actor, "email.config.reset", "EmailConfiguration", ["host", "port", "security", "username", "senderEmail", "senderName", "enabled"], ip);
}

export async function recordTest(status: string, message: string) {
  if (!dbConfigured()) return;
  try {
    await db();
    await EmailConfiguration.updateOne({ key: "default" }, { $set: { lastTest: { at: new Date(), status, message } } });
  } catch { /* the test result is informational only */ }
}
