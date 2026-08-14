export class R2UploadError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "R2UploadError";
  }
}

/**
 * Uploads a file to Cloudflare R2 via a presigned URL obtained from the
 * api/r2-upload-url serverless function, then returns its public download URL.
 * The R2 secret key never reaches the client - only a short-lived signed
 * PUT URL does.
 */
export async function uploadFileToR2(file: File, key: string): Promise<string> {
  let uploadUrl: string;
  try {
    const res = await fetch("/api/r2-upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, contentType: file.type }),
    }); 

    if (!res.ok) {
      throw new R2UploadError(`Failed to get upload URL (${res.status})`);
    }

    ({ uploadUrl } = await res.json());
  } catch (error) {
    if (error instanceof R2UploadError) throw error;
    throw new R2UploadError("Failed to request an upload URL", error);
  }

  try {
    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!putRes.ok) {
      throw new R2UploadError(`Upload to storage failed (${putRes.status})`);
    }
  } catch (error) {
    if (error instanceof R2UploadError) throw error;
    throw new R2UploadError("Upload to storage failed", error);
  }

  return `${import.meta.env.VITE_R2_PUBLIC_URL}/${key}`;
}
