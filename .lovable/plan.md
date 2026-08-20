# Asmi Reminders — built into the app, one design language

Reminders become a first-class surface inside the existing Asmi phone shell (420px desktop frame, plum canvas, amber = state, orange = the one action, cream = Asmi's voice, white = world data). Designed from scratch, informed by the best of Apple Reminders / Things / Google Keep, but Asmi-native: **Asmi does the nudging, by message or call.** Frontend only, mock/local data.

## Navigation

Bottom tab bar becomes real links: **Home · Reminders · History** (Payments moves into the top-bar menu — it isn't a daily destination). Reminders tab shows a small amber count of what fires today.

## 1. Reminders list — `/reminders`

The whole screen is one scroll, no chrome noise:

- **Next up hero (cream card)**: the single next reminder in Asmi's voice — "In 25 min I'll text you: take your meds." Time, channel glyph, repeat in plain language, and two quiet actions: *Snooze 1h* · *Skip once*. This is the "what's about to happen" answer people actually open the app for.
- **Today / Tomorrow / Later** sections with the existing SectionHeader (amber uppercase label + count chip).
- **Reminder row** (`rounded-2xl bg-raised backdrop-blur-md`, `p-4`): time in `tabular-nums` on the left rail, title 15px semibold, one meta line ("Daily · message"), channel glyph, and a right-side **done/complete circle**. Tap the row → detail. Long-press / kebab → Pause, Edit, Delete (all with an Undo toast). Paused rows drop to 60% opacity with a dashed left rail instead of a solid one.
- Empty state: cream card, serif line "Nothing to hold for you yet", plus 4 starter chips (Take meds · Call Mom · Pay rent · Stretch break) that pre-fill the composer.

## 2. Creating — one screen, one line, zero forms

Floating orange **+** above the tab bar opens a bottom sheet, not a new page:

- **Natural-language line first**: "call mom every Sunday 6pm". As you type, Asmi parses it live and the chips below light up to show its reading — you never have to trust a black box.
- **Chip rail underneath** for correcting/setting everything without typing: date (Today / Tomorrow / Pick a day), time (a horizontal time strip + custom), repeat (Once / Daily / Weekdays / Weekly / Monthly / Custom days as S M T W T F S toggles), channel (Message / Call).
- **Confirmation line in Asmi's voice** at the bottom of the sheet: "I'll call you every Sunday at 6:00 PM." One orange **Save** button. Save closes the sheet and the new row fades-up into place with a toast.
- Editing reuses the exact same sheet, pre-filled — nothing new to learn.

## 3. Reminder detail — `/reminders/$id`

- White card: title, big next fire time, relative "in 3h", channel + repeat pills.
- Cream **"How Asmi will reach you"** card: preview of the actual message bubble (or "Asmi will call and say…" for calls) so the moment feels concrete before it happens.
- **Next 3 fire times** as a compact list.
- Footer: orange *Edit*, quiet *Pause* and *Delete*.

## 4. History — `/history`

Grouped by day, one row per fire: time gutter, title, and an outcome chip — delivered (amber), missed (muted outline), snoozed (dashed). Tap a row to see the message that went out. Answers "did Asmi actually do it?".

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
- Payments demoted out of the tab bar; History earns its place because trust is the product.
- One orange action per screen; amber only for state.

## Technical notes

- New routes: `src/routes/reminders.index.tsx`, `src/routes/reminders.$id.tsx`, `src/routes/history.tsx`, `src/routes/payments.tsx`, each with its own `head()` metadata. Home stays `src/routes/index.tsx`.
- The tab bar becomes a shared `src/components/tab-bar.tsx` used by all tabbed screens, replacing the inline `<nav>` in `index.tsx`.
- New components: `reminder-row`, `next-up-card`, `reminder-sheet` (composer/editor), `chip-rail`, `day-toggles`, `outcome-chip`, `chat-handoff-banner`.
- Logic ported and trimmed from the uploaded app into `src/lib/reminders.ts` (types, occurrence math, formatters) plus a light `src/lib/reminders-store.tsx` context with seeded demo reminders and localStorage persistence — no backend.
- A small `parseReminderText()` helper handles the natural-language line (times, "tomorrow", weekday names, "every day/weekday/week/month").
- Reuses existing tokens (`raised`, `cream`, `cta`, `primary`, `panel`) and the `fade-up` / `pulse-ring` / `live-dots` keyframes. No new colors, no hardcoded color utilities.
- Deep-link params read via TanStack Router `validateSearch` on `/reminders`.
