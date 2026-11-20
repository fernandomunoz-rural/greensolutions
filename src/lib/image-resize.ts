// Browser-side image resize (as in SCORE's website editor): uploads stay small
// and fast on island connections. Never enlarges. Client-only.

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function checkImageFile(file: File): string | null {
  if (!ACCEPTED.includes(file.type)) return "Use a JPG, PNG, WebP or GIF image.";
  if (file.size > MAX_UPLOAD_BYTES) return "Image must be under 8 MB.";
  return null;
}

/** Resize to at most `maxWidth` wide and re-encode as WebP (JPEG fallback). */
export async function resizeImage(
  file: File,
  maxWidth: number,
  quality = 0.85,
): Promise<{ blob: Blob; ext: "webp" | "jpg" | "gif"; width: number; height: number }> {
  // Animated GIFs would lose their animation on a canvas; upload as-is.
  if (file.type === "image/gif") {
    return { blob: file, ext: "gif", width: 0, height: 0 };
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser couldn't process this image.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const toBlob = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  const webp = await toBlob("image/webp");
  if (webp && webp.type === "image/webp") return { blob: webp, ext: "webp", width, height };
  const jpg = await toBlob("image/jpeg");
  if (!jpg) throw new Error("Your browser couldn't process this image.");
  return { blob: jpg, ext: "jpg", width, height };
}
