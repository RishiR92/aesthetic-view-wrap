import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, MessageSquare } from "lucide-react";

import { getTask } from "@/lib/mock-tasks";
import { TopBar } from "@/components/top-bar";
import { ChannelSpine } from "@/components/channel-spine";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/task/$taskId/status")({
  loader: ({ params }) => {
    const task = getTask(params.taskId);
    if (!task) throw notFound();
    return { task };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.task.title} — live status` : "Live status — Asmi";
    const description = loaderData
      ? `Follow Asmi working on "${loaderData.task.title}" step by step.`
      : "Follow Asmi working on your task step by step.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: TaskStatus,
});

function TaskStatus() {
  const { task } = Route.useLoaderData();
  const [showChat, setShowChat] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const active = task.steps.find((s) => s.state === "active");
  const lastEvent = task.timeline[task.timeline.length - 1];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar back />

      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-8">
        <section className="fade-up rounded-3xl bg-panel p-5">
          <span className="inline-block rounded-full border border-panel-foreground/12 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-panel-muted">
            {task.kind}
          </span>
          <h1 className="mt-3 text-[26px] font-bold leading-tight text-panel-foreground">
            {task.title}
          </h1>
          <p className="mt-2 text-[13px] leading-snug text-panel-muted">{task.brief}</p>
        </section>

        <section className="fade-up rounded-3xl bg-cream" style={{ animationDelay: "40ms" }}>
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-cream-foreground/60">
              Details confirmed with Asmi
            </span>
            <span className="flex items-center gap-2">
              <span className="rounded-full bg-cream-foreground/8 px-2 py-0.5 text-[11px] font-semibold text-cream-foreground/70">
                1 answered
              </span>
              <ChevronDown
                className={cn(
                  "size-4 text-cream-foreground/50 transition-transform",
                  showDetails && "rotate-180",
                )}
              />
            </span>
          </button>
          {showDetails ? (
            <div className="border-t border-cream-foreground/10 px-5 py-4 text-[13px] leading-snug text-cream-foreground/80">
              <p className="font-semibold text-cream-foreground">Preferred time</p>
              <p>Tuesday or Wednesday, around 5:00 PM</p>
            </div>
          ) : null}
        </section>

        <section className="fade-up rounded-3xl bg-cream p-5" style={{ animationDelay: "80ms" }}>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-cream-foreground/60">
            Execution
          </h2>

          <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-cream-foreground/50">
            {task.asmiAction}
          </p>
          <p className="mt-1 text-[18px] font-bold leading-tight text-cream-foreground">
            {lastEvent?.event}
          </p>
          {active ? (
            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-cta/12 px-3 py-1.5 text-[13px] font-bold text-cta">
              <span className="size-2 rounded-full bg-cta pulse-ring" />
              {task.liveLine}
              <span aria-hidden className="live-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </span>
          ) : null}

          <div className="mt-6">
            <ChannelSpine steps={task.steps} />
          </div>

          <div className="mt-6 border-t border-cream-foreground/10 pt-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-cream-foreground/60">
                Timeline
              </h3>
              <span className="text-[11px] text-cream-foreground/50">
                {task.timeline.length} touchpoints so far
              </span>
            </div>
            <ul className="mt-2">
              {task.timeline.map((row) => (
                <li
                  key={row.time + row.event}
                  className="flex gap-3 border-b border-cream-foreground/8 py-2.5 last:border-0"
                >
                  <span className="w-16 shrink-0 text-[11px] font-medium tabular-nums text-cream-foreground/50">
                    {row.time}
                  </span>
                  <span className="text-[13px] leading-snug text-cream-foreground/85">
                    {row.event}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {task.thread.length ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-cream-foreground/12">
              <button
                type="button"
                onClick={() => setShowChat((v) => !v)}
                className="flex w-full items-center justify-between px-4 py-3"
              >
                <span className="flex items-center gap-2 text-[13px] font-semibold text-cream-foreground">
                  <MessageSquare className="size-4 text-cream-foreground/60" strokeWidth={2} />
                  View third-party chat
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 text-cream-foreground/50 transition-transform",
                    showChat && "rotate-180",
                  )}
                />
              </button>
              {showChat ? (
                <div className="space-y-2 border-t border-cream-foreground/10 p-4">
                  {task.thread.map((m) => (
                    <div
                      key={m.time + m.text}
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug",
                        m.from === "asmi"
                          ? "ml-auto bg-cta text-cta-foreground"
                          : "bg-cream-foreground/8 text-cream-foreground",
                      )}
                    >
                      {m.text}
                      <span
                        className={cn(
                          "mt-1 block text-[10px]",
                          m.from === "asmi"
                            ? "text-cta-foreground/70"
                            : "text-cream-foreground/50",
                        )}
                      >
                        {m.time}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}