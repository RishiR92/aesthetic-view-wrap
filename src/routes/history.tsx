import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Phone } from "lucide-react";

import { OutcomeChip } from "@/components/outcome-chip";
import { SectionHeader } from "@/components/section-header";
import { TopBar } from "@/components/top-bar";
import { formatDayLabel, formatTime } from "@/lib/reminders";
import { useReminders } from "@/lib/reminders-store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Asmi" },
      {
        name: "description",
        content: "Every reminder Asmi has delivered, missed, or skipped, with the exact message sent.",
      },
      { property: "og:title", content: "History — Asmi" },
      {
        property: "og:description",
        content: "See exactly what Asmi sent, when it landed, and what you skipped.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { history } = useReminders();

  const groups = history.reduce<Record<string, typeof history>>((acc, entry) => {
    const label = formatDayLabel(new Date(entry.at));
    (acc[label] ??= []).push(entry);
    return acc;
  }, {});

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar />

      <div className="flex-1 overflow-y-auto px-5 pb-10">
        <h1 className="font-display text-[30px] leading-tight text-foreground">History</h1>
        <p className="mt-1.5 text-[13.5px] text-muted-foreground">
          Proof that Asmi showed up — every nudge, in order.
        </p>

        {Object.entries(groups).map(([label, entries]) => (
          <div key={label}>
            <SectionHeader label={label} chip={`${entries.length}`} />
            <div className="space-y-2.5">
              {entries.map((entry, i) => {
                const Icon = entry.channel === "call" ? Phone : MessageSquare;
                return (
                  <div
                    key={entry.id}
                    className="fade-up rounded-2xl bg-raised px-4 py-3.5 backdrop-blur-md"
                    style={{ animationDelay: `${i * 35}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Icon className="size-4" strokeWidth={1.9} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold text-foreground">{entry.title}</p>
                        <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                          {formatTime(new Date(entry.at))}
                        </p>
                      </div>
                      <OutcomeChip outcome={entry.outcome} />
                    </div>
                    <p className="mt-3 rounded-xl bg-cream px-3 py-2.5 text-[13px] leading-snug text-cream-foreground">
                      {entry.message}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {history.length === 0 ? (
          <p className="mt-8 text-center text-[14px] text-muted-foreground">Nothing here yet.</p>
        ) : null}
      </div>
    </div>
  );
}
