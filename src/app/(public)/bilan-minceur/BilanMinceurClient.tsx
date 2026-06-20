"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { 
  Calculator, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Scale, 
  Target, 
  Flame, 
  Leaf, 
  Sparkles, 
  CheckCircle, 
  ChevronRight, 
  TrendingDown, 
  ShoppingBag,
  Activity
} from "lucide-react";

type QuizState = {
  gender: "femme" | "homme";
  age: number;
  activity: "sedentaire" | "modere" | "actif" | "intense";
  height: number;
  weight: number;
  objective: "ventre-plat" | "perte-rapide" | "perte-intensive" | "detox-energie";
  targetArea: "ventre" | "cuisses" | "corps-entier" | "drainage";
};

const INITIAL_STATE: QuizState = {
  gender: "femme",
  age: 28,
  activity: "modere",
  height: 165,
  weight: 68,
  objective: "ventre-plat",
  targetArea: "ventre",
};

// Recommended products based on goal
const RECOMMENDATIONS = {
  "ventre-plat": {
    id: "pack-4",
    name: "Pack Complet 3 Produits",
    price: 19000,
    sku: "PK-04",
    description: "L'expérience minceur ultime combinant les Gélules Ventre Plat, le Thé Détox et la Tisane Ventre Plat. Idéal pour cibler spécifiquement la sangle abdominale, réduire les ballonnements et affiner votre silhouette en profondeur.",
    imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
    benefits: ["Action ventre plat ciblée", "Synergie de 3 plantes ancestrales", "Améliore le transit et la digestion"],
    badge: "Recommandé pour vous"
  },
  "perte-rapide": {
    id: "pack-7",
    name: "Pack Gélules Skinny + Thé Détox",
    price: 20000,
    sku: "PK-07",
    description: "Cure express d'une semaine conçue pour initier une perte de poids rapide (perte estimée de 1kg à 9kg). La combinaison des gélules Skinny ultra-actives et du Thé Détox stimule le métabolisme et accélère la combustion des graisses.",
    imageUrl: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
    benefits: ["Cure express intensive (1 semaine)", "Perte rapide de 1 à 9 kg", "Énergie et vitalité préservées"],
    badge: "Cure Express active"
  },
  "perte-intensive": {
    id: "pack-5",
    name: "Pack Gélules Kaylie + Thé Détox",
    price: 30000,
    sku: "PK-05",
    description: "Cure complète premium d'un mois pour une transformation profonde et durable (perte de 9kg à plus). Idéal pour stabiliser votre poids, brûler les graisses tenaces et détoxifier l'organisme.",
    imageUrl: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
    benefits: ["Cure d'un mois premium", "Brûleur de graisses intensif (9kg+)", "Détoxification hépatique et rénale"],
    badge: "Cure intensive 30 jours"
  },
  "detox-energie": {
    id: "pack-3",
    name: "Pack Thé Détox + Tisane Ventre Plat",
    price: 10000,
    sku: "PK-03",
    description: "Duo idéal de boissons naturelles pour purifier le corps en douceur, relancer le système lymphatique et retrouver un confort intestinal optimal. Parfait en cure de rentrée ou après des excès.",
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
    benefits: ["Élimination des toxines accumulées", "Action anti-ballonnement", "100% naturel et riche en antioxydants"],
    badge: "Duo Détox & Légèreté"
  }
};

