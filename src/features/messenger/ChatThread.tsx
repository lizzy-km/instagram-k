import { useEffect, useMemo, useRef, useState } from "react";
import { collection, orderBy, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { sendMessage, threadId } from "@/lib/firestore/messages";
import { useCollectionDataWithId } from "@/lib/useCollectionDataWithId";
import { ChatMessage } from "./components/ChatMessage";
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
    <section className="flex flex-col gap-4 max-h-screen h-screen overflow-hidden p-1 justify-end items-end w-full">
      <main className="flex w-full flex-col mt-[18%] h-[85%] max-h-[85%] overflow-y-auto gap-2">
        {thread?.map((msg) => (
          <ChatMessage key={msg.id} message={msg} isOwn={msg.uid === currentUserId} defaultAvatar={defaultAvatar} />
        ))}
        <span ref={bottomRef} />
      </main>

      <form
        className="flex bg-[var(--color-bg)] h-auto rounded-lg justify-between w-full p-2 items-center"
        onSubmit={handleSubmit}
      >
        <input
          className="py-2 px-2 tracking-wide w-full rounded-md bg-[var(--color-surface)] text-[var(--color-text)]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message"
        />
        <button type="submit" aria-label="Send message">
          <Icon path={mdiSendVariantOutline} size={1.3} />
        </button>
      </form>
    </section>
  );
}
