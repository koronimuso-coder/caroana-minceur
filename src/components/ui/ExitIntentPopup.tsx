"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { X, Tag, Copy, Check, Sparkles, Clock, ArrowRight } from "lucide-react";

export default function ExitIntentPopup() {
  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  useEffect(() => {
    // Check if the cart has items and the popup hasn't been shown in this session
    const hasItems = items.length > 0;
    const alreadyShown = sessionStorage.getItem("caroana-exit-intent-shown");

    if (!hasItems || alreadyShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // clientY < 15 triggers when mouse leaves the top of viewport (e.g. to address bar)
      if (e.clientY < 15) {
        setIsOpen(true);
        sessionStorage.setItem("caroana-exit-intent-shown", "true");
        // Remove listener once triggered
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [items]);

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, timeLeft]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText("CAROANA10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div 
        className="bg-theme-card border border-emerald-500/30 rounded-3xl w-full max-w-md p-6 relative z-10 shadow-2xl overflow-hidden animate-scale-up"
        style={{ background: "var(--color-theme-card)", borderColor: "rgba(16,185,129,0.3)" }}
      >
        {/* Glow Effects */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-yellow-500/5 rounded-full blur-[40px] pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-theme-fg"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Content */}
        <div className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Offre Exclusive</span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-black uppercase tracking-tight text-theme-fg">
            Attendez ! Votre corps vous remerciera... 🌿
          </h3>
          
          <p className="text-xs text-theme-fg opacity-75 leading-relaxed">
            Ne laissez pas vos objectifs silhouette s'envoler. Finalisez votre commande de cures phytothérapiques naturelles maintenant et profitez de <strong>10% de réduction immédiate</strong> sur tout votre panier !
          </p>

          {/* Code Promo Block */}
          <div 
            onClick={handleCopyCode}
            className="p-4 border border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-all select-none relative bg-neutral-50/50 dark:bg-neutral-900/20"
            style={{ borderColor: "var(--color-theme-accent)" }}
          >
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-50 text-theme-fg">Cliquez pour copier le code :</span>
            <div className="flex items-center gap-2">
              <strong className="text-2xl font-mono tracking-wider text-emerald-600 dark:text-emerald-400">CAROANA10</strong>
              {copied ? (
                <Check className="w-5 h-5 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4 opacity-60 text-theme-fg" />
              )}
            </div>
          </div>

          {/* Urgency Countdown */}
          {timeLeft > 0 && (
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-yellow-600 dark:text-yellow-400">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span>Cette offre unique expire dans :</span>
              <span className="font-mono bg-yellow-500/10 px-2 py-0.5 rounded text-[11px] font-black">{timeString}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                handleCopyCode();
                setIsOpen(false);
              }}
              className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-center text-white flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg"
              style={{ background: "var(--color-theme-accent)", boxShadow: "0 4px 15px rgba(var(--color-theme-accent-rgb), 0.3)" }}
            >
              <span>Copier & Appliquer le coupon</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center opacity-40 hover:opacity-75 transition-opacity cursor-pointer text-theme-fg"
            >
              Non merci, je préfère payer le prix normal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
