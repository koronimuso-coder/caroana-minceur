"use client";

import CureTracker from "@/components/ui/CureTracker";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Sparkles, Calendar, Heart, ShieldCheck, ArrowRight, Calculator } from "lucide-react";

export default function SuiviCureClient() {
  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 relative overflow-hidden" style={{ background: "var(--color-theme-bg)", color: "var(--color-theme-fg)" }}>
      {/* Decorative ambient gradients */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-10 pointer-events-none"
        style={{ background: "var(--color-theme-accent)" }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[150px] opacity-5 pointer-events-none"
        style={{ background: "var(--color-theme-accent)" }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Intro */}
        <div className="text-center mb-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4" 
              style={{ background: "rgba(var(--color-theme-accent-rgb), 0.1)", color: "var(--color-theme-accent)", border: "1px solid rgba(var(--color-theme-accent-rgb), 0.15)" }}>
              <Calendar className="w-3.5 h-3.5" />
              Rituel Quotidien
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Votre Suivi de Cure Interactif
            </h1>
            <p className="text-sm max-w-xl mx-auto opacity-70">
              Suivez votre routine de gélules et tisanes jour après jour. Cochez chaque jour complété pour activer nos conseils minceur et suivre votre régularité.
            </p>
          </ScrollReveal>
        </div>

        {/* Render main interactive widget */}
        <div className="mb-10">
          <ScrollReveal delay={100}>
            <CureTracker />
          </ScrollReveal>
        </div>

        {/* Informative advice cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <ScrollReveal delay={150}>
            <div className="p-5 rounded-2xl border flex flex-col justify-between h-full bg-theme-card" style={{ borderColor: "var(--color-theme-border)" }}>
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm font-serif">Régularité & Efficacité</h4>
                <p className="text-[11px] opacity-70 leading-relaxed">
                  Pour obtenir des résultats significatifs (jusqu'à 9kg et plus avec notre gamme Kaylie), prenez vos compléments chaque jour à heures régulières.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="p-5 rounded-2xl border flex flex-col justify-between h-full bg-theme-card" style={{ borderColor: "var(--color-theme-border)" }}>
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm font-serif">Alimentation Saine</h4>
                <p className="text-[11px] opacity-70 leading-relaxed">
                  Accompagnez votre cure de tisanes Ventre Plat ou Minceur d'une alimentation pauvre en graisses saturées et riche en fibres locales (fruits, légumes).
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={250}>
            <div className="p-5 rounded-2xl border flex flex-col justify-between h-full bg-theme-card" style={{ borderColor: "var(--color-theme-border)" }}>
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Calculator className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm font-serif">Bilan d'Évolution</h4>
                <p className="text-[11px] opacity-70 leading-relaxed">
                  N'hésitez pas à refaire régulièrement votre bilan pour réévaluer vos objectifs de silhouette et adapter votre pack.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Call to action section */}
        <div className="p-6 rounded-2xl border text-center space-y-4" 
          style={{ background: "rgba(var(--color-theme-accent-rgb), 0.03)", borderColor: "var(--color-theme-border)" }}>
          <h3 className="font-serif text-lg font-bold">Pas encore commencé votre cure ?</h3>
          <p className="text-xs opacity-75 max-w-md mx-auto">
            Trouvez les produits idéaux pour votre silhouette en réalisant votre Bilan Minceur gratuit ou en visitant notre boutique officielle.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link href="/bilan-minceur" className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-theme-accent text-theme-bg flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Calculer mon IMC & Profil
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/boutique" className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider border hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all" style={{ borderColor: "var(--color-theme-border)" }}>
              Visiter la Boutique
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
