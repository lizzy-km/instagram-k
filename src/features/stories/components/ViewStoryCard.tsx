import { useState } from "react";
import { Image } from "@/Components/ui";
import { Icon } from "@/Components/icons/Icon";
import { mdiTrashCanOutline, mdiDotsVertical, mdiWindowClose } from "@/Components/icons/paths";
import { useIsDesktop } from "@/stores/useUiStore";
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
  const isDesktop = useIsDesktop();
  const imageUrl = story.STORY_DETAIL?.STORY_IMAGE_PATH?.downloadURL;

  return (
    <div className="z-[999] h-full relative rounded-xl flex justify-start items-start w-full">
      <div className="z-[99] relative rounded-t-2xl p-2 bg-[var(--color-bg-overlay)] backdrop-blur-[10px] flex w-full gap-2">
        <Image src={ownerAvatarUrl} alt="" aspectRatio="1 / 1" containerClassName="w-[40px] h-[40px] rounded-full" />

        <div className="flex py-0 justify-start items-center">
          <p className="p-1 text-sm text-center w-full h-full">{ownerName}</p>
        </div>

        <div className="p-2 w-[30%] cursor-pointer gap-3 flex justify-end items-center top-1 absolute right-0">
          {canDelete && (
            <button type="button" aria-label="Story options" onClick={() => setMenuOpen((v) => !v)}>
              <Icon path={mdiDotsVertical} size={1} />
            </button>
          )}
          {!isDesktop && (
            <button type="button" aria-label="Close" onClick={onClose} className="cursor-pointer rounded-full p-1">
              <Icon path={mdiWindowClose} size={1} />
            </button>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="absolute z-[999] top-14 right-2 bg-[var(--color-bg-overlay)] backdrop-blur-sm rounded p-2">
          <button
            type="button"
            onClick={onDelete}
            className="flex gap-2 hover:bg-[var(--color-surface)] px-2 rounded p-1 justify-start items-center text-sm"
          >
            <Icon path={mdiTrashCanOutline} size={0.6} />
            <span>Delete story</span>
          </button>
        </div>
      )}

      <Image src={imageUrl} alt="" aspectRatio="9 / 16" containerClassName="absolute w-full h-full rounded-xl" />
    </div>
  );
}
