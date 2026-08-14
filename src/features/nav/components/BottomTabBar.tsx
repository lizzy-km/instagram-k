import { NavLink } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Image } from "@/Components/ui";
import { Icon } from "@/Components/icons/Icon";
import { mdiImageMultiple, mdiBookmark } from "@/Components/icons/paths";
import { queryKeys } from "@/lib/query/keys";

function tabClass({ isActive }: { isActive: boolean }) {
  return `flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors duration-[var(--duration-fast)] ${
    isActive ? "text-[var(--color-text)]" : "text-[var(--color-text-faint)]"
  }`;
}

interface BottomTabBarProps {
  avatarUrl: string;
  userId: string;
}

export function BottomTabBar({ avatarUrl, userId }: BottomTabBarProps) {
  const queryClient = useQueryClient();

  return (
    <nav className="fixed bottom-0 left-0 z-[99] flex w-full items-stretch border-t border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <NavLink
        to="/"
        end
        className={tabClass}
        onClick={() => queryClient.invalidateQueries({ queryKey: queryKeys.posts.all })}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
        </svg>
      </NavLink>

      <NavLink to="/gallery" className={tabClass}>
        <Icon path={mdiImageMultiple} size={0.9} />
      </NavLink>

      <NavLink to="/group" className={tabClass}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
        </svg>
      </NavLink>

      <NavLink to="/saved" className={tabClass}>
        <Icon path={mdiBookmark} size={0.9} />
      </NavLink>

      <NavLink to={`/${userId}`} className={tabClass}>
        <Image src={avatarUrl} alt="" aspectRatio="1 / 1" containerClassName="w-6 h-6 rounded-full" />
      </NavLink>
    </nav>
  );
}
