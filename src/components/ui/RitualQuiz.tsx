"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Sparkles, Check, ArrowRight, RefreshCw, ShoppingCart, Info } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const QUESTIONS = [
  {
    id: 1,
    title: "Quel est votre objectif silhouette principal ?",
    options: [
      { id: "ventre-plat", text: "Ventre Plat & Confort", desc: "Éliminer les ballonnements et affiner la ceinture abdominale." },
      { id: "detox", text: "Détoxication & Énergie", desc: "Purifier l'organisme en profondeur et retrouver de la vitalité." },
      { id: "transit", text: "Régulation du Transit", desc: "Améliorer la digestion lente et éliminer les toxines au quotidien." },
    ]
  },
  {
    id: 2,
    title: "Quel format préférez-vous pour votre rituel ?",
    options: [
      { id: "infusion", text: "Tisanes & Thés à infuser", desc: "Le rituel sensoriel d'une boisson chaude et réconfortante." },
      { id: "capsules", text: "Gélules concentrées", desc: "Format nomade, rapide et ultra-dosé pour une efficacité ciblée." },
      { id: "both", text: "Pack Duo (Cure Complète)", desc: "L'association tisane + gélules pour une synergie maximale." },
    ]
  },
  {
    id: 3,
    title: "Quelle intensité de cure recherchez-vous ?",
    options: [
      { id: "soft", text: "Action Douce & Progressive", desc: "Plantes équilibrantes pour un bien-être au long cours." },
      { id: "active", text: "Action Intense & Draineur", desc: "Formulation concentrée pour des résultats rapides." },
    ]
  }
];

const PRODUCTS_DB = {
  gelules: {
    id: "p1",
    slug: "gelules-ventre-plat",
    sku: "GVP-01",
    name: "Gélules Ventre Plat",
    price: 10000,
    imageUrl: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
    desc: "Idéal pour éliminer la rétention d’eau et cibler la sangle abdominale de manière pratique.",
    benefits: ["Action ventre plat ciblée", "Brûleur de graisses naturel", "Format capsule pratique"],
    season: "Cure 2026"
  },
  gelules_kaylie: {
    id: "p-kaylie",
    slug: "gelules-kaylie",
    sku: "GK-01",
    name: "Gélules Minceur Kaylie",
    price: 25000,
    imageUrl: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
    desc: "Cure d’un mois. Perte de 9 kg à plus. La formule premium pour une transformation silhouette profonde.",
    benefits: ["Cure 1 mois complète", "Perte 9 kg à plus", "Formule concentrée premium"],
    season: "Cure 2026"
  },
  gelules_skinny: {
    id: "p-skinny",
    slug: "gelules-skinny",
    sku: "GS-01",
    name: "Gélules Minceur Skinny",
    price: 15000,
    imageUrl: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
    desc: "Cure d’une semaine. Perte de 1 kg à 9 kg. Efficacité rapide pour des résultats visibles rapidement.",
    benefits: ["Cure 1 semaine", "Perte 1 à 9 kg", "Résultats rapides visibles"],
    season: "Cure 2026"
  },
  the: {
    id: "p2",
    slug: "the-detox",
    sku: "TD-01",
    name: "Thé Détox",
    price: 5000,
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
    desc: "Le meilleur choix pour purifier l’organisme des métaux lourds et des excès. Kinkéliba & Citronnelle.",
    benefits: ["Élimination des toxines", "Effet draineur puissant", "Kinkéliba & Citronnelle"],
    season: "Cure 2026"
  },
  tisane: {
    id: "p3",
    slug: "tisane-ventre-plat",
    sku: "TVP-01",
    name: "Tisane Ventre Plat",
    price: 5000,
    imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
    desc: "Infusion ancestrale favorisant une digestion légère et éliminant naturellement les ballonnements.",
    benefits: ["Confort intestinal optimal", "Sensation de légèreté", "Plantes sauvages récoltées main"],
    season: "Cure 2026"
  },
  tisane_minceur: {
    id: "p-tisane-m",
    slug: "tisane-minceur",
    sku: "TM-01",
    name: "Tisane Minceur",
    price: 8000,
    imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
    desc: "Formule de phytothérapie africaine pour affiner la silhouette et favoriser l’élimination.",
    benefits: ["Affinage silhouette", "Drainage naturel", "Plantes ancestrales"],
    season: "Cure 2026"
  }
};

