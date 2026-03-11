//src/utils/filters.ts

// ============================================
// Renamo — File Type Filter Lists
// ============================================

export const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "tiff",
  "tif",
  "heic",
  "heif",
  "avif",
  "raw",
  "cr2",
  "nef",
  "arw",
  "svg",
]);

export const VIDEO_EXTENSIONS = new Set([
  "mp4",
  "mkv",
  "avi",
  "mov",
  "wmv",
  "flv",
  "webm",
  "m4v",
  "3gp",
  "ts",
  "mts",
  "m2ts",
  "vob",
  "ogv",
  "rm",
  "rmvb",
]);

/** Extension se file type detect karo */
export function getFileType(extension: string): "image" | "video" | "other" {
  const ext = extension.toLowerCase();
  if (IMAGE_EXTENSIONS.has(ext)) return "image";
  if (VIDEO_EXTENSIONS.has(ext)) return "video";
  return "other";
}
