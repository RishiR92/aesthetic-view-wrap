import type { HistoryEntry } from "@/lib/reminders";

const STYLES: Record<HistoryEntry["outcome"], string> = {
  delivered: "bg-primary/18 text-primary",
  missed: "border border-border text-muted-foreground",
  skipped: "border border-dashed border-border text-muted-foreground",
};

const LABELS: Record<HistoryEntry["outcome"], string> = {
  delivered: "Delivered",
  missed: "Missed",
  skipped: "Skipped",
};

export function OutcomeChip({ outcome }: { outcome: HistoryEntry["outcome"] }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${STYLES[outcome]}`}
    >
      {LABELS[outcome]}
    </span>
  );
}
