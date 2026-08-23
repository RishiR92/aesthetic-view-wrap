import { createFileRoute } from "@tanstack/react-router";
import { Check, ChevronDown, CreditCard, Lock, Tag } from "lucide-react";
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
          "Subscribe to Asmi Unlimited: unlimited tasks, calls and messages handled for you, monthly or yearly, cancel anytime.",
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
  "Plan and coordinate with friends",
  "Book appointments and services",
  "Place orders and get info from the offline world",
  "Resolve disputes with banks, insurance, support",
];

type PlanId = "monthly" | "yearly";

const PLANS: {
  id: PlanId;
  label: string;
  price: string;
  unit: string;
  note?: string;
  badge?: string;
}[] = [
  { id: "monthly", label: "Monthly", price: "$10", unit: "/mo", note: "Billed every month" },
  {
    id: "yearly",
    label: "Yearly",
    price: "$99",
    unit: "/yr",
    note: "$8.25 / mo, billed yearly",
    badge: "Save 18%",
  },
];

function PaymentsPage() {
  const [plan, setPlan] = useState<PlanId>("yearly");
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [pending, setPending] = useState<"apple" | "link" | "card" | null>(null);

  const start = (method: "apple" | "link" | "card") => {
    setPending(method);
    window.setTimeout(() => setPending(null), 1600);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar />

      <div className="flex-1 overflow-y-auto px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Subscription &amp; billing
        </p>
        <h1 className="mt-2 font-display text-[30px] leading-tight text-foreground">
          Asmi Unlimited
        </h1>
        <p className="mt-1.5 text-[13.5px] text-muted-foreground">
          One plan. Unlimited tasks, done for you.
        </p>

        <section className="fade-up mt-5 rounded-3xl bg-cream p-5 text-cream-foreground">
          <ul className="space-y-2.5">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[13.5px] leading-snug">
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>

          {/* Plan choice */}
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
                  onClick={() => setPlan(p.id)}
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
                    <span className="text-[12px] text-cream-foreground/60">{p.unit}</span>
                  </span>
                  {p.note ? (
                    <span className="mt-1 block text-[10.5px] leading-snug text-cream-foreground/55">
                      {p.note}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Coupon */}
          <div className="mt-4 border-t border-cream-foreground/12 pt-3.5">
            {applied ? (
              <div className="flex items-center justify-between gap-2 rounded-2xl bg-primary/12 px-3 py-2.5">
                <span className="flex items-center gap-2 text-[12.5px] font-semibold text-cream-foreground">
                  <Tag className="size-3.5 text-primary" strokeWidth={2} />
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
                  className="h-11 min-w-0 flex-1 rounded-2xl bg-cream-foreground/6 px-3.5 text-[13.5px] tracking-wide text-cream-foreground outline-none placeholder:text-cream-foreground/40 focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  disabled={!coupon.trim()}
                  onClick={() => setApplied(coupon.trim())}
                  className="h-11 shrink-0 rounded-2xl bg-cream-foreground/10 px-4 text-[13px] font-semibold text-cream-foreground transition-transform active:scale-[0.99] disabled:opacity-40"
                >
                  Apply
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setCouponOpen(true)}
                className="flex items-center gap-2 text-[13px] font-medium text-cream-foreground/70"
              >
                <Tag className="size-3.5 text-primary" strokeWidth={2} />
                Have a coupon code?
                <ChevronDown className="size-3.5" strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Payment methods */}
          <div className="mt-4 space-y-2.5">
            <ApplePayButton
              onPay={() => start("apple")}
              pending={pending === "apple"}
              disabled={pending !== null}
            />

            <button
              type="button"
              onClick={() => start("link")}
              disabled={pending !== null}
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-link px-4 text-[15px] font-semibold text-link-foreground transition-transform active:scale-[0.99] disabled:opacity-60"
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

          <p className="mt-3.5 text-center text-[11px] text-cream-foreground/55">
            {plan === "yearly" ? "$99 billed yearly" : "$10 billed monthly"} · Cancel anytime
          </p>
        </section>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11.5px] text-muted-foreground">
          <Lock className="size-3.5" strokeWidth={2} />
          Payments are processed securely. Card details never touch Asmi.
        </p>
      </div>
    </div>
  );
}
