"use client";

import { useRef, useState } from "react";
import type { DocumentPod } from "@/lib/documentPods";
import ClassificationBadge from "@/components/ClassificationBadge";
import ReadReceipts from "@/components/ReadReceipts";

const genrePalette = [
  { bg: "bg-[#dff0ff]", text: "text-[#3f79ad]", border: "border-[#bfe0ff]" },
  { bg: "bg-[#ffe3f0]", text: "text-[#b25a86]", border: "border-[#ffcfe4]" },
  { bg: "bg-[#e5f7ee]", text: "text-[#4a9a76]", border: "border-[#c9ecdb]" },
  { bg: "bg-[#ece3ff]", text: "text-[#7864b0]", border: "border-[#d9ccff]" },
];

function pastelForGenre(genre: string) {
  const hash = genre
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  return genrePalette[hash % genrePalette.length];
}

interface Props {
  pod: DocumentPod;
  onDelete: (id: string) => void;
  onUpdated: () => void;
}

export default function CapsulePod({ pod, onDelete, onUpdated }: Props) {
  const badge = pastelForGenre(pod.genre);
  const [readers, setReaders] = useState(pod.readers);
  const [isEditing, setIsEditing] = useState(false);
  const [powerLevel, setPowerLevel] = useState(pod.powerLevel);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleReaderConfirm(name: string) {
    setReaders((current) =>
      current.map((reader) =>
        reader.name === name
          ? { ...reader, hasRead: true, respondedAt: new Date().toISOString().slice(0, 10) }
          : reader
      )
    );
    await fetch(`/api/documents/${pod.id}/confirm-read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ readerName: name }),
    });
  }

  async function handleSave() {
    setIsSaving(true);
    const fd = new FormData();
    fd.append("powerLevel", String(powerLevel));
    if (newFile) fd.append("file", newFile);
    await fetch(`/api/documents/${pod.id}`, { method: "PATCH", body: fd });
    setIsSaving(false);
    setIsEditing(false);
    setNewFile(null);
    onUpdated();
  }

  async function handleDelete() {
    const res = await fetch(`/api/documents/${pod.id}`, { method: "DELETE" });
    if (res.ok) onDelete(pod.id);
  }

  const pdfUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${pod.filePath}`;

  return (
    <article className="capsule-pod glass-panel group relative flex flex-col gap-3 rounded-2xl p-4 transition-transform duration-300 hover:-translate-y-1 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${badge.bg} ${badge.text} ${badge.border}`}>
            {pod.genre}
          </span>
          <ClassificationBadge tier={pod.classificationTier} />
        </div>
        <div className="flex items-center gap-2">
          <span className="scouter-readout text-[11px] text-[color:var(--text-pwr)]">
            pwr {powerLevel}
          </span>
          <button
            onClick={() => { setIsEditing((v) => !v); setConfirmDelete(false); }}
            aria-label="Edit pod"
            className="flex h-6 w-6 items-center justify-center rounded-full text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--panel-bg-1)] hover:text-[color:var(--text-heading)]"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm1.414 1.06a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354l-1.086-1.086ZM11.189 6.25 9.75 4.81 3.428 11.13a.25.25 0 0 0-.064.108l-.655 2.293 2.292-.655a.25.25 0 0 0 .108-.064L11.19 6.25Z" />
            </svg>
          </button>
        </div>
      </div>

      <h3 className="text-base font-medium leading-snug text-[color:var(--text-heading)]">
        {pod.title}
      </h3>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-[color:var(--text-body)]">
        <dt className="text-[color:var(--text-faint)]">Model</dt>
        <dd>{pod.model}</dd>
        <dt className="text-[color:var(--text-faint)]">System</dt>
        <dd>{pod.system}</dd>
        <dt className="text-[color:var(--text-faint)]">Use case</dt>
        <dd>{pod.useCase}</dd>
        <dt className="text-[color:var(--text-faint)]">Version</dt>
        <dd>{pod.version}</dd>
      </dl>

      {isEditing && (
        <div className="flex flex-col gap-3 rounded-xl border border-[color:var(--panel-border)] bg-[color:var(--input-bg)] p-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[color:var(--text-faint)]">Power level (1–100)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={1}
                max={100}
                value={powerLevel}
                onChange={(e) => setPowerLevel(Number(e.target.value))}
                className="flex-1 accent-[#c9b8ff]"
              />
              <span className="scouter-readout w-8 text-right text-xs text-[color:var(--text-heading)]">
                {powerLevel}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[color:var(--text-faint)]">Replace PDF</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setNewFile(e.target.files?.[0] ?? null)}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-dashed border-[color:var(--input-border)] px-3 py-1.5 text-left text-xs text-[color:var(--text-muted)] hover:border-[color:var(--input-focus-border)] hover:text-[color:var(--text-body)]"
            >
              {newFile ? `✓ ${newFile.name}` : "Choose new PDF…"}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 rounded-lg bg-[#c9b8ff]/20 px-3 py-1.5 text-xs font-medium text-[color:var(--text-heading)] hover:bg-[#c9b8ff]/30 disabled:opacity-50"
            >
              {isSaving ? "Saving…" : "Save changes"}
            </button>
            <button
              onClick={() => { setIsEditing(false); setNewFile(null); setPowerLevel(pod.powerLevel); setConfirmDelete(false); }}
              className="rounded-lg px-3 py-1.5 text-xs text-[color:var(--text-muted)] hover:text-[color:var(--text-body)]"
            >
              Cancel
            </button>
          </div>

          <div className="border-t border-[color:var(--panel-border)] pt-2">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full rounded-lg px-3 py-1.5 text-xs text-red-400 hover:bg-red-400/10"
              >
                Delete pod
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="flex-1 text-[11px] text-[color:var(--text-muted)]">Sure? This is permanent.</span>
                <button onClick={handleDelete} className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/30">
                  Yes, delete
                </button>
                <button onClick={() => setConfirmDelete(false)} className="text-xs text-[color:var(--text-muted)] hover:text-[color:var(--text-body)]">
                  No
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <ReadReceipts
        readers={readers}
        question={pod.acknowledgmentQuestion}
        onReaderConfirm={handleReaderConfirm}
      />

      <div className="mt-1 flex items-center justify-between border-t border-[color:var(--panel-border)] pt-3 text-[11px] text-[color:var(--text-muted)]">
        <span>{pod.publishedAt}</span>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-[color:var(--input-border)] bg-[color:var(--input-bg)] px-3 py-1 font-medium text-[color:var(--text-body)] transition-colors hover:border-[color:var(--input-focus-border)] hover:text-[color:var(--text-heading)]"
        >
          Open pod
        </a>
      </div>
    </article>
  );
}
