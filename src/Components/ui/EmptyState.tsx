import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
      {icon && <div className="text-[var(--color-text-faint)]">{icon}</div>}
      <p className="text-base font-semibold text-[var(--color-text)]">{title}</p>
      {description && <p className="text-sm text-[var(--color-text-muted)] max-w-sm">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
