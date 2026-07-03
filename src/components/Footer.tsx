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
      {/* SVG filters required by the UIverse buttons */}
      <svg className="fixed w-0 h-0 overflow-hidden" aria-hidden="true">
        <filter id="bump">
          <feTurbulence result="noise" numOctaves={4} baseFrequency="0.678" type="fractalNoise" />
          <feSpecularLighting result="specular" lightingColor="#fffffa" specularExponent={15} specularConstant={0.7} surfaceScale={0.22} in="noise">
            <fePointLight z={210} y={-50} x={40} />
          </feSpecularLighting>
          <feComposite result="noise2" operator="in" in="specular" in2="SourceGraphic" />
          <feBlend mode="difference" in2="noise2" in="SourceGraphic" result="out" />
          <feBlend mode="overlay" in2="out" in="SourceGraphic" />
        </filter>
      </svg>
      <svg className="fixed w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter id="linen">
            <feTurbulence type="fractalNoise" baseFrequency="0.9 0.03" numOctaves={2} seed={8} result="verticalNoise" />
            <feTurbulence type="fractalNoise" baseFrequency="0.03 0.9" numOctaves={2} seed={12} result="horizontalNoise" />
            <feBlend in="verticalNoise" in2="horizontalNoise" mode="multiply" result="woven" />
            <feComponentTransfer in="woven" result="threadContrast">
              <feFuncR type="gamma" amplitude={1.3} exponent={2.4} />
              <feFuncG type="gamma" amplitude={1.3} exponent={2.4} />
              <feFuncB type="gamma" amplitude={1.3} exponent={2.4} />
            </feComponentTransfer>
            <feGaussianBlur in="threadContrast" stdDeviation={0.22} result="softThreads" />
            <feComposite in="softThreads" in2="SourceGraphic" operator="in" result="textureMask" />
            <feBlend in="SourceGraphic" in2="textureMask" mode="color-burn" />
          </filter>
        </defs>
      </svg>

      <audio ref={audioRef} src={track.src} onEnded={playNext} />

      <footer
        className="fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center gap-4 pb-6 pt-8"
        style={{
          background: "linear-gradient(to top, rgba(15,12,28,0.97) 0%, rgba(15,12,28,0.85) 70%, transparent 100%)",
        }}
      >
        {/* Track info */}
        <div className="flex flex-col items-center gap-0.5 select-none">
          <span
            className="font-mono text-[10px] tracking-[0.25em] uppercase"
            style={{ color: "#bda049", opacity: 0.9 }}
          >
            ◆ {track.title} ◆
          </span>
          <span
            className="font-mono text-[9px] tracking-widest uppercase"
            style={{ color: "#7a7060", letterSpacing: "0.2em" }}
          >
            {track.artist}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          {/* Prev */}
          <button className="jazz-skip" onClick={playPrev} aria-label="Previous track">
            <div className="fabric" />
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
            </svg>
          </button>

          {/* Play / Stop — UIverse button */}
          <button
            className={`jazz-btn${isPlaying ? " playing" : ""}`}
            onClick={togglePlay}
            aria-label={isPlaying ? "Stop" : "Play"}
          >
            <div className="fabric" />
            <span className="txt txt-play">Play</span>
            <span className="txt txt-stop">Stop</span>
            <div className="jazz-shadow left" />
            <div className="jazz-shadow right" />
            <div className="dot" />
            <div className="jazz-light" />
          </button>

          {/* Next */}
          <button className="jazz-skip" onClick={playNext} aria-label="Next track">
            <div className="fabric" />
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M6 18l8.5-6L6 6v12zm8.5-6v6h2V6h-2v6z" />
            </svg>
          </button>
        </div>
      </footer>

      {/* Spacer so page content doesn't hide behind the footer */}
      <div className="h-36" aria-hidden="true" />
    </>
  );
}
