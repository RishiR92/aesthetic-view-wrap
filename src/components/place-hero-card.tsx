import { Check, Star } from "lucide-react";
import type { Place } from "@/lib/mock-tasks";
import { PhotoCarousel } from "@/components/photo-carousel";
import { cn } from "@/lib/utils";

export function PlaceHeroCard({
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
        "block w-full overflow-hidden rounded-3xl bg-cream text-left transition-transform active:scale-[0.99]",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
    >
      <div className="relative">
        <PhotoCarousel photos={place.photos} alt={place.name} aspect="aspect-[16/9]" eager />
        <div aria-hidden className="scrim pointer-events-none absolute inset-x-0 bottom-0 h-2/3" />
        <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
          ✦ Asmi pick
        </span>
        {selected ? (
          <span className="absolute right-4 top-4 grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-4" strokeWidth={3} />
          </span>
        ) : null}
      </div>

      <div className="p-4">
        <h3 className="text-[18px] font-bold leading-tight text-cream-foreground">{place.name}</h3>
        <p className="mt-1 text-[13px] leading-snug text-cream-foreground/60">
          {place.address} · {place.hours}
          {place.lead ? ` · ${place.lead}` : ""}
        </p>
        {place.price ? (
          <p className="mt-1 text-[13px] font-semibold text-cream-foreground">{place.price}</p>
        ) : null}
        <p className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold text-cream-foreground">
          <Star className="size-3.5 fill-current text-primary" strokeWidth={0} />
          {place.rating.toFixed(1)}
          <span className="font-normal text-cream-foreground/55">
            ({place.reviews.toLocaleString()} reviews)
          </span>
        </p>
        {place.reason ? (
          <p className="mt-3 border-l-2 border-primary pl-3 text-[13px] italic leading-snug text-cream-foreground/80">
            {place.reason}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {place.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-cream-foreground/15 px-2.5 py-1 text-[11px] font-medium text-cream-foreground/70"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}