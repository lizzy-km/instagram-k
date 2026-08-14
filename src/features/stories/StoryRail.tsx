import { useMemo } from "react";
import { useActiveStories, useAllUsers } from "@/lib/query/hooks";
import { StoryBubble } from "./components/StoryBubble";
import { useStoryViewerStore } from "@/stores/useStoryViewerStore";
import { useUiStore } from "@/stores/useUiStore";
import { Skeleton } from "@/Components/ui";

interface StoryRailProps {
  currentUserId: string;
  defaultAvatar: string;
}

export function StoryRail({ currentUserId, defaultAvatar }: StoryRailProps) {
  const { data: stories, isLoading } = useActiveStories();
  const { data: users } = useAllUsers();
  const setActiveOwnerId = useStoryViewerStore((s) => s.setActiveOwnerId);
  const setCreateStoryOpen = useUiStore((s) => s.setCreateStoryOpen);

  const ownerIdsWithStories = useMemo(() => {
    const ids = new Set<string>();
    stories?.forEach((s) => {
      if (s.STORY_OWNER_DETAIL?.STOID) ids.add(s.STORY_OWNER_DETAIL.STOID);
    });
    return ids;
  }, [stories]);

  const otherOwners = useMemo(
    () => users?.filter((u) => u.UID !== currentUserId && ownerIdsWithStories.has(u.UID)) ?? [],
    [users, currentUserId, ownerIdsWithStories]
  );

  if (isLoading) {
    return (
      <div className="story px-2 rounded-lg flex gap-3">
        <Skeleton className="min-w-[145px] h-[250px] rounded-md" />
        <Skeleton className="min-w-[145px] h-[250px] rounded-md" />
      </div>
    );
  }

  const currentUser = users?.find((u) => u.UID === currentUserId);
  const ownAvatar = currentUser?.profile?.[0]?.src || defaultAvatar;

  return (
    <div className="story px-2 rounded-lg">
      <div className="story-holder rounded-lg overflow-x-auto flex gap-3">
        <StoryBubble
          label="Your story"
          avatarUrl={ownAvatar}
          hasStory={ownerIdsWithStories.has(currentUserId)}
          isOwn
          onClick={() =>
            ownerIdsWithStories.has(currentUserId) ? setActiveOwnerId(currentUserId) : setCreateStoryOpen(true)
          }
        />

        {otherOwners.map((owner) => (
          <StoryBubble
            key={owner.UID}
            label={owner.user_name}
            avatarUrl={owner.profile?.[0]?.src || defaultAvatar}
            hasStory
            onClick={() => setActiveOwnerId(owner.UID)}
          />
        ))}
      </div>
    </div>
  );
}
