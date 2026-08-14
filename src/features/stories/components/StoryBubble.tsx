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
    <button
      type="button"
      onClick={onClick}
      className="transition-all tracking-wider flex min-w-[145px] h-full bg-[var(--color-bg-elevated)] rounded-md text-left"
    >
      <div className="relative w-full h-full flex flex-col justify-between items-start rounded-md">
        <div
          className={`h-full w-full absolute rounded-md ring-2 ${
            hasStory ? "ring-[var(--color-accent)]" : "ring-transparent"
          }`}
        >
          <Image src={avatarUrl} alt="" aspectRatio="145 / 250" containerClassName="w-full h-full rounded-md" />
        </div>

        <div className="z-[9] p-2 w-full h-[50px] flex justify-start items-start">
          <div className="rounded-full w-[40px] h-[40px] p-[3px] bg-[var(--color-accent)]">
            <Image src={avatarUrl} alt="" aspectRatio="1 / 1" containerClassName="rounded-full" />
          </div>
        </div>

        <div className="relative z-[9] w-full p-0 rounded-b-md bg-gradient-to-t from-black/70 to-transparent">
          <p className="p-2 text-white font-medium">{isOwn ? "Your story" : label}</p>
        </div>
      </div>
    </button>
  );
}
