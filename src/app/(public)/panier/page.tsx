"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Trash2, 
  ShoppingBag, 
  Plus, 
  Minus, 
  ArrowRight, 
  Sparkles, 
  Truck, 
  Gift, 
  Check, 
  ShoppingBagIcon, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Clock
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartCalculationResult, CartItemInput } from "@/server/services/cart.service";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ExitIntentPopup from "@/components/ui/ExitIntentPopup";

const CROSS_SELL_PRODUCTS = [
  {
    id: "p2", slug: "the-detox", sku: "TD-01",
    name: "Thé Détox",
    price: 5000,
    icon: "🍵",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
    desc: "Parfait pour éliminer les toxines le matin."
  },
  {
    id: "p3", slug: "tisane-ventre-plat", sku: "TVP-01",
    name: "Tisane Ventre Plat",
    price: 5000,
    icon: "🌿",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
    desc: "Idéal le soir pour le transit et le ventre plat."
  },
  {
    id: "p-tisane-m", slug: "tisane-minceur", sku: "TM-01",
    name: "Tisane Minceur",
    price: 8000,
    icon: "🌱",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
    desc: "Cure active pour accélérer la perte de poids."
  }
];

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, addItem } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [shippingZoneId, setShippingZoneId] = useState("");
  
  const [calculation, setCalculation] = useState<CartCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gift Option State (Amélioration 33)
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");

  const zones = [
    { id: "zone-abidjan-std", commune: "Abidjan Centre (Cocody, Marcory, Plateau, etc.)", tarif: 1000, delay: "Aujourd'hui / Demain" },
    { id: "zone-abidjan-exp", commune: "Abidjan Périphérie (Bingerville, Anyama, Port-Bouët)", tarif: 1500, delay: "Sous 24h-48h" },
    { id: "zone-civ-interieur", commune: "Intérieur du pays (Bouaké, Yamoussoukro, Gagnoa, etc.)", tarif: 2500, delay: "Sous 48h-72h" },
  ];

  useEffect(() => {
    async function calculate() {
      if (items.length === 0) {
        setCalculation(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const inputItems: CartItemInput[] = items.map((it) => ({
          productId: it.productId,
          variantId: it.variantId,
          quantity: it.quantity,
        }));

        const res = await fetch("/api/cart/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: inputItems,
            couponCode: couponCode ? couponCode.trim() : null,
            shippingZoneId: shippingZoneId ? shippingZoneId : null,
          }),
        });

        const data = await res.json();
        if (data.success) {
          setCalculation(data.result);
        } else {
          setError(data.error || "Erreur de calcul.");
        }
      } catch (err) {
        setError("Impossible de contacter le serveur de calcul.");
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      calculate();
    }, 500);

    return () => clearTimeout(timer);
  }, [items, couponCode, shippingZoneId]);

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-[70vh] flex flex-col items-center justify-center text-center px-4" style={{ background: "var(--color-theme-bg)", color: "var(--color-theme-fg)" }}>
        <div className="w-16 h-16 rounded-full bg-theme-fg/5 flex items-center justify-center mb-6">
          <ShoppingBag className="w-8 h-8 text-theme-fg/45" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-theme-fg">Votre Panier est vide</h1>
        <p className="text-sm text-theme-fg/60 mt-2 max-w-sm">
          Commencez à ajouter des produits pour prendre soin de votre silhouette au naturel.
        </p>
        <Link
          href="/boutique"
          className="mt-6 inline-flex items-center justify-center px-6 py-2.5 bg-theme-accent text-theme-bg font-bold text-xs rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md"
        >
          Visiter la Boutique
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const freeShippingThreshold = 30000;
  const missingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Delivery estimation calculations (Amélioration 28)
  const getSelectedZoneDelay = () => {
    const activeZone = zones.find(z => z.id === shippingZoneId);
    return activeZone ? activeZone.delay : null;
  };

  const handleAddCrossSell = (prod: any) => {
    addItem({
      productId: prod.id,
      variantId: null,
      sku: prod.sku,
      name: prod.name,
      price: prod.price,
      imageUrl: prod.image,
      quantity: 1
    });
    alert(`« ${prod.name} » a été ajouté à votre panier !`);
  };

  return (
    <div className="pt-28 pb-20 bg-theme-bg text-theme-fg transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title */}
        <div className="text-center sm:text-left mb-10">
          <h1 className="font-serif text-3xl font-bold text-theme-fg">
            Votre Panier d'Achats
          </h1>
          <p className="text-xs opacity-60 mt-1">Gérez vos articles avant de passer à la caisse de paiement sécurisé.</p>
        </div>

        {/* Free Shipping Progress Indicator (Amélioration 31) */}
        <div className="mb-8 p-5 rounded-2xl border bg-theme-card" style={{ borderColor: "var(--color-theme-border)" }}>
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-2">
            {missingForFreeShipping > 0 ? (
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>Plus que <strong className="text-emerald-500">{missingForFreeShipping.toLocaleString("fr-FR")} F</strong> pour la livraison gratuite !</span>
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1">
                🎉 Félicitations ! Votre livraison standard est offerte !
              </span>
            )}
            <span className="opacity-60">{Math.round(freeShippingProgress)}%</span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: Items list */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="bg-theme-card p-5 rounded-2xl border border-theme-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-xl bg-theme-fg/5 overflow-hidden flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif text-sm font-bold text-theme-fg truncate">{item.name}</h3>
                      <p className="text-[10px] text-theme-fg/50 font-mono mt-0.5">Réf: {item.sku}</p>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                        {item.price.toLocaleString("fr-FR")} F
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                    {/* Quantity Manager */}
                    <div className="flex items-center border border-theme-border rounded-xl bg-theme-bg">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className="px-2.5 py-1.5 text-theme-fg hover:bg-theme-fg/5 transition-smooth cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-theme-fg">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="px-2.5 py-1.5 text-theme-fg hover:bg-theme-fg/5 transition-smooth cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <strong className="text-xs font-mono w-20 text-right">
                      {(item.price * item.quantity).toLocaleString("fr-FR")} F
                    </strong>

                    {/* Delete Button */}
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="p-2 text-theme-fg/45 hover:text-red-500 hover:bg-red-500/5 rounded-full transition-smooth cursor-pointer"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="flex justify-between items-center">
              <Link href="/boutique" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                Continuer mes achats
              </Link>
              <button
                onClick={clearCart}
                className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
              >
                Vider le panier
              </button>
            </div>

            {/* Gift Wrapping / Message Option (Amélioration 33) */}
            <div className="p-5 rounded-2xl border bg-theme-card space-y-4" style={{ borderColor: "var(--color-theme-border)" }}>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isGift}
                  onChange={(e) => setIsGift(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500"
                />
                <Gift className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider">C'est pour offrir (Emballage cadeau offert 🎁)</span>
              </label>
              
              {isGift && (
                <textarea
                  placeholder="Écrivez ici le message à insérer sur la carte cadeau..."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="w-full p-3 border rounded-xl text-xs bg-theme-bg focus:outline-none focus:border-emerald-500 resize-none h-20"
                  style={{ borderColor: "var(--color-theme-border)" }}
                />
              )}
            </div>

            {/* ====== CROSS-SELLING SECTION (Amélioration 5, 32) ====== */}
            <div className="space-y-4 pt-4">
              <h3 className="font-serif text-lg font-bold">Complétez votre rituel</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {CROSS_SELL_PRODUCTS.map((prod) => {
                  // Do not recommend if already in cart
                  const alreadyInCart = items.some(it => it.productId === prod.id);
                  if (alreadyInCart) return null;

                  return (
                    <div key={prod.id} className="p-4 border rounded-2xl bg-theme-card flex flex-col justify-between space-y-3" style={{ borderColor: "var(--color-theme-border)" }}>
                      <div className="space-y-2">
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-neutral-100 relative">
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 right-2 text-xs bg-white/90 dark:bg-black/80 px-2 py-0.5 rounded shadow-sm">{prod.icon}</span>
                        </div>
                        <h4 className="text-xs font-bold">{prod.name}</h4>
                        <p className="text-[10px] opacity-60 leading-normal">{prod.desc}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "var(--color-theme-border)" }}>
                        <strong className="text-xs font-mono">{prod.price.toLocaleString("fr-FR")} F</strong>
                        <button
                          onClick={() => handleAddCrossSell(prod)}
                          className="px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider text-white flex items-center gap-1 cursor-pointer"
                          style={{ background: "var(--color-theme-accent)" }}
                        >
                          + Ajouter
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT: Totals & Form */}
          <div className="space-y-6">
            <div className="bg-theme-card border border-theme-border p-6 rounded-2xl shadow-sm space-y-6">
              <h2 className="font-serif text-lg font-bold text-theme-fg pb-2 border-b border-theme-border">
                Résumé de commande
              </h2>

              {/* Delivery Zone Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block">
                  Zone de livraison
                </label>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-theme-fg/50 flex-shrink-0" />
                  <select
                    value={shippingZoneId}
                    onChange={(e) => setShippingZoneId(e.target.value)}
                    className="flex-grow bg-theme-bg border border-theme-border text-theme-fg rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  >
                    <option value="" className="bg-theme-bg">Sélectionnez votre zone...</option>
                    {zones.map((z) => (
                      <option key={z.id} value={z.id} className="bg-theme-bg">
                        {z.commune} (+{z.tarif} F)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Delivery Date estimation (Amélioration 28) */}
              {shippingZoneId && (
                <div className="p-3 rounded-xl border flex items-center gap-2 bg-emerald-500/5 text-xs text-emerald-600 dark:text-emerald-400" style={{ borderColor: "rgba(16,185,129,0.15)" }}>
                  <Clock className="w-4 h-4" />
                  <span>Livraison estimée : <strong className="underline">{getSelectedZoneDelay()}</strong></span>
                </div>
              )}

              {/* Coupon Code Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block">
                  Code de réduction
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="CODE PROMO"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-grow bg-theme-bg border border-theme-border text-theme-fg rounded-xl text-xs px-3 py-2 uppercase tracking-widest focus:outline-none focus:border-theme-accent"
                  />
                </div>
              </div>

              {/* Server calculation display */}
              {calculation ? (
                <div className="space-y-3 text-xs pt-4 border-t border-theme-border">
                  <div className="flex justify-between text-theme-fg/70">
                    <span>Sous-total</span>
                    <span>{calculation.subtotal.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                  {calculation.discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span className="flex items-center">
                        <Sparkles className="w-3.5 h-3.5 mr-1" />
                        Remise ({calculation.appliedCoupon?.code})
                      </span>
                      <span>-{calculation.discountTotal.toLocaleString("fr-FR")} FCFA</span>
                    </div>
                  )}
                  <div className="flex justify-between text-theme-fg/70">
                    <span>Frais de livraison</span>
                    <span>
                      {shippingZoneId 
                        ? `${calculation.shippingTotal.toLocaleString("fr-FR")} FCFA` 
                        : "Sélectionnez une zone"}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-theme-fg pt-3 border-t border-theme-border">
                    <span>Total à payer</span>
                    <span>{calculation.grandTotal.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs pt-4 border-t border-theme-border">
                  <div className="flex justify-between text-theme-fg/70">
                    <span>Sous-total</span>
                    <span>{subtotal.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-theme-fg pt-3 border-t border-theme-border">
                    <span>Total</span>
                    <span>{subtotal.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>
              )}

              {error && <div className="text-[11px] text-red-500 mb-2 font-bold">{error}</div>}

              {/* Checkout Button */}
              <Link
                href="/paiement"
                className="w-full inline-flex items-center justify-center py-3 bg-theme-accent text-theme-bg hover:scale-[1.02] active:scale-[0.98] font-bold rounded-xl shadow-md transition-all text-sm cursor-pointer"
              >
                <span>Passer au Paiement sécurisé</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            
            {/* Security Promise */}
            <div className="p-4 border rounded-2xl flex items-center gap-3 text-[10px] opacity-65 bg-stone-50/50 dark:bg-neutral-900/30" style={{ borderColor: "var(--color-theme-border)" }}>
              <ShieldCheck className="w-8 h-8 text-emerald-500 flex-shrink-0" />
              <span>
                Paiement ultra-sécurisé via Wave ou Mobile Money. Vos coordonnées sont chiffrées de bout en bout et jamais stockées.
              </span>
            </div>
          </div>

        </div>
      </div>
      <ExitIntentPopup />
    </div>
  );
}
