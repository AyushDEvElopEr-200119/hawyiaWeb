import { adminRoute, jsonBody, ok } from "@/lib/server/api";
import { findVariables, render, sampleVariables } from "@/lib/server/email/templates";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** POST /api/admin/email/templates/preview: renders unsaved subject/HTML/text with sample values. */
export const POST = adminRoute(async ({ request }) => {
  const b = await jsonBody(request);
  const t = {
    subject: typeof b.subject === "string" ? b.subject.slice(0, 250) : "",
    html: typeof b.html === "string" ? b.html.slice(0, 100_000) : "",
    text: typeof b.text === "string" ? b.text.slice(0, 50_000) : "",
  };
  const variables = findVariables(t);
  const custom = b.variables && typeof b.variables === "object" ? (b.variables as Record<string, unknown>) : {};
  return ok({ ...render(t, { ...sampleVariables(variables), ...custom }), variables });
});
