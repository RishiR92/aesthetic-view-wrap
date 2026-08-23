import { createFileRoute } from "@tanstack/react-router";
import { Check, Lock, Tag } from "lucide-react";
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
  note: string;
  badge?: string;
}[] = [
  { id: "monthly", label: "Monthly", price: "$10", period: "/mo", note: "Billed monthly" },
  {
    id: "yearly",
    label: "Yearly",
    price: "$99",
    period: "/yr",
    note: "$8.25/mo, billed yearly",
    badge: "Best value",
  },
];

const INCLUDED = [
  "Unlimited tasks, every month",
  "Asmi calls, texts and emails on your behalf",
  "Reminders, follow-ups and confirmations handled",
];

function PaymentsPage() {
  const [plan, setPlan] = useState<PlanId>("yearly");
  const [cardOpen, setCardOpen] = useState(false);
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
        <h1 className="font-display text-[30px] leading-tight text-foreground">Asmi Unlimited</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">One plan. Unlimited tasks.</p>

        {/* Plan card */}
        <section className="fade-up mt-5 rounded-3xl bg-cream p-5 text-cream-foreground">
          <div role="radiogroup" aria-label="Billing period" className="grid grid-cols-2 gap-2.5">
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
                  className={`relative overflow-hidden rounded-2xl p-3.5 pt-5 text-left transition-[transform,box-shadow,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    active
                      ? "bg-primary/12 shadow-[var(--shadow-lift)] ring-1 ring-primary"
                      : "scale-[0.98] bg-cream-foreground/6 opacity-[0.78] ring-1 ring-cream-foreground/10"
                  }`}
                >
                  {p.badge ? (
                    <span className="absolute left-0 top-0 rounded-br-xl bg-primary px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-primary-foreground">
                      {p.badge}
                    </span>
                  ) : null}
                  <span className="flex items-baseline gap-1">
                    <span className="font-display text-[30px] leading-none">{p.price}</span>
                    <span className="text-[13px] text-cream-foreground/60">{p.period}</span>
                  </span>
                  <span className="mt-1.5 block text-[11.5px] leading-snug text-cream-foreground/55">
                    {p.note}
                  </span>
                </button>
              );
            })}
          </div>

          <ul className="mt-5 space-y-2.5 border-t border-cream-foreground/12 pt-4">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-snug">
                <Check className="mt-[2px] size-4 shrink-0 text-primary" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>

          {/* Coupon — quiet, above payment */}
          <div className="mt-4">
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
                className="text-[12.5px] font-medium text-cream-foreground/65 underline underline-offset-2"
              >
                Have a coupon code?
              </button>
            )}
          </div>
        </section>

        {/* Checkout */}
        <section className="fade-up mt-4 rounded-3xl bg-cream p-5 text-cream-foreground">
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
