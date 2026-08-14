import { useMemo } from "react";
import { collection, orderBy, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { timeAgo } from "@/lib/useTimeAgo";
import { useCollectionDataWithId } from "@/lib/useCollectionDataWithId";
import { EmptyState, Skeleton } from "@/Components/ui";
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

  if (loading) {
    return (
      <div className="flex flex-col w-full gap-2 p-2">
        <Skeleton className="h-[60px] w-full" />
        <Skeleton className="h-[60px] w-full" />
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return <EmptyState title="No notifications yet" description="Activity on your posts will show up here." />;
  }

  return (
    <div className="flex flex-col w-full h-full justify-start items-start gap-1">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="flex flex-col justify-center w-full h-auto min-h-[60px] bg-[var(--color-bg-elevated)] p-3 tracking-wide gap-1 rounded-md"
        >
          <p>
            <span className="font-medium">{notification.text}</span> {NOTIFICATION_LABEL[notification.type]}
          </p>
          <span className="text-xs text-[var(--color-text-muted)]">{timeAgo(notification.createdAt)}</span>
        </div>
      ))}
    </div>
  );
}
