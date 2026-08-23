

export function ApplePayButton({
  onPay,
  pending,
  disabled,
}: {
  onPay: () => void;
  pending?: boolean | undefined;
  disabled?: boolean | undefined;
}) {
  return (
    <button
      type="button"
      onClick={onPay}
      disabled={disabled || pending}
      aria-label="Subscribe with Apple Pay"
      className="flex h-[52px] w-full items-center justify-center gap-1.5 rounded-full bg-panel-foreground text-[16px] font-medium text-panel transition-transform active:scale-[0.99] disabled:opacity-60"
    >
      {pending ? (
        <span className="size-4 animate-spin rounded-full border-2 border-panel/40 border-t-panel" />
      ) : (
        <>
          <AppleMark />
          <span className="font-semibold tracking-tight">Pay</span>
        </>
      )}
    </button>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 16 20" aria-hidden="true" className="size-[18px] fill-current">
      <path d="M13.28 10.6c.02 2.5 2.2 3.33 2.23 3.35-.02.06-.35 1.2-1.16 2.37-.7 1.02-1.42 2.03-2.57 2.05-1.12.02-1.48-.66-2.77-.66-1.28 0-1.68.64-2.75.68-1.1.04-1.94-1.1-2.65-2.11C1.96 14.2.86 10.4 2.35 7.83c.74-1.28 2.06-2.09 3.49-2.11 1.08-.02 2.1.73 2.77.73.66 0 1.9-.9 3.2-.77.55.02 2.09.2 3.08 1.65-.08.05-1.84 1.08-1.82 3.22M11.1 3.6c.6-.72 1-1.72.89-2.72-.86.04-1.9.57-2.52 1.29-.55.63-1.03 1.65-.9 2.63.96.07 1.93-.49 2.53-1.2" />
    </svg>
  );
}
