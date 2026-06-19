"use client";

import { useEffect, useState } from "react";
import { Sparkles, Terminal } from "lucide-react";

export default function IntroLoader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check sessionStorage to only play once per session
    const hasLoaded = sessionStorage.getItem("caroana-site-loaded");
    if (hasLoaded) {
      setShouldRender(false);
      return;
    }

    setShouldRender(true);
    document.body.classList.add("loader-active");

    // Dynamic digital counting progress
    let start = 0;
    const interval = setInterval(() => {
      start += Math.floor(Math.random() * 8) + 2; // random step
      if (start >= 100) {
        start = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          document.body.classList.remove("loader-active");
          sessionStorage.setItem("caroana-site-loaded", "true");
        }, 600); // delay to enjoy the 100% state
      }
      setProgress(start);
    }, 60);

    return () => {
      clearInterval(interval);
      document.body.classList.remove("loader-active");
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-99999 flex flex-col items-center justify-center bg-theme-bg select-none transition-all duration-[1000ms] cubic-bezier(0.85, 0, 0.15, 1) ${
        isDone ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      {/* Background blueprint grid dots */}
      <div className="absolute inset-0 pattern-mesh opacity-20 pointer-events-none" />
      <div className="absolute inset-0 pattern-contour opacity-10 pointer-events-none" />

      {/* Cyber target HUD details */}
      <div className="absolute top-10 left-10 text-[8px] font-mono text-theme-fg/40 space-y-1 hidden sm:block">
        <p className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-theme-accent" />
          <span>SYSTEM: INITIALIZING</span>
        </p>
        <p>COORDS: 5.3096° N, 4.0127° W</p>
        <p>SYS.LOCK: ACTIVE</p>
      </div>

      <div className="absolute bottom-10 right-10 text-[8px] font-mono text-theme-fg/40 hidden sm:block">
        <p>CAROANA MINCEUR v2.0</p>
        <p>AESTHETICS: OFF+BRAND LANDO</p>
      </div>

      {/* Centerpiece SVG Draw & Counter */}
      <div className="relative flex flex-col items-center max-w-sm w-full px-6 space-y-12">
        
        {/* Pulsing Accent Glow */}
        <div className="absolute -top-12 w-48 h-48 rounded-full bg-theme-accent/5 filter blur-3xl animate-pulse" />

        {/* Logo and SVG Path Drawing */}
        <div className="w-full flex flex-col items-center">
          <svg viewBox="0 0 300 90" className="w-64 h-auto text-theme-accent fill-none stroke-[2.5] stroke-current">
            <path 
              d="M 20,60 C 40,40 70,10 90,40 C 100,55 80,75 110,60 C 130,50 140,20 150,40 C 160,60 170,70 190,55 C 210,40 220,20 230,45 C 240,70 250,65 270,50" 
              strokeDasharray="600" 
              strokeDashoffset={600 - (progress / 100) * 600}
              className="transition-all duration-300 ease-out"
            />
          </svg>
          
          <h2 className="font-serif text-lg font-bold tracking-[0.2em] text-theme-fg mt-4 text-center">
            CAROANA <span className="text-[10px] tracking-[0.25em] font-sans font-bold text-theme-accent uppercase block -mt-1.5">Minceur</span>
          </h2>
        </div>

        {/* HUD calibration counter */}
        <div className="w-full flex flex-col items-center space-y-3">
          <div className="w-full h-[1px] bg-theme-border relative">
            <div 
              className="h-full bg-theme-accent transition-all duration-300 ease-out absolute left-0 top-0"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between w-full text-[10px] font-mono font-bold text-theme-fg/60">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-theme-accent animate-spin-slow" style={{ animationDuration: "6s" }} />
              CALIBRATION
            </span>
            <span className="text-theme-accent text-glow">{progress.toString().padStart(3, "0")}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
