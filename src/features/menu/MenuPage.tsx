import { NavLink } from "react-router-dom";
import { Image } from "@/Components/ui";
import { Icon } from "@/Components/icons/Icon";
import { mdiBookmark, mdiCommentOutline } from "@/Components/icons/paths";
import { logoutUser } from "@/lib/firestore/authActions";
import { ThemeToggle } from "@/features/theme/ThemeToggle";

interface MenuPageProps {
  userId: string;
  userName: string;
  avatarUrl: string;
}

export function MenuPage({ userId, userName, avatarUrl }: MenuPageProps) {
  return (
    <div className="mx-auto w-full max-w-md px-3 pb-8 pt-[76px]">
      <NavLink
        to={`/${userId}`}
        className="mb-4 flex items-center gap-3 rounded-[var(--radius-md)] p-2 transition-colors hover:bg-[var(--color-surface)]"
      >
        <Image src={avatarUrl} alt="" aspectRatio="1 / 1" containerClassName="w-12 h-12 rounded-full shrink-0" />
        <span className="text-base font-semibold text-[var(--color-text)]">{userName}</span>
      </NavLink>

      <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)]">
        <NavLink
          to="/saved"
          className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)]"
        >
          <Icon path={mdiBookmark} size={0.85} />
          <span>Saved posts</span>
        </NavLink>

        <div className="h-px bg-[var(--color-border)]" />

        <NavLink
          to="/activity"
          className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)]"
        >
          <Icon path={mdiCommentOutline} size={0.85} />
          <span>Your activity</span>
        </NavLink>

        <div className="h-px bg-[var(--color-border)]" />

        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-[var(--color-text)]">Theme</span>
          <ThemeToggle />
        </div>

        <div className="h-px bg-[var(--color-border)]" />

        <button
          type="button"
          onClick={() => logoutUser(userId)}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger-soft)]"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
          </svg>
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
