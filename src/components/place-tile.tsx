import { Check, Star } from "lucide-react";
import type { Place } from "@/lib/mock-tasks";
import { cn } from "@/lib/utils";

export function PlaceTile({
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
        "relative block overflow-hidden rounded-2xl text-left transition-transform active:scale-[0.98]",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
    >
      <img
        src={place.photos[0]}
        alt={place.name}
        width={1024}
        height={640}
        loading="lazy"
        className="aspect-[4/3] w-full object-cover"
      />
      <div aria-hidden className="scrim absolute inset-0" />
      {selected ? (
        <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      ) : null}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="truncate text-[13px] font-bold leading-tight text-foreground">{place.name}</p>
        <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-foreground/80">
          <Star className="size-3 fill-current text-primary" strokeWidth={0} />
          {place.rating.toFixed(1)}
          <span className="text-foreground/55">· {place.reviews.toLocaleString()}</span>
        </p>
      </div>
    </button>
  );
}