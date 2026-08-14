import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { NameCard } from "./NameCard";
import { PostImageCarousel } from "./PostImageCarousel";
import { Icon } from "@/Components/icons/Icon";
import {
  mdiBookmark,
  mdiBookmarkOutline,
  mdiContentCopy,
  mdiDeleteForeverOutline,
  mdiDotsHorizontal,
  mdiHeart,
  mdiHeartOutline,
  mdiShare,
  mdiShareOutline,
} from "@/Components/icons/paths";
import { timeAgo } from "@/lib/useTimeAgo";
import { deletePost as deletePostRemote } from "@/lib/firestore/posts";
import { likePost, unlikePost, sharePost, unsharePost } from "@/lib/firestore/postActions";
import { useUser } from "@/lib/query/hooks";
import { queryKeys } from "@/lib/query/keys";
import { useLibraryStore } from "@/stores/useLibraryStore";
import type { PostDoc } from "@/lib/firestore/types";

interface PostCardProps {
  post: PostDoc;
  currentUserId: string;
  defaultAvatar: string;
  onDeleted?: () => void;
}

export function PostCard({ post, currentUserId, defaultAvatar, onDeleted }: PostCardProps) {
  const queryClient = useQueryClient();
  const ownerId = post.POST_OWNER_DETAIL?.POID ?? null;
  const ownerName = post.POST_OWNER_DETAIL?.PON ?? "Unknown";
  const { data: owner } = useUser(ownerId);
  // Whether *this* user liked/shared the post only lives on their own
  // user doc's liked_post/shared_posts arrays - the post's own LIKES/SHARES
  // are just an aggregate count, they don't identify who liked it.
  const { data: currentUser } = useUser(currentUserId);

  const images = post.POST_DETAIL?.POST_IMAGE_PATH ?? [];
  const caption = post.POST_DETAIL?.POST_CAPTION;

  const uploadedAtMs = post.UPLOADED_AT;
  const timeLabel = useMemo(() => (uploadedAtMs ? timeAgo(uploadedAtMs) : ""), [uploadedAtMs]);

  const likeCountFromServer = post.POST_DETAIL?.LIKES?.length ?? 0;
  const shareCountFromServer = post.POST_DETAIL?.SHARES?.length ?? 0;
  const likedByMe = currentUser?.liked_post?.some((l) => l.LPID === post.PID) ?? false;
  const sharedByMe = currentUser?.shared_posts?.some((s) => s.SHPID === post.PID) ?? false;

  // Optimistic overrides: null means "trust server-derived state above",
  // set to a boolean the instant the user clicks so the UI responds
  // immediately instead of waiting on the next refetch.
  const [likedOverride, setLikedOverride] = useState<boolean | null>(null);
  const [sharedOverride, setSharedOverride] = useState<boolean | null>(null);
  const [likeCountOverride, setLikeCountOverride] = useState<number | null>(null);
  const [shareCountOverride, setShareCountOverride] = useState<number | null>(null);

  const liked = likedOverride ?? likedByMe;
  const shared = sharedOverride ?? sharedByMe;
  const likeCount = likeCountOverride ?? likeCountFromServer;
  const shareCount = shareCountOverride ?? shareCountFromServer;

  const { isSaved, save, unsave } = useLibraryStore();
  const saved = isSaved(post.PID);

  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  async function toggleLike() {
    if (!ownerId) return;
    const nextLiked = !liked;
    setLikedOverride(nextLiked);
    setLikeCountOverride(likeCount + (nextLiked ? 1 : -1));
    const ref = { LPID: post.PID, POID: ownerId };
    try {
      await (nextLiked ? likePost : unlikePost)(currentUserId, post.PID, ref);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.byUid(currentUserId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    } catch {
      setLikedOverride(!nextLiked);
      setLikeCountOverride(likeCount + (nextLiked ? -1 : 1));
    }
  }

  async function toggleShare() {
    if (!ownerId) return;
    const nextShared = !shared;
    setSharedOverride(nextShared);
    setShareCountOverride(shareCount + (nextShared ? 1 : -1));
    const ref = { SHPID: post.PID, POID: ownerId };
    try {
      await (nextShared ? sharePost : unsharePost)(currentUserId, post.PID, ref);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.byUid(currentUserId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    } catch {
      setSharedOverride(!nextShared);
      setShareCountOverride(shareCount + (nextShared ? -1 : 1));
    }
  }

  function toggleSave() {
    if (saved) unsave(post.PID);
    else save(post.PID);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${ownerId}/post_detail/${post.PID}`);
      setCopied(true);
    } catch {
      // clipboard permission denied - silently ignore, link isn't copied
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deletePostRemote(post.PID);
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      onDeleted?.();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="h-auto relative border-b border-[var(--color-border)] flex flex-col justify-start items-center py-4 w-full">
      <div className="flex w-full h-auto rounded-t-md justify-between">
        <div className="w-full flex-col relative h-auto py-4 flex justify-start items-end">
          <NameCard
            userAvatar={defaultAvatar}
            UID={ownerId ?? ""}
            userProfilePhotoUrl={owner?.profile?.[0]?.src ?? null}
            name={ownerName}
            uploadedAtMs={uploadedAtMs ?? 0}
            timeLabel={timeLabel}
            status={owner?.status ?? null}
          />

          <button
            type="button"
            aria-label="Post options"
            onClick={() => setMenuOpen((v) => !v)}
            className="transition-transform absolute right-0 bottom-2 w-[40px] bg-[var(--color-bg-overlay)] h-[40px] flex justify-center items-center rounded cursor-pointer"
          >
            <Icon path={mdiDotsHorizontal} size={1} />
          </button>

          {menuOpen && (
            <section className="z-[999] text-sm tracking-wide flex flex-col gap-2 p-2 rounded-md bg-[var(--color-bg-overlay)] backdrop-blur absolute right-2 top-12 min-w-[25%] min-h-[40px]">
              <button
                type="button"
                onClick={copyLink}
                className="flex gap-1 cursor-pointer hover:bg-[var(--color-surface)] p-2 rounded-md justify-start items-center"
              >
                <Icon path={mdiContentCopy} size={0.8} />
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>

              {ownerId === currentUserId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex gap-1 cursor-pointer hover:bg-[var(--color-surface)] p-2 rounded-md justify-start items-center disabled:opacity-50"
                >
                  <Icon path={mdiDeleteForeverOutline} size={0.9} />
                  <span>{deleting ? "Deleting..." : "Delete"}</span>
                </button>
              )}
            </section>
          )}
        </div>
      </div>

      {images.length > 0 && <PostImageCarousel images={images} />}

      <div className="flex flex-col w-full justify-between items-center py-2">
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-3 items-center">
            <button
              type="button"
              onClick={toggleLike}
              aria-pressed={liked}
              className={`flex p-1 gap-1 items-center cursor-pointer rounded-full ${liked ? "text-[var(--color-accent)]" : ""}`}
            >
              <Icon path={liked ? mdiHeart : mdiHeartOutline} size={1} />
              {likeCount !== 0 && (
                <span className="text-sm">
                  {likeCount} {likeCount > 1 ? "likes" : "like"}
                </span>
              )}
            </button>

            <button type="button" onClick={toggleShare} aria-pressed={shared} className="flex p-1 gap-1 items-center cursor-pointer rounded-full">
              <Icon path={shared ? mdiShare : mdiShareOutline} size={1} />
              {shareCount !== 0 && (
                <span className="text-sm">
                  {shareCount} {shareCount > 1 ? "shares" : "share"}
                </span>
              )}
            </button>
          </div>

          <button type="button" onClick={toggleSave} aria-pressed={saved} className="flex p-2 items-center cursor-pointer rounded-full">
            <Icon path={saved ? mdiBookmark : mdiBookmarkOutline} size={1} />
          </button>
        </div>
      </div>

      {caption && (
        <p className="border-l-[1.5px] border-[var(--color-border)] px-2 py-2 text-sm max-w-[80%] whitespace-pre-wrap tracking-wide self-start w-[80%] h-auto">
          {caption}
        </p>
      )}
    </section>
  );
}
