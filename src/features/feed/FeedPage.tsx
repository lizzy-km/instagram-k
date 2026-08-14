import { useMemo } from "react";
import { useAllPosts } from "@/lib/query/hooks";
import { PostCard } from "./components/PostCard";
import { CreatePostBar } from "./components/CreatePostBar";
import { Skeleton, EmptyState } from "@/Components/ui";
import { useSessionStore } from "@/stores/useSessionStore";
import type { PostDoc } from "@/lib/firestore/types";

interface FeedPageProps {
  currentUserId: string;
  filterByOwnerId?: string;
  /** Post IDs the profile owner shared (for a profile's "posts + reshares" view). */
  sharedPostIds?: string[];
  sharedByName?: string;
}

interface VisiblePost {
  post: PostDoc;
  sharedByName?: string;
}

export function FeedPage({ currentUserId, filterByOwnerId, sharedPostIds, sharedByName }: FeedPageProps) {
  const { data: posts, isLoading, isError } = useAllPosts();
  const admin = useSessionStore((s) => s.admin);
  const avatarUrl = useSessionStore((s) => s.adminAvatarUrl);
  const firstName = admin?.user_name?.split(" ")[0] ?? "";

  const visiblePosts = useMemo<VisiblePost[] | undefined>(() => {
    if (!filterByOwnerId) return posts?.map((post) => ({ post }));

    const authored = posts?.filter((p) => p.POST_OWNER_DETAIL?.POID === filterByOwnerId) ?? [];
    const authoredIds = new Set(authored.map((p) => p.PID));
    const shared =
      sharedPostIds && sharedPostIds.length > 0
        ? (posts ?? []).filter((p) => sharedPostIds.includes(p.PID) && !authoredIds.has(p.PID))
        : [];

    return [...authored.map((post) => ({ post })), ...shared.map((post) => ({ post, sharedByName }))].sort(
      (a, b) => (b.post.UPLOADED_AT ?? 0) - (a.post.UPLOADED_AT ?? 0)
    );
  }, [posts, filterByOwnerId, sharedPostIds, sharedByName]);

  return (
    <div className="flex w-full flex-col gap-4">
      {!filterByOwnerId && <CreatePostBar avatarUrl={avatarUrl} firstName={firstName} />}

      {isLoading && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-[420px] w-full" />
          <Skeleton className="h-[420px] w-full" />
        </div>
      )}

      {isError && (
        <EmptyState title="Couldn't load posts" description="Something went wrong fetching the feed. Try again shortly." />
      )}

      {!isLoading && !isError && visiblePosts?.length === 0 && (
        <EmptyState title="No posts yet" description="When posts are shared, they'll show up here." />
      )}

      <div className="flex flex-col gap-4">
        {visiblePosts?.map(({ post, sharedByName: postSharedByName }) => (
          <PostCard
            key={post.PID}
            post={post}
            currentUserId={currentUserId}
            defaultAvatar={avatarUrl}
            sharedByName={postSharedByName}
          />
        ))}
      </div>
    </div>
  );
}
