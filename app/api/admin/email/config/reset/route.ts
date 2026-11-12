import { adminRoute, ok } from "@/lib/server/api";
import { getConfigView, resetConfig } from "@/lib/server/email/config";
import { clientIp } from "@/lib/server/rateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** POST /api/admin/email/config/reset: restores the Microsoft 365 SMTP defaults (Azure IDs and secret are kept). */
export const POST = adminRoute(async ({ request, admin }) => {
  await resetConfig(admin.email, clientIp(request));
  return ok({ config: await getConfigView() });
});
