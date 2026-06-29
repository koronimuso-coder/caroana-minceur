"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { checkoutSchema } from "@/schemas";
import { processCheckout } from "@/server/actions/checkout.action";
import { getUserProfile, getAddresses } from "@/server/actions/profile.action";
import { UserAddress } from "@/types";
import { 
  ShieldCheck, 
  MessageCircle, 
  Wallet, 
  CreditCard, 
  Landmark, 
  Loader2, 
  CheckCircle2, 
  X, 
  MapPin,
  Check 
} from "lucide-react";
import ExitIntentPopup from "@/components/ui/ExitIntentPopup";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { user: authUser } = useAuth();
  
  const [calculation, setCalculation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<any>("ManualPaymentProvider");

  const [showSimulationModal, setShowSimulationModal] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [simulationStatus, setSimulationStatus] = useState<"verifying" | "success" | "idle">("idle");
  const [pendingOrderData, setPendingOrderData] = useState<any>(null);

  // Address book state
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

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

  // Redirect if cart empty & calculate totals
  useEffect(() => {
    if (items.length === 0) {
      router.push("/panier");
      return;
    }

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

  // Load authenticated user profile & addresses
  useEffect(() => {
    if (!authUser) return;

    const uid = authUser.uid;
    const email = authUser.email;

    async function loadUserProfile() {
      const profRes = await getUserProfile(uid);
      if (profRes.success && profRes.profile) {
        const p = profRes.profile;
        setValue("customer.firstName", p.firstName || "");
        setValue("customer.lastName", p.lastName || "");
        setValue("customer.phone", p.phone || "");
        setValue("customer.email", email || "");

        // Set default shipping address info
        setValue("shippingAddress.firstName", p.firstName || "");
        setValue("shippingAddress.lastName", p.lastName || "");
        setValue("shippingAddress.phone", p.phone || "");
      } else {
        setValue("customer.email", email || "");
      }

      const addrRes = await getAddresses(uid);
      if (addrRes.success && addrRes.addresses && addrRes.addresses.length > 0) {
        setSavedAddresses(addrRes.addresses);
        
        // Find default address to prefill
        const defaultAddr = addrRes.addresses.find(a => a.isDefault) || addrRes.addresses[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          applySavedAddress(defaultAddr);
        }
      }
    }

    loadUserProfile();
  }, [authUser, setValue]);

  // Helper to fill form fields with selected address details
  const applySavedAddress = (adr: UserAddress) => {
    setValue("shippingAddress.firstName", adr.firstName);
    setValue("shippingAddress.lastName", adr.lastName);
    setValue("shippingAddress.phone", adr.phone);
    setValue("shippingAddress.secondaryPhone", adr.secondaryPhone || "");
    setValue("shippingAddress.city", adr.city);
    setValue("shippingAddress.commune", adr.commune);
    setValue("shippingAddress.neighborhood", adr.neighborhood);
    setValue("shippingAddress.landmark", adr.landmark || "");
    setValue("shippingAddress.addressLine", adr.addressLine);
    setValue("shippingAddress.deliveryInstructions", adr.deliveryInstructions || "");
  };

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    const adr = savedAddresses.find(a => a.id === id);
    if (adr) {
      applySavedAddress(adr);
    }
  };

  const finalizeOrder = async (orderData: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await processCheckout(authUser?.uid || null, orderData);
      if (result.success) {
        clearCart();
        if (result.redirectUrl) {
          router.push(result.redirectUrl);
        } else {
          router.push(`/commande/confirmation/${result.orderId}`);
        }
      } else {
        setError("La commande a échoué.");
        setShowSimulationModal(false);
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la commande.");
      setShowSimulationModal(false);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setError(null);
    const orderInput = {
      ...data,
      items: items.map((it) => ({
        productId: it.productId,
        variantId: it.variantId,
        quantity: it.quantity,
      })),
      paymentMethod,
      paymentDetails: {
        method: paymentMethod === "ManualPaymentProvider" ? "wave" : "cash",
        proofUrl: paymentMethod === "ManualPaymentProvider" ? "https://mock-storage-proof.pdf" : null,
      },
    };

    if (paymentMethod === "ManualPaymentProvider") {
      setPendingOrderData(orderInput);
      setShowSimulationModal(true);
      setSimulationStatus("verifying");
      setSimulatedProgress(0);
      return;
    }

    setLoading(true);
    try {
      await finalizeOrder(orderInput);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSimulationModal && simulationStatus === "verifying") {
      timer = setInterval(() => {
        setSimulatedProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setSimulationStatus("success");
            setTimeout(() => {
              finalizeOrder(pendingOrderData);
            }, 1000);
            return 100;
          }
          return prev + 20;
        });
      }, 800);
    }
    return () => clearInterval(timer);
  }, [showSimulationModal, simulationStatus, pendingOrderData]);

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
            <div className="bg-theme-card p-6 rounded-2xl border border-theme-border shadow-sm">
              <h2 className="font-serif text-lg font-bold text-theme-fg mb-4">
                1. Vos coordonnées
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-1">Prénom *</label>
                  <input
                    type="text"
                    {...register("customer.firstName")}
                    className="w-full bg-theme-bg border border-theme-border text-theme-fg rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  />
                  {errors.customer?.firstName && (
                    <span className="text-[10px] text-red-500">{errors.customer.firstName.message}</span>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-1">Nom *</label>
                  <input
                    type="text"
                    {...register("customer.lastName")}
                    className="w-full bg-theme-bg border border-theme-border text-theme-fg rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  />
                  {errors.customer?.lastName && (
                    <span className="text-[10px] text-red-500">{errors.customer.lastName.message}</span>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-1">Adresse Email *</label>
                  <input
                    type="email"
                    {...register("customer.email")}
                    className="w-full bg-theme-bg border border-theme-border text-theme-fg rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  />
                  {errors.customer?.email && (
                    <span className="text-[10px] text-red-500">{errors.customer.email.message}</span>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-1">Téléphone Principal *</label>
                  <input
                    type="text"
                    {...register("customer.phone")}
                    placeholder="+225..."
                    className="w-full bg-theme-bg border border-theme-border text-theme-fg rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  />
                  {errors.customer?.phone && (
                    <span className="text-[10px] text-red-500">{errors.customer.phone.message}</span>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-theme-card p-6 rounded-2xl border border-theme-border shadow-sm space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2 mb-2">
                <h2 className="font-serif text-lg font-bold text-theme-fg">
                  2. Adresse de livraison
                </h2>
                
                {/* Saved addresses selector */}
                {savedAddresses.length > 0 && (
                  <div className="flex items-center gap-2 text-xs bg-theme-bg border border-theme-border p-1.5 rounded-xl">
                    <MapPin className="w-3.5 h-3.5 text-theme-accent" />
                    <select
                      value={selectedAddressId}
                      onChange={(e) => handleSelectAddress(e.target.value)}
                      className="bg-transparent font-bold focus:outline-none cursor-pointer outline-none border-none text-[11px]"
                    >
                      {savedAddresses.map((adr) => (
                        <option key={adr.id} value={adr.id} className="text-black">
                          {adr.commune} - {adr.neighborhood} ({adr.firstName})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-1">Ville *</label>
                  <input
                    type="text"
                    {...register("shippingAddress.city")}
                    className="w-full bg-theme-bg border border-theme-border text-theme-fg rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-1">Commune *</label>
                  <input
                    type="text"
                    placeholder="ex: Cocody, Marcory, Yopougon"
                    {...register("shippingAddress.commune")}
                    className="w-full bg-theme-bg border border-theme-border text-theme-fg rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  />
                  {errors.shippingAddress?.commune && (
                    <span className="text-[10px] text-red-500">{errors.shippingAddress.commune.message}</span>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-1">Quartier *</label>
                  <input
                    type="text"
                    placeholder="ex: Riviera 3, Angré"
                    {...register("shippingAddress.neighborhood")}
                    className="w-full bg-theme-bg border border-theme-border text-theme-fg rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  />
                  {errors.shippingAddress?.neighborhood && (
                    <span className="text-[10px] text-red-500">{errors.shippingAddress.neighborhood.message}</span>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-1">Point de repère *</label>
                  <input
                    type="text"
                    placeholder="ex: En face de la pharmacie"
                    {...register("shippingAddress.landmark")}
                    className="w-full bg-theme-bg border border-theme-border text-theme-fg rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  />
                  {errors.shippingAddress?.landmark && (
                    <span className="text-[10px] text-red-500">{errors.shippingAddress.landmark.message}</span>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-1">Adresse précise (rue / porte) *</label>
                  <textarea
                    rows={2}
                    {...register("shippingAddress.addressLine")}
                    className="w-full bg-theme-bg border border-theme-border text-theme-fg rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  />
                  {errors.shippingAddress?.addressLine && (
                    <span className="text-[10px] text-red-500">{errors.shippingAddress.addressLine.message}</span>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Payment Method Choice */}
            <div className="bg-theme-card p-6 rounded-2xl border border-theme-border shadow-sm">
              <h2 className="font-serif text-lg font-bold text-theme-fg mb-4">
                3. Moyen de paiement
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Manual Mobile Money */}
                <div
                  onClick={() => setPaymentMethod("ManualPaymentProvider")}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
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
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
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
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
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
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
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
            <div className="bg-theme-card border border-theme-border p-6 rounded-2xl shadow-sm sticky top-28">
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

              {error && <div className="text-[10px] text-red-500 mb-4 font-semibold">{error}</div>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3.5 bg-theme-accent hover:bg-theme-accent-hover text-theme-bg font-bold rounded-xl shadow-md transition-all text-sm cursor-pointer disabled:opacity-50"
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

      {/* Simulation Modal for Wave / Mobile Money Payments */}
      {showSimulationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
          <div className="relative w-full max-w-md rounded-2xl p-6 border shadow-2xl space-y-6 animate-scale-up" style={{ background: "var(--color-theme-card)", borderColor: "var(--color-theme-border)", color: "var(--color-theme-fg)" }}>
            
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#25D366]">Wave & Mobile Money</span>
                <h3 className="text-lg font-black uppercase tracking-tight">Vérification de Paiement</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowSimulationModal(false);
                  setLoading(false);
                }}
                className="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer transition-all hover:bg-theme-fg/5"
                style={{ borderColor: "var(--color-theme-border)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated status content */}
            {simulationStatus === "verifying" ? (
              <div className="space-y-4 text-center py-4">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-[#25D366]" />
                  <span className="absolute text-[10px] font-black font-mono">{simulatedProgress}%</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase">Connexion réseau opérateur...</h4>
                  <p className="text-[10px]" style={{ color: "var(--color-theme-muted)" }}>
                    Veuillez envoyer votre transfert de <span className="font-bold">{calculation?.grandTotal.toLocaleString("fr-FR")} FCFA</span> :
                  </p>
                </div>

                <div className="p-4 rounded-xl border space-y-2 text-left bg-theme-bg" style={{ borderColor: "var(--color-theme-border)" }}>
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-theme-fg/60">📲 Option 1 (Wave) :</span>
                    <span className="font-black text-[#1d9bf0]">+225 01 43 65 50 88</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-theme-fg/60">📲 Option 2 (Orange) :</span>
                    <span className="font-black text-orange-500">+225 07 19 17 23 71</span>
                  </div>
                </div>

                <p className="text-[9px] max-w-xs mx-auto leading-relaxed" style={{ color: "var(--color-theme-muted)" }}>
                  Nous vérifions automatiquement la réception de votre Mobile Money sur notre passerelle sécurisée.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-emerald-500">Paiement Détecté avec Succès !</h4>
                  <p className="text-[10px]" style={{ color: "var(--color-theme-muted)" }}>
                    Votre commande est en cours de création. Redirection vers la page de confirmation...
                  </p>
                </div>
              </div>
            )}

            {/* Circular Progress Bar details */}
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "var(--color-theme-border)" }}>
              <div className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${simulatedProgress}%`,
                  background: simulationStatus === "success" ? "var(--color-theme-accent)" : "#25D366"
                }}
              />
            </div>
          </div>
        </div>
      )}
      <ExitIntentPopup />
    </div>
  );
}
