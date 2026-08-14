import { useEffect } from "react";
import { useAllPosts } from "@/lib/query/hooks";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { PostCard } from "@/features/feed/components/PostCard";
import { EmptyState, Skeleton } from "@/Components/ui";

interface SavedPageProps {
  currentUserId: string;
  defaultAvatar: string;
}

export function SavedPage({ currentUserId, defaultAvatar }: SavedPageProps) {
  const { data: posts, isLoading } = useAllPosts();
  const savedPostIds = useLibraryStore((s) => s.savedPostIds);

  useEffect(() => {
    document.title = "Queed | Saved";
  }, []);

  const savedPosts = posts?.filter((p) => savedPostIds.includes(p.PID));

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-3 pb-8 pt-[76px]">
      <h1 className="text-lg font-bold text-[var(--color-text)]">Saved posts</h1>

      {isLoading && <Skeleton className="h-[420px] w-full" />}

      {!isLoading && savedPosts?.length === 0 && (
        <EmptyState title="No saved posts" description="Posts you bookmark will show up here." />
      )}

      <div className="flex flex-col gap-4">
        {savedPosts?.map((post) => (
          <PostCard key={post.PID} post={post} currentUserId={currentUserId} defaultAvatar={defaultAvatar} />
        ))}
      </div>
    </div>
  );
}
