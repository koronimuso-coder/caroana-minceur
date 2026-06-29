"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types";
import { ShoppingCart, Check, MessageCircle, ArrowRight } from "lucide-react";

export default function ProductCtaCard({ product }: { product: Product }) {
  const addItem = useCart((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!product.price) return;
    addItem({
      productId: product.id,
      variantId: null,
      sku: product.sku,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0]?.url || "",
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const getWhatsAppLink = () => {
    const msg = encodeURIComponent(
      `Bonjour CAROANA MINCEUR, j'ai lu votre article de blog et je souhaite commander : « ${product.name} ».`
    );
    return `https://wa.me/2250143655088?text=${msg}`;
  };

  return (
    <div 
      className="p-6 sm:p-8 border-2 rounded-2xl flex flex-col md:flex-row gap-6 items-center bg-theme-card relative overflow-hidden group shadow-md" 
      style={{ borderColor: "var(--color-theme-accent)" }}
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent/5 rounded-full blur-xl group-hover:scale-110 transition-transform" />

      {/* Image Thumbnail */}
      <div className="w-full md:w-32 aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative flex-shrink-0">
        <img 
          src={product.images[0]?.url || ""} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-smooth" 
        />
      </div>

      {/* Details & CTA actions */}
      <div className="flex-1 space-y-4 text-center md:text-left w-full">
        <div>
          <span className="text-[8px] font-black tracking-widest text-theme-accent uppercase block">Recommandation Minceur</span>
          <h3 className="font-serif text-lg font-bold mt-0.5 leading-tight">{product.name}</h3>
          <p className="text-[11px] opacity-75 mt-1 leading-relaxed max-w-lg">
            {product.shortDescription}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
          <span className="text-base font-black text-theme-accent-hover text-glow">
            {product.price?.toLocaleString("fr-FR")} FCFA
          </span>
          {product.compareAtPrice && product.compareAtPrice > 0 && (
            <span className="text-xs opacity-40 line-through">
              {product.compareAtPrice.toLocaleString("fr-FR")} F
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          {added ? (
            <div className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-600 text-white flex items-center justify-center gap-1.5 shadow-lg animate-pulse">
              <Check className="w-4 h-4" />
              <span>Dans le panier</span>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-theme-accent text-theme-bg flex items-center justify-center gap-1.5 shadow hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Ajouter au panier</span>
            </button>
          )}

          <a 
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#25D366] text-white flex items-center justify-center gap-1.5 shadow hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Commander</span>
          </a>

          <Link
            href={`/produit/${product.slug}`}
            className="px-4 py-2.5 rounded-xl border text-[11px] font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            style={{ borderColor: "var(--color-theme-border)" }}
          >
            <span>Fiche produit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
