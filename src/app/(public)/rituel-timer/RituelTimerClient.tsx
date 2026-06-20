"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Thermometer, Leaf, Clock, Award } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const INFUSIONS = [
  {
    id: "the-detox",
    name: "Thé Détox",
    time: 300, // 5 minutes
    temp: 90,
    water: "250 ml",
    emoji: "🍵",
    color: "var(--color-theme-accent)",
    desc: "Plantes recommandées pour le matin : Kinkéliba et citronnelle pour stimuler l'organisme et drainer en douceur.",
    steps: [
      "Faire chauffer 250 ml d'eau de source à 90°C (frémissante).",
      "Placer un sachet de Thé Détox Caroana dans votre tasse.",
      "Verser l'eau chaude et démarrer l'infusion.",
      "Retirer le sachet, remuer délicatement et déguster tiède."
    ]
  },
  {
    id: "tisane-ventre-plat",
    name: "Tisane Ventre Plat",
    time: 480, // 8 minutes
    temp: 95,
    water: "250 ml",
    emoji: "🌿",
    color: "#10B981",
    desc: "Idéal après le déjeuner ou le dîner : Favorise le confort digestif, limite les ballonnements et affine le ventre.",
    steps: [
      "Chauffer de l'eau à 95°C (premières bulles d'ébullition).",
      "Ajouter une cuillère ou un sachet de Tisane Ventre Plat.",
      "Couvrir la tasse pour préserver les huiles essentielles volatiles.",
      "Filtrer après 8 minutes et boire chaud pour un effet optimal."
    ]
  },
  {
    id: "tisane-minceur",
    name: "Tisane Minceur",
    time: 600, // 10 minutes
    temp: 95,
    water: "300 ml",
    emoji: "🌱",
    color: "#3B82F6",
    desc: "Cure active d'élimination : Permet de détoxifier le foie et les reins en profondeur pour accélérer la perte de poids.",
    steps: [
      "Porter 300 ml d'eau à ébullition (95°C).",
      "Faire infuser le mélange Minceur sous un couvercle.",
      "Laisser infuser 10 minutes complètes pour libérer les actifs drainants.",
      "Consommer tout au long de la journée ou le soir avant le coucher."
    ]
  }
];

