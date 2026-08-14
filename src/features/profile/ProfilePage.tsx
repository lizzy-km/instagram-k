import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileHeader } from "./components/ProfileHeader";
import { FeedPage } from "@/features/feed/FeedPage";
import { useUserByUsername } from "@/lib/query/hooks";
import { EmptyState, Skeleton } from "@/Components/ui";
import { DEFAULT_COVER_URL } from "@/lib/defaultAssets";

interface ProfilePageProps {
  currentUserId: string;
  defaultAvatar: string;
}

export function ProfilePage({ currentUserId, defaultAvatar }: ProfilePageProps) {
  const { user: username } = useParams<{ user: string }>();
  const { data: profileUser, isLoading } = useUserByUsername(username);
  const navigate = useNavigate();

  useEffect(() => {
    if (profileUser?.user_name) {
      document.title = profileUser.user_name;
    }
  }, [profileUser?.user_name]);

  if (isLoading) {
    return (
      <div className="w-full pt-[68px]">
        <Skeleton className="h-48 w-full rounded-none" />
        <div className="mx-auto max-w-2xl px-4 pt-6">
          <Skeleton className="h-6 w-40" />
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex w-full pt-[68px]">
        <EmptyState title="User not found" description="This profile doesn't exist or was removed." />
      </div>
    );
  }

  const isOwnProfile = profileUser.UID === currentUserId;

  return (
    <div className="w-full pt-[68px]">
      <ProfileHeader
        userId={profileUser.UID}
        currentUserId={currentUserId}
        userName={profileUser.user_name}
        nickName={profileUser.nick_name || null}
        avatarUrl={profileUser.profile?.[0]?.src || defaultAvatar}
        coverUrl={profileUser.cover_photo?.[0]?.src || DEFAULT_COVER_URL}
        isOwnProfile={isOwnProfile}
        onSendMessage={() => navigate(`/message/${profileUser.UID}`)}
      />

      <div className="mx-auto mt-6 max-w-2xl px-4 pb-8">
        <FeedPage
          currentUserId={currentUserId}
          filterByOwnerId={profileUser.UID}
          sharedPostIds={profileUser.shared_posts?.map((s) => s.SHPID) ?? []}
          sharedByName={profileUser.user_name}
        />
      </div>
    </div>
  );
}
