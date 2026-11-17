import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

// The AWS SDK reads the AWS_* keys from the environment (.env.local in dev, Vercel in production), pointed at Neon.
const s3 = new S3Client({ forcePathStyle: true }); // Neon only understands path-style URLs: <endpoint>/<bucket>/<key>

// Puts a prepared WebP in the "shop-photos" bucket and returns its key.
// The key is random, so nobody can guess other photos' keys, and the uploaded file's name never leaks.
export async function uploadPhoto(webp: Buffer) {
  const key = `shops/${crypto.randomUUID()}.webp`;
  await s3.send(
    new PutObjectCommand({
      Bucket: "shop-photos",
      Key: key,
      Body: webp,
      ContentType: "image/webp", // without it, browsers get binary/octet-stream
      CacheControl: "public, max-age=31536000, immutable", // a key's photo never changes: a new photo gets a new key
    }),
  );
  return key;
}

// Removes a photo from the bucket. Deleting a key that isn't there is fine: S3 doesn't complain.
export async function deletePhoto(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: "shop-photos", Key: key }));
}
