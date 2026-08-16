import type { ReactNode } from "react";

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background sm:grid sm:place-items-center sm:p-8">
      {/* Aurora backdrop (desktop only) */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden aurora-grain sm:block">
        <div className="absolute -left-[15%] -top-[20%] h-[70vh] w-[70vw] rounded-full bg-aurora-violet opacity-40 blur-[140px] aurora-bloom" />
        <div
          className="absolute -bottom-[25%] -right-[10%] h-[60vh] w-[60vw] rounded-full bg-aurora-amber opacity-15 blur-[160px] aurora-bloom"
          style={{ animationDelay: "-13s" }}
        />
      </div>

      <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background sm:h-[860px] sm:max-h-[calc(100vh-4rem)] sm:min-h-0 sm:w-[420px] sm:rounded-shell sm:border sm:border-border/60 sm:shadow-[0_40px_100px_-20px_oklch(0.15_0.03_305/70%)]">
        {children}
      </div>
    </div>
  );
}
