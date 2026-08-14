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
    <div className="flex flex-col gap-[50px] self-center p-2 my-2 h-auto w-full max-w-2xl rounded-md pt-[100px]">
      <h1 className="text-xl font-medium px-2">Saved posts</h1>

      {isLoading && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-[400px] w-full" />
        </div>
      )}

      {!isLoading && savedPosts?.length === 0 && (
        <EmptyState title="No saved posts" description="Posts you bookmark will show up here." />
      )}

      {savedPosts?.map((post) => (
        <PostCard key={post.PID} post={post} currentUserId={currentUserId} defaultAvatar={defaultAvatar} />
      ))}
    </div>
  );
}
