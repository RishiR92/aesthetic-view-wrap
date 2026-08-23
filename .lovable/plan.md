# Payments page — one-plan, unlimited tasks rethink

The page sells one thing: **Asmi Unlimited**. The two tiles are billing periods, not separate plans. Apple Pay is the primary CTA; card and Link are quiet alternatives. No feature list, no clutter.

## Core hierarchy
1. **Title block**
   - H1: "Asmi Unlimited"
   - Subtitle: "One plan. Unlimited tasks."
   - No eyebrow label, no bullets.

2. **Plan card (cream surface)**
   - A single large value headline: "$10/mo" with a secondary "$99/yr — Save 18%" nudge.
   - Two billing-period chips: **Monthly** and **Yearly**. Yearly gets the "Save 18%" micro-badge and is selected by default.
   - One quiet reassurance line inside the card: "Cancel anytime. Billed automatically."

3. **Primary action — Apple Pay**
   - Black Apple Pay button, full width, first in the stack.
   - Hidden on non-Apple-Pay devices; in that case the card accordion becomes the primary action.

4. **Secondary action — Pay with card (expandable accordion)**
   - Collapsed row: card icon + "Pay with card" + chevron.
   - Expands in place to reveal Name on card, Card number, Expiry/CVC and an amber "Subscribe for $10.00/month" button (label follows selected period).
   - Chevron rotates; collapsing hides fields.

5. **Tertiary action — Link**
   - Green Link pill below the card accordion, smaller visual weight than Apple Pay.
   - Kept because the user already has it and it is a real payment method.

6. **Coupon**
   - A single quiet underlined text link "Have a coupon code?" below the payment stack.
   - Tapping swaps it inline for a borderless field + subtle amber "Apply" text button.
   - Applied state: small "CODE applied · Remove" line. No box, no filled button.

7. **Footer**
   - Lock icon + "Payments are processed securely via Stripe"

## Interactions and defaults
- **Default selection:** Yearly ($99/yr) pre-selected to nudge toward the better-value option.
- **Plan switch:** chips update the subscribe button label and footer billing text instantly.
- **Apple Pay:** tapping triggers the existing `start("apple")` pending state.
- **Card accordion:** only one open state; opening focuses the first field. Fields are presentational (no real charge) until payments are wired.
- **Link:** kept as a pill, but visually subordinate to Apple Pay.

## Design notes
- Existing tokens only: `bg-cream`, `primary` amber, `link` green, plum page background.
- Card inputs use `bg-cream-foreground/6`, 16px radius, 48px height, proper `autoComplete` for iOS autofill.
- Accordion animates height/opacity with the existing ease curve.
- No new colors; no feature bullets.

## Files to change
- `src/routes/payments.tsx`: rewrite the page with the new hierarchy, plan chips, and inline coupon.
- `src/components/card-form.tsx`: new component for the expanded card fields + subscribe button.
- `src/components/apple-pay-button.tsx`: reuse as-is.
