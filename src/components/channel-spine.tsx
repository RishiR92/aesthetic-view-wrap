import { Mail, MessageSquare, Phone, RotateCcw } from "lucide-react";
import type { ChannelStep } from "@/lib/mock-tasks";
import { cn } from "@/lib/utils";

const icons = {
  call: Phone,
  retry: RotateCcw,
  message: MessageSquare,
  email: Mail,
};

export function ChannelSpine({ steps }: { steps: ChannelStep[] }) {
  return (
    <div className="flex items-start">
      {steps.map((step, i) => {
        const Icon = icons[step.icon];
        const prev = steps[i - 1];
        return (
          <div key={step.label} className="flex flex-1 items-start">
            {i > 0 ? (
              <span
                aria-hidden
                className={cn(
                  "mt-5 h-px flex-1",
                  prev && prev.state === "done"
                    ? "bg-cream-foreground/40"
                    : "border-t border-dashed border-cream-foreground/25",
                )}
              />
            ) : null}
            <div className="flex w-16 flex-col items-center gap-1.5 text-center">
              <span
                className={cn(
                  "grid size-10 place-items-center rounded-full",
                  step.state === "done" && "bg-cream-foreground/25 text-cream-foreground",
                  step.state === "skipped" &&
                    "border border-dashed border-cream-foreground/35 text-cream-foreground/45",
                  step.state === "active" && "bg-cream-foreground text-cream pulse-ring",
                  step.state === "next" &&
                    "border border-cream-foreground/25 text-cream-foreground/55",
                )}
              >
                <Icon className="size-[18px]" strokeWidth={2} />
              </span>
              <span
                className={cn(
                  "text-[13px] font-semibold",
                  step.state === "active" ? "text-cream-foreground" : "text-cream-foreground/75",
                  step.state === "skipped" && "text-cream-foreground/45",
                )}
              >
                {step.label}
              </span>
              <span className="text-[11px] text-cream-foreground/55">{step.detail}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}