// src/components/AboutModal.tsx
import { X, FolderIcon, Download } from "lucide-react";
import { open } from "@tauri-apps/plugin-shell";

interface Props {
  onClose: () => void;
  onCheckUpdate: () => void;
  isCheckingUpdate: boolean;
}

export function AboutModal({
  onClose,
  onCheckUpdate,
  isCheckingUpdate,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="glass relative rounded-2xl p-6 w-96 flex flex-col gap-5 shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center">
              <FolderIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Renamo</p>
              <p className="text-xs text-muted-foreground">v0.1.0</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          Sequential file renamer for images and videos. Fast, clean, and
          reversible.
        </p>

        {/* Keyboard shortcuts */}
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold text-foreground mb-1">
            Keyboard Shortcuts
          </p>

          {[
            { key: "O", desc: "Open folder" },
            { key: "R", desc: "Rename files" },
            { key: "F", desc: "Refresh folder" },
            { key: "C", desc: "Clear / reset" },
            { key: "Ctrl+Z", desc: "Undo last rename" },
            { key: "I", desc: "Open info / about" },
            { key: "Esc", desc: "Close dialog" },
          ].map((s) => (
            <div key={s.key} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.desc}</span>
              <kbd className="px-2 py-0.5 rounded-md bg-muted border border-border text-xs font-mono text-foreground">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Check for updates */}
        <button
          onClick={onCheckUpdate}
          disabled={isCheckingUpdate}
          className="w-full h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-medium flex items-center justify-center gap-2 hover:bg-primary/15 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download
            className={`w-3.5 h-3.5 ${isCheckingUpdate ? "animate-bounce" : ""}`}
          />
          {isCheckingUpdate ? "Checking..." : "Check for Updates"}
        </button>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Links */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-foreground">Connect</p>

          <div className="flex flex-col gap-1.5">
            <button
              onClick={async () => {
                await open("https://github.com/miangee21/Renamo");
              }}
              className="flex items-center justify-between group w-full"
            >
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                GitHub Repository
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted border border-border hover:border-primary/40 hover:bg-primary/10 transition-all">
                <svg
                  className="w-3.5 h-3.5 text-foreground"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="text-xs font-mono text-foreground">
                  miangee21/Renamo
                </span>
              </span>
            </button>

            <button
              onClick={async () => {
                await open("https://discord.com/users/miangee");
              }}
              className="flex items-center justify-between group w-full"
            >
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                Discord
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted border border-border hover:border-[#5865F2]/40 hover:bg-[#5865F2]/10 transition-all">
                <svg
                  className="w-3.5 h-3.5 text-[#5865F2]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
                <span className="text-xs font-mono text-foreground">
                  miangee
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Made by Mian Gee
          </span>
          <span className="text-xs text-muted-foreground">MIT License</span>
        </div>
      </div>
    </div>
  );
}
