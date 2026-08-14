import { useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/Components/ui";
import { ViewStoryCard } from "./components/ViewStoryCard";
import { useStoryViewerStore } from "@/stores/useStoryViewerStore";
import { useStoriesByOwner, useUser } from "@/lib/query/hooks";
import { deleteStory } from "@/lib/firestore/stories";
import { queryKeys } from "@/lib/query/keys";

interface ViewStoryModalProps {
  currentUserId: string;
  defaultAvatar: string;
}

export function ViewStoryModal({ currentUserId, defaultAvatar }: ViewStoryModalProps) {
  const queryClient = useQueryClient();
  const { open, activeOwnerId, close } = useStoryViewerStore();
  const { data: stories } = useStoriesByOwner(activeOwnerId);
  const { data: owner } = useUser(activeOwnerId);

  const story = stories?.[stories.length - 1];
  if (!story) return null;

  async function handleDelete() {
    if (!story) return;
    await deleteStory(story.id);
    queryClient.invalidateQueries({ queryKey: queryKeys.stories.all });
    close();
  }

  return (
    <Modal open={open} onClose={close}>
      <div className="h-[85vh] w-[min(92vw,400px)] bg-black">
        <ViewStoryCard
          story={story}
          ownerName={owner?.user_name ?? ""}
          ownerAvatarUrl={owner?.profile?.[0]?.src || defaultAvatar}
          canDelete={activeOwnerId === currentUserId}
          onDelete={handleDelete}
          onClose={close}
        />
      </div>
    </Modal>
  );
}
