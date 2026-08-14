import { useMemo } from "react";
import { useAllPosts, usePostsFeed } from "@/lib/query/hooks";
import { PostCard } from "./components/PostCard";
import { CreatePostBar } from "./components/CreatePostBar";
import { Skeleton, EmptyState, Spinner } from "@/Components/ui";
import { useSessionStore } from "@/stores/useSessionStore";
import { useInfiniteScrollSentinel } from "@/lib/useInfiniteScrollSentinel";
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
  const admin = useSessionStore((s) => s.admin);
  const avatarUrl = useSessionStore((s) => s.adminAvatarUrl);
  const firstName = admin?.user_name?.split(" ")[0] ?? "";

  return filterByOwnerId ? (
    <ProfileFeed
      currentUserId={currentUserId}
      defaultAvatar={avatarUrl}
      filterByOwnerId={filterByOwnerId}
      sharedPostIds={sharedPostIds}
      sharedByName={sharedByName}
    />
  ) : (
    <HomeFeed currentUserId={currentUserId} defaultAvatar={avatarUrl} firstName={firstName} />
  );
}

/** The main, unfiltered feed - paginated 10-at-a-time, loading more as the last post scrolls into view. */
function HomeFeed({ currentUserId, defaultAvatar, firstName }: { currentUserId: string; defaultAvatar: string; firstName: string }) {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = usePostsFeed();
  const posts = useMemo(() => data?.pages.flatMap((page) => page.posts) ?? [], [data]);

  const sentinelRef = useInfiniteScrollSentinel<HTMLDivElement>(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, Boolean(hasNextPage));

  return (
    <div className="flex w-full flex-col gap-4">
      <CreatePostBar avatarUrl={defaultAvatar} firstName={firstName} />

      {isLoading && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-[420px] w-full" />
          <Skeleton className="h-[420px] w-full" />
        </div>
      )}

      {isError && (
        <EmptyState title="Couldn't load posts" description="Something went wrong fetching the feed. Try again shortly." />
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <EmptyState title="No posts yet" description="When posts are shared, they'll show up here." />
      )}

      <div className="flex flex-col gap-4">
        {posts.map((post, i) => (
          <div key={post.PID} ref={i === posts.length - 1 ? sentinelRef : undefined}>
            <PostCard post={post} currentUserId={currentUserId} defaultAvatar={defaultAvatar} />
          </div>
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Spinner size={24} />
        </div>
      )}
    </div>
  );
}

/** A profile's posts (authored + reshared) - needs the full dataset to merge/dedupe against, not paginated. */
function ProfileFeed({
  currentUserId,
  defaultAvatar,
  filterByOwnerId,
  sharedPostIds,
  sharedByName,
}: {
  currentUserId: string;
  defaultAvatar: string;
  filterByOwnerId: string;
  sharedPostIds?: string[];
  sharedByName?: string;
}) {
  const { data: posts, isLoading, isError } = useAllPosts();

  const visiblePosts = useMemo<VisiblePost[]>(() => {
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
      {isLoading && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-[420px] w-full" />
          <Skeleton className="h-[420px] w-full" />
        </div>
      )}

      {isError && (
        <EmptyState title="Couldn't load posts" description="Something went wrong fetching the feed. Try again shortly." />
      )}

      {!isLoading && !isError && visiblePosts.length === 0 && (
        <EmptyState title="No posts yet" description="When posts are shared, they'll show up here." />
      )}

      <div className="flex flex-col gap-4">
        {visiblePosts.map(({ post, sharedByName: postSharedByName }) => (
          <PostCard
            key={post.PID}
            post={post}
            currentUserId={currentUserId}
            defaultAvatar={defaultAvatar}
            sharedByName={postSharedByName}
          />
        ))}
      </div>
    </div>
  );
}
