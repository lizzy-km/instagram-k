import { Image } from "@/Components/ui";
import type { MessageDoc } from "@/lib/firestore/types";

interface ChatMessageProps {
  message: MessageDoc;
  isOwn: boolean;
  defaultAvatar: string;
}

export function ChatMessage({ message, isOwn, defaultAvatar }: ChatMessageProps) {
  return (
    <section className={`flex w-full gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`flex justify-end items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
        <Image
          src={message.photoURL || defaultAvatar}
          alt=""
          aspectRatio="1 / 1"
          containerClassName="rounded-full w-[30px] h-[30px]"
        />
        <p className="tracking-wide text-sm px-3 py-2 text-center bg-[var(--color-surface)] rounded-lg">
          {message.text}
        </p>
      </div>
    </section>
  );
}
