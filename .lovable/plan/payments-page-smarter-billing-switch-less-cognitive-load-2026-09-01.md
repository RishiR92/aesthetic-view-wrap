# Payments page — smarter billing switch, less cognitive load

## Goal
Make the monthly ↔ yearly decision feel playful and premium, and strip the page down so the user only processes one thing per glance: plan size, price, CTA.

## 1. Innovative billing switch
Replace the plain two-segment pill with a springy "slide the savings" switch:

- **Single control, animated amber thumb** that glides between "Monthly" and "Yearly" with an iOS-style spring (translate + slight overshoot), not a hard cut.
- **Prices morph live on both cards** — when the thumb slides, each price rolls vertically (old price slides up/out, new price slides in) with a number-roll animation, so the user *sees* the price change rather than re-reading cards.
- **Yearly thumb carries a tiny "2 mo free" spark** inside the pill (one short badge, replaces the removed "save up to 17%" copy but lives only on the switch, not on cards). Sliding to yearly triggers a brief amber shimmer across both price lines — one moment of delight, no noise.
- Default stays Yearly (best value), thumb starts on the right.

Implementation: pure CSS transforms + a keyed price element with slide/fade transition (no new dependencies); haptic-feel via `active:scale` on the thumb.

## 2. Reduce cognitive load
Current page forces two parallel decisions (plan AND period) plus extra reading. Simplify:

- **One number per card that matters: tasks.** "100" / "20" stays the giant display figure — it's the real differentiator.
- **Single price line per card**, no duplicated price anywhere else: header shows only "Choose your plan" (no price), the checkout section label shortens to "Asmi Ultra · Yearly" without repeating "$499.00/year" (the card already said it; CTA buttons keep the concise "Subscribe" with price only in the Apple Pay sheet at pay time).
- **Collapse the per-card CTA** into the card itself — remove the redundant "Choose Ultra / Choose Pro" pill row; the whole card is the tap target with the existing lift-and-glow selection state, plus a small circular check indicator top-right that fills amber when selected. Frees ~52px of vertical space per card and removes two more buttons competing with the real checkout CTAs.
- **Checkout section** keeps Apple Pay / or / Card + Link exactly as-is (that layout was approved); only the caption simplifies.
- Keep: Ultra featured styling (dark plum, amber "Most popular" ribbon), coupon quiet link, Stripe security footer, "Cancel anytime".

## Result — what the user sees
1. Title: "Choose your plan"
2. One playful spring switch: Monthly ⟷ Yearly (2 mo free)
3. Two cards, each = big task count + one rolling price + tap-to-select lift
4. Apple Pay, then Card/Link

Four visual elements total; the only interaction decisions are *which plan* and *which period*, and the switch makes the period choice feel rewarding instead of administrative.

## Technical notes
- Edit `src/routes/payments.tsx` (new switch component inline or `src/components/billing-switch.tsx`, simplified checkout caption) and `src/components/plan-card.tsx` (remove bottom CTA row, add corner check indicator, keyed rolling price).
- No new dependencies; CSS keyframes go in `src/styles.css` using existing semantic tokens (primary, cream, plum).
- Verify on mobile viewport (420px shell) and desktop preview; run typecheck.
