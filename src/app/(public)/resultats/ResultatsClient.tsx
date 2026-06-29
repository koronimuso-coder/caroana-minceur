"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Star, ChevronLeft, ChevronRight, HelpCircle, ArrowRight, MessageSquareQuote, Check } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Testimonial {
  id: string;
  name: string;
  age: number;
  city: string;
  loss: string;
  duration: string;
  product: string;
  quote: string;
  fullStory: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "awa",
    name: "Awa",
    age: 28,
    city: "Abidjan (Plateau)",
    loss: "-6 kg",
    duration: "14 jours",
    product: "Pack Gélules + Thé Détox",
    quote: "J'ai dégonflé en un temps record ! Mon ventre n'a jamais été aussi plat.",
    fullStory: "Après avoir accumulé du stress et des ballonnements ces derniers mois, j'ai commencé le Défi 14 Jours avec le Pack Gélules + Thé Détox. En 5 jours, l'effet ballonnement avait disparu. À la fin de la cure de 14 jours, j'avais perdu 6 kg de graisses abdominales et d'eau accumulée."
  },
  {
    id: "marie",
    name: "Marie-Noëlle",
    age: 32,
    city: "Yamoussoukro",
    loss: "Fermeté retrouvée",
    duration: "1 mois",
    product: "Pack Complet Nourrice",
    quote: "Spécialement adapté pour les mamans, mon ventre s'est raffermi après bébé.",
    fullStory: "J'avais beaucoup d'appréhension à l'idée de faire une cure minceur pendant l'allaitement. La gamme Nourrice de Caroana a changé ma vie. Les gélules et la tisane n'ont pas du tout affecté mon lait, et le soin traditionnel de caolin a raffermi la peau distendue de mon ventre."
  },
  {
    id: "fatou",
    name: "Fatou",
    age: 24,
    city: "Bouaké",
    loss: "-9 kg",
    duration: "1 semaine",
    product: "Pack Gélules Skinny + Tisane Minceur",
    quote: "Perte de poids express avant mon mariage. Les gélules Skinny sont redoutables.",
    fullStory: "Il me restait moins de deux semaines avant mon mariage et ma robe me serrait encore trop. J'ai pris la cure express Skinny. J'ai été très assidue sur l'hydratation (2.5L par jour). Les résultats sont allés bien au-delà de mes attentes : -9 kg et une robe qui fermait à la perfection !"
  },
  {
    id: "aminata",
    name: "Aminata",
    age: 35,
    city: "San Pedro",
    loss: "-14 kg",
    duration: "1 mois",
    product: "Pack Minceur Kaylie Complet",
    quote: "Une cure premium qui vaut chaque franc CFA. Transformation radicale.",
    fullStory: "Après mes grossesses successives, je n'arrivais plus à me débarrasser de mes kilos superflus. J'ai choisi la cure premium Kaylie d'un mois. C'est le meilleur investissement que j'ai fait pour ma santé. J'ai affiné ma silhouette de manière globale et je me sens pleine de vitalité."
  }
];

