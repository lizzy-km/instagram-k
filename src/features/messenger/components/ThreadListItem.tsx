import { Image } from "@/Components/ui";
import type { UserDoc } from "@/lib/firestore/types";

interface ThreadListItemProps {
  user: UserDoc;
  defaultAvatar: string;
  onClick: () => void;
}

export function ThreadListItem({ user, defaultAvatar, onClick }: ThreadListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-auto p-2 flex gap-2 items-center hover:bg-[var(--color-surface)] rounded-md text-left"
    >
      <Image src={user.profile?.[0]?.src || defaultAvatar} alt="" aspectRatio="1 / 1" containerClassName="w-[45px] h-[45px] rounded-full" />
      <div className="flex flex-col">
        <span className="font-medium">{user.user_name}</span>
        {user.status === "online" && <span className="text-xs text-[var(--color-online)]">online</span>}
      </div>
    </button>
  );
}
