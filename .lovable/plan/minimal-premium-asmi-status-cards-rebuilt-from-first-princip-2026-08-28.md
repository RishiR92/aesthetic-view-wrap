# Minimal, premium Asmi status cards — rebuilt from first principles

Three 1344×512 status cards for iMessage, redesigned from scratch to match Asmi's design language (see `docs/asmi-ui-visual-spec.md`): deep plum/near-black field, cream text, amber as the single accent, Instrument Serif for the headline. The reference standard is Apple-tier consumer restraint — one object, one word, one breath of motion, surrounded by deliberate negative space.

## Design principles (all three cards)

- **Nothing decorative for decoration's sake.** No pattern fills, no dotted trails, no swooshes, no badges stacked on badges.
- **Composition:** the status element sits optically centered (slightly left of center so the trailing motion cue can breathe to the right). Roughly 60% of the canvas is empty dark space — that emptiness IS the design.
- **Field:** near-black with a whisper of plum (`oklch(0.18–0.22, hue ~305)`) — matte, not glossy. No gradient washes, no vignette, no grain noise.
- **Icon:** a single, precisely drawn line-style channel icon (chat bubble / envelope / phone) rendered in cream with a hairline-thin amber stroke detail — not a filled medallion, not glossy, not cartoonish. Approximately 120–150px — present, never loud.
- **Accent:** one small amber element only — either a minimal check mark, or the motion cue itself. Amber is the *state*, per the spec.
- **Headline:** the status word in Instrument Serif italic, cream, ~72–88px, generous letterfit — "Message sent", "Email sent", "Call scheduled". It is the only type on the card.
- **The liveliness cue (the one per card):** a single restrained motion signal so it reads as *in flight*, not *static sticker*:
  - **Message sent:** one thin amber ring radiating outward from the bubble, fading as it expands — like a single ripple in still water.
  - **Email sent:** one fine amber line trailing from the envelope, dissolving into 2–3 diminishing dots — the arc of a letter just released.
  - **Call scheduled:** the phone icon paired with a minimal clock arc (a thin amber quarter-ring suggesting a dial), nothing more.
- **Finish:** crisp vector-sharp edges, no shadows except the softest single-direction drop under the icon, no glow halos. Calm, expensive, confident.

## What gets removed vs the last set

- Radiating multi-ring systems, dotted signal trails, swoosh flocks, calendar-grid motifs
- Glossy/3D icon treatment, badge stacks (icon + check + clock all at once)
- Any pattern used to "fill" space

## Output files

- `exports/status-message-sent-full.png`
- `exports/status-email-sent-full.png`
- `exports/status-call-scheduled-full.png`

All 1344×512, premium quality tier for clean type rendering.