import type { VercelRequest, VercelResponse } from "@vercel/node";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ALLOWED_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_KEY_LENGTH = 512;

function r2Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials are not configured on the server");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { key, contentType } = req.body ?? {};

  if (typeof key !== "string" || key.length === 0 || key.length > MAX_KEY_LENGTH) {
    res.status(400).json({ error: "Invalid key" });
    return;
  }
  // Reject path traversal / absolute paths - key becomes an object path in the bucket.
  if (key.includes("..") || key.startsWith("/")) {
    res.status(400).json({ error: "Invalid key" });
    return;
  }
  if (typeof contentType !== "string" || !ALLOWED_CONTENT_TYPES.has(contentType)) {
    res.status(400).json({ error: "Unsupported content type" });
    return;
  }

  const bucket = process.env.R2_BUCKET;
  if (!bucket) {
    res.status(500).json({ error: "R2 bucket is not configured on the server" });
    return;
  }

  try {
    const client = r2Client();
    const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });

    res.status(200).json({ uploadUrl, key });
  } catch (error) {
    console.error("Failed to create R2 presigned URL:", error);
    res.status(500).json({ error: "Failed to create upload URL" });
  }
}
