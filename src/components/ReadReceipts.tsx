"use client";

import { useState } from "react";
import type { ReaderStatus } from "@/lib/documentPods";

interface ReadReceiptsProps {
  readers: ReaderStatus[];
  question: string;
  onReaderConfirm: (name: string) => void;
}

// Expandable checklist of who has read this specific document. Clicking
// an unread name doesn't just tick a box -- it asks the acknowledgment
// question first, and only counts as "read" once they answer yes.
export default function ReadReceipts({
  readers,
  question,
  onReaderConfirm,
}: ReadReceiptsProps) {
  // Which reader currently has the confirmation question open, if any.
  const [pendingReader, setPendingReader] = useState<string | null>(null);

  const confirmedCount = readers.filter((reader) => reader.hasRead).length;

  return (
    <details className="group rounded-xl border border-white/60 bg-white/40 open:bg-white/60">
      <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-xs font-medium text-[#6b6690]">
        <span>Read receipts</span>
        <span className="flex items-center gap-2">
          <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] text-[#8a85ab]">
            {confirmedCount}/{readers.length} confirmed
          </span>
          <svg
            className="h-3 w-3 text-[#8a85ab] transition-transform duration-200 group-open:rotate-180"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M5 7l5 5 5-5"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </summary>

      <ul className="flex flex-col gap-1.5 px-3 pb-3 pt-1">
        {readers.map((reader) =>
          pendingReader === reader.name ? (
            <li
              key={reader.name}
              className="flex flex-col gap-2 rounded-lg bg-white/70 p-2.5"
            >
              <p className="text-[11px] leading-snug text-[#6b6690]">
                {question}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onReaderConfirm(reader.name);
                    setPendingReader(null);
                  }}
                  className="rounded-full bg-[#e5f7ee] px-3 py-1 text-[11px] font-medium text-[#4a9a76]"
                >
                  Yes, confirm
                </button>
                <button
                  onClick={() => setPendingReader(null)}
                  className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-[#8a85ab]"
                >
                  Not yet
                </button>
              </div>
            </li>
          ) : (
            <li key={reader.name}>
              <button
                onClick={() => !reader.hasRead && setPendingReader(reader.name)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/50"
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ece3ff] text-[10px] font-medium text-[#7864b0]">
                    {reader.name.slice(0, 1)}
                  </span>
                  <span className="text-xs text-[#4a4468]">{reader.name}</span>
                </span>
                {reader.hasRead ? (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-[#4a9a76]">
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M4 10l4 4 8-8"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {reader.respondedAt}
                  </span>
                ) : (
                  <span className="text-[11px] text-[#b8b3d6]">
                    Tap to confirm
                  </span>
                )}
              </button>
            </li>
          )
        )}
      </ul>
    </details>
  );
}
