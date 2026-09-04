"use client";

interface HeaderProps {
  isDemo?: boolean;
  onNewSpec: () => void;
  activeNav?: string;
  onNavigate?: (nav: string) => void;
}

export default function Header({ isDemo = true, onNewSpec }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant">
      <div className="w-full h-full px-4 flex items-center justify-between gap-4">
        {/* Left branding */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center font-bold font-mono text-primary text-sm shadow-sm">
            ⌁
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-headline font-bold tracking-wider text-on-surface uppercase">
              CHISEL
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant text-on-surface-variant leading-none">
              v2.4
            </span>
          </div>
          <span className="text-outline select-none text-xs">/</span>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-mono">
            <span className="hover:text-on-surface transition-colors cursor-pointer">workspace</span>
            <span className="text-outline select-none">/</span>
            <span className="text-on-surface font-medium">specs</span>
          </div>
        </div>

        {/* Center telemetry */}
        <div className="hidden md:flex items-center justify-center shrink-0">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant text-[11px] font-mono text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
            <span>AI Engine:</span>
            <span className="text-on-surface font-medium">
              {isDemo ? "Claude 3.7 Sonnet (Demo Mode)" : "Claude 3.7 Sonnet"}
            </span>
            <span className="text-outline">/</span>
            <span className="text-primary">SpecEngine v2</span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewSpec}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-primary/40 bg-primary/10 hover:bg-primary hover:text-on-primary text-primary text-xs font-medium transition-all group cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            <span>New Spec</span>
            <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono px-1 rounded bg-surface-container-highest/80 group-hover:bg-primary-container group-hover:text-on-primary-container text-on-surface-variant border border-outline-variant transition-colors">
              ⌘N
            </kbd>
          </button>
          <a
            className="text-xs text-on-surface-variant hover:text-on-surface transition-colors font-mono hidden lg:inline-block"
            href="https://github.com/Atharvabagul84/Chisel"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
          <div
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container border border-outline-variant text-[11px] font-mono text-on-surface-variant"
            title="API: 99.98% Operational"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
            <span className="text-[10px] text-tertiary uppercase tracking-wider font-semibold">API</span>
          </div>
          <div className="w-px h-4 bg-outline-variant hidden sm:block" />
          <a
            href="https://chisel-chi.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded transition-colors flex items-center justify-center"
            title="Open Live Vercel Deployment"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          </a>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
