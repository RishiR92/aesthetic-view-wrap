import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  addDays,
  toDateKey,
  type HistoryEntry,
  type Reminder,
  type Status,
} from "./reminders";

const STORAGE_KEY = "asmi.reminders.v1";

function seed(): Reminder[] {
  const now = new Date();
  const today = toDateKey(now);
  return [
    {
      id: "meds",
      title: "Take your evening meds",
      date: today,
      time: "21:00",
      channel: "message",
      repeat: "daily",
      status: "active",
      note: "With a full glass of water",
    },
    {
      id: "stretch",
      title: "Stretch break",
      date: today,
      time: "15:30",
      channel: "message",
      repeat: "weekdays",
      status: "active",
    },
    {
      id: "call-mom",
      title: "Call Mom",
      date: toDateKey(addDays(now, (7 - now.getDay()) % 7 || 7)),
      time: "18:00",
      channel: "call",
      repeat: "weekly",
      status: "active",
      note: "She loves a Sunday catch-up",
    },
    {
      id: "rent",
      title: "Pay rent",
      date: toDateKey(new Date(now.getFullYear(), now.getMonth(), 1)),
      time: "09:00",
      channel: "call",
      repeat: "monthly",
      status: "active",
    },
    {
      id: "water",
      title: "Drink a glass of water",
      date: today,
      time: "11:00",
      channel: "message",
      repeat: "daily",
      status: "paused",
    },
  ];
}

function seedHistory(): HistoryEntry[] {
  const now = new Date();
  const at = (dayOffset: number, h: number, m: number) => {
    const d = addDays(now, dayOffset);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };
  return [
    {
      id: "h1",
      title: "Stretch break",
      at: at(0, 15, 30),
      channel: "message",
      outcome: "delivered",
      message: "Stretch break — loosen up for a few minutes.",
    },
    {
      id: "h2",
      title: "Drink a glass of water",
      at: at(0, 11, 0),
      channel: "message",
      outcome: "skipped",
      message: "You skipped this one.",
    },
    {
      id: "h3",
      title: "Take your evening meds",
      at: at(-1, 21, 0),
      channel: "message",
      outcome: "delivered",
      message: "Take your evening meds — with a full glass of water.",
    },
    {
      id: "h4",
      title: "Call Mom",
      at: at(-3, 18, 0),
      channel: "call",
      outcome: "missed",
      message: "Asmi called twice, no answer.",
    },
    {
      id: "h5",
      title: "Pay rent",
      at: at(-5, 9, 0),
      channel: "call",
      outcome: "delivered",
      message: "Asmi called and walked you through the payment.",
    },
  ];
}

type Ctx = {
  reminders: Reminder[];
  history: HistoryEntry[];
  hydrated: boolean;
  add: (r: Omit<Reminder, "id">) => Reminder;
  update: (id: string, patch: Partial<Reminder>) => void;
  remove: (id: string) => Reminder | undefined;
  restore: (r: Reminder, index: number) => void;
  toggleStatus: (id: string) => Status;
  skipNext: (id: string, dateKey: string) => void;
  byId: (id: string) => Reminder | undefined;
};

const RemindersContext = createContext<Ctx | null>(null);

export function RemindersProvider({ children }: { children: ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>(() => seed());
  const [history] = useState<HistoryEntry[]>(() => seedHistory());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setReminders(JSON.parse(stored) as Reminder[]);
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    } catch {
      /* storage full or unavailable */
    }
  }, [reminders, hydrated]);

  const add = useCallback((r: Omit<Reminder, "id">) => {
    const created: Reminder = { ...r, id: `r-${Date.now().toString(36)}` };
    setReminders((prev) => [created, ...prev]);
    return created;
  }, []);

  const update = useCallback((id: string, patch: Partial<Reminder>) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const remove = useCallback(
    (id: string) => {
      const found = reminders.find((r) => r.id === id);
      setReminders((prev) => prev.filter((r) => r.id !== id));
      return found;
    },
    [reminders],
  );

  const restore = useCallback((r: Reminder, index: number) => {
    setReminders((prev) => {
      const next = [...prev];
      next.splice(Math.min(index, next.length), 0, r);
      return next;
    });
  }, []);

  const toggleStatus = useCallback(
    (id: string) => {
      const current = reminders.find((r) => r.id === id);
      const next: Status = current?.status === "paused" ? "active" : "paused";
      setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
      return next;
    },
    [reminders],
  );

  const skipNext = useCallback((id: string, dateKey: string) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, skipped: [...(r.skipped ?? []), dateKey] } : r,
      ),
    );
  }, []);

  const byId = useCallback((id: string) => reminders.find((r) => r.id === id), [reminders]);

  const value = useMemo<Ctx>(
    () => ({ reminders, history, hydrated, add, update, remove, restore, toggleStatus, skipNext, byId }),
    [reminders, history, hydrated, add, update, remove, restore, toggleStatus, skipNext, byId],
  );

  return <RemindersContext.Provider value={value}>{children}</RemindersContext.Provider>;
}

export function useReminders(): Ctx {
  const ctx = useContext(RemindersContext);
  if (!ctx) throw new Error("useReminders must be used inside <RemindersProvider>");
  return ctx;
}
