//src/components/Header.tsx
import {
  FolderOpen,
  FolderIcon,
  Sun,
  Moon,
  RefreshCw,
  Info,
  X,
} from "lucide-react";

interface Props {
  dark: boolean;
  folderPath: string | null;
  isLoading: boolean;
  onToggleTheme: () => void;
  onAbout: () => void;
  onRefresh: () => void;
  onSelectFolder: () => void;
  onClear: () => void;
}

export function Header({
  dark,
  folderPath,
  isLoading,
  onToggleTheme,
  onAbout,
  onRefresh,
  onSelectFolder,
  onClear,
}: Props) {
  return (
    <header className="glass border-b border-(--glass-border) px-5 py-3 flex items-center justify-between shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
          <FolderIcon className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="font-semibold text-sm tracking-wide">Renamo</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="w-8 h-8 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:scale-105 active:scale-95"
        >
          {dark ? (
            <Sun className="w-3.5 h-3.5" />
          ) : (
            <Moon className="w-3.5 h-3.5" />
          )}
        </button>

        {/* About */}
        <button
          onClick={onAbout}
          className="w-8 h-8 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:scale-105 active:scale-95"
        >
          <Info className="w-3.5 h-3.5" />
        </button>

        {/* Refresh */}
        {folderPath && (
          <button
            onClick={onRefresh}
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
            onClick={onClear}
            className="h-8 px-4 rounded-xl glass border border-border text-xs font-medium flex items-center gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-all hover:scale-105 active:scale-95"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        ) : (
          <button
            onClick={onSelectFolder}
            className="h-8 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-sm shadow-primary/30"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            Select Folder
          </button>
        )}
      </div>
    </header>
  );
}