export default function RituelTimerClient() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentInfusion = (INFUSIONS[selectedIdx] || INFUSIONS[0])!;

  const [timeLeft, setTimeLeft] = useState(currentInfusion.time);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Update timer duration on change
  useEffect(() => {
    setTimeLeft(currentInfusion.time);
    setIsRunning(false);
    setCurrentStep(0);
  }, [currentInfusion]);

  // Main countdown loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1;
          // Calculate step guidance
          const totalDuration = currentInfusion.time;
          const elapsed = totalDuration - next;
          const stepInterval = totalDuration / currentInfusion.steps.length;
          const computedStep = Math.min(
            Math.floor(elapsed / stepInterval),
            currentInfusion.steps.length - 1
          );
          setCurrentStep(computedStep);

          if (next <= 0) {
            setIsRunning(false);
            playChime();
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, currentInfusion]);

  // Gentle synthesizer chime using Web Audio API
  const playChime = () => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Generate a series of 3 ascending beautiful zen notes
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.15);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + idx * 0.15 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.15 + 0.8);

        osc.start(ctx.currentTime + idx * 0.15);
        osc.stop(ctx.currentTime + idx * 0.15 + 0.85);
      });
    } catch (e) {
      console.warn("Zen audio chime failed", e);
    }
  };

  const handleToggle = () => {
    setIsRunning(!isRunning);
    // Initialize audio context on first click to satisfy browser policies
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(currentInfusion.time);
    setCurrentStep(0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainSecs = secs % 60;
    return `${mins}:${remainSecs.toString().padStart(2, "0")}`;
  };

  const totalTime = currentInfusion.time;
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;

  // SVG dimensions for the circular progress ring
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="pt-16 min-h-screen" style={{ background: "var(--color-theme-bg)", color: "var(--color-theme-fg)" }}>
      {/* ====== HERO & DESCRIPTION ====== */}
      <section className="relative overflow-hidden py-16 border-b" style={{ borderColor: "var(--color-theme-border)" }}>
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(var(--color-theme-accent-rgb), 0.05) 0%, transparent 70%)", filter: "blur(50px)", transform: "translate(-20%, -20%)" }} />

        <div className="max-w-4xl mx-auto px-6 text-center space-y-4 relative z-10">
          <ScrollReveal animation="scale-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest mb-2"
              style={{ background: "rgba(var(--color-theme-accent-rgb), 0.1)", color: "var(--color-theme-accent)", border: "1px solid rgba(var(--color-theme-accent-rgb), 0.2)" }}>
              <Clock className="w-3 h-3" />
              L&apos;art de l&apos;infusion
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={80}>
            <h1 className="font-sans text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none">
              Minuteur de <span style={{ color: "var(--color-theme-accent)" }}>Rituel d&apos;Infusion</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <p className="text-sm max-w-xl mx-auto" style={{ color: "var(--color-theme-muted)" }}>
              Une bonne phytothérapie commence par une infusion parfaite. Laissez-vous guider étape par étape pour libérer la pleine puissance des plantes africaines.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ====== TIMER WORKSPACE ====== */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT: Infusion selector & info */}
            <div className="lg:col-span-5 space-y-6">
              <ScrollReveal animation="fade-up">
                <h2 className="text-xl font-black uppercase tracking-tight mb-4">
                  Sélectionnez <span style={{ color: "var(--color-theme-accent)" }}>Votre Cure</span>
                </h2>
              </ScrollReveal>

              <div className="space-y-3">
                {INFUSIONS.map((inf, idx) => (
                  <ScrollReveal key={inf.id} animation="fade-up" delay={idx * 60}>
                    <button
                      onClick={() => {
                        setSelectedIdx(idx);
                        // reset context sound
                        if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
                          audioCtxRef.current.resume();
                        }
                      }}
                      className="w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all duration-300"
                      style={{
                        background: selectedIdx === idx ? "var(--color-theme-card)" : "transparent",
                        borderColor: selectedIdx === idx ? "var(--color-theme-accent)" : "var(--color-theme-border)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{inf.emoji}</span>
                        <div>
                          <h4 className="text-sm font-black">{inf.name}</h4>
                          <p className="text-[10px]" style={{ color: "var(--color-theme-muted)" }}>{inf.water} · {inf.temp}°C</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-black" style={{ color: selectedIdx === idx ? "var(--color-theme-accent)" : "inherit" }}>
                        <Clock className="w-3.5 h-3.5" />
                        {inf.time / 60} min
                      </div>
                    </button>
                  </ScrollReveal>
                ))}
              </div>

              {/* Infusion Card info */}
              <ScrollReveal animation="fade-up" delay={200}>
                <div className="rounded-2xl p-6 border space-y-4" style={{ background: "var(--color-theme-card)", borderColor: "var(--color-theme-border)" }}>
                  <div className="flex items-center gap-2 text-xs font-bold" style={{ color: "var(--color-theme-accent)" }}>
                    <Award className="w-4 h-4" />
                    Propriétés du Rituel
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--color-theme-muted)" }}>
                    {currentInfusion.desc}
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t" style={{ borderColor: "var(--color-theme-border)" }}>
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-orange-400" />
                      <div>
                        <div className="text-[8px] font-bold uppercase tracking-widest" style={{ color: "var(--color-theme-muted)" }}>Température</div>
                        <div className="text-xs font-black">{currentInfusion.temp}°C</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="text-[8px] font-bold uppercase tracking-widest" style={{ color: "var(--color-theme-muted)" }}>Quantité d&apos;eau</div>
                        <div className="text-xs font-black">{currentInfusion.water}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* RIGHT: Circular countdown visual */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-8">
              <ScrollReveal animation="scale-up" delay={100}>
                <div className="relative w-72 h-72 rounded-full flex items-center justify-center border shadow-2xl overflow-hidden"
                  style={{ background: "var(--color-theme-card)", borderColor: "var(--color-theme-border)" }}>
                  
                  {/* Dynamic CSS Steam/Vapor effect */}
                  {isRunning && (
                    <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-20">
                      <div className="steam-particle" style={{ animationDelay: "0s", left: "45%" }} />
                      <div className="steam-particle" style={{ animationDelay: "1s", left: "50%" }} />
                      <div className="steam-particle" style={{ animationDelay: "2s", left: "55%" }} />
                    </div>
                  )}

                  {/* SVG progress circle */}
                  <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      className="stroke-theme-border"
                      strokeWidth="6"
                      fill="transparent"
                      style={{ stroke: "var(--color-theme-border)" }}
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      stroke={currentInfusion.color}
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear"
                      style={{
                        filter: isRunning ? `drop-shadow(0 0 8px ${currentInfusion.color}a0)` : "none"
                      }}
                    />
                  </svg>

                  {/* Time indicators */}
                  <div className="relative z-10 text-center space-y-1">
                    <span className="text-4xl font-black font-mono tracking-tighter block"
                      style={{ color: timeLeft === 0 ? "var(--color-theme-accent)" : "inherit" }}>
                      {timeLeft === 0 ? "Infusé !" : formatTime(timeLeft)}
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-widest block" style={{ color: "var(--color-theme-muted)" }}>
                      {isRunning ? "Infusion en cours..." : timeLeft === 0 ? "Profitez de votre cure" : "Prêt à démarrer"}
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Controls bar */}
              <ScrollReveal animation="fade-up" delay={200} className="flex gap-4 items-center justify-center">
                {/* Reset button */}
                <button
                  onClick={handleReset}
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer"
                  style={{ borderColor: "var(--color-theme-border)" }}
                  title="Réinitialiser"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Main Play/Pause */}
                <button
                  onClick={handleToggle}
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer font-bold shadow-lg"
                  style={{
                    background: isRunning ? "var(--color-theme-fg)" : "var(--color-theme-accent)",
                    color: isRunning ? "var(--color-theme-bg)" : "var(--color-theme-bg)"
                  }}
                >
                  {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                </button>

                {/* Sound control */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer"
                  style={{ borderColor: "var(--color-theme-border)" }}
                  title={isMuted ? "Activer le son" : "Désactiver le son"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </ScrollReveal>

              {/* Step guidance timeline */}
              <ScrollReveal animation="fade-up" delay={250} className="w-full max-w-md">
                <div className="rounded-2xl p-6 border space-y-4" style={{ background: "var(--color-theme-card)", borderColor: "var(--color-theme-border)" }}>
                  <h3 className="font-sans font-black text-xs uppercase tracking-widest text-center" style={{ color: "var(--color-theme-accent)" }}>
                    Instructions Étape par Étape
                  </h3>

                  <div className="space-y-3.5">
                    {currentInfusion.steps.map((step, idx) => {
                      const isActive = currentStep === idx;
                      const isPast = currentStep > idx;

                      return (
                        <div key={idx} className="flex gap-3.5 items-start transition-opacity duration-300"
                          style={{ opacity: isActive ? 1 : isPast ? 0.45 : 0.25 }}>
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border flex-shrink-0 mt-0.5"
                            style={{
                              background: isActive ? "var(--color-theme-accent)" : "transparent",
                              color: isActive ? "var(--color-theme-bg)" : "inherit",
                              borderColor: isActive ? "var(--color-theme-accent)" : "var(--color-theme-border)"
                            }}
                          >
                            {idx + 1}
                          </span>
                          <p className="text-xs leading-relaxed">{step}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* CSS injection for dynamic steam effect */}
      <style jsx global>{`
        @keyframes steamUp {
          0% {
            transform: translateY(20px) scale(0.8);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-80px) scale(1.5);
            opacity: 0;
          }
        }
        .steam-particle {
          position: absolute;
          width: 8px;
          height: 16px;
          background: rgba(255, 255, 255, 0.45);
          filter: blur(4px);
          border-radius: 50%;
          animation: steamUp 3s infinite ease-out;
        }
      `}</style>
    </div>
  );
}
