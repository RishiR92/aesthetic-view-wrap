import { Bell, Check, MessageSquare, Phone, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { parseReminderText } from "@/lib/parse-reminder";
import {
  DAY_LETTERS,
  REPEAT_LABELS,
  addDays,
  asmiLine,
  formatDayLabel,
  formatRelative,
  nextOccurrence,
  parseDateKey,
  timezoneLabel,
  toDateKey,
  type Channel,
  type DayOfWeek,
  type Reminder,
  type Repeat,
} from "@/lib/reminders";
import { Switch } from "@/components/ui/switch";

const REPEATS: Repeat[] = ["none", "daily", "weekdays", "weekly", "monthly", "custom"];
const QUICK_TIMES = ["08:00", "09:00", "12:00", "18:00", "21:00"];
const DAY_ORDER: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

export type ReminderDraft = Omit<Reminder, "id">;

function emptyDraft(prefill?: string): ReminderDraft {
  const now = new Date();
  const base: ReminderDraft = {
    title: "",
    date: toDateKey(now),
    time: "09:00",
    channel: "message",
    repeat: "none",
    status: "active",
  };
  if (!prefill) return base;
  const parsed = parseReminderText(prefill, now);
  return {
    ...base,
    title: parsed.title,
    date: parsed.date ?? base.date,
    time: parsed.time ?? base.time,
    repeat: parsed.repeat ?? base.repeat,
    customDays: parsed.customDays,
    channel: parsed.channel ?? base.channel,
  };
}

export function ReminderSheet({
  open,
  reminder,
  prefill,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  /** editing an existing reminder, or undefined to create a new one */
  reminder?: Reminder | undefined;
  prefill?: string | undefined;
  onClose: () => void;
  onSave: (draft: ReminderDraft) => void;
  onDelete?: ((reminder: Reminder) => void) | undefined;
}) {
  const [draft, setDraft] = useState<ReminderDraft>(() => emptyDraft(prefill));
  const [quickText, setQuickText] = useState("");

  useEffect(() => {
    if (!open) return;
    setQuickText("");
    setDraft(reminder ? { ...reminder } : emptyDraft(prefill));
  }, [open, reminder, prefill]);

  const set = <K extends keyof ReminderDraft>(key: K, value: ReminderDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const next = useMemo(() => (open ? nextOccurrence(draft) : null), [draft, open]);
  const canSave = draft.title.trim().length > 0 && (draft.repeat !== "custom" || (draft.customDays?.length ?? 0) > 0);

  const applyQuickText = () => {
    const text = quickText.trim();
    if (!text) return;
    const parsed = parseReminderText(text);
    setDraft((d) => ({
      ...d,
      title: parsed.title || d.title,
      date: parsed.date ?? d.date,
      time: parsed.time ?? d.time,
      repeat: parsed.repeat ?? d.repeat,
      customDays: parsed.customDays ?? d.customDays,
      channel: parsed.channel ?? d.channel,
    }));
    setQuickText("");
  };

  const toggleDay = (day: DayOfWeek) => {
    const days = draft.customDays ?? [];
    set("customDays", days.includes(day) ? days.filter((d) => d !== day) : [...days, day].sort((a, b) => a - b));
  };

  if (!open) return null;

  const dateChips: { label: string; value: string }[] = [
    { label: "Today", value: toDateKey(new Date()) },
    { label: "Tomorrow", value: toDateKey(addDays(new Date(), 1)) },
    { label: "Next week", value: toDateKey(addDays(new Date(), 7)) },
  ];

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-label={reminder ? "Edit reminder" : "New reminder"}
        className="relative flex max-h-[92%] flex-col rounded-t-[28px] border-t border-border/60 bg-card shadow-[var(--shadow-lift)]"
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            {reminder ? "Edit reminder" : "New reminder"}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 pb-4">
          {/* natural language */}
          <div className="rounded-2xl border border-border/70 bg-secondary/50 p-3">
            <label htmlFor="quick" className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" strokeWidth={2} />
              Type it how you'd say it
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="quick"
                value={quickText}
                onChange={(e) => setQuickText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyQuickText();
                  }
                }}
                placeholder="call mom every Sunday 6pm"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground/70"
              />
              <button
                type="button"
                onClick={applyQuickText}
                disabled={!quickText.trim()}
                className="shrink-0 rounded-full bg-primary/20 px-3 py-1.5 text-[12px] font-semibold text-primary disabled:opacity-40"
              >
                Fill
              </button>
            </div>
          </div>

          {/* title */}
          <div>
            <label htmlFor="title" className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Remind me to
            </label>
            <input
              id="title"
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Take evening meds"
              autoComplete="off"
              className="mt-2 w-full border-b border-border/70 bg-transparent pb-2 text-[20px] font-semibold text-foreground outline-none transition-colors focus:border-primary placeholder:font-normal placeholder:text-muted-foreground/70"
            />
          </div>

          {/* date */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {draft.repeat === "none" ? "Date" : "Starting"}
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {dateChips.map((chip) => (
                <Chip key={chip.value} active={draft.date === chip.value} onClick={() => set("date", chip.value)}>
                  {chip.label}
                </Chip>
              ))}
              <label className="relative inline-flex">
                <Chip active={!dateChips.some((c) => c.value === draft.date)}>
                  {dateChips.some((c) => c.value === draft.date)
                    ? "Other date"
                    : formatDayLabel(parseDateKey(draft.date))}
                </Chip>
                <input
                  type="date"
                  value={draft.date}
                  onChange={(e) => e.target.value && set("date", e.target.value)}
                  aria-label="Pick a date"
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
            </div>
          </div>

          {/* time */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Time</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {QUICK_TIMES.map((t) => (
                <Chip key={t} active={draft.time === t} onClick={() => set("time", t)}>
                  {label12(t)}
                </Chip>
              ))}
              <label className="relative inline-flex">
                <Chip active={!QUICK_TIMES.includes(draft.time)}>
                  {QUICK_TIMES.includes(draft.time) ? "Other time" : label12(draft.time)}
                </Chip>
                <input
                  type="time"
                  value={draft.time}
                  onChange={(e) => e.target.value && set("time", e.target.value)}
                  aria-label="Pick a time"
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
            </div>
          </div>

          {/* repeat */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Repeat</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {REPEATS.map((r) => (
                <Chip key={r} active={draft.repeat === r} onClick={() => set("repeat", r)}>
                  {REPEAT_LABELS[r]}
                </Chip>
              ))}
            </div>
            {draft.repeat === "custom" ? (
              <div className="mt-3 flex gap-2">
                {DAY_ORDER.map((day) => {
                  const active = draft.customDays?.includes(day) ?? false;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      aria-pressed={active}
                      className={`size-9 rounded-full text-[13px] font-semibold transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {DAY_LETTERS[day]}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* channel */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              How Asmi reaches you
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <ChannelOption
                active={draft.channel === "message"}
                onClick={() => set("channel", "message")}
                icon={<MessageSquare className="size-4" strokeWidth={1.75} />}
                label="Message"
                hint="A text nudge"
              />
              <ChannelOption
                active={draft.channel === "call"}
                onClick={() => set("channel", "call")}
                icon={<Phone className="size-4" strokeWidth={1.75} />}
                label="Call"
                hint="Asmi rings you"
              />
            </div>
          </div>

          {/* note */}
          <div>
            <label htmlFor="note" className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Note <span className="font-medium normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id="note"
              value={draft.note ?? ""}
              onChange={(e) => set("note", e.target.value)}
              placeholder="Anything Asmi should mention"
              className="mt-2 w-full rounded-2xl border border-border/70 bg-secondary/40 px-3 py-2.5 text-[14px] text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/70"
            />
          </div>

          {reminder ? (
            <div className="space-y-3 border-t border-border/60 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-foreground">Reminder is on</span>
                <Switch
                  checked={draft.status === "active"}
                  onCheckedChange={(on) => set("status", on ? "active" : "paused")}
                  aria-label="Reminder on"
                />
              </div>
              {onDelete ? (
                <button
                  type="button"
                  onClick={() => onDelete(reminder)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border/70 py-3 text-[14px] font-semibold text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive"
                >
                  <Trash2 className="size-4" strokeWidth={1.75} />
                  Delete reminder
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* asmi summary + save */}
        <div className="shrink-0 border-t border-border/60 px-5 pb-5 pt-4">
          <div className="rounded-2xl bg-cream px-4 py-3">
            <p className="flex items-start gap-2 text-[13.5px] font-medium leading-snug text-cream-foreground">
              <Bell className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
              <span>
                {draft.title.trim() ? asmiLine(draft) : "Tell me what to remind you about."}
                {next ? (
                  <span className="mt-0.5 block text-[12px] font-normal text-cream-foreground/70">
                    First one {formatRelative(next)} · {timezoneLabel()}
                  </span>
                ) : null}
              </span>
            </p>
          </div>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => onSave({ ...draft, title: draft.title.trim() })}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-cta py-4 text-[15px] font-semibold text-cta-foreground transition-transform active:scale-[0.99] disabled:opacity-40"
          >
            <Check className="size-4" strokeWidth={2.5} />
            {reminder ? "Save changes" : "Set reminder"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean | undefined;
  onClick?: (() => void) | undefined;
  children: React.ReactNode;
}) {
  return (
    <span
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-pressed={onClick ? active : undefined}
      className={`cursor-pointer select-none rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "border border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </span>
  );
}

function ChannelOption({
  active,
  onClick,
  icon,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-2xl px-3 py-3 text-left transition-colors ${
        active ? "bg-primary/15 ring-1 ring-primary" : "border border-border/70 hover:border-border"
      }`}
    >
      <span className={`flex items-center gap-2 text-[14px] font-semibold ${active ? "text-primary" : "text-foreground"}`}>
        {icon}
        {label}
      </span>
      <span className="mt-0.5 block text-[12px] text-muted-foreground">{hint}</span>
    </button>
  );
}

function label12(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h ?? 0, m ?? 0, 0, 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export { emptyDraft };
