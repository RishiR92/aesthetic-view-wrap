# Asmi: image-forward results, live task cards, execution detail

Three screens, built as real routes inside the existing phone shell. All visual/frontend only — mock data, no backend.

## 1. Home (`/`)

- Top bar: serif `asmi` wordmark left, menu glyph right.
- Greeting card: keeps the cool-to-cream gradient, tighter padding, weather glyph, "Good afternoon, Rish!" + one status line.
- `NEEDS YOU` section: one raised card per pending task. Title, a `7 options ready` live row, and a **horizontal snap-scroll strip of photo tiles** (4:3 image, name + meta below, no white polaroid border). Tapping the card opens the results screen.
- `TASKS IN MOTION`: each live task becomes a **card on a translucent raised surface** (blurred plum, 1px rim light) instead of bare text. Inside: pulsing amber status ring, task title, live line ("Calling Glen Park Dental…" with animated ellipsis), a 3-step progress spine (Call / Message / Confirm), and `4m ago` muted right.
- Below the list: "Asmi can also…" row of 3 tappable prompt chips, so the screen never ends in dead plum.

## 2. Results / option picker (`/task/$taskId`)

- Header card (white): SERVICE pill, title, one-line brief.
- `ASMI ACTIONS` cream card unchanged in content, tightened type.
- **Recommended option = hero card**: full-bleed 16:10 photo at top, dark scrim at the bottom of the image, `✦ ASMI PICK` badge floating on the image, then name, rating, Asmi's italic reason, and tag chips below. Photo is a snap-scroll carousel with dot indicators.
- **Other options = 2-column tile grid**: 4:3 photo, name + rating overlaid on a scrim. Whole tile is the tap target; selection shows a 2px amber ring plus a check badge — the small radio circles go away.
- "View 3 more options" as a quiet full-width expander.
- Sticky bottom CTA: muted/disabled look until something is selected, then solid orange with a press-scale.

## 3. Execution detail (`/task/$taskId/status`)

Rebuild of the shared screenshot, same information, stronger hierarchy:

- White header card: SERVICE pill, title, brief.
- `DETAILS CONFIRMED WITH ASMI` collapsed row with a `1 ANSWERED` chip.
- `EXECUTION` cream card:
  - Current step headline: label, "Message sent to +1 415 585 1500", and a live `Waiting on a reply · 7:36` pill with a pulsing dot.
  - **Channel spine** (Call → Retry → Message → Email) as connected circular nodes: done = filled muted, skipped = dashed outline, active = solid orange with glow, next = outline. Solid connector behind completed segments, dashed ahead.
  - `TIMELINE` rows: time in muted mono-ish micro type, event text in body. Rows get 1px hairline separators for rhythm.
  - "View third-party chat" as a real expandable panel showing the message thread bubbles.

## Cross-screen cleanup

- One accent: amber for status/labels, orange reserved for primary CTAs. The blue on SERVICE pills and radio dots is removed.
- Card color rule: cream = Asmi's own voice, white = external/place data.
- Section headers get a row layout (label left, count chip right) and more air above.
- Entry motion: cards fade-up with a 40ms stagger; live indicators pulse; taps scale down slightly. All respect `prefers-reduced-motion`.
- Meta/address lines drop to 13px with tighter leading so photos and names carry the weight.

## Technical notes

- New routes: `src/routes/task.$taskId.tsx` and `src/routes/task.$taskId.status.tsx`, each with its own `head()` metadata. Home stays `src/routes/index.tsx`.
- New components in `src/components/`: `top-bar`, `greeting-card`, `live-task-card`, `channel-spine`, `place-hero-card`, `place-tile`, `photo-carousel`, `section-header`, `prompt-chips`.
- Mock data in `src/lib/mock-tasks.ts` (tasks, places, timeline events) so all three screens read from one source.
- Place photos generated as app assets in `src/assets/` (milk cake, baklava, chocolate desserts, dental office) and imported directly.
- New tokens in `src/styles.css`: raised translucent surface, scrim gradient, orange CTA, step-node states, plus `pulse-ring` and `fade-up` keyframes. No hardcoded color utilities in components.
- Selection state is local `useState` on the results screen; the CTA and tile rings read from it. No persistence.
