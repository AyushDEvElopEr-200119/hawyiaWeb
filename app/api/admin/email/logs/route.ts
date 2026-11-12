import { adminRoute, ok } from "@/lib/server/api";
import { listLogs, logsCsv } from "@/lib/server/email/logs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET /api/admin/email/logs?q=&status=&from=&to=&page=&pageSize=  (add format=csv to download) */
export const GET = adminRoute(async ({ request }) => {
  const p = new URL(request.url).searchParams;
  const query = {
    q: p.get("q") ?? undefined, status: p.get("status") ?? undefined, from: p.get("from") ?? undefined, to: p.get("to") ?? undefined,
    page: Number(p.get("page") ?? 1) || 1, pageSize: Number(p.get("pageSize") ?? 20) || 20,
  };
  if (p.get("format") === "csv") {
    const csv = await logsCsv(query);
    return new Response(`﻿${csv}`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="email-logs-${new Date().toISOString().slice(0, 10)}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }
  return ok(await listLogs(query));
});
