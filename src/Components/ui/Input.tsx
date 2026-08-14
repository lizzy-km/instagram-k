import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text)] px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";