export default function BilanMinceurClient() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<QuizState>(INITIAL_STATE);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const updateField = <K extends keyof QuizState>(key: K, value: QuizState[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  // Calculations
  const heightInMeters = formData.height / 100;
  const imc = parseFloat((formData.weight / (heightInMeters * heightInMeters)).toFixed(1));

  // Determine BMI category & colors
  let imcCategory = "";
  let imcColor = "";
  let imcTextColor = "";
  let imcAdvice = "";

  if (imc < 18.5) {
    imcCategory = "Insuffisance pondérale (Maigreur)";
    imcColor = "#3b82f6"; // Blue
    imcTextColor = "text-blue-500";
    imcAdvice = "Votre IMC indique un poids inférieur à la moyenne. Nous vous conseillons de vous tourner vers des cures douces comme le Thé Détox pour purifier votre corps, tout en maintenant une alimentation riche et équilibrée.";
  } else if (imc >= 18.5 && imc < 25) {
    imcCategory = "Poids normal (Silhouette équilibrée)";
    imcColor = "#10b981"; // Emerald
    imcTextColor = "text-emerald-500";
    imcAdvice = "Félicitations, vous êtes dans une fourchette de poids saine ! Pour affiner votre sangle abdominale ou éliminer de petites toxines localisées, une cure ventre plat ou détox est tout à fait adaptée pour sculpter votre silhouette.";
  } else if (imc >= 25 && imc < 30) {
    imcCategory = "Surpoids";
    imcColor = "#f59e0b"; // Amber
    imcTextColor = "text-amber-500";
    imcAdvice = "Votre IMC indique un léger surpoids. Nos cures botaniques (Skinny pour un résultat express, ou Kaylie pour un rééquilibrage de fond) combinées à une alimentation contrôlée vous aideront à éliminer l'excès de masse graisseuse durablement.";
  } else if (imc >= 30 && imc < 35) {
    imcCategory = "Obésité modérée";
    imcColor = "#ef4444"; // Red
    imcTextColor = "text-red-500";
    imcAdvice = "Votre IMC indique une obésité modérée. Il est fortement recommandé d'adopter une cure d'un mois complète, comme le Pack Gélules Kaylie + Thé Détox, pour stimuler activement la combustion des graisses profondes et drainer l'organisme.";
  } else {
    imcCategory = "Obésité sévère / morbide";
    imcColor = "#b91c1c"; // Dark Red
    imcTextColor = "text-red-700 dark:text-red-400";
    imcAdvice = "Votre IMC indique une obésité importante. Nous vous conseillons notre Cure Intensive Minceur d'un mois complet (Gélules Minceur Kaylie) pour amorcer une perte de poids significative (supérieure à 9kg), tout en sollicitant un accompagnement médical.";
  }

  // Recommended weight range (Normal BMI range 18.5 - 24.9)
  const minNormalWeight = Math.round(18.5 * heightInMeters * heightInMeters);
  const maxNormalWeight = Math.round(24.9 * heightInMeters * heightInMeters);

  // Recommended Product Recommendation Object
  const recommendedProduct = RECOMMENDATIONS[formData.objective];

  const handleAddToCart = () => {
    addItem({
      productId: recommendedProduct.id,
      variantId: null,
      sku: recommendedProduct.sku,
      name: recommendedProduct.name,
      price: recommendedProduct.price,
      imageUrl: recommendedProduct.imageUrl,
      quantity: 1,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 relative overflow-hidden" style={{ background: "var(--color-theme-bg)", color: "var(--color-theme-fg)" }}>
      {/* Background gradients */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-10 pointer-events-none"
        style={{ background: "var(--color-theme-accent)" }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[150px] opacity-5 pointer-events-none"
        style={{ background: "var(--color-theme-accent)" }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header Title */}
        <div className="text-center mb-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4" 
              style={{ background: "rgba(var(--color-theme-accent-rgb), 0.1)", color: "var(--color-theme-accent)", border: "1px solid rgba(var(--color-theme-accent-rgb), 0.15)" }}>
              <Calculator className="w-3.5 h-3.5" />
              Bilan Minceur Premium
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Déterminez Votre Profil & Recevez Vos Conseils
            </h1>
            <p className="text-sm max-w-xl mx-auto opacity-70">
              Calculez votre IMC en 1 minute, découvrez votre poids cible et obtenez une recommandation de cure botanique sur-mesure.
            </p>
          </ScrollReveal>
        </div>

        {/* Multi-step Quiz Card */}
        <div className="rounded-3xl border shadow-xl overflow-hidden transition-all duration-300"
          style={{ 
            background: "var(--color-theme-card)", 
            borderColor: "var(--color-theme-border)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
          }}>
          
          {/* Progress Bar (Visible only for quiz steps) */}
          {step <= 3 && (
            <div className="w-full h-1.5 flex bg-neutral-200 dark:bg-neutral-800">
              <div 
                className="h-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${(step / 3) * 100}%`,
                  background: "var(--color-theme-accent)"
                }}
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            {/* ================= STEP 1: GENERAL PROFILE ================= */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: "var(--color-theme-accent)", color: "var(--color-theme-bg)" }}>1</div>
                  <h2 className="text-xl font-bold font-serif">Votre profil & mode de vie</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gender selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-60">Civilité / Genre</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => updateField("gender", "femme")}
                        className="py-3 px-4 rounded-xl font-bold text-sm border transition-all flex items-center justify-center gap-2 cursor-pointer"
                        style={{
                          background: formData.gender === "femme" ? "rgba(var(--color-theme-accent-rgb), 0.08)" : "transparent",
                          borderColor: formData.gender === "femme" ? "var(--color-theme-accent)" : "var(--color-theme-border)",
                          color: formData.gender === "femme" ? "var(--color-theme-accent)" : "var(--color-theme-fg)"
                        }}>
                        👩 Femme
                      </button>
                      <button
                        onClick={() => updateField("gender", "homme")}
                        className="py-3 px-4 rounded-xl font-bold text-sm border transition-all flex items-center justify-center gap-2 cursor-pointer"
                        style={{
                          background: formData.gender === "homme" ? "rgba(var(--color-theme-accent-rgb), 0.08)" : "transparent",
                          borderColor: formData.gender === "homme" ? "var(--color-theme-accent)" : "var(--color-theme-border)",
                          color: formData.gender === "homme" ? "var(--color-theme-accent)" : "var(--color-theme-fg)"
                        }}>
                        👨 Homme
                      </button>
                    </div>
                  </div>

                  {/* Age Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-60">Âge ({formData.age} ans)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="15"
                        max="85"
                        value={formData.age}
                        onChange={(e) => updateField("age", parseInt(e.target.value))}
                        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                        style={{ background: "var(--color-theme-border)", accentColor: "var(--color-theme-accent)" }}
                      />
                      <input
                        type="number"
                        min="15"
                        max="85"
                        value={formData.age}
                        onChange={(e) => updateField("age", Math.min(85, Math.max(15, parseInt(e.target.value) || 15)))}
                        className="w-16 text-center py-1.5 border rounded-lg text-sm font-bold bg-transparent outline-none focus:border-emerald-500"
                        style={{ borderColor: "var(--color-theme-border)" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Activity level selection */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-60">Niveau d'activité physique quotidien</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "sedentaire", title: "Sédentaire", desc: "Peu ou pas d'exercice (bureau, trajets passifs)", emoji: "🪑" },
                      { id: "modere", title: "Modéré / Actif léger", desc: "Marche quotidienne, 1-2 séances par semaine", emoji: "🚶" },
                      { id: "actif", title: "Actif", desc: "Sport régulier 3-4 fois par semaine, travail debout", emoji: "🏃" },
                      { id: "intense", title: "Intense / Athlète", desc: "Entraînement quotidien lourd ou métier très physique", emoji: "⚡" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => updateField("activity", item.id as any)}
                        className="p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer flex gap-3 items-start hover:border-emerald-500"
                        style={{
                          background: formData.activity === item.id ? "rgba(var(--color-theme-accent-rgb), 0.05)" : "transparent",
                          borderColor: formData.activity === item.id ? "var(--color-theme-accent)" : "var(--color-theme-border)",
                        }}>
                        <span className="text-2xl mt-0.5">{item.emoji}</span>
                        <div>
                          <h4 className="font-bold text-sm" style={{ color: formData.activity === item.id ? "var(--color-theme-accent)" : "var(--color-theme-fg)" }}>
                            {item.title}
                          </h4>
                          <p className="text-[11px] opacity-60 mt-0.5 leading-snug">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all hover:opacity-90"
                    style={{ background: "var(--color-theme-accent)", color: "var(--color-theme-bg)" }}>
                    Continuer
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 2: MEASUREMENTS ================= */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: "var(--color-theme-accent)", color: "var(--color-theme-bg)" }}>2</div>
                  <h2 className="text-xl font-bold font-serif">Vos mensurations physiques</h2>
                </div>

                <div className="space-y-6">
                  {/* Height Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider opacity-60">Taille</label>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formData.height} cm ({(formData.height / 100).toFixed(2)} m)</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="120"
                        max="220"
                        value={formData.height}
                        onChange={(e) => updateField("height", parseInt(e.target.value))}
                        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                        style={{ background: "var(--color-theme-border)", accentColor: "var(--color-theme-accent)" }}
                      />
                      <input
                        type="number"
                        min="120"
                        max="220"
                        value={formData.height}
                        onChange={(e) => updateField("height", Math.min(220, Math.max(120, parseInt(e.target.value) || 120)))}
                        className="w-20 text-center py-1.5 border rounded-lg text-sm font-bold bg-transparent outline-none focus:border-emerald-500"
                        style={{ borderColor: "var(--color-theme-border)" }}
                      />
                    </div>
                  </div>

                  {/* Weight Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider opacity-60">Poids actuel</label>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formData.weight} kg</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="35"
                        max="160"
                        value={formData.weight}
                        onChange={(e) => updateField("weight", parseInt(e.target.value))}
                        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                        style={{ background: "var(--color-theme-border)", accentColor: "var(--color-theme-accent)" }}
                      />
                      <input
                        type="number"
                        min="35"
                        max="160"
                        value={formData.weight}
                        onChange={(e) => updateField("weight", Math.min(160, Math.max(35, parseInt(e.target.value) || 35)))}
                        className="w-20 text-center py-1.5 border rounded-lg text-sm font-bold bg-transparent outline-none focus:border-emerald-500"
                        style={{ borderColor: "var(--color-theme-border)" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Display preliminary info */}
                <div className="p-4 rounded-xl border flex items-center gap-4" style={{ background: "rgba(var(--color-theme-accent-rgb), 0.02)", borderColor: "var(--color-theme-border)" }}>
                  <Scale className="w-10 h-10 opacity-40 text-emerald-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider opacity-60">Estimation rapide</h4>
                    <p className="text-xs opacity-75 mt-0.5">
                      Avec une taille de {formData.height} cm et un poids de {formData.weight} kg, votre indice IMC calculé sera de <strong className="text-emerald-500">{imc}</strong>. Les détails complets s'afficheront à l'étape suivante.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={handlePrev}
                    className="px-5 py-3 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    style={{ borderColor: "var(--color-theme-border)", color: "var(--color-theme-fg)" }}>
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all hover:opacity-90"
                    style={{ background: "var(--color-theme-accent)", color: "var(--color-theme-bg)" }}>
                    Continuer
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 3: OBJECTIVES ================= */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: "var(--color-theme-accent)", color: "var(--color-theme-bg)" }}>3</div>
                  <h2 className="text-xl font-bold font-serif">Vos objectifs bien-être & minceur</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Slimming Objective */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-60">Quel est votre objectif prioritaire ?</label>
                    <div className="flex flex-col gap-2">
                      {[
                        { id: "ventre-plat", label: "Cibler le ventre plat (1-5 kg)", desc: "Éliminer ballonnements, affiner la taille" },
                        { id: "perte-rapide", label: "Perte de poids express (1-9 kg)", desc: "Cure intensive courte d'une semaine" },
                        { id: "perte-intensive", label: "Perte profonde & durable (9 kg+)", desc: "Cure d'un mois stabilisante et durable" },
                        { id: "detox-energie", label: "Détoxification & Énergie", desc: "Drainage profond, vitalité et légèreté" }
                      ].map((obj) => (
                        <button
                          key={obj.id}
                          onClick={() => updateField("objective", obj.id as any)}
                          className="p-3 text-left border rounded-xl transition-all cursor-pointer hover:border-emerald-500"
                          style={{
                            background: formData.objective === obj.id ? "rgba(var(--color-theme-accent-rgb), 0.05)" : "transparent",
                            borderColor: formData.objective === obj.id ? "var(--color-theme-accent)" : "var(--color-theme-border)"
                          }}>
                          <div className="font-bold text-xs" style={{ color: formData.objective === obj.id ? "var(--color-theme-accent)" : "var(--color-theme-fg)" }}>
                            {obj.label}
                          </div>
                          <p className="text-[10px] opacity-60 mt-0.5">{obj.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Body target area */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-60">Quelle zone du corps voulez-vous cibler ?</label>
                    <div className="flex flex-col gap-2">
                      {[
                        { id: "ventre", label: "Sangle abdominale (Estomac/Taille)", emoji: "🎯" },
                        { id: "cuisses", label: "Hanches, fesses & cuisses", emoji: "🦵" },
                        { id: "corps-entier", label: "Réduction globale de la masse grasse", emoji: "🧍" },
                        { id: "drainage", label: "Rétention d'eau & drainage lymphatique", emoji: "💧" }
                      ].map((area) => (
                        <button
                          key={area.id}
                          onClick={() => updateField("targetArea", area.id as any)}
                          className="p-3 text-left border rounded-xl transition-all cursor-pointer flex items-center justify-between hover:border-emerald-500"
                          style={{
                            background: formData.targetArea === area.id ? "rgba(var(--color-theme-accent-rgb), 0.05)" : "transparent",
                            borderColor: formData.targetArea === area.id ? "var(--color-theme-accent)" : "var(--color-theme-border)"
                          }}>
                          <div className="font-bold text-xs" style={{ color: formData.targetArea === area.id ? "var(--color-theme-accent)" : "var(--color-theme-fg)" }}>
                            {area.label}
                          </div>
                          <span className="text-sm">{area.emoji}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={handlePrev}
                    className="px-5 py-3 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    style={{ borderColor: "var(--color-theme-border)", color: "var(--color-theme-fg)" }}>
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all hover:opacity-90 shadow-md"
                    style={{ background: "var(--color-theme-accent)", color: "var(--color-theme-bg)" }}>
                    Générer mon bilan
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 4: RESULTS DASHBOARD ================= */}
            {step === 4 && (
              <div className="space-y-8">
                
                {/* Visual success banner */}
                <div className="text-center pb-4 border-b" style={{ borderColor: "var(--color-theme-border)" }}>
                  <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3 animate-bounce"
                    style={{ background: "rgba(16,185,129,0.1)", color: "#10B981" }}>
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold">Votre Bilan Minceur Personnalisé</h2>
                  <p className="text-xs opacity-60 mt-1">Calculé en temps réel selon les algorithmes nutritionnels Caroana Minceur</p>
                </div>

                {/* IMC Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Column: Gauge and numbers */}
                  <div className="md:col-span-5 p-5 rounded-2xl border flex flex-col justify-center items-center text-center"
                    style={{ background: "rgba(var(--color-theme-accent-rgb), 0.02)", borderColor: "var(--color-theme-border)" }}>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Indice de Masse Corporelle</span>
                    <span className="text-5xl font-black font-serif my-2 tracking-tight" style={{ color: imcColor }}>
                      {imc}
                    </span>
                    <span className={`text-sm font-black px-3 py-1 rounded-full bg-white dark:bg-neutral-900 border text-center shadow-sm ${imcTextColor}`}>
                      {imcCategory}
                    </span>

                    {/* Animated visual gauge slider representation */}
                    <div className="w-full mt-6 bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full relative overflow-hidden">
                      {/* Color blocks mapping */}
                      <div className="absolute inset-y-0 left-0 w-[46%] bg-blue-400" />
                      <div className="absolute inset-y-0 left-[46%] w-[16%] bg-emerald-500" />
                      <div className="absolute inset-y-0 left-[62%] w-[13%] bg-amber-500" />
                      <div className="absolute inset-y-0 left-[75%] w-[13%] bg-red-500" />
                      <div className="absolute inset-y-0 left-[88%] w-[12%] bg-red-800" />
                      
                      {/* Indicator mark */}
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-white border border-black shadow z-10" 
                        style={{ 
                          // Scale BMI value from 15 to 40 inside 0% to 100%
                          left: `${Math.min(98, Math.max(2, ((imc - 15) / 25) * 100))}%` 
                        }}
                      />
                    </div>
                    
                    {/* Gauge labels */}
                    <div className="w-full flex justify-between text-[8px] opacity-40 uppercase font-black tracking-widest mt-2 px-1">
                      <span>15 (Maigre)</span>
                      <span>22 (Normal)</span>
                      <span>30 (Obèse)</span>
                    </div>
                  </div>

                  {/* Right Column: Calculations & Analysis */}
                  <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        <h3 className="font-bold text-sm uppercase tracking-wider opacity-85">Analyse de masse</h3>
                      </div>
                      
                      <p className="text-xs leading-relaxed opacity-75">
                        {imcAdvice}
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-xl border bg-stone-50/50 dark:bg-neutral-900/50" style={{ borderColor: "var(--color-theme-border)" }}>
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block">Fourchette cible saine</span>
                          <strong className="text-sm block mt-0.5 text-emerald-600 dark:text-emerald-400">
                            {minNormalWeight} kg - {maxNormalWeight} kg
                          </strong>
                        </div>
                        <div className="p-3 rounded-xl border bg-stone-50/50 dark:bg-neutral-900/50" style={{ borderColor: "var(--color-theme-border)" }}>
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block">Métabolisme de base</span>
                          <strong className="text-sm block mt-0.5 text-emerald-600 dark:text-emerald-400">
                            {/* Simple Harris-Benedict formula estimation */}
                            {formData.gender === "femme" 
                              ? Math.round(655 + (9.6 * formData.weight) + (1.8 * formData.height) - (4.7 * formData.age))
                              : Math.round(66 + (13.7 * formData.weight) + (5 * formData.height) - (6.8 * formData.age))} kcal/jour
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Drink / Water recommendation */}
                    <div className="p-3 rounded-xl border flex items-start gap-2.5" style={{ borderColor: "var(--color-theme-border)", background: "rgba(16,185,129,0.03)" }}>
                      <Leaf className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div className="text-[11px] leading-snug opacity-80">
                        <strong>Conseil hydratation active :</strong> Votre profil d'activité nécessite de consommer environ <strong>{(formData.weight * 0.035).toFixed(1)} Litres</strong> d'eau par jour. Infusez vos tisanes minceur le matin à jeun et le soir 30 min avant le coucher pour optimiser le drainage lymphatique.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommended Product Box */}
                <div className="border-2 rounded-2xl overflow-hidden shadow-md flex flex-col md:flex-row"
                  style={{ borderColor: "var(--color-theme-accent)" }}>
                  
                  {/* Image side */}
                  <div className="md:w-1/3 relative min-h-[160px] bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={recommendedProduct.imageUrl}
                      alt={recommendedProduct.name}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                      {recommendedProduct.badge}
                    </div>
                  </div>

                  {/* Details side */}
                  <div className="md:w-2/3 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[9px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">Cure Recommandée</span>
                          <h3 className="font-serif text-lg font-bold mt-0.5 leading-snug">{recommendedProduct.name}</h3>
                        </div>
                        <div className="text-right">
                          <span className="text-xs opacity-50 line-through block">
                            {Math.round(recommendedProduct.price * 1.25).toLocaleString("fr-FR")} FCFA
                          </span>
                          <strong className="text-lg font-serif text-emerald-600 dark:text-emerald-400">
                            {recommendedProduct.price.toLocaleString("fr-FR")} FCFA
                          </strong>
                        </div>
                      </div>

                      <p className="text-xs opacity-75 mt-2 leading-relaxed">
                        {recommendedProduct.description}
                      </p>

                      <ul className="mt-3 space-y-1.5">
                        {recommendedProduct.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-[11px] font-medium text-stone-700 dark:text-stone-300">
                            <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 pt-3 border-t flex flex-col sm:flex-row gap-3 items-center justify-between" style={{ borderColor: "var(--color-theme-border)" }}>
                      <span className="text-[10px] opacity-50 font-bold uppercase tracking-wider">
                        Livraison Abidjan & Intérieur disponible
                      </span>
                      
                      <div className="flex gap-2 w-full sm:w-auto">
                        {isAdded ? (
                          <div className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 text-white bg-emerald-600 shadow-lg animate-pulse">
                            <Check className="w-4 h-4" />
                            Ajouté au panier !
                          </div>
                        ) : (
                          <button
                            onClick={handleAddToCart}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 text-white transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md"
                            style={{ background: "var(--color-theme-accent)", boxShadow: "0 4px 15px rgba(var(--color-theme-accent-rgb), 0.3)" }}>
                            <ShoppingBag className="w-4 h-4" />
                            Ajouter & Commander
                          </button>
                        )}
                        
                        <Link
                          href="/panier"
                          className="px-4 py-2.5 rounded-xl border text-[11px] font-bold uppercase tracking-wider text-center transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800"
                          style={{ borderColor: "var(--color-theme-border)" }}>
                          Voir Panier
                        </Link>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Buttons block */}
                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => setStep(3)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
                    style={{ borderColor: "var(--color-theme-border)", color: "var(--color-theme-fg)" }}>
                    Modifier les réponses
                  </button>
                  <Link
                    href="/boutique"
                    className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group hover:underline">
                    Explorer la boutique complète
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Informative footer card */}
        <div className="mt-8 text-center text-[10px] opacity-40 leading-relaxed max-w-lg mx-auto">
          Ce bilan d'Indice de Masse Corporelle est fourni à titre indicatif selon les recommandations de santé standard de l'OMS (Organisation Mondiale de la Santé) pour les adultes âgés de 18 à 65 ans. Les produits Caroana sont des compléments alimentaires naturels à base de plantes et ne remplacent pas une alimentation saine ou un suivi diététique spécialisé.
        </div>
      </div>
    </main>
  );
}
