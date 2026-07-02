"use client";

import { useEffect, useRef, useState } from "react";
import { jazzTracks } from "@/lib/jazzTracks";

// A tiny floating media player so browsing the archive has some
// background jazz. Public-domain recordings streamed straight from
// Wikimedia -- no hosting cost, no licensing fee.
export default function JazzDeck() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const track = jazzTracks[trackIndex];

  useEffect(() => {
    if (!isPlaying) return;
    // Changing the track re-points the <audio> src, so re-trigger play.
    audioRef.current?.play().catch(() => {});
  }, [trackIndex, isPlaying]);

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }

  function playNext() {
    setTrackIndex((index) => (index + 1) % jazzTracks.length);
    setIsPlaying(true);
  }

  function playPrevious() {
    setTrackIndex((index) => (index - 1 + jazzTracks.length) % jazzTracks.length);
    setIsPlaying(true);
  }

  return (
    <div className="glass-panel fixed bottom-4 left-4 z-40 flex items-center gap-3 rounded-full py-2 pl-2 pr-4 sm:bottom-6 sm:left-6">
      <audio ref={audioRef} src={track.src} onEnded={playNext} />

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2c2a3a] ${
          isPlaying ? "vinyl-spin" : ""
        }`}
        aria-hidden="true"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[#f2b84b]" />
      </div>

      <div className="hidden min-w-0 flex-col leading-tight sm:flex">
        <span className="truncate text-xs font-medium text-[color:var(--text-heading)]">
          {track.title}
        </span>
        <span className="truncate text-[10px] text-[color:var(--text-muted)]">
          {track.artist}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={playPrevious}
          aria-label="Previous track"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[color:var(--text-body)] transition-colors hover:bg-[color:var(--panel-bg-1)]"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M6 4a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1Zm3.6 6-6.2-4.7A1 1 0 0 0 2 6.1v7.8a1 1 0 0 0 1.4.8L9.6 10Z" />
          </svg>
        </button>

        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--panel-bg-1)] text-[color:var(--text-heading)] transition-transform hover:scale-105 active:scale-95"
        >
          {isPlaying ? (
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M6 4h2v12H6zM12 4h2v12h-2z" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor" className="ml-0.5 h-3.5 w-3.5">
              <path d="M6 4.5v11a1 1 0 0 0 1.5.87l9-5.5a1 1 0 0 0 0-1.74l-9-5.5A1 1 0 0 0 6 4.5Z" />
            </svg>
          )}
        </button>

        <button
          onClick={playNext}
          aria-label="Next track"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[color:var(--text-body)] transition-colors hover:bg-[color:var(--panel-bg-1)]"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M14 4a1 1 0 0 0-1 1v10a1 1 0 1 0 2 0V5a1 1 0 0 0-1-1Zm-3.6 6 6.2-4.7A1 1 0 0 1 18 6.1v7.8a1 1 0 0 1-1.4.8L10.4 10Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
