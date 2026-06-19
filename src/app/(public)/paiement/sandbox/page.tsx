"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { simulateSandboxPayment } from "@/server/actions/payment.action";
import { CreditCard, ShieldCheck, HelpCircle, XCircle } from "lucide-react";

function SandboxPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get("paymentId");
  const orderId = searchParams.get("orderId");

  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentId || !orderId) {
      router.push("/");
      return;
    }
  }, [paymentId, orderId, router]);

  const handleSimulate = async (success: boolean) => {
    if (!paymentId || !orderId) return;
    setLoading(true);
    setError(null);
    try {
      await simulateSandboxPayment(paymentId, success);
      if (success) {
        router.push(`/commande/confirmation/${orderId}`);
      } else {
        router.push(`/commande/confirmation/${orderId}?paymentFailed=true`);
      }
    } catch (err: any) {
      setError(err.message || "Erreur de simulation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-theme-bg flex items-center justify-center pattern-baoule text-theme-fg transition-colors duration-500">
      <div className="max-w-md w-full mx-4 bg-theme-card text-theme-fg p-8 rounded-premium shadow-gold border border-theme-accent/20">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-theme-accent/10 flex items-center justify-center mx-auto mb-3">
            <CreditCard className="w-6 h-6 text-theme-accent" />
          </div>
          <h1 className="font-serif text-xl font-bold">Portail de Paiement (BAC À SABLE)</h1>
          <p className="text-[11px] text-theme-fg/50 mt-1">
            Ceci est un environnement de simulation sécurisé pour CAROANA MINCEUR.
          </p>
        </div>

        {/* Details */}
        <div className="bg-theme-fg/5 p-4 rounded-premium text-xs space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-theme-fg/50">ID Paiement :</span>
            <span className="font-semibold">{paymentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-theme-fg/50">ID Commande :</span>
            <span className="font-semibold">{orderId}</span>
          </div>
          <div className="flex justify-between font-bold border-t border-theme-border pt-2 text-sm">
            <span>Montant à régler :</span>
            <span className="text-theme-accent-dark">Simulation</span>
          </div>
        </div>

        {/* Inputs (Mock Fields) */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-[9px] font-bold uppercase tracking-wider block mb-1">Numéro de Téléphone / Carte</label>
            <input
              type="text"
              placeholder="+225 00 00 00 00 00"
              className="w-full bg-theme-bg border border-theme-border rounded-button text-xs p-2.5 focus:outline-none focus:border-theme-accent text-theme-fg"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase tracking-wider block mb-1">Code OTP / CVV</label>
            <input
              type="password"
              placeholder="••••"
              className="w-full bg-theme-bg border border-theme-border rounded-button text-xs p-2.5 focus:outline-none focus:border-theme-accent text-theme-fg"
            />
          </div>
        </div>

        {error && <div className="text-[10px] text-danger mb-4 text-center font-semibold">{error}</div>}

        {/* Simulators */}
        <div className="space-y-3">
          <button
            onClick={() => handleSimulate(true)}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-success hover:bg-success-light text-white font-bold rounded-button shadow-premium transition-smooth text-xs cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Simuler : Paiement Réussi</span>
          </button>
          
          <button
            onClick={() => handleSimulate(false)}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-danger hover:bg-danger-light text-white font-bold rounded-button shadow-premium transition-smooth text-xs cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            <span>Simuler : Échec de Paiement</span>
          </button>
        </div>

        <p className="text-[9px] text-center text-theme-fg/40 mt-4 leading-relaxed flex items-center justify-center">
          <HelpCircle className="w-3 h-3 mr-1" />
          Aucun débit réel ne sera effectué sur vos comptes.
        </p>

      </div>
    </div>
  );
}

export default function SandboxPaymentPage() {
  return (
    <Suspense fallback={
      <div className="pt-28 pb-20 min-h-screen bg-theme-bg flex items-center justify-center text-theme-fg">
        <div className="w-10 h-10 border-4 border-theme-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SandboxPaymentContent />
    </Suspense>
  );
}
