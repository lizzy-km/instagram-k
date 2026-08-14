import { useId, useRef } from "react";
import type { ReactNode } from "react";

export interface TabItem {
  value: string;
  label: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ items, value, onChange, className = "" }: TabsProps) {
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);

  function onKeyDown(e: React.KeyboardEvent) {
    const index = items.findIndex((item) => item.value === value);
    if (index === -1) return;

    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") nextIndex = (index + 1) % items.length;
    if (e.key === "ArrowLeft") nextIndex = (index - 1 + items.length) % items.length;
    if (e.key === "Home") nextIndex = 0;
    if (e.key === "End") nextIndex = items.length - 1;

    if (nextIndex === null) return;
    e.preventDefault();
    const next = items[nextIndex];
    if (!next) return;
    onChange(next.value);
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]?.focus();
  }

  return (
    <div ref={listRef} role="tablist" className={`flex gap-1 ${className}`} onKeyDown={onKeyDown}>
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            id={`${baseId}-tab-${item.value}`}
            aria-selected={selected}
            aria-controls={`${baseId}-panel-${item.value}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.value)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] ${
              selected
                ? "bg-[var(--color-accent)] text-white"
                : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

interface TabPanelProps {
  value: string;
  activeValue: string;
  baseId: string;
  children: ReactNode;
}

export function TabPanel({ value, activeValue, baseId, children }: TabPanelProps) {
  if (value !== activeValue) return null;
  return (
    <div role="tabpanel" id={`${baseId}-panel-${value}`} aria-labelledby={`${baseId}-tab-${value}`}>
      {children}
    </div>
  );
}
