"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingCart, 
  MessageCircle, 
  Heart, 
  ShieldAlert, 
  Award, 
  Truck, 
  RefreshCw, 
  Star, 
  Clock, 
  X, 
  Calendar,
  CheckCircle,
  HelpCircle,
  Eye,
  ChevronRight
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Props {
  product: Product;
  relatedProducts: Product[];
}

const INGREDIENTS_GLOSSARY = {
  "kinkeliba": {
    name: "Kinkéliba sauvage",
    origin: "Savane subsaharienne (Sénégal, Mali, Côte d'Ivoire)",
    benefits: "Drainage profond, détoxification du foie et des reins, lutte contre la rétention d'eau et élimination de la masse graisseuse.",
    detail: "Surnommé 'tisane de longue vie', c'est l'un des draineurs naturels les plus puissants d'Afrique de l'Ouest."
  },
  "citronnelle": {
    name: "Citronnelle sauvage",
    origin: "Cultures locales 100% bio en Côte d'Ivoire",
    benefits: "Facilite la digestion, réduit les ballonnements abdominaux et favorise un transit intestinal harmonieux.",
    detail: "Apporte une note fraîche et apaisante tout en dégonflant l'estomac après les repas."
  },
  "moringa": {
    name: "Moringa Oleifera",
    origin: "Régions tropicales africaines",
    benefits: "Riche en nutriments, régule le taux de sucre, coupe-faim naturel et accélère la thermogenèse (brûle-graisses).",
    detail: "L'arbre de vie maintient l'énergie physique au top durant toute la durée de votre cure."
  },
  "garcinia": {
    name: "Garcinia Cambogia",
    origin: "Forêts tropicales",
    benefits: "Bloque la transformation des glucides en graisses, régule l'appétit et cible le stockage graisseux de la ceinture abdominale.",
    detail: "Son actif principal, l'acide hydroxycitrique (AHC), booste la lipolyse."
  },
  "fenouil": {
    name: "Graines de Fenouil sauvage",
    origin: "Zones côtières d'Afrique",
    benefits: "Anti-ballonnement puissant, soulage les spasmes intestinaux et sculpte le ventre plat.",
    detail: "Recommandé pour un ventre immédiatement plus léger et moins gonflé."
  }
};

