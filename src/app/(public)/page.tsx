"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ShoppingCart, MessageCircle, Sparkles, Instagram, Facebook, ArrowRight, Leaf, Shield, Zap, Star, ChevronDown } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Marquee from "@/components/ui/Marquee";
import RitualQuiz from "@/components/ui/RitualQuiz";
import HydrationCalculator from "@/components/ui/HydrationCalculator";
import CureTracker from "@/components/ui/CureTracker";

// =====================================================================
// HOOK: Compteur animé
// =====================================================================
function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// =====================================================================
// COMPOSANT: Stat Card animée
// =====================================================================
function StatCard({
  value, label, suffix = "", prefix = "", delay = 0
}: {
  value: number; label: string; suffix?: string; prefix?: string; delay?: number;
}) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, 1600, inView);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { const entry = entries[0]; if (entry?.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="text-center space-y-1 p-6 border rounded-lg transition-all duration-500 hover:border-theme-accent group"
      style={{
        borderColor: "var(--color-theme-border)",
        background: "var(--color-theme-surface)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div
        className="text-3xl sm:text-4xl font-black font-mono stat-number"
        style={{
          color: "var(--color-theme-accent)",
          textShadow: "0 0 20px rgba(var(--color-theme-accent-rgb), 0.4)",
        }}
      >
        {prefix}{count}{suffix}
      </div>
      <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-theme-muted)" }}>
        {label}
      </div>
    </div>
  );
}

// =====================================================================
// COMPOSANT: Ingredient Badge
// =====================================================================
function IngredientBadge({ name, icon }: { name: string; icon?: string }) {
  return (
    <div className="ingredient-badge flex-shrink-0">
      {icon && <span>{icon}</span>}
      <span className="dot" />
      {name}
    </div>
  );
}

// =====================================================================
// COMPOSANT: Parallax Hero
// =====================================================================
function ParallaxHero() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handle = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background with parallax */}
      <div
        className="absolute inset-0 z-0"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=1920&auto=format&fit=crop"
          alt="Caroana Premium Wellness"
          className="w-full h-full object-cover"
          style={{ opacity: 0.45, transform: "scale(1.1)" }}
        />
        {/* Multi-layer gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(var(--color-theme-bg, 7,8,9), 0.6) 0%,
              transparent 30%,
              transparent 60%,
              var(--color-theme-bg) 100%
            )`,
          }}
        />
      </div>

      {/* Ambient glow orbs */}
      <div
        className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(var(--color-theme-accent-rgb), 0.1) 0%, transparent 70%)",
          filter: "blur(50px)",
          animation: "pulse-glow 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(var(--color-theme-accent-rgb), 0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "pulse-glow 8s ease-in-out infinite reverse",
        }}
      />

      {/* Topographic pattern */}
      <div className="absolute inset-0 pattern-contour opacity-20 pointer-events-none z-5" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-7">
        {/* Live badge */}
        <ScrollReveal animation="scale-up" duration={1000}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-bold tracking-widest uppercase"
            style={{
              borderColor: "rgba(var(--color-theme-accent-rgb), 0.3)",
              background: "rgba(var(--color-theme-accent-rgb), 0.06)",
              color: "var(--color-theme-accent)",
            }}>
            <span className="w-1.5 h-1.5 rounded-full bg-current ping-dot" />
            Rituels de Phytothérapie Africaine
            <Sparkles className="w-3 h-3" />
          </div>
        </ScrollReveal>

        {/* Main Headline */}
        <ScrollReveal animation="fade-up" delay={200} duration={1000}>
          <h1 className="font-sans text-5xl sm:text-[7rem] font-black leading-[0.85] tracking-tighter uppercase select-none">
            <span style={{ color: "var(--color-theme-fg)" }}>PURETÉ. </span><br />
            <span style={{ color: "var(--color-theme-accent)", textShadow: "0 0 40px rgba(var(--color-theme-accent-rgb), 0.35)" }}>NATURE.</span>
            <span style={{ color: "var(--color-theme-fg)" }}> <br />HÉRITAGE.</span>
          </h1>
        </ScrollReveal>

        {/* Tagline */}
        <ScrollReveal animation="fade-up" delay={400} duration={1000}>
          <p className="text-sm max-w-md mx-auto leading-relaxed font-medium pt-2"
            style={{ color: "var(--color-theme-muted)" }}>
            L&apos;excellence du bien-être ancestral ivoirien. Des formulations de plantes pures et actives pour sculpter votre silhouette naturellement.
          </p>
        </ScrollReveal>

        {/* CTAs */}
        <ScrollReveal animation="fade-up" delay={600} duration={1000} className="flex flex-wrap gap-4 justify-center pt-4">
          <Link
            href="/boutique"
            className="btn-accent inline-flex items-center gap-2 px-8 py-4 rounded text-xs font-bold uppercase tracking-widest"
          >
            <span>Accéder à la boutique</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/boutique"
            className="btn-outline inline-flex items-center gap-2 px-8 py-4 rounded text-xs font-bold uppercase tracking-widest"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Nos formulations</span>
          </Link>
        </ScrollReveal>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        style={{ color: "var(--color-theme-accent)", animation: "bounce-soft 2s ease-in-out infinite" }}
      >
        <span className="text-[8px] font-bold tracking-widest uppercase" style={{ color: "var(--color-theme-muted)" }}>Défiler</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  );
}

