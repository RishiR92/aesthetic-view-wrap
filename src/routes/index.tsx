import { createFileRoute } from "@tanstack/react-router";
import { Clock, CreditCard, Home } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Asmi — nothing active right now" },
      {
        name: "description",
        content: "Your Asmi home screen: see what's running and text Asmi to get something done.",
      },
      { property: "og:title", content: "Asmi — nothing active right now" },
      {
        property: "og:description",
        content: "Your Asmi home screen: see what's running and text Asmi to get something done.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-7 pb-8 pt-10">
        <h1 className="font-display text-3xl italic tracking-tight text-foreground">asmi</h1>

        <section className="mt-9 rounded-2xl border border-border bg-gradient-to-br from-accent/25 to-transparent p-5">
          <span aria-hidden className="text-xl text-primary">
            ✦
          </span>
          <h2 className="mt-3 text-xl font-bold text-foreground">Good night</h2>
          <p className="mt-1 text-sm text-muted-foreground">Asmi's on it while you rest</p>
        </section>

        <section className="mt-6 flex flex-col items-center justify-center gap-4 rounded-2xl border border-border px-6 py-20 text-center">
          <div className="grid size-14 place-items-center rounded-full bg-accent/25">
            <span className="size-4 rounded-full bg-muted-foreground" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">Nothing active right now</p>
            <p className="mt-1 text-sm text-muted-foreground">Text Asmi to get something done</p>
          </div>
        </section>
      </div>

      <nav className="grid shrink-0 grid-cols-3 bg-tabbar py-4 text-tabbar-foreground">
        <span className="flex flex-col items-center gap-1.5 text-primary">
          <Home className="size-5" strokeWidth={1.75} />
          <span className="text-xs font-medium">Home</span>
        </span>
        <span className="flex flex-col items-center gap-1.5">
          <Clock className="size-5" strokeWidth={1.75} />
          <span className="text-xs font-medium">History</span>
        </span>
        <span className="flex flex-col items-center gap-1.5">
          <CreditCard className="size-5" strokeWidth={1.75} />
          <span className="text-xs font-medium">Payments</span>
        </span>
      </nav>
    </div>
  );
}
