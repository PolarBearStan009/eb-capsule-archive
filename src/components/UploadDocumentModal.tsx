"use client";

import { useState, type FormEvent } from "react";

interface UploadDocumentModalProps {
  onClose: () => void;
  onUploaded: () => void;
}

// A small form that posts a PDF + its tags to /api/documents. On success
// it tells the parent page to close the modal and refetch the archive.
export default function UploadDocumentModal({
  onClose,
  onUploaded,
}: UploadDocumentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/documents", {
      method: "POST",
      body: formData,
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setErrorMessage(body?.error ?? "Upload failed. Try again.");
      return;
    }

    onUploaded();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3a3550]/30 p-6">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg text-[#453f66]">Materialize a document</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-sm text-[#8a85ab] hover:text-[#453f66]"
          >
            close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="title"
            required
            placeholder="Title"
            className="rounded-xl border border-white/70 bg-white/60 px-3 py-2 text-sm text-[#4a4468] outline-none focus:border-[#c9b8ff]"
          />
          <input
            name="genre"
            required
            placeholder="Genre (e.g. Research, Systems, Ops)"
            className="rounded-xl border border-white/70 bg-white/60 px-3 py-2 text-sm text-[#4a4468] outline-none focus:border-[#c9b8ff]"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              name="model"
              placeholder="Model"
              className="rounded-xl border border-white/70 bg-white/60 px-3 py-2 text-sm text-[#4a4468] outline-none focus:border-[#c9b8ff]"
            />
            <input
              name="system"
              placeholder="System"
              className="rounded-xl border border-white/70 bg-white/60 px-3 py-2 text-sm text-[#4a4468] outline-none focus:border-[#c9b8ff]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              name="useCase"
              placeholder="Use case"
              className="rounded-xl border border-white/70 bg-white/60 px-3 py-2 text-sm text-[#4a4468] outline-none focus:border-[#c9b8ff]"
            />
            <input
              name="version"
              placeholder="Version"
              className="rounded-xl border border-white/70 bg-white/60 px-3 py-2 text-sm text-[#4a4468] outline-none focus:border-[#c9b8ff]"
            />
          </div>

          <select
            name="classificationTier"
            defaultValue="3"
            className="rounded-xl border border-white/70 bg-white/60 px-3 py-2 text-sm text-[#4a4468] outline-none focus:border-[#c9b8ff]"
          >
            <option value="1">Tier 1 — do not read unless cleared</option>
            <option value="2">Tier 2 — limited distribution</option>
            <option value="3">Tier 3 — general distribution</option>
          </select>

          <input
            name="file"
            type="file"
            accept="application/pdf"
            required
            className="rounded-xl border border-white/70 bg-white/60 px-3 py-2 text-sm text-[#4a4468]"
          />

          {errorMessage && (
            <p className="text-xs text-[#b1524f]">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="glow-button mt-2 rounded-full border border-white/70 bg-white/70 px-6 py-2.5 text-sm font-medium text-[#5a5480] disabled:opacity-60"
          >
            {isSubmitting ? "Materializing..." : "Materialize"}
          </button>
        </form>
      </div>
    </div>
  );
}
