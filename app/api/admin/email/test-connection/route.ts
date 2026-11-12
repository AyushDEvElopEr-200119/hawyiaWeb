import { adminRoute, ok } from "@/lib/server/api";
import { audit } from "@/lib/server/audit";
import { getConfigView, getEffectiveConfig, recordTest } from "@/lib/server/email/config";
import { testConnection } from "@/lib/server/email/smtp";
import { clientIp, rateLimit } from "@/lib/server/rateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/admin/email/test-connection: a real check (Microsoft OAuth token, then SMTP sign-in).
 * Sends no email. Returns Connected / Authentication Failed / SMTP Connection Failed /
 * Configuration Incomplete / Service Disabled, with an explanation.
 */
export const POST = adminRoute(async ({ request, admin }) => {
  await rateLimit(`test-connection:${admin.email}`, 10, 300);
  const result = await testConnection(await getEffectiveConfig());
  await recordTest(result.status, result.message);
  await audit(admin.email, "email.connection.tested", result.status, [], clientIp(request));
  return ok({ result: { ...result, testedAt: new Date().toISOString() }, config: await getConfigView() });
});
