# Cleaner live cards + fully-informative options screen

## 1. Home: drop the channel bar from live task cards

`LiveTaskCard` loses the four-segment CALL / RETRY / MESSAGE / EMAIL bar entirely. What remains:

- Pulsing amber status dot
- Task title
- Live line ("Waiting on a reply…")
- `8m ago` + chevron on the right

To keep the card from feeling empty, the live line gets slightly more presence (14px, amber-tinted status word) and the card padding tightens. Tapping still opens the status screen.

## 2. Options screen: every option shows full details

Today the hero card carries name, address, hours, rating, reason and tags, while the other options are photo tiles with only a name and rating. Fix by replacing the 2-column tile grid with a single-column **detail row card** so nothing is hidden:

```text
+--------------------------------------------+
| [ photo ]  Baklavastory.            4.9 ★  |
| [ 96x96 ]  1830 Harrison St · 0.6 mi       |
| [       ]  Open · Closes 6 PM              |
|            Takeout   Milk cake ✓           |
+--------------------------------------------+
```

- Square 96px rounded photo on the left, text stack on the right — no scrim text over images, so everything stays readable.
- Rating sits top-right in the same row as the name.
- Address and hours on one 13px muted line each, hours colored by open/closed.
- Tag chips beneath, plus the milk-cake / availability confirmation chip when present.
- Whole row is the tap target; selected state = amber ring + check badge replacing the rating chip corner.
- The hero card stays as-is (full-bleed carousel + Asmi's reason) so the recommendation still reads as the standout.
- "View N more options" expander stays, now revealing more rows.

This keeps one visual language: one image-forward hero, then a quiet, scannable list where each option carries the same fields as the hero minus Asmi's reason.

## 3. Status screen

The channel spine on `/task/$taskId/status` stays — that screen is specifically about execution across channels. Only the homepage card loses it.

## Technical notes

- `src/components/live-task-card.tsx`: remove the `task.steps` block.
- New `src/components/place-row.tsx`: detail row card described above; replaces `PlaceTile` usage in `src/routes/task.$taskId.index.tsx` (grid becomes a `space-y-2.5` stack). `place-tile.tsx` is deleted.
- `src/lib/mock-tasks.ts`: add optional `distance` and `confirmed` fields to `Place` and fill them for existing mock options so rows have complete data.
- No new tokens needed; reuse `cream`, `panel`, `primary`, `border`.
