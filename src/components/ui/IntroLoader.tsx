"use client";

import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

// Particles flottantes
const PARTICLES = [
  { x: "15%", y: "20%", delay: "0s", dur: "8s", size: 3 },
  { x: "80%", y: "15%", delay: "1.5s", dur: "11s", size: 2 },
  { x: "45%", y: "70%", delay: "3s", dur: "9s", size: 4 },
  { x: "70%", y: "55%", delay: "0.5s", dur: "13s", size: 2 },
  { x: "25%", y: "80%", delay: "2s", dur: "10s", size: 3 },
  { x: "90%", y: "40%", delay: "4s", dur: "7s", size: 2 },
  { x: "10%", y: "60%", delay: "1s", dur: "12s", size: 3 },
  { x: "60%", y: "25%", delay: "2.5s", dur: "8s", size: 2 },
];

export default function IntroLoader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [phase, setPhase] = useState<"loading" | "complete">("loading");

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("caroana-site-loaded");
    if (hasLoaded) {
      setShouldRender(false);
      return;
    }

    setShouldRender(true);
    document.body.classList.add("loader-active");

    let start = 0;
    const interval = setInterval(() => {
      const step = Math.floor(Math.random() * 7) + 3;
      start = Math.min(start + step, 100);
      setProgress(start);

      if (start >= 100) {
        clearInterval(interval);
        setPhase("complete");
        setTimeout(() => {
          setIsDone(true);
          document.body.classList.remove("loader-active");
          sessionStorage.setItem("caroana-site-loaded", "true");
        }, 900);
      }
    }, 55);

    return () => {
      clearInterval(interval);
      document.body.classList.remove("loader-active");
    };
  }, []);

  if (!shouldRender) return null;

  const svgOffset = 500 - (progress / 100) * 500;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden
        transition-all duration-[1100ms] ease-[cubic-bezier(0.85,0,0.15,1)]
        ${isDone ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
      style={{ background: "var(--color-theme-bg)" }}
    >
      {/* === AMBIENT GLOW ORBS === */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(var(--color-theme-accent-rgb), 0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "pulse-glow 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(var(--color-theme-accent-rgb), 0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "pulse-glow 6s ease-in-out infinite reverse",
        }}
      />

      {/* === MESH GRID BACKGROUND === */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(var(--color-theme-accent-rgb), 0.18) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.4,
        }}
      />

      {/* === PARTICLES FLOTTANTES === */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: "var(--color-theme-accent)",
            opacity: 0.6,
            animationName: "particle-drift",
            animationDuration: p.dur,
            animationDelay: p.delay,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
      ))}

      {/* === HUD CORNER INFO === */}
      <div className="absolute top-8 left-8 text-[8px] font-mono space-y-1 hidden sm:block"
        style={{ color: "var(--color-theme-muted)" }}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-current" style={{ animation: "ping-soft 2s infinite", background: "var(--color-theme-accent)" }} />
          <span>SYSTÈME INITIALISÉ</span>
        </div>
        <div>LAT: 5.3096°N  LON: 4.0127°W</div>
        <div>ABIDJAN, CÔTE D'IVOIRE</div>
      </div>

      <div className="absolute top-8 right-8 text-[8px] font-mono text-right hidden sm:block"
        style={{ color: "var(--color-theme-muted)" }}>
        <div>CAROANA MINCEUR v2.0</div>
        <div>RITUELS BOTANIQUES</div>
        <div className="mt-1" style={{ color: "var(--color-theme-accent)" }}>PHYTOTHÉRAPIE AFRICAINE</div>
      </div>

      <div className="absolute bottom-8 left-8 text-[8px] font-mono hidden sm:block"
        style={{ color: "var(--color-theme-muted)" }}>
        <div>FORMULES:{" "}<span style={{ color: "var(--color-theme-accent)" }}>ACTIVES</span></div>
        <div>INGRÉDIENTS:{" "}<span style={{ color: "var(--color-theme-accent)" }}>100% NATURELS</span></div>
      </div>

      <div className="absolute bottom-8 right-8 text-[8px] font-mono text-right hidden sm:block"
        style={{ color: "var(--color-theme-muted)" }}>
        <div>KINKÉLIBA · CITRONNELLE</div>
        <div>THÉ VERT · GINGEMBRE</div>
      </div>

      {/* === CENTERPIECE === */}
      <div className="relative flex flex-col items-center w-full max-w-sm px-8 space-y-10">

        {/* Leaf + Waist SVG Logo — draws on progress */}
        <div className="relative flex items-center justify-center">
          {/* Animated ring */}
          <div
            className="absolute w-44 h-44 rounded-full"
            style={{
              border: "1px solid rgba(var(--color-theme-accent-rgb), 0.2)",
              animation: "spin-slow 20s linear infinite",
            }}
          />
          <div
            className="absolute w-36 h-36 rounded-full"
            style={{
              border: "1px dashed rgba(var(--color-theme-accent-rgb), 0.12)",
              animation: "spin-slow 15s linear infinite reverse",
            }}
          />

          {/* SVG Drawing animation */}
          <svg
            viewBox="0 0 100 100"
            className="w-28 h-28 relative z-10"
            fill="none"
            style={{ stroke: "var(--color-theme-accent)", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" }}
          >
            {/* Silhouette taille — courbes féminines stylisées */}
            <path
              d="M 34,8 C 50,20 52,35 44,50 C 38,62 38,72 42,90"
              strokeDasharray="500"
              strokeDashoffset={svgOffset}
              style={{ transition: "stroke-dashoffset 0.15s ease-out" }}
            />
            <path
              d="M 66,8 C 50,20 48,35 56,50 C 62,62 62,72 58,90"
              strokeDasharray="500"
              strokeDashoffset={svgOffset * 0.95}
              style={{ transition: "stroke-dashoffset 0.15s ease-out", opacity: 0.8 }}
            />
            {/* Ceinture centrale */}
            <path
              d="M 34,52 Q 50,46 66,52"
              strokeDasharray="80"
              strokeDashoffset={Math.max(0, 80 - (progress / 100) * 80 * 1.8)}
              style={{ transition: "stroke-dashoffset 0.15s ease-out", opacity: 0.7 }}
            />
            {/* Feuille botanique centrale */}
            <path
              d="M 50,20 C 38,32 38,48 50,58 C 62,48 62,32 50,20 Z"
              strokeDasharray="120"
              strokeDashoffset={Math.max(0, 120 - (progress / 100) * 120 * 1.6)}
              style={{ transition: "stroke-dashoffset 0.15s ease-out", opacity: 0.6 }}
            />
            {/* Nervure centrale de la feuille */}
            <path
              d="M 50,22 L 50,56"
              strokeDasharray="40"
              strokeDashoffset={Math.max(0, 40 - (progress / 100) * 40 * 2)}
              style={{ transition: "stroke-dashoffset 0.15s ease-out", opacity: 0.4 }}
            />
          </svg>

          {/* Glow at center */}
          <div
            className="absolute w-16 h-16 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, rgba(var(--color-theme-accent-rgb), ${phase === "complete" ? 0.3 : 0.1}) 0%, transparent 70%)`,
              filter: "blur(12px)",
              transition: "all 0.5s ease",
            }}
          />
        </div>

        {/* Brand Name */}
        <div className="text-center space-y-1">
          <h1
            className="font-serif text-2xl font-bold tracking-[0.25em]"
            style={{ color: "var(--color-theme-fg)" }}
          >
            CAROANA
          </h1>
          <div
            className="flex items-center gap-2 justify-center"
          >
            <div className="h-px w-8" style={{ background: "var(--color-theme-accent)" }} />
            <span
              className="text-[10px] font-black tracking-[0.4em] uppercase"
              style={{ color: "var(--color-theme-accent)" }}
            >
              Minceur
            </span>
            <div className="h-px w-8" style={{ background: "var(--color-theme-accent)" }} />
          </div>
        </div>

        {/* Progress bar + counter */}
        <div className="w-full space-y-3">
          {/* Progress track */}
          <div
            className="w-full h-[2px] rounded-full relative overflow-hidden"
            style={{ background: "rgba(var(--color-theme-accent-rgb), 0.12)" }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, var(--color-theme-accent-dark), var(--color-theme-accent), var(--color-theme-accent-hover))`,
                boxShadow: "0 0 8px rgba(var(--color-theme-accent-rgb), 0.7)",
                transition: "width 0.3s ease-out",
              }}
            />
            {/* Glowing tip */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{
                left: `calc(${progress}% - 4px)`,
                background: "var(--color-theme-accent)",
                boxShadow: "0 0 8px 3px rgba(var(--color-theme-accent-rgb), 0.8)",
                transition: "left 0.3s ease-out",
                display: progress > 0 && progress < 100 ? "block" : "none",
              }}
            />
          </div>

          {/* HUD row */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-1.5">
              <Leaf
                className="w-3 h-3"
                style={{
                  color: "var(--color-theme-accent)",
                  animation: "leaf-sway 6s ease-in-out infinite",
                }}
              />
              <span
                className="text-[9px] font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--color-theme-muted)" }}
              >
                {phase === "complete" ? "Bienvenue ✦" : "Chargement"}
              </span>
            </div>
            <span
              className="text-[14px] font-black font-mono"
              style={{
                color: "var(--color-theme-accent)",
                textShadow: "0 0 15px rgba(var(--color-theme-accent-rgb), 0.5)",
              }}
            >
              {progress.toString().padStart(3, "0")}%
            </span>
          </div>
        </div>

      </div>

      {/* Bottom tagline */}
      <div
        className="absolute bottom-16 text-[9px] font-mono tracking-[0.3em] uppercase text-center"
        style={{
          color: "var(--color-theme-muted)",
          opacity: progress > 60 ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        Rituels de Phytothérapie Africaine · Côte d'Ivoire
      </div>
    </div>
  );
}
