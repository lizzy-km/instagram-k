import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 px-4 text-center text-[var(--color-text-muted)]">
      {icon}
      <p className="text-base font-medium text-[var(--color-text)]">{title}</p>
      {description && <p className="text-sm max-w-xs">{description}</p>}
      {action}
    </div>
  );
}
