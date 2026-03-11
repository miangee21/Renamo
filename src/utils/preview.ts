//src/utils/preview.ts

// ============================================
// Renamo — Preview Generation Logic
// ============================================

import type { FileEntry, PreviewEntry, FilterType } from "../types";
import { getNumberedName } from "./numbering";

/**
 * Files ko filter karo based on FilterType
 */
export function filterFiles(
  files: FileEntry[],
  filter: FilterType,
): FileEntry[] {
  if (filter === "all") return files;
  if (filter === "images") return files.filter((f) => f.file_type === "image");
  if (filter === "videos") return files.filter((f) => f.file_type === "video");
  return files;
}

/**
 * Preview entries generate karo — yeh UI mein before/after dikhayega
 *
 * Example output:
 * [
 *   { original: { name: "IMG_001.jpg", ... }, newName: "445.jpg", index: 0 },
 *   { original: { name: "DSC_9821.jpg", ... }, newName: "446.jpg", index: 1 },
 * ]
 */
export function generatePreview(
  files: FileEntry[],
  filter: FilterType,
  startNumber: number,
): PreviewEntry[] {
  const filtered = filterFiles(files, filter);

  return filtered.map((file, i) => {
    const num = startNumber + i;
    const numberedName = getNumberedName(num, startNumber, filtered.length);
    const newName = file.extension
      ? `${numberedName}.${file.extension}`
      : numberedName;

    return {
      original: file,
      newName,
      index: i,
    };
  });
}

/**
 * Filter ke hisaab se count nikalo
 */
export function getFilterCounts(files: FileEntry[]) {
  return {
    all: files.length,
    images: files.filter((f) => f.file_type === "image").length,
    videos: files.filter((f) => f.file_type === "video").length,
  };
}
