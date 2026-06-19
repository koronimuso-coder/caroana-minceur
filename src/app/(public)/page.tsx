"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, ShoppingCart, MessageCircle, Sparkles, Instagram, Facebook, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Marquee from "@/components/ui/Marquee";
import RitualQuiz from "@/components/ui/RitualQuiz";
import HydrationCalculator from "@/components/ui/HydrationCalculator";
import CureTracker from "@/components/ui/CureTracker";

export default function HomePage() {
  const [signatureOffset, setSignatureOffset] = useState(600);

  // Animate the signature path offset based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate scroll fraction for signature drawing
      const startDraw = windowHeight * 0.2;
      const endDraw = windowHeight * 0.8;
      
      if (scrollPos > startDraw && scrollPos < endDraw) {
        const fraction = (scrollPos - startDraw) / (endDraw - startDraw);
        setSignatureOffset(600 - fraction * 600);
      } else if (scrollPos <= startDraw) {
        setSignatureOffset(600);
      } else {
        setSignatureOffset(0);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const products = [
    {
      name: "Gélules Ventre Plat",
      slug: "gelules-ventre-plat",
      badge: "Pureté Concentrée",
      price: "15 000 FCFA",
      image: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
      season: "Season 2026",
      desc: "Formule aux extraits de plantes locales pour affiner la silhouette."
    },
    {
      name: "Thé Détox Premium",
      slug: "the-detox",
      badge: "Rituel Énergie",
      price: "8 000 FCFA",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
      season: "Season 2026",
      desc: "Une infusion stimulante alliant Kinkeliba et Citronnelle sauvage."
    },
    {
      name: "Tisane Ventre Plat",
      slug: "tisane-ventre-plat",
      badge: "Sagesse Ancestrale",
      price: "10 000 FCFA",
      image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
      season: "Season 2026",
      desc: "Mélange traditionnel de plantes purifiant l'organisme au naturel."
    },
  ];

  const partners = [
    { name: "100% NATUREL", logo: "100% BIO" },
    { name: "KINKÉLIBA", logo: "KINKÉLIBA" },
    { name: "CITRONNELLE", logo: "CITRONNELLE" },
    { name: "THÉ VERT", logo: "THÉ VERT" },
    { name: "FABRIQUÉ EN CIV", logo: "MADE IN CIV" },
    { name: "SANS ADDITIFS", logo: "SANS ADDITIFS" },
  ];

  return (
    <div className="bg-theme-bg min-h-screen text-theme-fg selection:bg-theme-accent selection:text-theme-bg overflow-hidden transition-colors duration-500">
      
      {/* ================== SECTION 1: HERO CONTAINER (Sticky Background) ================== */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Sticky Background Image */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=1600&auto=format&fit=crop" 
            alt="Caroana Premium Wellness" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-theme-bg via-transparent to-theme-bg/50 transition-colors duration-500" />
        </div>

        {/* Hero content overlay */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-6">
          <ScrollReveal animation="scale-up" duration={1000}>
            <div className="inline-flex items-center space-x-2 bg-theme-fg/5 border border-theme-border px-3 py-1 rounded-full text-[9px] font-bold tracking-widest text-theme-accent uppercase">
              <Sparkles className="w-3 h-3 text-theme-accent" />
              <span>Rituels de Phytothérapie Africaine</span>
            </div>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={200} duration={1000}>
            <h1 className="font-sans text-6xl sm:text-9xl font-black leading-[0.85] tracking-tighter uppercase select-none">
              PURETÉ. <br />
              <span className="text-theme-accent">NATURE.</span> <br />
              HÉRITAGE.
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={400} duration={1000}>
            <p className="text-xs sm:text-sm text-theme-fg/80 max-w-md mx-auto leading-relaxed font-medium pt-4">
              L'excellence du bien-être ancestral ivoirien. Des formulations de plantes pures et actives pour sculpter votre silhouette naturellement.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={650} duration={1000} className="pt-6">
            <Link 
              href="/boutique" 
              className="inline-flex items-center space-x-2 bg-theme-accent text-theme-bg font-bold text-xs uppercase tracking-widest px-8 py-4 rounded hover:bg-theme-accent-hover hover:scale-[1.03] transition-smooth shadow-gold cursor-pointer"
            >
              <span>Accéder à la boutique</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>

        {/* Topographic contours overlay on Hero */}
        <div className="absolute inset-0 pattern-contour opacity-25 pointer-events-none z-5" />
      </section>

      {/* ================== SECTION 2: MESSAGE FROM CAROANA (Signature & Photo overlay) ================== */}
      <section className="relative py-24 sm:py-36 bg-theme-bg w-full flex flex-col items-center justify-center z-20 transition-colors duration-500">
        
        {/* Background Marquee */}
        <div className="w-full pointer-events-none opacity-20 absolute top-1/2 -translate-y-1/2 z-0">
          <Marquee text="CAROANA MINCEUR • RITUELS NATURELS • VENTRE PLAT • " outline speed="medium" />
        </div>

        <div className="max-w-4xl w-full px-6 flex flex-col items-center text-center space-y-12 relative z-10">
          <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-theme-accent bg-theme-accent/5 border border-theme-accent/15 px-3 py-1 rounded-full">
            Notre Philosophie
          </span>

          {/* Central Black & White portrait frame */}
          <div className="relative w-64 h-80 sm:w-80 sm:h-96 rounded-lg overflow-hidden bg-theme-accent-dark border border-theme-border shadow-2xl transition-all duration-700 hover:scale-[1.01] hover:border-theme-accent/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop" 
              alt="Notre rituel bio" 
              className="w-full h-full object-cover grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-smooth"
            />
          </div>

          {/* Giant Neon Signature SVG Overlay */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl pointer-events-none select-none z-20">
            <svg viewBox="0 0 300 90" className="w-full h-auto text-theme-accent fill-none stroke-[2.5] stroke-current">
              <path 
                d="M 20,60 C 40,40 70,10 90,40 C 100,55 80,75 110,60 C 130,50 140,20 150,40 C 160,60 170,70 190,55 C 210,40 220,20 230,45 C 240,70 250,65 270,50" 
                strokeDasharray="600" 
                strokeDashoffset={signatureOffset} 
                style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
              />
            </svg>
          </div>

          <span className="text-[10px] tracking-[0.25em] uppercase text-theme-fg/50 font-bold">Caroana Minceur Signature</span>
        </div>
      </section>

      {/* ================== SECTION 3: LEGACY TYPOGRAPHY ================== */}
      <section className="py-24 sm:py-36 bg-theme-bg border-t border-theme-border z-20 relative transition-colors duration-500">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <ScrollReveal animation="fade-up" duration={1000}>
            <h2 className="font-sans text-4xl sm:text-6xl font-black text-center uppercase tracking-tight leading-[0.95]">
              INTÉGRER LA PURETÉ DES <span className="font-serif italic lowercase text-theme-accent font-normal">plantes</span> DANS VOTRE QUOTIDIEN. DÉFINIR UN <span className="font-serif italic lowercase text-theme-accent font-normal">héritage</span> DE BIEN-ÊTRE <span className="font-serif italic lowercase text-theme-accent font-normal">au jour le jour</span> ET DURABLE.
            </h2>
          </ScrollReveal>
        </div>
      </section>

      {/* ================== SECTION 4: HYDRATION CALCULATOR & ASYMMETRIC GRID GALLERY ================== */}
      <section className="relative py-28 sm:py-40 bg-theme-fg/[0.01] border-y border-theme-border pattern-contour z-20 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 space-y-24 relative z-10">
          
          {/* Hydration Calculator */}
          <ScrollReveal animation="scale-up" className="max-w-4xl mx-auto">
            <HydrationCalculator />
          </ScrollReveal>

          {/* Polaroid Cards Grid */}
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Polaroid 1: Left */}
            <div className="col-span-12 md:col-span-3 space-y-3 justify-self-start md:translate-y-8">
              <ScrollReveal animation="fade-right" className="bg-theme-card border border-theme-border p-4 rounded shadow-2xl hover:border-theme-accent/20 hover:scale-[1.02] transition-smooth">
                <div className="aspect-[3/4] overflow-hidden rounded bg-neutral-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=400&auto=format&fit=crop" 
                    alt="Plantes locales" 
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-smooth"
                  />
                </div>
                <div className="flex justify-between items-center mt-3 text-[8px] font-bold font-mono tracking-widest text-theme-fg/45 uppercase">
                  <span>ABIDJAN, 2026</span>
                  <span>RÉCOLTE KINKÉLIBA</span>
                </div>
              </ScrollReveal>
            </div>

            {/* Center Quote text Block */}
            <div className="col-span-12 md:col-span-6 text-center space-y-6 px-4">
              <ScrollReveal animation="scale-up" className="space-y-6">
                <p className="font-serif text-lg sm:text-2xl text-theme-fg/85 leading-relaxed font-light italic">
                  « Depuis nos débuts, nous sourçons les meilleures plantes locales pour créer des infusions d'exception qui subliment votre corps. Une promesse de légèreté et de santé au naturel. »
                </p>
                
                <div className="flex flex-col items-center">
                  <svg viewBox="0 0 100 40" className="w-20 h-8 text-theme-accent fill-none stroke-[2] stroke-current">
                    <path d="M 10,25 C 20,15 35,5 45,20 C 50,27 40,35 55,27 C 65,22 70,8 75,18 C 80,27 85,32 95,25" />
                  </svg>
                  <span className="text-[7px] font-bold tracking-[0.2em] uppercase text-theme-fg/30">Fondatrice Caroana</span>
                </div>
              </ScrollReveal>
            </div>

            {/* Polaroid 2: Right */}
            <div className="col-span-12 md:col-span-3 space-y-3 justify-self-end md:-translate-y-8">
              <ScrollReveal animation="fade-left" className="bg-theme-card border border-theme-border p-4 rounded shadow-2xl hover:border-theme-accent/20 hover:scale-[1.02] transition-smooth">
                <div className="aspect-[3/4] overflow-hidden rounded bg-neutral-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=400&auto=format&fit=crop" 
                    alt="Rituel Ventre Plat" 
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-smooth"
                  />
                </div>
                <div className="flex justify-between items-center mt-3 text-[8px] font-bold font-mono tracking-widest text-theme-fg/45 uppercase">
                  <span>CÔTE D'IVOIRE</span>
                  <span>GÉLULES VENTRE PLAT</span>
                </div>
              </ScrollReveal>
            </div>
          </div>

        </div>
      </section>

      {/* ================== SECTION: WELLNESS QUIZ ================== */}
      <section className="py-20 bg-theme-bg z-20 relative transition-colors duration-500">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal animation="scale-up">
            <RitualQuiz />
          </ScrollReveal>
        </div>
      </section>

      {/* ================== SECTION: CURE PROGRESS TRACKER ================== */}
      <section className="py-12 bg-theme-bg z-20 relative transition-colors duration-500">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal animation="scale-up">
            <CureTracker />
          </ScrollReveal>
        </div>
      </section>

      {/* ================== SECTION 5: FORMULATIONS GRID (The Lando "Helmets" Cutout Layout) ================== */}
      <section className="py-28 sm:py-40 bg-theme-bg z-20 relative transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          <div className="text-center space-y-3">
            <span className="text-[9px] font-bold tracking-[0.25em] text-theme-accent uppercase">Collections Actives</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-theme-fg uppercase tracking-tight">Nos Formulations Cibles</h2>
            <p className="text-xs text-theme-muted max-w-md mx-auto leading-relaxed">
              Des infusions et gélules conçues pour vous accompagner au quotidien dans votre quête de silhouette et de légèreté.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((p, idx) => (
              <ScrollReveal 
                key={idx}
                animation="fade-up" 
                delay={idx * 150} 
                className="group relative bg-theme-card border border-theme-border rounded-lg overflow-hidden flex flex-col justify-between hover:border-theme-accent/20 hover:shadow-gold transition-all duration-500 h-[65vh] min-h-[480px] p-6 hover-gold-sheen"
              >
                {/* Photo Frame */}
                <div className="relative aspect-square w-full bg-theme-bg border border-theme-border/5 rounded overflow-hidden mb-6 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-smooth"
                  />
                  <span className="absolute top-3 left-3 text-[8px] font-bold uppercase tracking-widest bg-theme-accent text-theme-bg px-2.5 py-0.5 rounded">
                    {p.badge}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3 pb-8">
                  <h3 className="font-serif text-xl font-bold text-theme-fg group-hover:text-theme-accent transition-smooth">
                    {p.name}
                  </h3>
                  <p className="text-xs text-theme-fg/60 leading-relaxed line-clamp-3">
                    {p.desc}
                  </p>
                </div>

                {/* Overlay Diagonal Cutout at bottom right */}
                <div className="absolute bottom-0 right-0 bg-theme-bg border-t border-l border-theme-border rounded-tl-xl px-4 py-2 flex items-center space-x-2 z-20 pointer-events-none group-hover:border-theme-accent/20 transition-colors duration-500">
                  <span className="text-[9px] font-bold text-theme-accent tracking-wide">{p.price}</span>
                  <span className="text-theme-fg/20">|</span>
                  <span className="text-[8px] font-mono text-theme-fg/40 uppercase">Cure 2026</span>
                </div>

                {/* Hover Quick action link */}
                <Link 
                  href={`/produit/${p.slug}`}
                  className="absolute inset-0 z-10 cursor-pointer"
                  aria-label={`Voir ${p.name}`}
                />
              </ScrollReveal>
            ))}
          </div>

          {/* Central Action CTA */}
          <div className="text-center pt-8">
            <ScrollReveal animation="scale-up">
              <Link 
                href="/boutique" 
                className="inline-flex items-center space-x-2 bg-theme-fg/5 border border-theme-border hover:border-theme-accent hover:text-theme-accent text-theme-fg font-bold text-xs uppercase tracking-widest px-8 py-4 rounded transition-smooth cursor-pointer"
              >
                <span>Voir toutes les formulations</span>
                <ArrowUpRight className="w-4.5 h-4.5" />
              </Link>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* ================== SECTION 6: STORE PROMO (Contrast Background) ================== */}
      <section className="relative py-28 sm:py-40 bg-theme-fg text-theme-bg pattern-contour border-y border-theme-border z-20 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-12 relative z-10">
          <div className="space-y-4 max-w-xl">
            <span className="text-[9px] font-bold tracking-[0.25em] text-theme-bg/50 uppercase block">Cures Actives</span>
            <h2 className="font-sans text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none text-theme-bg">
              LE BIEN-ÊTRE NATUREL LIVRÉ DIRECTEMENT CHEZ VOUS.
            </h2>
            <p className="text-xs text-theme-bg/70 leading-relaxed max-w-sm">
              Commandez nos cures et tisanes en ligne. Livraison rapide sur Abidjan et expédition sous 48h dans toute la sous-région.
            </p>
          </div>

          <div>
            <ScrollReveal animation="fade-left">
              <Link 
                href="/boutique" 
                className="inline-flex items-center space-x-2 bg-theme-bg hover:bg-theme-card text-theme-accent hover:scale-[1.02] active:scale-[0.98] font-bold text-xs uppercase tracking-widest px-10 py-5 rounded transition-smooth shadow-2xl cursor-pointer"
              >
                <span>Visiter la boutique</span>
                <ArrowRight className="w-4 h-4 text-theme-accent" />
              </Link>
            </ScrollReveal>
          </div>
        </div>

        {/* Inverse Topography overlays on Light background */}
        <div className="absolute inset-0 bg-theme-bg/[0.02] pointer-events-none z-0" />
      </section>

      {/* ================== SECTION 7: PARTNERS LOGOS ================== */}
      <section className="py-20 bg-theme-bg border-b border-theme-border z-20 relative transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-10">
          <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-theme-fg/30 block">Partenaires Officiels</span>
          
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-8 items-center justify-center opacity-40 hover:opacity-75 transition-smooth">
            {partners.map((p, idx) => (
              <span key={idx} className="text-xs sm:text-sm font-black tracking-widest uppercase font-mono text-theme-fg select-none">
                {p.logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================== SECTION 8: IMMERSIVE FOOTER (Large Helmet/Bottle Centerpiece) ================== */}
      <section className="relative py-28 sm:py-40 bg-theme-bg w-full z-20 flex flex-col items-center justify-center border-b border-theme-border transition-colors duration-500">
        
        {/* Giant centerpiece background photo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop" 
            alt="Flagship Bottle" 
            className="h-[70vh] object-contain"
          />
        </div>

        <div className="max-w-5xl w-full px-6 relative z-10 text-center space-y-16">
          
          {/* Top Always Bringing the fight text */}
          <div className="space-y-4">
            <h2 className="font-sans text-4xl sm:text-7xl font-black uppercase tracking-tighter leading-none">
              GARANTIR TOUJOURS <br />
              LE BIEN-ÊTRE <span className="font-serif italic lowercase text-theme-accent font-normal">le plus pur.</span>
            </h2>
            
            <div className="flex justify-center pt-3">
              <svg viewBox="0 0 100 40" className="w-24 h-10 text-theme-accent fill-none stroke-[2] stroke-current">
                <path d="M 10,25 C 20,15 35,5 45,20 C 50,27 40,35 55,27 C 65,22 70,8 75,18 C 80,27 85,32 95,25" />
              </svg>
            </div>
          </div>

          {/* Footer Grid split links */}
          <div className="grid grid-cols-12 gap-8 text-left pt-16 border-t border-theme-border">
            
            {/* Pages column */}
            <div className="col-span-12 md:col-span-6 space-y-4">
              <span className="text-[8px] font-bold text-theme-fg/30 uppercase tracking-[0.25em] block">Pages</span>
              <ul className="space-y-3 text-sm font-black uppercase tracking-wider">
                <li>
                  <Link href="/" className="hover:text-theme-accent transition-smooth">Accueil</Link>
                </li>
                <li>
                  <Link href="/boutique" className="text-theme-accent hover:text-theme-accent-hover transition-smooth">Boutique</Link>
                </li>
                <li>
                  <Link href="/a-propos" className="hover:text-theme-accent transition-smooth">Philosophie</Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-theme-accent transition-smooth">FAQ</Link>
                </li>
              </ul>
            </div>

            {/* Socials column */}
            <div className="col-span-12 md:col-span-6 space-y-4 md:text-right">
              <span className="text-[8px] font-bold text-theme-fg/30 uppercase tracking-[0.25em] block">Nous suivre</span>
              <ul className="space-y-3 text-sm font-black uppercase tracking-wider">
                <li>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-theme-accent transition-smooth inline-flex items-center space-x-1.5 justify-end"
                  >
                    <span>Instagram</span>
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-theme-accent transition-smooth inline-flex items-center space-x-1.5 justify-end"
                  >
                    <span>Facebook</span>
                    <Facebook className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://wa.me/2250143655088" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-theme-accent transition-smooth inline-flex items-center space-x-1.5 justify-end"
                  >
                    <span>Commande WhatsApp</span>
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
