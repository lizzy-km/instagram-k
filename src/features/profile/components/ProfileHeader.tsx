import { useState } from "react";
import { Image, Button } from "@/Components/ui";
import { Icon } from "@/Components/icons/Icon";
import { mdiSendVariantOutline } from "@/Components/icons/paths";
import { FollowButton } from "@/features/follow/FollowButton";
import { FollowListModal } from "@/features/follow/FollowListModal";
import { useFollowers, useFollowing } from "@/lib/query/hooks";

interface ProfileHeaderProps {
  userId: string;
  currentUserId: string;
  userName: string;
  nickName: string | null;
  avatarUrl: string;
  coverUrl: string;
  isOwnProfile: boolean;
  onSendMessage: () => void;
}

export function ProfileHeader({
  userId,
  currentUserId,
  userName,
  nickName,
  avatarUrl,
  coverUrl,
  isOwnProfile,
  onSendMessage,
}: ProfileHeaderProps) {
  const { data: followers } = useFollowers(userId);
  const { data: following } = useFollowing(userId);
  const [listModal, setListModal] = useState<"followers" | "following" | null>(null);

  return (
    <div className="w-full">
      <Image src={coverUrl} alt="" aspectRatio="3 / 1" containerClassName="w-full" />

      <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="-mt-10 flex items-end gap-4 sm:-mt-12">
          <Image
            src={avatarUrl}
            alt={userName}
            aspectRatio="1 / 1"
            containerClassName="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-[var(--color-bg)] shrink-0"
          />
          <div className="pb-1">
            <h1 className="text-lg font-bold text-[var(--color-text)] sm:text-xl">{userName}</h1>
            {nickName && <p className="text-sm text-[var(--color-text-faint)]">@{nickName}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isOwnProfile && (
            <>
              <FollowButton currentUserId={currentUserId} targetUserId={userId} targetUserName={userName} />
              <Button variant="secondary" onClick={onSendMessage}>
                <Icon path={mdiSendVariantOutline} size={0.8} />
                Message
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-2xl gap-5 px-4 text-sm">
        <button type="button" onClick={() => setListModal("followers")} className="hover:underline">
          <span className="font-semibold text-[var(--color-text)]">{followers?.length ?? 0}</span>{" "}
          <span className="text-[var(--color-text-muted)]">Followers</span>
        </button>
        <button type="button" onClick={() => setListModal("following")} className="hover:underline">
          <span className="font-semibold text-[var(--color-text)]">{following?.length ?? 0}</span>{" "}
          <span className="text-[var(--color-text-muted)]">Following</span>
        </button>
      </div>

      {listModal && (
        <FollowListModal open userId={userId} mode={listModal} onClose={() => setListModal(null)} />
      )}
    </div>
  );
}
