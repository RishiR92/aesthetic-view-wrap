import { Link } from "@tanstack/react-router";
import { ChevronLeft, Menu } from "lucide-react";
import { useState } from "react";

import { MenuSheet } from "@/components/menu-sheet";

export function TopBar({
  back,
  backTo = "/",
  title,
  reminderCount,
}: {
  back?: boolean;
  backTo?: string;
  title?: string;
  reminderCount?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex shrink-0 items-center justify-between px-6 pb-3 pt-6">
        {back ? (
          <Link
            to={backTo}
            className="-ml-2 flex items-center gap-1 rounded-full px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            {title ?? "Back"}
          </Link>
        ) : (
          <Link to="/" className="font-display text-2xl italic tracking-tight text-foreground">
            asmi
          </Link>
        )}
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen(true)}
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Menu className="size-5" strokeWidth={1.75} />
        </button>
      </header>

      <MenuSheet open={open} onClose={() => setOpen(false)} reminderCount={reminderCount} />
    </>
  );
}
