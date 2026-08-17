import { useState } from "react";
import { cn } from "@/lib/utils";

export function PhotoCarousel({
  photos,
  alt,
  aspect = "aspect-[16/10]",
  eager = false,
}: {
  photos: string[];
  alt: string;
  aspect?: string;
  eager?: boolean;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="relative">
      <div
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        onScroll={(e) => {
          const el = e.currentTarget;
          setActive(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {photos.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt={`${alt} photo ${i + 1}`}
            width={1024}
            height={640}
            loading={eager && i === 0 ? "eager" : "lazy"}
            className={cn("w-full shrink-0 snap-center object-cover", aspect)}
          />
        ))}
      </div>
      {photos.length > 1 ? (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-foreground/25 px-2 py-1 backdrop-blur">
          {photos.map((src, i) => (
            <span
              key={src + i}
              className={cn(
                "size-1.5 rounded-full bg-panel transition-opacity",
                i === active ? "opacity-100" : "opacity-45",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
