"use client";

import { useState } from "react";
import type { DocumentPod } from "@/lib/documentPods";
import ClassificationBadge from "@/components/ClassificationBadge";
import ReadReceipts from "@/components/ReadReceipts";

// Cute pastel badge colors, cycled by genre so the same genre always
// lands on the same color. No neon here -- soft aero glass tones only.
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

// One archived document, rendered as a soft glassy capsule card.
export default function CapsulePod({ pod }: { pod: DocumentPod }) {
  const badge = pastelForGenre(pod.genre);

  // Local read-receipt state, seeded from the pod's data. In a real
  // backend this would be a request to mark the current user as read
  // instead of updating state directly.
  const [readers, setReaders] = useState(pod.readers);

  async function handleReaderConfirm(name: string) {
    // Update immediately so the click feels instant, then persist it.
    setReaders((current) =>
      current.map((reader) =>
        reader.name === name
          ? {
              ...reader,
              hasRead: true,
              respondedAt: new Date().toISOString().slice(0, 10),
            }
          : reader
      )
    );

    await fetch(`/api/documents/${pod.id}/confirm-read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ readerName: name }),
    });
  }

  return (
    <article className="capsule-pod glass-panel group relative flex flex-col gap-3 rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${badge.bg} ${badge.text} ${badge.border}`}
          >
            {pod.genre}
          </span>
          <ClassificationBadge tier={pod.classificationTier} />
        </div>
        <span className="scouter-readout text-[11px] text-[#9aa8c9]">
          pwr {pod.powerLevel}
        </span>
      </div>

      <h3 className="text-base font-medium leading-snug text-[#453f66]">
        {pod.title}
      </h3>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-[#6b6690]">
        <dt className="text-[#a6a1c4]">Model</dt>
        <dd>{pod.model}</dd>
        <dt className="text-[#a6a1c4]">System</dt>
        <dd>{pod.system}</dd>
        <dt className="text-[#a6a1c4]">Use case</dt>
        <dd className="col-span-1">{pod.useCase}</dd>
        <dt className="text-[#a6a1c4]">Version</dt>
        <dd>{pod.version}</dd>
      </dl>

      <ReadReceipts
        readers={readers}
        question={pod.acknowledgmentQuestion}
        onReaderConfirm={handleReaderConfirm}
      />

      <div className="mt-1 flex items-center justify-between border-t border-white/60 pt-3 text-[11px] text-[#8a85ab]">
        <span>{pod.publishedAt}</span>
        <button className="rounded-lg border border-white/70 bg-white/50 px-3 py-1 font-medium text-[#6b6690] transition-colors hover:border-[#c9b8ff] hover:bg-white/80 hover:text-[#453f66]">
          Open pod
        </button>
      </div>
    </article>
  );
}
