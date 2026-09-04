"use client";

interface SidebarProps {
  currentView: "editor" | "compiling" | "document";
  onSelectView: (view: "editor" | "document") => void;
  hasDocument: boolean;
  tokenCount?: number;
}

export default function Sidebar({
  currentView,
  onSelectView,
  hasDocument,
  tokenCount = 428,
}: SidebarProps) {
  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-surface-container-lowest border-r border-outline-variant z-40 hidden md:flex flex-col justify-between py-4">
      <div className="flex flex-col gap-6 px-3">
        <div className="flex items-center justify-between px-2 text-[10px] font-mono uppercase tracking-widest text-secondary">
          <span>Architecture &amp; Specs</span>
          <span className="material-symbols-outlined text-xs text-outline">keyboard_command_key</span>
        </div>

        <nav className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => hasDocument && onSelectView("document")}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer w-full text-left ${
              currentView === "document"
                ? "bg-surface-container text-on-surface border border-outline-variant font-medium"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[16px]">description</span>
              <span>Active Specs</span>
            </div>
            <span className="text-[10px] font-mono text-secondary">
              {hasDocument ? "1" : "0"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectView("editor")}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer w-full text-left ${
              currentView === "editor" || currentView === "compiling"
                ? "bg-surface-container text-on-surface border border-outline-variant font-medium"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              <span>Spec Editor</span>
            </div>
            <span className="text-[10px] font-mono text-tertiary">live</span>
          </button>

          <button
            type="button"
            onClick={() => hasDocument && onSelectView("document")}
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer w-full text-left"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[16px]">schema</span>
              <span>Schema Models</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => hasDocument && onSelectView("document")}
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer w-full text-left"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[16px]">code_blocks</span>
              <span>API Contracts</span>
            </div>
          </button>

          <button
            type="button"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer w-full text-left"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[16px]">smart_toy</span>
              <span>Prompt Chains</span>
            </div>
            <span className="text-[9px] font-mono px-1 rounded bg-primary-container text-on-primary-container">
              v2
            </span>
          </button>
        </nav>

        <div className="flex flex-col gap-1 pt-3 border-t border-outline-variant">
          <div className="px-2 text-[10px] font-mono uppercase tracking-widest text-secondary mb-1">
            Workspaces
          </div>
          <button
            type="button"
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer w-full text-left"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Engine Config</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer w-full text-left"
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            <span>Audit Logs</span>
          </button>
        </div>
      </div>

      <div className="px-3">
        <div className="p-2.5 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-between text-xs">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-secondary uppercase">Token Usage</span>
            <span className="font-mono text-xs text-on-surface font-semibold">
              {tokenCount}k / 1.0M
            </span>
          </div>
          <span className="material-symbols-outlined text-primary text-sm">bolt</span>
        </div>
      </div>
    </aside>
  );
}
