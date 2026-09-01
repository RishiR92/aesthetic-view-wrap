import { createFileRoute } from "@tanstack/react-router";
import { Lock, Tag } from "lucide-react";
import { useRef, useState } from "react";

import { ApplePayButton } from "@/components/apple-pay-button";
import { BillingSwitch, type Period } from "@/components/billing-switch";
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
      { property: "og:description", content: "Tasks, done for you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaymentsPage,
});

type Tier = "pro" | "ultra";

const PLANS: Record<Tier, PlanSpec> = {
  ultra: {
    id: "ultra",
    name: "Ultra",
    tasks: "100",
    monthly: "$49",
    yearly: "$499",
  },
  pro: {
    id: "pro",
    name: "Pro",
    tasks: "20",
    monthly: "$10",
    yearly: "$99",
  },
};

function PaymentsPage() {
  const [tier, setTier] = useState<Tier | null>(null);
  const [period, setPeriod] = useState<Period>("yearly");
  const [shimmer, setShimmer] = useState(false);
  const shimmerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [pending, setPending] = useState<"apple" | "link" | "card" | null>(null);

  const changePeriod = (p: Period) => {
    if (p === period) return;
    setPeriod(p);
    if (p === "yearly") {
      setShimmer(true);
      if (shimmerTimer.current) clearTimeout(shimmerTimer.current);
      shimmerTimer.current = setTimeout(() => setShimmer(false), 950);
    }
  };

  const start = (method: "apple" | "link" | "card") => {
    setPending(method);
    window.setTimeout(() => setPending(null), 1600);
  };

  const spec = tier ? PLANS[tier] : null;
  const subscribeLabel = spec ? `Subscribe to ${spec.name}` : "Subscribe";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar />

      <div className="flex-1 overflow-y-auto px-5 pb-[max(3.5rem,env(safe-area-inset-bottom))]">
        <h1 className="font-display text-[30px] leading-tight text-foreground">Choose your plan</h1>

        {/* Billing period switch */}
        <div className="mt-4">
          <BillingSwitch period={period} onChange={changePeriod} />
        </div>

        {/* Plan cards */}
        <div className="mt-4 space-y-4">
          <div className="fade-up">
            <PlanCard
              spec={PLANS.ultra}
              period={period}
              featured
              shimmer={shimmer}
              selected={tier === "ultra"}
              onSelect={() => setTier("ultra")}
            />
          </div>
          <div className="fade-up">
            <PlanCard
              spec={PLANS.pro}
              period={period}
              shimmer={shimmer}
              selected={tier === "pro"}
              onSelect={() => setTier("pro")}
            />
          </div>
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

        {/* Checkout — inactive until a plan is chosen */}
        <section
          aria-disabled={tier === null}
          className={`fade-up mt-4 rounded-3xl bg-cream p-4 text-cream-foreground transition-opacity duration-200 ${
            tier === null ? "pointer-events-none opacity-45" : ""
          }`}
        >
          <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.14em] text-cream-foreground/50">
            {spec
              ? `Checking out: Asmi ${spec.name} · ${period === "yearly" ? "Yearly" : "Monthly"}`
              : "Choose a plan above to check out"}
          </p>

          <ApplePayButton
            onPay={() => start("apple")}
            pending={pending === "apple"}
            disabled={pending !== null || tier === null}
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
              disabled={pending !== null || tier === null}
            />

            <button
              type="button"
              onClick={() => start("link")}
              disabled={pending !== null || tier === null}
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
