"use client";

import { useState } from "react";
import { Sparkles, Activity, Coffee, Droplet, Check } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function HydrationCalculator() {
  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState("medium"); // soft, medium, high

  // Standard water calculation: weight * 35 ml + activity factor
  const calculateNeeds = () => {
    let base = weight * 35; // base in ml
    if (activity === "high") base += 500;
    if (activity === "medium") base += 250;
    return base;
  };

  const totalNeeds = calculateNeeds();
  const detoxTeas = 500; // recommended 2 cups of Thé Détox (500 ml)
  const ventrePlatTeas = 250; // recommended 1 cup of Tisane Ventre Plat (250 ml)
  const cleanWater = Math.max(0, totalNeeds - detoxTeas - ventrePlatTeas);

  return (
    <div className="w-full bg-theme-card border border-theme-border rounded-lg overflow-hidden card-depth p-6 sm:p-10 relative">
      <div className="space-y-8">
        
        {/* Title block */}
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-mono tracking-widest text-theme-accent uppercase font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            Calculateur d'Hydratation & Phytothérapie
          </span>
          <span className="text-[8px] font-mono text-theme-muted">
            Formule OMS Modifiée
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Controls Column (Col 5) */}
          <div className="col-span-12 lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-theme-fg">
                Estimez vos besoins hydriques
              </h3>
              <p className="text-[11px] text-theme-muted leading-relaxed">
                Une hydratation équilibrée démultiplie l'efficacité d'une cure minceur. Ajustez les paramètres pour adapter vos objectifs.
              </p>
            </div>

            {/* Weight Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold text-theme-fg">
                <span>Votre Poids</span>
                <span className="text-theme-accent font-mono">{weight} kg</span>
              </div>
              <input
                type="range"
                min="45"
                max="130"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-1 bg-theme-border rounded-lg appearance-none cursor-pointer accent-theme-accent"
              />
            </div>

            {/* Activity Switcher */}
            <div className="space-y-3">
              <label className="text-[8px] font-bold tracking-widest uppercase text-theme-muted block">Niveau d'activité</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "soft", label: "Sédentaire" },
                  { id: "medium", label: "Actif" },
                  { id: "high", label: "Intense" },
                ].map((act) => (
                  <button
                    key={act.id}
                    onClick={() => setActivity(act.id)}
                    className={`text-[9px] font-bold uppercase tracking-wider py-2.5 border rounded cursor-pointer transition-smooth ${
                      activity === act.id
                        ? "border-theme-accent bg-theme-accent/5 text-theme-accent"
                        : "border-theme-border text-theme-fg/70 hover:bg-theme-fg/5"
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results/Suggestions Column (Col 7) */}
          <div className="col-span-12 lg:col-span-7 bg-theme-bg/60 border border-theme-border rounded-lg p-5 flex flex-col justify-between space-y-6">
            
            {/* Target Display */}
            <div className="text-center sm:text-left">
              <span className="text-[8px] text-theme-muted uppercase font-bold tracking-widest block">Objectif journalier total</span>
              <div className="flex items-baseline justify-center sm:justify-start space-x-1.5 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-theme-fg font-mono">
                  {(totalNeeds / 1000).toFixed(2)}
                </span>
                <span className="text-sm font-bold text-theme-accent">Litres / jour</span>
              </div>
            </div>

            {/* Distribution Grid */}
            <div className="space-y-3.5">
              <span className="text-[8px] text-theme-muted uppercase font-bold tracking-widest block">Répartition recommandée :</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Clean Water */}
                <div className="bg-theme-card border border-theme-border rounded p-3 text-center space-y-1">
                  <Droplet className="w-4 h-4 text-sky-400 mx-auto" />
                  <span className="text-[8px] font-bold text-theme-muted uppercase block">Eau Pure</span>
                  <span className="text-xs font-bold text-theme-fg font-mono">{(cleanWater / 1000).toFixed(2)} L</span>
                </div>

                {/* Thé Détox */}
                <div className="bg-theme-card border border-theme-border rounded p-3 text-center space-y-1">
                  <Coffee className="w-4 h-4 text-theme-accent mx-auto" />
                  <span className="text-[8px] font-bold text-theme-muted uppercase block">Thé Détox</span>
                  <span className="text-xs font-bold text-theme-fg font-mono">{(detoxTeas / 1000).toFixed(2)} L</span>
                </div>

                {/* Tisane */}
                <div className="bg-theme-card border border-theme-border rounded p-3 text-center space-y-1">
                  <Coffee className="w-4 h-4 text-vegetal mx-auto" />
                  <span className="text-[8px] font-bold text-theme-muted uppercase block">Tisane Ventre Plat</span>
                  <span className="text-xs font-bold text-theme-fg font-mono">{(ventrePlatTeas / 1000).toFixed(2)} L</span>
                </div>
              </div>
            </div>

            {/* Dynamic Advice Row */}
            <div className="border-t border-theme-border pt-4 flex items-start space-x-2 text-[10px] text-theme-muted leading-relaxed">
              <Sparkles className="w-4 h-4 text-theme-accent flex-shrink-0 mt-0.5" />
              <span>
                {weight >= 80 ? (
                  "Conseil : Associez votre consommation hydrique à nos Gélules Ventre Plat (2 le matin, 2 le soir) pour accélérer le destockage adipeux."
                ) : (
                  "Conseil : Notre Thé Détox en matinée et la Tisane Ventre Plat en soirée couvrent déjà 30% de vos besoins en favorisant l'effet dégonflement."
                )}
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
