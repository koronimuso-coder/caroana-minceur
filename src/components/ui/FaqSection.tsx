"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const FAQS = [
  {
    q: "Comment commander un produit Caroana Minceur ?",
    a: "Vous pouvez commander directement sur notre site en ajoutant les produits au panier, ou plus simplement par WhatsApp au +225 01 43 65 50 88. Nous acceptons le paiement à la livraison sur Abidjan.",
  },
  {
    q: "Quels sont les délais et frais de livraison ?",
    a: "Pour Abidjan : livraison sous 24h, frais de 1 000 à 1 500 F CFA selon la commune. Pour les villes hors Abidjan : livraison sous 48-72h, frais de 2 500 F CFA. Le paiement se fait à la réception.",
  },
  {
    q: "Quelle est la différence entre les Gélules Kaylie et Skinny ?",
    a: "Les Gélules Kaylie (25 000 F) sont une cure d'un mois complète pour une perte de 9 kg à plus, idéale pour une transformation profonde. Les Gélules Skinny (15 000 F) sont une cure express d'une semaine pour perdre de 1 à 9 kg rapidement. Choisissez selon votre objectif et votre budget.",
  },
  {
    q: "Les produits sont-ils vraiment 100% naturels ?",
    a: "Oui, absolument. Tous nos produits sont formulés à partir de plantes africaines sélectionnées : Kinkéliba, Citronnelle sauvage, Séné, Gingembre, Menthe poivrée, etc. Aucun additif chimique, aucun conservateur artificiel. Fabriqués en Côte d'Ivoire.",
  },
  {
    q: "Peut-on combiner plusieurs produits ?",
    a: "Oui et c'est même recommandé ! Nos packs (Gélules + Thé, Gélules + Tisane, Pack Complet 3 produits) sont spécialement formulés pour une synergie optimale. La combinaison amplifie les résultats. Consultez notre WhatsApp pour un conseil personnalisé.",
  },
  {
    q: "Y a-t-il des contre-indications ?",
    a: "Nos produits sont à base de plantes naturelles. Déconseillés aux femmes enceintes ou allaitantes, aux enfants de moins de 12 ans. En cas de traitement médical en cours, consultez votre médecin avant utilisation. En cas de doute, contactez-nous sur WhatsApp.",
  },
  {
    q: "Comment utiliser la Tisane et le Thé Détox ?",
    a: "Infusez 1 à 2 sachets dans 200ml d'eau chaude (non bouillante) pendant 5 à 10 minutes. À consommer de préférence le matin à jeun ou le soir après le dîner. 1 à 2 tasses par jour. Associé à une bonne hydratation (au moins 1,5L d'eau par jour).",
  },
  {
    q: "Les résultats sont-ils garantis ?",
    a: "Nos produits sont formulés pour être efficaces avec une utilisation régulière. Les résultats varient selon les morphologies. Des milliers de clientes ont obtenu des résultats visibles en suivant les cures complètes. Pour optimiser, combinez avec une alimentation équilibrée.",
  },
  {
    q: "Quelle cure recommandez-vous pour commencer ?",
    a: "Pour débuter, nous recommandons le Pack Complet 3 Produits (19 000 F) ou le Pack Gélules + Thé Détox (14 000 F). Ces packs offrent une action complète et synergique. Si vous voulez des résultats rapides, la cure Skinny est parfaite pour une semaine test.",
  },
  {
    q: "Puis-je suivre ma commande ?",
    a: "Oui ! Après votre commande, notre équipe vous contacte directement par WhatsApp pour vous donner les informations de suivi. Vous pouvez aussi nous envoyer un message à tout moment sur le +225 01 43 65 50 88.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 border-t" style={{ borderColor: "var(--color-theme-border)", background: "var(--color-theme-bg)" }}>
      <div className="max-w-3xl mx-auto px-6">
        <ScrollReveal animation="fade-up">
          <div className="text-center space-y-2 mb-14">
            <span className="text-[9px] font-black uppercase tracking-[0.35em]" style={{ color: "var(--color-theme-accent)" }}>
              Questions Fréquentes
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-black uppercase tracking-tight" style={{ color: "var(--color-theme-fg)" }}>
              Tout ce que vous<br />
              <span style={{ color: "var(--color-theme-accent)" }}>devez savoir</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <ScrollReveal key={i} animation="fade-up" delay={i * 40}>
              <div
                className="border rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  borderColor: open === i ? "rgba(var(--color-theme-accent-rgb), 0.4)" : "var(--color-theme-border)",
                  background: open === i ? "rgba(var(--color-theme-accent-rgb), 0.03)" : "var(--color-theme-card)",
                }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer group"
                >
                  <span
                    className="text-sm font-bold pr-4 transition-colors"
                    style={{ color: open === i ? "var(--color-theme-accent)" : "var(--color-theme-fg)" }}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                    style={{
                      color: "var(--color-theme-accent)",
                      transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                {open === i && (
                  <div
                    className="px-5 pb-5 text-sm leading-relaxed"
                    style={{ color: "var(--color-theme-muted)", borderTop: "1px solid var(--color-theme-border)" }}
                  >
                    <div className="pt-4">{faq.a}</div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal animation="scale-up" delay={200}>
          <div className="text-center mt-12 space-y-3">
            <p className="text-xs" style={{ color: "var(--color-theme-muted)" }}>
              Vous n&apos;avez pas trouvé votre réponse ?
            </p>
            <a
              href="https://wa.me/2250143655088?text=Bonjour%20Caroana%20Minceur%2C%20j%27ai%20une%20question%20%3A%20"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
              style={{ background: "#25D366", color: "#fff" }}
            >
              💬 Poser votre question sur WhatsApp
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