export default function ResultatsClient() {
  const [sliderPos, setSliderPos] = useState(50);
  const [selectedLoss, setSelectedLoss] = useState("all");
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Mouse / Touch Event Handlers for Before/After Slider
  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    const touch = e.touches[0];
    if (touch) handleMove(touch.clientX);
  };

  const handleStart = () => {
    isDragging.current = true;
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchend", handleEnd);
    return () => {
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchend", handleEnd);
    };
  }, []);

  const filteredTestimonials = TESTIMONIALS.filter((t) => {
    if (selectedLoss === "all") return true;
    if (selectedLoss === "fast") return t.duration === "14 jours" || t.duration === "1 semaine";
    if (selectedLoss === "deep") return t.duration === "1 mois";
    return true;
  });

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <ScrollReveal animation="scale-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-bold tracking-widest uppercase"
            style={{
              borderColor: "rgba(var(--color-theme-accent-rgb), 0.3)",
              background: "rgba(var(--color-theme-accent-rgb), 0.05)",
              color: "var(--color-theme-accent)",
            }}>
            <Sparkles className="w-3 h-3 text-theme-accent" />
            Preuve Sociale
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={100}>
          <h1 className="font-serif text-4xl sm:text-6xl font-black text-theme-fg uppercase leading-tight">
            Résultats & <span className="text-theme-accent">Témoignages</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <p className="text-sm text-theme-muted leading-relaxed font-medium">
            Découvrez les transformations physiques et les récits authentiques de nos clientes. De l&apos;élimination des gonflements abdominaux à la perte de poids ciblée, le naturel fait ses preuves.
          </p>
        </ScrollReveal>
      </div>

      {/* BEFORE / AFTER INTERACTIVE SLIDER */}
      <div className="max-w-3xl mx-auto bg-theme-surface border border-theme-border rounded-2xl overflow-hidden shadow-premium p-6 space-y-4">
        <div className="flex justify-between items-center text-xs font-bold uppercase pb-2 border-b border-theme-border/40">
          <span>Comparaison interactive</span>
          <span className="text-theme-accent">Glissez le curseur central ➔</span>
        </div>

        <div
          ref={sliderRef}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          onMouseMove={(e) => handleMouseMove(e.nativeEvent)}
          onTouchMove={(e) => handleTouchMove(e.nativeEvent)}
          className="relative h-96 w-full select-none overflow-hidden rounded-xl border border-theme-border/60 cursor-ew-resize bg-forest-dark"
        >
          {/* Before Image (Background) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop"
            alt="Avant Caroana"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none filter grayscale opacity-70"
          />
          <div className="absolute bottom-4 left-4 bg-red-500/80 text-white font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow">
            Avant cure
          </div>

          {/* After Image (Overlay container) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPos}%` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop"
              alt="Après Caroana"
              className="absolute inset-0 w-full h-full object-cover filter brightness-110 contrast-105"
              style={{ width: sliderRef.current?.getBoundingClientRect().width }}
            />
            <div className="absolute bottom-4 left-4 bg-theme-accent text-theme-bg font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow whitespace-nowrap">
              Après 14 jours ✨
            </div>
          </div>

          {/* Drag Handle Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-theme-accent cursor-ew-resize flex items-center justify-center"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-theme-accent border border-theme-surface shadow-2xl flex items-center justify-center text-theme-bg text-xs font-bold font-mono">
              ↔
            </div>
          </div>
        </div>

        <p className="text-[10px] text-theme-muted text-center italic">
          Rendu d&apos;illustration de transformation silhouette. Les résultats individuels peuvent varier selon la rigueur du rituel et l&apos;alimentation.
        </p>
      </div>

      {/* CLIENT TESTIMONIALS SECTION */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-theme-border/40 pb-4">
          <h2 className="font-serif text-2xl font-bold uppercase">Histoires de Réussite</h2>

          {/* Filtering tabs */}
          <div className="flex gap-2">
            {[
              { id: "all", label: "Toutes les histoires" },
              { id: "fast", label: "Cures Rapides (7-14j)" },
              { id: "deep", label: "Cures Longues (1 mois)" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedLoss(tab.id)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                  selectedLoss === tab.id
                    ? "bg-theme-accent border-theme-accent text-theme-bg"
                    : "bg-theme-surface border-theme-border text-theme-muted hover:text-theme-fg hover:border-theme-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTestimonials.map((t, index) => (
            <ScrollReveal
              key={t.id}
              animation="fade-up"
              delay={index * 100}
              className="bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-premium flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Header card with details */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-lg font-bold">{t.name}</h3>
                    <p className="text-[10px] text-theme-muted">
                      {t.age} ans · {t.city}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="bg-theme-accent/15 text-theme-accent font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                      {t.loss}
                    </span>
                    <span className="text-[9px] text-theme-muted uppercase tracking-widest mt-1 font-semibold">
                      Durée : {t.duration}
                    </span>
                  </div>
                </div>

                {/* Stars and product badge */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-theme-muted">
                    📦 {t.product}
                  </span>
                </div>

                {/* Quote */}
                <div className="relative pl-6 border-l-2 border-theme-accent/55 py-1">
                  <p className="italic text-xs font-semibold text-theme-fg">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                {/* Full story */}
                <p className="text-xs text-theme-muted leading-relaxed font-medium">
                  {t.fullStory}
                </p>
              </div>

              {/* Verified Badge */}
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-theme-accent font-bold pt-2 border-t border-theme-border/40">
                <div className="w-4 h-4 bg-theme-accent/15 rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>Achat & Résultat Vérifié</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Call to Actions bottom card */}
      <div className="bg-forest-dark border border-theme-border rounded-3xl p-8 md:p-12 text-center space-y-6 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-theme-accent/10 blur-[60px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-theme-accent/5 blur-[50px]" />

        <div className="relative z-10 space-y-4">
          <h3 className="font-serif text-2xl sm:text-4xl font-black uppercase text-white">
            Prête à entamer votre <span className="text-theme-accent">Transformation</span> ?
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Faites le premier pas en réalisant votre bilan minceur personnalisé ou composez votre routine sur-mesure.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link href="/bilan-minceur" className="btn-accent px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              Réaliser mon bilan gratuit <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/routine-perso" className="bg-theme-surface border border-theme-border text-theme-fg hover:border-theme-accent px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
              Créer ma routine sur-mesure
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
