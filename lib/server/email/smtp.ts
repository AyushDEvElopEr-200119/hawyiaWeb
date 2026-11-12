import "server-only";
import nodemailer from "nodemailer";
import type { EffectiveConfig } from "./config";
import { getSmtpAccessToken, OAuthFailure } from "./oauth";

export type ConnectionStatus = "Connected" | "Authentication Failed" | "SMTP Connection Failed" | "Configuration Incomplete" | "Service Disabled";

export type ConnectionResult = { status: ConnectionStatus; message: string; detail?: string; roles?: string[] };

export type OutgoingMessage = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
};

/** A send that failed, with a status the dashboard can show. */
export class DeliveryError extends Error {
  constructor(public status: ConnectionStatus, message: string, public detail?: string) { super(message); }
}

const REQUIRED: [keyof EffectiveConfig, string][] = [
  ["host", "SMTP host"], ["port", "SMTP port"], ["username", "SMTP username"], ["senderEmail", "Sender email"],
  ["tenantId", "Directory (tenant) ID"], ["clientId", "Application (client) ID"], ["clientSecret", "Client secret"],
];
export const missingFields = (cfg: EffectiveConfig) => REQUIRED.filter(([k]) => !cfg[k]).map(([, label]) => label);

/** What an Exchange admin must run when Microsoft accepts the app but Exchange refuses it (535 5.7.3). */
export const exchangeFix = (cfg: EffectiveConfig) => [
  "Connect-ExchangeOnline",
  `New-ServicePrincipal -AppId ${cfg.clientId || "<client-id>"} -ObjectId <enterprise-app-object-id>`,
  `Add-MailboxPermission -Identity "${cfg.username || "<mailbox>"}" -User <enterprise-app-object-id> -AccessRights FullAccess`,
  `Set-CASMailbox -Identity "${cfg.username || "<mailbox>"}" -SmtpClientAuthenticationDisabled $false`,
  "Set-TransportConfig -SmtpClientAuthenticationDisabled $false",
].join("\n");

const GMAIL = { host: "smtp.gmail.com", port: 465 };

function classify(error: unknown, cfg: EffectiveConfig): DeliveryError {
  if (error instanceof DeliveryError) return error;
  if (error instanceof OAuthFailure) return new DeliveryError("Authentication Failed", error.message);
  const e = error as { code?: string; responseCode?: number; response?: string; message?: string };
  if (cfg.testMode) {
    if (e.code === "EAUTH" || e.responseCode === 535 || e.responseCode === 534) {
      return new DeliveryError("Authentication Failed", `Gmail refused the sign-in for ${cfg.testMode.user}. Use a 16-character App password (Google Account → Security → 2-Step Verification → App passwords), not your normal Gmail password.`);
    }
    return new DeliveryError("SMTP Connection Failed", `Gmail test mode: ${(e.response || e.message || "unknown error").split("\n")[0]}`);
  }
  if (e.code === "EAUTH" || e.responseCode === 535) {
    return new DeliveryError(
      "Authentication Failed",
      `Microsoft issued a token, but Exchange refused to let the app send as ${cfg.username} (${(e.response || "535 5.7.3").split(" [")[0]}). An Exchange admin must register the app and allow SMTP AUTH for this mailbox.`,
      exchangeFix(cfg),
    );
  }
  if (e.responseCode === 550 || e.responseCode === 554) return new DeliveryError("Authentication Failed", `Exchange rejected the message: ${(e.response || e.message || "").split(" [")[0]}`);
  if (["ECONNECTION", "ETIMEDOUT", "ESOCKET", "EDNS", "ECONNREFUSED", "ENOTFOUND", "ETLS"].includes(e.code ?? "")) {
    return new DeliveryError("SMTP Connection Failed", `Couldn't connect to ${cfg.host}:${cfg.port} (${e.code}). Check the host, port and security setting.`);
  }
  return new DeliveryError("SMTP Connection Failed", (e.message || "Unknown SMTP error").split("\n")[0]);
}

const testMissing = (cfg: EffectiveConfig) =>
  cfg.testMode ? [!cfg.testMode.user && "GMAIL_USER", !cfg.testMode.pass && "GMAIL_APP_PASSWORD"].filter((x): x is string => !!x) : [];

async function transport(cfg: EffectiveConfig) {
  if (cfg.testMode) {
    const missing = testMissing(cfg);
    if (missing.length) throw new DeliveryError("Configuration Incomplete", `Gmail test mode is on but ${missing.join(" and ")} ${missing.length > 1 ? "are" : "is"} missing in .env.local.`);
    const t = nodemailer.createTransport({
      ...GMAIL, secure: true,
      connectionTimeout: 15_000, greetingTimeout: 15_000, socketTimeout: 30_000,
      auth: { user: cfg.testMode.user, pass: cfg.testMode.pass },
    });
    return { t, roles: [] as string[] };
  }
  const missing = missingFields(cfg);
  if (missing.length) throw new DeliveryError("Configuration Incomplete", `Missing: ${missing.join(", ")}.`);
  const { token, roles } = await getSmtpAccessToken(cfg);
  if (!roles.includes("SMTP.SendAsApp")) {
    throw new DeliveryError("Authentication Failed", "The app's token has no SMTP.SendAsApp permission. In Entra ID add Office 365 Exchange Online → Application permissions → SMTP.SendAsApp and grant admin consent.");
  }
  const t = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.security === "SSL/TLS",
    requireTLS: cfg.security === "STARTTLS",
    connectionTimeout: 15_000, greetingTimeout: 15_000, socketTimeout: 30_000,
    auth: { type: "OAuth2", user: cfg.username, accessToken: token },
  });
  return { t, roles };
}

/** Real check: Microsoft token, then SMTP sign-in. Sends nothing. */
export async function testConnection(cfg: EffectiveConfig): Promise<ConnectionResult> {
  if (!cfg.enabled) return { status: "Service Disabled", message: "Email sending is switched off. Turn it on to test the connection." };
  const missing = cfg.testMode ? testMissing(cfg) : missingFields(cfg);
  if (missing.length) return { status: "Configuration Incomplete", message: `Missing: ${missing.join(", ")}.` };
  try {
    const { t, roles } = await transport(cfg);
    await t.verify();
    t.close();
    if (cfg.testMode) return { status: "Connected", message: `Test mode: signed in to Gmail (${GMAIL.host}:${GMAIL.port}) as ${cfg.testMode.user}. Microsoft 365 is not being used.` };
    return { status: "Connected", message: `Signed in to ${cfg.host}:${cfg.port} as ${cfg.username} with OAuth 2.0.`, roles };
  } catch (error) {
    const d = classify(error, cfg);
    return { status: d.status, message: d.message, detail: d.detail };
  }
}

/** Sends one message. Throws DeliveryError with a status and a readable reason. */
export async function deliver(cfg: EffectiveConfig, m: OutgoingMessage) {
  if (!cfg.enabled) throw new DeliveryError("Service Disabled", "Email sending is switched off in Email Configuration.");
  try {
    const { t } = await transport(cfg);
    const info = await t.sendMail({
      // Gmail only sends as the signed-in account
      from: { name: cfg.testMode ? `${cfg.senderName} (test)` : cfg.senderName, address: cfg.testMode ? cfg.testMode.user : cfg.senderEmail },
      ...(cfg.testMode ? {} : { sender: cfg.username }),
      to: m.to,
      replyTo: m.replyTo,
      subject: m.subject,
      html: m.html,
      text: m.text,
      attachments: m.attachments,
    });
    t.close();
    return { messageId: info.messageId as string };
  } catch (error) {
    throw classify(error, cfg);
  }
}
