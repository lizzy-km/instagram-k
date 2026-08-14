import { useEffect, useMemo, useRef, useState } from "react";
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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

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
    <article className="w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between px-4 py-3">
        <NameCard
          userAvatar={defaultAvatar}
          UID={ownerId ?? ""}
          userProfilePhotoUrl={owner?.profile?.[0]?.src ?? null}
          name={ownerName}
          uploadedAtMs={uploadedAtMs ?? 0}
          timeLabel={timeLabel}
          status={owner?.status ?? null}
        />

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="Post options"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-faint)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text-muted)]"
          >
            <Icon path={mdiDotsHorizontal} size={0.9} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-[calc(100%+6px)] z-[999] w-48 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-1.5 shadow-[var(--shadow-lg)] animate-[scale-in_var(--duration-fast)_var(--ease-standard)]">
              <button
                type="button"
                onClick={copyLink}
                className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)]"
              >
                <Icon path={mdiContentCopy} size={0.8} />
                <span>{copied ? "Copied!" : "Copy link"}</span>
              </button>

              {ownerId === currentUserId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 text-sm text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger-soft)] disabled:opacity-50"
                >
                  <Icon path={mdiDeleteForeverOutline} size={0.85} />
                  <span>{deleting ? "Deleting..." : "Delete"}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {images.length > 0 && <PostImageCarousel images={images} />}

      {caption && (
        <p className="whitespace-pre-wrap px-4 pt-3 text-sm leading-relaxed text-[var(--color-text)]">{caption}</p>
      )}

      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleLike}
            aria-pressed={liked}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium transition-colors duration-[var(--duration-fast)] ${
              liked ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]"
            }`}
          >
            <Icon path={liked ? mdiHeart : mdiHeartOutline} size={1.05} />
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>

          <button
            type="button"
            onClick={toggleShare}
            aria-pressed={shared}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium transition-colors duration-[var(--duration-fast)] ${
              shared ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]"
            }`}
          >
            <Icon path={shared ? mdiShare : mdiShareOutline} size={1.05} />
            {shareCount > 0 && <span>{shareCount}</span>}
          </button>
        </div>

        <button
          type="button"
          onClick={toggleSave}
          aria-pressed={saved}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-[var(--duration-fast)] ${
            saved ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]"
          }`}
        >
          <Icon path={saved ? mdiBookmark : mdiBookmarkOutline} size={1.05} />
        </button>
      </div>
    </article>
  );
}
