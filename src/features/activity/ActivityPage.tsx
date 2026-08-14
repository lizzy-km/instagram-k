import { activityQuery } from "@/lib/firestore/activity";
import { useCollectionDataWithId } from "@/lib/useCollectionDataWithId";
import { timeAgo } from "@/lib/useTimeAgo";
import { EmptyState, Skeleton } from "@/Components/ui";
import { Icon } from "@/Components/icons/Icon";
import {
  mdiHeart,
  mdiShare,
  mdiBookmark,
  mdiCommentOutline,
  mdiDeleteForeverOutline,
  mdiPlusBoxMultipleOutline,
  mdiImageAlbum,
} from "@/Components/icons/paths";
import type { ActivityDoc, ActivityType } from "@/lib/firestore/types";

interface ActivityPageProps {
  userId: string;
}

const ACTIVITY_LABEL: Record<ActivityType, string> = {
  post_created: "You created a post",
  post_liked: "You liked a post",
  post_unliked: "You unliked a post",
  post_shared: "You shared a post",
  post_unshared: "You unshared a post",
  post_saved: "You saved a post",
  post_unsaved: "You unsaved a post",
  post_commented: "You commented on a post",
  post_deleted: "You deleted a post",
  story_created: "You added a story",
  story_deleted: "You deleted a story",
  profile_updated: "You updated your profile",
  user_followed: "You followed",
  user_unfollowed: "You unfollowed",
};

const ACTIVITY_ICON: Record<ActivityType, string> = {
  post_created: mdiPlusBoxMultipleOutline,
  post_liked: mdiHeart,
  post_unliked: mdiHeart,
  post_shared: mdiShare,
  post_unshared: mdiShare,
  post_saved: mdiBookmark,
  post_unsaved: mdiBookmark,
  post_commented: mdiCommentOutline,
  post_deleted: mdiDeleteForeverOutline,
  story_created: mdiImageAlbum,
  story_deleted: mdiDeleteForeverOutline,
  profile_updated: mdiImageAlbum,
  user_followed: mdiHeart,
  user_unfollowed: mdiHeart,
};

export function ActivityPage({ userId }: ActivityPageProps) {
  const [activity, loading] = useCollectionDataWithId<ActivityDoc>(activityQuery(userId));

  return (
    <div className="mx-auto w-full max-w-xl px-3 pb-8 pt-[76px]">
      <h1 className="mb-4 text-lg font-bold text-[var(--color-text)]">Your activity</h1>

      {loading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      )}

      {!loading && (!activity || activity.length === 0) && (
        <EmptyState title="No activity yet" description="Things you do across Queed will show up here." />
      )}

      <div className="flex flex-col gap-1">
        {activity?.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-[var(--radius-md)] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-text-muted)]">
              <Icon path={ACTIVITY_ICON[item.type]} size={0.85} />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-[var(--color-text)]">
                {ACTIVITY_LABEL[item.type]}
                {item.targetLabel ? ` ${item.targetLabel}` : ""}
              </p>
              <span className="text-xs text-[var(--color-text-faint)]">{timeAgo(item.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
