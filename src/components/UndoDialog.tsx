//src/components/UndoDialog.tsx
interface Props {
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UndoDialog({ count, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="glass relative rounded-2xl p-6 w-80 flex flex-col gap-4 shadow-xl border border-border">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-foreground">
            Undo last rename?
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="text-foreground font-mono">{count}</span> files
            will be restored to their original names.
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
            className="h-8 px-4 rounded-xl bg-destructive/90 text-white text-xs font-medium hover:opacity-90 transition-all"
          >
            Yes, Undo
          </button>
        </div>
      </div>
    </div>
  );
}
