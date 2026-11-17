import sharp from "sharp";
import { expect, test } from "vitest";
import { preparePhoto } from "@/lib/photo/prepare-photo";

// A 3000px-wide JPEG with EXIF like a phone adds: the camera and where it was taken.
async function phonePhoto() {
  const bytes = await sharp({
    create: { width: 3000, height: 2000, channels: 3, background: "#8f4420" },
  })
    .jpeg()
    .withExif({ IFD0: { Make: "Phone", Model: "Secret Phone 15" } })
    .toBuffer();
  return new File([bytes], "IMG_4031.jpg", { type: "image/jpeg" });
}

test("a photo comes out as a WebP no wider than 1600px, with its EXIF removed", async () => {
  const before = await sharp(
    await (await phonePhoto()).arrayBuffer(),
  ).metadata();
  expect(before.exif).toBeDefined(); // proves the test photo really had EXIF to remove

  const after = await sharp(await preparePhoto(await phonePhoto())).metadata();

  expect(after).toMatchObject({ format: "webp", width: 1600, height: 1067 });
  expect(after.exif).toBeUndefined();
});

test("a file that isn't an image is refused", async () => {
  const notAPhoto = new File(["hello"], "notes.txt", { type: "text/plain" });

  await expect(preparePhoto(notAPhoto)).rejects.toThrow();
});
