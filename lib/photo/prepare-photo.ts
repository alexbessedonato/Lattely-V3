import sharp from "sharp";

// Turns an uploaded photo into a small WebP for the bucket. Throws if the file isn't an image sharp can read.
// Re-encoding drops the EXIF (GPS, phone model, date) because sharp keeps no metadata unless asked to.
export async function preparePhoto(file: File) {
  return sharp(await file.arrayBuffer())
    .rotate() // turn it upright from its EXIF orientation, before that EXIF is dropped
    .resize({ width: 1600, withoutEnlargement: true }) // wide enough for the detail page, light for cards
    .webp()
    .toBuffer();
}
