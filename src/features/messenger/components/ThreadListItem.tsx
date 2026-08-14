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
      className="flex w-full items-center gap-3 rounded-[var(--radius-md)] p-2 text-left transition-colors hover:bg-[var(--color-surface)]"
    >
      <div className="relative shrink-0">
        <Image src={user.profile?.[0]?.src || defaultAvatar} alt="" aspectRatio="1 / 1" containerClassName="w-12 h-12 rounded-full" />
        {user.status === "online" && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--color-bg-elevated)] bg-[var(--color-online)]" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-[var(--color-text)]">{user.user_name}</span>
        <span className="text-xs text-[var(--color-text-faint)]">
          {user.status === "online" ? "Active now" : "Offline"}
        </span>
      </div>
    </button>
  );
}
