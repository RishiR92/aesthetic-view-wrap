import { Check, Star } from "lucide-react";
import type { Place } from "@/lib/mock-tasks";
import { PhotoCarousel } from "@/components/photo-carousel";
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
    <div
      className={cn(
        "overflow-hidden rounded-3xl bg-panel transition-transform",
        selected && "ring-2 ring-primary",
      )}
    >
      <div className="relative">
        <PhotoCarousel photos={place.photos} alt={place.name} aspect="aspect-[16/9]" />
        {place.price ? (
          <span className="absolute left-3 top-3 rounded-full bg-foreground/35 px-2.5 py-1 text-[11px] font-semibold text-panel backdrop-blur">
            {place.price}
          </span>
        ) : null}
        {selected ? (
          <span className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-4" strokeWidth={3} />
          </span>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="w-full p-4 text-left transition-transform active:scale-[0.99]"
      >
        <span className="flex items-start justify-between gap-2">
          <span className="truncate text-[16px] font-bold leading-tight text-panel-foreground">
            {place.name}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-panel-foreground">
            <Star className="size-3.5 fill-current text-primary" strokeWidth={0} />
            {place.rating.toFixed(1)}
            <span className="font-normal text-panel-muted">
              ({place.reviews.toLocaleString()})
            </span>
          </span>
        </span>
        <span className="mt-1 block truncate text-[13px] leading-snug text-panel-muted">
          {place.address}
          {place.distance ? ` · ${place.distance}` : ""}
        </span>
        <span className="mt-0.5 block truncate text-[13px] leading-snug text-panel-muted">
          {place.hours}
          {place.lead ? ` · ${place.lead}` : ""}
        </span>
        <span className="mt-3 flex flex-wrap gap-1.5">
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
      </button>
    </div>
  );
}
