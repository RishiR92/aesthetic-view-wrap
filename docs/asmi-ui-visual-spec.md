# Asmi — Visual UI Spec (colors, shapes, type, spacing)

Flow is out of scope. This is the pure look-and-feel contract.

---

## 1. Color tokens (oklch, light-only theme — the app is dark by design)

| Token | Value | Role |
|---|---|---|
| `--background` | `oklch(0.26 0.032 305)` | deep plum app canvas |
| `--foreground` | `oklch(0.96 0.006 300)` | primary text on plum |
| `--card` | `oklch(0.29 0.034 305)` | opaque plum card |
| `--raised` | `oklch(0.33 0.036 305 / 65%)` | translucent card, always with `backdrop-blur-md` |
| `--secondary` / `--muted` | `oklch(0.34 0.036 305)` | chips, inert fills |
| `--muted-foreground` | `oklch(0.76 0.018 300)` | secondary text on plum |
| `--primary` | `oklch(0.82 0.12 82)` | amber — state, ratings, section labels, selection ring |
| `--primary-foreground` | `oklch(0.24 0.03 305)` | text on amber |
| `--accent` | `oklch(0.58 0.06 300)` | violet wash in greeting gradient |
| `--cta` | `oklch(0.63 0.16 43)` | orange — the single primary action per screen |
| `--cta-foreground` | `oklch(0.99 0.005 90)` | text on orange |
| `--panel` | `oklch(1 0 0)` | pure white = **external/world data** (places, business facts) |
| `--panel-foreground` | `oklch(0.2 0.01 300)` | text on white |
| `--panel-muted` | `oklch(0.55 0.012 300)` | metadata on white |
| `--cream` | `oklch(0.975 0.012 90)` | warm off-white = **Asmi's voice** (plan, outcome, transcript) |
| `--cream-foreground` | `oklch(0.24 0.015 300)` | text on cream |
| `--tabbar` | `oklch(0.92 0.012 90)` | bottom tab bar |
| `--tabbar-foreground` | `oklch(0.42 0.02 300)` | inactive tab |
| `--aurora-violet` | `oklch(0.55 0.075 300)` | desktop backdrop bloom |
| `--aurora-amber` | `oklch(0.82 0.12 82)` | desktop backdrop bloom |
| `--border` | `oklch(0.72 0.02 300 / 40%)` | hairlines on plum |
| `--ring` | `oklch(0.82 0.12 82 / 60%)` | focus ring |

**Surface semantics (never break these):**
- plum = app chrome, amber = status/state, orange = action, white = the world, cream = Asmi.
- On white/cream cards, hairlines and de-emphasized text use alpha of the *foreground* token (`border-panel-foreground/12`, `text-cream-foreground/60`), never a grey literal.
- Never use `text-white` / `bg-black` / hex literals in components.

---

## 2. Typography

- Display: **Instrument Serif** 400 (`font-display`) — italic wordmark, outcome headline only.
- UI: **Manrope** (`font-sans`) — everything else.

| Use | Size / weight |
|---|---|
| Wordmark "asmi" | 24px display, italic, tight tracking |
| Screen title (Options / Execution) | 21–26px, bold 700, leading-tight |
| Greeting headline | 22px bold |
| Outcome headline | 26px display, leading 1.15 |
| Card title (hero place) | 18px bold |
| Card title (row / task) | 15px bold/semibold |
| Body / details | 12.5–13px, leading-snug |
| Live status line | 14px medium, `text-primary` |
| Section label | 12px semibold, UPPERCASE, tracking `0.14em`, `text-primary` |
| Eyebrow on cards | 10.5–11px bold UPPERCASE, tracking-wider |
| Chip / timestamp | 10.5–11px, `tabular-nums` for times |

---

## 3. Shape & elevation

- Radius scale: pills (`rounded-full`) for chips/badges/dots · `rounded-2xl` (~18px) for task cards, inline expanders, thumbnails · `rounded-3xl` (~22px) for all major content cards · `rounded-xl` for small photo tiles.
- Desktop shell: 420 × 860px frame, `28px` radius (`rounded-shell`), 1px `border-border/60`, shadow `0 40px 100px -20px oklch(0.15 0.03 305/70%)`.
- No shadows on inner cards, with one exception: `--shadow-lift` (`0 18px 40px -16px oklch(0.15 0.03 305/55%)`) on a *selected* option card.
- Translucent cards must pair `bg-raised` with `backdrop-blur-md`.
- Selection (options screen): the picked card lifts — `scale-[1.02]`, `--shadow-lift`, `ring-1 ring-primary`, and a 3px amber bar on its left edge. Unpicked siblings recede to `scale-[0.99] opacity-[0.72]`. Transition 200ms `cubic-bezier(0.22,1,0.36,1)`. No check disc or radio circle.
- Press feedback: `active:scale-[0.985]`–`[0.99]`, no hover-lift on mobile surfaces.

