import { Star } from "lucide-react";
import type { Place } from "@/lib/mock-tasks";
import { PhotoCarousel } from "@/components/photo-carousel";
import { cn } from "@/lib/utils";

export function PlaceRow({
  place,
  selected,
  dimmed = false,
  onSelect,
}: {
  place: Place;
  selected: boolean;
  dimmed?: boolean;
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
      style={selected ? { boxShadow: "var(--shadow-lift)" } : undefined}
      className={cn(
        "relative flex w-full items-stretch gap-3 overflow-hidden rounded-3xl bg-panel p-3 text-left transition-[transform,opacity,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "scale-[1.02] opacity-100 ring-1 ring-primary"
          : dimmed
            ? "scale-[0.99] opacity-[0.72]"
            : "opacity-100",
      )}
    >
      {selected ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-4 left-0 w-[3px] rounded-full bg-primary"
        />
      ) : null}

      <span className="flex min-w-0 flex-1 flex-col justify-center py-1 pl-1">
        <span className="truncate text-[15px] font-bold leading-tight text-panel-foreground">
          {place.name}
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
        <span className="mt-0.5 block text-[12.5px] leading-snug text-panel-muted">
          {place.hours}
          {place.lead ? ` · ${place.lead}` : ""}
          {place.website ? (
            <>
              {" · "}
              <a
                href={place.website.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                className="font-medium underline decoration-panel-foreground/25 underline-offset-2 transition-opacity hover:opacity-70"
              >
                Website
                <span aria-hidden className="ml-0.5 text-[10px]">
                  ↗
                </span>
              </a>
            </>
          ) : null}
        </span>
        <span className="mt-2 flex flex-wrap gap-1.5">
          {place.confirmed ? (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10.5px] font-semibold text-primary">
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
      </span>

      <span className="w-[112px] shrink-0 overflow-hidden rounded-2xl">
        <PhotoCarousel photos={place.photos} alt={place.name} aspect="aspect-[3/4]" />
      </span>
    </div>
  );
}
