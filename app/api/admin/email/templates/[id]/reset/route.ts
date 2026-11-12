import { adminRoute, ok } from "@/lib/server/api";
import { resetTemplate } from "@/lib/server/email/templates";
import { clientIp } from "@/lib/server/rateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** POST /api/admin/email/templates/:id/reset: restores a built-in template's original content. */
export const POST = adminRoute<{ id: string }>(async ({ request, admin, params }) =>
  ok(await resetTemplate(params.id, admin.email, clientIp(request))));
