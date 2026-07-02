"use client";

import { useState, type FormEvent } from "react";

interface UploadDocumentModalProps {
  onClose: () => void;
  onUploaded: () => void;
}

const fieldClasses =
  "rounded-xl border border-[color:var(--input-border)] bg-[color:var(--input-bg)] px-3 py-2 text-base text-[color:var(--text-heading)] outline-none focus:border-[color:var(--input-focus-border)] sm:text-sm";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--overlay-bg)] p-3 sm:p-6">
      <div className="glass-panel max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg text-[color:var(--text-heading)]">
            Materialize a document
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-heading)]"
          >
            close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input name="title" required placeholder="Title" className={fieldClasses} />
          <input
            name="genre"
            required
            placeholder="Genre (e.g. Research, Systems, Ops)"
            className={fieldClasses}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input name="model" placeholder="Model" className={fieldClasses} />
            <input name="system" placeholder="System" className={fieldClasses} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input name="useCase" placeholder="Use case" className={fieldClasses} />
            <input name="version" placeholder="Version" className={fieldClasses} />
          </div>

          <select
            name="classificationTier"
            defaultValue="3"
            className={fieldClasses}
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
            className={`${fieldClasses} file:mr-3 file:rounded-lg file:border-0 file:bg-[color:var(--panel-bg-1)] file:px-3 file:py-1.5 file:text-[color:var(--text-body)]`}
          />

          {errorMessage && (
            <p className="text-xs text-[#b1524f]">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="glow-button mt-2 rounded-full border border-[color:var(--panel-border)] bg-[color:var(--input-bg)] px-6 py-2.5 text-sm font-medium text-[color:var(--text-button)] disabled:opacity-60"
          >
            {isSubmitting ? "Materializing..." : "Materialize"}
          </button>
        </form>
      </div>
    </div>
  );
}
