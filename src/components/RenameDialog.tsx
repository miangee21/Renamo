//src/components/RenameDialog.tsx
interface Props {
  count: number;
  startNumber: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RenameDialog({
  count,
  startNumber,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="glass relative rounded-2xl p-6 w-80 flex flex-col gap-4 shadow-xl border border-border">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-foreground">
            Rename {count} files?
          </p>
          <p className="text-xs text-muted-foreground">
            Files will be renamed starting from{" "}
            <span className="text-foreground font-mono">{startNumber}</span>.
            You can undo this after.
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="h-8 px-4 rounded-xl glass border border-border text-xs text-muted-foreground hover:text-foreground transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-8 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all"
          >
            Yes, Rename
          </button>
        </div>
      </div>
    </div>
  );
}
