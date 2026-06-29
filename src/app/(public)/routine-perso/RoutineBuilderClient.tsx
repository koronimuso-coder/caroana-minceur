"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ArrowLeft, Check, ShoppingCart, Info, Percent, Heart, ShieldAlert } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface ProductOption {
  id: string;
  name: string;
  price: number;
  sku: string;
  image: string;
  desc: string;
  badge?: string;
}

const GELULES_OPTIONS: ProductOption[] = [
  {
    id: "p-kaylie",
    name: "Gélules Minceur Kaylie",
    price: 25000,
    sku: "GK-01",
    image: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
    desc: "Cure intensive 1 mois pour une perte de poids marquée (9 kg et plus).",
    badge: "⭐ Formule Premium"
  },
  {
    id: "p-skinny",
    name: "Gélules Minceur Skinny",
    price: 15000,
    sku: "GS-01",
    image: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
    desc: "Cure rapide de 1 semaine pour booster le métabolisme et perdre de 1 à 9 kg.",
    badge: "⚡ Action Express"
  },
  {
    id: "p1",
    name: "Gélules Ventre Plat",
    price: 10000,
    sku: "GVP-01",
    image: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
    desc: "Ciblage abdominal actif pour retrouver une taille fine et soulager la rétention d'eau.",
    badge: "🌿 Phytothérapie active"
  },
  {
    id: "p-gelules-nourrice",
    name: "Gélules Ventre Plat Nourrice",
    price: 10000,
    sku: "GVPN-01",
    image: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
    desc: "Formule post-partum 100% compatible avec l'allaitement pour raffermir le ventre.",
    badge: "🍼 Allaitement Garanti"
  }
];

const INFUSION_OPTIONS: ProductOption[] = [
  {
    id: "p2",
    name: "Thé Détox",
    price: 5000,
    sku: "TD-01",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
    desc: "Drainage hépatique actif à base de Kinkéliba et de Citronnelle Sauvage."
  },
  {
    id: "p3",
    name: "Tisane Ventre Plat",
    price: 5000,
    sku: "TVP-01",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
    desc: "Formule apaisante pour faciliter la digestion après les repas et réduire le gonflement."
  },
  {
    id: "p-tisane-m",
    name: "Tisane Minceur",
    price: 8000,
    sku: "TM-01",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
    desc: "Décoction d'herbes drainantes pour affiner la silhouette globale."
  },
  {
    id: "p-tisane-nourrice",
    name: "Tisane Ventre Plat Nourrice",
    price: 5000,
    sku: "TVPN-01",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
    desc: "Mélange doux favorisant le transit sans perturber le lait maternel.",
    badge: "🍼 Sécurité Maman"
  }
];

const BOOSTER_OPTIONS: ProductOption[] = [
  {
    id: "p-caolin-nourrice",
    name: "Caolin Ventre Plat Nourrice",
    price: 5000,
    sku: "CVPN-01",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
    desc: "Soin traditionnel de caolin purifié à appliquer en onguent cutané pour raffermir la peau.",
    badge: "✨ Soin Traditionnel"
  },
  {
    id: "acc-infuseur",
    name: "Infuseur Premium Bambou",
    price: 5000,
    sku: "ACC-01",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
    desc: "Gourde isotherme nomade en bambou avec filtre en inox intégré pour vos infusions nomades.",
    badge: "🎒 Accessoire Pratique"
  }
];

interface GoalOption {
  id: string;
  title: string;
  desc: string;
  icon: string;
  defaultGeluleId: string;
  defaultInfusionId: string;
}

const GOALS: GoalOption[] = [
  {
    id: "premium",
    title: "Perte Globale & Silhouette Premium",
    desc: "Objectif perte de poids importante et redéfinition de la silhouette globale en 1 mois.",
    icon: "💎",
    defaultGeluleId: "p-kaylie",
    defaultInfusionId: "p-tisane-m"
  },
  {
    id: "express",
    title: "Perte de Poids Express",
    desc: "Objectif minceur accéléré et coup de fouet métabolique sur 1 semaine.",
    icon: "⚡",
    defaultGeluleId: "p-skinny",
    defaultInfusionId: "p2"
  },
  {
    id: "ventre-plat",
    title: "Cible Ventre Plat",
    desc: "Objectif élimination des graisses abdominales, de la rétention d'eau et de l'inconfort digestif.",
    icon: "🌿",
    defaultGeluleId: "p1",
    defaultInfusionId: "p3"
  },
  {
    id: "nourrice",
    title: "Jeune Maman & Allaitement",
    desc: "Spécialement conçu pour les mamans allaitantes souhaitant dégonfler et retrouver un ventre plat.",
    icon: "🍼",
    defaultGeluleId: "p-gelules-nourrice",
    defaultInfusionId: "p-tisane-nourrice"
  }
];

