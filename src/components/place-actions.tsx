import { Globe, Phone } from "lucide-react";
import type { Place } from "@/lib/mock-tasks";
import { cn } from "@/lib/utils";

export function PlaceActions({
  place,
  tone = "panel",
  className,
}: {
  place: Place;
  tone?: "panel" | "cream";
  className?: string;
}) {
  if (!place.website && !place.phone) return null;

  const hair = tone === "cream" ? "border-cream-foreground/12" : "border-panel-foreground/10";
  const text = tone === "cream" ? "text-cream-foreground/60" : "text-panel-muted";

  const stop = (e: React.MouseEvent | React.KeyboardEvent) => e.stopPropagation();

  return (
    <span
      className={cn("mt-3 flex items-center gap-4 border-t pt-2.5", hair, text, className)}
    >
      {place.website ? (
        <a
          href={place.website.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={stop}
          onKeyDown={stop}
          className="flex items-center gap-1.5 text-[11px] font-medium underline-offset-4 transition-opacity hover:underline hover:opacity-80"
        >
          <Globe className="size-[13px]" strokeWidth={2} />
          {place.website.label}
        </a>
      ) : null}
      {place.phone ? (
        <a
          href={`tel:${place.phone.replace(/\s/g, "")}`}
          onClick={stop}
          onKeyDown={stop}
          className="flex items-center gap-1.5 text-[11px] font-medium underline-offset-4 transition-opacity hover:underline hover:opacity-80"
        >
          <Phone className="size-[13px]" strokeWidth={2} />
          Call shop
        </a>
      ) : null}
    </span>
  );
}
