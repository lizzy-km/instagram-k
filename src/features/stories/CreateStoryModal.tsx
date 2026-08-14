import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Modal, Button, Spinner, Image } from "@/Components/ui";
import { checkFileType } from "@/lib/checkFileType";
import { uploadFileToR2 } from "@/lib/r2Upload";
import { createStory } from "@/lib/firestore/storyActions";
import { queryKeys } from "@/lib/query/keys";
import { useUiStore } from "@/stores/useUiStore";

interface CreateStoryModalProps {
  currentUserId: string;
  currentUserName: string;
}

export function CreateStoryModal({ currentUserId, currentUserName }: CreateStoryModalProps) {
  const queryClient = useQueryClient();
  const open = useUiStore((s) => s.createStoryOpen);
  const setOpen = useUiStore((s) => s.setCreateStoryOpen);

  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setPreviewUrl(null);
    setDownloadUrl(null);
    setUploading(false);
    setSubmitting(false);
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const kind = checkFileType(file);
    if (kind !== "image") {
      alert("Only image stories are supported right now.");
      return;
    }

    setUploading(true);
    setPreviewUrl(URL.createObjectURL(file));

    const storyId = `${currentUserId}_${Date.now()}`;
    const key = `user_story/${currentUserId}/${storyId}/${file.name}`;

    try {
      setDownloadUrl(await uploadFileToR2(file, key));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    if (!downloadUrl) return;
    setSubmitting(true);
    try {
      const storyId = `${currentUserId}_${Date.now()}`;
      await createStory({
        STID: storyId,
        UPLOADED_AT: Date.now(),
        STORY_OWNER_DETAIL: { STOID: currentUserId, STON: currentUserName },
        STORY_DETAIL: { STORY_IMAGE_PATH: { downloadURL: downloadUrl } },
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.stories.all });
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
      labelledBy="create-story-title"
    >
      <div className="text-[var(--color-text)] p-4 flex flex-col gap-4 rounded-md w-[min(90vw,420px)]">
        <h2 id="create-story-title" className="text-lg font-medium">
          Create story
        </h2>

        {!previewUrl ? (
          <label className="cursor-pointer flex items-center justify-center h-[300px] w-full bg-[var(--color-surface)] rounded-lg border border-dashed border-[var(--color-border)]">
            <span className="text-[var(--color-text-muted)]">Click to upload an image</span>
            <input type="file" accept="image/*" onChange={handleFileSelected} className="hidden" />
          </label>
        ) : (
          <div className="flex justify-center items-center h-[300px] w-full rounded-md relative">
            {uploading ? (
              <Spinner />
            ) : (
              <Image src={previewUrl} alt="Story preview" aspectRatio="9 / 16" containerClassName="h-full rounded-md" />
            )}
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!downloadUrl || submitting}>
            {submitting ? "Posting..." : "Submit"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
