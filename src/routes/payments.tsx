import { createFileRoute } from "@tanstack/react-router";
import { Lock, Tag } from "lucide-react";
import { useState } from "react";

import { ApplePayButton } from "@/components/apple-pay-button";
import { CardAccordion } from "@/components/card-form";
import { PlanCard, type PlanSpec } from "@/components/plan-card";
import { TopBar } from "@/components/top-bar";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Asmi plans — Pro & Ultra" },
      {
        name: "description",
        content:
          "Choose Asmi Pro or Asmi Ultra: tasks done for you via calls, texts and emails. Monthly or yearly, cancel anytime.",
      },
      { property: "og:title", content: "Asmi plans — Pro & Ultra" },
      {
        property: "og:description",
        content: "One tap. Tasks done for you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaymentsPage,
});

type Tier = "pro" | "ultra";
type Period = "monthly" | "yearly";

const PLANS: Record<Tier, PlanSpec> = {
  ultra: {
    id: "ultra",
    name: "Asmi Ultra",
    tagline: "For people who hand everything off.",
    monthly: { price: "$49", note: "Billed monthly" },
    yearly: { price: "$499", note: "$41.58/mo, billed yearly" },
    benefits: [
      "100 tasks every month",
      "Priority execution — your calls, texts & emails jump the queue",
      "Reminders, follow-ups and coordination handled",
      "Cancel anytime",
    ],
  },
  pro: {
    id: "pro",
    name: "Asmi Pro",
    tagline: "Everyday help, handled.",
    monthly: { price: "$10", note: "Billed monthly" },
    yearly: { price: "$99", note: "$8.25/mo, billed yearly" },
    benefits: [
      "20 tasks every month",
      "Asmi completes tasks via calls, texts & emails",
      "Reminders and follow-ups handled",
      "Cancel anytime",
    ],
  },
};

function PaymentsPage() {
  const [tier, setTier] = useState<Tier>("ultra");
  const [period, setPeriod] = useState<Period>("yearly");
  const [cardOpen, setCardOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [pending, setPending] = useState<"apple" | "link" | "card" | null>(null);

  const start = (method: "apple" | "link" | "card") => {
    setPending(method);
    window.setTimeout(() => setPending(null), 1600);
  };

  const spec = PLANS[tier];
  const price = period === "yearly" ? spec.yearly.price : spec.monthly.price;
  const subscribeLabel = `Subscribe to ${tier === "ultra" ? "Ultra" : "Pro"} — ${price}.00/${
    period === "yearly" ? "year" : "month"
  }`;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar />

      <div className="flex-1 overflow-y-auto px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <h1 className="font-display text-[30px] leading-tight text-foreground">Choose your plan</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">One tap. Tasks done for you.</p>

        {/* Billing period toggle */}
        <div className="mt-5 flex items-center gap-3">
          <div
            role="radiogroup"
            aria-label="Billing period"
            className="grid flex-1 grid-cols-2 rounded-full bg-cream-foreground/6 p-1 ring-1 ring-cream-foreground/10"
          >
            {(["monthly", "yearly"] as const).map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={period === p}
                onClick={() => setPeriod(p)}
                className={`h-10 rounded-full text-[13.5px] font-semibold capitalize transition-colors ${
                  period === p
                    ? "bg-cream text-cream-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          {period === "yearly" ? (
            <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-primary ring-1 ring-primary/30">
              Save up to 17%
            </span>
          ) : null}
        </div>

        {/* Plan cards */}
        <div className="fade-up mt-4 space-y-4">
          <PlanCard
            spec={PLANS.ultra}
            period={period}
            featured
            selected={tier === "ultra"}
            onSelect={() => setTier("ultra")}
          />
          <PlanCard
            spec={PLANS.pro}
            period={period}
            selected={tier === "pro"}
            onSelect={() => setTier("pro")}
          />
        </div>

        {/* Coupon — quiet */}
        <div className="mt-4">
          {applied ? (
            <div className="flex items-center justify-between gap-2 rounded-2xl bg-cream p-3.5 text-cream-foreground">
              <span className="text-[12.5px] font-semibold">
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
            <div className="flex items-center gap-2 rounded-2xl bg-cream p-2 pl-1.5">
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
              className="text-[12.5px] font-medium text-muted-foreground underline underline-offset-2"
            >
              Have a coupon code?
            </button>
          )}
        </div>

        {/* Checkout */}
        <section className="fade-up mt-4 rounded-3xl bg-cream p-5 text-cream-foreground">
          <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.14em] text-cream-foreground/50">
            Checking out: {spec.name} · {period === "yearly" ? "Yearly" : "Monthly"}
          </p>

          <ApplePayButton
            onPay={() => start("apple")}
            pending={pending === "apple"}
            disabled={pending !== null}
          />

          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-cream-foreground/12" />
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-cream-foreground/45">
              or
            </span>
            <span className="h-px flex-1 bg-cream-foreground/12" />
          </div>

          <div className="divide-y divide-cream-foreground/10 overflow-hidden rounded-2xl ring-1 ring-cream-foreground/10">
            <CardAccordion
              label={subscribeLabel}
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
              className="flex h-[52px] w-full items-center justify-between gap-3 px-4 text-left disabled:opacity-60"
            >
              <span className="flex items-center gap-2.5 text-[15px] font-semibold text-cream-foreground">
                <span className="flex size-[18px] items-center justify-center rounded-full bg-link text-[10px] font-bold text-link-foreground">
                  ➔
                </span>
                Pay with Link
              </span>
              {pending === "link" ? (
                <span className="size-4 animate-spin rounded-full border-2 border-cream-foreground/30 border-t-cream-foreground" />
              ) : (
                <span className="text-[12px] text-cream-foreground/50">1-click</span>
              )}
            </button>
          </div>
        </section>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11.5px] text-muted-foreground">
          <Lock className="size-3.5" strokeWidth={2} />
          Payments are processed securely via Stripe
        </p>
        <p className="mt-1.5 text-center text-[11.5px] text-muted-foreground/70">
          Cancel anytime · Renews automatically
        </p>
      </div>
    </div>
  );
}
