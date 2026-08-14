import { Image } from "@/Components/ui";
import type { MessageDoc } from "@/lib/firestore/types";

interface ChatMessageProps {
  message: MessageDoc;
  isOwn: boolean;
  defaultAvatar: string;
}

export function ChatMessage({ message, isOwn, defaultAvatar }: ChatMessageProps) {
  return (
    <div className={`flex w-full items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
      {!isOwn && (
        <Image src={message.photoURL || defaultAvatar} alt="" aspectRatio="1 / 1" containerClassName="w-7 h-7 rounded-full shrink-0" />
      )}
      <p
        className={`max-w-[75%] rounded-[var(--radius-lg)] px-3.5 py-2 text-sm leading-snug ${
          isOwn
            ? "rounded-br-[var(--radius-sm)] bg-[var(--color-accent)] text-white"
            : "rounded-bl-[var(--radius-sm)] bg-[var(--color-surface)] text-[var(--color-text)]"
        }`}
      >
        {message.text}
      </p>
    </div>
  );
}