---

## 4. Spacing & layout

- Horizontal gutter: `px-5` on scroll content; `px-6` on the top bar.
- Card padding: `p-4` (dense rows/options) or `p-5` (hero/section cards). Inline expanders: `px-4 py-3` header, `p-4` body.
- Vertical rhythm between cards: `space-y-3` (dense) or `space-y-4` (execution sections).
- Section header: `mt-8 mb-3`, label left / count chip right, baseline-aligned.
- One scroll container per screen (`flex-1 overflow-y-auto`); top bar, footer CTA (`border-t border-border/50 bg-background/80 backdrop-blur px-5 py-4`) and tab bar are `shrink-0`.
- Tab bar: `grid-cols-3`, `py-4`, icon 20px + 12px label, active item amber.

---

## 5. Imagery

- Every place has a carousel: `snap-x snap-mandatory`, `no-scrollbar`, `object-cover`, explicit width/height, `loading="lazy"` except the hero's first frame.
- Aspect ratios: hero `16/9`, side thumbnail `3/4` at `112px` wide, home strip tiles `4/3` at `132px` wide.
- Pagination dots: `size-1.5`, white, active 100% / inactive 45% opacity, inside a `bg-foreground/25 backdrop-blur` pill at bottom-center.
- Hero photos carry a bottom `scrim` gradient (`oklch(0.15 0.02 305)` 88% → transparent) covering the lower two-thirds so overlaid badges stay legible.

---

## 6. Motion

- `fade-up` — 500ms `cubic-bezier(0.22,1,0.36,1)`, 12px rise; stagger siblings 40ms.
- `pulse-ring` — 2s expanding box-shadow halo on the live task dot.
- `live-dots` — three dots blinking at 1.4s, 0.2s offsets, for in-progress copy.
- `aurora-bloom` — 26s drift/scale on desktop backdrop blooms, second bloom offset `-13s`.
- `aurora-grain` — 3px radial dot grain at 5% opacity over the backdrop.
- All keyframes disabled under `prefers-reduced-motion: reduce`.

---

## 7. Component visual contracts

- **TopBar** — 24px italic display wordmark or "‹ Back" in muted, 20px menu icon right; `px-6 pt-6 pb-3`.
- **SectionHeader** — amber uppercase label + `bg-secondary` pill chip.
- **LiveTaskCard** — `rounded-2xl bg-raised backdrop-blur-md border-border/60 px-4 py-3.5`; 32px `bg-cta/15` disc with a 10px orange dot and pulse ring; 15px title; 14px amber live line with blinking dots; right side 11px timestamp + chevron.
- **PlaceHeroCard** — `rounded-3xl bg-cream`, 16:9 carousel, amber "✦ ASMI PICK" pill top-left, `p-4` details, amber star + rating, quote line with `border-l-2 border-primary pl-3`, outlined tag pills; inline underlined `Website ↗` link at the end of the address/hours line.
- **PlaceRow** — `rounded-3xl bg-panel p-3`, text column left, `112px` `rounded-2xl` 3:4 carousel right; amber `bg-primary/15` confirmation chip + max 2 outlined tags; inline underlined `Website ↗` link closing the hours line (stops click propagation so it never changes the selection).
- **Execution status bar** — four equal segments Call · Retry · Message · Email; done = amber fill + check, skipped = `bg-secondary` hairline, pending = outline only.
- **Timeline** — 64px `tabular-nums` time gutter, hairline `border-b border-cream-foreground/8` per row, amber dot for completed nodes.
- **Recording / Message trail** — `rounded-2xl border border-cream-foreground/12` collapsibles; recording uses a 32px orange play disc and `bg-cta/70` waveform bars; message bubbles are `rounded-2xl`, Asmi in amber-tinted fill, the other party in `cream-foreground/8`.

---

## 8. Invariants

1. Semantic tokens only — no color literals.
2. One orange CTA per screen; amber never used for actions.
3. White = world data, cream = Asmi's voice; never mix inside one card.
4. Cards are radius-22px, borderless on light surfaces, hairline-bordered on plum.
5. Fixed image dimensions + `object-cover`; no layout shift.
6. Never nest `<button>` in `<button>` — use `role="button"` + Enter/Space handlers.
