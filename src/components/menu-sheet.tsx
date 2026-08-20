import { Link } from "@tanstack/react-router";
import { Bell, CreditCard, History, House, Plus, X } from "lucide-react";

const ITEMS = [
  { to: "/", label: "Home", icon: House },
  { to: "/reminders", label: "Reminders", icon: Bell },
  { to: "/history", label: "History", icon: History },
  { to: "/payments", label: "Payments", icon: CreditCard },
] as const;

export function MenuSheet({
  open,
  onClose,
  reminderCount,
}: {
  open: boolean;
  onClose: () => void;
  reminderCount?: number | undefined;
}) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
      />
      <div className="fade-up absolute inset-x-3 top-3 rounded-3xl border border-border/60 bg-card p-5 shadow-[var(--shadow-lift)]">
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl italic tracking-tight text-foreground">asmi</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </div>

        <nav aria-label="Main" className="mt-4 space-y-1">
          <Link
            to="/reminders"
            search={{ new: "1" }}
            onClick={onClose}
            className="mb-2 flex items-center gap-3 rounded-2xl bg-primary/15 px-3 py-3 text-[15px] font-semibold text-foreground ring-1 ring-primary/40 transition-colors hover:bg-primary/25"
          >
            <Plus className="size-5 shrink-0" strokeWidth={2.2} />
            New reminder
          </Link>
          {ITEMS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              onClick={onClose}
              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
            >
              <Icon className="size-5 shrink-0" strokeWidth={1.75} />
              <span className="flex-1">{label}</span>
              {to === "/reminders" && reminderCount ? (
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  {reminderCount} today
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
