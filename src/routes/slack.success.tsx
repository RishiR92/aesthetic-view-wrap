import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, LockKeyhole, Settings2, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type SlackSuccessSearch = {
  workspace: string | undefined;
};

export const Route = createFileRoute("/slack/success")({
  validateSearch: (search: Record<string, unknown>): SlackSuccessSearch => ({
    workspace: typeof search["workspace"] === "string" ? search["workspace"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Asmi is connected to Slack" },
      {
        name: "description",
        content: "Asmi was successfully added to your Slack workspace.",
      },
      { property: "og:title", content: "Asmi is connected to Slack" },
      {
        property: "og:description",
        content: "Asmi was successfully added to your Slack workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SlackSuccessPage,
});

function SlackMark() {
  return (
    <svg aria-label="Slack" className="size-8" viewBox="0 0 48 48" role="img">
      <rect className="fill-slack-blue" x="20" y="2" width="8" height="19" rx="4" />
      <rect className="fill-slack-blue" x="10" y="11" width="8" height="8" rx="4" />
      <rect className="fill-slack-green" x="29" y="20" width="17" height="8" rx="4" />
      <rect className="fill-slack-green" x="29" y="10" width="8" height="8" rx="4" />
      <rect className="fill-slack-yellow" x="20" y="29" width="8" height="17" rx="4" />
      <rect className="fill-slack-yellow" x="30" y="30" width="8" height="8" rx="4" />
      <rect className="fill-slack-red" x="2" y="20" width="17" height="8" rx="4" />
      <rect className="fill-slack-red" x="11" y="30" width="8" height="8" rx="4" />
    </svg>
  );
}

function SlackSuccessPage() {
  const { workspace } = Route.useSearch();
  const [closeMessage, setCloseMessage] = useState(false);
  const workspaceName = workspace?.trim() || "your workspace";

  const closeWindow = () => {
    window.close();
    window.setTimeout(() => setCloseMessage(true), 150);
  };

  return (
    <main className="min-h-screen bg-success-surface font-sans text-success-ink">
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] lg:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.8fr)]">
        <section className="relative flex min-h-[62vh] flex-col justify-between overflow-hidden px-6 pb-10 pt-7 sm:px-10 sm:pb-14 sm:pt-9 lg:min-h-screen lg:px-16 lg:py-14 xl:px-24">
          <div className="absolute -left-28 bottom-12 size-80 rounded-full bg-aurora-violet/15 blur-[110px]" />

          <Link
            to="/"
            className="relative z-10 w-fit font-display text-[28px] italic text-success-ink transition-opacity hover:opacity-80"
          >
            asmi
          </Link>

          <div className="relative z-10 max-w-[740px] py-16 success-resolve sm:py-24 lg:py-12">
            <div className="mb-9 flex items-center gap-5" aria-hidden="true">
              <div className="grid size-14 place-items-center rounded-lg border border-success-line bg-success-panel shadow-[0_16px_40px_-20px_oklch(0.08_0.02_305/80%)]">
                <span className="font-display text-xl italic">a</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary/35" />
                <span className="size-1.5 rounded-full bg-primary/65" />
                <span className="size-1.5 rounded-full bg-primary" />
              </div>
              <div className="relative grid size-14 place-items-center rounded-lg border border-success-line bg-success-ink shadow-[0_16px_40px_-20px_oklch(0.08_0.02_305/80%)]">
                <SlackMark />
                <span className="absolute -bottom-2 -right-2 grid size-6 place-items-center rounded-full border-[3px] border-success-surface bg-success-positive text-success-surface">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
              </div>
            </div>

            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Connection complete
            </p>
            <h1 className="font-success-display max-w-[700px] text-[clamp(2.5rem,6vw,5.6rem)] font-semibold leading-[1.02]">
              Asmi is ready in Slack.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-success-muted sm:text-lg sm:leading-8">
              Your team can now reach Asmi where work already happens. The connection is live and ready to use.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-xs text-success-muted">
            <LockKeyhole className="size-3.5" />
            Authorized securely through Slack
          </div>
        </section>

        <aside className="flex items-center border-t border-success-line bg-success-panel px-6 py-10 sm:px-10 lg:border-l lg:border-t-0 lg:px-12 xl:px-16">
          <div className="w-full success-resolve [animation-delay:120ms]">
            <div className="flex items-start justify-between gap-5 border-b border-success-line pb-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-success-muted">
                  Connected workspace
                </p>
                <h2 className="font-success-display mt-3 break-words text-2xl font-semibold text-success-ink">
                  {workspaceName}
                </h2>
              </div>
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-success-positive/15 text-success-positive">
                <Check className="size-4" strokeWidth={2.5} />
              </span>
            </div>

            <div className="space-y-6 py-7">
              <div className="flex gap-3.5">
                <SlackMark />
                <div>
                  <p className="text-sm font-semibold text-success-ink">Slack access is active</p>
                  <p className="mt-1 text-sm leading-6 text-success-muted">
                    Asmi can work in the channels and conversations you approved.
                  </p>
                </div>
              </div>
              <div className="flex gap-3.5">
                <Settings2 className="mt-1 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-success-ink">You stay in control</p>
                  <p className="mt-1 text-sm leading-6 text-success-muted">
                    Permissions can be reviewed or changed from your Slack settings anytime.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-success-line pt-7">
              <Button asChild size="lg" className="h-12 w-full justify-between bg-primary px-5 text-primary-foreground shadow-none hover:bg-primary/90">
                <Link to="/">
                  Open Asmi
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={closeWindow}
                className="h-11 w-full text-success-muted hover:bg-success-surface/40 hover:text-success-ink"
              >
                <X className="size-4" />
                Close this window
              </Button>
              {closeMessage ? (
                <p className="text-center text-xs text-success-muted" role="status">
                  You can safely close this tab.
                </p>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}