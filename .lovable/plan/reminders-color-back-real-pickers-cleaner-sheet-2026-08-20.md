# Reminders: color back, real pickers, cleaner sheet

## 1. Remove the summary strip
Delete the cream "I'll text you every day at 9:00 PM / First one in 3h · America/Los_Angeles" block from the bottom of the reminder sheet. The footer keeps only the Set reminder / Save changes button, so the sheet ends on the action. The timing confirmation still shows in the toast after saving and on the Next up card in the list.

## 2. Bring the color back
The palette went nearly greyscale when orange was removed — chroma was dialed down to ~0.02-0.05, so plum reads as grey and every accent looks white. Fix by restoring saturation while staying off yellow/orange entirely:

- Background: deeper, clearly purple plum (chroma ~0.055) instead of grey-violet.
- Accent / selected state: a real **orchid-violet** (around `oklch(0.72 0.15 305)`) for selected chips, day toggles, focus rings, and channel selection — visibly colored, not white.
- Secondary accent: a muted **rose-mauve** (`oklch(0.68 0.13 350)`) used for status dots, live pulses, and the aurora bloom, so the app has two-tone warmth without any yellow.
- Primary button: violet-to-rose gradient fill with near-white text, replacing the current pale ivory pill.
- Cream / white panels keep their meaning (cream = Asmi's voice, white = world data), but get a faint violet tint so they sit in the palette instead of floating.

Everything stays inside `src/styles.css` tokens, so all screens (home, options, execution, reminders, history, payments) pick the color up at once.

## 3. Date and time picking that actually works
Native `<input type=date/time>` behind an overlay is unreliable and looks like a browser widget — replace it with in-sheet custom pickers:

**Date**
- Row of quick chips: Today, Tomorrow, then the next few weekday shortcuts.
- A "Choose date" row that expands inline into a compact month calendar (shadcn Calendar, styled to the plum theme): month arrows, weekday header, dot on today, filled violet circle on the selected day. Past dates disabled. Tapping a day collapses the calendar back to the summary row.

**Time**
- Tapping the time row opens an inline **scroll wheel** picker: three snap-scroll columns (hour, 5-minute steps, AM/PM) with the centered value highlighted and a soft violet selection band — the Apple wheel feel, works with touch drag and mouse wheel, no native dialog.
- Above it, three contextual quick chips (Morning 9:00 AM, Evening 6:00 PM, Night 9:00 PM) for one-tap common cases; no pre-selected value, the field reads "Choose time" until the user picks.

Both pickers are full-width, 48px+ targets, thumb-reachable, and only one is expanded at a time so the sheet never gets long.

## Technical notes
- `src/styles.css`: raise chroma on background/card/secondary, add `--accent-violet` and `--accent-rose` tokens, gradient token for the primary button, register in `@theme inline`.
- `src/components/reminder-sheet.tsx`: drop the footer summary block and `PickerField`; add `DateField` (chips + inline `Calendar` from `@/components/ui/calendar`, `pointer-events-auto`) and `TimeWheel` (snap-scroll columns with IntersectionObserver/scroll-snap value read).
- Reminder state/schedule logic in `src/lib/reminders.ts` stays unchanged; only presentation changes.
- Also fix the SSR hydration mismatch on `/reminders` (Next up computed from `new Date()` during render) by computing the next occurrence after mount.
