# Asmi — Design & Implementation Spec

Three screens: **Home** (`/`), **Options** (`/task/$taskId`), **Execution** (`/task/$taskId/status`).
Stack: TanStack Start + React 19 + Tailwind v4 (tokens in `src/styles.css`).

---

## 1. Foundations

### Shell
`src/components/mobile-shell.tsx` renders in `__root.tsx`: on desktop the app is a
**420px-wide, 28px-radius card** (`rounded-shell`) centered on an animated "aurora"
backdrop (deep plum base, drifting violet + amber radial blooms, `aurora-grain` noise
overlay at 5% opacity). On mobile the shell is full-bleed. Inner app is always
`flex flex-col` with one scroll container and a fixed 3-tab bar.

### Type
- `font-display` — Instrument Serif 400. Used only for outcome/hero editorial lines.
- `font-sans` — Manrope. Everything else.
- Scale used in practice: 22/21px bold (screen titles), 18px bold (hero card name),
  15px semibold (row name, task title), 13px (body), 12.5px (dense meta),
  11px bold uppercase tracking-wider (section labels, kind chips), 10.5px (chips).

### Color tokens (oklch, semantic only — never hardcode hex/`text-white`)
| Token | Role |
|---|---|
| `background` `0.26 0.032 305` | plum app canvas |
| `foreground` | near-white text on plum |
| `primary` `0.82 0.12 82` | amber — status, ratings, "Asmi" accents, focus ring |
| `cta` `0.63 0.16 43` | orange — live pulse + primary action button only |
| `panel` (white) / `panel-foreground` / `panel-muted` | external/world data cards |
| `cream` `0.975 0.012 90` / `cream-foreground` | Asmi's own voice (plan strip, hero card, outcome) |
| `raised` `0.33 0.036 305 / 65%` | translucent plum surface + `backdrop-blur-md` |
| `tabbar` / `tabbar-foreground` | bottom nav |
| `accent`, `aurora-violet`, `aurora-amber` | backdrop + gradients |

**Rule:** white `panel` = data about the world (places, timeline). `cream` = Asmi
speaking or a resolved outcome. Amber = state; orange = the one action.

### Motion
`fade-up` (12px rise + fade, 40–120ms stagger per item), `pulse-ring` (expanding ring
on live dot), `live-dots` (sequential ellipsis), `aurora-drift` (28s backdrop),
`active:scale-[0.99]` press feedback on every tappable card. Radii: cards `rounded-3xl`,
media `rounded-2xl`/`xl`, chips/pills fully round.

---

## 2. Data model (`src/lib/mock-tasks.ts`)

```ts
type Place = {
  id, name, photos: string[],        // 2–4 photos ⇒ carousel dots
  rating: number, reviews: number,
  address, hours, distance?, price?, lead?,
  confirmed?: string,                // e.g. "Heart mould available"
  tags: string[], reason?: string,   // reason = why Asmi picked it (hero only)
  plan?: string,
};
type ChannelStep = { label: "Call"|"Retry"|"Message"|"Email", state: "done"|"active"|"skipped"|"idle", detail?: string };
type Task = {
  id, title, kind, brief, plan,
  status: "needs-you" | "in-motion",
  liveLine?, ago?,                   // home live card
  options: Place[],
  steps: ChannelStep[],              // always Call → Retry → Message → Email
  timeline: { time, text }[],
  outcome?: { badge, headline, detail },
  recording?: { duration, transcript: {who:"Asmi"|"Them", text}[] },
  thread?: { who, text, time }[],
};
export const tasks: Task[]; export function getTask(id): Task | undefined;
```
Swap this file for server functions later; component props stay identical.

---

## 3. Screen: Home (`src/routes/index.tsx`)

Order top→bottom:
1. `TopBar` — Asmi wordmark.
2. **Greeting card** — gradient `accent/35 → cream/50`, weather glyph, 22px
   "Good afternoon, Rish!", subline "N things waiting on you".
3. **Needs you** (`SectionHeader label chip={count}`) — one white `panel` card per task:
   kind + option count (11px caps), 21px title, "Pick one and Asmi will call for you",
   chevron; then a horizontal snap strip of up to 4 photo tiles (132px wide,
   4:3 image, name, ★ rating). Whole card links to `/task/$taskId`.
