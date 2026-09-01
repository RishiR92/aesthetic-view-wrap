# Payments — two plans: Asmi Pro & Asmi Ultra

The payments page now sells two tiers. **Asmi Ultra is the star** — visually elevated so it's clearly the tempting choice — with Asmi Pro as the clean entry option. (Confirming: Ultra yearly is $499/**yr** — I read "$499/month" as a typo.)

## The two plans

- **Asmi Pro** — $10/mo or $99/yr · 20 tasks/month
- **Asmi Ultra** — $49/mo or $499/yr · 100 tasks/month

## Page structure, top to bottom

1. **TopBar** (unchanged).
2. **Header** — "Asmi Unlimited" becomes "Choose your plan" (display serif) with subtitle "One tap. Tasks done for you."
3. **Billing toggle** — Monthly / Yearly segmented control at the top (applies to both plans at once, replacing per-plan tiles). Yearly pre-selected with a small amber "Save up to 17%" hint.
4. **Ultra plan card (hero, first)** — this is where the design sells:
   - Same 1344-style "spotlight" treatment adapted to the app: `bg-cream` card but with a **deep plum header band** carrying a glossy amber-gold "ULTRA" medallion/pill and an Instrument Serif italic plan name.
   - Amber "MOST POPULAR" ribbon on the corner.
   - Large price line ($49/mo or $499/yr following the toggle), with "$41.58/mo billed yearly" note on yearly.
   - Benefit rows with amber checks: 100 tasks every month, priority execution (calls, texts & emails jump the queue), reminders & follow-ups handled, cancel anytime.
   - Amber **"Go Ultra"** `cta-fill` pill button inside the card — the single orange CTA on the screen.
   - Selected state: lifted (`shadow-lift`, ring) like the lift-to-select pattern used on the options page.
5. **Pro plan card (second, quieter)** — plain `bg-cream`, no medallion, no ribbon:
   - Plan name + price ($10/mo or $99/yr), "20 tasks every month" + core benefit rows.
   - Outlined (not filled) "Choose Pro" button — deliberately lower visual weight than Ultra's filled CTA.
6. **Checkout section** (appears once a plan is chosen, or always visible reflecting selection):
   - Apple Pay button first (feature-detected, forced in dev as today).
   - "or" divider, then the existing card accordion + Link row — reused as-is.
   - Subscribe label follows selection: "Subscribe to Ultra — $499/year" etc.
7. **Footer** — lock line "Payments are processed securely via Stripe" + "Cancel anytime · Renews automatically". Coupon link stays quiet under the checkout card.

## Interaction

- Default selection: **Ultra, Yearly** — the tempting combination is pre-loaded.
- Tapping either plan card lifts it (scale 1.01 + shadow + ring) and demotes the other; checkout buttons update instantly.
- Billing toggle animates both price lines.
- Pending spinner states on Apple Pay / card / Link stay as-is; still presentation-only, no real charge.

## Technical notes

- `src/routes/payments.tsx` — restructure: plan state becomes `{ tier: "pro" | "ultra", period: "monthly" | "yearly" }`; plan data array drives both cards.
- `src/components/plan-card.tsx` — new component with a `featured` variant (Ultra: plum band, medallion, ribbon, filled CTA) and default variant (Pro: flat, outline CTA).
- `src/components/card-form.tsx` — label prop generalized to accept the dynamic subscribe label; otherwise unchanged.
- Existing tokens only: `cream`, `primary` amber, `cta`, plum; no new colors.
- Route `head()` title updated to "Asmi plans — Pro & Ultra".
