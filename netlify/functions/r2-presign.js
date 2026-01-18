import crypto from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },

  // IMPORTANT: prevents the SDK from forcing CRC32 checksum behavior
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});


export async function handler(event) {
  try {
    const { filename, contentType } = JSON.parse(event.body || "{}");
    if (!filename) return { statusCode: 400, body: "Missing filename" };

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const id = crypto.randomBytes(8).toString("hex");
    const key = `uploads/${Date.now()}-${id}-${safeName}`;

    const cmd = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      ContentType: contentType || "application/octet-stream",
    });

    const uploadUrl = await getSignedUrl(client, cmd, { expiresIn: 60 * 5 });

    // You need one of these:
    // 1) A Cloudflare R2 Public Bucket URL (or custom domain) that maps to the bucket
    // Example: https://files.upsurfaces.com/<key>
    const publicUrlBase = process.env.R2_PUBLIC_BASE_URL;
    const publicUrl = `${publicUrlBase.replace(/\/$/, "")}/${key}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl, publicUrl, key }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Server error" };
  }
}
