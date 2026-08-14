import { useEffect, useRef, useState } from "react";
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

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
    >
      {children}
    </button>
  );
}

export function NavBar({ userId, userName, avatarUrl }: NavBarProps) {
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const [accountOpen, setAccountOpen] = useState(false);
  const openThread = useMessengerStore((s) => s.openThread);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accountOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [accountOpen]);

  return (
    <header className="fixed top-0 z-[99] flex w-full items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 px-4 py-2.5 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <a href="/" className="flex shrink-0 items-center justify-center rounded-full">
          <img className="h-8 w-8 object-cover" src="/Logo.svg" alt="Queed" />
        </a>
        {!isMobile && <SearchBar defaultAvatar={avatarUrl} />}
      </div>

      {isDesktop && <PrimaryNav />}

      <div className="flex items-center gap-1.5">
        {isMobile && <SearchBar defaultAvatar={avatarUrl} />}

        <IconButton label="Notifications" onClick={() => navigate("/notification")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12,22C13.1,22 14,21.1 14,20H10C10,21.1 10.9,22 12,22M18,16V11C18,7.93 16.37,5.36 13.5,4.68V4C13.5,3.17 12.83,2.5 12,2.5C11.17,2.5 10.5,3.17 10.5,4V4.68C7.64,5.36 6,7.92 6,11V16L4,18V19H20V18L18,16Z" />
          </svg>
        </IconButton>

        <IconButton label="Messenger" onClick={() => openThread(userId)}>
          <Icon path={mdiSendVariantOutline} size={0.85} />
        </IconButton>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="Account settings"
            onClick={() => setAccountOpen((v) => !v)}
            className={`flex h-9 w-9 items-center justify-center rounded-full ring-2 transition-all duration-[var(--duration-fast)] ${
              accountOpen ? "ring-[var(--color-accent)]" : "ring-transparent hover:ring-[var(--color-border-strong)]"
            }`}
          >
            <Image src={avatarUrl} alt="" aspectRatio="1 / 1" containerClassName="rounded-full" />
          </button>

          {accountOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-64 z-[999]">
              <AccountMenu open={accountOpen} userId={userId} userName={userName} avatarUrl={avatarUrl} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
