"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LanternToggle from "@/components/LanternToggle";
import { signIn, signUp, getUser } from "@/lib/auth";

const PROJECTS = [
  { name: "Capsule Archive", status: "live" as const, href: "/archive" },
  { name: "Vector Synchronization", status: "soon" as const, note: "Fuck Yuvraj btw" },
  { name: "W.I.P.R", status: "soon" as const },
];

export default function OrgHomePage() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getUser().then((user) => {
      if (user) router.replace("/archive");
    });
  }, [router]);

  function checkAnswer() {
    if (answer.trim().toLowerCase() === "vector") {
      setUnlocked(true);
      setWrongAnswer(false);
    } else {
      setWrongAnswer(true);
    }
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    const fn = authMode === "login" ? signIn : signUp;
    const { error } = await fn(email, password);
    setAuthLoading(false);
    if (error) {
      setAuthError(error.message);
    } else {
      router.push("/archive");
    }
  }

  return (
    <main className="nebula-bg relative min-h-screen overflow-hidden flex flex-col">
      {/* Nebula SVG filter */}
      <svg className="fixed w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter id="iridescent-nebula">
            <feTurbulence result="turb" seed="11" numOctaves={4} baseFrequency="0.023" type="fractalNoise" />
            <feColorMatrix values="80" type="hueRotate" />
            <feGaussianBlur result="blurred" stdDeviation="7" />
            <feComponentTransfer><feFuncA type="table" tableValues="0 1" /></feComponentTransfer>
            <feBlend in="turb" in2="blurred" mode="screen" />
          </filter>
        </defs>
      </svg>

      {/* Animated nebula layer */}
      <div className="nebula-layer" aria-hidden="true" />

      {/* Lantern toggle */}
      <div className="fixed top-6 right-8 z-50">
        <LanternToggle />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 gap-14 py-24">

        {/* Org name */}
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="font-mono text-[9px] tracking-[0.5em] uppercase org-eyebrow">
            organization portal
          </span>
          <h1 className="org-title">V∆CTOR</h1>
          <p className="org-members">
            Yüvrāj &nbsp;·&nbsp; Mēden &nbsp;·&nbsp; Sarthak &nbsp;·&nbsp; Krish
          </p>
        </div>

        {/* Project launcher */}
        <div className="relative flex flex-col items-center">
          <button
            className="project-dropdown-btn"
            onClick={() => setDropdownOpen((o) => !o)}
          >
            <span>LAUNCH PROJECT</span>
            <span
              className="transition-transform duration-300 inline-block"
              style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              ▾
            </span>
          </button>

          {dropdownOpen && (
            <div className="project-dropdown-panel">
              {PROJECTS.map((p) => (
                <button
                  key={p.name}
                  className={`project-item${p.status === "soon" ? " project-item--dim" : ""}`}
                  disabled={p.status === "soon"}
                  onClick={() => {
                    if (p.href) router.push(p.href);
                    setDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`project-dot${p.status === "live" ? " dot-live" : " dot-soon"}`} />
                    <span className="project-name">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {p.note && <span className="project-note">{p.note}</span>}
                    <span className={`project-badge${p.status === "live" ? " badge-live" : " badge-soon"}`}>
                      {p.status === "live" ? "LIVE" : "SOON"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Auth section */}
        <div className="auth-panel">
          {!unlocked ? (
            <div className="flex flex-col items-center gap-5 w-full">
              <p className="auth-question">what is the name of our language?</p>
              <div className="flex gap-3 items-center w-full">
                <input
                  className="neon-input flex-1"
                  type="text"
                  placeholder="your answer..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                  autoComplete="off"
                />
                <button className="neon-confirm-btn" onClick={checkAnswer}>→</button>
              </div>
              {wrongAnswer && (
                <a
                  href="https://youtu.be/ZS5hZjAItYY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wrong-btn"
                >
                  click here to proceed
                </a>
              )}
            </div>
          ) : (
            <form onSubmit={handleAuth} className="flex flex-col items-center gap-5 w-full">
              <p className="auth-question">
                {authMode === "login" ? "welcome back" : "create your portal"}
              </p>
              <input
                className="neon-input w-full"
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <input
                className="neon-input w-full"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={authMode === "login" ? "current-password" : "new-password"}
              />
              {authError && (
                <p className="text-red-400 text-xs text-center">{authError}</p>
              )}
              <button className="cosmic-btn" type="submit" disabled={authLoading}>
                <span className="cosmic-btn-inner">
                  {authLoading ? "ENTERING..." : authMode === "login" ? "LOGIN" : "REGISTER"}
                </span>
              </button>
              <button
                type="button"
                className="text-[10px] font-mono tracking-widest uppercase text-[color:var(--text-muted)] hover:text-[color:var(--text-body)] transition-colors"
                onClick={() => {
                  setAuthMode((m) => (m === "login" ? "register" : "login"));
                  setAuthError("");
                }}
              >
                {authMode === "login" ? "new here? register instead" : "already in? login"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
