import { useMemo } from "react";
import { collection, orderBy, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { timeAgo } from "@/lib/useTimeAgo";
import { useCollectionDataWithId } from "@/lib/useCollectionDataWithId";
import { EmptyState, Skeleton } from "@/Components/ui";
import { Icon } from "@/Components/icons/Icon";
import { mdiHeart, mdiShare, mdiBookmark } from "@/Components/icons/paths";
import type { NotificationDoc } from "@/lib/firestore/types";

interface NotificationsPageProps {
  currentUserId: string;
}

const NOTIFICATION_LABEL: Record<NotificationDoc["type"], string> = {
  like: "liked your post",
  share: "shared your post",
  comment: "commented on your post",
  follow: "started following you",
};

const NOTIFICATION_ICON: Record<NotificationDoc["type"], string> = {
  like: mdiHeart,
  share: mdiShare,
  comment: mdiBookmark,
  follow: mdiHeart,
};

export function NotificationsPage({ currentUserId }: NotificationsPageProps) {
  const notificationsQuery = useMemo(
    () =>
      query(
        collection(firestore, "NOTIFICATION"),
        where("target", "==", currentUserId),
        orderBy("createdAt", "desc")
      ),
    [currentUserId]
  );
  const [notifications, loading] = useCollectionDataWithId<NotificationDoc>(notificationsQuery);

  return (
    <div className="mx-auto w-full max-w-xl px-3 pb-8 pt-[76px]">
      <h1 className="mb-4 text-lg font-bold text-[var(--color-text)]">Notifications</h1>

      {loading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {!loading && (!notifications || notifications.length === 0) && (
        <EmptyState title="No notifications yet" description="Activity on your posts will show up here." />
      )}

      <div className="flex flex-col gap-1">
        {notifications?.map((notification) => (
          <div
            key={notification.id}
            className="flex items-center gap-3 rounded-[var(--radius-md)] p-3 transition-colors hover:bg-[var(--color-surface)]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <Icon path={NOTIFICATION_ICON[notification.type]} size={0.85} />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-[var(--color-text)]">
                <span className="font-semibold">{notification.text}</span> {NOTIFICATION_LABEL[notification.type]}
              </p>
              <span className="text-xs text-[var(--color-text-faint)]">{timeAgo(notification.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
