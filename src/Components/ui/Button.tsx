import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-[var(--color-accent)] text-white hover:brightness-110",
  secondary: "bg-[var(--color-surface)] text-[var(--color-text)] hover:brightness-110",
  ghost: "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface)]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
