import "server-only";

/** Errors the admin API turns into clean JSON responses (see lib/server/api.ts). */
export class HttpError extends Error {
  constructor(public status: number, message: string, public code = "error") {
    super(message);
  }
}
export class AuthError extends HttpError {
  constructor(message = "Please sign in.", status = 401) { super(status, message, status === 403 ? "forbidden" : "unauthorized"); }
}
export class ValidationError extends HttpError {
  constructor(message: string, public fields: Record<string, string> = {}) { super(400, message, "validation"); }
}
export class ConfigError extends HttpError {
  constructor(message: string) { super(503, message, "not_configured"); }
}
export class RateLimitError extends HttpError {
  constructor(message = "Too many requests. Please wait a moment and try again.") { super(429, message, "rate_limited"); }
}
