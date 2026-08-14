import { Image } from "@/Components/ui";
import { useUiStore } from "@/stores/useUiStore";

interface CreatePostBarProps {
  avatarUrl: string;
  firstName: string;
}

export function CreatePostBar({ avatarUrl, firstName }: CreatePostBarProps) {
  const setCreatePostOpen = useUiStore((s) => s.setCreatePostOpen);

  return (
    <div className="tracking-wider self-center justify-center items-center flex py-2 p-3 min-h-[80px] w-full bg-[var(--color-bg-elevated)] rounded-md">
      <div className="px-2 flex rounded-md justify-between flex-col items-center w-full h-full">
        <div className="flex justify-between gap-2 items-center w-full h-full">
          <Image src={avatarUrl} alt="" aspectRatio="1 / 1" containerClassName="w-[40px] h-[40px] rounded-full shrink-0" />
          <button
            type="button"
            onClick={() => setCreatePostOpen(true)}
            className="flex justify-start items-center w-[93%] rounded-full bg-[var(--color-surface)] h-[40px] px-4 text-left text-[var(--color-text-muted)]"
          >
            {`What's on your mind${firstName ? `, ${firstName}` : ""}?`}
          </button>
        </div>
      </div>
    </div>
  );
}
