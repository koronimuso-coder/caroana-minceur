"use client";

import { Leaf, Heart, Shield, Sparkles, Star, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Link from "next/link";

const VALEURS = [
  {
    icon: "🌿",
    title: "100% Naturel",
    desc: "Chaque formule est élaborée exclusivement à partir de plantes africaines récoltées à la source, sans aucun additif chimique ni conservateur artificiel.",
  },
  {
    icon: "🇨🇮",
    title: "Made in Côte d'Ivoire",
    desc: "Fières de nos racines, nos produits sont entièrement formulés et fabriqués en Côte d'Ivoire par des herboristes passionnés.",
  },
  {
    icon: "💚",
    title: "Efficacité Prouvée",
    desc: "Plus de 5 000 clientes satisfaites. Nos formules ancestrales, revisitées par la phytothérapie moderne, livrent des résultats visibles et durables.",
  },
  {
    icon: "🤝",
    title: "Service Client Premium",
    desc: "Conseil personnalisé, suivi de commande, réponse sous 15 minutes sur WhatsApp. Votre satisfaction est notre priorité absolue.",
  },
];

const STORY_STEPS = [
  {
    year: "2019",
    title: "La Naissance",
    desc: "Caroana Minceur naît de la passion d'une herboriste ivoirienne pour les plantes médicinales africaines. L'idée : rendre accessible à toutes les femmes les secrets de beauté et de minceur des grand-mères.",
  },
  {
    year: "2021",
    title: "Les Premières Formules",
    desc: "Après 2 ans de recherche et d'essais, nos premières gélules ventre plat et tisanes détox voient le jour. Les premiers résultats sur notre communauté sont immédiatement positifs.",
  },
  {
    year: "2023",
    title: "L'Expansion",
    desc: "Lancement des Gélules Kaylie et Skinny — nos formules signature les plus puissantes. La gamme s'enrichit pour répondre à tous les objectifs et budgets.",
  },
  {
    year: "2026",
    title: "Aujourd'hui",
    desc: "Plus de 5 000 clientes actives à Abidjan et dans toute la Côte d'Ivoire. La boutique en ligne facilite les commandes et la livraison partout.",
  },
];

const INGREDIENTS = [
  { name: "Kinkéliba", desc: "Drainage & énergie", emoji: "🌱" },
  { name: "Citronnelle", desc: "Digestion & légèreté", emoji: "🍃" },
  { name: "Gingembre", desc: "Brûle-graisses naturel", emoji: "🫚" },
  { name: "Moringa", desc: "Nutriments & vitalité", emoji: "🌿" },
  { name: "Séné", desc: "Transit & détox", emoji: "🍀" },
  { name: "Hibiscus", desc: "Antioxydant & beauté", emoji: "🌺" },
];

export default function AProposClient() {
  return (
    <div className="pt-16 min-h-screen" style={{ background: "var(--color-theme-bg)", color: "var(--color-theme-fg)" }}>

      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden py-28 border-b" style={{ borderColor: "var(--color-theme-border)" }}>
        {/* Ambient orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(var(--color-theme-accent-rgb), 0.07) 0%, transparent 70%)", filter: "blur(60px)", transform: "translate(-30%, -30%)" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(var(--color-theme-accent-rgb), 0.05) 0%, transparent 70%)", filter: "blur(60px)", transform: "translate(30%, 30%)" }} />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          <ScrollReveal animation="scale-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest mb-4"
              style={{ background: "rgba(var(--color-theme-accent-rgb), 0.1)", color: "var(--color-theme-accent)", border: "1px solid rgba(var(--color-theme-accent-rgb), 0.2)" }}>
              <Leaf className="w-3 h-3" />
              Notre Histoire
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={80}>
            <h1 className="font-sans text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none"
              style={{ color: "var(--color-theme-fg)" }}>
              Née de la<br />
              <span style={{ color: "var(--color-theme-accent)" }}>Nature Africaine</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <p className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--color-theme-muted)" }}>
              CAROANA MINCEUR est une marque ivoirienne fondée sur une conviction profonde : les plantes africaines renferment tout ce dont votre corps a besoin pour retrouver légèreté et bien-être.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="scale-up" delay={200}>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" style={{ color: "var(--color-theme-accent)" }} />)}
                </div>
                <span className="text-xs font-bold" style={{ color: "var(--color-theme-fg)" }}>5 000+ clientes satisfaites</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ====== TIMELINE ====== */}
      <section className="py-24 border-b" style={{ borderColor: "var(--color-theme-border)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal animation="fade-up">
            <h2 className="font-sans text-3xl sm:text-4xl font-black uppercase tracking-tight mb-16 text-center" style={{ color: "var(--color-theme-fg)" }}>
              Notre <span style={{ color: "var(--color-theme-accent)" }}>Parcours</span>
            </h2>
          </ScrollReveal>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px hidden sm:block"
              style={{ background: "linear-gradient(to bottom, var(--color-theme-accent), transparent)", opacity: 0.3 }} />

            <div className="space-y-12">
              {STORY_STEPS.map((step, i) => (
                <ScrollReveal key={i} animation="fade-up" delay={i * 100}>
                  <div className="flex gap-8 items-start">
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xs"
                        style={{
                          background: "var(--color-theme-accent)",
                          color: "var(--color-theme-bg)",
                          boxShadow: "0 0 20px rgba(var(--color-theme-accent-rgb), 0.4)",
                        }}
                      >
                        {step.year.slice(2)}
                      </div>
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: "var(--color-theme-accent)" }}>{step.year}</div>
                      <h3 className="font-serif text-xl font-black mb-2" style={{ color: "var(--color-theme-fg)" }}>{step.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--color-theme-muted)" }}>{step.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== VALEURS ====== */}
      <section className="py-24 border-b" style={{ borderColor: "var(--color-theme-border)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal animation="fade-up">
            <h2 className="font-sans text-3xl sm:text-4xl font-black uppercase tracking-tight mb-14 text-center" style={{ color: "var(--color-theme-fg)" }}>
              Nos <span style={{ color: "var(--color-theme-accent)" }}>Engagements</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALEURS.map((v, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 80}>
                <div
                  className="rounded-2xl p-6 border h-full flex flex-col gap-4 transition-all duration-300"
                  style={{ background: "var(--color-theme-card)", borderColor: "var(--color-theme-border)" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(var(--color-theme-accent-rgb), 0.3)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 30px rgba(var(--color-theme-accent-rgb), 0.1)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-theme-border)";
                    (e.currentTarget as HTMLElement).style.transform = "";
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                  }}
                >
                  <span className="text-3xl">{v.icon}</span>
                  <h3 className="font-serif font-black text-base" style={{ color: "var(--color-theme-fg)" }}>{v.title}</h3>
                  <p className="text-xs leading-relaxed flex-1" style={{ color: "var(--color-theme-muted)" }}>{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== INGRÉDIENTS ====== */}
      <section className="py-24 border-b" style={{ borderColor: "var(--color-theme-border)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal animation="fade-up">
            <h2 className="font-sans text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4 text-center" style={{ color: "var(--color-theme-fg)" }}>
              Nos Plantes <span style={{ color: "var(--color-theme-accent)" }}>Signatures</span>
            </h2>
            <p className="text-sm text-center mb-14" style={{ color: "var(--color-theme-muted)" }}>
              Sélectionnées avec soin parmi les plantes médicinales d&apos;Afrique de l&apos;Ouest
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {INGREDIENTS.map((ing, i) => (
              <ScrollReveal key={i} animation="scale-up" delay={i * 60}>
                <div
                  className="rounded-xl p-5 border text-center transition-all duration-300"
                  style={{ background: "var(--color-theme-card)", borderColor: "var(--color-theme-border)" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(var(--color-theme-accent-rgb), 0.3)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(var(--color-theme-accent-rgb), 0.04)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-theme-border)";
                    (e.currentTarget as HTMLElement).style.background = "var(--color-theme-card)";
                  }}
                >
                  <div className="text-3xl mb-2">{ing.emoji}</div>
                  <div className="font-black text-sm" style={{ color: "var(--color-theme-fg)" }}>{ing.name}</div>
                  <div className="text-[10px] mt-1" style={{ color: "var(--color-theme-muted)" }}>{ing.desc}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA FINAL ====== */}
      <section className="py-20">
        <ScrollReveal animation="scale-up">
          <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
            <h2 className="font-sans text-3xl sm:text-4xl font-black uppercase tracking-tight" style={{ color: "var(--color-theme-fg)" }}>
              Prête à commencer votre<br />
              <span style={{ color: "var(--color-theme-accent)" }}>transformation ?</span>
            </h2>
            <p className="text-sm" style={{ color: "var(--color-theme-muted)" }}>
              Découvrez nos cures et packs conçus pour vous accompagner vers votre objectif silhouette.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all"
                style={{ background: "var(--color-theme-accent)", color: "var(--color-theme-bg)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px) scale(1.02)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 30px rgba(var(--color-theme-accent-rgb), 0.4)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "";
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                }}
              >
                <Sparkles className="w-4 h-4" />
                Voir la Boutique
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/2250143655088?text=Bonjour%20Caroana%20Minceur%2C%20je%20souhaite%20avoir%20un%20conseil%20personnalis%C3%A9"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all border"
                style={{ borderColor: "var(--color-theme-border)", color: "var(--color-theme-fg)", background: "var(--color-theme-card)" }}
              >
                💬 Conseil Personnalisé
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