// =====================================================================
// COMPOSANT: Stats Section
// =====================================================================
function StatsSection() {
  return (
    <section className="py-16 border-y relative overflow-hidden" style={{ borderColor: "var(--color-theme-border)", background: "var(--color-theme-surface)" }}>
      {/* Dots background */}
      <div className="absolute inset-0 pattern-mesh opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <ScrollReveal animation="fade-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <StatCard value={5000} label="Clients satisfaits" suffix="+" delay={0} />
            <StatCard value={100} label="Naturel & Bio" suffix="%" delay={100} />
            <StatCard value={14} label="Jours de cure" suffix="j" delay={200} />
            <StatCard value={3} label="Formulations actives" delay={300} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// =====================================================================
// PAGE PRINCIPALE
// =====================================================================
export default function HomePage() {
  const [signatureOffset, setSignatureOffset] = useState(600);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      const startDraw = windowHeight * 0.15;
      const endDraw = windowHeight * 0.85;
      if (scrollPos > startDraw && scrollPos < endDraw) {
        const fraction = (scrollPos - startDraw) / (endDraw - startDraw);
        setSignatureOffset(600 - fraction * 600);
      } else if (scrollPos <= startDraw) {
        setSignatureOffset(600);
      } else {
        setSignatureOffset(0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const products = [
    {
      name: "Gélules Ventre Plat",
      slug: "gelules-ventre-plat",
      badge: "Pureté Concentrée",
      price: "15 000 FCFA",
      image: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
      desc: "Formule aux extraits de plantes locales pour affiner la silhouette.",
      icon: "🌿",
    },
    {
      name: "Thé Détox Premium",
      slug: "the-detox",
      badge: "Rituel Énergie",
      price: "8 000 FCFA",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
      desc: "Une infusion stimulante alliant Kinkéliba et Citronnelle sauvage.",
      icon: "🍃",
    },
    {
      name: "Tisane Ventre Plat",
      slug: "tisane-ventre-plat",
      badge: "Sagesse Ancestrale",
      price: "10 000 FCFA",
      image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
      desc: "Mélange traditionnel de plantes purifiant l'organisme au naturel.",
      icon: "🌱",
    },
  ];

  const ingredients = [
    { name: "100% NATUREL", icon: "🌿" },
    { name: "KINKÉLIBA", icon: "🍂" },
    { name: "CITRONNELLE SAUVAGE", icon: "🌾" },
    { name: "THÉ VERT", icon: "🍵" },
    { name: "GINGEMBRE", icon: "🫚" },
    { name: "SÉNÉ", icon: "🌱" },
    { name: "SANS ADDITIFS", icon: "✦" },
    { name: "FABRIQUÉ EN CIV", icon: "🇨🇮" },
    { name: "MENTHE POIVRÉE", icon: "🌿" },
    { name: "SPIRULINE", icon: "💚" },
  ];

  const values = [
    { icon: <Leaf className="w-5 h-5" />, title: "100% Naturel", desc: "Plantes sélectionnées à la source, sans additifs ni conservateurs chimiques." },
    { icon: <Shield className="w-5 h-5" />, title: "Qualité Certifiée", desc: "Chaque formule est testée et validée selon des protocoles stricts." },
    { icon: <Zap className="w-5 h-5" />, title: "Résultats Visibles", desc: "Efficacité prouvée dès les premiers jours de votre cure." },
    { icon: <Star className="w-5 h-5" />, title: "Tradition Africaine", desc: "Savoirs ancestraux ivoiriens transmis et modernisés avec soin." },
  ];

  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{ background: "var(--color-theme-bg)", color: "var(--color-theme-fg)" }}
    >
      {/* ====== HERO ====== */}
      <ParallaxHero />

      {/* ====== STATS ====== */}
      <StatsSection />

      {/* ====== SECTION 2: PHILOSOPHIE + SIGNATURE ====== */}
      <section className="relative py-28 sm:py-40 overflow-hidden" style={{ background: "var(--color-theme-bg)" }}>
        {/* Background marquee */}
        <div className="w-full pointer-events-none opacity-[0.06] absolute top-1/2 -translate-y-1/2 z-0 select-none">
          <Marquee text="CAROANA MINCEUR • RITUELS NATURELS • VENTRE PLAT • PHYTOTHÉRAPIE • " outline speed="medium" />
        </div>

        {/* Ambient glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(var(--color-theme-accent-rgb), 0.05) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div className="max-w-4xl w-full mx-auto px-6 flex flex-col items-center text-center space-y-14 relative z-10">
          <ScrollReveal animation="scale-up">
            <span
              className="text-[9px] font-bold tracking-[0.35em] uppercase px-4 py-1.5 rounded-full border"
              style={{
                color: "var(--color-theme-accent)",
                borderColor: "rgba(var(--color-theme-accent-rgb), 0.3)",
                background: "rgba(var(--color-theme-accent-rgb), 0.06)",
              }}
            >
              Notre Philosophie
            </span>
          </ScrollReveal>

          {/* Portrait photo avec cadre lumineux */}
          <ScrollReveal animation="scale-up" delay={100}>
            <div
              className="relative w-64 h-80 sm:w-80 sm:h-96 rounded-xl overflow-hidden shadow-2xl group cursor-pointer"
              style={{
                border: "1px solid rgba(var(--color-theme-accent-rgb), 0.15)",
                transition: "all 0.6s ease",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop"
                alt="Notre rituel bio"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                style={{ filter: "grayscale(30%)", opacity: 0.85 }}
              />
              {/* Luminosity overlay on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(135deg, rgba(var(--color-theme-accent-rgb), 0.12) 0%, transparent 60%)",
                }}
              />
              {/* Badge inside photo */}
              <div
                className="absolute bottom-3 left-3 right-3 text-center text-[8px] font-bold uppercase tracking-widest py-1 rounded"
                style={{
                  background: "rgba(var(--color-theme-bg, 7,8,9), 0.8)",
                  color: "var(--color-theme-accent)",
                  backdropFilter: "blur(8px)",
                }}
              >
                Rituels Botaniques — Abidjan
              </div>
            </div>
          </ScrollReveal>

          {/* Animated SVG Signature Overlay */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg pointer-events-none select-none z-20">
            <svg
              viewBox="0 0 300 90"
              className="w-full h-auto"
              fill="none"
              style={{ stroke: "var(--color-theme-accent)", strokeWidth: 2.5, opacity: 0.7 }}
            >
              <path
                d="M 20,60 C 40,40 70,10 90,40 C 100,55 80,75 110,60 C 130,50 140,20 150,40 C 160,60 170,70 190,55 C 210,40 220,20 230,45 C 240,70 250,65 270,50"
                strokeDasharray="600"
                strokeDashoffset={signatureOffset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
              />
            </svg>
          </div>

          {/* Quote */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="max-w-2xl space-y-4">
              <p
                className="font-serif text-lg sm:text-2xl leading-relaxed font-light italic"
                style={{ color: "var(--color-theme-fg)", opacity: 0.85 }}
              >
                « Depuis nos débuts, nous sourçons les meilleures plantes locales pour créer des infusions d&apos;exception qui subliment votre corps. Une promesse de légèreté et de santé au naturel. »
              </p>
              <div className="flex flex-col items-center gap-2 pt-2">
                <svg viewBox="0 0 100 40" className="w-20 h-8" fill="none" style={{ stroke: "var(--color-theme-accent)", strokeWidth: 2.2 }}>
                  <path d="M 10,25 C 20,15 35,5 45,20 C 50,27 40,35 55,27 C 65,22 70,8 75,18 C 80,27 85,32 95,25" strokeLinecap="round" />
                </svg>
                <span className="text-[8px] font-bold tracking-[0.25em] uppercase" style={{ color: "var(--color-theme-muted)" }}>
                  Fondatrice Caroana
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ====== SECTION 3: VALEURS ====== */}
      <section className="py-20 border-t relative" style={{ borderColor: "var(--color-theme-border)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal animation="fade-up">
            <div className="text-center space-y-3 mb-14">
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: "var(--color-theme-accent)" }}>Nos Engagements</span>
              <h2
                className="font-sans text-3xl sm:text-5xl font-black uppercase tracking-tight"
                style={{ color: "var(--color-theme-fg)" }}
              >
                INTÉGRER LA PURETÉ DES{" "}
                <span className="font-serif italic lowercase font-normal" style={{ color: "var(--color-theme-accent)" }}>plantes</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 100}>
                <div
                  className="p-6 rounded-xl border space-y-3 group glow-on-hover cursor-default"
                  style={{
                    background: "var(--color-theme-surface, rgba(var(--color-theme-accent-rgb), 0.03))",
                    borderColor: "var(--color-theme-border)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: "rgba(var(--color-theme-accent-rgb), 0.1)",
                      color: "var(--color-theme-accent)",
                    }}
                  >
                    {v.icon}
                  </div>
                  <h3 className="font-sans font-black text-sm uppercase tracking-wider" style={{ color: "var(--color-theme-fg)" }}>
                    {v.title}
                  </h3>
                  <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-theme-muted)" }}>
                    {v.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SECTION 4: INGREDIENTS TICKER ====== */}
      <section
        className="py-12 border-y overflow-hidden"
        style={{ borderColor: "var(--color-theme-border)", background: "var(--color-theme-surface, rgba(var(--color-theme-accent-rgb), 0.02))" }}
      >
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="text-center">
            <span className="text-[8px] font-bold tracking-[0.35em] uppercase" style={{ color: "var(--color-theme-muted)" }}>
              Ingrédients actifs sélectionnés
            </span>
          </div>
          {/* Ticker */}
          <div className="relative overflow-hidden">
            <div className="flex gap-4 animate-marquee-medium">
              {[...ingredients, ...ingredients].map((ing, i) => (
                <IngredientBadge key={i} name={ing.name} icon={ing.icon} />
              ))}
            </div>
          </div>
          {/* Second ticker reverse */}
          <div className="relative overflow-hidden">
            <div className="flex gap-4 animate-marquee-medium direction-reverse">
              {[...ingredients, ...ingredients].reverse().map((ing, i) => (
                <IngredientBadge key={i} name={ing.name} icon={ing.icon} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== SECTION 5: CALCULATEUR + GALERIE ====== */}
      <section
        className="relative py-28 sm:py-40 border-y pattern-contour"
        style={{ borderColor: "var(--color-theme-border)", background: "var(--color-theme-bg)" }}
      >
        <div className="max-w-7xl mx-auto px-6 space-y-24 relative z-10">
          <ScrollReveal animation="scale-up" className="max-w-4xl mx-auto">
            <HydrationCalculator />
          </ScrollReveal>

          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-12 md:col-span-3 space-y-3 justify-self-start md:translate-y-8">
              <ScrollReveal animation="fade-right">
                <div
                  className="bg-theme-card border p-4 rounded-lg shadow-2xl glow-on-hover tilt-card"
                  style={{ borderColor: "var(--color-theme-border)", background: "var(--color-theme-card)" }}
                >
                  <div className="aspect-[3/4] overflow-hidden rounded bg-neutral-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=400&auto=format&fit=crop"
                      alt="Plantes locales"
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-smooth"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-3 text-[8px] font-bold font-mono tracking-widest uppercase"
                    style={{ color: "var(--color-theme-muted)" }}>
                    <span>ABIDJAN, 2026</span>
                    <span>RÉCOLTE KINKÉLIBA</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="col-span-12 md:col-span-6 text-center space-y-6 px-4">
              <ScrollReveal animation="scale-up">
                <p
                  className="font-serif text-lg sm:text-2xl leading-relaxed font-light italic"
                  style={{ color: "var(--color-theme-fg)", opacity: 0.85 }}
                >
                  « Depuis nos débuts, nous sourçons les meilleures plantes locales pour créer des infusions d&apos;exception qui subliment votre corps. »
                </p>
                <div className="flex flex-col items-center mt-4">
                  <svg viewBox="0 0 100 40" className="w-20 h-8" fill="none" style={{ stroke: "var(--color-theme-accent)", strokeWidth: 2 }}>
                    <path d="M 10,25 C 20,15 35,5 45,20 C 50,27 40,35 55,27 C 65,22 70,8 75,18 C 80,27 85,32 95,25" strokeLinecap="round" />
                  </svg>
                  <span className="text-[7px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--color-theme-muted)" }}>
                    Fondatrice Caroana
                  </span>
                </div>
              </ScrollReveal>
            </div>

            <div className="col-span-12 md:col-span-3 space-y-3 justify-self-end md:-translate-y-8">
              <ScrollReveal animation="fade-left">
                <div
                  className="p-4 rounded-lg shadow-2xl glow-on-hover tilt-card"
                  style={{ borderColor: "var(--color-theme-border)", background: "var(--color-theme-card)", border: "1px solid var(--color-theme-border)" }}
                >
                  <div className="aspect-[3/4] overflow-hidden rounded bg-neutral-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=400&auto=format&fit=crop"
                      alt="Rituel Ventre Plat"
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-smooth"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-3 text-[8px] font-bold font-mono tracking-widest uppercase"
                    style={{ color: "var(--color-theme-muted)" }}>
                    <span>CÔTE D&apos;IVOIRE</span>
                    <span>GÉLULES VENTRE PLAT</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ====== SECTION 6: QUIZ BIEN-ÊTRE ====== */}
      <section className="py-20" style={{ background: "var(--color-theme-bg)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal animation="scale-up">
            <RitualQuiz />
          </ScrollReveal>
        </div>
      </section>

      {/* ====== SECTION 7: CURE TRACKER ====== */}
      <section className="py-12" style={{ background: "var(--color-theme-bg)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal animation="scale-up">
            <CureTracker />
          </ScrollReveal>
        </div>
      </section>

      {/* ====== SECTION 8: PRODUITS ====== */}
      <section
        className="py-28 sm:py-40 border-t relative"
        style={{ borderColor: "var(--color-theme-border)", background: "var(--color-theme-bg)" }}
      >
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-3">
            <ScrollReveal animation="fade-up">
              <span className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: "var(--color-theme-accent)" }}>Collections Actives</span>
              <h2 className="font-serif text-3xl sm:text-5xl font-black uppercase tracking-tight mt-2"
                style={{ color: "var(--color-theme-fg)" }}>
                Nos Formulations Cibles
              </h2>
              <p className="text-xs max-w-md mx-auto leading-relaxed mt-3" style={{ color: "var(--color-theme-muted)" }}>
                Des infusions et gélules conçues pour vous accompagner au quotidien dans votre quête de silhouette et de légèreté.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((p, idx) => (
              <ScrollReveal
                key={idx}
                animation="fade-up"
                delay={idx * 150}
                className="group relative rounded-xl overflow-hidden flex flex-col justify-between hover-gold-sheen tilt-card card-depth"
                style={{
                  background: "var(--color-theme-card)",
                  border: "1px solid var(--color-theme-border)",
                  height: "65vh",
                  minHeight: "480px",
                  padding: "1.5rem",
                }}
              >
                <div
                  className="relative aspect-square w-full rounded-lg overflow-hidden mb-6 shadow-inner"
                  style={{ background: "var(--color-theme-bg)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    style={{ opacity: 0.82 }}
                  />
                  {/* Glow overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(to top, rgba(var(--color-theme-accent-rgb), 0.12) 0%, transparent 50%)" }}
                  />
                  <span
                    className="absolute top-3 left-3 text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded"
                    style={{ background: "var(--color-theme-accent)", color: "var(--color-theme-bg)" }}
                  >
                    {p.badge}
                  </span>
                  <span className="absolute top-3 right-3 text-lg">{p.icon}</span>
                </div>

                <div className="space-y-3 pb-10">
                  <h3
                    className="font-serif text-xl font-bold transition-colors duration-300"
                    style={{ color: "var(--color-theme-fg)" }}
                  >
                    {p.name}
                  </h3>
                  <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "var(--color-theme-muted)" }}>
                    {p.desc}
                  </p>
                </div>

                {/* Price tag */}
                <div
                  className="absolute bottom-0 right-0 px-4 py-2 flex items-center gap-2 rounded-tl-xl z-20"
                  style={{
                    background: "var(--color-theme-bg)",
                    borderTop: "1px solid var(--color-theme-border)",
                    borderLeft: "1px solid var(--color-theme-border)",
                  }}
                >
                  <span className="text-[9px] font-bold" style={{ color: "var(--color-theme-accent)" }}>{p.price}</span>
                  <span style={{ color: "var(--color-theme-border)" }}>|</span>
                  <span className="text-[8px] font-mono uppercase" style={{ color: "var(--color-theme-muted)" }}>Cure 2026</span>
                </div>

                <Link href={`/produit/${p.slug}`} className="absolute inset-0 z-10 cursor-pointer" aria-label={`Voir ${p.name}`} />
              </ScrollReveal>
            ))}
          </div>

          <div className="text-center pt-8">
            <ScrollReveal animation="scale-up">
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-widest px-8 py-4 rounded border transition-all duration-300"
                style={{
                  background: "transparent",
                  borderColor: "var(--color-theme-border)",
                  color: "var(--color-theme-fg)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--color-theme-accent)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-theme-accent)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--color-theme-border)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-theme-fg)";
                }}
              >
                <span>Voir toutes les formulations</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ====== SECTION 9: PROMO STORE (Inversé) ====== */}
      <section
        className="relative py-28 sm:py-40 border-y pattern-contour overflow-hidden"
        style={{
          background: "var(--color-theme-fg)",
          color: "var(--color-theme-bg)",
          borderColor: "var(--color-theme-border)",
        }}
      >
        {/* Animated background glows */}
        <div
          className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(var(--color-theme-accent-rgb), 0.12) 0%, transparent 70%)",
            filter: "blur(50px)",
            animation: "pulse-glow 5s ease-in-out infinite",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-12 relative z-10">
          <div className="space-y-5 max-w-xl">
            <span className="text-[9px] font-bold tracking-[0.25em] uppercase block" style={{ opacity: 0.5 }}>
              Cures Actives
            </span>
            <h2 className="font-sans text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none">
              LE BIEN-ÊTRE NATUREL<br />
              <span style={{ color: "var(--color-theme-accent)" }}>LIVRÉ CHEZ VOUS.</span>
            </h2>
            <p className="text-xs leading-relaxed max-w-sm" style={{ opacity: 0.7 }}>
              Commandez nos cures et tisanes en ligne. Livraison rapide sur Abidjan et expédition sous 48h dans toute la sous-région.
            </p>
            <div className="flex gap-3 pt-2">
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider">
                <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-theme-accent)", animation: "ping-soft 2s infinite" }} />
                Livraison rapide
              </div>
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider">
                <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-theme-accent)" }} />
                Paiement sécurisé
              </div>
            </div>
          </div>

          <ScrollReveal animation="fade-left">
            <div className="flex flex-col gap-4">
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-widest px-10 py-5 rounded transition-all duration-300"
                style={{
                  background: "var(--color-theme-accent)",
                  color: "var(--color-theme-bg)",
                }}
              >
                <span>Visiter la boutique</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/2250143655088"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-widest px-10 py-4 rounded border transition-all duration-300"
                style={{
                  borderColor: "currentColor",
                  opacity: 0.6,
                }}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Commander sur WhatsApp</span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ====== SECTION 10: FOOTER + LARGE CTA ====== */}
      <section
        className="relative py-28 sm:py-40 border-b overflow-hidden"
        style={{ background: "var(--color-theme-bg)", borderColor: "var(--color-theme-border)" }}
      >
        {/* Giant background product */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop"
            alt="Flagship Bottle"
            className="h-[70vh] object-contain"
          />
        </div>

        {/* Glow at center */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <div
            className="w-96 h-96 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(var(--color-theme-accent-rgb), 0.06) 0%, transparent 70%)",
              filter: "blur(60px)",
              animation: "pulse-glow 7s ease-in-out infinite",
            }}
          />
        </div>

        <div className="max-w-5xl w-full mx-auto px-6 relative z-10 text-center space-y-16">
          <div className="space-y-4">
            <h2
              className="font-sans text-4xl sm:text-7xl font-black uppercase tracking-tighter leading-none"
              style={{ color: "var(--color-theme-fg)" }}
            >
              GARANTIR TOUJOURS<br />
              LE BIEN-ÊTRE{" "}
              <span className="font-serif italic lowercase font-normal" style={{ color: "var(--color-theme-accent)", textShadow: "0 0 30px rgba(var(--color-theme-accent-rgb), 0.4)" }}>
                le plus pur.
              </span>
            </h2>
            <div className="flex justify-center pt-3">
              <svg viewBox="0 0 100 40" className="w-24 h-10" fill="none" style={{ stroke: "var(--color-theme-accent)", strokeWidth: 2 }}>
                <path d="M 10,25 C 20,15 35,5 45,20 C 50,27 40,35 55,27 C 65,22 70,8 75,18 C 80,27 85,32 95,25" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div
            className="grid grid-cols-12 gap-8 text-left pt-16"
            style={{ borderTop: "1px solid var(--color-theme-border)" }}
          >
            <div className="col-span-12 md:col-span-6 space-y-4">
              <span className="text-[8px] font-bold uppercase tracking-[0.25em] block" style={{ color: "var(--color-theme-muted)" }}>Pages</span>
              <ul className="space-y-3 text-sm font-black uppercase tracking-wider">
                {[
                  { href: "/", label: "Accueil" },
                  { href: "/boutique", label: "Boutique", accent: true },
                  { href: "/a-propos", label: "Philosophie" },
                  { href: "/faq", label: "FAQ" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="transition-smooth hover:opacity-100"
                      style={{ color: item.accent ? "var(--color-theme-accent)" : "var(--color-theme-fg)", opacity: item.accent ? 1 : 0.7 }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-12 md:col-span-6 space-y-4 md:text-right">
              <span className="text-[8px] font-bold uppercase tracking-[0.25em] block" style={{ color: "var(--color-theme-muted)" }}>Nous suivre</span>
              <ul className="space-y-3 text-sm font-black uppercase tracking-wider">
                {[
                  { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
                  { href: "https://facebook.com", label: "Facebook", Icon: Facebook },
                  { href: "https://wa.me/2250143655088", label: "Commande WhatsApp", Icon: MessageCircle },
                ].map(({ href, label, Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 justify-end transition-smooth hover:opacity-100"
                      style={{ color: "var(--color-theme-fg)", opacity: 0.7 }}
                    >
                      <span>{label}</span>
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
