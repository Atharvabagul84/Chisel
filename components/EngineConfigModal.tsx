"use client";

import { useEffect, useState } from "react";

interface EngineConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel?: string;
  onSave?: (config: { model: string; temperature: number; apiKey: string }) => void;
}

export default function EngineConfigModal({
  isOpen,
  onClose,
  currentModel = "claude-3-7-sonnet-20250219",
  onSave,
}: EngineConfigModalProps) {
  const [model, setModel] = useState(currentModel);
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load existing apiKey from localStorage if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKey = localStorage.getItem("chisel_anthropic_key") || "";
      setApiKey(storedKey);
    }
  }, [isOpen]);

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

  function handleSave() {
    if (typeof window !== "undefined") {
      if (apiKey.trim()) {
        localStorage.setItem("chisel_anthropic_key", apiKey.trim());
      } else {
        localStorage.removeItem("chisel_anthropic_key");
      }
    }
    if (onSave) {
      onSave({ model, temperature, apiKey });
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-surface-container rounded-xl border border-outline-variant shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container-high/50">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-xl">tune</span>
            <div>
              <h3 className="text-sm font-bold text-on-surface font-mono">Engine Configuration</h3>
              <p className="text-xs text-on-surface-variant font-mono">
                AI Inference Parameters &amp; Runtime Model Settings
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

        {/* Body */}
        <div className="p-6 font-mono text-xs space-y-5">
          {/* Model Selector */}
          <div className="space-y-2">
            <label className="text-on-surface font-semibold flex items-center justify-between">
              <span>Foundation Model:</span>
              <span className="text-tertiary text-[11px]">Active</span>
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="claude-3-7-sonnet-20250219">
                Claude 3.7 Sonnet (Recommended · Hybrid Thinking)
              </option>
              <option value="claude-3-5-sonnet-20241022">
                Claude 3.5 Sonnet (Legacy Stable)
              </option>
              <option value="claude-3-5-haiku-20241022">
                Claude 3.5 Haiku (Ultra Low-Latency)
              </option>
            </select>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-on-surface font-semibold">Temperature: {temperature}</label>
              <span className="text-secondary text-[11px]">
                {temperature <= 0.3
                  ? "Deterministic (Strict DDL & Schemas)"
                  : temperature <= 0.7
                  ? "Balanced"
                  : "Creative Ideation"}
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-primary bg-surface-container-lowest h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-secondary">
              <span>0.0 (Strict Invariants)</span>
              <span>0.5 (Balanced)</span>
              <span>1.0 (Creative)</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-on-surface font-semibold">Max Output Budget</label>
              <span className="text-primary font-bold">{maxTokens} tokens</span>
            </div>
            <input
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value) || 4096)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          {/* Custom API Key Input */}
          <div className="space-y-2 pt-2 border-t border-outline-variant">
            <div className="flex items-center justify-between">
              <label className="text-on-surface font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs text-primary">key</span>
                <span>Anthropic API Key (Optional)</span>
              </label>
              <span className="text-[10px] text-secondary">Saved in browser localStorage</span>
            </div>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                placeholder="sk-ant-api03-... (leave empty for Demo Mode)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 pr-10 text-on-surface focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">
                  {showKey ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            <p className="text-[11px] text-secondary leading-relaxed">
              If left blank, Chisel runs seamlessly using the built-in <strong>Zero-Config Demo Mode</strong> with realistic telemetry.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant bg-surface-container-high/30 font-mono text-xs">
          <span className="text-tertiary">
            {isSaved ? "✓ Configuration applied!" : "Runtime: Edge Next.js"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              type="button"
              className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-highest text-on-surface-variant transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              type="button"
              className="px-4 py-1.5 rounded bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>Save &amp; Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
