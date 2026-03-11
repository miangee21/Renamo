//src/components/EmptyState.tsx
import { FolderOpen, FolderSearch } from "lucide-react";

interface Props {
  onSelectFolder: () => void;
}

export function EmptyState({ onSelectFolder }: Props) {
  return (
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
          Select any folder to preview and sequentially rename your images and
          videos — fast, clean, reversible.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={onSelectFolder}
        className="h-10 px-8 rounded-2xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
      >
        <FolderOpen className="w-4 h-4" />
        Choose a Folder
      </button>
    </div>
  );
}
