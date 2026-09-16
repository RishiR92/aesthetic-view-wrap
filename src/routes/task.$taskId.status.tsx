import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, ChevronDown, Mail, MessageSquare, Pause, Play, Phone, CircleCheck } from "lucide-react";

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
  const [showRecording, setShowRecording] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playback, setPlayback] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setPlayback((value) => {
        if (value >= 100) {
          setIsPlaying(false);
          return 0;
        }
        return value + 1;
      });
    }, 180);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

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
                 {task.confirmedDetails?.length ?? 1} confirmed
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
              {task.confirmedDetails ? (
                <dl className="divide-y divide-cream-foreground/10">
                  {task.confirmedDetails.map((detail) => (
                    <div key={detail.label} className="grid grid-cols-[72px_1fr] gap-3 py-2.5 first:pt-0 last:pb-0">
                      <dt className="text-cream-foreground/50">{detail.label}</dt>
                      <dd className="font-semibold text-cream-foreground">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          ) : null}
        </section>

        {task.outcome ? (
          <section className="fade-up rounded-3xl bg-cream p-5" style={{ animationDelay: "60ms" }}>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-4" strokeWidth={3} />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cream-foreground/70">
                  {task.outcome.label}
                </span>
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-[12px] font-bold text-primary">
                <CircleCheck className="size-3.5" strokeWidth={2.5} />
                Done
              </span>
            </div>
            <p className="mt-4 font-display text-[26px] leading-[1.15] text-cream-foreground">
              {task.outcome.headline}
            </p>
            <p className="mt-4 border-t border-cream-foreground/10 pt-4 text-[14px] leading-snug text-cream-foreground/80">
              {task.outcome.detail}
            </p>
            <p className="mt-2 text-[12px] text-cream-foreground/50">{task.outcome.at}</p>
          </section>
        ) : null}

        <section className="fade-up rounded-3xl bg-cream p-5" style={{ animationDelay: "80ms" }}>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-cream-foreground/60">
            Execution
          </h2>

          {task.asmiAction ? (
            <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-cream-foreground/50">
              {task.asmiAction}
            </p>
          ) : null}
          <span className={cn("inline-flex items-center gap-2 rounded-full bg-primary/12 px-3 py-1.5 text-[13px] font-bold text-primary", task.asmiAction ? "mt-3" : "mt-4")}>
            <Check className="size-3.5" strokeWidth={3} />
            {task.liveLine}
          </span>

          <div className="mt-6">
            <ChannelSpine steps={task.steps} />
          </div>

          <div className="mt-6 border-t border-cream-foreground/10 pt-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-cream-foreground/60">
                Timeline
              </h3>
              <span className="text-[11px] text-cream-foreground/50">
                {task.timeline.length} touchpoints
              </span>
            </div>
            <ul className="mt-2">
              {task.timeline.map((row) => (
                <li
                  key={row.time + row.event}
                  className="flex items-start gap-3 border-b border-cream-foreground/8 py-2.5 last:border-0"
                >
                  <span className="w-16 shrink-0 pt-0.5 text-[11px] font-medium tabular-nums text-cream-foreground/50">
                    {row.time}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1 size-2 shrink-0 rounded-full",
                      row.state === "skipped"
                        ? "border border-dashed border-cream-foreground/40"
                        : row.state === "active"
                          ? "bg-cta pulse-ring"
                          : "bg-primary",
                    )}
                  />
                  <span
                    className={cn(
                      "text-[13px] leading-snug",
                      row.state === "skipped"
                        ? "text-cream-foreground/50"
                        : "text-cream-foreground/85",
                    )}
                  >
                    {row.event}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {task.recording ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-cream-foreground/12">
              <button
                type="button"
                onClick={() => setShowRecording((v) => !v)}
                className="flex w-full items-center justify-between px-4 py-3"
              >
                <span className="flex items-center gap-2.5 text-[13px] font-semibold text-cream-foreground">
                   <span className="grid size-8 place-items-center rounded-full bg-cta text-cta-foreground">
                     <Play className="size-3.5 fill-current" strokeWidth={0} />
                  </span>
                  <span className="text-left">
                    Call recording
                    <span className="block text-[11px] font-normal text-cream-foreground/55">
                      {task.recording.to} · {task.recording.at} · {task.recording.duration}
                    </span>
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 text-cream-foreground/50 transition-transform",
                    showRecording && "rotate-180",
                  )}
                />
              </button>
              {showRecording ? (
                <div className="border-t border-cream-foreground/10 p-4">
                   <div className="flex items-center gap-3">
                     <button
                       type="button"
                       aria-label={isPlaying ? "Pause call recording" : "Play call recording"}
                       onClick={() => setIsPlaying((value) => !value)}
                       className="grid size-10 shrink-0 place-items-center rounded-full bg-cta text-cta-foreground transition-transform active:scale-95"
                     >
                       {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
                     </button>
                     <span className="relative flex h-9 flex-1 items-end gap-[3px] overflow-hidden">
                      {[6, 12, 20, 14, 26, 18, 30, 22, 12, 24, 16, 28, 10, 20, 14, 8, 18, 26, 12, 6].map(
                        (h, i) => (
                          <span
                            key={i}
                             className={cn("flex-1 rounded-full", i / 20 <= playback / 100 ? "bg-cta" : "bg-cream-foreground/18")}
                            style={{ height: `${h}px` }}
                          />
                        ),
                      )}
                    </span>
                    <span className="text-[11px] tabular-nums text-cream-foreground/55">
                      {task.recording.duration}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {task.recording.transcript.map((line) => (
                      <li key={line.text} className="text-[13px] leading-snug">
                        <span className="mr-1.5 font-bold text-cream-foreground">
                          {line.from === "asmi" ? "Asmi:" : "Them:"}
                        </span>
                        <span className="text-cream-foreground/80">{line.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {task.email ? (
            <div className="mt-3 overflow-hidden rounded-2xl border border-cream-foreground/12">
              <button
                type="button"
                onClick={() => setShowEmail((value) => !value)}
                className="flex w-full items-center justify-between px-4 py-3"
              >
                <span className="flex min-w-0 items-center gap-2.5 text-[13px] font-semibold text-cream-foreground">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/20 text-cream-foreground">
                    <Mail className="size-4" strokeWidth={2} />
                  </span>
                  <span className="min-w-0 text-left">
                    Final details emailed
                    <span className="block truncate text-[11px] font-normal text-cream-foreground/55">
                      To {task.email.to} · {task.email.at}
                    </span>
                  </span>
                </span>
                <ChevronDown className={cn("size-4 shrink-0 text-cream-foreground/50 transition-transform", showEmail && "rotate-180")} />
              </button>
              {showEmail ? (
                <div className="border-t border-cream-foreground/10 p-4">
                  <div className="rounded-xl bg-cream-foreground/6 p-3.5">
                    <div className="grid grid-cols-[48px_1fr] gap-x-2 gap-y-1 text-[11px]">
                      <span className="text-cream-foreground/45">To</span>
                      <span className="truncate font-medium text-cream-foreground/75">{task.email.to}</span>
                      <span className="text-cream-foreground/45">Subject</span>
                      <span className="font-semibold text-cream-foreground">{task.email.subject}</span>
                    </div>
                    <div className="mt-3 space-y-2 border-t border-cream-foreground/10 pt-3">
                      {task.email.body.map((paragraph) => (
                        <p key={paragraph} className="text-[12px] leading-relaxed text-cream-foreground/75">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {task.thread.length ? (
            <div className="mt-3 overflow-hidden rounded-2xl border border-cream-foreground/12">
              <button
                type="button"
                onClick={() => setShowChat((v) => !v)}
                className="flex w-full items-center justify-between px-4 py-3"
              >
                <span className="flex items-center gap-2.5 text-[13px] font-semibold text-cream-foreground">
                  <span className="grid size-8 place-items-center rounded-full bg-cream-foreground/10">
                    <MessageSquare className="size-4 text-cream-foreground/70" strokeWidth={2} />
                  </span>
                  <span className="text-left">
                    Message trail
                    <span className="block text-[11px] font-normal text-cream-foreground/55">
                      {task.thread.length} messages · last {task.thread[task.thread.length - 1]?.time}
                    </span>
                  </span>
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
