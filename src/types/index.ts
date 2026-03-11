//src/types/index.ts

// ============================================
// Renamo — Core TypeScript Types
// ============================================

/** Ek file ki complete info jo Rust backend se aati hai */
export interface FileEntry {
  name: string; // "IMG_20230101.jpg"
  path: string; // "C:/Photos/IMG_20230101.jpg"
  extension: string; // "jpg"  (lowercase, without dot)
  modified: number; // Unix timestamp (seconds)
  file_type: "image" | "video" | "other";
}

/** Preview row — before & after rename */
export interface PreviewEntry {
  original: FileEntry; // Original file info
  newName: string; // "445.jpg"
  index: number; // Position in list (0-based)
}

/** Filter options */
export type FilterType = "all" | "images" | "videos";

/** Ek rename operation ka log entry */
export interface RenameLogEntry {
  id: string; // Unique ID (timestamp)
  timestamp: number; // When rename happened
  folder: string; // Which folder
  count: number; // Kitni files rename hui
  mappings: RenameMapping[]; // old → new details
}

/** Ek file ka old → new mapping */
export interface RenameMapping {
  oldName: string; // "IMG_20230101.jpg"
  newName: string; // "445.jpg"
  path: string; // Full path of the file
}

/** Rust command ke liye rename request */
export interface RenameRequest {
  folder_path: string;
  files: {
    old_name: string;
    new_name: string;
    path: string;
  }[];
}

/** App ki overall state */
export interface AppState {
  folderPath: string | null;
  allFiles: FileEntry[];
  filter: FilterType;
  startNumber: number;
  isLoading: boolean;
  isRenaming: boolean;
}
