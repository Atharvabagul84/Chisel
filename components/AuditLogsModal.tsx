"use client";

import { useEffect, useState } from "react";

interface AuditLogEntry {
  id: string;
  specName: string;
  audience: string;
  depth: string;
  latencyMs: number;
  tokensEmitted: number;
  model: string;
  sha: string;
  timestamp: string;
  status: "SUCCESS" | "VERIFIED";
}

const DEFAULT_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "LOG-2026-0904-003",
    specName: "GitHub PR AST Triage Bot",
    audience: "Solo Dev / AI Coder",
    depth: "Technical & Lean",
    latencyMs: 3840,
    tokensEmitted: 1248,
    model: "claude-3-7-sonnet",
    sha: "7f9a8b12c4e5a90d",
    timestamp: "2026-09-04 17:10:13 UTC",
    status: "VERIFIED",
  },
  {
    id: "LOG-2026-0904-002",
    specName: "B2B Stripe Metered Billing Engine",
    audience: "Agency / Client",
    depth: "Comprehensive Spec",
    latencyMs: 4120,
    tokensEmitted: 1412,
    model: "claude-3-7-sonnet",
    sha: "c3e104af882b5419",
    timestamp: "2026-09-04 16:55:22 UTC",
    status: "SUCCESS",
  },
  {
    id: "LOG-2026-0904-001",
    specName: "Rust Low-Latency Vector Ingestion Engine",
    audience: "Solo Dev / AI Coder",
    depth: "Technical & Lean",
    latencyMs: 3290,
    tokensEmitted: 1180,
    model: "claude-3-7-sonnet",
    sha: "9d821fc003aa76b1",
    timestamp: "2026-09-04 15:42:09 UTC",
    status: "VERIFIED",
  },
  {
    id: "LOG-2026-0903-098",
    specName: "Smart Task Auto-Assignment Feature",
    audience: "Engineering Team",
    depth: "Balanced",
    latencyMs: 2980,
    tokensEmitted: 980,
    model: "claude-3-5-sonnet",
    sha: "a15f9e2b0c345118",
    timestamp: "2026-09-03 19:12:44 UTC",
    status: "SUCCESS",
  },
];

interface AuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuditLogsModal({ isOpen, onClose }: AuditLogsModalProps) {
  const [filter, setFilter] = useState<"ALL" | "SUCCESS" | "VERIFIED">("ALL");
  const [copiedExport, setCopiedExport] = useState(false);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredLogs =
    filter === "ALL"
      ? DEFAULT_AUDIT_LOGS
      : DEFAULT_AUDIT_LOGS.filter((l) => l.status === filter);

  function handleExport() {
    const jsonBlob = new Blob([JSON.stringify(DEFAULT_AUDIT_LOGS, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(jsonBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chisel-audit-ledger-${Date.now()}.json`;
    a.click();
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-3xl bg-surface-container rounded-xl border border-outline-variant shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container-high/50">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-xl">history</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-on-surface font-mono">Architecture Audit Logs</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-tertiary-container text-on-tertiary-container">
                  SOC2 Compliance Trail
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-mono">
                Immutable Ledger of Specification Compilations &amp; Cryptographic SHAs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-outline-variant font-mono text-xs bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="text-secondary">Filter:</span>
            {(["ALL", "VERIFIED", "SUCCESS"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                  filter === f
                    ? "bg-primary-container text-on-primary-container font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 text-primary hover:underline cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">download</span>
            <span>{copiedExport ? "Exported!" : "Export JSON"}</span>
          </button>
        </div>

        {/* Logs List */}
        <div className="p-6 overflow-y-auto font-mono text-xs space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/40 hover:border-outline transition-colors flex flex-col gap-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-secondary text-[10px] font-bold">
                    {log.id}
                  </span>
                  <span className="text-on-surface font-semibold text-sm">{log.specName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === "VERIFIED"
                        ? "bg-tertiary-container text-on-tertiary-container"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {log.status}
                  </span>
                  <span className="text-secondary text-[11px]">{log.timestamp}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-outline-variant/30 text-[11px]">
                <div>
                  <span className="text-secondary">Latency: </span>
                  <span className="text-tertiary font-bold">{(log.latencyMs / 1000).toFixed(1)}s</span>
                </div>
                <div>
                  <span className="text-secondary">Tokens: </span>
                  <span className="text-on-surface font-semibold">{log.tokensEmitted.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-secondary">Audience: </span>
                  <span className="text-on-surface-variant">{log.audience}</span>
                </div>
                <div className="truncate">
                  <span className="text-secondary">SHA: </span>
                  <span className="text-primary font-mono">{log.sha.slice(0, 10)}...</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-outline-variant bg-surface-container-high/30 font-mono text-xs">
          <span className="text-secondary">Retention: 90 Days · Tamper-evident Audit Ledger</span>
          <button
            onClick={onClose}
            type="button"
            className="px-3 py-1.5 rounded bg-surface-container-highest hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
