import { useEffect, useRef, useState } from "react";
import { Image } from "@/Components/ui";
import { Icon } from "@/Components/icons/Icon";
import { mdiTrashCanOutline, mdiDotsVertical, mdiWindowClose } from "@/Components/icons/paths";
import type { StoryDoc } from "@/lib/firestore/types";

interface ViewStoryCardProps {
  story: StoryDoc;
  ownerName: string;
  ownerAvatarUrl: string;
  canDelete: boolean;
  onDelete: () => void;
  onClose: () => void;
}

export function ViewStoryCard({ story, ownerName, ownerAvatarUrl, canDelete, onDelete, onClose }: ViewStoryCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const imageUrl = story.STORY_DETAIL?.STORY_IMAGE_PATH?.downloadURL;

  useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[var(--radius-lg)] bg-black">
      <Image src={imageUrl} alt="" aspectRatio="9 / 16" containerClassName="absolute inset-0 h-full w-full" />

      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />

      <div className="absolute left-0 right-0 top-0 flex items-center gap-2.5 p-3">
        <Image src={ownerAvatarUrl} alt="" aspectRatio="1 / 1" containerClassName="w-8 h-8 rounded-full shrink-0" />
        <p className="flex-1 truncate text-sm font-medium text-white">{ownerName}</p>

        {canDelete && (
          <button
            type="button"
            aria-label="Story options"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15"
          >
            <Icon path={mdiDotsVertical} size={0.9} />
          </button>
        )}
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15"
        >
          <Icon path={mdiWindowClose} size={0.9} />
        </button>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-3 top-14 z-[999] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-1.5 shadow-[var(--shadow-lg)]"
        >
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 text-sm text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger-soft)]"
          >
            <Icon path={mdiTrashCanOutline} size={0.8} />
            <span>Delete story</span>
          </button>
        </div>
      )}
    </div>
  );
}
