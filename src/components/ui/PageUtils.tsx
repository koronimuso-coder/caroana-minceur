"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

// ==================== 1. SCROLL PROGRESS BAR ====================
export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handle = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[3px] z-[9999] transition-none pointer-events-none"
      style={{
        width: `${progress}%`,
        background: "linear-gradient(90deg, var(--color-theme-accent-dark), var(--color-theme-accent), var(--color-theme-accent-hover))",
        boxShadow: "0 0 8px rgba(var(--color-theme-accent-rgb), 0.8)",
      }}
    />
  );
}

// ==================== 2. BACK TO TOP BUTTON ====================
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handle = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut"
      className="fixed bottom-28 right-6 md:bottom-32 md:right-8 z-[9990] w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.8)",
        pointerEvents: visible ? "auto" : "none",
        background: "var(--color-theme-card)",
        borderColor: "var(--color-theme-border)",
        color: "var(--color-theme-accent)",
        boxShadow: "0 4px 20px rgba(var(--color-theme-accent-rgb), 0.2)",
      }}
    >
      <ChevronUp className="w-4 h-4" />
    </button>
  );
}
