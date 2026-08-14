import { useEffect, useRef } from "react";

/**
 * Returns a ref to attach to the last-rendered item. When that item scrolls
 * into the viewport, onIntersect fires (typically to fetch the next page).
 */
export function useInfiniteScrollSentinel<T extends HTMLElement>(onIntersect: () => void, enabled: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onIntersect();
      },
      { rootMargin: "400px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onIntersect, enabled]);

  return ref;
}
