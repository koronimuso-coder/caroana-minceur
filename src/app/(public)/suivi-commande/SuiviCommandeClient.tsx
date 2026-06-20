"use client";

import { useState } from "react";
import { Search, Loader2, Package, Truck, CheckCircle2, MessageCircle, AlertCircle, Calendar, ClipboardList } from "lucide-react";
import { getTrackingOrder, TrackingResult } from "@/server/actions/order-tracking.action";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function SuiviCommandeClient() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await getTrackingOrder(query);
      setResult(res);
    } catch (err) {
      setResult({ success: false, error: "Une erreur réseau est survenue. Veuillez réessayer." });
    } finally {
      setLoading(false);
    }
  };

  // Stepper status computation
  const getStepStatus = (statusName: string, order: any) => {
    const fStatus = order.fulfillmentStatus; // unfulfilled, processing, ready, shipped, delivered, cancelled
    const pStatus = order.paymentStatus;     // pending, verification_required, paid, failed

    const steps = ["received", "processing", "shipped", "delivered"];
    let currentStepIdx = 0; // default received

    if (fStatus === "cancelled") return "cancelled";

    if (fStatus === "delivered") {
      currentStepIdx = 3;
    } else if (fStatus === "shipped") {
      currentStepIdx = 2;
    } else if (fStatus === "processing" || fStatus === "ready" || pStatus === "paid") {
      currentStepIdx = 1;
    } else {
      currentStepIdx = 0;
    }

    const stepIndexMap: Record<string, number> = {
      received: 0,
      processing: 1,
      shipped: 2,
      delivered: 3,
    };

    const targetIdx = stepIndexMap[statusName] ?? 0;
    if (targetIdx < currentStepIdx) return "completed";
    if (targetIdx === currentStepIdx) return "active";
    return "pending";
  };

  const getFulfillmentText = (status: string) => {
    switch (status) {
      case "unfulfilled": return "En attente de traitement";
      case "processing": return "En cours de préparation par l'herboriste";
      case "ready": return "Colis préparé et prêt pour le livreur";
      case "shipped": return "Remis au livreur (En cours d'expédition)";
      case "delivered": return "Livraison effectuée avec succès";
      case "cancelled": return "Commande annulée";
      default: return status;
    }
  };

  // Generate customized advice based on ordered items
  const getBotanicalAdvice = (items: Array<{ name: string }>) => {
    const adviceList = [];
    const names = items.map(it => it.name.toLowerCase());

    const hasGelules = names.some(n => n.includes("gélule") || n.includes("gelule"));
    const hasThe = names.some(n => n.includes("thé") || n.includes("the"));
    const hasTisane = names.some(n => n.includes("tisane"));

    if (hasGelules) {
      adviceList.push({
        title: "💊 Cure Gélules Minceur",
        text: "Prenez 1 à 2 gélules le matin à jeun avec un grand verre d'eau tiède, 30 minutes avant votre petit-déjeuner pour maximiser l'absorption des actifs."
      });
    }
    if (hasThe) {
      adviceList.push({
        title: "🍵 Rituel Thé Détox",
        text: "À consommer de préférence le matin ou en début d'après-midi. Laissez infuser 5 minutes dans une tasse d'eau chaude (90°C) pour un effet drainant et énergisant optimal."
      });
    }
    if (hasTisane) {
      adviceList.push({
        title: "🌿 Rituel Tisane Ventre Plat",
        text: "Buvez votre tisane tiède ou chaude le soir, environ 1 heure après votre dernier repas. Laissez infuser 8 à 10 minutes sous un couvercle pour conserver toutes les huiles bienfaisantes."
      });
    }

    if (adviceList.length === 0) {
      adviceList.push({
        title: "🌱 Cure Botanique Caroana",
        text: "Suivez scrupuleusement les rituels indiqués sur vos flacons et sachets. Hydratez-vous à hauteur de 2L d'eau par jour pour faciliter le drainage des toxines."
      });
    }

    return adviceList;
  };

  return (
    <div className="pt-16 min-h-screen" style={{ background: "var(--color-theme-bg)", color: "var(--color-theme-fg)" }}>
      {/* ====== HEADER ====== */}
      <section className="relative overflow-hidden py-16 border-b" style={{ borderColor: "var(--color-theme-border)" }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(var(--color-theme-accent-rgb), 0.05) 0%, transparent 70%)", filter: "blur(50px)", transform: "translate(20%, -20%)" }} />

        <div className="max-w-4xl mx-auto px-6 text-center space-y-4 relative z-10">
          <ScrollReveal animation="scale-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest mb-2"
              style={{ background: "rgba(var(--color-theme-accent-rgb), 0.1)", color: "var(--color-theme-accent)", border: "1px solid rgba(var(--color-theme-accent-rgb), 0.2)" }}>
              <Package className="w-3 h-3" />
              Suivi de colis temps réel
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={80}>
            <h1 className="font-sans text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none">
              Où est ma <span style={{ color: "var(--color-theme-accent)" }}>Commande ?</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <p className="text-sm max-w-xl mx-auto" style={{ color: "var(--color-theme-muted)" }}>
              Entrez votre numéro de commande (ex: CM-2026-000001) ou votre numéro de téléphone de contact pour suivre la livraison de vos produits minceur.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ====== SEARCH FORM SECTION ====== */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal animation="fade-up">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Numéro de commande (CM-...) ou téléphone (+225...)"
                className="flex-1 px-4 py-3.5 rounded-xl border text-xs bg-transparent focus:outline-none transition-all"
                style={{ borderColor: "var(--color-theme-border)", color: "var(--color-theme-fg)" }}
                onFocus={e => e.target.style.borderColor = "var(--color-theme-accent)"}
                onBlur={e => e.target.style.borderColor = "var(--color-theme-border)"}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                style={{ background: "var(--color-theme-accent)", color: "var(--color-theme-bg)" }}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    Rechercher
                  </>
                )}
              </button>
            </form>
          </ScrollReveal>

          {/* ====== SEARCH RESULTS ====== */}
          <div className="mt-12">
            {result && !result.success && (
              <ScrollReveal animation="fade-up">
                <div className="p-4 rounded-xl border flex items-start gap-3 bg-rose-500/10 text-rose-500 border-rose-500/20 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{result.error}</span>
                </div>
              </ScrollReveal>
            )}

            {result && result.success && result.order && (
              <div className="space-y-8">
                
                {/* 1. PROGRESS STEPPER */}
                <ScrollReveal animation="fade-up">
                  <div className="rounded-2xl p-6 sm:p-8 border space-y-8" style={{ background: "var(--color-theme-card)", borderColor: "var(--color-theme-border)" }}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-4 mb-4" style={{ borderColor: "var(--color-theme-border)" }}>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--color-theme-accent)" }}>Détails Commande</span>
                        <h2 className="text-xl font-black">{result.order.orderNumber}</h2>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[8px] font-bold uppercase tracking-widest block" style={{ color: "var(--color-theme-muted)" }}>Destinataire</span>
                        <span className="text-xs font-black">{result.order.customerName} (Commune : {result.order.commune})</span>
                      </div>
                    </div>

                    {/* Stepper visualization */}
                    <div className="relative flex flex-col sm:flex-row justify-between gap-6 sm:gap-2">
                      {/* Connection bar */}
                      <div className="absolute left-[13px] top-0 bottom-0 w-0.5 sm:left-0 sm:right-0 sm:top-[14px] sm:h-0.5 sm:w-auto hidden sm:block"
                        style={{ background: "var(--color-theme-border)", opacity: 0.5 }} />

                      {[
                        { key: "received", label: "Commande Validée", desc: "Reçue par le système" },
                        { key: "processing", label: "Préparation Herboriste", desc: "Formulations en sachets" },
                        { key: "shipped", label: "Remis au Livreur", desc: "En cours de livraison" },
                        { key: "delivered", label: "Livraison Réussie", desc: "Colis remis en main" }
                      ].map((step, idx) => {
                        const status = getStepStatus(step.key, result.order);
                        const isCompleted = status === "completed";
                        const isActive = status === "active";

                        return (
                          <div key={step.key} className="flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-4 sm:gap-2 relative z-10 flex-1">
                            <span
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border flex-shrink-0"
                              style={{
                                background: isCompleted || isActive ? "var(--color-theme-accent)" : "var(--color-theme-card)",
                                color: isCompleted || isActive ? "var(--color-theme-bg)" : "var(--color-theme-muted)",
                                borderColor: isCompleted || isActive ? "var(--color-theme-accent)" : "var(--color-theme-border)",
                                boxShadow: isActive ? "0 0 12px rgba(var(--color-theme-accent-rgb), 0.5)" : "none",
                                animation: isActive ? "pulse-glow 2s infinite" : "none"
                              }}
                            >
                              {isCompleted ? "✓" : idx + 1}
                            </span>
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-tight"
                                style={{ color: isActive ? "var(--color-theme-accent)" : "inherit" }}>
                                {step.label}
                              </h4>
                              <p className="text-[9px] mt-0.5" style={{ color: "var(--color-theme-muted)" }}>{step.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-4 rounded-xl border text-xs font-bold text-center mt-6"
                      style={{ background: "rgba(var(--color-theme-accent-rgb), 0.04)", borderColor: "rgba(var(--color-theme-accent-rgb), 0.15)" }}>
                      Statut actuel : <span style={{ color: "var(--color-theme-accent)" }}>{getFulfillmentText(result.order.fulfillmentStatus)}</span>
                    </div>
                  </div>
                </ScrollReveal>

                {/* 2. SUMMARY OF ITEMS & BOTANICAL DOSAGE ADVICE */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Left: ordered items list */}
                  <div className="md:col-span-5">
                    <ScrollReveal animation="fade-up" delay={80}>
                      <div className="rounded-2xl p-6 border space-y-4" style={{ background: "var(--color-theme-card)", borderColor: "var(--color-theme-border)" }}>
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-theme-fg border-b pb-3" style={{ borderColor: "var(--color-theme-border)" }}>
                          <ClipboardList className="w-4 h-4" />
                          Contenu du Colis
                        </div>
                        <ul className="space-y-3.5">
                          {result.order.items.map((it, idx) => (
                            <li key={idx} className="flex justify-between items-center text-xs">
                              <span className="font-semibold">{it.name}</span>
                              <span className="px-2 py-0.5 rounded font-black text-[10px]" style={{ background: "var(--color-theme-border)" }}>x{it.quantity}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t pt-3 flex justify-between items-center text-xs" style={{ borderColor: "var(--color-theme-border)" }}>
                          <span style={{ color: "var(--color-theme-muted)" }}>Total payé / à payer :</span>
                          <span className="font-black text-sm" style={{ color: "var(--color-theme-accent)" }}>{result.order.grandTotal.toLocaleString("fr-FR")} F CFA</span>
                        </div>
                      </div>
                    </ScrollReveal>
                  </div>

                  {/* Right: personalized botanical advice */}
                  <div className="md:col-span-7">
                    <ScrollReveal animation="fade-up" delay={120}>
                      <div className="rounded-2xl p-6 border space-y-4" style={{ background: "var(--color-theme-card)", borderColor: "var(--color-theme-border)" }}>
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-theme-fg border-b pb-3" style={{ borderColor: "var(--color-theme-border)" }}>
                          <Calendar className="w-4 h-4" />
                          Rituels de Cure Conseillés
                        </div>
                        <div className="space-y-4">
                          {getBotanicalAdvice(result.order.items).map((adv, idx) => (
                            <div key={idx} className="space-y-1">
                              <h4 className="text-xs font-black" style={{ color: "var(--color-theme-accent)" }}>{adv.title}</h4>
                              <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-theme-muted)" }}>{adv.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </ScrollReveal>
                  </div>
                </div>

                {/* 3. ASSISTANCE HELP HOTLINK */}
                <ScrollReveal animation="scale-up" delay={150}>
                  <div className="text-center p-6 border rounded-2xl" style={{ borderColor: "var(--color-theme-border)" }}>
                    <h3 className="text-sm font-black mb-2">Un problème avec votre livraison ?</h3>
                    <p className="text-[10px] max-w-md mx-auto mb-4" style={{ color: "var(--color-theme-muted)" }}>
                      Notre livreur ou notre assistante herboriste se tient à votre entière disposition. Indiquez votre numéro de commande pour une prise en charge immédiate.
                    </p>
                    <a
                      href={`https://wa.me/2250143655088?text=Bonjour%20Caroana%20Minceur%2C%20je%20rencontre%20un%20souci%20avec%20le%20suivi%20de%20ma%20commande%20${result.order.orderNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#25D366] text-white font-bold text-xs uppercase tracking-widest shadow-md transition-all hover:scale-102"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Assistance WhatsApp
                    </a>
                  </div>
                </ScrollReveal>

              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
