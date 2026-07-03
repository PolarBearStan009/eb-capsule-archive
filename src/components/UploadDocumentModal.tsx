"use client";

import { useState, useRef, type FormEvent } from "react";

interface UploadDocumentModalProps {
  onClose: () => void;
  onUploaded: () => void;
}

export default function UploadDocumentModal({ onClose, onUploaded }: UploadDocumentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [tier, setTier] = useState("3");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    const response = await fetch("/api/documents", {
      method: "POST",
      body: new FormData(event.currentTarget),
    });
    setIsSubmitting(false);
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setErrorMessage(body?.error ?? "Upload failed. Try again.");
      return;
    }
    onUploaded();
  }

  const tierColors: Record<string, string> = {
    "1": "text-red-400 border-red-400/40 bg-red-400/10",
    "2": "text-amber-400 border-amber-400/40 bg-amber-400/10",
    "3": "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
  };

  const tierLabels: Record<string, string> = {
    "1": "TIER 1 — CLASSIFIED",
    "2": "TIER 2 — LIMITED",
    "3": "TIER 3 — OPEN",
  };

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
      style={{ background: "rgba(6,4,18,0.82)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="modal-panel relative w-full max-w-lg overflow-hidden rounded-t-3xl sm:rounded-3xl"
        style={{
          background: "linear-gradient(160deg, #13102a 0%, #0e1428 55%, #111827 100%)",
          border: "1px solid rgba(160,130,255,0.2)",
        }}
      >
        {/* Scan-line shimmer */}
        <div
          className="pointer-events-none absolute inset-x-0 h-[30%] opacity-[0.04]"
          style={{
            background: "linear-gradient(180deg, transparent, rgba(180,150,255,1), transparent)",
            animation: "scan-line 4s linear infinite",
          }}
        />

        {/* Top accent bar */}
        <div
          className="h-[2px] w-full"
          style={{ background: "linear-gradient(90deg, transparent, #b49bff 40%, #7ec8ff 70%, transparent)" }}
        />

        <div className="relative flex flex-col gap-5 p-6 sm:p-8">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#7ec8ff] opacity-70">
                ◆ CAPSULE ARCHIVE ◆ SECTOR 0079
              </span>
              <h2
                className="text-2xl sm:text-3xl text-transparent"
                style={{
                  fontFamily: "var(--font-display)",
                  backgroundImage: "linear-gradient(120deg, #d4bfff, #7ec8ff 60%, #ffc2e2)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                }}
              >
                Materialize
              </h2>
              <p className="text-xs text-[#6b6a8a]">transmit a new document into the archive</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="mt-1 flex h-8 w-8 items-center justify-center rounded-full text-[#6b6a8a] transition-colors hover:bg-white/5 hover:text-white"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
                <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, rgba(160,130,255,0.3), transparent)" }} />

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium tracking-widest text-[#6b6a8a] uppercase">Document title</label>
              <input
                name="title"
                required
                placeholder="e.g. Adaptive Regulation v2 Spec"
                className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm text-white outline-none placeholder:text-[#3d3c55] focus:border-[#b49bff]/60 focus:bg-white/6 transition-all"
              />
            </div>

            {/* Genre */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium tracking-widest text-[#6b6a8a] uppercase">Genre</label>
              <input
                name="genre"
                required
                placeholder="Research / Systems / Ops / Protocol"
                className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm text-white outline-none placeholder:text-[#3d3c55] focus:border-[#b49bff]/60 focus:bg-white/6 transition-all"
              />
            </div>

            {/* Model + System */}
            <div className="grid grid-cols-2 gap-3">
              {[["model", "Model"], ["system", "System"]].map(([name, label]) => (
                <div key={name} className="flex flex-col gap-1">
                  <label className="text-[10px] font-medium tracking-widest text-[#6b6a8a] uppercase">{label}</label>
                  <input
                    name={name}
                    placeholder={label}
                    className="w-full rounded-xl border border-white/8 bg-white/4 px-3 py-2.5 text-sm text-white outline-none placeholder:text-[#3d3c55] focus:border-[#b49bff]/60 focus:bg-white/6 transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Use case + Version */}
            <div className="grid grid-cols-2 gap-3">
              {[["useCase", "Use case"], ["version", "Version"]].map(([name, label]) => (
                <div key={name} className="flex flex-col gap-1">
                  <label className="text-[10px] font-medium tracking-widest text-[#6b6a8a] uppercase">{label}</label>
                  <input
                    name={name}
                    placeholder={label}
                    className="w-full rounded-xl border border-white/8 bg-white/4 px-3 py-2.5 text-sm text-white outline-none placeholder:text-[#3d3c55] focus:border-[#b49bff]/60 focus:bg-white/6 transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Classification tier */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium tracking-widest text-[#6b6a8a] uppercase">Classification tier</label>
              <div className="grid grid-cols-3 gap-2">
                {(["1","2","3"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={`rounded-xl border py-2 text-xs font-medium transition-all ${
                      tier === t ? tierColors[t] : "border-white/8 bg-white/4 text-[#6b6a8a] hover:bg-white/6"
                    }`}
                  >
                    {tierLabels[t]}
                  </button>
                ))}
              </div>
              <input type="hidden" name="classificationTier" value={tier} />
            </div>

            {/* File upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium tracking-widest text-[#6b6a8a] uppercase">PDF file</label>
              <input
                ref={fileInputRef}
                name="file"
                type="file"
                accept="application/pdf"
                required
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 rounded-xl border border-dashed border-white/12 bg-white/3 px-4 py-3 text-left transition-all hover:border-[#b49bff]/40 hover:bg-white/5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/6 text-[#b49bff]">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z" />
                    <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                  </svg>
                </span>
                <span className="flex flex-col">
                  <span className="text-sm text-white/70">{fileName ?? "Choose PDF to upload"}</span>
                  <span className="text-[11px] text-[#3d3c55]">{fileName ? "file selected" : "click to browse"}</span>
                </span>
              </button>
            </div>

            {errorMessage && (
              <p className="rounded-lg border border-red-400/20 bg-red-400/8 px-3 py-2 text-xs text-red-400">{errorMessage}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative mt-1 overflow-hidden rounded-2xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{
                background: "linear-gradient(120deg, #7b5ea7, #4a7fc1 50%, #7b5ea7)",
                backgroundSize: "200% 100%",
                boxShadow: isSubmitting ? "none" : "0 0 24px rgba(140,110,255,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              {isSubmitting && (
                <span
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    animation: "scan-line 1s linear infinite",
                  }}
                />
              )}
              <span className="relative">
                {isSubmitting ? "Transmitting to archive…" : "⟡ Materialize document"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
