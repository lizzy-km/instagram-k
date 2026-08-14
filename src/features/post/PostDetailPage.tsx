import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePost } from "@/lib/query/hooks";
import { PostCard } from "@/features/feed/components/PostCard";
import { EmptyState, Skeleton } from "@/Components/ui";
import { DEFAULT_AVATAR_URL } from "@/lib/defaultAssets";

interface PostDetailPageProps {
  currentUserId: string;
}

export function PostDetailPage({ currentUserId }: PostDetailPageProps) {
  const { pid } = useParams<{ uid: string; pid: string }>();
  const { data: post, isLoading } = usePost(pid);

  useEffect(() => {
    document.title = "Queed | Post";
  }, []);

  return (
    <div className="mx-auto w-full max-w-xl px-3 pb-8 pt-[76px]">
      {isLoading && <Skeleton className="h-[420px] w-full" />}

      {!isLoading && !post && (
        <EmptyState title="Post not found" description="This post doesn't exist or was removed." />
      )}

      {post && <PostCard post={post} currentUserId={currentUserId} defaultAvatar={DEFAULT_AVATAR_URL} />}
    </div>
  );
}
