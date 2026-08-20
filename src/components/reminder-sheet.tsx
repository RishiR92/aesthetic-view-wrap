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
    time: "09:00",
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
  const [openPicker, setOpenPicker] = useState<"date" | "time" | null>(null);

  useEffect(() => {
    if (!open) return;
    setDraft(reminder ? { ...reminder } : emptyDraft());
    setOpenPicker(null);
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
            <FieldRow
              icon={<CalendarDays className="size-[18px]" strokeWidth={1.9} />}
              label="Date"
              display={formatDayLabel(parseDateKey(draft.date))}
              expanded={openPicker === "date"}
              onClick={() => setOpenPicker(openPicker === "date" ? null : "date")}
            />
            {openPicker === "date" ? (
              <MonthCalendar
                value={draft.date}
                onSelect={(v) => {
                  set("date", v);
                  setOpenPicker(null);
                }}
              />
            ) : null}
          </div>

          {/* time */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Time</span>
            <FieldRow
              icon={<Clock className="size-[18px]" strokeWidth={1.9} />}
              label="Time"
              display={label12(draft.time || "09:00")}
              expanded={openPicker === "time"}
              onClick={() => {
                if (openPicker === "time") {
                  setOpenPicker(null);
                  return;
                }
                if (!draft.time) set("time", "09:00");
                setOpenPicker("time");
              }}
            />
            {openPicker === "time" ? (
              <TimeWheel value={draft.time || "09:00"} onChange={(v) => set("time", v)} />
            ) : null}
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

function FieldRow({
  icon,
  label,
  display,
  expanded,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  display: string;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className={`mt-2 flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
        expanded ? "border-primary/70 bg-primary/12" : "border-border/70 bg-secondary/40 active:bg-secondary/70"
      }`}
    >
      <span className={expanded ? "text-primary" : "text-muted-foreground"}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-[17px] font-semibold text-foreground">{display}</span>
      </span>
      <ChevronRight
        className={`size-4 shrink-0 transition-transform ${expanded ? "rotate-90 text-primary" : "text-muted-foreground"}`}
        strokeWidth={2}
      />
    </button>
  );
}

const WEEKDAY_HEAD = ["S", "M", "T", "W", "T", "F", "S"];

function MonthCalendar({ value, onSelect }: { value: string; onSelect: (dateKey: string) => void }) {
  const selected = parseDateKey(value);
  const [cursor, setCursor] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1));

  const today = new Date();
  const todayKey = toDateKey(today);
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: first.getDay() }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)),
  ];

  const shift = (delta: number) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));

  return (
    <div className="pointer-events-auto mt-2 rounded-2xl border border-border/60 bg-secondary/30 p-3">
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => shift(-1)}
          aria-label="Previous month"
          className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
        >
          <ChevronLeft className="size-4" strokeWidth={2} />
        </button>
        <span className="text-[14px] font-semibold text-foreground">
          {cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
        <button
          type="button"
          onClick={() => shift(1)}
          aria-label="Next month"
          className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
        >
          <ChevronRight className="size-4" strokeWidth={2} />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-y-1">
        {WEEKDAY_HEAD.map((d, i) => (
          <span key={i} className="text-center text-[11px] font-bold uppercase text-muted-foreground/70">
            {d}
          </span>
        ))}
        {cells.map((date, i) => {
          if (!date) return <span key={`e${i}`} />;
          const key = toDateKey(date);
          const isSelected = key === value;
          const isToday = key === todayKey;
          const isPast = key < todayKey;
          return (
            <button
              key={key}
              type="button"
              disabled={isPast}
              onClick={() => onSelect(key)}
              aria-pressed={isSelected}
              className={`relative mx-auto grid size-10 place-items-center rounded-full text-[14px] font-semibold transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isPast
                    ? "text-muted-foreground/35"
                    : "text-foreground hover:bg-secondary/70"
              }`}
            >
              {date.getDate()}
              {isToday && !isSelected ? (
                <span className="absolute bottom-1.5 size-1 rounded-full bg-primary" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const ITEM_H = 44;
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);
const MERIDIEMS = ["AM", "PM"];

function TimeWheel({ value, onChange }: { value: string; onChange: (time: string) => void }) {
  const [h24, minute] = value.split(":").map(Number);
  const hour24 = h24 ?? 9;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const meridiem = hour24 >= 12 ? "PM" : "AM";
  const nearestMinute = MINUTES.reduce(
    (best, m) => (Math.abs(m - (minute ?? 0)) < Math.abs(best - (minute ?? 0)) ? m : best),
    0,
  );

  const emit = (nextHour12: number, nextMinute: number, nextMeridiem: string) => {
    const h = nextMeridiem === "PM" ? (nextHour12 % 12) + 12 : nextHour12 % 12;
    onChange(`${String(h).padStart(2, "0")}:${String(nextMinute).padStart(2, "0")}`);
  };

  return (
    <div className="relative mt-2 overflow-hidden rounded-2xl border border-border/60 bg-secondary/30">
      <div className="pointer-events-none absolute inset-x-3 top-1/2 h-11 -translate-y-1/2 rounded-xl bg-primary/18 ring-1 ring-primary/40" />
      <div className="relative flex justify-center gap-2 px-3">
        <Wheel
          items={HOURS.map((h) => ({ value: String(h), label: String(h) }))}
          selected={String(hour12)}
          onSelect={(v) => emit(Number(v), nearestMinute, meridiem)}
          ariaLabel="Hour"
        />
        <span className="self-center text-[18px] font-semibold text-muted-foreground">:</span>
        <Wheel
          items={MINUTES.map((m) => ({ value: String(m), label: String(m).padStart(2, "0") }))}
          selected={String(nearestMinute)}
          onSelect={(v) => emit(hour12, Number(v), meridiem)}
          ariaLabel="Minute"
        />
        <Wheel
          items={MERIDIEMS.map((m) => ({ value: m, label: m }))}
          selected={meridiem}
          onSelect={(v) => emit(hour12, nearestMinute, v)}
          ariaLabel="AM or PM"
        />
      </div>
    </div>
  );
}

function Wheel({
  items,
  selected,
  onSelect,
  ariaLabel,
}: {
  items: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
  ariaLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const index = Math.max(items.findIndex((i) => i.value === selected), 0);
    if (Math.round(el.scrollTop / ITEM_H) === index) return;
    el.scrollTo({ top: index * ITEM_H, behavior: el.scrollTop === 0 ? "auto" : "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const handleScroll = () => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) window.clearTimeout(frame.current);
    frame.current = window.setTimeout(() => {
      const index = Math.min(items.length - 1, Math.max(0, Math.round(el.scrollTop / ITEM_H)));
      const item = items[index];
      if (item && item.value !== selected) onSelect(item.value);
    }, 90);
  };

  return (
    <div
      ref={ref}
      role="listbox"
      aria-label={ariaLabel}
      onScroll={handleScroll}
      className="h-[176px] w-14 snap-y snap-mandatory overflow-y-auto scroll-smooth py-[66px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map((item) => {
        const active = item.value === selected;
        return (
          <button
            key={item.value}
            type="button"
            role="option"
            aria-selected={active}
            onClick={() => {
              const el = ref.current;
              const index = items.findIndex((i) => i.value === item.value);
              el?.scrollTo({ top: index * ITEM_H, behavior: "smooth" });
              onSelect(item.value);
            }}
            className={`flex h-11 w-full snap-center items-center justify-center text-[19px] tabular-nums transition-all ${
              active ? "font-bold text-foreground" : "font-medium text-muted-foreground/60"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
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
