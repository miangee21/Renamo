//src/components/FileTable.tsx
import type { PreviewEntry } from "../types";

interface Props {
  previews: PreviewEntry[];
  isLoading: boolean;
}

export function FileTable({ previews, isLoading }: Props) {
  return (
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
              <span className="text-muted-foreground truncate pr-4 flex items-center gap-1.5">
                {p.original.file_type === "image" && <span>🖼️</span>}
                {p.original.file_type === "video" && <span>🎬</span>}
                {p.original.file_type === "other" && <span>📄</span>}
                {p.original.name}
              </span>
              <span className="text-foreground truncate">{p.newName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
