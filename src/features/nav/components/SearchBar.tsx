import { useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "@/Components/icons/Icon";
import { mdiCloseCircleMultiple } from "@/Components/icons/paths";
import { Image, EmptyState } from "@/Components/ui";
import { useAllUsers } from "@/lib/query/hooks";

interface SearchBarProps {
  defaultAvatar: string;
}

export function SearchBar({ defaultAvatar }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { data: users } = useAllUsers();
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (searchText.length <= 1) return [];
    const needle = searchText.toLowerCase();
    return users?.filter((u) => u.user_name?.toLowerCase().includes(needle)) ?? [];
  }, [users, searchText]);

  function open() {
    setIsOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function close() {
    setIsOpen(false);
    setSearchText("");
  }

  return (
    <div className="relative">
      <div
        className={`flex h-10 items-center rounded-[var(--radius-full)] bg-[var(--color-surface)] transition-[width] duration-[var(--duration-base)] ease-[var(--ease-standard)] ${
          isOpen ? "w-64" : "w-10"
        }`}
      >
        <button
          type="button"
          aria-label="Search"
          onClick={open}
          className="flex h-10 w-10 shrink-0 items-center justify-center text-[var(--color-text-muted)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
          </svg>
        </button>

        {isOpen && (
          <>
            <input
              ref={inputRef}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              placeholder="Search"
              className="h-full w-full bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] outline-none"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={close}
              className="flex h-10 w-9 shrink-0 items-center justify-center text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)]"
            >
              <Icon path={mdiCloseCircleMultiple} size={0.85} />
            </button>
          </>
        )}
      </div>

      {isOpen && searchText.length > 1 && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-[999] w-72 max-h-96 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 shadow-[var(--shadow-lg)] animate-[scale-in_var(--duration-fast)_var(--ease-standard)]">
          {results.length > 0 ? (
            results.map((u) => (
              <NavLink
                key={u.UID}
                onClick={close}
                to={`/${u.UID}`}
                className="flex items-center gap-3 rounded-[var(--radius-sm)] p-2 transition-colors hover:bg-[var(--color-surface)]"
              >
                <Image
                  src={u.profile?.[0]?.src || defaultAvatar}
                  alt=""
                  aspectRatio="1 / 1"
                  containerClassName="w-10 h-10 rounded-full shrink-0"
                />
                <span className="text-sm font-medium text-[var(--color-text)] truncate">{u.user_name}</span>
              </NavLink>
            ))
          ) : (
            <EmptyState title="No results" description={`No one matching "${searchText}"`} />
          )}
        </div>
      )}
    </div>
  );
}
