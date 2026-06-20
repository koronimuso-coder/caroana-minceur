"use client";

import { Shield, Leaf, Award, Truck, Phone, Lock } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const BADGES = [
  { icon: <Leaf className="w-5 h-5" />, label: "100% Naturel", sub: "Plantes africaines pures" },
  { icon: <Shield className="w-5 h-5" />, label: "Sans Additifs", sub: "Aucun produit chimique" },
  { icon: <Award className="w-5 h-5" />, label: "Made in CIV", sub: "Fabriqué en Côte d'Ivoire" },
  { icon: <Truck className="w-5 h-5" />, label: "Livraison rapide", sub: "24h sur Abidjan" },
  { icon: <Phone className="w-5 h-5" />, label: "Service client", sub: "Réponse sous 15 min" },
  { icon: <Lock className="w-5 h-5" />, label: "Paiement sûr", sub: "Paiement à la livraison" },
];

export default function TrustBadges() {
  return (
    <section
      className="py-14 border-t"
      style={{ borderColor: "var(--color-theme-border)", background: "var(--color-theme-bg)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal animation="fade-up">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {BADGES.map((b, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-2 p-4 rounded-xl border transition-all duration-300 group cursor-default"
                style={{
                  borderColor: "var(--color-theme-border)",
                  background: "var(--color-theme-card)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(var(--color-theme-accent-rgb), 0.4)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(var(--color-theme-accent-rgb), 0.15)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-theme-border)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(var(--color-theme-accent-rgb), 0.1)", color: "var(--color-theme-accent)" }}
                >
                  {b.icon}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider" style={{ color: "var(--color-theme-fg)" }}>{b.label}</div>
                  <div className="text-[9px] mt-0.5" style={{ color: "var(--color-theme-muted)" }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
