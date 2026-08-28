# Full-bleed Asmi status cards for iMessage (no supporting text)

Three fully-designed horizontal status cards, 1344×512 each, exported as PNGs for sending in iMessage. Every card is visually complete on its own — no baked-in supporting line, no empty placeholder zones for future text. Dynamic details arrive separately in the iMessage text.

## Card design language

- Full-bleed composition: content spans the whole 1344×512 canvas, balanced left-to-right.
- Asmi's palette: cream background, deep plum text, amber accent — matching the app's `cream`/`panel`/`primary` tokens.
- Serif "asmi" wordmark (small, top corner) so the card is branded without shouting.
- A large amber icon medallion for the channel.
- Wholesome visual fill: subtle decorative geometry (soft amber rings/dots, a fine channel spine, or abstract radiating lines) flows across the rest of the card so no area looks like it was left empty "for text."
- Tiny footer strip: "handled by asmi" in muted plum micro-type.

## The three cards

1. **Message sent** — chat-bubble medallion with checkmark; "Message sent" as the only status word, centered near the icon.
2. **Email sent** — envelope medallion with checkmark; "Email sent" as the only status word.
3. **Call scheduled** — phone medallion with clock badge; "Call scheduled" as the only status word.

## Aesthetic notes

- Each card reads as a finished mini-poster: icon + status word + ornamental pattern, no blank rectangles.
- Rounded-3xl inner card look within the PNG; everything contained with clear margins.

## Technical notes

- Generated at 1344×512, saved to:
  - `exports/status-message-sent-full.png`
  - `exports/status-email-sent-full.png`
  - `exports/status-call-scheduled-full.png`
- Premium quality tier for clean type.
