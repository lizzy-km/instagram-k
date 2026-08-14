import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { commentsQuery, addComment, deleteComment } from "@/lib/firestore/comments";
import { useCollectionDataWithId } from "@/lib/useCollectionDataWithId";
import { createNotification } from "@/lib/firestore/notifications";
import { logActivity } from "@/lib/firestore/activity";
import { timeAgo } from "@/lib/useTimeAgo";
import { Button, EmptyState } from "@/Components/ui";
import { Icon } from "@/Components/icons/Icon";
import { mdiDeleteForeverOutline, mdiSendVariantOutline } from "@/Components/icons/paths";
import type { CommentDoc } from "@/lib/firestore/types";

interface CommentListProps {
  postId: string;
  postOwnerId: string;
  currentUserId: string;
  currentUserName: string;
}

export function CommentList({ postId, postOwnerId, currentUserId, currentUserName }: CommentListProps) {
  const queryClient = useQueryClient();
  const [comments] = useCollectionDataWithId<CommentDoc>(commentsQuery(postId));
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setSubmitting(true);
    setText("");
    try {
      await addComment({ postId, authorId: currentUserId, authorName: currentUserName, text: value });
      logActivity(currentUserId, "post_commented", postId);
      if (postOwnerId !== currentUserId) {
        createNotification({
          uid: currentUserId,
          target: postOwnerId,
          type: "comment",
          text: currentUserName,
          createdAt: Date.now(),
        }).catch(() => {});
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentId: string) {
    await deleteComment(commentId);
    queryClient.invalidateQueries();
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-3">
      {comments?.length === 0 && <EmptyState title="No comments yet" description="Be the first to comment." />}

      <div className="flex flex-col gap-3">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex items-start justify-between gap-2">
            <div className="text-sm">
              <NavLink to={`/${comment.authorId}`} className="font-semibold text-[var(--color-text)] hover:underline">
                {comment.authorName}
              </NavLink>{" "}
              <span className="text-[var(--color-text)]">{comment.text}</span>
              <div className="text-xs text-[var(--color-text-faint)]">{timeAgo(comment.createdAt)}</div>
            </div>
            {comment.authorId === currentUserId && (
              <button
                type="button"
                aria-label="Delete comment"
                onClick={() => handleDelete(comment.id)}
                className="shrink-0 text-[var(--color-text-faint)] hover:text-[var(--color-danger)]"
              >
                <Icon path={mdiDeleteForeverOutline} size={0.75} />
              </button>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="h-9 flex-1 rounded-[var(--radius-full)] bg-[var(--color-surface)] px-3.5 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-faint)]"
        />
        <Button type="submit" size="sm" disabled={!text.trim() || submitting}>
          <Icon path={mdiSendVariantOutline} size={0.8} />
        </Button>
      </form>
    </div>
  );
}
