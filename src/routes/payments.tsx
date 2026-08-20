import { createFileRoute } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";

import { TopBar } from "@/components/top-bar";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Payments — Asmi" },
      {
        name: "description",
        content: "Manage the card Asmi uses when it books, orders, or pays on your behalf.",
      },
      { property: "og:title", content: "Payments — Asmi" },
      {
        property: "og:description",
        content: "The card Asmi uses when it books, orders, or pays for you.",
      },
    ],
  }),
  component: PaymentsPage,
});

function PaymentsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar />

      <div className="flex-1 overflow-y-auto px-5 pb-10">
        <h1 className="font-display text-[30px] leading-tight text-foreground">Payments</h1>
        <p className="mt-1.5 text-[13.5px] text-muted-foreground">
          The card Asmi uses when a task needs paying for.
        </p>

        <div className="fade-up mt-5 rounded-3xl bg-raised p-5 backdrop-blur-md">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
            <CreditCard className="size-5" strokeWidth={1.75} />
          </span>
          <p className="mt-3 text-[17px] font-semibold text-foreground">No card on file</p>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            Add one and Asmi can pay deposits and place orders without checking in.
          </p>
          <button
            type="button"
            className="cta-fill mt-4 w-full rounded-full py-3.5 text-[15px] font-semibold transition-transform active:scale-[0.99]"
          >
            Add a card
          </button>
        </div>
      </div>
    </div>
  );
}
