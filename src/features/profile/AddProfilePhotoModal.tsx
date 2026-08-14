import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { checkFileType } from "@/lib/checkFileType";
import { uploadFileToR2 } from "@/lib/r2Upload";
import { updateProfilePhoto } from "@/lib/firestore/updateProfilePhoto";
import { queryKeys } from "@/lib/query/keys";
import { useUiStore } from "@/stores/useUiStore";
import { Modal, Button, Image, Spinner } from "@/Components/ui";

interface AddProfilePhotoModalProps {
  currentUserId: string;
}

export function AddProfilePhotoModal({ currentUserId }: AddProfilePhotoModalProps) {
  const queryClient = useQueryClient();
  const open = useUiStore((s) => s.addProfileOpen);
  const setOpen = useUiStore((s) => s.setAddProfileOpen);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setPreviewUrl(null);
    setDownloadUrl(null);
    setUploading(false);
    setSubmitting(false);
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || checkFileType(file) !== "image") return;

    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    try {
      const photoId = `${currentUserId}_${Date.now()}`;
      const key = `user_photo/${currentUserId}/${photoId}/${file.name}`;
      setDownloadUrl(await uploadFileToR2(file, key));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    if (!downloadUrl) return;
    setSubmitting(true);
    try {
      const photoId = `${currentUserId}_${Date.now()}`;
      await updateProfilePhoto(currentUserId, {
        PPID: photoId,
        src: downloadUrl,
        isActive: true,
        isPublic: true,
        isPrivate: false,
        isFriendOnly: false,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.byUid(currentUserId) });
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
      labelledBy="add-profile-photo-title"
    >
      <div className="flex w-[min(92vw,380px)] flex-col gap-4 p-5 text-[var(--color-text)]">
        <h2 id="add-profile-photo-title" className="text-base font-semibold">
          Change profile picture
        </h2>

        {!previewUrl ? (
          <label className="flex h-56 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] text-[var(--color-text-faint)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            <span className="text-sm">Click to upload</span>
            <input type="file" accept="image/*" onChange={handleFileSelected} className="hidden" />
          </label>
        ) : (
          <div className="flex h-56 w-full items-center justify-center">
            {uploading ? (
              <Spinner />
            ) : (
              <Image src={previewUrl} alt="" aspectRatio="1 / 1" containerClassName="h-full w-auto rounded-full" />
            )}
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!downloadUrl || submitting}>
            {submitting ? "Saving..." : "Submit"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
