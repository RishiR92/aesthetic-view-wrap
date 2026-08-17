import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { Task } from "@/lib/mock-tasks";

export function LiveTaskCard({ task }: { task: Task }) {
  return (
    <Link
      to="/task/$taskId/status"
      params={{ taskId: task.id }}
      className="block rounded-2xl border border-border/60 bg-raised px-4 py-3.5 backdrop-blur-md transition-transform active:scale-[0.985]"
    >
      <div className="flex items-start gap-3">
        <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-cta/15 text-cta/40 pulse-ring">
          <span className="size-2.5 rounded-full bg-cta" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-foreground">{task.title}</p>
          <p className="mt-0.5 flex items-center gap-0.5 text-[14px] font-medium text-primary">
            {task.liveLine}
            <span aria-hidden className="live-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1 pt-0.5">
          <span className="text-[11px] text-muted-foreground">{task.ago}</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </div>
      </div>
    </Link>
  );
}