import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className = "", ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text)] px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] ${className}`}
      {...props}
    />
  );
});

Select.displayName = "Select";
