"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/hooks/useCart";
import { checkoutSchema } from "@/schemas";
import { processCheckout } from "@/server/actions/checkout.action";
import { ShieldCheck, MessageCircle, Wallet, CreditCard, Landmark } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [calculation, setCalculation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<any>("ManualPaymentProvider");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer: { firstName: "", lastName: "", email: "", phone: "", secondaryPhone: "" },
      shippingAddress: {
        firstName: "",
        lastName: "",
        phone: "",
        secondaryPhone: "",
        country: "Côte d'Ivoire",
        city: "Abidjan",
        commune: "",
        district: "Abidjan",
        neighborhood: "",
        landmark: "",
        addressLine: "",
        deliveryInstructions: "",
        isDefault: false,
      },
      paymentMethod: "ManualPaymentProvider",
      couponCode: "",
      customerNotes: "",
    },
  });

  useEffect(() => {
    // Redirect if cart empty
    if (items.length === 0) {
      router.push("/panier");
      return;
    }

    // Load server-side totals
    async function loadTotals() {
      try {
        const inputItems = items.map((it) => ({
          productId: it.productId,
          variantId: it.variantId,
          quantity: it.quantity,
        }));
        const res = await fetch("/api/cart/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: inputItems }),
        });
        const data = await res.json();
        if (data.success) {
          setCalculation(data.result);
        }
      } catch (err) {
        console.error("Totals computation failed", err);
      }
    }
    loadTotals();
  }, [items, router]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const orderInput = {
        ...data,
        items: items.map((it) => ({
          productId: it.productId,
          variantId: it.variantId,
          quantity: it.quantity,
        })),
        paymentMethod,
        // Mock proof URL for Manual Payment
        paymentDetails: {
          method: paymentMethod === "ManualPaymentProvider" ? "wave" : "cash",
          proofUrl: paymentMethod === "ManualPaymentProvider" ? "https://mock-storage-proof.pdf" : null,
        },
      };

      const result = await processCheckout(null, orderInput);
      if (result.success) {
        clearCart();
        if (result.redirectUrl) {
          router.push(result.redirectUrl);
        } else {
          router.push(`/commande/confirmation/${result.orderId}`);
        }
      } else {
        setError("La commande a échoué.");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la commande.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="pt-28 pb-20 bg-theme-bg text-theme-fg min-h-screen transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-theme-fg mb-10 text-center sm:text-left">
          Paiement sécurisé
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* LEFT & CENTER: Form columns */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Client Contact Info */}
            <div className="bg-theme-card p-6 rounded-premium border border-theme-border shadow-premium">
              <h2 className="font-serif text-lg font-bold text-theme-fg mb-4">
                1. Vos coordonnées
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-1">Prénom *</label>
                  <input
                    type="text"
                    {...register("customer.firstName")}
                    className="w-full bg-theme-bg border border-theme-border text-theme-fg rounded-button text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  />
                  {errors.customer?.firstName && (
                    <span className="text-[10px] text-danger">{errors.customer.firstName.message}</span>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-1">Nom *</label>
                  <input
                    type="text"
                    {...register("customer.lastName")}
                    className="w-full bg-theme-bg border border-theme-border text-theme-fg rounded-button text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  />
                  {errors.customer?.lastName && (
                    <span className="text-[10px] text-danger">{errors.customer.lastName.message}</span>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-1">Adresse Email *</label>
                  <input
                    type="email"
                    {...register("customer.email")}
                    className="w-full bg-theme-bg border border-theme-border text-theme-fg rounded-button text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  />
                  {errors.customer?.email && (
                    <span className="text-[10px] text-danger">{errors.customer.email.message}</span>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-1">Téléphone Principal *</label>
                  <input
                    type="text"
                    {...register("customer.phone")}
                    placeholder="+225..."
                    className="w-full bg-theme-bg border border-theme-border text-theme-fg rounded-button text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  />
                  {errors.customer?.phone && (
                    <span className="text-[10px] text-danger">{errors.customer.phone.message}</span>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-theme-card p-6 rounded-premium border border-theme-border shadow-premium">
              <h2 className="font-serif text-lg font-bold text-theme-fg mb-4">
                2. Adresse de livraison
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-1">Ville *</label>
                  <input
                    type="text"
                    {...register("shippingAddress.city")}
                    className="w-full bg-theme-bg border border-theme-border text-theme-fg rounded-button text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-1">Commune *</label>
                  <input
                    type="text"
                    placeholder="ex: Cocody, Marcory, Yopougon"
                    {...register("shippingAddress.commune")}
                    className="w-full bg-theme-bg border border-theme-border text-theme-fg rounded-button text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  />
                  {errors.shippingAddress?.commune && (
                    <span className="text-[10px] text-danger">{errors.shippingAddress.commune.message}</span>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-1">Quartier *</label>
                  <input
                    type="text"
                    placeholder="ex: Riviera 3, Angré"
                    {...register("shippingAddress.neighborhood")}
                    className="w-full bg-theme-bg border border-theme-border text-theme-fg rounded-button text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  />
                  {errors.shippingAddress?.neighborhood && (
                    <span className="text-[10px] text-danger">{errors.shippingAddress.neighborhood.message}</span>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-1">Point de repère *</label>
                  <input
                    type="text"
                    placeholder="ex: En face de la pharmacie"
                    {...register("shippingAddress.landmark")}
                    className="w-full bg-theme-bg border border-theme-border text-theme-fg rounded-button text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  />
                  {errors.shippingAddress?.landmark && (
                    <span className="text-[10px] text-danger">{errors.shippingAddress.landmark.message}</span>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-1">Adresse précise (rue / porte) *</label>
                  <textarea
                    rows={2}
                    {...register("shippingAddress.addressLine")}
                    className="w-full bg-theme-bg border border-theme-border text-theme-fg rounded-button text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  />
                  {errors.shippingAddress?.addressLine && (
                    <span className="text-[10px] text-danger">{errors.shippingAddress.addressLine.message}</span>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Payment Method Choice */}
            <div className="bg-theme-card p-6 rounded-premium border border-theme-border shadow-premium">
              <h2 className="font-serif text-lg font-bold text-theme-fg mb-4">
                3. Moyen de paiement
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Manual Mobile Money */}
                <div
                  onClick={() => setPaymentMethod("ManualPaymentProvider")}
                  className={`p-4 rounded-premium border-2 cursor-pointer transition-smooth flex items-start space-x-3 ${
                    paymentMethod === "ManualPaymentProvider" ? "border-theme-accent bg-theme-accent/5" : "border-theme-border bg-theme-card"
                  }`}
                >
                  <Wallet className="w-5 h-5 text-theme-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-theme-fg">Mobile Money Manuel</h4>
                    <p className="text-[10px] text-theme-fg/70 leading-relaxed mt-1">
                      Transfert Wave (+225 01 43 65 50 88) ou Orange Money (+225 07 19 17 23 71) puis validation par envoi de preuve.
                    </p>
                  </div>
                </div>

                {/* Cash on delivery */}
                <div
                  onClick={() => setPaymentMethod("CashOnDeliveryProvider")}
                  className={`p-4 rounded-premium border-2 cursor-pointer transition-smooth flex items-start space-x-3 ${
                    paymentMethod === "CashOnDeliveryProvider" ? "border-theme-accent bg-theme-accent/5" : "border-theme-border bg-theme-card"
                  }`}
                >
                  <Landmark className="w-5 h-5 text-theme-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-theme-fg">Paiement à la livraison</h4>
                    <p className="text-[10px] text-theme-fg/70 leading-relaxed mt-1">
                      Réglez en espèces directement auprès du livreur lors de la remise de votre colis.
                    </p>
                  </div>
                </div>

                {/* Sandbox Mobile Money */}
                <div
                  onClick={() => setPaymentMethod("MobileMoneyProvider")}
                  className={`p-4 rounded-premium border-2 cursor-pointer transition-smooth flex items-start space-x-3 ${
                    paymentMethod === "MobileMoneyProvider" ? "border-theme-accent bg-theme-accent/5" : "border-theme-border bg-theme-card"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-theme-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-theme-fg">Mobile Money Automatisé (Sandbox)</h4>
                    <p className="text-[10px] text-theme-fg/70 leading-relaxed mt-1">
                      Paiement automatique via API Mobile Money (simulation en mode bac à sable).
                    </p>
                  </div>
                </div>

                {/* WhatsApp Direct Order */}
                <div
                  onClick={() => setPaymentMethod("WhatsAppOrderProvider")}
                  className={`p-4 rounded-premium border-2 cursor-pointer transition-smooth flex items-start space-x-3 ${
                    paymentMethod === "WhatsAppOrderProvider" ? "border-theme-accent bg-theme-accent/5" : "border-theme-border bg-theme-card"
                  }`}
                >
                  <MessageCircle className="w-5 h-5 text-theme-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-theme-fg">Commande via WhatsApp</h4>
                    <p className="text-[10px] text-theme-fg/70 leading-relaxed mt-1">
                      Finalisez votre commande en discutant directement avec notre service clientèle.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Summary & Submit */}
          <div>
            <div className="bg-theme-card border border-theme-border p-6 rounded-premium shadow-premium sticky top-28">
              <h2 className="font-serif text-lg font-bold text-theme-fg mb-4 pb-2 border-b border-theme-border">
                Commande
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((it) => (
                  <div key={`${it.productId}-${it.variantId}`} className="flex justify-between text-xs text-theme-fg">
                    <span className="text-theme-fg/80 truncate max-w-[180px]">
                      {it.name} <span className="font-semibold text-[10px]">x{it.quantity}</span>
                    </span>
                    <span className="font-semibold">{(it.price * it.quantity).toLocaleString("fr-FR")} FCFA</span>
                  </div>
                ))}
              </div>

              {calculation && (
                <div className="space-y-3 text-xs mb-6 pt-4 border-t border-theme-border">
                  <div className="flex justify-between text-theme-fg/70">
                    <span>Sous-total</span>
                    <span>{calculation.subtotal.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                  <div className="flex justify-between text-theme-fg/70">
                    <span>Livraison</span>
                    <span>{calculation.shippingTotal.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-theme-fg pt-3 border-t border-theme-border">
                    <span>Total final</span>
                    <span>{calculation.grandTotal.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>
              )}

              {error && <div className="text-[10px] text-danger mb-4 font-semibold">{error}</div>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3.5 bg-theme-accent hover:bg-theme-accent-hover text-theme-bg font-bold rounded-button shadow-premium transition-smooth text-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-theme-bg border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-theme-bg" />
                    <span>Confirmer la commande</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-theme-fg/45 mt-3 leading-relaxed">
                Paiement 100% sécurisé. Vos données de santé et de contact restent confidentielles.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
