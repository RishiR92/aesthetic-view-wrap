# Asmi Reminders — built into the app, one design language

Reminders become a first-class surface inside the existing Asmi phone shell (420px desktop frame, plum canvas, amber = state, orange = the one action, cream = Asmi's voice, white = world data). Designed from scratch, informed by the best of Apple Reminders / Things / Google Keep, but Asmi-native: **Asmi does the nudging, by message or call.** Frontend only, mock/local data.

## Navigation

No bottom bar. The top-right menu glyph is the single navigation surface: it opens a sheet with **Home · Reminders · History · Payments**, with a small amber count next to Reminders for what fires today. The phone frame stays clean and content-first.

## 1. Reminders list — `/reminders`

The whole screen is one scroll, no chrome noise:

- **Next up hero (cream card)**: the single next reminder in Asmi's voice — "In 25 min I'll text you: take your meds." Time, channel glyph, repeat in plain language, and one quiet action: *Skip once*. This is the "what's about to happen" answer people open the app for.
- **Today / Tomorrow / Later** sections with the existing SectionHeader (amber uppercase label + count chip).
- **Reminder row** (`rounded-2xl bg-raised backdrop-blur-md`, `p-4`): time in `tabular-nums` on the left rail, title 15px semibold, one meta line ("Daily · message"), channel glyph, and a right-side **on/off switch** so muting a reminder is one tap from the list. Tap the row → detail; the row's kebab gives Edit and Delete, each with an Undo toast. Paused rows drop to 60% opacity with a dashed left rail.
- Empty state: cream card, serif line "Nothing to hold for you yet", plus 4 starter chips (Take meds · Call Mom · Pay rent · Stretch break) that pre-fill the composer.

## 2. Creating — one screen, one line, zero forms

Floating orange **+** at the bottom-right of the list opens a bottom sheet, not a new page:

- **Step 0 — what to remember**: a single title field, autofocused. Typing a natural line ("call mom every Sunday 6pm") is optional: Asmi parses it live and the pickers below update to show its reading, so you can always see and correct what it understood.
- **Date row**: Today / Tomorrow / This weekend / Pick a date. "Pick a date" expands an inline month calendar in place — no dialog, past days disabled.
- **Time row**: horizontal snap-scroll strip of sensible times (8:00 AM · 9:00 · 12:00 · 6:00 PM · 9:00 PM) plus a compact inline hour · minute · AM/PM wheel for anything else. Large tap targets, `tabular-nums`.
- **Repeat row**: Once / Daily / Weekdays / Weekly / Monthly / Custom. Custom reveals S M T W T F S day toggles; Monthly reads back "on the 14th". Optional "ends" line: Never / On a date / After N times.
- **Channel**: two-up Message / Call segmented control with glyphs.
- Each row's chip shows its own current value, so the whole schedule is readable at a glance with nothing expanded.
- **Confirmation line in Asmi's voice** pinned above the button: "I'll call you every Sunday at 6:00 PM." One orange **Save**; the new row fades-up into the list with a toast.
- Editing reuses this exact sheet, pre-filled — nothing new to learn.

## 3. Reminder detail — `/reminders/$id`

- White card: title, big next fire time, relative "in 3h", channel + repeat pills.
- Cream **"How Asmi will reach you"** card: preview of the actual message bubble (or "Asmi will call and say…" for calls) so the moment feels concrete before it happens.
- **Next 3 fire times** as a compact list.
- **Turn it off here**: an amber switch in the header row pauses/resumes instantly with a toast — no menu diving. Paused is unmistakable (dashed rail, "Paused" chip, greyed next-time text).
- Footer: orange *Edit* (opens the pre-filled sheet), quiet *Delete* with an Undo toast.

## 4. History — `/history`

Grouped by day, one row per fire: time gutter, title, and an outcome chip — delivered (amber), missed (muted outline), skipped (dashed). Tap a row to see the message that went out. Answers "did Asmi actually do it?".

## 5. Coming from iMessage

Reminders created in chat land here via deep links, so the chat → web handoff is one tap and never a hunt:

- `/reminders?new=<text>` opens the composer pre-filled with the parsed line.
- `/reminders/$id` opens that reminder's detail; `?edit=1` opens it straight in the edit sheet.
- A one-line cream "From your chat with Asmi" banner appears on arrival so the context is obvious, and it dismisses itself.

## UX simplifications (vs. the app you shared)

- No multi-field form page — one sheet, natural language first, chips as the safety net.
- No separate "new reminder" route to navigate back out of.
- Every destructive/state change is a one-tap Undo toast, never a confirm dialog.
- Plain-language schedules everywhere ("Weekdays at 9:00 PM"), never cron-speak.
- One navigation surface (top-right menu) instead of a bottom bar competing with content.
- No snooze — skip once or turn the reminder off covers the real intent without a third state.
- One orange action per screen; amber only for state.

## Technical notes

- New routes: `src/routes/reminders.index.tsx`, `src/routes/reminders.$id.tsx`, `src/routes/history.tsx`, `src/routes/payments.tsx`, each with its own `head()` metadata. Home stays `src/routes/index.tsx`.
- The inline bottom `<nav>` in `index.tsx` is removed; a shared `src/components/menu-sheet.tsx` behind the existing top-bar glyph carries navigation on every screen.
- New components: `menu-sheet`, `reminder-row`, `next-up-card`, `reminder-sheet` (create + edit), `date-picker-inline`, `time-picker`, `repeat-picker`, `day-toggles`, `outcome-chip`, `chat-handoff-banner`.
- Logic ported and trimmed from the uploaded app into `src/lib/reminders.ts` (types, occurrence math, formatters) plus a light `src/lib/reminders-store.tsx` context with seeded demo reminders and localStorage persistence — no backend.
- A small `parseReminderText()` helper handles the natural-language line (times, "tomorrow", weekday names, "every day/weekday/week/month").
- Reuses existing tokens (`raised`, `cream`, `cta`, `primary`, `panel`) and the `fade-up` / `pulse-ring` / `live-dots` keyframes. No new colors, no hardcoded color utilities.
- Deep-link params read via TanStack Router `validateSearch` on `/reminders`.
