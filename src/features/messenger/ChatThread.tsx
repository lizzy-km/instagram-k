import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, orderBy, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { sendMessage, threadId } from "@/lib/firestore/messages";
import { useCollectionDataWithId } from "@/lib/useCollectionDataWithId";
import { useUser } from "@/lib/query/hooks";
import { ChatMessage } from "./components/ChatMessage";
import { Image } from "@/Components/ui";
import { Icon } from "@/Components/icons/Icon";
import { mdiSendVariantOutline } from "@/Components/icons/paths";
import type { MessageDoc } from "@/lib/firestore/types";

interface ChatThreadProps {
  currentUserId: string;
  targetUserId: string;
  currentUserAvatar: string | null;
  defaultAvatar: string;
}

export function ChatThread({ currentUserId, targetUserId, currentUserAvatar, defaultAvatar }: ChatThreadProps) {
  const navigate = useNavigate();
  const { data: targetUser } = useUser(targetUserId);
  const mid = threadId(currentUserId, targetUserId);
  // Scoped to this thread's mid, not just filtered client-side afterward -
  // Firestore rules evaluate list queries against every doc they *could*
  // match, so an unscoped query can never satisfy a rule that depends on
  // per-document fields like mid, even if every returned doc would pass.
  const messagesQuery = useMemo(
    () => query(collection(firestore, "MESSAGES"), where("mid", "==", mid), orderBy("createdAt")),
    [mid]
  );
  const [thread] = useCollectionDataWithId<MessageDoc>(messagesQuery);
  const bottomRef = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.length]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const value = text;
    setText("");
    await sendMessage({
      text: value,
      senderId: currentUserId,
      targetId: targetUserId,
      photoURL: currentUserAvatar,
    });
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] px-3 py-2.5">
        <button
          type="button"
          aria-label="Back to conversations"
          onClick={() => navigate("/message")}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
          </svg>
        </button>
        <Image
          src={targetUser?.profile?.[0]?.src || defaultAvatar}
          alt=""
          aspectRatio="1 / 1"
          containerClassName="w-8 h-8 rounded-full shrink-0"
        />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-[var(--color-text)]">{targetUser?.user_name ?? ""}</span>
          {targetUser?.status === "online" && <span className="text-xs text-[var(--color-online)]">Online</span>}
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
        {thread?.map((msg) => (
          <ChatMessage key={msg.id} message={msg} isOwn={msg.uid === currentUserId} defaultAvatar={defaultAvatar} />
        ))}
        <span ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-[var(--color-border)] p-3">
        <input
          className="h-10 flex-1 rounded-[var(--radius-full)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-faint)]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={!text.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--color-accent)] transition-opacity disabled:opacity-40"
        >
          <Icon path={mdiSendVariantOutline} size={1.1} />
        </button>
      </form>
    </div>
  );
}
