"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// ── physics constants ──────────────────────────────────────────────────────
const TRIGGER_DIST  = 44;   // px of pull to fire toggle
const MAX_DRAG      = 86;   // hard clamp on bead distance
const STRING_REST   = 34;   // px of string at rest
const SPRING_K      = 0.13; // stiffness
const DAMPING       = 0.73; // velocity retention per frame (0-1)
const SHAKE_VX_MIN  = 4;    // min horizontal speed for shake detection
const SHAKE_REVERSALS = 3;  // direction flips to count as a shake

type V2 = { x: number; y: number };
const len = (v: V2) => Math.sqrt(v.x * v.x + v.y * v.y);
const clamp = (v: V2, max: number): V2 => {
  const l = len(v);
  return l > max ? { x: v.x * max / l, y: v.y * max / l } : v;
};

// ── SVG layout constants ───────────────────────────────────────────────────
const LANTERN_W = 52;
const LANTERN_H = 92;
const OX        = LANTERN_W / 2; // string origin x (center of lantern bottom)
const BEAD_R    = 9;
const SVG_H     = STRING_REST + MAX_DRAG + BEAD_R * 3 + 8;

export default function LanternToggle() {
  const [isDark,   setIsDark]   = useState(false);
  const [swinging, setSwinging] = useState(false);
  const [shaking,  setShaking]  = useState(false);
  const [bead,     setBead]     = useState<V2>({ x: 0, y: 0 });

  const dragging   = useRef(false);
  const origin     = useRef<V2>({ x: 0, y: 0 });
  const beadRef    = useRef<V2>({ x: 0, y: 0 }); // shadow of `bead` for RAF/callbacks
  const velRef     = useRef<V2>({ x: 0, y: 0 });
  const lastClient = useRef<V2>({ x: 0, y: 0 });
  const lastT      = useRef(0);
  const raf        = useRef(0);
  const recentVX   = useRef<number[]>([]);

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

  // Spring animation — runs after pointer-up
  const springBack = useCallback((p0: V2, v0: V2) => {
    cancelAnimationFrame(raf.current);
    let p = { ...p0 };
    let v = { ...v0 };

    function step() {
      v.x = v.x * DAMPING - SPRING_K * p.x;
      v.y = v.y * DAMPING - SPRING_K * p.y;
      p.x += v.x;
      p.y += v.y;
      beadRef.current = { ...p };
      setBead({ ...p });

      if (Math.abs(v.x) < 0.07 && Math.abs(v.y) < 0.07 &&
          Math.abs(p.x) < 0.25 && Math.abs(p.y) < 0.25) {
        const zero = { x: 0, y: 0 };
        beadRef.current = zero;
        setBead(zero);
        return;
      }
      raf.current = requestAnimationFrame(step);
    }
    raf.current = requestAnimationFrame(step);
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true;
    origin.current   = { x: e.clientX, y: e.clientY };
    lastClient.current = { x: e.clientX, y: e.clientY };
    lastT.current    = e.timeStamp;
    velRef.current   = { x: 0, y: 0 };
    recentVX.current = [];
    cancelAnimationFrame(raf.current);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;

    const raw     = { x: e.clientX - origin.current.x, y: e.clientY - origin.current.y };
    const clamped = clamp(raw, MAX_DRAG);

    const dt = Math.max(1, e.timeStamp - lastT.current);
    const vx = (e.clientX - lastClient.current.x) / dt * 16;
    const vy = (e.clientY - lastClient.current.y) / dt * 16;
    velRef.current     = { x: vx, y: vy };
    lastClient.current = { x: e.clientX, y: e.clientY };
    lastT.current      = e.timeStamp;

    beadRef.current = clamped;
    setBead(clamped);

    // Shake detection — rapid horizontal reversals
    const rv = recentVX.current;
    rv.push(vx);
    if (rv.length > 8) rv.shift();

    let reversals = 0;
    for (let i = 1; i < rv.length; i++) {
      if (Math.sign(rv[i]) !== Math.sign(rv[i - 1]) && Math.abs(rv[i]) >= SHAKE_VX_MIN) {
        reversals++;
      }
    }
    if (reversals >= SHAKE_REVERSALS) {
      recentVX.current = [];
      setShaking(true);
      setTimeout(() => setShaking(false), 650);
    }
  }

  function onPointerUp() {
    if (!dragging.current) return;
    dragging.current = false;

    const p = beadRef.current;
    const d = len(p);
    // Fire when pulled far enough and not purely upward
    if (d >= TRIGGER_DIST && p.y > -8) doToggle();

    springBack(p, velRef.current);
  }

  // ── derived values ──────────────────────────────────────────────────────
  const gold     = isDark ? "#7a6a88" : "#d4a030";
  const capFill  = isDark ? "#2e2540" : "#b07828";
  const triggered = len(bead) >= TRIGGER_DIST && bead.y > -8;

  // Bead absolute position in string-SVG space (origin is at (OX, 0))
  const bAbsX = OX + bead.x;
  const bAbsY = STRING_REST + bead.y;

  // Catenary sag: control point sits below the midpoint of the straight line
  const midX    = (OX + bAbsX) / 2;
  const midY    = bAbsY / 2;
  const sagY    = Math.abs(bead.x) * 0.12 + 5 + Math.max(0, -bead.y) * 0.1;
  const stringPath = `M ${OX} 0 Q ${midX} ${midY + sagY} ${bAbsX} ${bAbsY}`;
  const stringColor = triggered
    ? "#d4a8ff"
    : isDark ? "#5a5070" : "#b08030";

  const lanternAnim = shaking
    ? "lantern-shake 0.65s ease-out"
    : swinging
      ? "lantern-swing 0.9s ease-out"
      : "none";

  return (
    <div className="flex flex-col items-center select-none" style={{ width: LANTERN_W }}>

      {/* ── Lantern body ── */}
      <svg
        viewBox={`0 0 ${LANTERN_W} ${LANTERN_H}`}
        width={LANTERN_W}
        height={LANTERN_H}
        aria-hidden="true"
        style={{
          transformOrigin: `${OX}px 2px`,
          animation: lanternAnim,
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
            <stop offset="0%"   stopColor={isDark ? "#1c1228" : "#fff8c0"} />
            <stop offset="55%"  stopColor={isDark ? "#130c20" : "#ffcc40"} />
            <stop offset="100%" stopColor={isDark ? "#0c0814" : "#e07010"} />
          </radialGradient>
          <radialGradient id="lt-shine" cx="28%" cy="28%" r="55%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.38)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* Hanging wire */}
        <line x1="26" y1="0" x2="26" y2="9" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
        {/* Top ring */}
        <ellipse cx="26" cy="12" rx="4" ry="3" fill="none" stroke={gold} strokeWidth="1.8" />
        {/* Top cap */}
        <path d="M14,16 Q26,11 38,16 L35,25 Q26,28 17,25 Z" fill={capFill} />
        <ellipse cx="26" cy="25" rx="10" ry="2.2" fill={gold} opacity="0.75" />
        <circle cx="19" cy="19" r="1" fill={gold} opacity="0.5" />
        <circle cx="26" cy="17.5" r="1" fill={gold} opacity="0.5" />
        <circle cx="33" cy="19" r="1" fill={gold} opacity="0.5" />
        {/* Body */}
        <ellipse cx="26" cy="52" rx="17" ry="27" fill="url(#lt-glow)" />
        {/* Cage */}
        <g clipPath="url(#lt-clip)" opacity="0.9">
          <line x1="9"  y1="25" x2="9"  y2="79" stroke={gold} strokeWidth="1.4" />
          <line x1="18" y1="25" x2="18" y2="79" stroke={gold} strokeWidth="1"   opacity="0.6" />
          <line x1="26" y1="25" x2="26" y2="79" stroke={gold} strokeWidth="0.8" opacity="0.35" />
          <line x1="34" y1="25" x2="34" y2="79" stroke={gold} strokeWidth="1"   opacity="0.6" />
          <line x1="43" y1="25" x2="43" y2="79" stroke={gold} strokeWidth="1.4" />
        </g>
        {/* Hoops */}
        <ellipse cx="26" cy="39" rx="17" ry="2.8" fill="none" stroke={gold} strokeWidth="1.1" opacity="0.55" />
        <ellipse cx="26" cy="52" rx="17" ry="2.8" fill="none" stroke={gold} strokeWidth="0.9" opacity="0.35" />
        <ellipse cx="26" cy="65" rx="17" ry="2.8" fill="none" stroke={gold} strokeWidth="1.1" opacity="0.55" />
        {/* Outline + shine */}
        <ellipse cx="26" cy="52" rx="17" ry="27" fill="none" stroke={gold} strokeWidth="1.6" />
        <ellipse cx="26" cy="52" rx="17" ry="27" fill="url(#lt-shine)" />
        {/* Flame */}
        {!isDark && (
          <>
            <ellipse cx="26" cy="52" rx="7"   ry="10" fill="#fff9d8" opacity="0.65" />
            <ellipse cx="26" cy="54" rx="4.5" ry="7"  fill="#fffef0" opacity="0.5"  />
            <ellipse cx="26" cy="56" rx="2.5" ry="4.5" fill="#ffffff" opacity="0.4"  />
          </>
        )}
        {/* Bottom cap */}
        <ellipse cx="26" cy="79" rx="11" ry="2.2" fill={gold} opacity="0.65" />
        <path d="M15,79 Q26,77 37,79 L33,87 Q26,89 19,87 Z" fill={capFill} />
        <ellipse cx="26" cy="87" rx="3.5" ry="2" fill={capFill} stroke={gold} strokeWidth="1" />
        <circle  cx="26" cy="90" r="1.5" fill={gold} opacity="0.7" />
      </svg>

      {/* ── 2D string + bead ── */}
      <svg
        width={LANTERN_W}
        height={SVG_H}
        style={{ overflow: "visible", flexShrink: 0, cursor: dragging.current ? "grabbing" : "grab", touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="button"
        aria-label={isDark ? "Pull to turn on" : "Pull to turn off"}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") doToggle(); }}
      >
        <defs>
          <radialGradient id="bead-l" cx="35%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#f0c040" />
            <stop offset="100%" stopColor="#906018" />
          </radialGradient>
          <radialGradient id="bead-d" cx="35%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#6a5880" />
            <stop offset="100%" stopColor="#20182e" />
          </radialGradient>
        </defs>

        {/* String */}
        <path d={stringPath} stroke={stringColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Trigger halo */}
        {triggered && (
          <circle cx={bAbsX} cy={bAbsY} r={BEAD_R + 5}
            fill="rgba(200,160,255,0.18)"
            stroke="rgba(200,160,255,0.45)"
            strokeWidth="1"
          />
        )}

        {/* Bead */}
        <circle cx={bAbsX} cy={bAbsY} r={BEAD_R}
          fill={isDark ? "url(#bead-d)" : "url(#bead-l)"}
          stroke={gold} strokeWidth="1.5"
        />
        {/* Bead gloss */}
        <circle cx={bAbsX - 2.5} cy={bAbsY - 2.5} r={2.5} fill="rgba(255,255,255,0.48)" />

        {/* Invisible fat hit-target so users can grab the string easily */}
        <line x1={OX} y1={0} x2={bAbsX} y2={bAbsY}
          stroke="transparent" strokeWidth="22" strokeLinecap="round"
        />

        {/* "pull" hint */}
        <text
          x={bAbsX}
          y={bAbsY + BEAD_R + 10}
          textAnchor="middle"
          fontSize="7"
          fontFamily="monospace"
          letterSpacing="1.4"
          fill={isDark ? "rgba(180,160,210,0.38)" : "rgba(150,110,40,0.42)"}
          style={{ opacity: len(bead) > 6 ? 0 : 1, transition: "opacity 0.2s ease", userSelect: "none" }}
        >
          pull
        </text>
      </svg>
    </div>
  );
}
