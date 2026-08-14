export type UploadedFileKind = "image" | "video" | null;

export function checkFileType(file: File | null | undefined): UploadedFileKind {
  if (!file?.type) return null;
  if (file.type.includes("image")) return "image";
  if (file.type.includes("video")) return "video";
  return null;
}
