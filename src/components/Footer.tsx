"use client";

import { useEffect, useRef, useState } from "react";
import { jazzTracks } from "@/lib/jazzTracks";

export default function Footer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const track = jazzTracks[trackIndex];

  useEffect(() => {
    if (!isPlaying) return;
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
    setTrackIndex((i) => (i + 1) % jazzTracks.length);
    setIsPlaying(true);
  }

  function playPrev() {
    setTrackIndex((i) => (i - 1 + jazzTracks.length) % jazzTracks.length);
    setIsPlaying(true);
  }

  return (
    <>
      <audio ref={audioRef} src={track.src} onEnded={playNext} />

      <footer className="fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center gap-3 pb-5 pt-8 player-footer">
        {/* Track info */}
        <div className="flex flex-col items-center gap-0.5 select-none">
          <span className="player-track-name">◆ {track.title} ◆</span>
          <span className="player-artist">{track.artist}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button className="player-skip" onClick={playPrev} aria-label="Previous track">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
            </svg>
          </button>

          <button
            className={`player-play${isPlaying ? " is-playing" : ""}`}
            onClick={togglePlay}
            aria-label={isPlaying ? "Stop" : "Play"}
          >
            {isPlaying ? (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                <span>STOP</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M8 5v14l11-7z"/></svg>
                <span>PLAY</span>
              </>
            )}
          </button>

          <button className="player-skip" onClick={playNext} aria-label="Next track">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M6 18l8.5-6L6 6v12zm8.5-6v6h2V6h-2v6z" />
            </svg>
          </button>
        </div>
      </footer>

      <div className="h-32" aria-hidden="true" />
    </>
  );
}
