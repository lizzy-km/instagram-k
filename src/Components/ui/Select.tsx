import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className = "", ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text)] px-3.5 py-2.5 text-sm transition-colors duration-[var(--duration-fast)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] ${className}`}
      {...props}
    />
  );
});

Select.displayName = "Select";
