import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Leaf, ShieldCheck, Heart, Users, ArrowRight, ShieldAlert } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Nos Engagements de Qualité & Sourcing Éthique | Caroana Minceur",
  description: "Découvrez notre charte d'engagements : cueillette sauvage éthique en Côte d'Ivoire, soutien aux coopératives de femmes, contrôles laboratoires et formules 100% naturelles.",
};

export default function EngagementPage() {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto space-y-20">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <ScrollReveal animation="scale-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-bold tracking-widest uppercase"
            style={{
              borderColor: "rgba(var(--color-theme-accent-rgb), 0.3)",
              background: "rgba(var(--color-theme-accent-rgb), 0.05)",
              color: "var(--color-theme-accent)",
            }}>
            <Leaf className="w-3 h-3 text-theme-accent" />
            Notre Vision
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={100}>
          <h1 className="font-serif text-4xl sm:text-6xl font-black text-theme-fg uppercase leading-tight">
            Engagements <span className="text-theme-accent">Pureté</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <p className="text-sm text-theme-muted leading-relaxed font-medium">
            Du cœur de la terre ivoirienne à votre tasse, nous veillons à préserver la force active des plantes traditionnelles tout en respectant l&apos;humain et l&apos;environnement.
          </p>
        </ScrollReveal>
      </div>

      {/* Grid of 4 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pillar 1: Wild & Ethical Sourcing */}
        <ScrollReveal animation="fade-up" className="bg-theme-surface border border-theme-border p-8 rounded-2xl shadow-premium space-y-4">
          <div className="w-12 h-12 bg-theme-accent/15 border border-theme-accent/30 rounded-xl flex items-center justify-center text-theme-accent text-xl">
            🌍
          </div>
          <h3 className="font-serif text-xl font-bold uppercase">1. Cueillette Sauvage & Éco-responsable</h3>
          <p className="text-xs text-theme-muted leading-relaxed font-medium">
            Nos feuilles de Kinkéliba et de Citronnelle sauvage ne sont pas issues de monocultures intensives. Elles sont récoltées à l&apos;état sauvage dans leurs biotopes naturels en Côte d&apos;Ivoire. Cette méthode préserve la biodiversité des sols et garantit une concentration maximale en principes actifs antioxydants et draineurs.
          </p>
        </ScrollReveal>

        {/* Pillar 2: Social Support for Women */}
        <ScrollReveal animation="fade-up" delay={100} className="bg-theme-surface border border-theme-border p-8 rounded-2xl shadow-premium space-y-4">
          <div className="w-12 h-12 bg-theme-accent/15 border border-theme-accent/30 rounded-xl flex items-center justify-center text-theme-accent text-xl">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold uppercase">2. Soutien aux Coopératives Féminines</h3>
          <p className="text-xs text-theme-muted leading-relaxed font-medium">
            Parce que le bien-être doit profiter à tous, Caroana travaille main dans la main avec des coopératives agricoles de femmes dans les savanes et les forêts de Côte d&apos;Ivoire. Nous garantissons une rémunération juste, supérieure aux cours du marché, pour assurer l&apos;indépendance financière des récolteuses et de leurs familles.
          </p>
        </ScrollReveal>

        {/* Pillar 3: Laboratory Rigor */}
        <ScrollReveal animation="fade-up" delay={200} className="bg-theme-surface border border-theme-border p-8 rounded-2xl shadow-premium space-y-4">
          <div className="w-12 h-12 bg-theme-accent/15 border border-theme-accent/30 rounded-xl flex items-center justify-center text-theme-accent text-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold uppercase">3. Rigueur et Pureté Laboratoire</h3>
          <p className="text-xs text-theme-muted leading-relaxed font-medium">
            Après récolte, chaque lot de feuilles et d&apos;écorces est rigoureusement trié, lavé et séché de manière optimale pour stopper toute prolifération bactérienne. Nos plantes subissent des tests stricts en laboratoire pour valider l&apos;absence totale de pesticides, de métaux lourds et d&apos;additifs de synthèse. Nos formulations sont 100% pures et naturelles.
          </p>
        </ScrollReveal>

        {/* Pillar 4: Young Mothers Safety */}
        <ScrollReveal animation="fade-up" delay={300} className="bg-theme-surface border border-theme-border p-8 rounded-2xl shadow-premium space-y-4">
          <div className="w-12 h-12 bg-theme-accent/15 border border-theme-accent/30 rounded-xl flex items-center justify-center text-theme-accent text-xl">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold uppercase">4. Sécurité Allaitement (Gamme Nourrice)</h3>
          <p className="text-xs text-theme-muted leading-relaxed font-medium">
            La période post-partum est délicate. De nombreuses tisanes contiennent des laxatifs irritants (comme le séné à forte dose) ou des stimulants puissants incompatibles avec l&apos;allaitement. La gamme Nourrice exclut strictement tout composé nocif, favorisant des herbes digestives douces (Djeka) reconnues cliniquement pour purifier sans altérer la lactation.
          </p>
        </ScrollReveal>
      </div>

      {/* Quality commitment visual checklist */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-8 md:p-12 shadow-premium space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h3 className="font-serif text-2xl font-bold uppercase">Notre Charte Qualité Caroana</h3>
          <p className="text-xs text-theme-muted">Cinq piliers de confiance que nous respectons sur chaque produit livré.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs font-semibold text-theme-fg">
          {[
            "100% Bio & Sauvage (Sans pesticides)",
            "Sans édulcorants ni colorants artificiels",
            "Cueilli à la main avec amour en Côte d'Ivoire",
            "Feuilles entières séchées naturellement",
            "Gamme post-partum certifiée sans danger",
            "Emballages écologiques et biodégradables"
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 bg-theme-bg p-4 rounded-xl border border-theme-border">
              <span className="text-theme-accent text-lg">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Actions bottom card */}
      <div className="text-center space-y-4 max-w-md mx-auto pt-6">
        <p className="text-xs text-theme-muted leading-relaxed">
          Curieux d&apos;en savoir plus sur la phytothérapie africaine ? Parcourez notre herbier interactif pour découvrir chaque plante en détail.
        </p>
        <Link href="/herbier" className="btn-accent inline-flex items-center gap-2 px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest">
          Consulter l&apos;Herbier <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
