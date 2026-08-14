import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProfileHeader } from "./components/ProfileHeader";
import { FeedPage } from "@/features/feed/FeedPage";
import { useUserByUsername } from "@/lib/query/hooks";
import { useMessengerStore } from "@/stores/useMessengerStore";
import { useIsDesktop } from "@/stores/useUiStore";
import { EmptyState } from "@/Components/ui";
import { DEFAULT_COVER_URL } from "@/lib/defaultAssets";

interface ProfilePageProps {
  currentUserId: string;
  defaultAvatar: string;
}

export function ProfilePage({ currentUserId, defaultAvatar }: ProfilePageProps) {
  const { user: username } = useParams<{ user: string }>();
  const { data: profileUser, isLoading } = useUserByUsername(username);
  const openThread = useMessengerStore((s) => s.openThread);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (profileUser?.user_name) {
      document.title = profileUser.user_name;
    }
  }, [profileUser?.user_name]);

  if (isLoading) return null;

  if (!profileUser) {
    return <EmptyState title="User not found" description="This profile doesn't exist or was removed." />;
  }

  const isOwnProfile = profileUser.UID === currentUserId;

  return (
    <section
      id="profile-page"
      className="flex flex-col items-center relative bg-[var(--color-bg)] w-full h-screen max-h-screen overflow-y-auto overflow-x-hidden"
    >
      <ProfileHeader
        userName={profileUser.user_name}
        nickName={profileUser.nick_name || null}
        avatarUrl={profileUser.profile?.[0]?.src || defaultAvatar}
        coverUrl={profileUser.cover_photo?.[0]?.src || DEFAULT_COVER_URL}
        isOwnProfile={isOwnProfile}
        onSendMessage={() => openThread(profileUser.UID)}
      />

      <section
        style={{
          top: !isDesktop ? "31%" : "81%",
          width: !isDesktop ? "100%" : "80%",
        }}
        className="absolute h-auto flex justify-center items-center p-2 gap-4"
      >
        <div style={{ width: !isDesktop ? "100%" : "45%" }} className="flex flex-col gap-4 rounded-md">
          <FeedPage currentUserId={currentUserId} filterByOwnerId={profileUser.UID} />
        </div>
      </section>
    </section>
  );
}
