//src/hooks/useFiles.ts
import { useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { FileEntry, FilterType } from "../types";
import { filterFiles, getFilterCounts } from "../utils/preview";

export function useFiles() {
  const [folderPath, setFolderPath] = useState<string | null>(null);
  const [allFiles, setAllFiles] = useState<FileEntry[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFiles = useCallback(async (path: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const files = await invoke<FileEntry[]>("list_files", {
        folderPath: path,
      });
      setAllFiles(files);
      setFolderPath(path);
    } catch (e) {
      setError(String(e));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredFiles = filterFiles(allFiles, filter);
  const counts = getFilterCounts(allFiles);

  return {
    folderPath,
    allFiles,
    filteredFiles,
    counts,
    filter,
    setFilter,
    isLoading,
    error,
    loadFiles,
  };
}
