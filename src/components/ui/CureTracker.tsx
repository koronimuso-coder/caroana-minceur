"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, RotateCcw, Calendar, Flame, Sparkles } from "lucide-react";

export default function CureTracker() {
  const [cureType, setCureType] = useState<14 | 28>(14);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedType = localStorage.getItem("caroana-cure-type");
    const savedDays = localStorage.getItem("caroana-cure-days");
    if (savedType) {
      setCureType(Number(savedType) as 14 | 28);
    }
    if (savedDays) {
      try {
        setCompletedDays(JSON.parse(savedDays));
      } catch (e) {
        setCompletedDays([]);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  const saveState = (type: 14 | 28, days: number[]) => {
    localStorage.setItem("caroana-cure-type", String(type));
    localStorage.setItem("caroana-cure-days", JSON.stringify(days));
  };

  const handleCureTypeChange = (type: 14 | 28) => {
    setCureType(type);
    // Filter completed days that exceed the new limit
    const filteredDays = completedDays.filter((day) => day <= type);
    setCompletedDays(filteredDays);
    saveState(type, filteredDays);
  };

  const toggleDay = (day: number) => {
    let newDays;
    if (completedDays.includes(day)) {
      newDays = completedDays.filter((d) => d !== day);
    } else {
      newDays = [...completedDays, day].sort((a, b) => a - b);
    }
    setCompletedDays(newDays);
    saveState(cureType, newDays);
  };

  const resetTracker = () => {
    if (window.confirm("Voulez-vous vraiment réinitialiser votre suivi de cure ?")) {
      setCompletedDays([]);
      saveState(cureType, []);
    }
  };

  const progressPercentage = Math.round((completedDays.length / cureType) * 100);

  // Daily tips for motivation
  const getDailyTip = () => {
    const activeDay = completedDays.length > 0 ? Math.max(...completedDays) : 0;
    
    const tips14 = [
      "Préparez votre corps : commencez la journée avec une infusion tiède de Citronnelle Sauvage.",
      "Détoxification active : buvez 2,5 litres d'eau aujourd'hui pour aider à éliminer les toxines.",
      "Ventre plat : massez doucement votre abdomen dans le sens des aiguilles d'une montre.",
      "Régulation du transit : privilégiez les légumes verts et les fibres lors du repas du soir.",
      "Relance métabolique : faites 15 minutes de marche active après le repas de midi.",
      "Cure de tisane : notre Tisane Ventre Plat agit en douceur durant la nuit, soyez assidu(e) !",
      "Mi-chemin : votre corps commence à s'habituer à l'action bienfaisante du Kinkeliba.",
      "Élimination douce : réduisez le sel aujourd'hui pour limiter la rétention d'eau.",
      "Vitalité accrue : ressentez la légèreté physique s'installer. Continuez vos gélules !",
      "Routine matinale : prenez vos gélules avec un grand verre d'eau citronnée.",
      "Hydratation saine : remplacez toutes les boissons sucrées par notre thé détox glacé.",
      "Focus silhouette : tenez-vous droit(e) et contractez légèrement les abdos au repos.",
      "Phase finale : votre système digestif est purifié et désencombré, bravo !",
      "Victoire : 14 jours de pureté végétale. Prenez le temps d'admirer les bienfaits !",
    ];

    const tips28 = [
      "Jour 1 : Bienvenue dans votre cure silhouette. Prenez vos mesures ce matin.",
      "Jour 3 : L'infusion Kinkeliba active l'élimination rénale dès les premiers jours.",
      "Jour 5 : Prenez 10 minutes pour respirer profondément et oxygéner vos tissus.",
      "Jour 7 : Première semaine complétée ! Votre digestion est déjà plus légère.",
      "Jour 10 : Évitez les graisses saturées pour maximiser l'effet des capsules minceur.",
      "Jour 12 : Un sommeil de 8h favorise la perte de poids naturelle. Dormez bien !",
      "Jour 14 : Bilan de mi-cure. Votre silhouette s'affine, persistez !",
      "Jour 17 : Augmentez légèrement l'activité physique pour tonifier les muscles.",
      "Jour 20 : Intégrez du gingembre frais dans votre alimentation pour stimuler la cure.",
      "Jour 22 : Votre transit est régulé, la sensation de ballonnement s'estompe.",
      "Jour 25 : Presque au bout ! Restez concentré(e) sur vos rituels matin et soir.",
      "Jour 28 : Félicitations ! Votre cure de transformation silhouette est un succès !",
    ];

    if (cureType === 14) {
      return tips14[Math.min(activeDay, tips14.length - 1)];
    } else {
      // For 28 days, calculate closest advice index
      const index = Math.min(Math.floor(activeDay / 2.5), tips28.length - 1);
      return tips28[index];
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-theme-card border border-theme-border rounded-lg p-6 sm:p-8 space-y-6 relative overflow-hidden transition-smooth">
      {/* Mesh mesh contour pattern */}
      <div className="absolute inset-0 pattern-mesh opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-theme-accent" />
            <span className="text-[10px] font-mono tracking-widest text-theme-accent uppercase font-bold">Tableau de Bord</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-theme-fg">Mon Suivi de Cure</h3>
        </div>

        {/* Cure Selectors */}
        <div className="flex gap-2 bg-theme-bg/60 p-1 border border-theme-border rounded">
          <button
            onClick={() => handleCureTypeChange(14)}
            className={`px-3 py-1.5 text-[9px] font-bold tracking-wider uppercase rounded transition-smooth cursor-pointer ${
              cureType === 14
                ? "bg-theme-accent text-theme-bg"
                : "text-theme-fg/60 hover:text-theme-fg"
            }`}
          >
            14 Jours
          </button>
          <button
            onClick={() => handleCureTypeChange(28)}
            className={`px-3 py-1.5 text-[9px] font-bold tracking-wider uppercase rounded transition-smooth cursor-pointer ${
              cureType === 28
                ? "bg-theme-accent text-theme-bg"
                : "text-theme-fg/60 hover:text-theme-fg"
            }`}
          >
            28 Jours
          </button>
        </div>
      </div>

      {/* Main Grid & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-stretch">
        
        {/* Left: Progress Circle or bar */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-theme-bg/40 border border-theme-border/50 rounded-lg p-6 text-center space-y-6">
          <div className="space-y-2">
            <span className="text-[8px] font-mono text-theme-fg/40 uppercase tracking-widest">Progression de cure</span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-black text-theme-fg font-sans text-glow">{progressPercentage}%</span>
              <span className="text-xs font-bold text-theme-accent">{completedDays.length}/{cureType} j</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-theme-border/30 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-theme-accent h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="text-[10px] text-theme-fg/70 font-medium leading-relaxed flex items-center justify-center gap-2">
            <Flame className="w-4 h-4 text-theme-accent animate-pulse" />
            <span>
              {completedDays.length === cureType 
                ? "Félicitations, cure complétée !" 
                : `${cureType - completedDays.length} jours restants pour atteindre votre objectif.`}
            </span>
          </div>

          <button
            onClick={resetTracker}
            className="flex items-center justify-center gap-1.5 py-2 px-3 border border-theme-border/60 rounded text-[9px] font-bold uppercase tracking-widest text-theme-fg/50 hover:text-theme-accent hover:border-theme-accent transition-smooth cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>
        </div>

        {/* Middle/Right: Grid of days */}
        <div className="lg:col-span-8 space-y-6 flex flex-col justify-between">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: cureType }).map((_, index) => {
              const dayNum = index + 1;
              const isChecked = completedDays.includes(dayNum);
              return (
                <button
                  key={dayNum}
                  onClick={() => toggleDay(dayNum)}
                  className={`aspect-square rounded border transition-all duration-300 flex flex-col items-center justify-center relative group cursor-pointer ${
                    isChecked
                      ? "bg-theme-accent border-theme-accent text-theme-bg font-sans font-black shadow-gold scale-[0.98]"
                      : "border-theme-border hover:border-theme-accent/40 text-theme-fg/70 hover:text-theme-fg"
                  }`}
                  aria-label={`Jour ${dayNum}`}
                >
                  <span className="text-xs font-bold font-mono">{dayNum.toString().padStart(2, "0")}</span>
                  {isChecked && (
                    <CheckCircle2 className="w-2.5 h-2.5 absolute top-1 right-1 text-theme-bg" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Daily Advice Box */}
          <div className="bg-theme-accent/5 border border-theme-accent/15 p-4 rounded-lg flex items-start gap-3">
            <Sparkles className="w-4.5 h-4.5 text-theme-accent mt-0.5 flex-shrink-0 animate-spin-slow" style={{ animationDuration: "8s" }} />
            <div className="space-y-1">
              <span className="text-[8px] font-bold text-theme-accent uppercase tracking-widest">Conseil du Jour</span>
              <p className="text-xs font-medium text-theme-fg/90 leading-relaxed">
                {getDailyTip()}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