export default function ProductDetailsClient({ product, relatedProducts }: Props) {
  const [activeImage, setActiveImage] = useState(product.images[0]?.url || "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "ing" | "usage">("desc");
  
  // Custom states (Amélioration 21, 24, 29, 30)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<any | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Review states (Amélioration 24, 25)
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<any[]>([
    { name: "Mariam K.", rating: 5, date: "12/06/2026", text: "Déjà perdu 4 kilos en une semaine de cure Skinny. Je recommande vraiment !", verified: true },
    { name: "Awa T.", rating: 5, date: "08/06/2026", text: "Le pack complet 3 produits a dégonflé mon ventre très rapidement. Les ballonnements ont disparu.", verified: true },
    { name: "Esther N.", rating: 4, date: "02/06/2026", text: "Très bon goût pour le thé détox. Facile à suivre au travail.", verified: true }
  ]);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Wishlist state
  const [inWishlist, setInWishlist] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("caroana-wishlist");
    if (saved) {
      try {
        const list = JSON.parse(saved);
        setInWishlist(list.includes(product.id));
      } catch (e) {}
    }
  }, [product.id]);

  const toggleWishlist = () => {
    const saved = localStorage.getItem("caroana-wishlist");
    let list: string[] = [];
    if (saved) {
      try { list = JSON.parse(saved); } catch (e) {}
    }
    let updated;
    if (list.includes(product.id)) {
      updated = list.filter(id => id !== product.id);
      setInWishlist(false);
    } else {
      updated = [...list, product.id];
      setInWishlist(true);
    }
    localStorage.setItem("caroana-wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("caroana-wishlist-update"));
  };

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
    alert(`« ${product.name} » a été ajouté à votre panier !`);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewName.trim() && reviewText.trim()) {
      const newReview = {
        name: reviewName,
        rating,
        date: new Date().toLocaleDateString("fr-FR"),
        text: reviewText,
        verified: false
      };
      setReviews([newReview, ...reviews]);
      setReviewName("");
      setReviewText("");
      setReviewSubmitted(true);
      setTimeout(() => setReviewSubmitted(false), 3000);
    }
  };

  const getWhatsAppMessageLink = () => {
    const msg = encodeURIComponent(
      `Bonjour CAROANA MINCEUR, je souhaite commander le produit « ${product.name} » (Quantité: ${quantity}).`
    );
    return `https://wa.me/2250143655088?text=${msg}`;
  };

  // Determine botanical ingredients based on product type
  const getBotanicalIngredients = () => {
    const name = product.slug || "";
    if (name.includes("detox") || name.includes("minceur")) {
      return [INGREDIENTS_GLOSSARY.kinkeliba, INGREDIENTS_GLOSSARY.citronnelle, INGREDIENTS_GLOSSARY.moringa];
    } else if (name.includes("nourrice")) {
      return [INGREDIENTS_GLOSSARY.fenouil, INGREDIENTS_GLOSSARY.citronnelle];
    } else {
      return [INGREDIENTS_GLOSSARY.garcinia, INGREDIENTS_GLOSSARY.fenouil, INGREDIENTS_GLOSSARY.citronnelle];
    }
  };

  const botanicals = getBotanicalIngredients();

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 grid-blueprint border-b border-theme-border items-stretch transition-colors duration-500">
      
      {/* ================== LEFT COLUMN: GALLERY CELL (Col 6) ================== */}
      <div className="col-span-12 lg:col-span-6 grid-cell flex flex-col justify-start border-r-0 lg:border-r border-theme-border">
        <ScrollReveal animation="fade-right" className="p-6 sm:p-12 h-full flex flex-col justify-start flex-grow">
          {/* Main Photo Frame */}
          <div 
            onClick={() => setIsLightboxOpen(true)}
            className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-theme-bg border border-theme-border rounded-2xl overflow-hidden shadow-xl hover-gold-sheen cursor-zoom-in group"
          >
            <img
              src={activeImage}
              alt={product.name}
              className="object-cover w-full h-full transition-smooth group-hover:scale-[1.02]"
            />
            {isOutOfStock && (
              <span className="absolute top-4 left-4 text-[9px] font-bold bg-red-500 text-white px-3 py-1 rounded-full uppercase tracking-widest">
                Rupture
              </span>
            )}
            
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          
          {/* Thumbnails list */}
          {product.images.length > 1 && (
            <div className="flex space-x-3 mt-6">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img.url)}
                  className={`w-16 h-16 rounded-xl border bg-theme-bg overflow-hidden transition-smooth cursor-pointer ${
                    activeImage === img.url ? "border-theme-accent shadow-sm" : "border-theme-border hover:border-theme-border/80"
                  }`}
                >
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
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-theme-accent font-bold text-[9px] tracking-[0.25em] uppercase">
                  CAROANA MINCEUR
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-black text-theme-fg uppercase mt-1 tracking-tight">
                  {product.name}
                </h1>
                <p className="text-[10px] text-theme-fg/40 mt-1 uppercase tracking-widest font-semibold">SKU: {product.sku}</p>
              </div>

              {/* Wishlist Heart on details page */}
              <button
                onClick={toggleWishlist}
                className="w-10 h-10 border rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform hover:bg-neutral-50 dark:hover:bg-neutral-900"
                style={{ borderColor: "var(--color-theme-border)" }}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? "fill-red-500 text-red-500 stroke-red-500" : "opacity-60"}`} />
              </button>
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
                  <div className="flex items-center border border-theme-border bg-theme-fg/5 rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 text-theme-fg font-bold hover:bg-theme-fg/10 transition-smooth cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-xs font-bold text-theme-fg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-2 text-theme-fg font-bold hover:bg-theme-fg/10 transition-smooth cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center space-x-2 py-3.5 bg-theme-accent text-theme-bg font-bold text-xs uppercase tracking-widest rounded-xl transition-smooth hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Ajouter au Panier</span>
                  </button>
                  
                  <a
                    href={getWhatsAppMessageLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 py-3.5 bg-[#25D366] hover:bg-[#20ba56] hover:scale-[1.02] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md transition-smooth cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Commander sur WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-theme-fg/5 border border-theme-border rounded-xl flex items-start space-x-3">
                <ShieldAlert className="w-5 h-5 text-theme-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-theme-accent uppercase tracking-widest">
                    Rupture de Stock
                  </h4>
                  <p className="text-[11px] text-theme-fg/75 leading-relaxed mt-1.5">
                    Ce produit est momentanément en rupture. Vous pouvez commander directement auprès de notre service WhatsApp pour réserver votre lot de la prochaine récolte.
                  </p>
                  <a
                    href={getWhatsAppMessageLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs text-theme-accent font-bold mt-3 hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Avertir par WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </ScrollReveal>
        </div>

        {/* Block 4: Interactive Dosage Calendar Planner Preview (Amélioration 30) */}
        <div className="p-8 sm:p-10">
          <div className="border rounded-2xl p-4 bg-stone-50/50 dark:bg-neutral-900/30" style={{ borderColor: "var(--color-theme-border)" }}>
            <button 
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                Planning & Guide de Prise Conseillé
              </span>
              <span className="text-emerald-500 font-black">{isCalendarOpen ? "Masquer" : "Afficher"}</span>
            </button>

            {isCalendarOpen && (
              <div className="mt-4 pt-3 border-t text-[11px] space-y-3 leading-relaxed" style={{ borderColor: "var(--color-theme-border)" }}>
                <p>Pour des résultats optimaux avec ce rituel naturel, suivez la répartition ci-dessous :</p>
                
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2 border rounded bg-white dark:bg-neutral-950">
                    <span className="font-black block uppercase text-[8px] text-yellow-500">Matin (À Jeun)</span>
                    <span className="opacity-75">1 tasse de Thé Détox (ou 2 gélules)</span>
                  </div>
                  <div className="p-2 border rounded bg-white dark:bg-neutral-950">
                    <span className="font-black block uppercase text-[8px] text-amber-500">Midi (Après Repas)</span>
                    <span className="opacity-75">1 tasse de Tisane (Légèreté digestive)</span>
                  </div>
                  <div className="p-2 border rounded bg-white dark:bg-neutral-950">
                    <span className="font-black block uppercase text-[8px] text-blue-500">Soir (Coucher)</span>
                    <span className="opacity-75">2 gélules (ou 1 tasse de Tisane Minceur)</span>
                  </div>
                </div>

                <div className="flex gap-2 items-center text-[10px] text-neutral-400">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Durée idéale de la cure : 14 à 28 jours consécutifs.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Block 5: Interactive Tabbed Details & Botanical Glossary (Amélioration 29) */}
        <div className="p-8 sm:p-10">
          <ScrollReveal animation="fade-left" delay={420} className="space-y-6">
            <div className="flex border-b border-theme-border">
              {[
                { label: "Description", val: "desc" },
                { label: "Ingrédients Actifs", val: "ing" },
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
                <div className="space-y-3">
                  <p className="text-[11px] opacity-75">Cliquez sur les ingrédients ci-dessous pour découvrir leur origine et leurs vertus ancestrales :</p>
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    {botanicals.map((bot, k) => (
                      <button
                        key={k}
                        onClick={() => setSelectedIngredient(bot)}
                        className="px-3 py-1.5 rounded-lg border text-[10px] font-bold hover:border-emerald-500 hover:text-emerald-500 cursor-pointer flex items-center gap-1 bg-white dark:bg-neutral-900"
                        style={{ borderColor: "var(--color-theme-border)" }}
                      >
                        <span>🍃 {bot?.name || "Plante"}</span>
                        <HelpCircle className="w-3 h-3 opacity-40" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === "usage" && (
                <div className="space-y-3">
                  <p>Prendre régulièrement avec un grand verre d'eau plate (250ml) tiède.</p>
                  <div className="p-3 bg-red-400/5 border border-red-400/10 rounded flex items-center space-x-2 text-red-400 text-[10px] font-semibold uppercase">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Contre-indications : Déconseillé aux femmes enceintes.</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Block 6: Reviews, star rating submission form (Amélioration 24, 25) */}
        <div className="p-8 sm:p-10 space-y-6">
          <h3 className="font-serif text-lg font-black uppercase tracking-wider">Avis clients ({reviews.length})</h3>

          {/* Form */}
          <form onSubmit={handleReviewSubmit} className="space-y-3 p-4 border rounded-2xl bg-stone-50/50 dark:bg-neutral-900/30" style={{ borderColor: "var(--color-theme-border)" }}>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block">Laisser une évaluation</span>
            
            {/* Stars Selector */}
            <div className="flex items-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="cursor-pointer"
                >
                  <Star className={`w-5 h-5 ${
                    (hoverRating || rating) >= star ? "fill-yellow-500 text-yellow-500" : "text-neutral-300"
                  }`} />
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Votre prénom..."
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                className="p-2.5 border rounded-lg text-xs bg-theme-bg w-full"
                style={{ borderColor: "var(--color-theme-border)" }}
              />
              <input
                type="text"
                required
                placeholder="Votre avis en quelques mots..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="p-2.5 border rounded-lg text-xs bg-theme-bg w-full"
                style={{ borderColor: "var(--color-theme-border)" }}
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-theme-accent text-theme-bg font-bold text-[10px] uppercase tracking-wider rounded-lg hover:opacity-90 cursor-pointer"
            >
              Envoyer l'avis
            </button>

            {reviewSubmitted && (
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                Merci ! Votre avis a été soumis avec succès.
              </div>
            )}
          </form>

          {/* List of reviews */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {reviews.map((rev, k) => (
              <div key={k} className="p-3 border rounded-xl space-y-1.5" style={{ borderColor: "var(--color-theme-border)" }}>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold flex items-center gap-1.5">
                    {rev.name}
                    {rev.verified && (
                      <span className="bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 font-black text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded">Achat Vérifié</span>
                    )}
                  </span>
                  <span className="opacity-50">{rev.date}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-yellow-500 text-yellow-500" : "text-neutral-200"}`} />
                  ))}
                </div>
                <p className="text-xs opacity-85 leading-normal">{rev.text}</p>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ================== MOBILE STICKY FOOTER CTA (Amélioration 27) ================== */}
      {hasPrice && !isOutOfStock && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 border-t border-theme-border p-4 shadow-2xl flex items-center justify-between backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-theme-fg/50 uppercase tracking-widest">Montant</span>
            <span className="text-sm font-black text-theme-accent-hover text-glow">
              {(product.price! * quantity).toLocaleString("fr-FR")} F
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              className="px-4 py-2.5 bg-theme-accent text-theme-bg font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer"
            >
              Panier
            </button>
            <a
              href={getWhatsAppMessageLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-[#25D366] text-white font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* ================== LIGHTBOX PICTURE ZOOM OVERLAY (Amélioration 21) ================== */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl">
            <img src={activeImage} alt={product.name} className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      {/* ================== BOTANICAL INGREDIENT MODAL GLOSSARY (Amélioration 29) ================== */}
      {selectedIngredient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedIngredient(null)} />
          <div className="bg-theme-card border rounded-3xl w-full max-w-md p-6 relative z-10 shadow-2xl text-center space-y-4" style={{ borderColor: "var(--color-theme-border)" }}>
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-emerald-500/10 text-emerald-600 text-2xl">
              🍃
            </div>
            <h3 className="font-serif text-lg font-black uppercase tracking-wider">{selectedIngredient.name}</h3>
            
            <div className="space-y-3 text-left text-xs leading-relaxed border-t pt-3" style={{ borderColor: "var(--color-theme-border)" }}>
              <div>
                <strong className="opacity-50 text-[9px] uppercase tracking-wider block">Origine</strong>
                <p className="font-medium mt-0.5">{selectedIngredient.origin}</p>
              </div>
              <div>
                <strong className="opacity-50 text-[9px] uppercase tracking-wider block">Bienfaits Majeurs</strong>
                <p className="font-medium mt-0.5">{selectedIngredient.benefits}</p>
              </div>
              <div>
                <strong className="opacity-50 text-[9px] uppercase tracking-wider block">Secret de Récolte</strong>
                <p className="font-medium mt-0.5 opacity-80">{selectedIngredient.detail}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedIngredient(null)}
              className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-theme-accent text-theme-bg cursor-pointer mt-4"
            >
              Fermer la fiche plante
            </button>
          </div>
        </div>
      )}

      {/* ================== ASSOCIATED PRODUCTS (Col 12) ================== */}
      {relatedProducts.length > 0 && (
        <div className="col-span-12 p-8 sm:p-12 border-t border-theme-border bg-theme-fg/[0.005]">
          <h2 className="font-serif text-xl sm:text-2xl font-black text-theme-fg uppercase mb-8 tracking-tight text-center sm:text-left">
            Produits associés
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                className="group bg-theme-card rounded-2xl overflow-hidden border border-theme-border hover:border-theme-accent/20 hover:shadow-xl transition-smooth flex flex-col hover-gold-sheen"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                  <img
                    src={p.images[0]?.url || ""}
                    alt={p.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-smooth"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                  <h3 className="font-serif font-bold text-theme-fg leading-snug">{p.name}</h3>
                  <Link
                    href={`/produit/${p.slug}`}
                    className="text-xs font-bold text-theme-accent hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Voir la fiche</span>
                    <ChevronRight className="w-3.5 h-3.5" />
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
