import { adminRoute, jsonBody, ok } from "@/lib/server/api";
import { ValidationError } from "@/lib/server/errors";
import { sendEmail } from "@/lib/server/email";
import { getTemplate, render, sampleVariables } from "@/lib/server/email/templates";
import { rateLimit } from "@/lib/server/rateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** POST /api/admin/email/templates/:id/test: { to, variables? } sends the template (with sample values) for real. */
export const POST = adminRoute<{ id: string }>(async ({ request, admin, params }) => {
  await rateLimit(`send-test:${admin.email}`, 5, 600);
  const body = await jsonBody(request);
  const to = typeof body.to === "string" ? body.to.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) throw new ValidationError("Enter a valid email address.", { to: "Enter a valid email address." });
  const template = await getTemplate(params.id);
  const custom = body.variables && typeof body.variables === "object" ? (body.variables as Record<string, unknown>) : {};
  const { subject, html, text } = render(template, { ...sampleVariables(template.variables), ...custom });
  const result = await sendEmail({ to, subject: `[Test] ${subject}`, html, text, source: `admin:template-test:${template.key}` });
  return ok({ result });
});
