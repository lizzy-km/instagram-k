import { NavLink } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Icon } from "@/Components/icons/Icon";
import { mdiImageMultiple, mdiBookmark } from "@/Components/icons/paths";
import { queryKeys } from "@/lib/query/keys";
import { useIsMobile, useIsTablet } from "@/stores/useUiStore";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative py-1 w-1/5 h-full ${isActive ? "active" : ""}`;

export function PrimaryNav() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const queryClient = useQueryClient();

  return (
    <section
      style={{ width: isMobile ? "90%" : isTablet ? "60%" : "40%" }}
      className="backdrop-blur-md bg-[var(--color-bg-overlay)] rounded-lg h-[60px] flex justify-center items-center"
    >
      <div className="flex w-full h-full justify-between items-center">
        <NavLink
          onClick={() => queryClient.invalidateQueries({ queryKey: queryKeys.posts.all })}
          to="/"
          className={navLinkClass}
        >
          <div className="out_line absolute bottom-0 rounded-t-lg z-[99] w-full h-1" />
          <div className="transition-colors rounded-md justify-center items-center cursor-pointer hover:bg-[var(--color-surface)] flex h-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
            </svg>
          </div>
        </NavLink>

        <NavLink to="/gallery" className={navLinkClass}>
          <div className="out_line absolute bottom-0 rounded-t-lg z-[99] w-full h-1" />
          <div className="transition-colors rounded-md justify-center items-center cursor-pointer hover:bg-[var(--color-surface)] flex h-full">
            <Icon path={mdiImageMultiple} size={1} />
          </div>
        </NavLink>

        <NavLink to="/saved" className={navLinkClass}>
          <div className="out_line absolute bottom-0 rounded-t-lg z-[99] w-full h-1" />
          <div className="transition-colors rounded-md justify-center items-center cursor-pointer hover:bg-[var(--color-surface)] flex h-full">
            <Icon path={mdiBookmark} size={1} />
          </div>
        </NavLink>

        <NavLink to="/group" className={navLinkClass}>
          <div className="out_line absolute bottom-0 rounded-t-lg z-[99] w-full h-1" />
          <div className="transition-colors rounded-md justify-center items-center cursor-pointer hover:bg-[var(--color-surface)] flex h-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
            </svg>
          </div>
        </NavLink>

        <NavLink to="/game" className={navLinkClass}>
          <div className="out_line absolute bottom-0 rounded-t-lg z-[99] w-full h-1" />
          <div className="transition-colors rounded-md justify-center items-center cursor-pointer hover:bg-[var(--color-surface)] flex h-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7,6H17A6,6 0 0,1 23,12A6,6 0 0,1 17,18C15.22,18 13.63,17.23 12.53,16H11.47C10.37,17.23 8.78,18 7,18A6,6 0 0,1 1,12A6,6 0 0,1 7,6M6,9V11H4V13H6V15H8V13H10V11H8V9H6M15.5,12A1.5,1.5 0 0,0 14,13.5A1.5,1.5 0 0,0 15.5,15A1.5,1.5 0 0,0 17,13.5A1.5,1.5 0 0,0 15.5,12M18.5,9A1.5,1.5 0 0,0 17,10.5A1.5,1.5 0 0,0 18.5,12A1.5,1.5 0 0,0 20,10.5A1.5,1.5 0 0,0 18.5,9Z" />
            </svg>
          </div>
        </NavLink>
      </div>
    </section>
  );
}
