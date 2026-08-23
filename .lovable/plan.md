# Payments — Asmi Unlimited

Redesign `/payments` into a premium, mobile-first subscription screen that reads as part of the Asmi app (plum canvas, amber state, one orange CTA, cream for Asmi's voice).

## The screen, top to bottom

1. **TopBar** (unchanged wordmark + menu).
2. **Header** — display-serif "Asmi Unlimited" with a one-line subtitle: "One plan. Unlimited tasks." No page-title clutter above it.
3. **Plan card** (the hero) — `rounded-3xl bg-cream`, so it reads as Asmi speaking:
   - amber uppercase eyebrow "ASMI UNLIMITED"
   - price line: large display number + `/month` in muted weight (placeholder $20 — tell me the real price and I'll set it)
   - 3–4 tight benefit rows with small amber check marks: unlimited tasks, calls and messages on your behalf, Asmi pays deposits and places orders, cancel anytime
   - a hairline-separated footer line: "Billed monthly. Cancel anytime."
4. **Payment actions** (stacked, full-width, thumb-height ~52px):
   - **Apple Pay** button first — black pill with the Apple Pay mark, shown only when the device supports it (feature-detected on the client so it never renders a dead button on desktop Chrome).
   - **Pay with card** — the single orange `cta-fill` pill (one orange CTA per screen; Apple Pay is a brand-locked surface and doesn't count).
   - Divider "or" hairline between them.
5. **Trust row** — small muted line with a lock glyph: "Secure checkout. Your card details never touch Asmi."
6. **Manage strip** (only once subscribed) — `bg-raised` card showing plan status, renewal date, and a quiet "Manage plan" text link.

## Interaction / mobile details

- Everything in one scroll container, `px-5`, safe-area bottom padding; no fixed footer bar.
- Buttons `active:scale-[0.99]`, `fade-up` stagger on the card then the actions.
- Tapping a payment button sets a local pending state (spinner + disabled) so the screen feels alive; no real charge is wired yet.
- Full keyboard focus rings via `--ring`; no nested buttons.

## Technical notes

- Only `src/routes/payments.tsx` changes, plus a small `src/components/apple-pay-button.tsx` for the feature-detected Apple Pay surface (`window.ApplePaySession` check inside `useEffect`, rendered after hydration to avoid mismatch).
- No new colors; uses existing `cream`, `panel-foreground`, `primary`, `cta`, `raised` tokens.
- Route `head()` metadata updated to the plan-focused title/description.
- No backend, no provider wiring in this pass — presentation only. Say the word when you want real Stripe/Paddle checkout behind these buttons.
