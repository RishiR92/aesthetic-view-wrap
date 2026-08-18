import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Phone } from "lucide-react";

import { getTask } from "@/lib/mock-tasks";
import { TopBar } from "@/components/top-bar";
import { PlaceHeroCard } from "@/components/place-hero-card";
import { PlaceRow } from "@/components/place-row";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/task/$taskId/")({
  loader: ({ params }) => {
    const task = getTask(params.taskId);
    if (!task) throw notFound();
    return { task };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.task.title} — Asmi` : "Task — Asmi";
    const description = loaderData
      ? loaderData.task.brief
      : "Pick an option and Asmi will handle the call.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: TaskOptions,
});

function TaskOptions() {
  const { task } = Route.useLoaderData();
  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const [hero, ...rest] = task.options;
  const visible = expanded ? rest : rest.slice(0, 2);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar back />

      <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-6">
        <section className="fade-up overflow-hidden rounded-3xl bg-panel">
          <div className="p-4">
            <span className="inline-block rounded-full border border-panel-foreground/12 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-panel-muted">
              {task.kind}
            </span>
            <h1 className="mt-2 text-[21px] font-bold leading-tight text-panel-foreground">
              {task.title}
            </h1>
            <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-snug text-panel-muted">
              {task.brief}
            </p>
          </div>
          <div className="flex items-start gap-2.5 bg-cream px-4 py-3">
            <Phone className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2} />
            <p className="text-[12.5px] leading-snug text-cream-foreground">
              <span className="font-bold text-primary">Asmi will: </span>
              {task.plan}
            </p>
          </div>
        </section>

        {hero ? (
          <div className="fade-up" style={{ animationDelay: "80ms" }}>
            <PlaceHeroCard
              place={hero}
              selected={selected === hero.id}
              onSelect={() => setSelected(hero.id)}
            />
          </div>
        ) : null}

        {rest.length ? (
          <div className="fade-up space-y-3" style={{ animationDelay: "120ms" }}>
            <div className="space-y-2.5">
              {visible.map((place) => (
                <PlaceRow
                  key={place.id}
                  place={place}
                  selected={selected === place.id}
                  onSelect={() => setSelected(place.id)}
                />
              ))}
            </div>
            {rest.length > 2 ? (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-border py-3 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {expanded ? "Show fewer options" : `View ${rest.length - 2} more options`}
                <ChevronDown
                  className={cn("size-4 transition-transform", expanded && "rotate-180")}
                />
              </button>
            ) : null}
          </div>
        ) : null}

        <Link
          to="/task/$taskId/status"
          params={{ taskId: task.id }}
          className="block pt-1 text-center text-[13px] font-medium text-muted-foreground underline-offset-4 hover:underline"
        >
          View execution status
        </Link>
      </div>

      <div className="shrink-0 border-t border-border/50 bg-background/80 px-5 py-4 backdrop-blur">
        <button
          type="button"
          disabled={!selected}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-bold transition-all active:scale-[0.98]",
            selected
              ? "bg-cta text-cta-foreground shadow-[0_10px_30px_-10px_var(--cta)]"
              : "bg-secondary text-muted-foreground",
          )}
        >
          <Phone className="size-4" strokeWidth={2.5} />
          {selected ? "Asmi will call now" : "Pick one option to call"}
        </button>
      </div>
    </div>
  );
}