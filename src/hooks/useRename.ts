//src/hooks/useRename.ts
import { useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { PreviewEntry, RenameLogEntry, RenameMapping } from "../types";

export function useRename() {
  const [isRenaming, setIsRenaming] = useState(false);
  const [log, setLog] = useState<RenameLogEntry[]>([]);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const executeRename = useCallback(
    async (folderPath: string, previews: PreviewEntry[]) => {
      if (previews.length === 0) return false;

      setIsRenaming(true);
      setLastResult(null);

      const files = previews.map((p) => ({
        old_name: p.original.name,
        new_name: p.newName,
        path: p.original.path,
      }));

      try {
        await invoke("rename_files", {
          request: { folder_path: folderPath, files },
        });

        const mappings: RenameMapping[] = previews.map((p) => ({
          oldName: p.original.name,
          newName: p.newName,
          path: p.original.path,
        }));

        const logEntry: RenameLogEntry = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          folder: folderPath,
          count: previews.length,
          mappings,
        };

        setLog((prev) => [logEntry, ...prev.slice(0, 9)]);
        setLastResult(`✅ ${previews.length} files renamed successfully`);
        return true;
      } catch (e) {
        console.error("Rename error:", e);
        setLastResult(`❌ Error: ${String(e)}`);
        return false;
      } finally {
        setIsRenaming(false);
      }
    },
    [],
  );

  const undoLast = useCallback(
    async (reloadFiles: () => void) => {
      if (log.length === 0) return false;

      const lastLog = log[0];

      const files = lastLog.mappings.map((m) => ({
        old_name: m.newName,
        new_name: m.oldName,
        path: m.path.replace(m.oldName, m.newName),
      }));

      try {
        await invoke("rename_files", {
          request: { folder_path: lastLog.folder, files },
        });

        setLog((prev) => prev.slice(1));
        setLastResult(`↩️ Undo successful — ${files.length} files restored`);
        reloadFiles();
        return true;
      } catch (e) {
        setLastResult(`❌ Undo failed: ${String(e)}`);
        return false;
      }
    },
    [log],
  );

  return { isRenaming, log, lastResult, executeRename, undoLast };
}
