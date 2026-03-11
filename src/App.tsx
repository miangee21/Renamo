//src/App.tsx
import { useState, useEffect } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { useFiles } from "./hooks/useFiles";
import { useRename } from "./hooks/useRename";
import { generatePreview } from "./utils/preview";
import { Header } from "./components/Header";
import { EmptyState } from "./components/EmptyState";
import { ControlsBar } from "./components/ControlsBar";
import { FileTable } from "./components/FileTable";
import { AboutModal } from "./components/AboutModal";
import { RenameDialog } from "./components/RenameDialog";
import { UndoDialog } from "./components/UndoDialog";
import { toast } from "sonner";

export default function App() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("renamo-theme") !== "light",
  );
  const [showAbout, setShowAbout] = useState(false);
  const [showRenameConfirm, setShowRenameConfirm] = useState(false);
  const [showUndoConfirm, setShowUndoConfirm] = useState(false);
  const [isUndoing, setIsUndoing] = useState(false);
  const [startNumber, setStartNumber] = useState(1);

  const {
    folderPath,
    filteredFiles,
    counts,
    filter,
    setFilter,
    isLoading,
    loadFiles,
  } = useFiles();
  const { isRenaming, log, executeRename, undoLast } = useRename();

  const previews = generatePreview(filteredFiles, filter, startNumber);

  const toggleTheme = () => {
    setDark((d) => {
      const newDark = !d;
      document.documentElement.classList.toggle("dark", newDark);
      localStorage.setItem("renamo-theme", newDark ? "dark" : "light");
      return newDark;
    });
  };

  const handleSelectFolder = async () => {
    const selected = await open({ directory: true, multiple: false });
    if (selected) await loadFiles(selected as string);
  };

  const handleRefresh = async () => {
    if (folderPath) await loadFiles(folderPath);
  };

  const handleRename = async () => {
    if (!folderPath) return;
    setShowRenameConfirm(false);
    const success = await executeRename(folderPath, previews);
    if (success) {
      await loadFiles(folderPath);
      toast.success(`${previews.length} files renamed successfully`);
    } else {
      toast.error("Rename failed — check console");
    }
  };

  const handleUndoConfirmed = async () => {
    setShowUndoConfirm(false);
    if (isUndoing) return;
    setIsUndoing(true);
    const success = await undoLast(() => folderPath && loadFiles(folderPath));
    if (success) toast.success("Undo successful");
    else toast.error("Undo failed");
    setIsUndoing(false);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "o" || e.key === "O") {
        e.preventDefault();
        handleSelectFolder();
      }
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        if (previews.length > 0 && !isRenaming) setShowRenameConfirm(true);
      }
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        handleRefresh();
      }
      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        if (folderPath) window.location.reload();
      }
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        if (log.length > 0 && !isUndoing) setShowUndoConfirm(true);
      }
      if (e.key === "i" || e.key === "I") {
        e.preventDefault();
        setShowAbout(true);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setShowAbout(false);
      }
      if (showRenameConfirm) {
        if (e.key === "Enter" || e.key === "ArrowRight") {
          e.preventDefault();
          handleRename();
        }
        if (e.key === "ArrowLeft" || e.key === "Escape") {
          e.preventDefault();
          setShowRenameConfirm(false);
        }
      }
      if (showUndoConfirm) {
        if (e.key === "Enter" || e.key === "ArrowRight") {
          e.preventDefault();
          handleUndoConfirmed();
        }
        if (e.key === "ArrowLeft" || e.key === "Escape") {
          e.preventDefault();
          setShowUndoConfirm(false);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    previews.length,
    isRenaming,
    log.length,
    isUndoing,
    showRenameConfirm,
    showUndoConfirm,
    showAbout,
    folderPath,
  ]);

  return (
    <div
      className={`${dark ? "dark" : ""}`}
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <div
        className="bg-mesh flex flex-col relative"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        <div
          className="relative z-10 flex flex-col"
          style={{ height: "100vh", overflow: "hidden" }}
        >
          <Header
            dark={dark}
            folderPath={folderPath}
            isLoading={isLoading}
            onToggleTheme={toggleTheme}
            onAbout={() => setShowAbout(true)}
            onRefresh={handleRefresh}
            onSelectFolder={handleSelectFolder}
            onClear={() => window.location.reload()}
          />

          {!folderPath && <EmptyState onSelectFolder={handleSelectFolder} />}

          {folderPath && (
            <div
              className="flex-1 flex flex-col"
              style={{ overflow: "hidden", minHeight: 0 }}
            >
              <ControlsBar
                filter={filter}
                counts={counts}
                startNumber={startNumber}
                previewCount={previews.length}
                isRenaming={isRenaming}
                isUndoing={isUndoing}
                hasUndo={log.length > 0}
                folderPath={folderPath}
                onFilterChange={setFilter}
                onStartNumberChange={setStartNumber}
                onRename={() => setShowRenameConfirm(true)}
                onUndo={() => setShowUndoConfirm(true)}
              />
              <FileTable previews={previews} isLoading={isLoading} />
            </div>
          )}
        </div>
      </div>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showRenameConfirm && (
        <RenameDialog
          count={previews.length}
          startNumber={startNumber}
          onConfirm={handleRename}
          onCancel={() => setShowRenameConfirm(false)}
        />
      )}
      {showUndoConfirm && (
        <UndoDialog
          count={log[0]?.count ?? 0}
          onConfirm={handleUndoConfirmed}
          onCancel={() => setShowUndoConfirm(false)}
        />
      )}
    </div>
  );
}
