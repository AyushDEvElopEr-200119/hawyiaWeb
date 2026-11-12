import "server-only";
import { decodeJwt } from "jose";
import { fingerprint } from "../crypto";
import type { EffectiveConfig } from "./config";

/** A failure while getting a token from Microsoft Entra ID. */
export class OAuthFailure extends Error {
  constructor(message: string, public code: string) { super(message); }
}

const SMTP_SCOPE = "https://outlook.office365.com/.default";
const tokens = new Map<string, { token: string; roles: string[]; expires: number }>();

// Common Entra errors, in words an administrator can act on.
const explain = (code: string, description: string) => {
  if (/AADSTS7000215/.test(description)) return "The client secret is wrong. Copy the secret's Value (not its ID) from Entra ID.";
  if (/AADSTS7000222/.test(description)) return "The client secret has expired. Create a new one in Entra ID and rotate it here.";
  if (/AADSTS700016/.test(description)) return "No app with this Application (client) ID exists in this tenant.";
  if (/AADSTS90002|AADSTS900023/.test(description)) return "The Directory (tenant) ID is wrong.";
  return `Microsoft sign-in failed (${code}): ${description.split("\n")[0].replace(/Trace ID.*$/s, "").trim()}`;
};

/** An app-only token for Exchange SMTP (XOAUTH2), cached until a minute before it expires. */
export async function getSmtpAccessToken(cfg: Pick<EffectiveConfig, "tenantId" | "clientId" | "clientSecret">) {
  const cacheKey = fingerprint(`${cfg.tenantId}|${cfg.clientId}|${cfg.clientSecret}`);
  const hit = tokens.get(cacheKey);
  if (hit && hit.expires > Date.now() + 60_000) return hit;

  let res: Response;
  try {
    res = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(cfg.tenantId)}/oauth2/v2.0/token`, {
      method: "POST",
      body: new URLSearchParams({ client_id: cfg.clientId, client_secret: cfg.clientSecret, scope: SMTP_SCOPE, grant_type: "client_credentials" }),
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    throw new OAuthFailure(`Couldn't reach Microsoft sign-in: ${(error as Error).message}`, "network");
  }
  const json = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error?: string; error_description?: string };
  if (!res.ok || !json.access_token) throw new OAuthFailure(explain(json.error ?? String(res.status), json.error_description ?? ""), json.error ?? "token_error");

  let roles: string[] = [];
  try { roles = (decodeJwt(json.access_token).roles as string[] | undefined) ?? []; } catch { /* roles are informational */ }
  const entry = { token: json.access_token, roles, expires: Date.now() + (json.expires_in ?? 3600) * 1000 };
  tokens.set(cacheKey, entry);
  return entry;
}

export const clearTokenCache = () => tokens.clear();
