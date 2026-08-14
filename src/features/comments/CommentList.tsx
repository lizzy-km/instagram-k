import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { commentsQuery, addComment, deleteComment, updateComment } from "@/lib/firestore/comments";
import { useCollectionDataWithId } from "@/lib/useCollectionDataWithId";
import { createNotification } from "@/lib/firestore/notifications";
import { logActivity } from "@/lib/firestore/activity";
import { timeAgo } from "@/lib/useTimeAgo";
import { Button, EmptyState, Image, Spinner } from "@/Components/ui";
import { Icon } from "@/Components/icons/Icon";
import { mdiSendVariantOutline } from "@/Components/icons/paths";
import type { CommentDoc } from "@/lib/firestore/types";

const COMMENT_MAX_LENGTH = 500;

interface CommentListProps {
  postId: string;
  postOwnerId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string | null;
  defaultAvatar: string;
}

export function CommentList({
  postId,
  postOwnerId,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  defaultAvatar,
}: CommentListProps) {
  const queryClient = useQueryClient();
  const [comments, loading] = useCollectionDataWithId<CommentDoc>(commentsQuery(postId));
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = text.trim().slice(0, COMMENT_MAX_LENGTH);
    if (!value || submitting) return;
    setSubmitting(true);
    setText("");
    try {
      await addComment({
        postId,
        authorId: currentUserId,
        authorName: currentUserName,
        authorAvatar: currentUserAvatar,
        text: value,
      });
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
    setDeletingId(commentId);
    try {
      await deleteComment(commentId);
      queryClient.invalidateQueries();
    } finally {
      setDeletingId(null);
    }
  }

  function startEdit(comment: CommentDoc) {
    setEditingId(comment.id);
    setEditText(comment.text);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  async function handleSaveEdit(commentId: string) {
    const value = editText.trim().slice(0, COMMENT_MAX_LENGTH);
    if (!value) return;
    setSavingEdit(true);
    try {
      await updateComment(commentId, value);
      queryClient.invalidateQueries();
      setEditingId(null);
      setEditText("");
    } finally {
      setSavingEdit(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-3">
      {!loading && comments && comments.length > 0 && (
        <span className="text-xs font-semibold text-[var(--color-text-faint)]">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
      )}

      {loading && (
        <div className="flex justify-center py-4">
          <Spinner size={20} />
        </div>
      )}

      {!loading && comments?.length === 0 && (
        <EmptyState title="No comments yet" description="Be the first to comment." />
      )}

      <div className="flex max-h-80 flex-col gap-3 overflow-y-auto">
        {comments?.map((comment) => (
          <div key={comment.id} className="group flex items-start gap-2.5">
            <NavLink to={`/${comment.authorId}`} className="shrink-0">
              <Image
                src={comment.authorAvatar || defaultAvatar}
                alt=""
                aspectRatio="1 / 1"
                containerClassName="w-8 h-8 rounded-full"
              />
            </NavLink>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              {editingId === comment.id ? (
                <div className="flex flex-col gap-1.5">
                  <textarea
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value.slice(0, COMMENT_MAX_LENGTH))}
                    maxLength={COMMENT_MAX_LENGTH}
                    rows={2}
                    className="w-full resize-none rounded-[var(--radius-md)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={!editText.trim() || savingEdit}
                      onClick={() => handleSaveEdit(comment.id)}
                    >
                      {savingEdit ? <Spinner size={14} /> : "Save"}
                    </Button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="text-xs font-medium text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-fit max-w-full rounded-[var(--radius-lg)] rounded-tl-[var(--radius-sm)] bg-[var(--color-surface)] px-3 py-2">
                    <NavLink
                      to={`/${comment.authorId}`}
                      className="block text-xs font-semibold text-[var(--color-text)] hover:underline"
                    >
                      {comment.authorName}
                    </NavLink>
                    <p className="whitespace-pre-wrap break-words text-sm text-[var(--color-text)]">{comment.text}</p>
                  </div>
                  <div className="flex items-center gap-3 px-1">
                    <span className="text-xs text-[var(--color-text-faint)]">
                      {timeAgo(comment.createdAt)}
                      {comment.editedAt ? " · Edited" : ""}
                    </span>
                    {comment.authorId === currentUserId && (
                      <>
                        <button
                          type="button"
                          onClick={() => startEdit(comment)}
                          className="text-xs font-medium text-[var(--color-text-faint)] opacity-0 transition-opacity hover:text-[var(--color-text)] group-hover:opacity-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          aria-label="Delete comment"
                          disabled={deletingId === comment.id}
                          onClick={() => handleDelete(comment.id)}
                          className="text-xs font-medium text-[var(--color-text-faint)] opacity-0 transition-opacity hover:text-[var(--color-danger)] group-hover:opacity-100 disabled:opacity-50"
                        >
                          {deletingId === comment.id ? "Deleting..." : "Delete"}
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
        <Image
          src={currentUserAvatar || defaultAvatar}
          alt=""
          aspectRatio="1 / 1"
          containerClassName="w-8 h-8 rounded-full shrink-0"
        />
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, COMMENT_MAX_LENGTH))}
          placeholder="Add a comment..."
          maxLength={COMMENT_MAX_LENGTH}
          className="h-9 flex-1 rounded-[var(--radius-full)] bg-[var(--color-surface)] px-3.5 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-faint)]"
        />
        <Button type="submit" size="sm" disabled={!text.trim() || submitting}>
          {submitting ? <Spinner size={16} /> : <Icon path={mdiSendVariantOutline} size={0.8} />}
        </Button>
      </form>
    </div>
  );
}
