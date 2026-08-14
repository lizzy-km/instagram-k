import { Image } from "@/Components/ui";

interface StoryBubbleProps {
  label: string;
  avatarUrl: string;
  hasStory: boolean;
  isOwn?: boolean;
  onClick: () => void;
}

export function StoryBubble({ label, avatarUrl, hasStory, isOwn, onClick }: StoryBubbleProps) {
  return (
    <button type="button" onClick={onClick} className="flex w-[68px] shrink-0 flex-col items-center gap-1.5">
      <div
        className={`relative rounded-full p-[2px] ${
          hasStory ? "bg-gradient-to-tr from-[var(--color-accent)] to-orange-400" : "bg-[var(--color-border)]"
        }`}
      >
        <div className="rounded-full bg-[var(--color-bg)] p-[2px]">
          <Image src={avatarUrl} alt="" aspectRatio="1 / 1" containerClassName="w-14 h-14 rounded-full" />
        </div>
        {isOwn && !hasStory && (
          <div className="pointer-events-none absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-accent)] text-white">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
          </div>
        )}
      </div>
      <span className="w-full truncate text-center text-xs text-[var(--color-text-muted)]">
        {isOwn ? "Your story" : label}
      </span>
    </button>
  );
}
