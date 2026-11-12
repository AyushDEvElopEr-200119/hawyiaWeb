import { adminRoute, ok } from "@/lib/server/api";
import { audit } from "@/lib/server/audit";
import { retryEmail } from "@/lib/server/email";
import { getLog } from "@/lib/server/email/logs";
import { clientIp, rateLimit } from "@/lib/server/rateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** POST /api/admin/email/logs/:id/retry: sends a logged email again. */
export const POST = adminRoute<{ id: string }>(async ({ request, admin, params }) => {
  await rateLimit(`retry:${admin.email}`, 30, 600);
  const result = await retryEmail(params.id);
  await audit(admin.email, "email.retried", params.id, [], clientIp(request));
  return ok({ result, log: await getLog(params.id) });
});
