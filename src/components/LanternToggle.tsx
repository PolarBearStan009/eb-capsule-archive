"use client";
import { useEffect, useRef, useState } from "react";

const PULL_THRESHOLD = 42;
const MAX_PULL = 80;
const STRING_REST = 30;

export default function LanternToggle() {
  const [isDark, setIsDark] = useState(false);
  const [swinging, setSwinging] = useState(false);
  const [pullY, setPullY] = useState(0);
  const pulling = useRef(false);
  const startY = useRef(0);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function doToggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setSwinging(true);
    setTimeout(() => setSwinging(false), 900);
  }

  function onPointerDown(e: React.PointerEvent) {
    pulling.current = true;
    startY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!pulling.current) return;
    const dy = e.clientY - startY.current;
    setPullY(Math.max(0, Math.min(dy, MAX_PULL)));
  }

  function onPointerUp() {
    if (!pulling.current) return;
    pulling.current = false;
    if (pullY >= PULL_THRESHOLD) doToggle();
    setPullY(0);
  }

  const triggered = pullY >= PULL_THRESHOLD;
  const gold = isDark ? "#7a6a88" : "#d4a030";
  const capFill = isDark ? "#2e2540" : "#b07828";
  const stringCol = triggered
    ? "#d4a8ff"
    : isDark ? "#5a5070" : "#b08030";

  return (
    <div className="flex flex-col items-center select-none" style={{ width: 52 }}>
      {/* Lantern body */}
      <svg
        viewBox="0 0 52 92"
        width={52}
        height={92}
        aria-hidden="true"
        style={{
          transformOrigin: "26px 2px",
          animation: swinging ? "lantern-swing 0.9s ease-out" : "none",
          filter: isDark
            ? "drop-shadow(0 2px 6px rgba(0,0,0,0.5))"
            : "drop-shadow(0 0 10px rgba(255,200,50,1)) drop-shadow(0 0 28px rgba(255,140,20,0.55))",
          transition: "filter 0.5s ease",
          flexShrink: 0,
        }}
      >
        <defs>
          <clipPath id="lt-clip">
            <ellipse cx="26" cy="52" rx="17" ry="27" />
          </clipPath>
          <radialGradient id="lt-glow" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor={isDark ? "#1c1228" : "#fff8c0"} />
            <stop offset="55%" stopColor={isDark ? "#130c20" : "#ffcc40"} />
            <stop offset="100%" stopColor={isDark ? "#0c0814" : "#e07010"} />
          </radialGradient>
          <radialGradient id="lt-shine" cx="28%" cy="28%" r="55%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.38)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* Wire from mount */}
        <line x1="26" y1="0" x2="26" y2="9" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />

        {/* Cute little ring */}
        <ellipse cx="26" cy="12" rx="4" ry="3" fill="none" stroke={gold} strokeWidth="1.8" />

        {/* Top cap — dome shape */}
        <path d="M14,16 Q26,11 38,16 L35,25 Q26,28 17,25 Z" fill={capFill} />
        <ellipse cx="26" cy="25" rx="10" ry="2.2" fill={gold} opacity="0.75" />
        {/* Little rivet dots on cap */}
        <circle cx="19" cy="19" r="1" fill={gold} opacity="0.5" />
        <circle cx="26" cy="17.5" r="1" fill={gold} opacity="0.5" />
        <circle cx="33" cy="19" r="1" fill={gold} opacity="0.5" />

        {/* Lantern body fill */}
        <ellipse cx="26" cy="52" rx="17" ry="27" fill="url(#lt-glow)" />

        {/* Cage bars (clipped) */}
        <g clipPath="url(#lt-clip)" opacity="0.9">
          <line x1="9"  y1="25" x2="9"  y2="79" stroke={gold} strokeWidth="1.4" />
          <line x1="18" y1="25" x2="18" y2="79" stroke={gold} strokeWidth="1"   opacity="0.6" />
          <line x1="26" y1="25" x2="26" y2="79" stroke={gold} strokeWidth="0.8" opacity="0.35" />
          <line x1="34" y1="25" x2="34" y2="79" stroke={gold} strokeWidth="1"   opacity="0.6" />
          <line x1="43" y1="25" x2="43" y2="79" stroke={gold} strokeWidth="1.4" />
        </g>

        {/* Decorative horizontal hoops */}
        <ellipse cx="26" cy="39" rx="17" ry="2.8" fill="none" stroke={gold} strokeWidth="1.1" opacity="0.55" />
        <ellipse cx="26" cy="52" rx="17" ry="2.8" fill="none" stroke={gold} strokeWidth="0.9" opacity="0.35" />
        <ellipse cx="26" cy="65" rx="17" ry="2.8" fill="none" stroke={gold} strokeWidth="1.1" opacity="0.55" />

        {/* Body outline */}
        <ellipse cx="26" cy="52" rx="17" ry="27" fill="none" stroke={gold} strokeWidth="1.6" />

        {/* Gloss */}
        <ellipse cx="26" cy="52" rx="17" ry="27" fill="url(#lt-shine)" />

        {/* Flame in light mode */}
        {!isDark && (
          <>
            <ellipse cx="26" cy="52" rx="7"   ry="10"  fill="#fff9d8" opacity="0.65" />
            <ellipse cx="26" cy="54" rx="4.5" ry="7"   fill="#fffef0" opacity="0.5"  />
            <ellipse cx="26" cy="56" rx="2.5" ry="4.5" fill="#ffffff"  opacity="0.4"  />
          </>
        )}

        {/* Bottom cap */}
        <ellipse cx="26" cy="79" rx="11" ry="2.2" fill={gold} opacity="0.65" />
        <path d="M15,79 Q26,77 37,79 L33,87 Q26,89 19,87 Z" fill={capFill} />
        {/* Cute little dangling tip */}
        <ellipse cx="26" cy="87" rx="3.5" ry="2" fill={capFill} stroke={gold} strokeWidth="1" />
        <circle  cx="26" cy="90" r="1.5"  fill={gold} opacity="0.7" />
      </svg>

      {/* Pull string + bead — draggable */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="flex flex-col items-center"
        style={{ cursor: pullY > 0 ? "grabbing" : "grab", touchAction: "none" }}
        aria-label={isDark ? "Pull to turn on light" : "Pull to turn off light"}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") doToggle(); }}
      >
        {/* String */}
        <div
          style={{
            width: 2.5,
            height: STRING_REST + pullY,
            background: `linear-gradient(to bottom, ${stringCol} 60%, ${stringCol}80)`,
            borderRadius: 2,
            transformOrigin: "top center",
            transition:
              pullY === 0
                ? "height 0.55s cubic-bezier(0.34,1.56,0.64,1), background 0.25s ease"
                : "background 0.1s ease",
          }}
        />
        {/* Tassel bead */}
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(circle at 35% 35%, #6a5880, #20182e)"
              : "radial-gradient(circle at 35% 35%, #f0c040, #906018)",
            border: `1.5px solid ${gold}`,
            boxShadow: triggered
              ? "0 0 0 3px rgba(200,160,255,0.4), 0 0 14px rgba(200,160,255,0.7)"
              : "0 2px 6px rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "box-shadow 0.15s ease",
            flexShrink: 0,
          }}
        >
          <div style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: isDark ? "#a090c0" : "#fff8a0",
            opacity: isDark ? 0.6 : 0.95,
          }} />
        </div>
        {/* Little hint text that fades on first pull */}
        <span
          style={{
            fontSize: 8,
            fontFamily: "monospace",
            letterSpacing: "0.1em",
            color: isDark ? "rgba(180,160,210,0.4)" : "rgba(150,110,40,0.45)",
            marginTop: 4,
            opacity: pullY > 5 ? 0 : 1,
            transition: "opacity 0.2s ease",
            userSelect: "none",
          }}
        >
          pull
        </span>
      </div>
    </div>
  );
}
