// When customers can book a demo. Change the rules here; the picker and the booking API both
// follow them. Oman has no daylight saving, so a fixed UTC offset is safe.
export const DEMO = {
  timeZone: "Asia/Muscat",
  utcOffsetHours: 4,
  workingDays: [0, 1, 2, 3, 4], // Sunday to Thursday
  startHour: 9,
  endHour: 17,
  minutes: 30,
  noticeHours: 4,
  daysAhead: 30,
};

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

/** Every slot the rules allow from now on, busy or not. */
export function candidateSlots(now = new Date()): Date[] {
  const offset = DEMO.utcOffsetHours * HOUR;
  const earliest = now.getTime() + DEMO.noticeHours * HOUR;
  const today = new Date(now.getTime() + offset);
  const slots: Date[] = [];
  for (let d = 0; d <= DEMO.daysAhead; d++) {
    const day = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + d);
    if (!DEMO.workingDays.includes(new Date(day).getUTCDay())) continue;
    for (let m = DEMO.startHour * 60; m + DEMO.minutes <= DEMO.endHour * 60; m += DEMO.minutes) {
      const start = day + m * MINUTE - offset;
      if (start >= earliest) slots.push(new Date(start));
    }
  }
  return slots;
}

export const slotEnd = (start: Date) => new Date(start.getTime() + DEMO.minutes * MINUTE);

/** The slots that don't overlap any of the busy periods. */
export function freeSlots(slots: Date[], busy: { start: string; end: string }[]) {
  const periods = busy.map((b) => [Date.parse(b.start), Date.parse(b.end)]);
  return slots.filter((s) => !periods.some(([from, to]) => s.getTime() < to && slotEnd(s).getTime() > from));
}
