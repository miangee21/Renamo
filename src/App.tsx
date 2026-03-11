//src/App.tsx
import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { useFiles } from "./hooks/useFiles";
import { useRename } from "./hooks/useRename";
import { generatePreview } from "./utils/preview";
import { toast } from "sonner";
import {
  FolderOpen,
  Undo2,
  FolderIcon,
  Sun,
  Moon,
  FolderSearch,
  X,
  RefreshCw,
} from "lucide-react";

export default function App() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("renamo-theme") !== "light"
  );

  const toggleTheme = () => {
    setDark((d) => {
      const newDark = !d;
      document.documentElement.classList.toggle("dark", newDark);
      localStorage.setItem("renamo-theme", newDark ? "dark" : "light");
      return newDark;
    });
  };

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
  const [startNumber, setStartNumber] = useState(1);

  const previews = generatePreview(filteredFiles, filter, startNumber);

  const handleSelectFolder = async () => {
    const selected = await open({ directory: true, multiple: false });
    if (selected) await loadFiles(selected as string);
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
    if (success) {
      toast.success("Undo successful");
    } else {
      toast.error("Undo failed");
    }
    setIsUndoing(false);
  };

  const [isUndoing, setIsUndoing] = useState(false);
  const [showRenameConfirm, setShowRenameConfirm] = useState(false);
  const [showUndoConfirm, setShowUndoConfirm] = useState(false);

  const handleRefresh = async () => {
    if (folderPath) await loadFiles(folderPath);
  };

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
          {/* ── Header ── */}
          <header className="glass border-b border-(--glass-border) px-5 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <FolderIcon className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-semibold text-sm tracking-wide">
                Renamo
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:scale-105 active:scale-95"
              >
                {dark ? (
                  <Sun className="w-3.5 h-3.5" />
                ) : (
                  <Moon className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Refresh */}
              {folderPath && (
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="w-8 h-8 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
                  />
                </button>
              )}

              {/* Select folder / Clear */}
              {folderPath ? (
                <button
                  onClick={() => window.location.reload()}
                  className="h-8 px-4 rounded-xl glass border border-border text-xs font-medium flex items-center gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-all hover:scale-105 active:scale-95"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </button>
              ) : (
                <button
                  onClick={handleSelectFolder}
                  className="h-8 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-sm shadow-primary/30"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  Select Folder
                </button>
              )}
            </div>
          </header>

          {/* ── Empty state ── */}
          {!folderPath && (
            <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8">
              {/* Icon blob */}
              <div className="relative">
                <div className="w-28 h-28 rounded-3xl glass flex items-center justify-center shadow-xl shadow-primary/10">
                  <FolderSearch className="w-12 h-12 text-primary/70" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <span className="text-primary text-[9px] font-bold">+</span>
                </div>
              </div>

              {/* Text */}
              <div className="text-center space-y-2 max-w-xs">
                <p className="text-base font-semibold text-foreground tracking-tight">
                  Rename files in seconds
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Select any folder to preview and sequentially rename your
                  images and videos — fast, clean, reversible.
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={handleSelectFolder}
                className="h-10 px-8 rounded-2xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
              >
                <FolderOpen className="w-4 h-4" />
                Choose a Folder
              </button>
            </div>
          )}

          {/* ── Main content ── */}
          {folderPath && (
            <div
              className="flex-1 flex flex-col"
              style={{ overflow: "hidden", minHeight: 0 }}
            >
              {/* ── Sticky top section ── */}
              <div
                style={{ flexShrink: 0 }}
                className="px-3 pt-3 pb-2.5 flex flex-col gap-2 border-b border-border/40"
              >
                {/* ── Controls row ── */}
                <div className="glass rounded-2xl px-4 py-2.5 flex items-center justify-between">
                  {/* Filter tabs */}
                  <div className="flex items-center gap-0.5 bg-background/40 rounded-xl p-0.5">
                    {(["all", "images", "videos"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                          filter === f
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {f === "all" && `All · ${counts.all}`}
                        {f === "images" && `Images · ${counts.images}`}
                        {f === "videos" && `Videos · ${counts.videos}`}
                      </button>
                    ))}
                  </div>

                  {/* Start number + Rename */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-2 bg-background/40 rounded-xl px-3 py-1.5 border border-border">
                      <span className="text-xs text-muted-foreground">
                        Start
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={startNumber}
                        onChange={(e) =>
                          setStartNumber(Math.max(1, Number(e.target.value)))
                        }
                        className="w-12 text-xs text-center bg-transparent focus:outline-none font-mono text-foreground"
                      />
                    </div>
                    {/* Rename button */}
                    <button
                      onClick={() => setShowRenameConfirm(true)}
                      disabled={isRenaming || previews.length === 0}
                      className="h-8 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-sm shadow-primary/30"
                    >
                      {isRenaming ? "Renaming..." : `Rename ${previews.length}`}
                    </button>

                    {/* Undo button — rename ke saath */}
                    {log.length > 0 && (
                      <button
                        onClick={() => setShowUndoConfirm(true)}
                        disabled={isUndoing}
                        className="h-8 px-3 rounded-xl glass border border-border flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                        Undo
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Folder path ── */}
                <div className="px-1">
                  <p className="text-xs text-muted-foreground truncate">
                    {folderPath}
                  </p>
                </div>
              </div>{" "}
              {/* end sticky top */}
              {/* ── File table ── */}
              <div
                className="glass rounded-2xl flex flex-col mx-3 mb-3 mt-2.5"
                style={{ flex: 1, overflow: "hidden", minHeight: 0 }}
              >
                {/* Table header */}
                <div className="grid grid-cols-2 px-5 py-2.5 border-b border-(--glass-border) shrink-0">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Before
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    After
                  </span>
                </div>

                {/* Rows */}
                {isLoading ? (
                  <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : previews.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                    No files found
                  </div>
                ) : (
                  <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
                    {previews.map((p, i) => (
                      <div
                        key={p.original.path}
                        className={`grid grid-cols-2 px-5 py-2 text-xs font-mono border-b border-border/30 hover:bg-primary/5 transition-colors ${
                          i % 2 === 0 ? "" : "bg-muted/20"
                        }`}
                      >
                        <span className="text-muted-foreground truncate pr-4">
                          {p.original.name}
                        </span>
                        <span className="text-foreground truncate">
                          {p.newName}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Rename Confirmation Dialog ── */}
      {showRenameConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setShowRenameConfirm(false)}
          />
          <div className="glass relative rounded-2xl p-6 w-80 flex flex-col gap-4 shadow-xl border border-border">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-foreground">
                Rename {previews.length} files?
              </p>
              <p className="text-xs text-muted-foreground">
                Files will be renamed starting from{" "}
                <span className="text-foreground font-mono">{startNumber}</span>
                . You can undo this after.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowRenameConfirm(false)}
                className="h-8 px-4 rounded-xl glass border border-border text-xs text-muted-foreground hover:text-foreground transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="h-8 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all"
              >
                Yes, Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Undo Confirmation Dialog ── */}
      {showUndoConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setShowUndoConfirm(false)}
          />
          <div className="glass relative rounded-2xl p-6 w-80 flex flex-col gap-4 shadow-xl border border-border">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-foreground">
                Undo last rename?
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="text-foreground font-mono">
                  {log[0]?.count}
                </span>{" "}
                files will be restored to their original names.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowUndoConfirm(false)}
                className="h-8 px-4 rounded-xl glass border border-border text-xs text-muted-foreground hover:text-foreground transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUndoConfirmed}
                className="h-8 px-4 rounded-xl bg-destructive/90 text-white text-xs font-medium hover:opacity-90 transition-all"
              >
                Yes, Undo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
