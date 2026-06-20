"use client";

import { useState, useEffect } from "react";
import { Zap, Clock } from "lucide-react";

interface TimeLeft {
  heures: number;
  minutes: number;
  secondes: number;
}

function calcTimeLeft(): TimeLeft {
  // Promo valable jusqu'à minuit aujourd'hui
  const now = new Date();
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const diff = Math.max(0, end.getTime() - now.getTime());
  return {
    heures: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    secondes: Math.floor((diff / 1000) % 60),
  };
}

function Pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CountdownPromo({
  message = "🎁 PROMO EXPIRE DANS",
  detail = "Tisane + Thé Détox · 3 paquets à 10 000 F au lieu de 15 000 F",
  ctaLabel = "En profiter",
  ctaLink = "/boutique",
}: {
  message?: string;
  detail?: string;
  ctaLabel?: string;
  ctaLink?: string;
}) {
  const [time, setTime] = useState<TimeLeft>(calcTimeLeft());

  useEffect(() => {
    const t = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="w-full py-3 px-4 flex flex-col sm:flex-row items-center justify-center gap-4 relative overflow-hidden"
      style={{ background: "var(--color-theme-accent)", color: "var(--color-theme-bg)" }}
    >
      {/* Shimmer */}
      <div className="absolute inset-0 pointer-events-none shimmer-bg opacity-20" />

      {/* Left: label */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Zap className="w-3.5 h-3.5" />
        <span className="text-[9px] font-black uppercase tracking-widest">{message}</span>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-1 font-black font-mono text-sm">
        <Clock className="w-3 h-3 mr-1 opacity-70" />
        <span className="px-2 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.2)" }}>{Pad(time.heures)}</span>
        <span className="opacity-70">:</span>
        <span className="px-2 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.2)" }}>{Pad(time.minutes)}</span>
        <span className="opacity-70">:</span>
        <span
          className="px-2 py-0.5 rounded"
          style={{ background: "rgba(0,0,0,0.2)", animation: time.secondes % 2 === 0 ? "none" : "ping-soft 0.5s ease" }}
        >
          {Pad(time.secondes)}
        </span>
      </div>

      {/* Detail */}
      <span className="text-[9px] font-bold opacity-80 hidden md:block">{detail}</span>

      {/* CTA */}
      <a
        href={ctaLink}
        className="px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 flex-shrink-0"
        style={{ background: "rgba(0,0,0,0.25)", color: "inherit" }}
      >
        {ctaLabel}
      </a>
    </div>
  );
}
