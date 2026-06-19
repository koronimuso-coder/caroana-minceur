"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, MessageCircle, Heart, ShieldAlert, Award, Truck, RefreshCw } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailsClient({ product, relatedProducts }: Props) {
  const [activeImage, setActiveImage] = useState(product.images[0]?.url || "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "ing" | "usage">("desc");

  const addItem = useCart((state) => state.addItem);

  const hasPrice = product.price !== null && product.price > 0;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (!hasPrice || isOutOfStock) return;
    addItem({
      productId: product.id,
      variantId: null,
      sku: product.sku,
      name: product.name,
      price: product.price!,
      imageUrl: product.images[0]?.url || "",
      quantity,
    });
  };

  const getWhatsAppMessageLink = () => {
    const msg = encodeURIComponent(
      `Bonjour CAROANA MINCEUR, je souhaite commander le produit « ${product.name} » (Quantité: ${quantity}).`
    );
    return `https://wa.me/2250143655088?text=${msg}`;
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 grid-blueprint border-b border-theme-border items-stretch transition-colors duration-500">
      
      {/* ================== LEFT COLUMN: GALLERY CELL (Col 6) ================== */}
      <div className="col-span-12 lg:col-span-6 grid-cell flex flex-col justify-start border-r-0 lg:border-r border-theme-border">
        <ScrollReveal animation="fade-right" className="p-6 sm:p-12 h-full flex flex-col justify-start flex-grow">
          {/* Main Photo Frame */}
          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-theme-bg border border-theme-border rounded-lg overflow-hidden shadow-2xl hover-gold-sheen">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={product.name}
              className="object-cover w-full h-full transition-smooth hover:scale-105 cursor-zoom-in"
            />
            {isOutOfStock && (
              <span className="absolute top-4 left-4 text-[9px] font-bold bg-danger text-white px-3 py-1 rounded uppercase tracking-widest">
                Rupture
              </span>
            )}
          </div>
          
          {/* Thumbnails list */}
          {product.images.length > 1 && (
            <div className="flex space-x-3 mt-6">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img.url)}
                  className={`w-20 h-20 rounded border bg-theme-bg overflow-hidden transition-smooth cursor-pointer ${
                    activeImage === img.url ? "border-theme-accent shadow-gold" : "border-theme-border hover:border-theme-border/80"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </ScrollReveal>
      </div>

      {/* ================== RIGHT COLUMN: DETAIL BLOCKS (Col 6) ================== */}
      <div className="col-span-12 lg:col-span-6 flex flex-col divide-y divide-theme-border">
        
        {/* Block 1: Identification & Price */}
        <div className="p-8 sm:p-10">
          <ScrollReveal animation="fade-left" delay={100} className="space-y-4">
            <div>
              <span className="text-theme-accent font-bold text-[9px] tracking-[0.25em] uppercase">
                CAROANA MINCEUR
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-black text-theme-fg uppercase mt-1 tracking-tight">
                {product.name}
              </h1>
              <p className="text-[10px] text-theme-fg/40 mt-1 uppercase tracking-widest font-semibold">SKU: {product.sku}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className={`text-2xl font-black ${hasPrice ? "text-theme-accent-hover text-glow" : "text-theme-accent-hover italic text-sm"}`}>
                {hasPrice ? `${product.price?.toLocaleString("fr-FR")} FCFA` : "Tarif à configurer"}
              </span>
              {product.compareAtPrice && product.compareAtPrice > 0 && (
                <span className="text-xs text-theme-fg/45 line-through">
                  {product.compareAtPrice.toLocaleString("fr-FR")} FCFA
                </span>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Block 2: Description */}
        <div className="p-8 sm:p-10">
          <ScrollReveal animation="fade-left" delay={180}>
            <p className="text-xs sm:text-sm text-theme-fg/80 leading-relaxed">
              {product.shortDescription}
            </p>
          </ScrollReveal>
        </div>

        {/* Block 3: Quantity & Add Actions */}
        <div className="p-8 sm:p-10">
          <ScrollReveal animation="fade-left" delay={260}>
            {hasPrice && !isOutOfStock ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <span className="text-[9px] font-bold text-theme-fg uppercase tracking-widest">Quantité</span>
                  <div className="flex items-center border border-theme-border bg-theme-fg/5 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-theme-fg font-bold hover:bg-theme-fg/10 transition-smooth cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-5 py-1 text-xs font-bold text-theme-fg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-theme-fg font-bold hover:bg-theme-fg/10 transition-smooth cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center space-x-2 py-3.5 bg-gold-gradient text-theme-bg font-bold text-xs uppercase tracking-widest rounded transition-smooth hover:scale-[1.02] active:scale-[0.98] shadow-gold cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Panier</span>
                  </button>
                  
                  <a
                    href={getWhatsAppMessageLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 py-3.5 bg-[#25D366] hover:bg-[#20ba56] hover:scale-[1.02] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-widest rounded shadow-lg transition-smooth cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-theme-fg/5 border border-theme-border rounded flex items-start space-x-3">
                <ShieldAlert className="w-5 h-5 text-theme-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-theme-accent uppercase tracking-widest">
                    {isOutOfStock ? "Rupture de Stock" : "Tarif indisponible"}
                  </h4>
                  <p className="text-[11px] text-theme-fg/75 leading-relaxed mt-1.5">
                    {isOutOfStock 
                      ? "Ce produit est momentanément en rupture. Vous pouvez être notifié dès son retour en stock par message WhatsApp." 
                      : "Ce produit n'est pas encore disponible à la commande en ligne. Veuillez contacter notre service client WhatsApp."}
                  </p>
                  {isOutOfStock && (
                    <a
                      href={getWhatsAppMessageLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs text-theme-accent font-bold mt-3 hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>M&apos;avertir par WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </ScrollReveal>
        </div>

        {/* Block 4: Trust Specifications */}
        <div className="p-8 sm:p-10 bg-theme-fg/[0.01]">
          <ScrollReveal animation="fade-left" delay={340} className="grid grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Award className="w-5 h-5 text-theme-accent" />
              <span className="text-[9px] font-bold text-theme-fg uppercase tracking-widest">Plantes Bio</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <Truck className="w-5 h-5 text-theme-accent" />
              <span className="text-[9px] font-bold text-theme-fg uppercase tracking-widest">Livraison 24h</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <RefreshCw className="w-5 h-5 text-theme-accent" />
              <span className="text-[9px] font-bold text-theme-fg uppercase tracking-widest">Service Client</span>
            </div>
          </ScrollReveal>
        </div>

        {/* Block 5: Interactive Tabbed Details */}
        <div className="p-8 sm:p-10">
          <ScrollReveal animation="fade-left" delay={420} className="space-y-6">
            <div className="flex border-b border-theme-border">
              {[
                { label: "Description", val: "desc" },
                { label: "Ingrédients", val: "ing" },
                { label: "Utilisation", val: "usage" },
              ].map((tab) => (
                <button
                  key={tab.val}
                  onClick={() => setActiveTab(tab.val as any)}
                  className={`text-[9px] font-bold uppercase tracking-widest pb-3 pr-6 border-b-2 cursor-pointer transition-smooth ${
                    activeTab === tab.val ? "border-theme-accent text-theme-accent-hover text-glow" : "border-transparent text-theme-fg/50 hover:text-theme-fg"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="text-xs text-theme-fg/80 leading-relaxed">
              {activeTab === "desc" && (
                <p>{product.description || "Aucun détail complémentaire pour ce produit."}</p>
              )}
              {activeTab === "ing" && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-theme-accent uppercase tracking-wider text-[10px]">Composition Naturelle</h4>
                  <p>Notre formule intègre des extraits 100% bio récoltés localement dans des zones préservées.</p>
                </div>
              )}
              {activeTab === "usage" && (
                <div className="space-y-3">
                  <p>Suivez les posologies conseillées sur la boîte du produit.</p>
                  <div className="p-3 bg-red-400/5 border border-red-400/10 rounded flex items-center space-x-2 text-red-400 text-[10px] font-semibold uppercase">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Précautions : Tenir hors de portée des enfants.</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

      </div>

      {/* ================== MOBILE STICKY FOOTER CTA ================== */}
      {hasPrice && !isOutOfStock && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-45 bg-theme-bg border-t border-theme-border p-4 shadow-2xl flex items-center justify-between transition-colors duration-500">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-theme-fg/50 uppercase tracking-widest">Montant Total</span>
            <span className="text-sm font-black text-theme-accent-hover text-glow">
              {(product.price! * quantity).toLocaleString("fr-FR")} FCFA
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              className="px-4 py-2.5 bg-gold-gradient text-theme-bg font-bold text-[10px] uppercase tracking-widest rounded transition-smooth cursor-pointer"
            >
              Panier
            </button>
            <a
              href={getWhatsAppMessageLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-[#25D366] text-white font-bold text-[10px] uppercase tracking-widest rounded transition-smooth cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* ================== ASSOCIATED PRODUCTS (Col 12) ================== */}
      {relatedProducts.length > 0 && (
        <div className="col-span-12 p-8 sm:p-12 border-t border-theme-border bg-theme-fg/[0.005]">
          <h2 className="font-serif text-xl sm:text-2xl font-black text-theme-fg uppercase mb-8 tracking-tight">
            Produits associés
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                className="group bg-theme-card rounded-lg overflow-hidden border border-theme-border hover:border-theme-accent/20 hover:shadow-gold transition-smooth flex flex-col card-depth hover-gold-sheen"
              >
                <div className="relative aspect-[4/3] bg-theme-accent-dark/80 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.images[0]?.url || ""}
                    alt={p.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-smooth opacity-80"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-serif font-bold text-theme-fg mb-3">{p.name}</h3>
                  <Link
                    href={`/produit/${p.slug}`}
                    className="text-xs font-bold text-theme-accent hover:text-theme-accent-hover mt-auto inline-flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Voir la fiche</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
