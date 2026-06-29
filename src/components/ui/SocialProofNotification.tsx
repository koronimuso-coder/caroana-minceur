"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, X } from "lucide-react";

type Purchase = {
  name: string;
  city: string;
  product: string;
  time: string;
  icon: string;
};

const SAMPLE_PURCHASES: Purchase[] = [
  { name: "Mariam", city: "Cocody", product: "Gélules Ventre Plat Nourrice 🍼", time: "il y a 4 min", icon: "💊" },
  { name: "Awa", city: "Yopougon", product: "Kit Ventre Plat Nourrice (Promo) 🎁", time: "il y a 12 min", icon: "🍼" },
  { name: "Esther", city: "Marcory", product: "Pack Complet 3 Produits 🌟", time: "il y a 25 min", icon: "⭐" },
  { name: "Bintou", city: "Bingerville", product: "Thé Détox Premium 🍃", time: "il y a 8 min", icon: "🍵" },
  { name: "Kadi", city: "Plateau", product: "Gélules Minceur Kaylie 💎", time: "il y a 18 min", icon: "💎" },
  { name: "Sarah", city: "Angré", product: "Tisane Ventre Plat Nourrice 🌿", time: "il y a 32 min", icon: "🌿" },
  { name: "Deborah", city: "Riviera 3", product: "Pack Gélules + Thé Détox 🔥", time: "il y a 15 min", icon: "🔥" },
  { name: "Aminata", city: "Bouaké", product: "Gélules Minceur Skinny ⚡", time: "il y a 45 min", icon: "⚡" },
];

export default function SocialProofNotification() {
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Wait 10 seconds after load to show the first notification
    const startTimer = setTimeout(() => {
      triggerNotification();
    }, 10000);

    // Trigger periodically every 50 seconds
    const interval = setInterval(() => {
      triggerNotification();
    }, 50000);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, []);

  const triggerNotification = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_PURCHASES.length);
    const selected = SAMPLE_PURCHASES[randomIndex];
    if (selected) {
      setPurchase(selected);
      setIsVisible(true);

      // Hide after 8 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 8000);
    }
  };

  if (!purchase) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 max-w-sm w-[calc(100vw-3rem)] rounded-2xl border p-4 shadow-2xl backdrop-blur-md flex items-center gap-3.5 transition-all duration-700 ease-out select-none bg-white/90 dark:bg-black/80 border-theme-border ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      {/* Icon Frame */}
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center text-lg relative flex-shrink-0 text-white"
        style={{
          background: "linear-gradient(135deg, var(--color-theme-accent) 0%, rgba(var(--color-theme-accent-rgb), 0.6) 100%)",
          boxShadow: "0 0 10px rgba(var(--color-theme-accent-rgb), 0.3)",
        }}
      >
        <span>{purchase.icon}</span>
        <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white dark:border-black">
          <ShoppingBag className="w-2.5 h-2.5 text-white" />
        </span>
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0 pr-4">
        <p className="text-[10px] opacity-50 uppercase tracking-widest font-black">Achat récent à Abidjan</p>
        <p className="text-xs mt-0.5 leading-snug" style={{ color: "var(--color-theme-fg)" }}>
          <strong>{purchase.name}</strong> de <span className="font-semibold text-theme-accent-hover">{purchase.city}</span> a commandé :
        </p>
        <p className="text-xs font-serif font-black text-theme-accent truncate mt-0.5">{purchase.product}</p>
        <span className="text-[9px] opacity-40 font-mono block mt-0.5">{purchase.time}</span>
      </div>

      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center hover:bg-theme-fg/5 opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
