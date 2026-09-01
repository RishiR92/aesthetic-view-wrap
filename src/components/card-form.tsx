import { ChevronUp, CreditCard } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function CardAccordion({
  label,
  open,
  onToggle,
  pending,
  onSubscribe,
  disabled,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  pending?: boolean | undefined;
  onSubscribe?: () => void;
  disabled?: boolean | undefined;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0);
    }
    if (open) {
      window.setTimeout(() => firstInputRef.current?.focus(), 180);
    }
  }, [open]);

  return (
    <div
      className={`overflow-hidden rounded-2xl transition-[background-color,box-shadow] duration-200 ${
        open ? "bg-cream-foreground/6 ring-1 ring-cream-foreground/10" : "bg-transparent"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className="flex h-[52px] w-full items-center justify-between gap-3 px-4 text-left"
      >
        <span className="flex items-center gap-2.5 text-[15px] font-semibold text-cream-foreground">
          <CreditCard className="size-[18px]" strokeWidth={2} />
          Pay with card
        </span>
        <ChevronUp
          className={`size-4 text-cream-foreground/60 transition-transform duration-200 ${open ? "" : "rotate-180"}`}
          strokeWidth={2}
        />
      </button>

      <div
        className="transition-[height,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ height }}
      >
        <div ref={contentRef} className="space-y-4 px-4 pb-4">
          <Field label="Name on card">
            <input
              ref={firstInputRef}
              type="text"
              autoComplete="cc-name"
              placeholder="Jane Doe"
              className="h-12 w-full rounded-2xl bg-cream-foreground/6 px-4 text-[14px] text-cream-foreground outline-none placeholder:text-cream-foreground/40 focus:ring-1 focus:ring-primary"
            />
          </Field>

          <Field label="Card number">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              maxLength={23}
              placeholder="1234 1234 1234 1234"
              className="h-12 w-full rounded-2xl bg-cream-foreground/6 px-4 text-[14px] text-cream-foreground outline-none placeholder:text-cream-foreground/40 focus:ring-1 focus:ring-primary"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Expiry">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                maxLength={5}
                placeholder="MM / YY"
                className="h-12 w-full rounded-2xl bg-cream-foreground/6 px-4 text-[14px] text-cream-foreground outline-none placeholder:text-cream-foreground/40 focus:ring-1 focus:ring-primary"
              />
            </Field>
            <Field label="CVC">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                maxLength={4}
                placeholder="CVC"
                className="h-12 w-full rounded-2xl bg-cream-foreground/6 px-4 text-[14px] text-cream-foreground outline-none placeholder:text-cream-foreground/40 focus:ring-1 focus:ring-primary"
              />
            </Field>
          </div>

          <button
            type="button"
            onClick={onSubscribe}
            disabled={disabled || pending}
            className="cta-fill mt-1 flex h-[52px] w-full items-center justify-center rounded-full text-[15px] font-semibold transition-transform active:scale-[0.99] disabled:opacity-70"
          >
            {pending ? (
              <span className="size-4 animate-spin rounded-full border-2 border-cta-foreground/40 border-t-cta-foreground" />
            ) : (
              label
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-cream-foreground/70">{label}</span>
      {children}
    </label>
  );
}
