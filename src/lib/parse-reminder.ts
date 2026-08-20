import { addDays, toDateKey, type Channel, type DayOfWeek, type Repeat } from "./reminders";

export type ParsedReminder = {
  title: string;
  date?: string;
  time?: string;
  repeat?: Repeat;
  customDays?: DayOfWeek[];
  channel?: Channel;
};

const DAYS: Record<string, DayOfWeek> = {
  sunday: 0,
  sun: 0,
  monday: 1,
  mon: 1,
  tuesday: 2,
  tue: 2,
  tues: 2,
  wednesday: 3,
  wed: 3,
  thursday: 4,
  thu: 4,
  thurs: 4,
  friday: 5,
  fri: 5,
  saturday: 6,
  sat: 6,
};

/**
 * Best-effort natural language reading of a reminder line, e.g.
 * "call mom every sunday 6pm" → weekly Sunday 18:00, channel call.
 */
export function parseReminderText(input: string, now: Date = new Date()): ParsedReminder {
  const raw = input.trim();
  const text = raw.toLowerCase();
  const out: ParsedReminder = { title: raw };
  const eaten: string[] = [];

  const eat = (m: RegExpMatchArray | null) => {
    if (m?.[0]) eaten.push(m[0]);
  };

  /* time — "6pm", "6:30 pm", "at 18:00" */
  const time = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/) ?? text.match(/\b(\d{1,2}):(\d{2})\b/);
  if (time) {
    let hours = Number(time[1]);
    const minutes = Number(time[2] ?? 0);
    const suffix = time[3];
    if (suffix === "pm" && hours < 12) hours += 12;
    if (suffix === "am" && hours === 12) hours = 0;
    if (hours <= 23 && minutes <= 59) {
      out.time = `${`${hours}`.padStart(2, "0")}:${`${minutes}`.padStart(2, "0")}`;
      eat(time);
    }
  }

  /* repeat */
  if (/\bevery day\b|\bdaily\b|\beach day\b/.test(text)) {
    out.repeat = "daily";
    eat(text.match(/\bevery day\b|\bdaily\b|\beach day\b/));
  } else if (/\bweekdays?\b|\bevery weekday\b/.test(text)) {
    out.repeat = "weekdays";
    eat(text.match(/\bevery weekday\b|\bweekdays\b/));
  } else if (/\bevery month\b|\bmonthly\b/.test(text)) {
    out.repeat = "monthly";
    eat(text.match(/\bevery month\b|\bmonthly\b/));
  } else if (/\bevery week\b|\bweekly\b/.test(text)) {
    out.repeat = "weekly";
    eat(text.match(/\bevery week\b|\bweekly\b/));
  }

  /* weekday names */
  const dayHits: DayOfWeek[] = [];
  for (const [name, index] of Object.entries(DAYS)) {
    const m = text.match(new RegExp(`\\b${name}s?\\b`));
    if (m) {
      if (!dayHits.includes(index)) dayHits.push(index);
      eaten.push(m[0]);
    }
  }
  if (dayHits.length === 1) {
    const target = dayHits[0]!;
    if (/\bevery\b|\bevery week\b|\bweekly\b|s\b/.test(text)) out.repeat ??= "weekly";
    const delta = (target - now.getDay() + 7) % 7;
    out.date = toDateKey(addDays(now, delta === 0 ? 0 : delta));
    if (out.repeat === "weekly") out.date = toDateKey(addDays(now, delta));
  } else if (dayHits.length > 1) {
    out.repeat = "custom";
    out.customDays = dayHits.sort((a, b) => a - b);
  }

  /* relative dates */
  if (/\btomorrow\b/.test(text)) {
    out.date = toDateKey(addDays(now, 1));
    eaten.push("tomorrow");
  } else if (/\btoday\b|\btonight\b/.test(text)) {
    out.date = toDateKey(now);
    eaten.push(text.includes("tonight") ? "tonight" : "today");
  }

  /* channel */
  if (/\bcall me\b|\bby call\b|\bphone me\b|\bring me\b/.test(text)) {
    out.channel = "call";
    eaten.push(...["call me", "by call", "phone me", "ring me"].filter((p) => text.includes(p)));
  } else if (/\btext me\b|\bmessage me\b/.test(text)) {
    out.channel = "message";
    eaten.push(...["text me", "message me"].filter((p) => text.includes(p)));
  }

  /* title = the line minus the schedule words */
  let title = raw;
  for (const phrase of eaten) {
    title = title.replace(new RegExp(escapeRegex(phrase), "i"), " ");
  }
  title = title
    .replace(/\b(every|each|at|on|by)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (title) out.title = title.charAt(0).toUpperCase() + title.slice(1);

  return out;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
