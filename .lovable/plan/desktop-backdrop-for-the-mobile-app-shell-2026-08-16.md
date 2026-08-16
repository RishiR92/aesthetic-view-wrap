# Desktop backdrop for the mobile app shell

Goal: on desktop the app keeps its phone-width screen exactly as designed, but the empty space around it becomes an aesthetic aurora backdrop instead of flat grey.

## What changes

- A shared `MobileShell` layout wrapper in the root layout:
  - Below `sm`: the app fills the viewport edge-to-edge — no visual change on real phones.
  - `sm` and up: the app is centered in a 420px-wide column, max height of the viewport, as a soft rounded card (radius ~28px, deep shadow, faint 1px rim light). No device bezel, no notch.
  - The card clips its own scroll so the bottom tab bar stays pinned inside the card, as in the reference.
- Aurora backdrop behind the card (desktop only):
  - Base deep plum `#2A2438`, with two large blurred radial blooms — violet `#6B5B8A` upper-left, amber `#E8B96B` lower-right at low opacity — plus a very subtle grain overlay.
  - Blooms drift slowly (long, restrained keyframe animation) and respect `prefers-reduced-motion`.

## Home screen inside the shell

Rebuilds the screen from the reference at `/` (replacing the template placeholder):
- Serif `asmi` wordmark, top-left.
- Greeting card: sparkle glyph, "Good night", "Asmi's on it while you rest", outlined card with faint gradient fill.
- Status card: centered dot-in-ring, "Nothing active right now", "Text Asmi to get something done".
- Cream bottom tab bar: Home (active, amber), History, Payments — visual only.

## Technical notes

- Tokens added to `src/styles.css`: plum surface, violet/amber aurora accents, cream tab bar, card radius; all as `oklch` in `:root` + `@theme inline`. No hardcoded color utilities in components.
- Wrapper lives in `src/routes/__root.tsx` around `<Outlet />` so every future route inherits it; backdrop and card as `src/components/mobile-shell.tsx`.
- Grain via a CSS-only noise layer (no image asset).
- Serif display font loaded with a `<link>` in the root head.
