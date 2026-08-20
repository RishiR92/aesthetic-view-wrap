import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, ChevronRight, Star } from "lucide-react";

import { tasks } from "@/lib/mock-tasks";
import { TopBar } from "@/components/top-bar";
import { SectionHeader } from "@/components/section-header";
import { LiveTaskCard } from "@/components/live-task-card";
import { useReminders } from "@/lib/reminders-store";
import { formatDayLabel, formatTime, nextOccurrence } from "@/lib/reminders";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Asmi — your always-on assistant" },
      {
        name: "description",
        content:
          "Your Asmi home: see what needs you, follow live calls in progress, and text Asmi to get something done.",
      },
      { property: "og:title", content: "Asmi — your always-on assistant" },
      {
        property: "og:description",
        content:
          "See what needs you, follow live calls in progress, and text Asmi to get something done.",
      },
    ],
  }),
  component: Index,
});

const chips = ["Find a late-night pharmacy", "Book a haircut Saturday", "Renew my car insurance"];

function Index() {
  const needsYou = tasks.filter((t) => t.status === "needs-you");
  const inMotion = tasks.filter((t) => t.status === "in-motion");
  const { reminders } = useReminders();

  const upNext = reminders
    .filter((r) => r.status === "active")
    .map((reminder) => ({ reminder, at: nextOccurrence(reminder) }))
    .filter((x): x is { reminder: typeof reminders[number]; at: Date } => x.at !== null)
    .sort((a, b) => a.at.getTime() - b.at.getTime())[0];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar />

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <section className="fade-up rounded-3xl bg-gradient-to-br from-accent/35 via-cream/20 to-cream/50 p-5">
          <span aria-hidden className="text-2xl">
            ⛅
          </span>
          <h1 className="mt-2 text-[22px] font-bold leading-tight text-foreground">
            Good afternoon, Rish!
          </h1>
          <p className="mt-1 text-[13px] text-foreground/70">
            {needsYou.length} thing{needsYou.length === 1 ? "" : "s"} waiting on you
          </p>
        </section>

        {needsYou.length ? (
          <>
            <SectionHeader label="Needs you" chip={`${needsYou.length}`} />
            <div className="space-y-3">
              {needsYou.map((task) => (
                <Link
                  key={task.id}
                  to="/task/$taskId"
                  params={{ taskId: task.id }}
                  className="fade-up block overflow-hidden rounded-3xl bg-panel pb-4 transition-transform active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between gap-3 px-5 pt-5">
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-panel-muted">
                        {task.kind} · {task.options.length} options
                      </span>
                      <h3 className="mt-1.5 text-[21px] font-bold leading-tight text-panel-foreground">
                        {task.title}
                      </h3>
                      <p className="mt-1.5 text-[13px] text-panel-muted">
                        Pick one and Asmi will call for you
                      </p>
                    </div>
                    <ChevronRight className="mt-1 size-5 shrink-0 text-panel-muted" />
                  </div>

                  <div className="no-scrollbar mt-4 flex snap-x gap-3 overflow-x-auto px-5">
                    {task.options.slice(0, 4).map((place) => (
                      <span key={place.id} className="w-[132px] shrink-0 snap-start">
                        <img
                          src={place.photos[0]}
                          alt={place.name}
                          width={1024}
                          height={640}
                          loading="lazy"
                          className="aspect-[4/3] w-full rounded-xl object-cover"
                        />
                        <span className="mt-2 block truncate text-[12px] font-semibold text-panel-foreground">
                          {place.name}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 text-[11px] text-panel-muted">
                          <Star className="size-3 fill-current text-primary" strokeWidth={0} />
                          {place.rating.toFixed(1)}
                        </span>
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : null}

        {inMotion.length ? (
          <>
            <SectionHeader label="Tasks in motion" chip={`${inMotion.length} live`} />
            <div className="space-y-3">
              {inMotion.map((task, i) => (
                <div key={task.id} className="fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <LiveTaskCard task={task} />
                </div>
              ))}
            </div>
          </>
        ) : null}

        {upNext ? <SectionHeader label="Next reminder" /> : null}
        {upNext ? (
          <Link
            to="/reminders"
            className="fade-up mb-1 flex items-center gap-3 rounded-2xl bg-raised px-4 py-3.5 backdrop-blur-md transition-transform active:scale-[0.99]"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/18 text-primary">
              <Bell className="size-4" strokeWidth={1.9} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-semibold text-foreground">
                {upNext.reminder.title}
              </span>
              <span className="mt-0.5 block text-[12.5px] text-muted-foreground">
                {formatDayLabel(upNext.at)} at {formatTime(upNext.at)}
              </span>
            </span>
            <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
          </Link>
        ) : null}

      </div>
    </div>
  );
}
