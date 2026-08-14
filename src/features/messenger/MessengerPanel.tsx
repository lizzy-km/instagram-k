import { useNavigate, useParams } from "react-router-dom";
import { ThreadList } from "./ThreadList";
import { ChatThread } from "./ChatThread";

interface MessengerPanelProps {
  currentUserId: string;
  currentUserAvatar: string | null;
  defaultAvatar: string;
}

export function MessengerPanel({ currentUserId, currentUserAvatar, defaultAvatar }: MessengerPanelProps) {
  const { id: targetUserId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (targetUserId && targetUserId !== currentUserId) {
    return (
      <ChatThread
        currentUserId={currentUserId}
        targetUserId={targetUserId}
        currentUserAvatar={currentUserAvatar}
        defaultAvatar={defaultAvatar}
      />
    );
  }

  return (
    <ThreadList
      currentUserId={currentUserId}
      defaultAvatar={defaultAvatar}
      onSelect={(userId) => navigate(`/message/${userId}`)}
    />
  );
}
