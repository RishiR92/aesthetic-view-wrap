export function SectionHeader({ label, chip }: { label: string; chip?: string }) {
  return (
    <div className="mb-3 mt-8 flex items-baseline justify-between">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{label}</h2>
      {chip ? (
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {chip}
        </span>
      ) : null}
    </div>
  );
}