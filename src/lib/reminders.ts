export type Channel = "message" | "call";
export type Repeat = "none" | "daily" | "weekdays" | "weekly" | "monthly" | "custom";
export type Status = "active" | "paused";
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Reminder = {
  id: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm 24h */
  time: string;
  channel: Channel;
  repeat: Repeat;
  customDays?: DayOfWeek[];
  status: Status;
  note?: string;
  /** date keys the user skipped once */
  skipped?: string[];
};

export type HistoryEntry = {
  id: string;
  title: string;
  /** ISO timestamp */
  at: string;
  channel: Channel;
  outcome: "delivered" | "missed" | "skipped";
  message: string;
};

export const REPEAT_LABELS: Record<Repeat, string> = {
  none: "Once",
  daily: "Daily",
  weekdays: "Weekdays",
  weekly: "Weekly",
  monthly: "Monthly",
  custom: "Custom",
};

export const DAY_LETTERS: Record<DayOfWeek, string> = {
  0: "S",
  1: "M",
  2: "T",
  3: "W",
  4: "T",
  5: "F",
  6: "S",
};

export const DAY_NAMES: Record<DayOfWeek, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export const CHANNEL_LABELS: Record<Channel, string> = {
  message: "Message",
  call: "Phone call",
};

/* ---------------------------------- dates --------------------------------- */

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, "0")}-${`${d.getDate()}`.padStart(2, "0")}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function combine(dateKey: string, time: string): Date {
  const base = parseDateKey(dateKey);
  const [h, min] = time.split(":").map(Number);
  base.setHours(h ?? 0, min ?? 0, 0, 0);
  return base;
}

export function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

export function timezoneLabel(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "local time";
  } catch {
    return "local time";
  }
}

/* ------------------------------- occurrences ------------------------------ */

function matchesRepeat(candidate: Date, start: Date, r: Repeat, days: DayOfWeek[] = []): boolean {
  switch (r) {
    case "none":
      return toDateKey(candidate) === toDateKey(start);
    case "daily":
      return true;
    case "weekdays": {
      const day = candidate.getDay();
      return day >= 1 && day <= 5;
    }
    case "weekly":
      return candidate.getDay() === start.getDay();
    case "monthly":
      return candidate.getDate() === start.getDate();
    case "custom":
      return days.length > 0 && days.includes(candidate.getDay() as DayOfWeek);
  }
}

type Schedule = Pick<Reminder, "date" | "time" | "repeat" | "customDays"> & { skipped?: string[] };

export function nextOccurrences(reminder: Schedule, count = 3, from: Date = new Date()): Date[] {
  const start = combine(reminder.date, reminder.time);
  const out: Date[] = [];
  let cursor = start > from ? new Date(start) : new Date(from);
  cursor.setHours(0, 0, 0, 0);

  for (let i = 0; i < 400 && out.length < count; i++) {
    const key = toDateKey(cursor);
    const candidate = combine(key, reminder.time);
    if (
      candidate >= from &&
      candidate >= start &&
      !reminder.skipped?.includes(key) &&
      matchesRepeat(candidate, start, reminder.repeat, reminder.customDays)
    ) {
      out.push(candidate);
    }
    cursor = addDays(cursor, 1);
    if (reminder.repeat === "none" && out.length > 0) break;
  }
  return out;
}

export function nextOccurrence(reminder: Schedule, from: Date = new Date()): Date | null {
  return nextOccurrences(reminder, 1, from)[0] ?? null;
}

/* -------------------------------- formatting ------------------------------ */

const timeFmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

export function formatTime(d: Date): string {
  return timeFmt.format(d);
}

export function formatTimeString(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h ?? 0, m ?? 0, 0, 0);
  return timeFmt.format(d);
}

export function formatDayLabel(d: Date, now: Date = new Date()): string {
  const key = toDateKey(d);
  if (key === toDateKey(now)) return "Today";
  if (key === toDateKey(addDays(now, 1))) return "Tomorrow";
  const sameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

export function formatRelative(target: Date, now: Date = new Date()): string {
  const ms = target.getTime() - now.getTime();
  if (ms <= 0) return "now";
  const min = Math.round(ms / 60000);
  if (min < 60) return `in ${min} min`;
  const hours = Math.round(min / 60);
  if (hours < 24) return `in ${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `in ${days} day${days === 1 ? "" : "s"}`;
  const months = Math.round(days / 30);
  return `in ${months} month${months === 1 ? "" : "s"}`;
}

export function formatCustomDays(days: DayOfWeek[]): string {
  if (days.length === 0) return "no days";
  const sorted = [...days].sort((a, b) => a - b);
  if (sorted.length === 7) return "every day";
  if (sorted.length === 5 && sorted.every((d, i) => d === i + 1)) return "weekdays";
  return sorted.map((d) => DAY_NAMES[d].slice(0, 3)).join(", ");
}

/** "Every Sunday at 6:00 PM" */
export function scheduleSummary(r: Schedule, now: Date = new Date()): string {
  const time = formatTimeString(r.time);
  const start = parseDateKey(r.date);
  switch (r.repeat) {
    case "none":
      return `${formatDayLabel(start, now)} at ${time}`;
    case "daily":
      return `Every day at ${time}`;
    case "weekdays":
      return `Weekdays at ${time}`;
    case "weekly":
      return `Every ${DAY_NAMES[start.getDay() as DayOfWeek]} at ${time}`;
    case "monthly":
      return `Monthly on the ${ordinal(start.getDate())} at ${time}`;
    case "custom":
      return `${capitalize(formatCustomDays(r.customDays ?? []))} at ${time}`;
  }
}

/** Asmi's voice: "I'll text you every day at 9:00 AM." */
export function asmiLine(r: Schedule & { channel: Channel }, now: Date = new Date()): string {
  const verb = r.channel === "call" ? "call you" : "text you";
  return `I'll ${verb} ${lowerFirst(scheduleSummary(r, now))}.`;
}

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/* -------------------------------- grouping -------------------------------- */

export type Group = { key: string; label: string; items: { reminder: Reminder; next: Date | null }[] };

export function groupReminders(reminders: Reminder[], now: Date = new Date()): Group[] {
  const today: Group = { key: "today", label: "Today", items: [] };
  const tomorrow: Group = { key: "tomorrow", label: "Tomorrow", items: [] };
  const later: Group = { key: "later", label: "Later", items: [] };
  const paused: Group = { key: "paused", label: "Turned off", items: [] };

  const todayKey = toDateKey(now);
  const tomorrowKey = toDateKey(addDays(now, 1));

  for (const reminder of reminders) {
    const next = nextOccurrence(reminder, now);
    const entry = { reminder, next };
    if (reminder.status === "paused") {
      paused.items.push(entry);
      continue;
    }
    if (!next) {
      later.items.push(entry);
      continue;
    }
    const key = toDateKey(next);
    if (key === todayKey) today.items.push(entry);
    else if (key === tomorrowKey) tomorrow.items.push(entry);
    else later.items.push(entry);
  }

  const byTime = (a: { next: Date | null }, b: { next: Date | null }) =>
    (a.next?.getTime() ?? Infinity) - (b.next?.getTime() ?? Infinity);

  return [today, tomorrow, later, paused]
    .map((g) => ({ ...g, items: g.items.sort(byTime) }))
    .filter((g) => g.items.length > 0);
}

/** The message Asmi will send when this reminder fires. */
export function previewMessage(r: Pick<Reminder, "title" | "note">): string {
  return r.note?.trim() ? `${r.title} — ${r.note.trim()}` : `Time to ${lowerFirst(r.title)}.`;
}