export default function RitualQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const handleSelectOption = (optionId: string) => {
    setAnswers({ ...answers, [QUESTIONS[step]!.id]: optionId });
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        setStep(QUESTIONS.length); // Results step
      }
    }, 300);
  };

  const resetQuiz = () => {
    setAnswers({});
    setStep(0);
    setAddedToCart(false);
  };

  // Logic to determine recommended product based on answers
  const getRecommendation = () => {
    const format = answers[2];
    const objective = answers[1];

    if (format === "capsules") {
      return PRODUCTS_DB.gelules;
    } else if (objective === "detox") {
      return PRODUCTS_DB.the;
    } else {
      return PRODUCTS_DB.tisane;
    }
  };

  const recommendedProduct = getRecommendation();

  const handleAddToCart = () => {
    if (step < QUESTIONS.length) return;
    addItem({
      productId: recommendedProduct.id,
      variantId: null,
      sku: recommendedProduct.sku,
      name: recommendedProduct.name,
      price: recommendedProduct.price,
      imageUrl: recommendedProduct.imageUrl
    });
    setAddedToCart(true);
  };

  const progressPercent = (step / QUESTIONS.length) * 100;

  return (
    <div className="w-full bg-theme-card border border-theme-border rounded-lg overflow-hidden card-depth p-6 sm:p-10 relative">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-theme-border">
        <div 
          className="h-full bg-theme-accent transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {step < QUESTIONS.length ? (
        // QUIZ STEPS
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-mono tracking-widest text-theme-accent uppercase font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Diagnostic Rituel Bien-être
            </span>
            <span className="text-[9px] font-mono text-theme-muted">
              Étape {step + 1} / {QUESTIONS.length}
            </span>
          </div>

          <ScrollReveal animation="fade-up" key={step} className="space-y-6">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-theme-fg">
              {QUESTIONS[step]?.title}
            </h3>

            <div className="grid grid-cols-1 gap-4 pt-2">
              {QUESTIONS[step]?.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`group text-left p-4 border rounded-lg transition-smooth cursor-pointer hover:bg-theme-fg/5 ${
                    answers[QUESTIONS[step]!.id] === opt.id
                      ? "border-theme-accent bg-theme-accent/5"
                      : "border-theme-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-theme-fg group-hover:text-theme-accent transition-smooth">
                      {opt.text}
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-smooth ${
                      answers[QUESTIONS[step]!.id] === opt.id
                        ? "border-theme-accent bg-theme-accent text-theme-bg"
                        : "border-theme-border text-transparent"
                    }`}>
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  </div>
                  <p className="text-[10px] text-theme-muted mt-1 leading-relaxed">
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      ) : (
        // RESULTS SCREEN
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-mono tracking-widest text-theme-accent uppercase font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Votre Rituel Conseillé
            </span>
            <button 
              onClick={resetQuiz}
              className="text-[9px] font-mono text-theme-accent hover:text-theme-fg flex items-center gap-1 cursor-pointer transition-smooth"
            >
              <RefreshCw className="w-3 h-3" />
              Recommencer
            </button>
          </div>

          <ScrollReveal animation="scale-up" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
            {/* Recommended Product Photo */}
            <div className="col-span-12 md:col-span-4 aspect-square bg-theme-bg border border-theme-border rounded-lg overflow-hidden relative shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={recommendedProduct.imageUrl} 
                alt={recommendedProduct.name} 
                className="w-full h-full object-cover opacity-90"
              />
              <span className="absolute bottom-3 right-3 text-[8px] font-mono text-theme-muted tracking-widest uppercase">
                {recommendedProduct.season}
              </span>
            </div>

            {/* Product Details & Action */}
            <div className="col-span-12 md:col-span-8 space-y-5">
              <div>
                <span className="text-[9px] font-mono font-bold tracking-widest bg-theme-accent text-theme-bg px-2 py-0.5 rounded">
                  Recommandation Cible
                </span>
                <h4 className="font-serif text-2xl font-black text-theme-fg uppercase mt-2">
                  {recommendedProduct.name}
                </h4>
                <p className="text-xs text-theme-muted mt-1.5 leading-relaxed">
                  {recommendedProduct.desc}
                </p>
              </div>

              <div className="space-y-2 border-t border-theme-border pt-4">
                <span className="text-[9px] font-bold text-theme-muted uppercase tracking-wider block">Bénéfices Clefs :</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recommendedProduct.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-[10px] text-theme-fg">
                      <div className="w-1.5 h-1.5 rounded-full bg-theme-accent" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-theme-border">
                <div className="text-center sm:text-left">
                  <span className="text-[8px] text-theme-muted uppercase font-bold block">Tarif unique</span>
                  <span className="text-lg font-black text-theme-fg font-mono">{recommendedProduct.price.toLocaleString("fr-FR")} FCFA</span>
                </div>

                <div className="flex-grow w-full flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`flex-1 inline-flex items-center justify-center space-x-2 font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded transition-smooth cursor-pointer ${
                      addedToCart 
                        ? "bg-theme-border text-theme-muted border border-theme-border cursor-default"
                        : "bg-theme-accent text-theme-bg hover:scale-[1.02] shadow-gold"
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{addedToCart ? "Dans le Panier" : "Ajouter au rituel"}</span>
                  </button>

                  <a
                    href={`https://wa.me/2250143655088?text=Bonjour%20Caroana%20Minceur,%20j'ai%20effectué%20le%20quiz%20et%20je%20souhaite%20obtenir%20des%20conseils%20sur%20le%20produit%20«%20${encodeURIComponent(recommendedProduct.name)}%20»`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-1.5 bg-theme-fg/5 hover:bg-theme-fg/10 text-theme-fg font-bold text-[10px] uppercase tracking-widest px-4 py-3.5 rounded transition-smooth border border-theme-border"
                  >
                    <span>Conseil herboriste</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      )}
    </div>
  );
}
