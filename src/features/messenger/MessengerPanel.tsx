import { ThreadList } from "./ThreadList";
import { ChatThread } from "./ChatThread";
import { useMessengerStore } from "@/stores/useMessengerStore";

interface MessengerPanelProps {
  currentUserId: string;
  currentUserAvatar: string | null;
  defaultAvatar: string;
}

export function MessengerPanel({ currentUserId, currentUserAvatar, defaultAvatar }: MessengerPanelProps) {
  const { activeThreadUserId, openThread } = useMessengerStore();

  if (activeThreadUserId && activeThreadUserId !== currentUserId) {
    return (
      <ChatThread
        currentUserId={currentUserId}
        targetUserId={activeThreadUserId}
        currentUserAvatar={currentUserAvatar}
        defaultAvatar={defaultAvatar}
      />
    );
  }

  return <ThreadList currentUserId={currentUserId} defaultAvatar={defaultAvatar} onSelect={openThread} />;
}
