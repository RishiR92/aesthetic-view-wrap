import { createFileRoute } from "@tanstack/react-router";
import { Check, CreditCard, Lock } from "lucide-react";
import { useState } from "react";

import { ApplePayButton } from "@/components/apple-pay-button";
import { TopBar } from "@/components/top-bar";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Asmi Unlimited — one plan, unlimited tasks" },
      {
        name: "description",
        content:
          "Subscribe to Asmi Unlimited: unlimited tasks, calls and messages handled for you, cancel anytime.",
      },
      { property: "og:title", content: "Asmi Unlimited — one plan, unlimited tasks" },
      {
        property: "og:description",
        content: "Unlimited tasks. Asmi calls, messages and pays on your behalf.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaymentsPage,
});

const BENEFITS = [
  "Unlimited tasks, every month",
  "Asmi calls and messages on your behalf",
  "Pays deposits and places orders for you",
  "Cancel anytime, no questions",
];

function PaymentsPage() {
  const [pending, setPending] = useState<"apple" | "card" | null>(null);

  const start = (method: "apple" | "card") => {
    setPending(method);
    window.setTimeout(() => setPending(null), 1600);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar />

      <div className="flex-1 overflow-y-auto px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <h1 className="font-display text-[30px] leading-tight text-foreground">Asmi Unlimited</h1>
        <p className="mt-1.5 text-[13.5px] text-muted-foreground">One plan. Unlimited tasks.</p>

        <section className="fade-up mt-5 rounded-3xl bg-cream p-5 text-cream-foreground">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-primary">
            Asmi Unlimited
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-display text-[44px] leading-none">$20</span>
            <span className="text-[13.5px] font-medium text-cream-foreground/60">/ month</span>
          </div>

          <ul className="mt-4 space-y-2.5">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[13.5px] leading-snug">
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <p className="mt-4 border-t border-cream-foreground/12 pt-3 text-[11.5px] text-cream-foreground/60">
            Billed monthly. Cancel anytime.
          </p>
        </section>

        <div className="fade-up mt-5 space-y-3" style={{ animationDelay: "80ms" }}>
          <ApplePayButton
            onPay={() => start("apple")}
            pending={pending === "apple"}
            disabled={pending !== null}
          />

          <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border/60" />
            or
            <span className="h-px flex-1 bg-border/60" />
          </div>

          <button
            type="button"
            onClick={() => start("card")}
            disabled={pending !== null}
            className="cta-fill flex h-[52px] w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition-transform active:scale-[0.99] disabled:opacity-70"
          >
            {pending === "card" ? (
              <span className="size-4 animate-spin rounded-full border-2 border-cta-foreground/40 border-t-cta-foreground" />
            ) : (
              <>
                <CreditCard className="size-4" strokeWidth={2} />
                Pay with card
              </>
            )}
          </button>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11.5px] text-muted-foreground">
          <Lock className="size-3.5" strokeWidth={2} />
          Secure checkout. Your card details never touch Asmi.
        </p>
      </div>
    </div>
  );
}
