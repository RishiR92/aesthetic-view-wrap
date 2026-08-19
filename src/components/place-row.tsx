import { Check, Star } from "lucide-react";
import type { Place } from "@/lib/mock-tasks";
import { PhotoCarousel } from "@/components/photo-carousel";
import { PlaceActions } from "@/components/place-actions";
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
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-pressed={selected}
      className={cn(
        "relative flex w-full items-stretch gap-3 overflow-hidden rounded-3xl bg-panel p-3 text-left transition-all duration-150 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected && "ring-2 ring-primary",
      )}
    >
      {selected ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl bg-primary/[0.06]"
        />
      ) : null}

      <span className="flex min-w-0 flex-1 flex-col justify-center py-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[15px] font-bold leading-tight text-panel-foreground">
            {place.name}
          </span>
          <span
            className={cn(
              "grid size-5 shrink-0 place-items-center rounded-full transition-colors",
              selected
                ? "bg-primary text-primary-foreground"
                : "border border-panel-foreground/25 text-transparent",
            )}
          >
            <Check className="size-3" strokeWidth={3} />
          </span>
        </span>
        <span className="mt-1 flex items-center gap-1.5 text-[12.5px] font-semibold text-panel-foreground">
          <Star className="size-3.5 fill-current text-primary" strokeWidth={0} />
          {place.rating.toFixed(1)}
          <span className="font-normal text-panel-muted">
            ({place.reviews.toLocaleString()})
          </span>
          {place.price ? (
            <span className="font-normal text-panel-muted">· {place.price}</span>
          ) : null}
        </span>
        <span className="mt-1 block truncate text-[12.5px] leading-snug text-panel-muted">
          {place.address}
          {place.distance ? ` · ${place.distance}` : ""}
        </span>
        <span className="mt-0.5 block truncate text-[12.5px] leading-snug text-panel-muted">
          {place.hours}
          {place.lead ? ` · ${place.lead}` : ""}
        </span>
        <span className="mt-2 flex flex-wrap gap-1.5">
          {place.confirmed ? (
            <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10.5px] font-semibold text-primary">
              <Check className="size-3" strokeWidth={3} />
              {place.confirmed}
            </span>
          ) : null}
          {place.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-full border border-panel-foreground/12 px-2 py-0.5 text-[10.5px] font-medium text-panel-muted"
            >
              {t}
            </span>
          ))}
        </span>
        <PlaceActions place={place} />
      </span>

      <span className="w-[112px] shrink-0 overflow-hidden rounded-2xl">
        <PhotoCarousel photos={place.photos} alt={place.name} aspect="aspect-[3/4]" />
      </span>
    </div>
  );
}
