import { NavLink } from "react-router-dom";
import { Image } from "@/Components/ui";
import { logoutUser } from "@/lib/firestore/authActions";
import { ThemeToggle } from "@/features/theme/ThemeToggle";

interface MenuPageProps {
  userId: string;
  userName: string;
  avatarUrl: string;
}

export function MenuPage({ userId, userName, avatarUrl }: MenuPageProps) {
  return (
    <div className="flex flex-col w-full h-screen justify-start items-start p-4 gap-2">
      <NavLink
        to={`/${userId}`}
        className="text-[var(--color-text)] flex w-full px-2 py-1 hover:bg-[var(--color-surface)] rounded-md cursor-pointer gap-2 h-[56px] justify-start items-center"
      >
        <Image src={avatarUrl} alt="" aspectRatio="1 / 1" containerClassName="w-[40px] h-[40px] rounded-full" />
        <p className="font-medium text-[16px] tracking-wide">{userName}</p>
      </NavLink>

      <NavLink
        to="/saved"
        className="text-[var(--color-text)] flex w-full px-2 py-1 hover:bg-[var(--color-surface)] rounded-md cursor-pointer gap-2 h-[45px] justify-start items-center"
      >
        Saved posts
      </NavLink>

      <div className="flex w-full px-2 py-1 gap-2 h-[45px] justify-between items-center">
        <span>Theme</span>
        <ThemeToggle />
      </div>

      <button
        type="button"
        onClick={() => logoutUser(userId)}
        className="text-[var(--color-text)] flex w-full px-2 py-1 hover:bg-[var(--color-surface)] rounded-md cursor-pointer gap-2 h-[45px] justify-start items-center"
      >
        <span className="hover:text-red-500">Logout</span>
      </button>
    </div>
  );
}
