import { adminRoute, jsonBody, ok } from "@/lib/server/api";
import { deleteTemplate, getTemplate, updateTemplate } from "@/lib/server/email/templates";
import { clientIp } from "@/lib/server/rateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = adminRoute<{ id: string }>(async ({ params }) => ok(await getTemplate(params.id)));

export const PUT = adminRoute<{ id: string }>(async ({ request, admin, params }) =>
  ok(await updateTemplate(params.id, await jsonBody(request), admin.email, clientIp(request))));

export const DELETE = adminRoute<{ id: string }>(async ({ request, admin, params }) => {
  await deleteTemplate(params.id, admin.email, clientIp(request));
  return ok({ deleted: params.id });
});
