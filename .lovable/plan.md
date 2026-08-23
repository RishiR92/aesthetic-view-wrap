# Payments page — one plan, unlimited tasks

Strip the clutter and make the whole page about a single decision: start Asmi Unlimited. Keep one calm cream card with the plan, the price, and the payment choices.

## What gets removed
- The "Subscription & billing" eyebrow label above the title.
- All four feature bullets.
- The current chunky coupon block (input + Apply button sitting in a box) and the stacked three-button CTA pile.

## New structure (top to bottom)
1. **Asmi Unlimited** title + one-line subtitle.
2. **Cream card**
   - Two plan tiles (Monthly $10 / Yearly $99, Save 18%) — unchanged behaviour, slightly tighter.
   - **Apple Pay** — black pill, first and visually primary, shown only on supporting devices.
   - **Pay with Link** — green pill, unchanged.
   - Hairline divider with a small centered "or" instead of stacked equal buttons.
   - **Pay with card** — collapsed row with card icon + chevron. Tapping expands in place to reveal Name on card, Card number, Expiry, CVC and a full-width amber **Subscribe for $10.00/month** button (label follows the selected plan). Chevron rotates; collapsing hides fields.
3. **Coupon** — reduced to a single quiet underlined text link "Have a coupon code?" placed below the card. Tapping swaps it inline for a borderless field with a subtle amber "Apply" text button; applied state becomes a small "CODE applied · Remove" line. No box, no filled button.
4. Footer lock line: secure-payment reassurance (kept, unchanged).

## Design notes
- All colors stay on existing tokens: `bg-cream`, `primary` amber, `link` green, plum page background. No new palette.
- Card inputs use `bg-cream-foreground/6` surfaces, 16px radius, 48px height, mobile-friendly `inputMode`/`autoComplete` so iOS keyboards and autofill behave.
- Accordion animates height/opacity with the existing ease curve; no layout jump.
- Fields are presentational only (no charge is processed) until real payments are wired up.

## Technical
- Edit `src/routes/payments.tsx`: trim `BENEFITS`, add `cardOpen` state and the accordion, restyle coupon as inline link.
- New `src/components/card-form.tsx` holding the expanded card fields + subscribe button, keeping the route file readable.
- `src/components/apple-pay-button.tsx` reused as-is.
