// Google Calendar over its REST API: busy times, and events with a Google Meet link.
// Signs in as a service account acting for GOOGLE_CALENDAR_USER (see "Demo booking" in the README).
import { createSign, randomUUID } from "node:crypto";
import { DEMO, slotEnd } from "./slots";

const API = "https://www.googleapis.com/calendar/v3";
const SCOPES = "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.freebusy";

/** The slot already has a meeting: someone else booked it first. */
export class SlotTakenError extends Error {}

const b64 = (v: string) => Buffer.from(v).toString("base64url");
const calendarUser = () => process.env.GOOGLE_CALENDAR_USER!;

let token: { value: string; expires: number } | null = null;

async function accessToken() {
  if (token && token.expires > Date.now() + 60_000) return token.value;
  const now = Math.floor(Date.now() / 1000);
  const claims = { iss: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, sub: calendarUser(), scope: SCOPES, aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 };
  const unsigned = `${b64(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64(JSON.stringify(claims))}`;
  // hosting dashboards usually store the key's line breaks as a literal \n
  const key = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
  });
  if (!res.ok) throw new Error(`Google sign-in failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  token = { value: data.access_token, expires: Date.now() + data.expires_in * 1000 };
  return token.value;
}

async function call(path: string, init: { method?: string; body?: unknown } = {}) {
  return fetch(`${API}${path}`, {
    method: init.method ?? "GET",
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
}

async function ok(res: Response, action: string) {
  if (!res.ok) throw new Error(`Google Calendar ${action} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function busyPeriods(from: Date, to: Date): Promise<{ start: string; end: string }[]> {
  const res = await call("/freeBusy", { method: "POST", body: { timeMin: from.toISOString(), timeMax: to.toISOString(), items: [{ id: calendarUser() }] } });
  const data = await ok(res, "free/busy");
  const calendar = data.calendars?.[calendarUser()];
  // a calendar Google couldn't read comes back with no busy periods: never treat that as free
  if (!calendar || calendar.errors?.length) throw new Error(`Google Calendar free/busy failed: ${JSON.stringify(calendar?.errors)}`);
  return calendar.busy ?? [];
}

type Meeting = { start: Date; summary: string; description: string; attendees: string[] };

/** Creates the event and returns its Meet link. Throws SlotTakenError if the slot was just booked. */
export async function createMeeting({ start, summary, description, attendees }: Meeting) {
  // One event id per slot, so when two people book the same time Google rejects the second.
  // Letters a-v and digits are what Google allows, which is exactly JavaScript's base 32.
  const id = `demo${(start.getTime() / 1000).toString(32)}`;
  const event = {
    id,
    summary,
    description,
    status: "confirmed",
    start: { dateTime: start.toISOString(), timeZone: DEMO.timeZone },
    end: { dateTime: slotEnd(start).toISOString(), timeZone: DEMO.timeZone },
    attendees: attendees.map((email) => ({ email })),
    conferenceData: { createRequest: { requestId: randomUUID(), conferenceSolutionKey: { type: "hangoutsMeet" } } },
  };
  // the emails are ours (lib/demo/emails.ts), so Google stays quiet
  const query = "?conferenceDataVersion=1&sendUpdates=none";

  let res = await call(`/calendars/primary/events${query}`, { method: "POST", body: event });
  if (res.status === 409) {
    // Google keeps the ids of cancelled events. If that's what holds this id, the slot is free
    // (the caller has just checked), so book it under an id Google picks.
    const existing = await call(`/calendars/primary/events/${id}`);
    const gone = existing.status === 404 || existing.status === 410;
    if (!gone && (await ok(existing, "read")).status !== "cancelled") throw new SlotTakenError();
    const { id: _taken, ...withoutId } = event;
    res = await call(`/calendars/primary/events${query}`, { method: "POST", body: withoutId });
  }
  let created = await ok(res, "create");

  // Google can take a moment to finish making the Meet link
  for (let i = 0; !created.hangoutLink && i < 3; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    created = await ok(await call(`/calendars/primary/events/${created.id}`), "read");
  }
  if (!created.hangoutLink) {
    await call(`/calendars/primary/events/${created.id}?sendUpdates=none`, { method: "DELETE" }).catch(() => {});
    throw new Error("Google Calendar created the event without a Meet link");
  }
  return { meetLink: created.hangoutLink as string };
}
