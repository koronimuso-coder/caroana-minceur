"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, Sparkles, Truck } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartCalculationResult, CartItemInput } from "@/server/services/cart.service";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [shippingZoneId, setShippingZoneId] = useState("");
  
  const [calculation, setCalculation] = useState<CartCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [zones, setZones] = useState<any[]>([
    { id: "zone1", commune: "Abidjan Centre (Cocody, Marcory, Plateau)", tarif: 1000, delay: "24h" },
    { id: "zone2", commune: "Abidjan Extérieur (Bingerville, Anyama, Port-Bouët)", tarif: 2000, delay: "24h-48h" },
    { id: "zone3", commune: "Intérieur du pays (Bouaké, Yamoussoukro, Gagnoa)", tarif: 3000, delay: "48h-72h" },
  ]);

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
      <div className="pt-32 pb-20 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-theme-fg/5 flex items-center justify-center mb-6">
          <ShoppingBag className="w-8 h-8 text-theme-fg/40" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-theme-fg">Votre Panier est vide</h1>
        <p className="text-sm text-theme-fg/60 mt-2 max-w-sm">
          Commencez à ajouter des produits pour prendre soin de votre silhouette au naturel.
        </p>
        <Link
          href="/boutique"
          className="mt-6 inline-flex items-center justify-center px-6 py-2.5 bg-theme-accent text-theme-bg font-semibold text-xs rounded-button hover:bg-theme-accent-hover transition-smooth cursor-pointer"
        >
          Visiter la Boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-theme-bg text-theme-fg transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-theme-fg mb-10 text-center sm:text-left">
          Votre Panier
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* LEFT: Items list */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="bg-theme-card p-5 rounded-premium border border-theme-border shadow-premium flex items-center justify-between gap-4"
              >
                {/* Product Image */}
                <div className="w-20 h-20 rounded-premium bg-theme-fg/5 overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                </div>

                {/* Details */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-serif text-sm font-bold text-theme-fg truncate">{item.name}</h3>
                  <p className="text-xs text-theme-fg/50 mt-0.5">Réf: {item.sku}</p>
                  <p className="text-xs font-semibold text-theme-accent mt-1">
                    {item.price.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>

                {/* Quantity Manager */}
                <div className="flex items-center border border-theme-border rounded-button bg-theme-bg">
                  <button
                    onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                    className="px-2.5 py-1 text-theme-fg hover:bg-theme-fg/5 transition-smooth cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-3 text-xs font-bold text-theme-fg">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                    className="px-2.5 py-1 text-theme-fg hover:bg-theme-fg/5 transition-smooth cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => removeItem(item.productId, item.variantId)}
                  className="p-2 text-theme-fg/45 hover:text-danger hover:bg-danger/5 rounded-full transition-smooth cursor-pointer"
                  aria-label="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-xs font-bold text-danger hover:underline cursor-pointer"
              >
                Vider le panier
              </button>
            </div>
          </div>

          {/* RIGHT: Totals & Form */}
          <div className="space-y-6">
            <div className="bg-theme-card border border-theme-border p-6 rounded-premium shadow-premium">
              <h2 className="font-serif text-lg font-bold text-theme-fg mb-4 pb-2 border-b border-theme-border">
                Résumé de commande
              </h2>

              {/* Delivery Zone Selector */}
              <div className="mb-4">
                <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-2">
                  Zone de livraison
                </label>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-theme-fg/50" />
                  <select
                    value={shippingZoneId}
                    onChange={(e) => setShippingZoneId(e.target.value)}
                    className="flex-grow bg-theme-bg border border-theme-border text-theme-fg rounded-button text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                  >
                    <option value="" className="bg-theme-bg">Sélectionnez votre zone...</option>
                    {zones.map((z) => (
                      <option key={z.id} value={z.id} className="bg-theme-bg">
                        {z.commune} (+{z.tarif} FCFA)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Coupon Code Input */}
              <div className="mb-6">
                <label className="text-[10px] font-bold text-theme-fg uppercase tracking-wider block mb-2">
                  Code de réduction
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="CODE PROMO"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-grow bg-theme-bg border border-theme-border text-theme-fg rounded-button text-xs px-3 py-2 uppercase tracking-widest focus:outline-none focus:border-theme-accent"
                  />
                </div>
              </div>

              {/* Server calculation display */}
              {calculation ? (
                <div className="space-y-3 text-xs mb-6">
                  <div className="flex justify-between text-theme-fg/70">
                    <span>Sous-total</span>
                    <span>{calculation.subtotal.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                  {calculation.discountTotal > 0 && (
                    <div className="flex justify-between text-success font-semibold">
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
                    <span>Total estimé</span>
                    <span>{calculation.grandTotal.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs mb-6">
                  <div className="flex justify-between text-theme-fg/70">
                    <span>Sous-total</span>
                    <span>{useCart.getState().getSubtotal().toLocaleString("fr-FR")} FCFA</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-theme-fg pt-3 border-t border-theme-border">
                    <span>Total</span>
                    <span>{useCart.getState().getSubtotal().toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>
              )}

              {error && <div className="text-[11px] text-danger mb-4 font-semibold">{error}</div>}

              {/* Checkout Button */}
              <Link
                href="/paiement"
                className="w-full inline-flex items-center justify-center py-3 bg-theme-accent text-theme-bg hover:bg-theme-accent-hover font-bold rounded-button shadow-premium transition-smooth text-sm cursor-pointer"
              >
                <span>Passer au Paiement</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
