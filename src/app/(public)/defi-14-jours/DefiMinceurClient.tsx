"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Trophy, Award, RefreshCw, CheckCircle, ArrowRight, AwardIcon, Lock, Flame, HelpCircle, Gift } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface DailyHabits {
  morningTea: boolean;
  lunchCapsule: boolean;
  water: boolean;
  activity: boolean;
  eveningTea: boolean;
}

const INITIAL_HABITS: DailyHabits = {
  morningTea: false,
  lunchCapsule: false,
  water: false,
  activity: false,
  eveningTea: false,
};

export default function DefiMinceurClient() {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [habits, setHabits] = useState<DailyHabits>(INITIAL_HABITS);
  const [showCelebration, setShowCelebration] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedCompleted = localStorage.getItem("caroana_defi_completed");
    const savedCurrent = localStorage.getItem("caroana_defi_current");
    const savedHabits = localStorage.getItem("caroana_defi_habits");

    if (savedCompleted) setCompletedDays(JSON.parse(savedCompleted));
    if (savedCurrent) {
      const parsedCurrent = Number(savedCurrent);
      setCurrentDay(parsedCurrent);
    }
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    setIsLoaded(true);
  }, []);

  // Save state to localStorage
  const saveState = (newCompleted: number[], newCurrent: number, newHabits: DailyHabits) => {
    localStorage.setItem("caroana_defi_completed", JSON.stringify(newCompleted));
    localStorage.setItem("caroana_defi_current", String(newCurrent));
    localStorage.setItem("caroana_defi_habits", JSON.stringify(newHabits));
  };

  const handleToggleHabit = (key: keyof DailyHabits) => {
    const updated = { ...habits, [key]: !habits[key] };
    setHabits(updated);
    saveState(completedDays, currentDay, updated);
  };

  const handleValidateDay = () => {
    // If not all habits are checked, let's warn but allow validating
    const allChecked = Object.values(habits).every(Boolean);
    if (!allChecked) {
      if (!confirm("Vous n'avez pas coché toutes vos habitudes aujourd'hui. Voulez-vous quand même valider cette journée ?")) {
        return;
      }
    }

    const updatedCompleted = [...completedDays];
    if (!updatedCompleted.includes(currentDay)) {
      updatedCompleted.push(currentDay);
    }

    let nextDay = currentDay;
    if (currentDay < 14) {
      nextDay = currentDay + 1;
    }

    setCompletedDays(updatedCompleted);
    setCurrentDay(nextDay);
    setHabits(INITIAL_HABITS);
    saveState(updatedCompleted, nextDay, INITIAL_HABITS);

    if (updatedCompleted.length === 14) {
      setShowCelebration(true);
    }
  };

  const handleResetChallenge = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser votre Défi 14 Jours ? Toute votre progression sera perdue.")) {
      setCompletedDays([]);
      setCurrentDay(1);
      setHabits(INITIAL_HABITS);
      setShowCelebration(false);
      saveState([], 1, INITIAL_HABITS);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("DEFI14SUCCESS");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalCompleted = completedDays.length;
  const progressPercent = Math.min(Math.round((totalCompleted / 14) * 100), 100);

  if (!isLoaded) {
    return (
      <div className="py-32 text-center text-xs uppercase tracking-widest text-theme-muted">
        Chargement du Défi...
      </div>
    );
  }

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <ScrollReveal animation="scale-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-bold tracking-widest uppercase"
            style={{
              borderColor: "rgba(var(--color-theme-accent-rgb), 0.3)",
              background: "rgba(var(--color-theme-accent-rgb), 0.05)",
              color: "var(--color-theme-accent)",
            }}>
            <Trophy className="w-3 h-3 text-theme-accent animate-bounce-soft" />
            Challenge Motivation
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={100}>
          <h1 className="font-serif text-4xl sm:text-6xl font-black text-theme-fg uppercase leading-tight">
            Défi Minceur <span className="text-theme-accent">14 Jours</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <p className="text-sm text-theme-muted leading-relaxed font-medium">
            Prenez l&apos;engagement d&apos;adopter votre rituel minceur quotidiennement pendant 14 jours. Suivez vos tâches, restez rigoureuse et débloquez une récompense exclusive de 15% à la fin de votre cure.
          </p>
        </ScrollReveal>
      </div>

      {/* Main Grid: Left is tracking dashboard, Right is calendars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Habits Tracker of Current Day */}
        <div className="lg:col-span-5 bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-premium space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-theme-border/40">
            <div>
              <h3 className="font-serif text-lg font-bold flex items-center gap-2">
                <Flame className="w-5 h-5 text-theme-accent" />
                Jour {currentDay} / 14
              </h3>
              <p className="text-[10px] text-theme-muted uppercase tracking-wider">Vos habitudes d&apos;aujourd&apos;hui</p>
            </div>
            <button
              onClick={handleResetChallenge}
              className="text-[9px] font-bold uppercase tracking-wider text-red-400 hover:text-red-500 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Réinitialiser
            </button>
          </div>

          {totalCompleted === 14 ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-theme-accent/15 border border-theme-accent/30 rounded-full flex items-center justify-center mx-auto text-theme-accent text-3xl">
                🏆
              </div>
              <h4 className="font-serif text-xl font-bold uppercase">Défi Terminé !</h4>
              <p className="text-xs text-theme-muted max-w-sm mx-auto">
                Félicitations pour votre régularité et votre engagement. Vous avez pris soin de votre corps pendant 14 jours complets !
              </p>
              <div className="bg-theme-bg border border-theme-border p-4 rounded-xl space-y-2">
                <div className="text-[9px] font-bold uppercase tracking-widest text-theme-accent">Votre code promo de 15% :</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-base font-bold bg-theme-surface border border-theme-border px-3 py-1 rounded select-all text-theme-fg">
                    DEFI14SUCCESS
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="btn-accent px-3 py-1.5 rounded text-[9px] uppercase tracking-wider font-bold"
                  >
                    {copied ? "Copié !" : "Copier"}
                  </button>
                </div>
              </div>
              <Link href="/boutique" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-theme-accent hover:underline pt-2">
                Profiter de ma réduction en boutique <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Habit list items */}
              {[
                {
                  key: "morningTea" as const,
                  label: "Infusion Matinale (Thé Détox)",
                  desc: "Éveille l'organisme et lance le drainage hépatique.",
                  emoji: "🍵",
                },
                {
                  key: "lunchCapsule" as const,
                  label: "Gélules de Midi (Ventre Plat / Cure)",
                  desc: "Brûle-graisses actif à prendre avant le déjeuner.",
                  emoji: "💊",
                },
                {
                  key: "water" as const,
                  label: "Hydratation Optimale (Min. 2L d'eau)",
                  desc: "Favorise l'élimination rénale et évite la rétention.",
                  emoji: "💧",
                },
                {
                  key: "activity" as const,
                  label: "15 min d'Activité ou Soin Corporel",
                  desc: "Marche active, massage du ventre ou rituel caolin.",
                  emoji: "🏃‍♀️",
                },
                {
                  key: "eveningTea" as const,
                  label: "Tisane du Soir (Légèreté & Transit)",
                  desc: "Infusion douce pour apaiser le ventre avant le coucher.",
                  emoji: "🌿",
                },
              ].map((h) => (
                <div
                  key={h.key}
                  onClick={() => handleToggleHabit(h.key)}
                  className={`flex items-start gap-4 p-3 rounded-xl border cursor-pointer transition-all ${
                    habits[h.key]
                      ? "bg-theme-accent/5 border-theme-accent"
                      : "bg-theme-bg/60 border-theme-border/60 hover:border-theme-border"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs flex-shrink-0 transition-all ${
                      habits[h.key]
                        ? "bg-theme-accent border-theme-accent text-theme-bg"
                        : "border-theme-border text-transparent"
                    }`}
                  >
                    ✓
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{h.emoji}</span>
                      <h4 className={`text-xs font-bold ${habits[h.key] ? "text-theme-fg line-through opacity-80" : "text-theme-fg"}`}>
                        {h.label}
                      </h4>
                    </div>
                    <p className="text-[10px] text-theme-muted mt-0.5">{h.desc}</p>
                  </div>
                </div>
              ))}

              <button
                onClick={handleValidateDay}
                className="w-full btn-accent py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 mt-4"
              >
                <span>Valider la journée</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Progress Meter and 14 Days Grid */}
        <div className="lg:col-span-7 space-y-6">
          {/* Progress Bar Container */}
          <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-premium space-y-3">
            <div className="flex justify-between items-center text-xs font-bold uppercase">
              <span className="text-theme-muted">Progression du défi</span>
              <span className="text-theme-accent">{progressPercent}% ({totalCompleted} / 14 jours)</span>
            </div>
            <div className="w-full h-3 bg-theme-bg border border-theme-border rounded-full overflow-hidden">
              <div
                className="h-full bg-theme-accent transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center gap-2 pt-2 text-[10px] text-theme-muted">
              <Sparkles className="w-3.5 h-3.5 text-theme-accent" />
              <span>Assurez-vous de valider chaque jour consécutivement pour de meilleurs résultats !</span>
            </div>
          </div>

          {/* Grid of 14 Days */}
          <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-premium">
            <h3 className="font-serif text-base font-bold mb-4 uppercase tracking-wider">Le Calendrier du Défi</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 14 }).map((_, i) => {
                const dayNum = i + 1;
                const isCompleted = completedDays.includes(dayNum);
                const isActive = currentDay === dayNum && totalCompleted < 14;
                const isLocked = dayNum > currentDay;

                return (
                  <div
                    key={dayNum}
                    className={`relative p-4 rounded-xl border flex flex-col justify-between h-24 transition-all ${
                      isCompleted
                        ? "bg-theme-accent/5 border-theme-accent/50 text-theme-fg"
                        : isActive
                        ? "bg-theme-surface border-theme-accent shadow-premium shadow-gold ring-1 ring-theme-accent"
                        : "bg-theme-bg/40 border-theme-border text-theme-muted opacity-60"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Jour {dayNum}</span>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-theme-accent" />
                      ) : isActive ? (
                        <span className="w-2 h-2 bg-theme-accent rounded-full ping-dot" />
                      ) : (
                        <Lock className="w-3 h-3 text-theme-muted/50" />
                      )}
                    </div>

                    <div className="text-center font-serif font-black text-2xl tracking-tighter select-none">
                      {isCompleted ? "✓" : isActive ? "✨" : dayNum}
                    </div>

                    <div className="text-[8px] uppercase tracking-wider text-center font-bold">
                      {isCompleted ? (
                        <span className="text-theme-accent">Validé</span>
                      ) : isActive ? (
                        <span className="text-theme-accent">En cours</span>
                      ) : (
                        <span>En attente</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Rewards modal celebratory popup */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-theme-bg/85 backdrop-blur-md animate-fade-in-fast">
          <div className="bg-theme-surface border border-theme-border max-w-md w-full rounded-2xl p-8 shadow-2xl text-center space-y-6 animate-slide-in-up">
            <div className="w-20 h-20 bg-theme-accent/15 border border-theme-accent/30 rounded-full flex items-center justify-center mx-auto text-4xl animate-bounce-soft">
              👑
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-black uppercase text-theme-fg">
                Bravo ! Défi Accompli !
              </h2>
              <p className="text-xs text-theme-muted leading-relaxed">
                Vous avez suivi vos rituels minceur de phytothérapie ivoirienne pendant 14 jours consécutifs avec assiduité et courage !
              </p>
            </div>

            <div className="bg-theme-bg border border-theme-border p-4 rounded-xl space-y-2">
              <div className="text-[8px] font-bold uppercase tracking-widest text-theme-accent">Votre récompense unique :</div>
              <div className="font-serif text-lg font-black tracking-widest text-theme-fg">-15% SUR LA BOUTIQUE</div>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-sm bg-theme-surface border border-theme-border px-3 py-1.5 rounded select-all font-bold text-theme-fg">
                  DEFI14SUCCESS
                </span>
                <button
                  onClick={handleCopyCode}
                  className="btn-accent px-3 py-2 rounded text-[9px] uppercase tracking-wider font-bold"
                >
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowCelebration(false)}
                className="btn-accent py-4 rounded-xl text-xs font-bold uppercase tracking-widest"
              >
                Accéder à mon code promo
              </button>
              <button
                onClick={() => {
                  setShowCelebration(false);
                  handleResetChallenge();
                }}
                className="text-[9px] font-bold uppercase tracking-wider text-theme-muted hover:underline"
              >
                Recommencer le défi à zéro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
