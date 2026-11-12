import "server-only";
import { NextResponse } from "next/server";
import { requireAdmin } from "./auth";
import { HttpError, ValidationError } from "./errors";
import type { AdminSession } from "./session";

/** Every admin API answers { ok: true, data } or { ok: false, error, code, fields? }. */
export const ok = (data: unknown = null, status = 200) => NextResponse.json({ ok: true, data }, { status });

export function fail(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json(
      { ok: false, error: error.message, code: error.code, ...(error instanceof ValidationError ? { fields: error.fields } : {}) },
      { status: error.status },
    );
  }
  console.error("Admin API error:", (error as Error)?.message ?? error);
  return NextResponse.json({ ok: false, error: "Something went wrong on the server.", code: "server_error" }, { status: 500 });
}

/** Wraps a route: requires an admin, then runs the handler and turns errors into JSON. */
export function adminRoute<C>(handler: (ctx: { request: Request; admin: AdminSession; params: C }) => Promise<Response>) {
  return async (request: Request, context: { params: Promise<C> }) => {
    try {
      const admin = await requireAdmin();
      return await handler({ request, admin, params: await context.params });
    } catch (error) {
      return fail(error);
    }
  };
}

/** Reads a JSON body (max ~200 KB) or fails with 400. */
export async function jsonBody(request: Request): Promise<Record<string, unknown>> {
  const text = await request.text();
  if (text.length > 200_000) throw new ValidationError("The request is too large.");
  try {
    const value = text ? JSON.parse(text) : {};
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
    return value as Record<string, unknown>;
  } catch {
    throw new ValidationError("The request body must be a JSON object.");
  }
}
