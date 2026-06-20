"use client";

import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const TEMOIGNAGES = [
  {
    nom: "Awa K.",
    ville: "Abidjan, Cocody",
    emoji: "👩🏾",
    note: 5,
    produit: "Pack Complet 3 Produits",
    texte: "Après 14 jours de cure, j'ai perdu 4 kg et mon ventre est vraiment plus plat ! Les gélules sont faciles à prendre et la tisane est délicieuse. Je recommande Caroana à toutes mes amies.",
    date: "Juin 2026",
  },
  {
    nom: "Fatou D.",
    ville: "Abidjan, Yopougon",
    emoji: "👩🏿",
    note: 5,
    produit: "Gélules Minceur Kaylie",
    texte: "J'ai commandé les gélules Kaylie et en 3 semaines j'ai déjà perdu 6 kg ! La livraison était rapide et le service client très sympa. Merci Caroana Minceur !",
    date: "Juin 2026",
  },
  {
    nom: "Marie-Claire O.",
    ville: "Abidjan, Marcory",
    emoji: "👩🏾",
    note: 5,
    produit: "Thé Détox + Tisane Ventre Plat",
    texte: "Le thé détox est vraiment efficace. Je le bois chaque matin et je me sens beaucoup plus légère. Mon transit est régulier et j'ai moins de ballonnements. Produit naturel et authentique.",
    date: "Mai 2026",
  },
  {
    nom: "Aminata S.",
    ville: "Abidjan, Abobo",
    emoji: "👸🏿",
    note: 5,
    produit: "Gélules Minceur Skinny",
    texte: "En une semaine de cure Skinny j'ai perdu 3 kg. C'est incroyable ! J'avais peur que ça ne marche pas mais les résultats sont là. Je vais continuer avec les Kaylie le mois prochain.",
    date: "Mai 2026",
  },
  {
    nom: "Binta C.",
    ville: "Abidjan, Treichville",
    emoji: "👩🏿",
    note: 5,
    produit: "Pack Gélules + Thé Détox",
    texte: "Service impeccable ! Livraison dans les 24h et les produits sont vraiment naturels, on sent la différence. Mon corps est plus tonique et je me sens bien dans ma peau.",
    date: "Avril 2026",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isAuto, setIsAuto] = useState(true);

  useEffect(() => {
    if (!isAuto) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TEMOIGNAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAuto]);

  const prev = () => {
    setIsAuto(false);
    setCurrent((c) => (c - 1 + TEMOIGNAGES.length) % TEMOIGNAGES.length);
  };

  const next = () => {
    setIsAuto(false);
    setCurrent((c) => (c + 1) % TEMOIGNAGES.length);
  };

  const t = TEMOIGNAGES[current]!;

  return (
    <section className="py-24 border-t relative overflow-hidden" style={{ borderColor: "var(--color-theme-border)", background: "var(--color-theme-bg)" }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full" style={{
          background: "radial-gradient(circle, rgba(var(--color-theme-accent-rgb), 0.05) 0%, transparent 70%)",
          filter: "blur(60px)"
        }} />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <ScrollReveal animation="fade-up">
          <div className="text-center space-y-2 mb-14">
            <span className="text-[9px] font-black uppercase tracking-[0.35em]" style={{ color: "var(--color-theme-accent)" }}>
              Avis Clients
            </span>
            <h2 className="font-sans text-3xl sm:text-5xl font-black uppercase tracking-tight" style={{ color: "var(--color-theme-fg)" }}>
              Elles ont testé,<br />
              <span style={{ color: "var(--color-theme-accent)" }}>elles en parlent</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Rating summary */}
        <ScrollReveal animation="scale-up" delay={100}>
          <div className="flex justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-black font-mono" style={{ color: "var(--color-theme-accent)" }}>5.0</div>
              <div className="flex justify-center gap-0.5 my-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" style={{ color: "var(--color-theme-accent)" }} />)}
              </div>
              <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-theme-muted)" }}>Note Moyenne</div>
            </div>
            <div className="w-px" style={{ background: "var(--color-theme-border)" }} />
            <div className="text-center">
              <div className="text-4xl font-black font-mono" style={{ color: "var(--color-theme-accent)" }}>+5K</div>
              <div className="text-[9px] font-bold uppercase tracking-widest mt-2" style={{ color: "var(--color-theme-muted)" }}>Clients Satisfaites</div>
            </div>
            <div className="w-px" style={{ background: "var(--color-theme-border)" }} />
            <div className="text-center">
              <div className="text-4xl font-black font-mono" style={{ color: "var(--color-theme-accent)" }}>100%</div>
              <div className="text-[9px] font-bold uppercase tracking-widest mt-2" style={{ color: "var(--color-theme-muted)" }}>Naturel & Bio</div>
            </div>
          </div>
        </ScrollReveal>

        {/* Testimonial card */}
        <div className="relative">
          <div
            className="rounded-2xl p-8 sm:p-12 border relative overflow-hidden"
            style={{
              background: "var(--color-theme-card)",
              borderColor: "rgba(var(--color-theme-accent-rgb), 0.2)",
              boxShadow: "0 20px 60px rgba(var(--color-theme-accent-rgb), 0.08)"
            }}
          >
            {/* Quote icon */}
            <Quote className="w-10 h-10 absolute top-6 right-8 opacity-10" style={{ color: "var(--color-theme-accent)" }} />

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2"
                  style={{ borderColor: "rgba(var(--color-theme-accent-rgb), 0.3)", background: "rgba(var(--color-theme-accent-rgb), 0.06)" }}
                >
                  {t.emoji}
                </div>
                <div className="flex gap-0.5">
                  {[...Array(t.note)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" style={{ color: "var(--color-theme-accent)" }} />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3 flex-1">
                <div>
                  <span className="font-black text-sm" style={{ color: "var(--color-theme-fg)" }}>{t.nom}</span>
                  <span className="text-[10px] ml-2" style={{ color: "var(--color-theme-muted)" }}>— {t.ville}</span>
                </div>
                <div
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-block"
                  style={{ background: "rgba(var(--color-theme-accent-rgb), 0.1)", color: "var(--color-theme-accent)" }}
                >
                  {t.produit}
                </div>
                <p className="font-serif text-base leading-relaxed italic" style={{ color: "var(--color-theme-fg)", opacity: 0.85 }}>
                  &ldquo;{t.texte}&rdquo;
                </p>
                <div className="text-[9px]" style={{ color: "var(--color-theme-muted)" }}>{t.date}</div>
              </div>
            </div>
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={prev}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              style={{ borderColor: "var(--color-theme-border)", color: "var(--color-theme-muted)", background: "var(--color-theme-card)" }}
            >
              <ChevronLeft className="w-4 h-4" /> Précédent
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TEMOIGNAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setIsAuto(false); setCurrent(i); }}
                  className="rounded-full transition-all cursor-pointer"
                  style={{
                    width: i === current ? "24px" : "8px",
                    height: "8px",
                    background: i === current ? "var(--color-theme-accent)" : "var(--color-theme-border)",
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              style={{ borderColor: "var(--color-theme-border)", color: "var(--color-theme-muted)", background: "var(--color-theme-card)" }}
            >
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
