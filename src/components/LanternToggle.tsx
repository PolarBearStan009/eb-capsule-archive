"use client";
import { useEffect, useState } from "react";

export default function LanternToggle() {
  const [isDark, setIsDark] = useState(false);
  const [swinging, setSwinging] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setSwinging(true);
    setTimeout(() => setSwinging(false), 700);
  }

  const gold = isDark ? "#5a5060" : "#c8932a";
  const capColor = isDark ? "#3a3545" : "#a07020";
  const flameColor = isDark ? "transparent" : "#ffd060";
  const glowOpacity = isDark ? 0 : 1;

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex flex-col items-center focus:outline-none select-none"
      style={{ width: 40, height: 120 }}
    >
      <svg
        viewBox="0 0 40 120"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: 40,
          height: 120,
          transformOrigin: "20px 0px",
          animation: swinging ? "lantern-swing 0.7s ease-out" : "none",
          filter: isDark
            ? "none"
            : `drop-shadow(0 0 6px rgba(255,200,60,0.7)) drop-shadow(0 0 14px rgba(255,160,20,0.45))`,
          transition: "filter 0.5s ease",
        }}
      >
        {/* Top wire */}
        <line x1="20" y1="0" x2="20" y2="10" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />

        {/* Top cap */}
        <path d="M9,10 L31,10 L27,20 L13,20 Z" fill={capColor} />
        <rect x="8" y="9" width="24" height="2.5" rx="1.2" fill={gold} />

        {/* Upper ring */}
        <rect x="11" y="20" width="18" height="2" rx="1" fill={gold} opacity="0.8" />

        {/* Cage bars */}
        <rect x="12.5" y="22" width="1.5" height="44" rx="0.75" fill={gold} opacity="0.7" />
        <rect x="19.25" y="22" width="1.5" height="44" rx="0.75" fill={gold} opacity="0.5" />
        <rect x="26" y="22" width="1.5" height="44" rx="0.75" fill={gold} opacity="0.7" />

        {/* Flame / inner glow */}
        <ellipse cx="20" cy="44" rx="8" ry="14"
          fill={isDark ? "#1a1825" : "#fff7d0"}
          opacity={isDark ? 0.4 : 0.95}
        />
        <ellipse cx="20" cy="46" rx="5" ry="9"
          fill={flameColor}
          opacity={isDark ? 0 : 0.9}
        />
        {/* Flame core */}
        {!isDark && (
          <ellipse cx="20" cy="47" rx="3" ry="6" fill="#fff" opacity="0.7" />
        )}

        {/* Middle ring */}
        <rect x="11" y="64" width="18" height="2" rx="1" fill={gold} opacity="0.6" />

        {/* Bottom ring */}
        <rect x="11" y="66" width="18" height="2" rx="1" fill={gold} opacity="0.8" />

        {/* Bottom cap */}
        <path d="M13,68 L27,68 L31,78 L9,78 Z" fill={capColor} />
        <rect x="8" y="77" width="24" height="2.5" rx="1.2" fill={gold} />
        {/* Drip point */}
        <path d="M17,80 L23,80 L20,87 Z" fill={capColor} />

        {/* String */}
        <line x1="20" y1="87" x2="20" y2="106" stroke={isDark ? "#4a4555" : "#8a6a20"} strokeWidth="1" strokeLinecap="round"
          strokeDasharray={isDark ? "none" : "none"}
        />

        {/* Pull knob */}
        <circle cx="20" cy="112" r="5.5" fill={isDark ? "#3a3545" : "#a07020"}
          stroke={gold} strokeWidth="1.2"
        />
        <circle cx="20" cy="112" r="2.5" fill={isDark ? "#2a2535" : "#ffd060"} opacity={isDark ? 0.4 : 0.9} />
      </svg>

      {/* Ambient glow under the lantern in light mode */}
      <span
        className="absolute pointer-events-none rounded-full"
        style={{
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          width: 60,
          height: 30,
          background: "radial-gradient(ellipse, rgba(255,200,60,0.35) 0%, transparent 70%)",
          opacity: glowOpacity,
          transition: "opacity 0.5s ease",
          filter: "blur(6px)",
        }}
      />
    </button>
  );
}
