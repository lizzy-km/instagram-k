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
    <div className="flex w-full backdrop-blur-lg bg-[var(--color-bg-elevated)] rounded-md">
      <div className="w-full h-full flex flex-col p-2 justify-start items-start gap-2">
        <button
          type="button"
          onClick={() => setAddProfileOpen(true)}
          className="text-[var(--color-text)] flex w-[90%] px-2 py-1 hover:bg-[var(--color-surface)] rounded-md cursor-pointer gap-2 h-[45px] justify-start items-center"
        >
          <Icon path={mdiPlus} size={1} />
          <p className="font-medium text-[16px] tracking-wide">Change Profile Picture</p>
        </button>

        <NavLink
          to={`/${userId}`}
          className="text-[var(--color-text)] flex w-[90%] px-2 py-1 hover:bg-[var(--color-surface)] rounded-md cursor-pointer gap-2 h-[45px] justify-start items-center"
        >
          <Image src={avatarUrl} alt="" aspectRatio="1 / 1" containerClassName="w-[40px] h-[40px] rounded-full" />
          <p className="font-medium text-[16px] tracking-wide">{userName}</p>
        </NavLink>

        <button
          type="button"
          onClick={() => logoutUser(userId)}
          className="text-[var(--color-text)] flex w-[90%] px-2 py-1 hover:bg-[var(--color-surface)] rounded-md cursor-pointer gap-2 h-[45px] justify-start items-center"
        >
          <p className="hover:text-red-500">Logout</p>
        </button>
      </div>
    </div>
  );
}
