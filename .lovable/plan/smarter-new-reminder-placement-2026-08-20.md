# Smarter "New reminder" placement

## Goal
Replace the large top-of-page "New reminder" CTA and the menu-sheet entry with a smaller, more integrated trigger that still feels instant on mobile.

## Changes

### 1. Remove the big CTA from `/reminders`
- Delete the full-width `cta-fill` button at the top of `src/routes/reminders.index.tsx`.
- Keep the "Next up" hero as the first element in the scrollable content.

### 2. Remove "New reminder" from the menu sheet
- Remove the highlighted `New reminder` row from `src/components/menu-sheet.tsx`.
- Keep the four nav items: Home, Reminders, History, Payments.
- Remove the now-unused `Plus` import from `menu-sheet.tsx`.

### 3. Add a compact inline trigger at the start of the reminders list
- Insert a small, non-sticky row just above the "Next up" hero in `src/routes/reminders.index.tsx`.
- Visual treatment:
  - Height ~40 px, rounded-full pill shape.
  - Transparent/raised surface with a 1 px subtle border.
  - Left: small `Plus` icon in primary color.
  - Text: "New reminder" in `text-[15px] font-semibold text-foreground`.
  - Right: subtle chevron or no ornament.
  - Full-width tappable row, but visually light — not a filled button.
- Behavior: tapping opens the same `ReminderSheet` composer.
- This keeps the trigger at the start of the scrollable page (better per earlier feedback) without dominating the screen.

### 4. Empty-state copy update
- If the reminders list is empty, replace the current "Tap 'New reminder' to add your first" line with copy that points to the new inline pill above it.

## Files to edit
- `src/routes/reminders.index.tsx`
- `src/components/menu-sheet.tsx`

## Out of scope
- No changes to the reminder sheet composer, date/time pickers, or color theme.
- No changes to the bottom/top navigation pattern beyond removing the menu entry.
