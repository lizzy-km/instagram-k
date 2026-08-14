import { NavLink } from "react-router-dom";
import { Image } from "@/Components/ui";
import { Icon } from "@/Components/icons/Icon";
import { mdiPlus } from "@/Components/icons/paths";
import { logoutUser } from "@/lib/firestore/authActions";
import { useUiStore } from "@/stores/useUiStore";

interface AccountMenuProps {
  open: boolean;
  userId: string;
  userName: string;
  avatarUrl: string;
}

export function AccountMenu({ open, userId, userName, avatarUrl }: AccountMenuProps) {
  const setAddProfileOpen = useUiStore((s) => s.setAddProfileOpen);

  if (!open) return null;

  return (
    <div className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-1.5 shadow-[var(--shadow-lg)] animate-[scale-in_var(--duration-fast)_var(--ease-standard)]">
      <NavLink
        to={`/${userId}`}
        className="flex items-center gap-3 rounded-[var(--radius-sm)] px-2.5 py-2 transition-colors hover:bg-[var(--color-surface)]"
      >
        <Image src={avatarUrl} alt="" aspectRatio="1 / 1" containerClassName="w-9 h-9 rounded-full shrink-0" />
        <span className="text-sm font-semibold text-[var(--color-text)] truncate">{userName}</span>
      </NavLink>

      <div className="my-1 h-px bg-[var(--color-border)]" />

      <button
        type="button"
        onClick={() => setAddProfileOpen(true)}
        className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-2.5 py-2 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)]"
      >
        <Icon path={mdiPlus} size={0.85} />
        <span>Change profile picture</span>
      </button>

      <button
        type="button"
        onClick={() => logoutUser(userId)}
        className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-2.5 py-2 text-sm text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger-soft)]"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
        </svg>
        <span>Log out</span>
      </button>
    </div>
  );
}
