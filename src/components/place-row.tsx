import { Check, Star } from "lucide-react";
import type { Place } from "@/lib/mock-tasks";
import { cn } from "@/lib/utils";

export function PlaceRow({
  place,
  selected,
  onSelect,
}: {
  place: Place;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex w-full gap-3.5 rounded-2xl bg-panel p-3 text-left transition-transform active:scale-[0.99]",
        selected && "ring-2 ring-primary",
      )}
    >
      <span className="relative shrink-0">
        <img
          src={place.photos[0]}
          alt={place.name}
          width={1024}
          height={640}
          loading="lazy"
          className="size-24 rounded-xl object-cover"
        />
        {selected ? (
          <span className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3.5" strokeWidth={3} />
          </span>
        ) : null}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="truncate text-[15px] font-bold leading-tight text-panel-foreground">
            {place.name}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-panel-foreground">
            <Star className="size-3.5 fill-current text-primary" strokeWidth={0} />
            {place.rating.toFixed(1)}
          </span>
        </span>
        <span className="mt-1 block truncate text-[13px] leading-snug text-panel-muted">
          {place.address}
          {place.distance ? ` · ${place.distance}` : ""}
        </span>
        <span className="mt-0.5 block truncate text-[13px] leading-snug text-panel-muted">
          {place.hours}
        </span>
        <span className="mt-2 flex flex-wrap gap-1.5">
          {place.confirmed ? (
            <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
              <Check className="size-3" strokeWidth={3} />
              {place.confirmed}
            </span>
          ) : null}
          {place.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-panel-foreground/12 px-2 py-0.5 text-[11px] font-medium text-panel-muted"
            >
              {t}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}