"use client";

import { useEffect, useState } from "react";

// A little sun that spins into a crescent moon. Reads/writes the "dark"
// class on <html>, persisted so a reload doesn't flash back to light.
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Reads what the anti-flash script in the layout already applied to
    // <html> before hydration. Can't do this in a lazy useState
    // initializer -- that would run during SSR too and mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="glass-panel flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform duration-300 hover:scale-105 active:scale-95"
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        {Array.from({ length: 8 }).map((_, index) => (
          <span
            key={index}
            className="absolute inset-0"
            style={{ transform: `rotate(${index * 45}deg)` }}
          >
            <span
              className="absolute left-1/2 top-[-4px] h-2 w-[2px] -translate-x-1/2 rounded-full bg-[#f2b84b] transition-all duration-500 ease-out"
              style={{
                opacity: isDark ? 0 : 1,
                transform: isDark ? "scaleY(0)" : "scaleY(1)",
              }}
            />
          </span>
        ))}
        <span
          className="absolute inset-0 rounded-full transition-all duration-500 ease-out"
          style={{
            background: isDark ? "#e4e6ff" : "#ffd66b",
            boxShadow: isDark
              ? "inset 6px -5px 0 0 var(--page-grad-1)"
              : "inset 12px -12px 0 0 transparent",
            transform: isDark ? "rotate(-35deg) scale(0.92)" : "rotate(0deg) scale(1)",
          }}
        />
      </span>
    </button>
  );
}
