import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: "accent" | "neutral" | "online";
}

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  accent: "bg-[var(--color-accent)] text-white",
  neutral: "bg-[var(--color-surface)] text-[var(--color-text-muted)]",
  online: "bg-[var(--color-online)] text-white",
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
