import { adminRoute, jsonBody, ok } from "@/lib/server/api";
import { createTemplate, listTemplates } from "@/lib/server/email/templates";
import { clientIp } from "@/lib/server/rateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET /api/admin/email/templates */
export const GET = adminRoute(async () => ok(await listTemplates()));

/** POST /api/admin/email/templates: { key, name, description?, subject, html, text?, enabled? } */
export const POST = adminRoute(async ({ request, admin }) =>
  ok(await createTemplate(await jsonBody(request), admin.email, clientIp(request)), 201));
