import { useAllUsers } from "@/lib/query/hooks";
import { ThreadListItem } from "./components/ThreadListItem";
import { EmptyState, Skeleton } from "@/Components/ui";

interface ThreadListProps {
  currentUserId: string;
  defaultAvatar: string;
  onSelect: (userId: string) => void;
}

export function ThreadList({ currentUserId, defaultAvatar, onSelect }: ThreadListProps) {
  const { data: users, isLoading } = useAllUsers();
  const others = users?.filter((u) => u.UID !== currentUserId) ?? [];

  return (
    <div className="flex h-full w-full flex-col">
      <div className="border-b border-[var(--color-border)] px-4 py-3">
        <h1 className="text-base font-semibold text-[var(--color-text)]">Messages</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : others.length === 0 ? (
          <EmptyState title="No conversations yet" description="Message someone to start a conversation." />
        ) : (
          others.map((user) => (
            <ThreadListItem key={user.UID} user={user} defaultAvatar={defaultAvatar} onClick={() => onSelect(user.UID)} />
          ))
        )}
      </div>
    </div>
  );
}
