import { MessageSquare, Phone, Repeat2 } from "lucide-react";

import {
  formatRelative,
  formatTime,
  scheduleSummary,
  type Reminder,
} from "@/lib/reminders";
import { Switch } from "@/components/ui/switch";

export function ReminderRow({
  reminder,
  next,
  onEdit,
  onToggle,
}: {
  reminder: Reminder;
  next: Date | null;
  onEdit: () => void;
  onToggle: () => void;
}) {
  const off = reminder.status === "paused";
  const Icon = reminder.channel === "call" ? Phone : MessageSquare;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit();
        }
      }}
      className={`flex cursor-pointer items-center gap-3 rounded-2xl bg-raised px-4 py-3.5 backdrop-blur-md transition-all active:scale-[0.99] ${
        off ? "opacity-55" : ""
      }`}
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
          off ? "bg-secondary text-muted-foreground" : "bg-primary/18 text-primary"
        }`}
      >
        <Icon className="size-4" strokeWidth={1.9} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-foreground">{reminder.title}</p>
        <p className="mt-0.5 flex items-center gap-1.5 truncate text-[12.5px] text-muted-foreground">
          {reminder.repeat !== "none" ? <Repeat2 className="size-3.5 shrink-0" strokeWidth={1.9} /> : null}
          {scheduleSummary(reminder)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        {next && !off ? (
          <>
            <span className="text-[13px] font-semibold text-primary">{formatTime(next)}</span>
            <span className="text-[11px] text-muted-foreground">{formatRelative(next)}</span>
          </>
        ) : (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Off</span>
        )}
      </div>

      <span onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
        <Switch
          checked={!off}
          onCheckedChange={onToggle}
          aria-label={`${reminder.title} is ${off ? "off" : "on"}`}
        />
      </span>
    </div>
  );
}
