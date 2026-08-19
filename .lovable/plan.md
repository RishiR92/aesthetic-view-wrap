# Options page: website links + a sleeker tap-to-select

## 1. Where the website goes

`Place` currently has no website field, so add `website` (display host + href) and optional `phone` to the data model, then surface it in one consistent place on both card types:

- A **small footer utility strip** at the bottom of the card, separated by a hairline (`border-t border-panel-foreground/10` on rows, `border-cream-foreground/12` on the hero).
- Two quiet chip actions, left-aligned: `↗ bpatisserie.com` and `Call shop` (only if phone exists). 11px, `text-panel-muted`, globe/phone icon at 13px.
- The website chip is an `<a target="_blank" rel="noopener noreferrer">` that stops click propagation, so tapping it opens the site without selecting the card. Because rows/hero are `role="button"`, nesting the anchor is safe (no button-in-button).

This keeps the world-data card feeling like a real listing without adding a second visual language.

## 2. Tap-to-select UX

Selection today is a thin amber ring plus a small check disc. Upgrade it into one deliberate, tactile state:

```text
unselected                      selected
+----------------------------+  +============================+   <- 2px amber ring
| name            4.9 ★      |  | name            4.9 ★  (✓) |   <- amber check disc
| address · 0.6 mi           |  | address · 0.6 mi           |
| Open · Closes 6 PM         |  | Open · Closes 6 PM         |
| chips        ↗ site  Call  |  | chips        ↗ site  Call  |
+----------------------------+  +============================+
     flat panel                   panel + amber tint wash
```

- **Whole card is the tap target**, with a clear affordance: an empty `size-5` circle outline at the top-right of every unselected card, which fills amber with a check when selected. Users see there is something to pick before they tap.
- **Selected state**: `ring-2 ring-primary` + a faint amber wash over the card (`bg-primary/6` overlay), so it reads as chosen even at a glance while scrolling.
- **Press feedback**: `active:scale-[0.985]` plus a 150ms ring/opacity transition; selection is single-choice, so tapping another card moves the ring instantly.
- **Footer CTA already reacts** — it stays disabled/grey until a pick exists, then becomes the orange "Asmi will call now" button. Add the chosen place name into the label ("Asmi will call b. Patisserie") so the tap has a visible consequence.
- Keyboard: existing Enter/Space handling stays; add `focus-visible:ring-2 focus-visible:ring-ring`.

## Technical notes

- `src/lib/mock-tasks.ts`: add `website: { label: string; href: string }` and optional `phone` to `Place`; fill real values for the SF bakeries and the dental office.
- New `src/components/place-actions.tsx`: the hairline footer strip with the website/phone chips, shared by hero and row.
- `src/components/place-row.tsx` / `place-hero-card.tsx`: add the select circle → check affordance, amber wash overlay, focus ring, and render `PlaceActions`.
- `src/routes/task.$taskId.index.tsx`: CTA label includes the selected option's name.
- No new tokens; reuse `primary`, `panel`, `cream`, `border`.
