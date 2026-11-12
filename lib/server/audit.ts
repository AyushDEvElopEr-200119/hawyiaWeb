import "server-only";
import { dbConfigured, sql } from "./db";

/** Records a configuration change: who, what, which fields (never secret values). */
export async function audit(actor: string, action: string, target = "", fields: string[] = [], ip = "") {
  if (!dbConfigured()) {
    console.info(`[audit] ${actor} ${action} ${target} ${fields.join(",")}`);
    return;
  }
  try {
    await sql("INSERT INTO audit_logs (actor, action, target, fields, ip) VALUES ($1, $2, $3, $4, $5)", [actor, action, target, fields, ip]);
  } catch (error) {
    console.error("Audit log failed:", (error as Error).message);
  }
}
