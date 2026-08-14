import { useAllPosts } from "@/lib/query/hooks";
import { PostCard } from "./components/PostCard";
import { CreatePostBar } from "./components/CreatePostBar";
import { Skeleton, EmptyState } from "@/Components/ui";
import { useSessionStore } from "@/stores/useSessionStore";

interface FeedPageProps {
  currentUserId: string;
  filterByOwnerId?: string;
}

export function FeedPage({ currentUserId, filterByOwnerId }: FeedPageProps) {
  const { data: posts, isLoading, isError } = useAllPosts();
  const admin = useSessionStore((s) => s.admin);
  const avatarUrl = useSessionStore((s) => s.adminAvatarUrl);
  const firstName = admin?.user_name?.split(" ")[0] ?? "";

  const visiblePosts = filterByOwnerId
    ? posts?.filter((p) => p.POST_OWNER_DETAIL?.POID === filterByOwnerId)
    : posts;

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
        {visiblePosts?.map((post) => (
          <PostCard key={post.PID} post={post} currentUserId={currentUserId} defaultAvatar={avatarUrl} />
        ))}
      </div>
    </div>
  );
}
