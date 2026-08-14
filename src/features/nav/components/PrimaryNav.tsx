import { NavLink } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Icon } from "@/Components/icons/Icon";
import { mdiImageMultiple, mdiBookmark } from "@/Components/icons/paths";
import { queryKeys } from "@/lib/query/keys";
import { useIsMobile, useIsTablet } from "@/stores/useUiStore";

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `relative flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] transition-all duration-[var(--duration-fast)] ${
    isActive
      ? "text-[var(--color-text)] bg-[var(--color-surface)]"
      : "text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]"
  }`;
}

export function PrimaryNav() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const queryClient = useQueryClient();

  return (
    <nav
      style={{ width: isMobile ? "92%" : isTablet ? "70%" : "420px" }}
      className="flex items-center justify-between gap-1 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/80 backdrop-blur-md px-2 py-1.5 shadow-[var(--shadow-sm)]"
    >
      <NavLink
        onClick={() => queryClient.invalidateQueries({ queryKey: queryKeys.posts.all })}
        to="/"
        className={navLinkClass}
        aria-label="Home"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
        </svg>
      </NavLink>

      <NavLink to="/gallery" className={navLinkClass} aria-label="Gallery">
        <Icon path={mdiImageMultiple} size={0.92} />
      </NavLink>

      <NavLink to="/saved" className={navLinkClass} aria-label="Saved">
        <Icon path={mdiBookmark} size={0.92} />
      </NavLink>

      <NavLink to="/group" className={navLinkClass} aria-label="Groups">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
        </svg>
      </NavLink>

      <NavLink to="/game" className={navLinkClass} aria-label="Game">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7,6H17A6,6 0 0,1 23,12A6,6 0 0,1 17,18C15.22,18 13.63,17.23 12.53,16H11.47C10.37,17.23 8.78,18 7,18A6,6 0 0,1 1,12A6,6 0 0,1 7,6M6,9V11H4V13H6V15H8V13H10V11H8V9H6M15.5,12A1.5,1.5 0 0,0 14,13.5A1.5,1.5 0 0,0 15.5,15A1.5,1.5 0 0,0 17,13.5A1.5,1.5 0 0,0 15.5,12M18.5,9A1.5,1.5 0 0,0 17,10.5A1.5,1.5 0 0,0 18.5,12A1.5,1.5 0 0,0 20,10.5A1.5,1.5 0 0,0 18.5,9Z" />
        </svg>
      </NavLink>
    </nav>
  );
}
