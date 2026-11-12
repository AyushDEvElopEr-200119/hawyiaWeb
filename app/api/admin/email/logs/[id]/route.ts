import { adminRoute, ok } from "@/lib/server/api";
import { getLog } from "@/lib/server/email/logs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET /api/admin/email/logs/:id: one email with its content. */
export const GET = adminRoute<{ id: string }>(async ({ params }) => ok(await getLog(params.id)));
