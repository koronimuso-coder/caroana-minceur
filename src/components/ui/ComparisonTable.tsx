"use client";

import { Check, X } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const ROWS = [
  { feature: "Type de cure", kaylie: "1 mois complet", skinny: "1 semaine express" },
  { feature: "Perte de poids", kaylie: "9 kg à plus", skinny: "1 kg à 9 kg" },
  { feature: "Prix", kaylie: "25 000 F CFA", skinny: "15 000 F CFA" },
  { feature: "Intensité", kaylie: "Transformation profonde", skinny: "Résultats rapides" },
  { feature: "Idéal pour", kaylie: "Objectif long terme", skinny: "Objectif court terme" },
  { feature: "Naturel & Sans additifs", kaylie: true, skinny: true },
  { feature: "Formulé en Côte d'Ivoire", kaylie: true, skinny: true },
  { feature: "Disponible en pack", kaylie: true, skinny: true },
];

export default function ComparisonTable() {
  return (
    <section className="py-20 border-t" style={{ borderColor: "var(--color-theme-border)", background: "var(--color-theme-bg)" }}>
      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal animation="fade-up">
          <div className="text-center space-y-2 mb-12">
            <span className="text-[9px] font-black uppercase tracking-[0.35em]" style={{ color: "var(--color-theme-accent)" }}>
              Comparatif
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-black uppercase tracking-tight" style={{ color: "var(--color-theme-fg)" }}>
              Kaylie vs Skinny —{" "}
              <span style={{ color: "var(--color-theme-accent)" }}>Quelle cure choisir ?</span>
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="scale-up" delay={100}>
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(var(--color-theme-accent-rgb), 0.2)" }}>
            {/* Header */}
            <div
              className="grid grid-cols-3 text-center"
              style={{ background: "var(--color-theme-card)", borderBottom: "1px solid var(--color-theme-border)" }}
            >
              <div className="p-5 border-r" style={{ borderColor: "var(--color-theme-border)" }}>
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--color-theme-muted)" }}>Caractéristique</span>
              </div>
              <div
                className="p-5 border-r"
                style={{
                  borderColor: "var(--color-theme-border)",
                  background: "linear-gradient(to bottom, rgba(var(--color-theme-accent-rgb), 0.08), transparent)"
                }}
              >
                <span className="text-lg">💎</span>
                <div className="font-black text-sm mt-1" style={{ color: "var(--color-theme-accent)" }}>Kaylie</div>
                <div className="text-[8px] uppercase tracking-wider mt-0.5" style={{ color: "var(--color-theme-muted)" }}>Premium · 1 mois</div>
              </div>
              <div className="p-5" style={{ background: "linear-gradient(to bottom, rgba(var(--color-theme-accent-rgb), 0.04), transparent)" }}>
                <span className="text-lg">⚡</span>
                <div className="font-black text-sm mt-1" style={{ color: "var(--color-theme-fg)" }}>Skinny</div>
                <div className="text-[8px] uppercase tracking-wider mt-0.5" style={{ color: "var(--color-theme-muted)" }}>Express · 1 semaine</div>
              </div>
            </div>

            {/* Rows */}
            {ROWS.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-3 border-t"
                style={{
                  borderColor: "var(--color-theme-border)",
                  background: i % 2 === 0 ? "var(--color-theme-card)" : "var(--color-theme-bg)",
                }}
              >
                <div className="p-4 flex items-center border-r" style={{ borderColor: "var(--color-theme-border)" }}>
                  <span className="text-[11px] font-bold" style={{ color: "var(--color-theme-muted)" }}>{row.feature}</span>
                </div>
                <div className="p-4 flex items-center justify-center border-r" style={{ borderColor: "var(--color-theme-border)" }}>
                  {typeof row.kaylie === "boolean" ? (
                    row.kaylie
                      ? <Check className="w-4 h-4" style={{ color: "var(--color-theme-accent)" }} />
                      : <X className="w-4 h-4 opacity-30" style={{ color: "var(--color-theme-fg)" }} />
                  ) : (
                    <span className="text-[11px] font-black text-center" style={{ color: "var(--color-theme-accent)" }}>{row.kaylie}</span>
                  )}
                </div>
                <div className="p-4 flex items-center justify-center">
                  {typeof row.skinny === "boolean" ? (
                    row.skinny
                      ? <Check className="w-4 h-4" style={{ color: "var(--color-theme-accent)" }} />
                      : <X className="w-4 h-4 opacity-30" style={{ color: "var(--color-theme-fg)" }} />
                  ) : (
                    <span className="text-[11px] font-black text-center" style={{ color: "var(--color-theme-fg)" }}>{row.skinny}</span>
                  )}
                </div>
              </div>
            ))}

            {/* CTA footer */}
            <div
              className="grid grid-cols-3 border-t"
              style={{ borderColor: "var(--color-theme-border)", background: "var(--color-theme-card)" }}
            >
              <div className="p-4" />
              <div className="p-4 text-center border-r" style={{ borderColor: "var(--color-theme-border)" }}>
                <a
                  href="https://wa.me/2250143655088?text=Bonjour%2C%20je%20souhaite%20commander%20les%20G%C3%A9lules%20Kaylie%20%C3%A0%2025000%20F%20CFA"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-block px-4 py-2 rounded text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105"
                  style={{ background: "var(--color-theme-accent)", color: "var(--color-theme-bg)" }}
                >
                  Choisir Kaylie
                </a>
              </div>
              <div className="p-4 text-center">
                <a
                  href="https://wa.me/2250143655088?text=Bonjour%2C%20je%20souhaite%20commander%20les%20G%C3%A9lules%20Skinny%20%C3%A0%2015000%20F%20CFA"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-block px-4 py-2 rounded border text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105"
                  style={{ borderColor: "var(--color-theme-border)", color: "var(--color-theme-fg)" }}
                >
                  Choisir Skinny
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
