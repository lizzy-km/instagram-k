import { NavLink } from "react-router-dom";
import { Modal, Image, EmptyState, Skeleton } from "@/Components/ui";
import { useAllUsers, useFollowers, useFollowing } from "@/lib/query/hooks";
import { DEFAULT_AVATAR_URL } from "@/lib/defaultAssets";

interface FollowListModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  mode: "followers" | "following";
}

export function FollowListModal({ open, onClose, userId, mode }: FollowListModalProps) {
  const followersQuery = useFollowers(userId);
  const followingQuery = useFollowing(userId);
  const { data: allUsers } = useAllUsers();

  const edges = mode === "followers" ? followersQuery.data : followingQuery.data;
  const isLoading = mode === "followers" ? followersQuery.isLoading : followingQuery.isLoading;

  const userIds = edges?.map((e) => (mode === "followers" ? e.followerId : e.followingId)) ?? [];
  const users = allUsers?.filter((u) => userIds.includes(u.UID)) ?? [];

  return (
    <Modal open={open} onClose={onClose} labelledBy="follow-list-title">
      <div className="flex max-h-[70vh] w-[min(92vw,380px)] flex-col">
        <h2 id="follow-list-title" className="border-b border-[var(--color-border)] p-4 text-base font-semibold text-[var(--color-text)]">
          {mode === "followers" ? "Followers" : "Following"}
        </h2>

        <div className="flex-1 overflow-y-auto p-2">
          {isLoading && (
            <div className="flex flex-col gap-2 p-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}

          {!isLoading && users.length === 0 && (
            <EmptyState
              title={mode === "followers" ? "No followers yet" : "Not following anyone yet"}
              description={mode === "followers" ? "When people follow, they'll show up here." : "Accounts they follow will show up here."}
            />
          )}

          {users.map((user) => (
            <NavLink
              key={user.UID}
              to={`/${user.UID}`}
              onClick={onClose}
              className="flex items-center gap-3 rounded-[var(--radius-md)] p-2 transition-colors hover:bg-[var(--color-surface)]"
            >
              <Image
                src={user.profile?.[0]?.src || DEFAULT_AVATAR_URL}
                alt=""
                aspectRatio="1 / 1"
                containerClassName="w-11 h-11 rounded-full shrink-0"
              />
              <span className="text-sm font-medium text-[var(--color-text)]">{user.user_name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </Modal>
  );
}
