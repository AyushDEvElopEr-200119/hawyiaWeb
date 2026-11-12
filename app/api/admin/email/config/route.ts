import { adminRoute, jsonBody, ok } from "@/lib/server/api";
import { getConfigView, rotateSecret, updateConfig } from "@/lib/server/email/config";
import { logStats } from "@/lib/server/email/logs";
import { clientIp } from "@/lib/server/rateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET /api/admin/email/config: settings (never the secret) and send counts. */
export const GET = adminRoute(async () => {
  const [config, stats] = await Promise.all([getConfigView(), logStats()]);
  return ok({ config, stats });
});

/** PUT /api/admin/email/config: saves editable fields; a non-empty clientSecret rotates the secret. */
export const PUT = adminRoute(async ({ request, admin }) => {
  const body = await jsonBody(request);
  const ip = clientIp(request);
  const { clientSecret, ...fields } = body;
  const changed = await updateConfig(fields, admin.email, ip);
  if (typeof clientSecret === "string" && clientSecret.trim()) {
    await rotateSecret(clientSecret, admin.email, ip);
    changed.push("clientSecret");
  }
  return ok({ changed, config: await getConfigView() });
});