export default function RoutineBuilderClient() {
  const router = useRouter();
  const { addItem } = useCart();

  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<GoalOption>(GOALS[0]!);
  const [selectedGelule, setSelectedGelule] = useState<ProductOption>(GELULES_OPTIONS[0]!);
  const [selectedInfusion, setSelectedInfusion] = useState<ProductOption>(INFUSION_OPTIONS[2]!);
  const [selectedBooster, setSelectedBooster] = useState<ProductOption | null>(null);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const handleSelectGoal = (goal: GoalOption) => {
    setSelectedGoal(goal);
    const defGel = GELULES_OPTIONS.find((g) => g.id === goal.defaultGeluleId) || GELULES_OPTIONS[0]!;
    const defInf = INFUSION_OPTIONS.find((i) => i.id === goal.defaultInfusionId) || INFUSION_OPTIONS[0]!;
    setSelectedGelule(defGel);
    setSelectedInfusion(defInf);

    // Pre-select Caolin for Nourrice goal, clear for others
    if (goal.id === "nourrice") {
      setSelectedBooster(BOOSTER_OPTIONS[0]!);
    } else {
      setSelectedBooster(null);
    }
  };

  // Calculations
  const gelPrice = selectedGelule.price;
  const infPrice = selectedInfusion.price;
  const boostPrice = selectedBooster ? selectedBooster.price : 0;

  const originalTotal = gelPrice + infPrice + boostPrice;
  // Apply a bundle discount of 1500 FCFA if they choose at least 1 gelule + 1 infusion
  const bundleDiscount = 1500;
  const finalTotal = originalTotal - bundleDiscount;

  const handleAddToCart = () => {
    // 1. Add Gelules
    addItem({
      productId: selectedGelule.id,
      variantId: null,
      sku: selectedGelule.sku,
      name: `${selectedGelule.name} (Routine Sur-Mesure)`,
      price: selectedGelule.price - bundleDiscount / 2, // Distribute discount
      imageUrl: selectedGelule.image,
    });

    // 2. Add Infusion
    addItem({
      productId: selectedInfusion.id,
      variantId: null,
      sku: selectedInfusion.sku,
      name: `${selectedInfusion.name} (Routine Sur-Mesure)`,
      price: selectedInfusion.price - bundleDiscount / 2,
      imageUrl: selectedInfusion.image,
    });

    // 3. Add Booster if selected
    if (selectedBooster) {
      addItem({
        productId: selectedBooster.id,
        variantId: null,
        sku: selectedBooster.sku,
        name: selectedBooster.name,
        price: selectedBooster.price,
        imageUrl: selectedBooster.image,
      });
    }

    setShowAddedMessage(true);
    setTimeout(() => {
      setShowAddedMessage(false);
      router.push("/panier");
    }, 1500);
  };

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
            Routine Personnalisée
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={100}>
          <h1 className="font-serif text-4xl sm:text-6xl font-black text-theme-fg uppercase leading-tight">
            Composez votre <span className="text-theme-accent">Cure</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <p className="text-sm text-theme-muted leading-relaxed font-medium">
            Associez des gélules actives, une infusion drainante et des boosters pour maximiser vos résultats. Bénéficiez automatiquement d&apos;une réduction de 1 500 FCFA sur votre routine personnalisée.
          </p>
        </ScrollReveal>
      </div>

      {/* Steper navigation indicators */}
      <div className="max-w-xl mx-auto flex items-center justify-between pb-8">
        {[
          { num: 1, label: "Objectif" },
          { num: 2, label: "Gélules" },
          { num: 3, label: "Infusion" },
          { num: 4, label: "Booster & Récap" }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <button
              onClick={() => step > s.num && setStep(s.num)}
              disabled={step < s.num}
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                step === s.num
                  ? "bg-theme-accent border-theme-accent text-theme-bg font-black scale-110"
                  : step > s.num
                  ? "bg-theme-accent/20 border-theme-accent text-theme-accent cursor-pointer"
                  : "border-theme-border text-theme-muted cursor-not-allowed"
              }`}
            >
              {step > s.num ? "✓" : s.num}
            </button>
            <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:inline ${
              step === s.num ? "text-theme-fg font-black" : "text-theme-muted"
            }`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Layout: Left is options selector, Right is real-time summary card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Options selection */}
        <div className="lg:col-span-8 bg-theme-surface border border-theme-border rounded-2xl p-6 md:p-8 shadow-premium min-h-[450px] flex flex-col justify-between">
          {/* STEP 1: OBJECTIF */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold uppercase">Étape 1 : Quel est votre objectif bien-être ?</h3>
                <p className="text-xs text-theme-muted">Sélectionnez la cure qui s&apos;aligne le mieux avec votre besoin actuel.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GOALS.map((goal) => (
                  <div
                    key={goal.id}
                    onClick={() => handleSelectGoal(goal)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                      selectedGoal.id === goal.id
                        ? "bg-theme-accent/5 border-theme-accent ring-1 ring-theme-accent shadow-premium shadow-gold"
                        : "bg-theme-bg/60 border-theme-border/60 hover:border-theme-border"
                    }`}
                  >
                    <span className="text-3xl bg-theme-surface border border-theme-border rounded-xl p-3 shadow-sm">{goal.icon}</span>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-theme-fg uppercase">{goal.title}</h4>
                      <p className="text-[10px] text-theme-muted leading-relaxed font-medium">{goal.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: GELULES */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold uppercase">Étape 2 : Choisissez vos gélules actives</h3>
                <p className="text-xs text-theme-muted">
                  Sélectionnez l&apos;extrait sec en gélules pour sculpter votre corps de l&apos;intérieur.
                  {selectedGoal.id === "nourrice" && (
                    <span className="text-amber-500 font-bold block mt-1 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> Option validée pour allaitement pré-sélectionnée.
                    </span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GELULES_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedGelule(opt)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex gap-4 ${
                      selectedGelule.id === opt.id
                        ? "bg-theme-accent/5 border-theme-accent ring-1 ring-theme-accent shadow-premium shadow-gold"
                        : "bg-theme-bg/60 border-theme-border/60 hover:border-theme-border"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={opt.image} alt={opt.name} className="w-16 h-16 object-cover rounded-xl border border-theme-border" />
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-theme-fg uppercase">{opt.name}</h4>
                        <span className="text-xs font-mono font-bold text-theme-accent">{opt.price.toLocaleString("fr-FR")} F</span>
                      </div>
                      {opt.badge && (
                        <span className="inline-block bg-theme-accent/15 text-theme-accent text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {opt.badge}
                        </span>
                      )}
                      <p className="text-[10px] text-theme-muted leading-relaxed font-medium pt-1">{opt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: INFUSIONS */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold uppercase">Étape 3 : Choisissez votre infusion drainante</h3>
                <p className="text-xs text-theme-muted">
                  Sélectionnez la tisane ou le thé détox traditionnel pour purifier et éliminer quotidiennement.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INFUSION_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedInfusion(opt)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex gap-4 ${
                      selectedInfusion.id === opt.id
                        ? "bg-theme-accent/5 border-theme-accent ring-1 ring-theme-accent shadow-premium shadow-gold"
                        : "bg-theme-bg/60 border-theme-border/60 hover:border-theme-border"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={opt.image} alt={opt.name} className="w-16 h-16 object-cover rounded-xl border border-theme-border" />
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-theme-fg uppercase">{opt.name}</h4>
                        <span className="text-xs font-mono font-bold text-theme-accent">{opt.price.toLocaleString("fr-FR")} F</span>
                      </div>
                      {opt.badge && (
                        <span className="inline-block bg-theme-accent/15 text-theme-accent text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {opt.badge}
                        </span>
                      )}
                      <p className="text-[10px] text-theme-muted leading-relaxed font-medium pt-1">{opt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: BOOSTERS & WRAP UP */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold uppercase">Étape 4 : Souhaitez-vous ajouter un booster ?</h3>
                <p className="text-xs text-theme-muted">Améliorez votre rituel minceur avec un soin corporel ou un accessoire pratique.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BOOSTER_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedBooster(selectedBooster?.id === opt.id ? null : opt)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex gap-4 ${
                      selectedBooster?.id === opt.id
                        ? "bg-theme-accent/5 border-theme-accent ring-1 ring-theme-accent shadow-premium shadow-gold"
                        : "bg-theme-bg/60 border-theme-border/60 hover:border-theme-border"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={opt.image} alt={opt.name} className="w-16 h-16 object-cover rounded-xl border border-theme-border" />
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-theme-fg uppercase">{opt.name}</h4>
                        <span className="text-xs font-mono font-bold text-theme-accent">{opt.price.toLocaleString("fr-FR")} F</span>
                      </div>
                      {opt.badge && (
                        <span className="inline-block bg-theme-accent/15 text-theme-accent text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {opt.badge}
                        </span>
                      )}
                      <p className="text-[10px] text-theme-muted leading-relaxed font-medium pt-1">{opt.desc}</p>
                    </div>
                  </div>
                ))}

                {/* Option to skip booster */}
                <div
                  onClick={() => setSelectedBooster(null)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-center text-center ${
                    selectedBooster === null
                      ? "bg-theme-accent/5 border-theme-accent ring-1 ring-theme-accent shadow-premium"
                      : "bg-theme-bg/60 border-theme-border/60 hover:border-theme-border"
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-theme-fg uppercase">Aucun Booster</h4>
                    <p className="text-[10px] text-theme-muted font-medium">Je souhaite uniquement mes gélules et ma tisane.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Controls Footer */}
          <div className="flex justify-between items-center pt-8 border-t border-theme-border/40 mt-6">
            <button
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                step === 1
                  ? "border-theme-border text-theme-muted cursor-not-allowed opacity-50"
                  : "bg-theme-bg border-theme-border hover:text-theme-fg hover:border-theme-muted text-theme-muted"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Précédent
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="btn-accent inline-flex items-center gap-2 px-5 py-3 rounded-lg text-[10px] font-bold uppercase tracking-wider"
              >
                Étape Suivante <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={showAddedMessage}
                className="btn-accent inline-flex items-center gap-2 px-8 py-3 rounded-lg text-[10px] font-bold uppercase tracking-wider"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{showAddedMessage ? "Ajout en cours..." : "Ajouter ma routine"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Sticky real-time Summary Card */}
        <div className="lg:col-span-4 bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-premium space-y-6 lg:sticky lg:top-24">
          <h3 className="font-serif text-lg font-bold uppercase tracking-wider pb-3 border-b border-theme-border/40 flex items-center justify-between">
            <span>Ma Routine</span>
            <span className="text-3xl">{selectedGoal.icon}</span>
          </h3>

          {/* Goal recap */}
          <div className="space-y-1">
            <span className="text-[8px] font-bold uppercase text-theme-muted tracking-wider">Cure sélectionnée</span>
            <div className="text-xs font-bold text-theme-fg">{selectedGoal.title}</div>
          </div>

          {/* Selected items list */}
          <div className="space-y-3">
            <span className="text-[8px] font-bold uppercase text-theme-muted tracking-wider block">Composition de la routine</span>

            {/* Gelule selected */}
            <div className="flex justify-between items-center bg-theme-bg/40 p-2.5 rounded-lg border border-theme-border/20">
              <div className="flex items-center gap-2">
                <span className="text-lg">💊</span>
                <span className="text-[10px] font-semibold text-theme-fg">{selectedGelule.name}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-theme-muted">{selectedGelule.price.toLocaleString("fr-FR")} F</span>
            </div>

            {/* Infusion selected */}
            <div className="flex justify-between items-center bg-theme-bg/40 p-2.5 rounded-lg border border-theme-border/20">
              <div className="flex items-center gap-2">
                <span className="text-lg">🍵</span>
                <span className="text-[10px] font-semibold text-theme-fg">{selectedInfusion.name}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-theme-muted">{selectedInfusion.price.toLocaleString("fr-FR")} F</span>
            </div>

            {/* Booster selected if any */}
            {selectedBooster ? (
              <div className="flex justify-between items-center bg-theme-bg/40 p-2.5 rounded-lg border border-theme-border/20">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  <span className="text-[10px] font-semibold text-theme-fg">{selectedBooster.name}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-theme-muted">{selectedBooster.price.toLocaleString("fr-FR")} F</span>
              </div>
            ) : (
              <div className="flex justify-between items-center bg-theme-bg/15 p-2.5 rounded-lg border border-dashed border-theme-border/30 text-theme-muted">
                <span className="text-[10px]">Aucun booster ajouté</span>
                <span className="text-[10px] font-bold">0 F</span>
              </div>
            )}
          </div>

          {/* Pricing calculations */}
          <div className="pt-4 border-t border-theme-border/40 space-y-2 text-xs">
            <div className="flex justify-between items-center text-theme-muted font-medium">
              <span>Sous-total</span>
              <span className="font-mono">{originalTotal.toLocaleString("fr-FR")} FCFA</span>
            </div>

            <div className="flex justify-between items-center text-theme-accent font-bold">
              <span className="flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5" /> Remise de lot
              </span>
              <span className="font-mono">-{bundleDiscount.toLocaleString("fr-FR")} FCFA</span>
            </div>

            <div className="flex justify-between items-center text-theme-fg font-black text-sm pt-2 border-t border-dashed border-theme-border/30">
              <span>TOTAL</span>
              <span className="font-mono text-theme-accent">{finalTotal.toLocaleString("fr-FR")} FCFA</span>
            </div>
          </div>

          {/* Reassurance text */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg flex items-start gap-2 text-[9px] text-theme-muted leading-normal">
            <Heart className="w-4 h-4 text-theme-accent flex-shrink-0 mt-0.5" />
            <span>Tous nos produits sont 100% naturels et formulés avec soin sous contrôles stricts en Côte d&apos;Ivoire.</span>
          </div>

          {/* Add to cart shortcut button */}
          <button
            onClick={handleAddToCart}
            disabled={showAddedMessage}
            className="w-full btn-accent py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{showAddedMessage ? "Ajouté au panier..." : "Ajouter ma routine"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
