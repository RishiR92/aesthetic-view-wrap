# Options page: lift-to-select cards + a compact website link

## 1. Selection: the card physically comes forward

Drop the checkbox circle entirely. Selection is expressed the way native app cards do it — the chosen card **rises off the canvas** while the others recede.

```text
   unselected           SELECTED (lifts)          unselected
+----------------+   +====================+   +----------------+
| Noe Valley     |   |  Schubert's Bakery |   | SusieCakes     |
| flat, 100%     |   |  scale 1.02        |   | flat, 100%     |
|                |   |  soft drop shadow  |   |                |
+----------------+   |  amber hairline    |   +----------------+
    opacity 0.72     +====================+       opacity 0.72
```

Concretely, on the row cards and the hero card:

- **Selected**: `scale-[1.02]`, a real elevation shadow (`0 18px 40px -16px oklch(0.15 0.03 305 / 55%)`), a 1.5px amber hairline instead of the heavy 2px ring, and full opacity. The card also gains a slim amber bar down its left edge (3px, `rounded-full`) as a quiet "this one" marker.
- **Unselected, once something is picked**: `opacity-[0.72]` and `scale-[0.99]` — they visibly step back, so the pick reads instantly while scrolling. With nothing picked yet, all cards sit neutral at full opacity.
- **Transition**: 220ms `cubic-bezier(0.22,1,0.36,1)` on transform/opacity/shadow, so the lift feels like a spring, not a jump. Press-down (`active:scale-[0.995]`) still fires before the lift lands.
- Tap target stays the whole card; keyboard Enter/Space and `focus-visible` ring stay.
- One new token in `src/styles.css`: `--shadow-lift`, used by both cards (the current spec's "no inner shadows" rule gets one deliberate exception, reserved solely for selection).

Result: nothing added to the card's content, no radio/checkbox chrome — the hierarchy itself says which one is chosen.

## 2. Website: one word, inline

Remove the bottom action strip (it costs a hairline plus a full row of height). Instead, the word **Website** joins the existing metadata line as a link, right after the address/hours:

```text
Schubert's Bakery                    4.5 (1,860)
521 Clement St, Inner Richmond · 3.1 mi
Open · Closes 6:30 PM · Website ↗
```

- 12.5px, same size as the meta line, `text-panel-muted` with `underline underline-offset-2 decoration-panel-foreground/25`, plus a 10px `↗` arrow glyph so it reads as outbound.
- On the cream hero card, same treatment with cream-foreground tones.
- It's an `<a target="_blank" rel="noopener noreferrer">` that stops click propagation, so tapping "Website" opens the site and does not change the selection.
- The separate "Call shop" chip goes away — Asmi does the calling, so a user-facing dial link was noise. `phone` stays in the data for the call flow.

Net effect: zero extra vertical space for the link, and each card loses a divider line, so 3 options fit comfortably in one view.

## Technical notes

- `src/styles.css`: add `--shadow-lift` token.
- `src/components/place-actions.tsx`: deleted.
- `src/components/place-row.tsx`: inline Website link appended to the hours line; new `selected` / `dimmed` visual states (needs a `dimmed` prop = "something else is selected"); left amber edge bar; remove the check circle.
- `src/components/place-hero-card.tsx`: same lift/dim states and inline Website link; remove the corner check disc.
- `src/routes/task.$taskId.index.tsx`: pass `dimmed={selected !== null && selected !== place.id}` to hero and rows.
- `docs/asmi-ui-visual-spec.md`: update the selection contract (lift + dim replaces ring + check disc) and note the single allowed shadow.
