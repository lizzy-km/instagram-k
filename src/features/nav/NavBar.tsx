import { useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { AccountMenu } from "./components/AccountMenu";
import { PrimaryNav } from "./components/PrimaryNav";
import { Image } from "@/Components/ui";
import { Icon } from "@/Components/icons/Icon";
import { mdiSendVariantOutline } from "@/Components/icons/paths";
import { useIsDesktop, useIsMobile } from "@/stores/useUiStore";
import { useMessengerStore } from "@/stores/useMessengerStore";
import { useNavigate } from "react-router-dom";

interface NavBarProps {
  userId: string;
  userName: string;
  avatarUrl: string;
}

export function NavBar({ userId, userName, avatarUrl }: NavBarProps) {
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const [accountOpen, setAccountOpen] = useState(false);
  const openThread = useMessengerStore((s) => s.openThread);

  return (
    <header
      className={`${isMobile ? "flex-row-reverse" : "flex"} justify-between items-center fixed z-[99] py-2 w-full px-2`}
    >
      <div className={`${isMobile ? "flex-row-reverse" : ""} flex gap-2 items-center h-full`}>
        <a href="/" className="cursor-pointer flex rounded-full justify-center items-center">
          <img className="h-[40px] w-[40px] object-cover" src="/Logo.svg" alt="Queed" />
        </a>
        <SearchBar defaultAvatar={avatarUrl} />
      </div>

      {isDesktop && <PrimaryNav />}

      <div className="flex gap-3 items-center h-full">
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => navigate("/notification")}
          className="cursor-pointer flex w-[40px] h-[40px] rounded-full p-[10px] bg-[var(--color-surface)]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12,22C13.1,22 14,21.1 14,20H10C10,21.1 10.9,22 12,22M18,16V11C18,7.93 16.37,5.36 13.5,4.68V4C13.5,3.17 12.83,2.5 12,2.5C11.17,2.5 10.5,3.17 10.5,4V4.68C7.64,5.36 6,7.92 6,11V16L4,18V19H20V18L18,16Z" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Messenger"
          onClick={() => openThread(userId)}
          className="cursor-pointer flex w-[40px] h-[40px] rounded-full p-[3px] bg-[var(--color-surface)]"
        >
          <Icon path={mdiSendVariantOutline} size={1} />
        </button>

        <button
          type="button"
          aria-label="Account settings"
          onClick={() => setAccountOpen((v) => !v)}
          className="relative cursor-pointer w-[40px] h-[40px] flex rounded-full bg-[var(--color-surface)]"
        >
          <Image src={avatarUrl} alt="" aspectRatio="1 / 1" containerClassName="rounded-full" />
        </button>
      </div>

      {accountOpen && (
        <div className="absolute top-[100%] right-2 w-[280px] z-[999]">
          <AccountMenu open={accountOpen} userId={userId} userName={userName} avatarUrl={avatarUrl} />
        </div>
      )}
    </header>
  );
}
