import "server-only";
// Admin sign-in with Microsoft Entra ID (OpenID Connect, authorization code + PKCE).
// Uses the same app registration as email unless ADMIN_AUTH_* overrides are set, so changing the
// email secret in the dashboard can never lock admins out.
import { createHash, randomBytes } from "node:crypto";
import { createRemoteJWKSet, jwtVerify, SignJWT } from "jose";
import { ConfigError } from "./errors";

const env = (k: string) => process.env[k]?.trim() || "";
export const oidcSettings = () => ({
  tenantId: env("ADMIN_AUTH_TENANT_ID") || env("MS_TENANT_ID"),
  clientId: env("ADMIN_AUTH_CLIENT_ID") || env("MS_CLIENT_ID"),
  clientSecret: env("ADMIN_AUTH_CLIENT_SECRET") || env("MS_CLIENT_SECRET"),
});

export const STATE_COOKIE = "hw_admin_oidc";
const b64url = (b: Buffer) => b.toString("base64url");
const stateKey = () => {
  const s = env("ADMIN_SESSION_SECRET");
  if (s.length < 32) throw new ConfigError("ADMIN_SESSION_SECRET is missing or shorter than 32 characters.");
  return new TextEncoder().encode(s);
};

/** The callback address registered in Entra ID (trailing slash, as the site uses everywhere). */
export const callbackUrl = (request: Request) => `${new URL(request.url).origin}/api/admin/auth/callback/`;

export async function startLogin(request: Request, returnTo: string) {
  const { tenantId, clientId } = oidcSettings();
  if (!tenantId || !clientId) throw new ConfigError("Microsoft sign-in isn't configured (MS_TENANT_ID / MS_CLIENT_ID).");
  const state = b64url(randomBytes(24));
  const nonce = b64url(randomBytes(24));
  const verifier = b64url(randomBytes(48));
  const challenge = b64url(createHash("sha256").update(verifier).digest());
  const url = new URL(`https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/authorize`);
  url.search = new URLSearchParams({
    client_id: clientId, response_type: "code", response_mode: "query", redirect_uri: callbackUrl(request),
    scope: "openid profile email", state, nonce, code_challenge: challenge, code_challenge_method: "S256", prompt: "select_account",
  }).toString();
  const cookie = await new SignJWT({ state, nonce, verifier, returnTo })
    .setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("10m").sign(stateKey());
  return { url: url.toString(), cookie };
}

/** Exchanges the code and verifies the ID token. Returns the signed-in person's email and name. */
export async function finishLogin(request: Request, code: string, state: string, cookie: string | undefined) {
  if (!cookie) throw new Error("Your sign-in took too long or cookies are blocked. Please try again.");
  const { payload: saved } = await jwtVerify(cookie, stateKey(), { algorithms: ["HS256"] }).catch(() => {
    throw new Error("Your sign-in session expired. Please try again.");
  });
  if (saved.state !== state) throw new Error("Sign-in state didn't match. Please try again.");

  const { tenantId, clientId, clientSecret } = oidcSettings();
  const res = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`, {
    method: "POST",
    body: new URLSearchParams({
      client_id: clientId, client_secret: clientSecret, grant_type: "authorization_code", code,
      redirect_uri: callbackUrl(request), code_verifier: String(saved.verifier), scope: "openid profile email",
    }),
    signal: AbortSignal.timeout(15_000),
  });
  const json = (await res.json().catch(() => ({}))) as { id_token?: string; error_description?: string };
  if (!res.ok || !json.id_token) throw new Error(`Microsoft sign-in failed: ${(json.error_description ?? res.status).toString().split("\n")[0]}`);

  const jwks = createRemoteJWKSet(new URL(`https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/discovery/v2.0/keys`));
  const { payload } = await jwtVerify(json.id_token, jwks, { issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`, audience: clientId });
  if (payload.nonce !== saved.nonce) throw new Error("Sign-in nonce didn't match. Please try again.");
  if (payload.tid !== tenantId) throw new Error("That account isn't from the Hawyia Microsoft 365 organisation.");
  const email = String(payload.email ?? payload.preferred_username ?? payload.upn ?? "").toLowerCase();
  if (!email) throw new Error("Microsoft didn't return an email address for this account.");
  return { email, name: String(payload.name ?? email), returnTo: String(saved.returnTo ?? "/admin/") };
}
