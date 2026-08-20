import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageSquare,
  Phone,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  DAY_LETTERS,
  REPEAT_LABELS,
  addDays,
  formatDayLabel,
  parseDateKey,
  toDateKey,
  type DayOfWeek,
  type Reminder,
  type Repeat,
} from "@/lib/reminders";
import { Switch } from "@/components/ui/switch";

const REPEATS: Repeat[] = ["none", "daily", "weekdays", "weekly", "monthly", "custom"];
const DAY_ORDER: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

export type ReminderDraft = Omit<Reminder, "id">;

function emptyDraft(): ReminderDraft {
  const now = new Date();
  return {
    title: "",
    date: toDateKey(now),
    time: "",
    channel: "message",
    repeat: "none",
    status: "active",
  };
}

export function ReminderSheet({
  open,
  reminder,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  /** editing an existing reminder, or undefined to create a new one */
  reminder?: Reminder | undefined;
  onClose: () => void;
  onSave: (draft: ReminderDraft) => void;
  onDelete?: ((reminder: Reminder) => void) | undefined;
}) {
  const [draft, setDraft] = useState<ReminderDraft>(() => emptyDraft());

  useEffect(() => {
    if (!open) return;
    setDraft(reminder ? { ...reminder } : emptyDraft());
  }, [open, reminder]);

  const set = <K extends keyof ReminderDraft>(key: K, value: ReminderDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const canSave =
    draft.title.trim().length > 0 &&
    draft.time.length > 0 &&
    (draft.repeat !== "custom" || (draft.customDays?.length ?? 0) > 0);

  const toggleDay = (day: DayOfWeek) => {
    const days = draft.customDays ?? [];
    set("customDays", days.includes(day) ? days.filter((d) => d !== day) : [...days, day].sort((a, b) => a - b));
  };

  if (!open) return null;

  const dateChips: { label: string; value: string }[] = [
    { label: "Today", value: toDateKey(new Date()) },
    { label: "Tomorrow", value: toDateKey(addDays(new Date(), 1)) },
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
            <div className="mt-2 grid grid-cols-2 gap-2">
              {dateChips.map((chip) => (
                <Chip key={chip.value} active={draft.date === chip.value} onClick={() => set("date", chip.value)}>
                  {chip.label}
                </Chip>
              ))}
            </div>
            <PickerField
              icon={<CalendarDays className="size-[18px]" strokeWidth={1.9} />}
              label="Pick a date"
              display={formatDayLabel(parseDateKey(draft.date))}
              type="date"
              value={draft.date}
              onChange={(v) => set("date", v)}
            />
          </div>

          {/* time */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Time</span>
            <PickerField
              icon={<Clock className="size-[18px]" strokeWidth={1.9} />}
              label="Pick a time"
              display={label12(draft.time)}
              type="time"
              value={draft.time}
              onChange={(v) => set("time", v)}
            />
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

        <div className="shrink-0 border-t border-border/60 px-5 pb-5 pt-4">
          <button
            type="button"
            disabled={!canSave}
            onClick={() => onSave({ ...draft, title: draft.title.trim() })}
            className="cta-fill flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-semibold transition-transform active:scale-[0.99] disabled:opacity-40"
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
      className={`cursor-pointer select-none rounded-full px-3.5 py-3 text-center text-[14px] font-semibold transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "border border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </span>
  );
}

function PickerField({
  icon,
  label,
  display,
  type,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  display: string;
  type: "date" | "time";
  value: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const open = () => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const withPicker = el as HTMLInputElement & { showPicker?: () => void };
    try {
      withPicker.showPicker?.();
    } catch {
      el.click();
    }
  };

  return (
    <button
      type="button"
      onClick={open}
      className="relative mt-2 flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-border/70 bg-secondary/40 px-4 py-4 text-left transition-colors active:bg-secondary/70"
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-[17px] font-semibold text-foreground">{display}</span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" strokeWidth={2} />
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        aria-label={label}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        tabIndex={-1}
      />
    </button>
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
