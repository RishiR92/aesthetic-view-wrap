import { Check, Sparkles } from "lucide-react";

export interface PlanSpec {
  id: "pro" | "ultra";
  name: string;
  tagline: string;
  monthly: { price: string; note: string };
  yearly: { price: string; note: string };
  benefits: string[];
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
      className={`overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        selected
          ? "scale-[1.01] shadow-[var(--shadow-lift)]"
          : "scale-[0.99] opacity-90"
      }`}
    >
      <div className={`rounded-3xl ring-1 ${selected ? "ring-primary" : "ring-cream-foreground/10"} ${featured ? "" : "bg-cream"}`}>
        {featured ? (
          /* Ultra hero band */
          <div className="relative overflow-hidden rounded-t-3xl bg-panel px-5 pb-5 pt-6">
            {/* spotlight bloom */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 right-[-40px] size-48 rounded-full bg-primary/25 blur-3xl"
            />
            <span className="absolute right-0 top-0 rounded-bl-2xl bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-foreground">
              Most popular
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-primary ring-1 ring-primary/30">
              <Sparkles className="size-3" strokeWidth={2.5} />
              Ultra
            </span>
            <h3 className="mt-2.5 font-display text-[26px] italic leading-none text-cream">
              Asmi Ultra
            </h3>
            <p className="mt-1.5 text-[12.5px] text-cream/60">{spec.tagline}</p>
          </div>
        ) : null}

        <div className={`bg-cream p-5 text-cream-foreground ${featured ? "rounded-b-3xl" : "rounded-3xl"}`}>
          {!featured ? (
            <>
              <h3 className="font-display text-[22px] leading-none">{spec.name}</h3>
              <p className="mt-1 text-[12.5px] text-cream-foreground/60">{spec.tagline}</p>
            </>
          ) : null}

          <div className={`flex items-baseline gap-1.5 ${featured ? "" : "mt-3"}`}>
            <span className="font-display text-[34px] leading-none">{price.price}</span>
            <span className="text-[13px] text-cream-foreground/55">
              {period === "yearly" ? "/yr" : "/mo"}
            </span>
          </div>
          <p className="mt-1 text-[11.5px] text-cream-foreground/55">{price.note}</p>

          <ul className="mt-4 space-y-2.5 border-t border-cream-foreground/12 pt-4">
            {spec.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[13.5px] leading-snug">
                <Check className="mt-[2px] size-4 shrink-0 text-primary" strokeWidth={2.5} />
                {b}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className={
              featured
                ? "cta-fill mt-5 flex h-[52px] w-full items-center justify-center rounded-full text-[15px] font-semibold transition-transform active:scale-[0.99]"
                : "mt-5 flex h-[52px] w-full items-center justify-center rounded-full text-[15px] font-semibold ring-1 ring-cream-foreground/25 transition-transform active:scale-[0.99]"
            }
          >
            {featured ? (selected ? "Ultra selected" : "Go Ultra") : selected ? "Pro selected" : "Choose Pro"}
          </button>
        </div>
      </div>
    </div>
  );
}
