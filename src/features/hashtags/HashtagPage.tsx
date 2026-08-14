import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAllPosts } from "@/lib/query/hooks";
import { PostCard } from "@/features/feed/components/PostCard";
import { EmptyState, Skeleton } from "@/Components/ui";

interface HashtagPageProps {
  currentUserId: string;
  defaultAvatar: string;
}

export function HashtagPage({ currentUserId, defaultAvatar }: HashtagPageProps) {
  const { tag } = useParams<{ tag: string }>();
  const { data: posts, isLoading } = useAllPosts();

  useEffect(() => {
    if (tag) document.title = `#${tag} | Queed`;
  }, [tag]);

  const taggedPosts = useMemo(
    () => posts?.filter((p) => p.POST_DETAIL?.HASHTAGS?.includes((tag ?? "").toLowerCase())) ?? [],
    [posts, tag]
  );

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-3 pb-8 pt-[76px]">
      <h1 className="text-lg font-bold text-[var(--color-text)]">#{tag}</h1>

      {isLoading && <Skeleton className="h-[420px] w-full" />}

      {!isLoading && taggedPosts.length === 0 && (
        <EmptyState title="No posts yet" description={`No posts are tagged #${tag}.`} />
      )}

      <div className="flex flex-col gap-4">
        {taggedPosts.map((post) => (
          <PostCard key={post.PID} post={post} currentUserId={currentUserId} defaultAvatar={defaultAvatar} />
        ))}
      </div>
    </div>
  );
}
