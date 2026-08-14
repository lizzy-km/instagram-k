import { useAllUsers } from "@/lib/query/hooks";
import { ThreadListItem } from "./components/ThreadListItem";
import { EmptyState } from "@/Components/ui";

interface ThreadListProps {
  currentUserId: string;
  defaultAvatar: string;
  onSelect: (userId: string) => void;
}

export function ThreadList({ currentUserId, defaultAvatar, onSelect }: ThreadListProps) {
  const { data: users } = useAllUsers();
  const others = users?.filter((u) => u.UID !== currentUserId) ?? [];

  if (others.length === 0) {
    return <EmptyState title="No conversations yet" description="Message someone to start a conversation." />;
  }

  return (
    <div className="flex flex-col w-full gap-2 h-full max-h-full overflow-y-auto justify-start items-start">
      {others.map((user) => (
        <ThreadListItem key={user.UID} user={user} defaultAvatar={defaultAvatar} onClick={() => onSelect(user.UID)} />
      ))}
    </div>
  );
}
