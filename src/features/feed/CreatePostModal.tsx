import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { checkFileType } from "@/lib/checkFileType";
import { uploadFileToR2 } from "@/lib/r2Upload";
import { createPost } from "@/lib/firestore/createPost";
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
        POST_DETAIL: { POST_CAPTION: caption || null, POST_IMAGE_PATH: images, LIKES: [], SHARES: [] },
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
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
      <div className="text-[var(--color-text)] p-4 flex flex-col gap-3 rounded-md w-[min(90vw,500px)]">
        <div className="flex items-center gap-2">
          <Image src={avatarUrl} alt="" aspectRatio="1 / 1" containerClassName="w-[40px] h-[40px] rounded-full" />
          <h2 id="create-post-title" className="font-medium">
            {currentUserName}
          </h2>
        </div>

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What's on your mind?"
          className="bg-[var(--color-surface)] rounded p-2 w-full min-h-[80px] outline-none resize-none"
          autoFocus
        />

        <div className="flex gap-2 flex-wrap">
          {images.map((img) => (
            <Image key={img.downloadURL} src={img.downloadURL} alt="" aspectRatio="1 / 1" containerClassName="w-[100px] h-[100px] rounded" />
          ))}

          {uploading && (
            <div className="w-[100px] h-[100px] flex items-center justify-center bg-[var(--color-surface)] rounded">
              <Spinner size={24} />
            </div>
          )}

          <label className="cursor-pointer w-[100px] h-[100px] flex items-center justify-center bg-[var(--color-surface)] rounded border border-dashed border-[var(--color-border)]">
            <span className="text-2xl">+</span>
            <input type="file" accept="image/*" onChange={handleFileSelected} className="hidden" />
          </label>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={images.length === 0 || submitting}>
            {submitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
