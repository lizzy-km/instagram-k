import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "@/Components/icons/Icon";
import { mdiCloseCircleMultiple } from "@/Components/icons/paths";
import { Image } from "@/Components/ui";
import { useAllUsers } from "@/lib/query/hooks";

interface SearchBarProps {
  defaultAvatar: string;
}

export function SearchBar({ defaultAvatar }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { data: users } = useAllUsers();

  const results = useMemo(() => {
    if (searchText.length <= 1) return [];
    const needle = searchText.toLowerCase();
    return users?.filter((u) => u.user_name?.toLowerCase().includes(needle)) ?? [];
  }, [users, searchText]);

  function close() {
    setIsOpen(false);
    setSearchText("");
  }

  return (
    <div
      style={{ width: isOpen ? "80%" : "40px" }}
      className="pr-2 relative transition-all bg-[var(--color-surface)] px-1 flex h-[40px] rounded-full justify-start items-center"
    >
      <button type="button" aria-label="Search" onClick={() => setIsOpen(true)} className="cursor-pointer px-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
        </svg>
      </button>

      {isOpen && (
        <>
          <input
            autoFocus
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            placeholder="Search"
            className="transition-all bg-transparent outline-none border-none tracking-wide px-1 flex h-[40px] w-full justify-start items-center text-[var(--color-text)]"
          />
          <button type="button" aria-label="Close search" onClick={close} className="cursor-pointer opacity-50">
            <Icon path={mdiCloseCircleMultiple} size={1} />
          </button>

          <div className="flex justify-start items-center flex-col px-2 py-3 absolute top-[120%] left-0 w-full min-h-[100px] bg-[var(--color-surface)] rounded-xl z-[999]">
            {searchText.length > 1 && results.length > 0 ? (
              results.map((u) => (
                <NavLink
                  key={u.UID}
                  onClick={close}
                  to={`/${u.UID}`}
                  className="flex text-lg justify-start items-center p-2 rounded-lg hover:bg-[var(--color-bg-elevated)] gap-2 w-[95%] h-[50px]"
                >
                  <Image
                    src={u.profile?.[0]?.src || defaultAvatar}
                    alt=""
                    aspectRatio="1 / 1"
                    containerClassName="w-[50px] h-[50px] rounded-full"
                  />
                  <p>{u.user_name}</p>
                </NavLink>
              ))
            ) : searchText.length > 1 ? (
              <div className="flex p-2 rounded-lg bg-[var(--color-bg-elevated)] w-[95%] h-[40px] items-center">
                <p>No search results.</p>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
