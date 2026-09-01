import { Check, Sparkles } from "lucide-react";

export interface PlanSpec {
  id: "pro" | "ultra";
  name: string;
  tasks: string;
  monthly: string;
  yearly: string;
}

export function PlanCard({
  spec,
  period,
  selected,
  featured,
  onSelect,
}: {
  spec: PlanSpec;
  period: "monthly" | "yearly";
  selected: boolean;
  featured?: boolean | undefined;
  onSelect: () => void;
}) {
  const price = period === "yearly" ? spec.yearly : spec.monthly;

  return (
    <div
      className={`transition-[transform,box-shadow,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        selected ? "scale-[1.01] shadow-[var(--shadow-lift)]" : "scale-[0.99]"
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
          }
        }}
        className={`relative cursor-pointer overflow-hidden rounded-3xl p-6 ring-1 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          featured
            ? "bg-background text-cream"
            : "bg-cream text-cream-foreground"
        } ${selected ? "ring-primary" : featured ? "ring-cream/10" : "ring-cream-foreground/10"}`}
      >
        {featured ? (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute -top-20 right-[-48px] size-56 rounded-full bg-primary/25 blur-3xl"
            />
            <span className="absolute right-0 top-0 rounded-bl-2xl bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-foreground">
              Most popular
            </span>
          </>
        ) : null}

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] ring-1 ${
            featured
              ? "bg-primary/15 text-primary ring-primary/30"
              : "bg-cream-foreground/6 text-cream-foreground/60 ring-cream-foreground/12"
          }`}
        >
          {featured ? <Sparkles className="size-3" strokeWidth={2.5} /> : null}
          {spec.name}
        </span>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-[56px] leading-none tracking-tight">{spec.tasks}</span>
          <span className={`text-[14px] ${featured ? "text-cream/60" : "text-cream-foreground/55"}`}>
            tasks / month
          </span>
        </div>

        <p className={`mt-2 text-[15px] font-medium ${featured ? "text-cream/80" : "text-cream-foreground/70"}`}>
          {price}
          <span className={featured ? "text-cream/45" : "text-cream-foreground/45"}>
            {" "}
            {period === "yearly" ? "/ year" : "/ month"}
          </span>
        </p>

        <div
          className={`mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition-transform active:scale-[0.99] ${
            featured
              ? "cta-fill"
              : "ring-1 ring-cream-foreground/25"
          }`}
        >
          {selected ? (
            <>
              <Check className="size-4" strokeWidth={2.5} />
              Selected
            </>
          ) : (
            `Choose ${spec.id === "ultra" ? "Ultra" : "Pro"}`
          )}
        </div>
      </div>
    </div>
  );
}
