import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/firebase";
import { checkFileType } from "@/lib/checkFileType";
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
      const path = `user_photo/${currentUserId}/${photoId}/${file.name}`;
      const snapshot = await uploadBytes(ref(storage, path), file);
      setDownloadUrl(await getDownloadURL(snapshot.ref));
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
      <div className="text-[var(--color-text)] p-4 flex flex-col gap-3 rounded-md w-[min(90vw,400px)]">
        <h2 id="add-profile-photo-title" className="font-medium">
          Change profile picture
        </h2>

        {!previewUrl ? (
          <label className="cursor-pointer flex items-center justify-center h-[250px] w-full bg-[var(--color-surface)] rounded-lg border border-dashed border-[var(--color-border)]">
            <span className="text-[var(--color-text-muted)]">Click to upload</span>
            <input type="file" accept="image/*" onChange={handleFileSelected} className="hidden" />
          </label>
        ) : (
          <div className="flex justify-center items-center h-[250px] w-full">
            {uploading ? <Spinner /> : <Image src={previewUrl} alt="" aspectRatio="1 / 1" containerClassName="rounded-full h-full" />}
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
