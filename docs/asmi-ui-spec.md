# Asmi — UI Spec (Home, Options, Execution)

Three screens: **Home** (`/`), **Options** (`/task/$taskId`), **Execution** (`/task/$taskId/status`).

---

## 1. Visual Foundations

### Shell
- Desktop: app lives inside a **420px-wide, 28px-radius card** centered on a dark animated aurora backdrop (deep plum + drifting violet/amber blooms + subtle noise grain).
- Mobile: full-bleed, no outer card.
- Inner app: `flex flex-col` with one scroll area and a fixed bottom tab bar.

### Typography
- `font-display` — Instrument Serif 400. Used only for editorial outcome/hero lines.
- `font-sans` — Manrope. Everything else.
- Scale: 22px bold titles, 18px bold hero names, 15px semibold row/task names, 13px body, 12.5px dense meta, 11px bold uppercase tracking-wider labels/chips, 10.5px chips.

### Color Tokens (semantic only)
| Token | Role |
|---|---|
| `background` | plum app canvas |
| `foreground` | near-white text on plum |
| `primary` | amber — status, ratings, Asmi accents, focus ring |
| `cta` | orange — live pulse + primary action button only |
| `panel` / `panel-foreground` / `panel-muted` | external/world data cards (white family) |
| `cream` / `cream-foreground` | Asmi's own voice (plan strip, hero card, outcome) |
| `raised` | translucent blurred plum surface |
| `tabbar` / `tabbar-foreground` | bottom nav |
| `accent`, `aurora-violet`, `aurora-amber` | backdrop + gradients |

**Rule:** `panel` = data about the world. `cream` = Asmi speaking or a resolved outcome. Amber = state. Orange = the one action.

### Motion
- `fade-up`: 12px rise + fade, 40–120ms stagger per item.
- `pulse-ring`: expanding ring on live status dot.
- `live-dots`: animated ellipsis after live text.
- Press feedback: `active:scale-[0.99]` on every tappable card.
- Radii: cards `rounded-3xl`, media `rounded-2xl`/`xl`, chips fully round.

---

## 2. Screen: Home

Order top → bottom:

1. **TopBar** — Asmi wordmark only.
2. **Greeting card** — gradient `accent/35 → cream/50`, weather glyph, 22px "Good afternoon, Rish!", subline "N things waiting on you".
3. **Needs You** section — `SectionHeader` with label + count chip.
   - One white `panel` card per task.
   - 11px uppercase kind + option count.
   - 21px task title.
   - Subtitle: "Pick one and Asmi will call for you".
   - Chevron right.
   - Below the text, a horizontal snap strip of up to 4 photo tiles (132px wide, 4:3 image, place name, ★ rating).
   - Whole card links to `/task/$taskId`.
4. **Tasks in Motion** section — list of `LiveTaskCard`.
   - `bg-raised` + blur.
   - 32px orange `pulse-ring` live dot.
   - 15px task title.
   - 14px amber `liveLine` + animated dots.
   - Relative time + chevron.
   - No channel bar. No status label.
   - Links to `/task/$taskId/status`.
5. **Asmi can also** — horizontal pill suggestions.
6. **Bottom nav** — Home / History / Payments, `bg-tabbar`, active item amber.

---

## 3. Screen: Options

Goal: **hero + 2 fully-detailed options visible without scrolling.**

1. **Header panel card**
   - Kind chip.
   - 21px title.
   - 2-line clamped brief.
   - Below, a **cream strip** with phone icon: "**Asmi will:** {plan}".

2. **PlaceHeroCard** (cream)
   - 16:9 `PhotoCarousel` (eager load).
   - Bottom scrim on image.
   - "✦ Asmi pick" amber pill top-left.
   - Check badge when selected.
   - Below image: 18px name, address · hours · lead, price, ★ rating + review count, optional italic reason with amber left rule, tag pills.

3. **PlaceRow** ×2 (white panel)
   - Layout: text details on the left, 112px 3:4 `PhotoCarousel` on the right.
   - Name (+ check when selected).
   - ★ rating (reviews) · price.
   - Address · distance.
   - Hours · lead.
   - Confirmed chip (amber tint) + 2 tags.
   - Every option is fully judgable here — no drill-in needed.
   - Use `role="button"` (not `<button>`) because the carousel nests interactive elements; handle Enter/Space.

4. **"View N more options"** toggle when more than 2 secondary options exist.

5. **Sticky footer CTA**
   - `bg-cta` orange button: "Asmi, call {selected}".
   - Routes to execution screen.
   - Disabled until a selection exists.

### PhotoCarousel
- `snap-x snap-mandatory` horizontal scroll.
- `no-scrollbar`.
- Dot indicators overlaid on the image (active dot wider/opaque) so multi-photo options are discoverable.

---

## 4. Screen: Execution

1. **TopBar** — back arrow + task title.

2. **Outcome card** (cream)
   - Status badge.
   - `font-display` headline (e.g. "Resolved").
   - Detail sentence.
   - Optional `asmiAction` sentence — render only when non-empty.

3. **ChannelSpine** — horizontal 4-step bar
   - Labels: **Call → Retry → Message → Email**.
   - `done` = filled amber + check.
   - `active` = pulsing.
   - `skipped` = dimmed dashed.
   - `idle` = outline.
   - Connector line fills between completed steps.
   - Same 4 labels for every task; states differ per task.

4. **Timeline**
   - Vertical rail.
   - "N touchpoints" count.
   - Each event: `time` (11px muted, tabular) + `text`.
   - Dot per node.

5. **Call recording** — expandable section
   - Duration + play control.
   - Static waveform bars.
   - Transcript as `Asmi` / `Them` turns.

6. **Message trail** — expandable section
   - Thread bubbles: Asmi = amber-tinted right, provider = panel left.
   - Timestamps below each bubble.

Both recording and message trail are collapsed by default with chevron rotation on expand.

---

## 5. Component Inventory

| Component | Responsibility |
|---|---|
| `mobile-shell.tsx` | Desktop card + aurora backdrop; mobile full-bleed. |
| `top-bar.tsx` | Wordmark, optional back + title. |
| `section-header.tsx` | Section label + optional count chip. |
| `live-task-card.tsx` | Home "in motion" task row. |
| `place-hero-card.tsx` | Large cream hero option card. |
| `place-row.tsx` | Compact side-by-side option row. |
| `photo-carousel.tsx` | Snap-scroll image carousel with dots. |
| `channel-spine.tsx` | Horizontal 4-step status bar. |

All components are presentational. Selection and expansion state lives in the route.

---

## 6. UI Invariants

- Use semantic tokens only; never hardcode color utilities.
- Images: `object-cover`, explicit dimensions, lazy-load except hero.
- One scroll container per screen; tab bar and footer CTA stay fixed.
- Never nest `<button>` inside `<button>` — use `role="button"` + key handlers for complex tappable cards.
