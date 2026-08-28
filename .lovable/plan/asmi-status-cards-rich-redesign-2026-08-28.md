# Asmi Status Cards — Rich Redesign

## Problem
Current static status cards (message sent / email sent / call scheduled) are too minimal — one small icon and a word on an empty field reads as dull. Goal: full-bleed, well-composed, lively cards that still feel premium and match Asmi's moonlit plum/amber/serif identity. No "asmi" wordmark or logo. No dynamic text on the image (status text may still be baked in, since these are static variants).

## Design direction — "Stage & Spotlight"
Treat each card like a small theatrical scene, not an icon on a void:

- **Field**: deep plum-black base (#241D2E→#3A2F45), very subtle vertical sheen, plus a soft amber spotlight glow behind the hero element. A faint oversized ghost glyph (envelope/bubble/phone) watermarked at 4–6% opacity in the background adds depth without clutter.
- **Hero cluster (left-of-center)**: the status icon rendered as a dimensional element — glossy amber-gold medallion disc with the hairline ivory icon in it, small drop shadow, 2–3 layered concentric rings radiating outward at low opacity to imply the "send/ring" energy.
- **Motion cues per card** (the liveliness, still tasteful):
  - Message sent: chat bubble medallion + three amber dots trailing right like typing→sent, plus one fine ripple ring.
  - Email sent: envelope medallion with the flap visually open, a fine golden arc sweeping up-and-right ending in a small sparkle/paper-plane sliver.
  - Call scheduled: phone medallion + a minimal clock ring at its corner, two soft sound-wave arcs to the right.
- **Typography block (right side)**: status headline in large Instrument Serif italic cream ("Message sent" / "Email sent" / "Call scheduled"), one supporting micro-line in small tracked-caps warm grey ("DELIVERED VIA IMESSAGE" / "LANDED IN INBOX" / "WE'LL RING THEM") — baked in, since each image is one fixed status.
- **Ornamentation**: a scattering of 3–5 tiny gold sparkles/star-points and one hairline gold baseline rule under the type block to finish the composition. Rounded 48px corners baked into the art so it sits like a rich bubble in chat.

## Palette (unchanged)
Background deep plum #241D2E–#3A2F45 · amber/gold #E8B96B–#F2CE8F · cream #F5EDDF · warm grey #A79B93.

## Deliverables
Regenerate 3× PNG at 1344×512 (premium quality, text must be crisp):
- exports/status-message-sent-full.png
- exports/status-email-sent-full.png
- exports/status-call-scheduled-full.png

QA pass on each: no logo/wordmark, no clipped ornament, headline legible at chat-thumbnail size, exactly one status per card, consistent medallion + ring system across all three.

## QA Checklist
- [ ] Rich composed scene (spotlight, ghost glyph, rings) — not empty
- [ ] Correct per-card motion cue (dots / release arc / clock+waves)
- [ ] Serif headline + one micro-line, both legible
- [ ] No asmi branding, no dynamic-text placeholders
- [ ] All three cards feel like one family
