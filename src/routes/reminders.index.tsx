import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { SectionHeader } from "@/components/section-header";
import { ReminderRow } from "@/components/reminder-row";
import { ReminderSheet, type ReminderDraft } from "@/components/reminder-sheet";
import { TopBar } from "@/components/top-bar";
import { useReminders } from "@/lib/reminders-store";
import {
  asmiLine,
  formatDayLabel,
  formatRelative,
  formatTime,
  groupReminders,
  nextOccurrence,
  toDateKey,
  type Reminder,
} from "@/lib/reminders";

type Search = { new?: string; id?: string };

export const Route = createFileRoute("/reminders/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    new: typeof search.new === "string" ? search.new : undefined,
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Reminders — Asmi" },
      {
        name: "description",
        content:
          "Every nudge Asmi is holding for you: set a reminder in seconds, edit it, turn it off, or delete it.",
      },
      { property: "og:title", content: "Reminders — Asmi" },
      {
        property: "og:description",
        content: "Set a reminder in seconds, then let Asmi text or call you right on time.",
      },
    ],
  }),
  component: RemindersPage,
});

function RemindersPage() {
  const { new: prefill, id } = Route.useSearch();
  const navigate = useNavigate();
  const { reminders, add, update, remove, restore, toggleStatus, byId } = useReminders();

  const [composerOpen, setComposerOpen] = useState(Boolean(prefill));
  const [editingId, setEditingId] = useState<string | undefined>(id);

  const groups = useMemo(() => groupReminders(reminders), [reminders]);
  const active = reminders.filter((r) => r.status === "active");
  const todayCount = groups.find((g) => g.key === "today")?.items.length ?? 0;

  const upNext = useMemo(() => {
    let best: { reminder: Reminder; at: Date } | null = null;
    for (const reminder of active) {
      const at = nextOccurrence(reminder);
      if (at && (!best || at < best.at)) best = { reminder, at };
    }
    return best;
  }, [active]);

  const clearSearch = () => {
    if (prefill || id) navigate({ to: "/reminders", search: {}, replace: true });
  };

  const closeSheet = () => {
    setComposerOpen(false);
    setEditingId(undefined);
    clearSearch();
  };

  const editing = editingId ? byId(editingId) : undefined;
  const sheetOpen = composerOpen || Boolean(editing);

  const handleSave = (draft: ReminderDraft) => {
    if (editing) {
      update(editing.id, draft);
      toast.success("Reminder updated", { description: asmiLine(draft) });
    } else {
      add(draft);
      toast.success("Reminder set", { description: asmiLine(draft) });
    }
    closeSheet();
  };

  const handleDelete = (reminder: Reminder) => {
    const index = reminders.findIndex((r) => r.id === reminder.id);
    remove(reminder.id);
    closeSheet();
    toast("Reminder deleted", {
      description: reminder.title,
      action: { label: "Undo", onClick: () => restore(reminder, index) },
    });
  };

  const handleToggle = (reminder: Reminder) => {
    const next = toggleStatus(reminder.id);
    toast(next === "active" ? "Reminder turned on" : "Reminder turned off", {
      description: reminder.title,
      action: { label: "Undo", onClick: () => toggleStatus(reminder.id) },
    });
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar reminderCount={todayCount} />

      <div className="flex-1 overflow-y-auto px-5 pb-28">
        <h1 className="font-display text-[30px] leading-tight text-foreground">Reminders</h1>

        {upNext ? (
          <section className="fade-up mt-4 rounded-3xl bg-cream p-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-cream-foreground/60">
              Next up
            </span>
            <p className="mt-2 text-[19px] font-semibold leading-snug text-cream-foreground">
              {upNext.reminder.title}
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-cream-foreground/70">
              <Bell className="size-3.5" strokeWidth={1.9} />
              {formatDayLabel(upNext.at)} at {formatTime(upNext.at)} · {formatRelative(upNext.at)}
            </p>
            <p className="mt-3 border-t border-cream-foreground/10 pt-3 text-[13px] font-medium text-cream-foreground/80">
              {asmiLine(upNext.reminder)}
            </p>
          </section>
        ) : (
          <section className="fade-up mt-4 rounded-3xl bg-cream p-5">
            <p className="text-[17px] font-semibold text-cream-foreground">Nothing on the calendar</p>
            <p className="mt-1.5 text-[13px] text-cream-foreground/70">
              Add one below and I'll text or call you right on time.
            </p>
          </section>
        )}

        {groups.map((group) => (
          <div key={group.key}>
            <SectionHeader label={group.label} chip={`${group.items.length}`} />
            <div className="space-y-2.5">
              {group.items.map(({ reminder, next }, i) => (
                <div key={reminder.id} className="fade-up" style={{ animationDelay: `${i * 35}ms` }}>
                  <ReminderRow
                    reminder={reminder}
                    next={next}
                    onEdit={() => setEditingId(reminder.id)}
                    onToggle={() => handleToggle(reminder)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {reminders.length === 0 ? (
          <p className="mt-8 text-center text-[14px] text-muted-foreground">
            No reminders yet. Tap “New reminder” to add your first.
          </p>
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/90 to-transparent px-5 pb-5 pt-8">
        <button
          type="button"
          onClick={() => {
            setEditingId(undefined);
            setComposerOpen(true);
          }}
          className="pointer-events-auto flex w-full items-center justify-center gap-2 rounded-full bg-cta py-4 text-[15px] font-semibold text-cta-foreground shadow-[var(--shadow-lift)] transition-transform active:scale-[0.99]"
        >
          <Plus className="size-4" strokeWidth={2.5} />
          New reminder
        </button>
      </div>

      <ReminderSheet
        open={sheetOpen}
        reminder={editing}
        prefill={editing ? undefined : prefill}
        onClose={closeSheet}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}

export { toDateKey };
