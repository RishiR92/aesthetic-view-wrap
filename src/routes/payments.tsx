import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Lock, Tag } from "lucide-react";
import { useState } from "react";

import { ApplePayButton } from "@/components/apple-pay-button";
import { CardAccordion } from "@/components/card-form";
import { TopBar } from "@/components/top-bar";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Asmi Unlimited — one plan, unlimited tasks" },
      {
        name: "description",
        content:
          "Subscribe to Asmi Unlimited: unlimited tasks, monthly or yearly, cancel anytime.",
      },
      { property: "og:title", content: "Asmi Unlimited — one plan, unlimited tasks" },
      {
        property: "og:description",
        content: "One plan. Unlimited tasks, done for you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaymentsPage,
});

type PlanId = "monthly" | "yearly";

const PLANS: {
  id: PlanId;
  label: string;
  price: string;
  period: string;
  full: string;
  badge?: string;
}[] = [
  { id: "monthly", label: "Monthly", price: "$10", period: "/mo", full: "$10.00/month" },
  {
    id: "yearly",
    label: "Yearly",
    price: "$99",
    period: "/yr",
    full: "$99.00/year",
    badge: "Save 18%",
  },
];

function PaymentsPage() {
  const [plan, setPlan] = useState<PlanId>("yearly");
  const [cardOpen, setCardOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [pending, setPending] = useState<"apple" | "link" | "card" | null>(null);

  const activePlan = PLANS.find((p) => p.id === plan)!;

  const start = (method: "apple" | "link" | "card") => {
    setPending(method);
    window.setTimeout(() => setPending(null), 1600);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar />

      <div className="flex-1 overflow-y-auto px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <h1 className="font-display text-[30px] leading-tight text-foreground">Asmi Unlimited</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">One plan. Unlimited tasks.</p>

        <section className="fade-up mt-5 rounded-3xl bg-cream p-5 text-cream-foreground">
          {/* Value headline */}
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[40px] leading-none">{activePlan.price}</span>
            <span className="text-[15px] text-cream-foreground/60">{activePlan.period}</span>
          </div>
          <p className="mt-1 text-[12.5px] text-cream-foreground/55">
            {plan === "yearly" ? "$99 billed yearly" : "$10 billed monthly"}
            {" · "}Cancel anytime. Billed automatically.
          </p>

          {/* Billing period chips */}
          <div
            role="radiogroup"
            aria-label="Billing period"
            className="mt-5 grid grid-cols-2 gap-2.5"
          >
            {PLANS.map((p) => {
              const active = plan === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setPlan(p.id);
                    if (cardOpen) setCardOpen(false);
                  }}
                  className={`relative overflow-hidden rounded-2xl p-3.5 text-left transition-[transform,box-shadow,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    active
                      ? "bg-primary/12 ring-1 ring-primary shadow-[var(--shadow-lift)]"
                      : "scale-[0.98] bg-cream-foreground/6 opacity-[0.78] ring-1 ring-cream-foreground/10"
                  }`}
                >
                  {p.badge ? (
                    <span className="absolute right-0 top-0 rounded-bl-xl bg-primary px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-primary-foreground">
                      {p.badge}
                    </span>
                  ) : null}
                  <span className="text-[12px] font-medium text-cream-foreground/70">{p.label}</span>
                  <span className="mt-1 flex items-baseline gap-1">
                    <span className="font-display text-[27px] leading-none">{p.price}</span>
                    <span className="text-[12px] text-cream-foreground/60">{p.period}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Payment methods */}
          <div className="mt-5 space-y-2.5">
            <ApplePayButton
              onPay={() => start("apple")}
              pending={pending === "apple"}
              disabled={pending !== null}
            />

            <CardAccordion
              plan={plan}
              open={cardOpen}
              onToggle={() => setCardOpen((v) => !v)}
              pending={pending === "card"}
              onSubscribe={() => start("card")}
              disabled={pending !== null}
            />

            <button
              type="button"
              onClick={() => start("link")}
              disabled={pending !== null}
              className="flex h-[48px] w-full items-center justify-center gap-2 rounded-full bg-link px-4 text-[14px] font-semibold text-link-foreground transition-transform active:scale-[0.99] disabled:opacity-60"
            >
              {pending === "link" ? (
                <span className="size-4 animate-spin rounded-full border-2 border-link-foreground/40 border-t-link-foreground" />
              ) : (
                <>
                  Pay securely with
                  <span className="flex items-center gap-1 font-bold">
                    <span className="flex size-4 items-center justify-center rounded-full bg-link-foreground text-[9px] text-link">
                      ➔
                    </span>
                    link
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Coupon */}
          <div className="mt-4 border-t border-cream-foreground/12 pt-3.5">
            {applied ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12.5px] font-semibold text-cream-foreground">
                  <Tag className="mr-1.5 inline size-3.5 text-primary" strokeWidth={2} />
                  {applied} applied
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setApplied(null);
                    setCoupon("");
                  }}
                  className="text-[12px] font-medium text-cream-foreground/60 underline"
                >
                  Remove
                </button>
              </div>
            ) : couponOpen ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  aria-label="Coupon code"
                  className="h-10 min-w-0 flex-1 rounded-2xl bg-cream-foreground/6 px-3.5 text-[13.5px] tracking-wide text-cream-foreground outline-none placeholder:text-cream-foreground/40 focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  disabled={!coupon.trim()}
                  onClick={() => setApplied(coupon.trim())}
                  className="h-10 shrink-0 rounded-2xl px-4 text-[13px] font-semibold text-primary transition-transform active:scale-[0.99] disabled:opacity-40"
                >
                  Apply
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setCouponOpen(true)}
                className="text-[13px] font-medium text-cream-foreground/70 underline underline-offset-2"
              >
                Have a coupon code?
              </button>
            )}
          </div>
        </section>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11.5px] text-muted-foreground">
          <Lock className="size-3.5" strokeWidth={2} />
          Payments are processed securely via Stripe
        </p>
      </div>
    </div>
  );
}
