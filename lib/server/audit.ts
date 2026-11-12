import "server-only";
import { db, dbConfigured } from "./db";
import { AuditLog } from "./models";

/** Records a configuration change: who, what, which fields (never secret values). */
export async function audit(actor: string, action: string, target = "", fields: string[] = [], ip = "") {
  if (!dbConfigured()) {
    console.info(`[audit] ${actor} ${action} ${target} ${fields.join(",")}`);
    return;
  }
  try {
    await db();
    await AuditLog.create({ actor, action, target, fields, ip });
  } catch (error) {
    console.error("Audit log failed:", (error as Error).message);
  }
}
