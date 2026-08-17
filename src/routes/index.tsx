import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Clock, CreditCard, Home, Star } from "lucide-react";

import { tasks } from "@/lib/mock-tasks";
import { TopBar } from "@/components/top-bar";
import { SectionHeader } from "@/components/section-header";
import { LiveTaskCard } from "@/components/live-task-card";

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

        <SectionHeader label="Asmi can also" />
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              className="shrink-0 rounded-full border border-border px-4 py-2.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <nav className="grid shrink-0 grid-cols-3 bg-tabbar py-4 text-tabbar-foreground">
        <span className="flex flex-col items-center gap-1.5 text-primary">
          <Home className="size-5" strokeWidth={1.75} />
          <span className="text-xs font-medium">Home</span>
        </span>
        <span className="flex flex-col items-center gap-1.5">
          <Clock className="size-5" strokeWidth={1.75} />
          <span className="text-xs font-medium">History</span>
        </span>
        <span className="flex flex-col items-center gap-1.5">
          <CreditCard className="size-5" strokeWidth={1.75} />
          <span className="text-xs font-medium">Payments</span>
        </span>
      </nav>
    </div>
  );
}
