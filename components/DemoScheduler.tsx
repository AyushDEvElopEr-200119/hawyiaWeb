"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/core";

export type SchedulerLabels = Record<
  "choose" | "loading" | "zone" | "previous" | "next" | "pickDay" | "unavailable" | "booked" | "join" | "emailed" | "notEmailed",
  string
>;

type Reply = { ok: boolean; status: number; meetLink?: string; slot?: string; emailed?: boolean };
type Load = "loading" | "ready" | "off";

const dayKey = (d: Date, timeZone: string) => new Intl.DateTimeFormat("en-CA", { timeZone }).format(d);
const SUNDAY = Date.UTC(2023, 0, 1);
const DAY = 86_400_000;

/**
 * The date and time picker inside the demo form. It only fills in the hidden "slot" field;
 * initSite validates and sends the form, and tells this component the result with a "lead:reply"
 * event. If times can't be loaded, it clears the form's endpoint, so the form opens an email
 * draft as it does without booking.
 */
export function DemoScheduler({ id, lang, labels }: { id: string; lang: Locale; labels: SchedulerLabels }) {
  const [slots, setSlots] = useState<Date[]>([]);
  const [load, setLoad] = useState<Load>("loading");
  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState("");
  const [slot, setSlot] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [booked, setBooked] = useState<Reply | null>(null);
  const [email, setEmail] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const fetchSlots = useCallback(async () => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimeZone(zone);
    const form = root.current?.closest("form");
    try {
      const res = await fetch("/api/demo/slots/", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const free: Date[] = (await res.json()).slots.map((s: string) => new Date(s));
      if (!free.length) throw new Error("no times");
      setSlots(free);
      setMonth((m) => m || dayKey(free[0], zone).slice(0, 7));
      setLoad("ready");
    } catch {
      if (form) form.dataset.endpoint = "";
      setLoad("off");
    }
  }, []);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  // initSite re-checks the field when it hears this, which clears the "choose a time" error
  useEffect(() => { if (slot) input.current?.dispatchEvent(new Event("input", { bubbles: true })); }, [slot]);

  useEffect(() => {
    const form = root.current?.closest("form");
    if (!form) return;
    const onReply = (e: Event) => {
      const reply = (e as CustomEvent<Reply>).detail;
      if (reply.ok && reply.meetLink) {
        setEmail((form.elements.namedItem("email") as HTMLInputElement).value);
        setBooked(reply);
        form.classList.add("is-booked");
        root.current?.scrollIntoView({ block: "center" });
      } else if (reply.status === 409) {
        setSlot("");
        setDay("");
        fetchSlots();
      }
    };
    form.addEventListener("lead:reply", onReply);
    return () => form.removeEventListener("lead:reply", onReply);
  }, [fetchSlots]);

  const byDay = useMemo(() => {
    const days = new Map<string, Date[]>();
    for (const s of slots) {
      const k = dayKey(s, timeZone || "UTC");
      days.set(k, [...(days.get(k) ?? []), s]);
    }
    return days;
  }, [slots, timeZone]);

  const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(lang, { timeZone: timeZone || undefined, ...o });

  if (booked) {
    const start = new Date(booked.slot!);
    return (
      <div className="f full scheduler" ref={root}>
        <div className="sched-done" role="status">
          <h2>{labels.booked}</h2>
          <p className="sched-when">{fmt({ dateStyle: "full" }).format(start)}, {fmt({ timeStyle: "short" }).format(start)}</p>
          <p className="sched-zone">{labels.zone} {timeZone}</p>
          <a className="btn-pill press" href={booked.meetLink} target="_blank" rel="noopener noreferrer">{labels.join}</a>
          <p className="sched-zone">{booked.emailed ? `${labels.emailed} ${email}` : labels.notEmailed}</p>
        </div>
      </div>
    );
  }

  const [year, mon] = (month || "2000-01").split("-").map(Number);
  const firstUtc = Date.UTC(year, mon - 1, 1);
  const lead = new Date(firstUtc).getUTCDay();
  const total = new Date(Date.UTC(year, mon, 0)).getUTCDate();
  const months = [...new Set([...byDay.keys()].map((k) => k.slice(0, 7)))];
  const utcFmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(lang, { timeZone: "UTC", ...o });

  return (
    <div className="f full scheduler" ref={root}>
      <span className="sched-label" id={`${id}-slot-label`}>{labels.choose}</span>
      <input type="hidden" name="slot" value={slot} ref={input} aria-labelledby={`${id}-slot-label`} />
      <input type="hidden" name="timeZone" value={timeZone} />
      {/* people never see this; bots that fill in every field are turned away */}
      <input className="sched-trap" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {load === "loading" && <p className="sched-note" role="status">{labels.loading}</p>}
      {load === "off" && <p className="sched-note">{labels.unavailable}</p>}

      {load === "ready" && (
        <div className="sched-body">
          <div className="sched-cal">
            <div className="sched-head">
              <button type="button" className="sched-nav" aria-label={labels.previous} disabled={months.indexOf(month) <= 0} onClick={() => setMonth(months[months.indexOf(month) - 1])}><span aria-hidden="true">‹</span></button>
              <b>{utcFmt({ month: "long", year: "numeric" }).format(firstUtc)}</b>
              <button type="button" className="sched-nav" aria-label={labels.next} disabled={months.indexOf(month) >= months.length - 1} onClick={() => setMonth(months[months.indexOf(month) + 1])}><span aria-hidden="true">›</span></button>
            </div>
            <div className="sched-grid">
              {Array.from({ length: 7 }, (_, i) => <span key={i} className="sched-dow">{utcFmt({ weekday: "narrow" }).format(SUNDAY + i * DAY)}</span>)}
              {Array.from({ length: lead }, (_, i) => <span key={`gap${i}`} />)}
              {Array.from({ length: total }, (_, i) => {
                const k = `${month}-${String(i + 1).padStart(2, "0")}`;
                return (
                  <button
                    key={k} type="button" className="sched-day" disabled={!byDay.has(k)} aria-pressed={day === k}
                    aria-label={utcFmt({ dateStyle: "full" }).format(firstUtc + i * DAY)}
                    onClick={() => { setDay(k); setSlot(""); }}
                  >{utcFmt({ day: "numeric" }).format(firstUtc + i * DAY)}</button>
                );
              })}
            </div>
          </div>
          <div className="sched-times">
            {!day && <p className="sched-note">{labels.pickDay}</p>}
            {day && (
              <div className="sched-time-list">
                {(byDay.get(day) ?? []).map((s) => (
                  <button key={s.toISOString()} type="button" className="sched-time" aria-pressed={slot === s.toISOString()} onClick={() => setSlot(s.toISOString())}>
                    {fmt({ timeStyle: "short" }).format(s)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="sched-zone">{labels.zone} {timeZone}</p>
        </div>
      )}
      <small className="err" aria-live="polite" />
    </div>
  );
}
