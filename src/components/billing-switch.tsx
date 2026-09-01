import { Sparkles } from "lucide-react";

export type Period = "monthly" | "yearly";

export function BillingSwitch({
  period,
  onChange,
}: {
  period: Period;
  onChange: (p: Period) => void;
}) {
  const yearly = period === "yearly";

  return (
    <div
      role="radiogroup"
      aria-label="Billing period"
      className="relative grid grid-cols-2 rounded-full bg-cream-foreground/6 p-1 ring-1 ring-cream-foreground/10"
    >
      {/* Sliding amber thumb */}
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-cream shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.44,1)]"
        style={{ transform: yearly ? "translateX(100%)" : "translateX(0)" }}
      />

      <button
        type="button"
        role="radio"
        aria-checked={!yearly}
        onClick={() => onChange("monthly")}
        className={`relative z-10 flex h-10 items-center justify-center rounded-full text-[13.5px] font-semibold transition-colors duration-200 active:scale-[0.97] ${
          !yearly ? "text-cream-foreground" : "text-muted-foreground"
        }`}
      >
        Monthly
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={yearly}
        onClick={() => onChange("yearly")}
        className={`relative z-10 flex h-10 items-center justify-center gap-1.5 rounded-full text-[13.5px] font-semibold transition-colors duration-200 active:scale-[0.97] ${
          yearly ? "text-cream-foreground" : "text-muted-foreground"
        }`}
      >
        Yearly
        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-px text-[9.5px] font-bold uppercase tracking-[0.08em] transition-colors duration-200 ${
            yearly
              ? "bg-primary/15 text-primary"
              : "bg-cream-foreground/8 text-muted-foreground/70"
          }`}
        >
          <Sparkles className="size-2.5" strokeWidth={2.5} />
          2 mo free
        </span>
      </button>
    </div>
  );
}
