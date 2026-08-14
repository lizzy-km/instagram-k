import { useEffect, useMemo } from "react";
import { useAllPosts, useAllUsers } from "@/lib/query/hooks";
import { GalleryImageCard } from "./components/GalleryImageCard";
import { EmptyState, Skeleton } from "@/Components/ui";

interface WatchPageProps {
  defaultAvatar: string;
}

export function WatchPage({ defaultAvatar }: WatchPageProps) {
  const { data: posts, isLoading } = useAllPosts();
  const { data: users } = useAllUsers();

  useEffect(() => {
    document.title = "Queed | Gallery";
  }, []);

  const usersById = useMemo(() => new Map(users?.map((u) => [u.UID, u])), [users]);

  const images = useMemo(
    () =>
      posts?.flatMap((post) => {
        const ownerId = post.POST_OWNER_DETAIL?.POID;
        if (!ownerId) return [];
        return (post.POST_DETAIL?.POST_IMAGE_PATH ?? []).map((img) => ({
          url: img.downloadURL,
          ownerId,
          postId: post.PID,
        }));
      }) ?? [],
    [posts]
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-3 pb-8 pt-[76px]">
      <h1 className="mb-4 text-lg font-bold text-[var(--color-text)]">Gallery</h1>

      {isLoading && (
        <div className="columns-2 gap-3 sm:columns-3 md:columns-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="mb-3 aspect-[4/5] w-full break-inside-avoid" />
          ))}
        </div>
      )}

      {!isLoading && images.length === 0 && (
        <EmptyState title="No media yet" description="Photos shared in posts will appear here." />
      )}

      <div className="columns-2 gap-3 sm:columns-3 md:columns-4">
        {images.map((img) => {
          const owner = usersById.get(img.ownerId);
          return (
            <GalleryImageCard
              key={`${img.postId}_${img.url}`}
              imageUrl={img.url}
              ownerId={img.ownerId}
              ownerName={owner?.user_name ?? ""}
              ownerAvatarUrl={owner?.profile?.[0]?.src || defaultAvatar}
            />
          );
        })}
      </div>
    </div>
  );
}
