# Payments — minimal two-plan cards, user chooses

Strip the page down to two beautiful, minimal plan cards where the **task count is the story** and Ultra is the visual highlight. Nothing is pre-selected — the user taps a plan to choose it, which reveals checkout.

## What gets removed
- Subtitle "One tap. Tasks done for you."
- "Save up to 17%" chip
- All benefit bullet rows (priority execution, reminders/follow-ups, cancel anytime)
- Per-plan taglines and notes ("$8.25/mo billed yearly" etc.)

## The two cards (stacked, full-width, mobile-first)

**Asmi Ultra (highlight)**
- Dark plum card with the amber spotlight bloom — inverted from Pro so it glows on the page.
- "MOST POPULAR" amber ribbon stays.
- Content, centered/left minimal:
  - small amber "ULTRA" pill
  - Huge display-serif number: **100** with "tasks / month" in quiet text
  - Price line under the toggle's period: "$49/mo" or "$499/yr" — one line, no per-month math
- CTA: full-width **amber filled pill** "Choose Ultra" — the one glowing button on screen.

**Asmi Pro**
- Cream card, flat, no ribbon.
- Same skeleton: "PRO" eyebrow, huge **20** "tasks / month", price line.
- CTA: full-width **outlined pill** "Choose Pro" — clearly second in weight.

## Selection behavior
- **Nothing selected on load.** Both CTAs read "Choose …".
- Tapping a card's CTA (or the card itself) selects it: card lifts (scale + shadow + ring), CTA label switches to "✓ Selected" state on that card only; the other stays quiet.
- Checkout section (Apple Pay / card / Link, unchanged) sits below, **dimmed/disabled until a plan is chosen**; once chosen, it lights up and its subscribe label follows the pick ("Subscribe to Ultra — $499/year").
- Coupon link + Stripe lock footer stay quiet at the bottom.

## Layout / mobile-first
- Single column, `px-5`, safe-area padding, cards `rounded-3xl`, generous internal padding (`p-6`) with the big number as the visual anchor.
- Billing toggle stays at top (Monthly / Yearly pill), compact, high-contrast labels.
- `fade-up` stagger: Ultra card first, Pro second, checkout last.

## Technical notes
- `src/components/plan-card.tsx`: rewrite to the minimal skeleton with a `featured` (dark/Ultra) and default (cream/Pro) variant; `selected` drives lift + CTA state.
- `src/routes/payments.tsx`: `tier` state becomes `"pro" | "ultra" | null` (null on load); remove removed copy; checkout disabled until `tier !== null`.
- No new tokens; uses `background` plum, `cream`, `primary` amber, `cta`.
