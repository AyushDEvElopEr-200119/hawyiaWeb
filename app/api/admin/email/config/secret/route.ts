import { adminRoute, jsonBody, ok } from "@/lib/server/api";
import { getConfigView, rotateSecret } from "@/lib/server/email/config";
import { clearTokenCache } from "@/lib/server/email/oauth";
import { clientIp, rateLimit } from "@/lib/server/rateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** POST /api/admin/email/config/secret: replaces the client secret. The value is encrypted and never returned. */
export const POST = adminRoute(async ({ request, admin }) => {
  await rateLimit(`secret:${admin.email}`, 10, 3600);
  const { clientSecret } = await jsonBody(request);
  await rotateSecret(clientSecret, admin.email, clientIp(request));
  clearTokenCache();
  return ok({ config: await getConfigView() });
});
