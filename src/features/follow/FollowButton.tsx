import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/Components/ui";
import { useIsFollowing } from "@/lib/query/hooks";
import { followUser, unfollowUser } from "@/lib/firestore/follows";
import { createNotification } from "@/lib/firestore/notifications";
import { logActivity } from "@/lib/firestore/activity";
import { queryKeys } from "@/lib/query/keys";

interface FollowButtonProps {
  currentUserId: string;
  targetUserId: string;
  targetUserName: string;
}

export function FollowButton({ currentUserId, targetUserId, targetUserName }: FollowButtonProps) {
  const queryClient = useQueryClient();
  const { data: isFollowing } = useIsFollowing(currentUserId, targetUserId);
  const [override, setOverride] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  const following = override ?? isFollowing;

  if (currentUserId === targetUserId) return null;

  async function toggleFollow() {
    setBusy(true);
    const next = !following;
    setOverride(next);
    try {
      if (next) {
        await followUser(currentUserId, targetUserId);
        createNotification({
          uid: currentUserId,
          target: targetUserId,
          type: "follow",
          text: "started following you",
          createdAt: Date.now(),
        }).catch(() => {});
        logActivity(currentUserId, "user_followed", targetUserId, targetUserName);
      } else {
        await unfollowUser(currentUserId, targetUserId);
        logActivity(currentUserId, "user_unfollowed", targetUserId, targetUserName);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.follows.following(currentUserId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.follows.followers(targetUserId) });
    } catch {
      setOverride(!next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button variant={following ? "secondary" : "primary"} onClick={toggleFollow} disabled={busy}>
      {following ? "Following" : "Follow"}
    </Button>
  );
}