4. **Tasks in motion** — `LiveTaskCard` list. `bg-raised` + blur, 32px orange
   `pulse-ring` dot, 15px title, **14px amber `liveLine` + animated dots**, relative
   time + chevron. No channel/segment bar here (deliberately removed) and no status label.
   Links to `/task/$taskId/status`.
5. **Asmi can also** — horizontal pill suggestions.
6. Bottom nav: Home / History / Payments, `bg-tabbar`, active item amber.

---

## 4. Screen: Options (`src/routes/task.$taskId.index.tsx`)

Goal: **hero + 2 fully-detailed options visible without scrolling.**

1. Header `panel` card: kind chip, 21px title, 2-line clamped brief; then a
   **cream strip** with phone icon — "**Asmi will:** {task.plan}".
2. `PlaceHeroCard` — cream card, 16:9 `PhotoCarousel` (eager) with bottom scrim,
   "✦ Asmi pick" amber pill top-left, check badge when selected; below: 18px name,
   address · hours · lead, price, ★ rating + review count, optional italic `reason`
   with amber left rule, tag pills.
3. `PlaceRow` ×2 — white `panel`, **text left / 112px 3:4 `PhotoCarousel` right**:
   name (+check), ★ rating (reviews) · price, address · distance, hours · lead,
   then confirmed chip (amber tint) + 2 tags. Every option is fully judgable here —
   no drill-in needed. `role="button"` (not `<button>`) because the carousel nests
   interactive elements; Enter/Space handled.
4. `View N more options` toggle when `rest.length > 2`.
5. Sticky footer CTA: `bg-cta` "Asmi, call {selected}" → status route; disabled until
   a selection exists.

`PhotoCarousel`: `snap-x snap-mandatory` scroll, `no-scrollbar`, dots overlay
(active dot wider/opaque) so multi-photo options are discoverable.

---

## 5. Screen: Execution (`src/routes/task.$taskId.status.tsx`)

1. `TopBar back` + task title.
2. **Outcome card** (cream): status badge, `font-display` headline (e.g. "Resolved"),
   detail sentence. Optional `asmiAction` sentence renders only when non-empty.
3. `ChannelSpine` — horizontal 4-step bar **Call → Retry → Message → Email**;
   `done` = filled amber + check, `active` = pulsing, `skipped` = dimmed dashed,
   `idle` = outline. Connector line fills between completed steps. Same 4 labels for
   every task; states differ per task.
4. **Timeline** — vertical rail, "N touchpoints" count, `time` (11px muted, tabular)
   + `text` per event, dot per node.
5. **Call recording** — expandable: duration, play control, static waveform bars,
   transcript as `Asmi` / `Them` turns.
6. **Message trail** — expandable thread bubbles (Asmi = amber-tinted right,
   provider = panel left) with timestamps.

Both 5 and 6 are collapsed by default with chevron rotation on expand.

---

## 6. Component contracts (`src/components/`)

| File | Props |
|---|---|
| `mobile-shell.tsx` | `{ children }` |
| `top-bar.tsx` | `{ back?: boolean, title?: string }` |
| `section-header.tsx` | `{ label: string, chip?: string }` |
| `live-task-card.tsx` | `{ task: Task }` |
| `place-hero-card.tsx` | `{ place, selected, onSelect }` |
| `place-row.tsx` | `{ place, selected, onSelect }` |
| `photo-carousel.tsx` | `{ photos, alt, aspect?, eager? }` |
| `channel-spine.tsx` | `{ steps: ChannelStep[] }` |

All are presentational and data-source agnostic; state (`selected`, `expanded`) lives
in the route.

---

## 7. Invariants

- Semantic tokens only; no raw color utilities.
- Images: `object-cover`, explicit `width`/`height`, `loading="lazy"` except the hero.
- Each route defines its own `head()` with unique title/description/og pair.
- Options data comes from a route `loader` + `notFound()` on unknown id.
- Never nest `<button>` inside `<button>` — use `role="button"` + key handlers.
- One scroll container per screen; tab bar and footer CTA stay `shrink-0`.