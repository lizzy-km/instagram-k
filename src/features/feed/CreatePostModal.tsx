import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { checkFileType } from "@/lib/checkFileType";
import { uploadFileToR2 } from "@/lib/r2Upload";
import { createPost } from "@/lib/firestore/createPost";
import { extractHashtags } from "@/lib/hashtags";
import { logActivity } from "@/lib/firestore/activity";
import { queryKeys } from "@/lib/query/keys";
import { useUiStore } from "@/stores/useUiStore";
import { Modal, Button, Image, Spinner } from "@/Components/ui";
import type { PostImage } from "@/lib/firestore/types";

interface CreatePostModalProps {
  currentUserId: string;
  currentUserName: string;
  avatarUrl: string;
}

export function CreatePostModal({ currentUserId, currentUserName, avatarUrl }: CreatePostModalProps) {
  const queryClient = useQueryClient();
  const open = useUiStore((s) => s.createPostOpen);
  const setOpen = useUiStore((s) => s.setCreatePostOpen);

  const [caption, setCaption] = useState("");
  const [images, setImages] = useState<PostImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setCaption("");
    setImages([]);
    setUploading(false);
    setSubmitting(false);
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (checkFileType(file) !== "image") {
      alert("Only image posts are supported right now.");
      return;
    }

    setUploading(true);
    try {
      const postId = `${currentUserId}_${Date.now()}`;
      const key = `user_post/${currentUserId}/${postId}/${file.name}`;
      const downloadURL = await uploadFileToR2(file, key);
      setImages((prev) => [...prev, { downloadURL }]);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const postId = `${currentUserId}_${Date.now()}`;
      await createPost({
        PID: postId,
        PUID: currentUserId,
        UPLOADED_AT: Date.now(),
        isImg: true,
        POST_OWNER_DETAIL: { POID: currentUserId, PON: currentUserName },
        POST_DETAIL: {
          POST_CAPTION: caption || null,
          POST_IMAGE_PATH: images,
          LIKES: [],
          SHARES: [],
          HASHTAGS: extractHashtags(caption),
        },
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      logActivity(currentUserId, "post_created", postId);
      reset();
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        setOpen(false);
      }}
      labelledBy="create-post-title"
    >
      <div className="flex w-[min(92vw,480px)] flex-col gap-4 p-5 text-[var(--color-text)]">
        <div className="flex items-center gap-3">
          <Image src={avatarUrl} alt="" aspectRatio="1 / 1" containerClassName="w-10 h-10 rounded-full" />
          <h2 id="create-post-title" className="text-sm font-semibold">
            {currentUserName}
          </h2>
        </div>

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What's on your mind?"
          className="min-h-[100px] w-full resize-none rounded-[var(--radius-md)] bg-[var(--color-surface)] p-3 text-sm outline-none placeholder:text-[var(--color-text-faint)] focus:ring-2 focus:ring-[var(--color-accent-soft)]"
          autoFocus
        />

        <div className="flex flex-wrap gap-2">
          {images.map((img) => (
            <Image
              key={img.downloadURL}
              src={img.downloadURL}
              alt=""
              aspectRatio="1 / 1"
              containerClassName="w-20 h-20 rounded-[var(--radius-sm)]"
            />
          ))}

          {uploading && (
            <div className="flex h-20 w-20 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface)]">
              <Spinner size={22} />
            </div>
          )}

          <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border-strong)] text-[var(--color-text-faint)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            <input type="file" accept="image/*" onChange={handleFileSelected} className="hidden" />
          </label>
        </div>

        <div className="flex justify-end pt-1">
          <Button onClick={handleSubmit} disabled={images.length === 0 || submitting}>
            {submitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
