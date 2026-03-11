//src/components/ControlsBar.tsx
import { Undo2 } from "lucide-react";
import type { FilterType } from "../types";

interface Props {
  filter: FilterType;
  counts: { all: number; images: number; videos: number };
  startNumber: number;
  previewCount: number;
  isRenaming: boolean;
  isUndoing: boolean;
  hasUndo: boolean;
  folderPath: string | null;
  onFilterChange: (f: FilterType) => void;
  onStartNumberChange: (n: number) => void;
  onRename: () => void;
  onUndo: () => void;
}

export function ControlsBar({
  filter,
  counts,
  startNumber,
  previewCount,
  isRenaming,
  isUndoing,
  hasUndo,
  folderPath,
  onFilterChange,
  onStartNumberChange,
  onRename,
  onUndo,
}: Props) {
  return (
    <div
      style={{ flexShrink: 0 }}
      className="px-3 pt-3 pb-2.5 flex flex-col gap-2 border-b border-border/40"
    >
      <div className="glass rounded-2xl px-4 py-2.5 flex items-center justify-between">
        {/* Filter tabs */}
        <div className="flex items-center gap-0.5 bg-background/40 rounded-xl p-0.5">
          {(["all", "images", "videos"] as const).map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
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

        {/* Start number + Rename + Undo */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-background/40 rounded-xl px-3 py-1.5 border border-border">
            <span className="text-xs text-muted-foreground">Start</span>
            <input
              type="number"
              min={1}
              value={startNumber}
              onChange={(e) =>
                onStartNumberChange(Math.max(1, Number(e.target.value)))
              }
              className="w-12 text-xs text-center bg-transparent focus:outline-none font-mono text-foreground"
            />
          </div>

          <button
            onClick={onRename}
            disabled={isRenaming || previewCount === 0}
            className="h-8 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-sm shadow-primary/30"
          >
            {isRenaming ? "Renaming..." : `Rename ${previewCount}`}
          </button>

          {hasUndo && (
            <button
              onClick={onUndo}
              disabled={isUndoing}
              className="h-8 px-3 rounded-xl glass border border-border flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Undo2 className="w-3.5 h-3.5" />
              Undo
            </button>
          )}
        </div>
      </div>

      {/* Folder path */}
      {folderPath && (
        <div className="px-1">
          <p className="text-xs text-muted-foreground truncate">{folderPath}</p>
        </div>
      )}
    </div>
  );
}
