import { Globe } from "lucide-react";
import { useEffect, useState } from "react";

import { timezoneLabel } from "@/lib/reminders";

const STORAGE_KEY = "asmi.timezone";

const ZONES = [
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Australia/Sydney",
];

function pretty(zone: string) {
  return zone.split("/").pop()?.replace(/_/g, " ") ?? zone;
}

export function TimezoneNote() {
  const [zone, setZone] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    setZone(stored ?? timezoneLabel());
  }, []);

  if (!zone) return null;

  const options = ZONES.includes(zone) ? ZONES : [zone, ...ZONES];

  return (
    <div className="mb-4 flex items-center gap-2 text-[12.5px] text-muted-foreground">
      <Globe className="size-3.5 shrink-0" strokeWidth={1.9} />
      {editing ? (
        <select
          autoFocus
          value={zone}
          onChange={(e) => {
            setZone(e.target.value);
            window.localStorage.setItem(STORAGE_KEY, e.target.value);
            setEditing(false);
          }}
          onBlur={() => setEditing(false)}
          className="rounded-full border border-border/70 bg-secondary/50 px-2.5 py-1 text-[12.5px] text-foreground outline-none"
          aria-label="Choose your timezone"
        >
          {options.map((z) => (
            <option key={z} value={z}>
              {pretty(z)}
            </option>
          ))}
        </select>
      ) : (
        <>
          <span>
            Times shown in <span className="font-medium text-foreground">{pretty(zone)}</span>
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="font-semibold text-primary underline-offset-2 transition-opacity hover:underline active:opacity-70"
          >
            Change
          </button>
        </>
      )}
    </div>
  );
}
