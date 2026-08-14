import { Image } from "@/Components/ui";
import { useUiStore } from "@/stores/useUiStore";

interface CreatePostBarProps {
  avatarUrl: string;
  firstName: string;
}

export function CreatePostBar({ avatarUrl, firstName }: CreatePostBarProps) {
  const setCreatePostOpen = useUiStore((s) => s.setCreatePostOpen);

  return (
    <div className="flex w-full items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 shadow-[var(--shadow-sm)]">
      <Image src={avatarUrl} alt="" aspectRatio="1 / 1" containerClassName="w-11 h-11 rounded-full shrink-0" />
      <button
        type="button"
        onClick={() => setCreatePostOpen(true)}
        className="flex h-11 flex-1 items-center rounded-[var(--radius-full)] bg-[var(--color-surface)] px-4 text-left text-sm text-[var(--color-text-muted)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-surface-hover)]"
      >
        {`What's on your mind${firstName ? `, ${firstName}` : ""}?`}
      </button>
    </div>
  );
}
