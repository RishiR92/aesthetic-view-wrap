# Full-bleed Asmi status cards for iMessage (static, no text placeholders)

Three fully-designed horizontal status cards, 1344×512 each, exported as PNGs for sending in iMessage. Every card is complete on its own — all text is baked in, no empty zones reserved for dynamic content. Dynamic details (names, numbers, times) arrive separately in the message thread.

## Card design language

- Full-bleed composition: content spans the whole 1344×512 canvas, balanced left-to-right.
- Asmi's palette: cream background, deep plum text, amber accent — matching the app's `cream`/`panel`/`primary` tokens.
- Serif "asmi" wordmark (small, top corner) so the card is branded without shouting.
- A large amber icon medallion for the channel, a baked-in status headline, and a decorative supporting detail so no area feels empty.

## The three cards

1. **Message sent** — chat-bubble medallion with checkmark; headline "Message sent ✓"; supporting static line like "Asmi texted the shop and is waiting on a reply."
2. **Email sent** — envelope medallion with checkmark; headline "Email sent ✓"; supporting line "Asmi emailed the details and will follow up."
3. **Call scheduled** — phone medallion with clock badge; headline "Call scheduled"; supporting line "Asmi will call and confirm for you."

## Wholesome detail

- Subtle decorative pattern (soft amber rings/dots or a fine hairline spine echoing the channel tracker) filling the right half so the composition feels finished, not padded.
- Small footer strip: "handled by asmi" in muted plum micro-type.
- Consistent margins, nothing touching edges; rounded-3xl inner card look within the PNG.

## Technical notes

- Generated via image generation at 1344×512, saved to `exports/status-message-sent-full.png`, `exports/status-email-sent-full.png`, `exports/status-call-scheduled-full.png`.
- Text is static and baked into each image; premium quality tier for legible typography.
- Previous `*-static.png` templates remain untouched as alternates.
