"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, MessageCircle, Sparkles, Tag, Package, Zap, ArrowRight, Star, Clock } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import ScrollReveal from "@/components/ui/ScrollReveal";

// =====================================================================
// CATALOGUE COMPLET — Produits individuels
// =====================================================================
const PRODUITS = [
  {
    id: "p1", slug: "gelules-ventre-plat", sku: "GVP-01",
    name: "Gélules Ventre Plat",
    shortDescription: "Formule botanique ciblant la sangle abdominale.",
    productType: "capsules",
    price: 10000, compareAtPrice: null,
    badge: null, promo: false,
    icon: "💊",
    image: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
    stock: 100,
  },
  {
    id: "p-kaylie", slug: "gelules-kaylie", sku: "GK-01",
    name: "Gélules Minceur Kaylie",
    shortDescription: "Cure 1 mois · Perte de 9 kg à plus · Premium.",
    productType: "capsules",
    price: 25000, compareAtPrice: null,
    badge: "⭐ Premium", promo: false,
    icon: "💎",
    image: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
    stock: 50,
    detail: "Cure d'un mois · Perdre de 9 kg à plus",
  },
  {
    id: "p-skinny", slug: "gelules-skinny", sku: "GS-01",
    name: "Gélules Minceur Skinny",
    shortDescription: "Cure 1 semaine · Perte de 1 kg à 9 kg.",
    productType: "capsules",
    price: 15000, compareAtPrice: null,
    badge: "⚡ Express", promo: false,
    icon: "⚡",
    image: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
    stock: 80,
    detail: "Cure d'une semaine · Perdre de 1 kg à 9 kg",
  },
  {
    id: "p2", slug: "the-detox", sku: "TD-01",
    name: "Thé Détox",
    shortDescription: "Kinkéliba & Citronnelle — Drainage & énergie.",
    productType: "tea",
    price: 5000, compareAtPrice: null,
    badge: null, promo: false,
    icon: "🍵",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
    stock: 100,
  },
  {
    id: "p3", slug: "tisane-ventre-plat", sku: "TVP-01",
    name: "Tisane Ventre Plat",
    shortDescription: "Formule ancestrale — Légèreté & confort digestif.",
    productType: "herbal_tea",
    price: 5000, compareAtPrice: null,
    badge: null, promo: false,
    icon: "🌿",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
    stock: 100,
  },
  {
    id: "p-tisane-m", slug: "tisane-minceur", sku: "TM-01",
    name: "Tisane Minceur",
    shortDescription: "Drainage & affinage silhouette — Plantes africaines.",
    productType: "herbal_tea",
    price: 8000, compareAtPrice: null,
    badge: null, promo: false,
    icon: "🌱",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
    stock: 100,
  },
  {
    id: "p-produit-m", slug: "produit-minceur", sku: "PM-01",
    name: "Produit Minceur",
    shortDescription: "Formulation complémentaire minceur.",
    productType: "supplement",
    price: 8000, compareAtPrice: null,
    badge: null, promo: false,
    icon: "🫙",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
    stock: 60,
  },
  {
    id: "p-gelules-nourrice", slug: "gelules-ventre-plat-nourrice", sku: "GVPN-01",
    name: "Gélules Ventre Plat Nourrice",
    shortDescription: "Formule post-partum et allaitement pour affiner la sangle abdominale.",
    productType: "capsules",
    price: 10000, compareAtPrice: null,
    badge: "🍼 Allaitement", promo: false,
    icon: "💊",
    image: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
    stock: 100,
  },
  {
    id: "p-caolin-nourrice", slug: "caolin-ventre-plat-nourrice", sku: "CVPN-01",
    name: "Caolin Ventre Plat Nourrice",
    shortDescription: "Soin traditionnel purifié pour raffermir le ventre des nouvelles mamans.",
    productType: "supplement",
    price: 5000, compareAtPrice: null,
    badge: "🍼 Allaitement", promo: false,
    icon: "🫙",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
    stock: 100,
  },
  {
    id: "p-tisane-nourrice", slug: "tisane-ventre-plat-nourrice", sku: "TVPN-01",
    name: "Tisane Ventre Plat Nourrice",
    shortDescription: "Infusion douce favorisant le transit et le ventre plat post-grossesse.",
    productType: "herbal_tea",
    price: 5000, compareAtPrice: null,
    badge: "🍼 Allaitement", promo: false,
    icon: "🌿",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
    stock: 100,
  },
];

// =====================================================================
// PACKS
// =====================================================================
const PACKS = [
  {
    id: "pack-1", slug: "pack-gelules-the",
    name: "Pack Gélules + Thé Détox",
    shortDescription: "Gélules Ventre Plat + Thé Détox",
    price: 14000, compareAtPrice: 15000,
    icon: "🔥",
    color: "from-amber-500/10 to-amber-700/5",
    items: ["Gélules Ventre Plat (10 000 F)", "Thé Détox (5 000 F)"],
    saving: 1000,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "pack-2", slug: "pack-gelules-tisane",
    name: "Pack Gélules + Tisane",
    shortDescription: "Gélules Ventre Plat + Tisane Ventre Plat",
    price: 14000, compareAtPrice: 15000,
    icon: "🌿",
    color: "from-emerald-500/10 to-emerald-700/5",
    items: ["Gélules Ventre Plat (10 000 F)", "Tisane Ventre Plat (5 000 F)"],
    saving: 1000,
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "pack-3", slug: "pack-the-tisane",
    name: "Pack Thé + Tisane",
    shortDescription: "Thé Détox + Tisane Ventre Plat",
    price: 10000, compareAtPrice: 10000,
    icon: "🍃",
    color: "from-teal-500/10 to-teal-700/5",
    items: ["Thé Détox (5 000 F)", "Tisane Ventre Plat (5 000 F)"],
    saving: 0,
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "pack-complet", slug: "pack-complet-3-produits",
    name: "Pack Complet 3 Produits",
    shortDescription: "Gélules + Thé Détox + Tisane",
    price: 19000, compareAtPrice: 20000,
    icon: "⭐",
    color: "from-yellow-500/10 to-yellow-700/5",
    items: ["Gélules Ventre Plat (10 000 F)", "Thé Détox (5 000 F)", "Tisane Ventre Plat (5 000 F)"],
    saving: 1000,
    image: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "pack-kaylie-the", slug: "pack-kaylie-the-detox",
    name: "Pack Gélules Kaylie + Thé Détox",
    shortDescription: "Cure premium 1 mois + Drainage quotidien",
    price: 30000, compareAtPrice: 30000,
    icon: "💎",
    color: "from-purple-500/10 to-purple-700/5",
    items: ["Gélules Kaylie (25 000 F)", "Thé Détox (5 000 F)"],
    saving: 0,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "pack-kaylie-minceur", slug: "pack-kaylie-tisane-minceur",
    name: "Pack Gélules Kaylie + Tisane Minceur",
    shortDescription: "Transformation totale : gélules + tisane",
    price: 33000, compareAtPrice: 33000,
    icon: "👑",
    color: "from-pink-500/10 to-pink-700/5",
    items: ["Gélules Kaylie (25 000 F)", "Tisane Minceur (8 000 F)"],
    saving: 0,
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "pack-skinny-the", slug: "pack-skinny-the-detox",
    name: "Pack Gélules Skinny + Thé Détox",
    shortDescription: "Résultats rapides 1 semaine + drainage",
    price: 20000, compareAtPrice: 20000,
    icon: "⚡",
    color: "from-blue-500/10 to-blue-700/5",
    items: ["Gélules Skinny (15 000 F)", "Thé Détox (5 000 F)"],
    saving: 0,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "pack-skinny-tisane", slug: "pack-skinny-tisane-minceur",
    name: "Pack Gélules Skinny + Tisane Minceur",
    shortDescription: "Express 1 semaine + tisane drainante",
    price: 23000, compareAtPrice: 23000,
    icon: "🌟",
    color: "from-orange-500/10 to-orange-700/5",
    items: ["Gélules Skinny (15 000 F)", "Tisane Minceur (8 000 F)"],
    saving: 0,
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "pack-minceur-kaylie", slug: "pack-minceur-kaylie-complet",
    name: "Pack Minceur Kaylie — 3 Produits",
    shortDescription: "Le pack complet transformation Kaylie",
    price: 38000, compareAtPrice: 38000,
    icon: "💎",
    color: "from-violet-500/10 to-violet-700/5",
    items: ["Gélules Kaylie (25 000 F)", "Thé Détox (5 000 F)", "Tisane Minceur (8 000 F)"],
    saving: 0,
    image: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "pack-minceur-skinny", slug: "pack-minceur-skinny-complet",
    name: "Pack Minceur Skinny — 3 Produits",
    shortDescription: "Le pack complet rapide Skinny",
    price: 28000, compareAtPrice: 28000,
    icon: "⚡",
    color: "from-cyan-500/10 to-cyan-700/5",
    items: ["Gélules Skinny (15 000 F)", "Thé Détox (5 000 F)", "Tisane Minceur (8 000 F)"],
    saving: 0,
    image: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "pack-nourrice-1", slug: "pack-gelules-caolin-nourrice",
    name: "Pack Gélules Nourrice + Caolin",
    shortDescription: "Duo Ventre Plat Nourrice & Maman",
    price: 14000, compareAtPrice: 15000,
    icon: "🍼",
    color: "from-emerald-500/10 to-teal-700/5",
    items: ["Gélules Nourrice (10 000 F)", "Caolin Nourrice (5 000 F)"],
    saving: 1000,
    image: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "pack-nourrice-2", slug: "pack-gelules-tisane-nourrice",
    name: "Pack Gélules Nourrice + Tisane",
    shortDescription: "Duo Ventre Plat & Transit Doux",
    price: 14000, compareAtPrice: 15000,
    icon: "🍼",
    color: "from-emerald-500/10 to-emerald-700/5",
    items: ["Gélules Nourrice (10 000 F)", "Tisane Nourrice (5 000 F)"],
    saving: 1000,
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "pack-nourrice-3", slug: "pack-caolin-tisane-nourrice",
    name: "Pack Caolin Nourrice + Tisane",
    shortDescription: "Duo Drainage & Fermeté",
    price: 10000, compareAtPrice: 10000,
    icon: "🍼",
    color: "from-amber-500/10 to-emerald-700/5",
    items: ["Caolin Nourrice (5 000 F)", "Tisane Nourrice (5 000 F)"],
    saving: 0,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "pack-nourrice-4", slug: "pack-complet-nourrice",
    name: "Pack Complet Nourrice",
    shortDescription: "Le pack complet 3 produits Ventre Plat Nourrice",
    price: 20000, compareAtPrice: 20000,
    icon: "⭐",
    color: "from-yellow-500/10 to-amber-700/5",
    items: ["Gélules Nourrice (10 000 F)", "Caolin Nourrice (5 000 F)", "Tisane Nourrice (5 000 F)"],
    saving: 0,
    image: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "pack-nourrice-kit", slug: "kit-ventre-plat-nourrice",
    name: "Kit Ventre Plat Nourrice",
    shortDescription: "Promotion spéciale : Kit Ventre Plat complet pour Maman",
    price: 15000, compareAtPrice: 20000,
    icon: "🎁",
    color: "from-red-500/10 to-amber-700/5",
    items: ["Gélules Nourrice (10 000 F)", "Caolin Nourrice (5 000 F)", "Tisane Nourrice (5 000 F)"],
    saving: 5000,
    image: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop",
    featured: true,
    badge: "🍼 Allaitement",
  },
];

// =====================================================================
// LIVRAISON
// =====================================================================
const LIVRAISON = [
  { zone: "Abidjan", tarif: "1 000 – 1 500 F CFA", icon: "🏙️" },
  { zone: "Hors Abidjan", tarif: "2 500 F CFA", icon: "🌍" },
];

// =====================================================================
// CATÉGORIES FILTRES
// =====================================================================
const CATEGORIES = [
  { label: "Tous les rituels", val: "all" },
  { label: "Produits seuls", val: "solo" },
  { label: "Packs & Duos", val: "packs" },
  { label: "Gélules", val: "capsules" },
  { label: "Thés & Tisanes", val: "infusions" },
];

export default function BoutiquePage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const addItem = useCart((state) => state.addItem);

  const getWhatsAppLink = (name: string, price: number) => {
    const msg = encodeURIComponent(
      `Bonjour CAROANA MINCEUR 🌿, je souhaite commander : « ${name} » à ${price.toLocaleString("fr-FR")} F CFA. Merci de me confirmer la disponibilité.`
    );
    return `https://wa.me/2250143655088?text=${msg}`;
  };

  // Filter logic
  const showSolo = activeTab === "all" || activeTab === "solo" || activeTab === "capsules" || activeTab === "infusions";
  const showPacks = activeTab === "all" || activeTab === "packs";

  const filteredProduits = PRODUITS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeTab === "all" || activeTab === "solo" ||
      (activeTab === "capsules" && p.productType === "capsules") ||
      (activeTab === "infusions" && (p.productType === "tea" || p.productType === "herbal_tea" || p.productType === "supplement"));
    return matchSearch && matchCat;
  });

  const filteredPacks = PACKS.filter((p) => {
    return p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="pt-16 min-h-screen transition-colors duration-500" style={{ background: "var(--color-theme-bg)", color: "var(--color-theme-fg)" }}>

      {/* ====== PROMO BANNER ====== */}
      <div
        className="w-full py-3 px-4 text-center text-[10px] font-bold uppercase tracking-widest"
        style={{
          background: "var(--color-theme-accent)",
          color: "var(--color-theme-bg)",
          animation: "pulse-glow 4s ease-in-out infinite",
        }}
      >
        <Tag className="inline w-3 h-3 mr-1" />
        🎁 PROMO : Kit Ventre Plat Nourrice à 15 000 F au lieu de 20 000 F &nbsp;|&nbsp; 3 paquets Tisane & Thé à 10 000 F &nbsp;|&nbsp; Livraison Abidjan dès 1 000 F CFA
      </div>

      {/* ====== HEADER SECTION ====== */}
      <div className="border-b" style={{ borderColor: "var(--color-theme-border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-14 space-y-6">
          <ScrollReveal animation="fade-up">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3 h-3" style={{ color: "var(--color-theme-accent)" }} />
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: "var(--color-theme-accent)" }}>
                Boutique Officielle
              </span>
            </div>
            <h1 className="font-sans text-4xl sm:text-6xl font-black uppercase tracking-tighter"
              style={{ color: "var(--color-theme-fg)" }}>
              La Boutique<br />
              <span style={{ color: "var(--color-theme-accent)" }}>Caroana Minceur</span>
            </h1>
            <p className="text-xs max-w-xl leading-relaxed mt-3" style={{ color: "var(--color-theme-muted)" }}>
              Produits individuels, packs synergiques et promotions — Toutes nos formules sont issues de plantes africaines sélectionnées à la source.
            </p>
          </ScrollReveal>

          {/* Search bar */}
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Rechercher un produit ou un pack..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-4 pr-10 py-3 border rounded-lg text-sm focus:outline-none transition-all"
                style={{
                  background: "var(--color-theme-card)",
                  borderColor: "var(--color-theme-border)",
                  color: "var(--color-theme-fg)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-theme-accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-theme-border)")}
              />
            </div>
          </ScrollReveal>

          {/* Category tabs */}
          <ScrollReveal animation="fade-up" delay={150}>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.val}
                  onClick={() => setActiveTab(cat.val)}
                  className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded border transition-all duration-300 cursor-pointer"
                  style={{
                    background: activeTab === cat.val ? "var(--color-theme-accent)" : "transparent",
                    color: activeTab === cat.val ? "var(--color-theme-bg)" : "var(--color-theme-muted)",
                    borderColor: activeTab === cat.val ? "var(--color-theme-accent)" : "var(--color-theme-border)",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">

        {/* ====== PRODUITS INDIVIDUELS ====== */}
        {showSolo && filteredProduits.length > 0 && (
          <section className="space-y-10">
            <ScrollReveal animation="fade-up">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1" style={{ background: "var(--color-theme-border)" }} />
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" style={{ color: "var(--color-theme-accent)" }} />
                  <h2 className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--color-theme-accent)" }}>
                    Produits Individuels
                  </h2>
                </div>
                <div className="h-px flex-1" style={{ background: "var(--color-theme-border)" }} />
              </div>
            </ScrollReveal>

            {/* Gélules Kaylie + Skinny — Highlight */}
            {(activeTab === "all" || activeTab === "solo" || activeTab === "capsules") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                {[PRODUITS[1]!, PRODUITS[2]!].map((p, idx) => (
                  <ScrollReveal key={p.id} animation="fade-up" delay={idx * 100}>
                    <div
                      className="relative rounded-xl p-6 border hover-gold-sheen glow-on-hover transition-all duration-500 overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, rgba(var(--color-theme-accent-rgb), 0.06) 0%, var(--color-theme-card) 100%)`,
                        borderColor: "rgba(var(--color-theme-accent-rgb), 0.3)",
                      }}
                    >
                      {/* Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg">{p.icon}</span>
                        <span
                          className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
                          style={{ background: "var(--color-theme-accent)", color: "var(--color-theme-bg)" }}
                        >
                          {p.badge}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-black mb-1" style={{ color: "var(--color-theme-fg)" }}>{p.name}</h3>
                      <p className="text-[11px] mb-2" style={{ color: "var(--color-theme-muted)" }}>{p.shortDescription}</p>
                      {p.detail && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold mb-4" style={{ color: "var(--color-theme-accent)" }}>
                          <Clock className="w-3 h-3" />
                          <span>{p.detail}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-4 border-t"
                        style={{ borderColor: "var(--color-theme-border)" }}>
                        <span className="text-2xl font-black font-mono" style={{ color: "var(--color-theme-accent)", textShadow: "0 0 15px rgba(var(--color-theme-accent-rgb), 0.4)" }}>
                          {p.price.toLocaleString("fr-FR")} F
                        </span>
                        <a
                          href={getWhatsAppLink(p.name, p.price)}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all"
                          style={{ background: "#25D366", color: "#fff" }}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Commander
                        </a>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}

            {/* Autres produits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProduits.filter(p => p.id !== "p-kaylie" && p.id !== "p-skinny").map((p, idx) => (
                <ScrollReveal key={p.id} animation="fade-up" delay={(idx % 4) * 80}>
                  <div
                    className="relative rounded-xl p-5 border flex flex-col gap-4 hover-gold-sheen glow-on-hover transition-all duration-500"
                    style={{
                      background: "var(--color-theme-card)",
                      borderColor: "var(--color-theme-border)",
                    }}
                  >
                    <div className="aspect-video rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-smooth" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span>{p.icon}</span>
                        <h3 className="font-serif font-bold text-sm" style={{ color: "var(--color-theme-fg)" }}>{p.name}</h3>
                      </div>
                      <p className="text-[10px] leading-relaxed" style={{ color: "var(--color-theme-muted)" }}>{p.shortDescription}</p>
                    </div>

                    <div className="mt-auto pt-3 border-t flex items-center justify-between gap-2"
                      style={{ borderColor: "var(--color-theme-border)" }}>
                      <span className="text-base font-black font-mono" style={{ color: "var(--color-theme-accent)" }}>
                        {p.price.toLocaleString("fr-FR")} F
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addItem({ productId: p.id, variantId: null, sku: p.sku, name: p.name, price: p.price, imageUrl: p.image })}
                          className="p-2 border rounded transition-all cursor-pointer"
                          style={{ borderColor: "var(--color-theme-border)", color: "var(--color-theme-fg)" }}
                          title="Ajouter au panier"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={getWhatsAppLink(p.name, p.price)}
                          target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded transition-all cursor-pointer"
                          style={{ background: "#25D366", color: "#fff" }}
                          title="Commander WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* ====== PROMOTION SPECIALE ====== */}
        {(activeTab === "all" || activeTab === "packs") && (
          <section className="space-y-8">
            <ScrollReveal animation="scale-up">
              <div
                className="relative rounded-2xl p-8 sm:p-12 overflow-hidden border"
                style={{
                  background: "linear-gradient(135deg, rgba(var(--color-theme-accent-rgb), 0.1) 0%, var(--color-theme-card) 60%)",
                  borderColor: "rgba(var(--color-theme-accent-rgb), 0.35)",
                }}
              >
                {/* Glow orb */}
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(var(--color-theme-accent-rgb), 0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" style={{ color: "var(--color-theme-accent)" }} />
                      <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--color-theme-accent)" }}>
                        Promotion Exclusive
                      </span>
                    </div>
                    <h2 className="font-sans text-2xl sm:text-4xl font-black uppercase tracking-tight" style={{ color: "var(--color-theme-fg)" }}>
                      Tisane & Thé Détox<br />
                      <span style={{ color: "var(--color-theme-accent)" }}>3 paquets à 10 000 F</span>
                    </h2>
                    <p className="text-sm" style={{ color: "var(--color-theme-muted)" }}>
                      Au lieu de <s>15 000 F CFA</s> — Économisez <strong style={{ color: "var(--color-theme-accent)" }}>5 000 F CFA</strong>
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold" style={{ color: "var(--color-theme-accent)" }}>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Offre limitée · Stock disponible</span>
                    </div>
                  </div>
                  <a
                    href={getWhatsAppLink("Promotion Tisane + Thé Détox (3 paquets)", 10000)}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-black text-sm uppercase tracking-widest transition-all btn-accent flex-shrink-0"
                  >
                    <span>Profiter de l&apos;offre</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </section>
        )}

        {/* ====== PACKS & DUOS ====== */}
        {showPacks && filteredPacks.length > 0 && (
          <section className="space-y-10">
            <ScrollReveal animation="fade-up">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1" style={{ background: "var(--color-theme-border)" }} />
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" style={{ color: "var(--color-theme-accent)" }} />
                  <h2 className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--color-theme-accent)" }}>
                    Packs & Synergies
                  </h2>
                </div>
                <div className="h-px flex-1" style={{ background: "var(--color-theme-border)" }} />
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPacks.map((pack, idx) => (
                <ScrollReveal key={pack.id} animation="fade-up" delay={(idx % 3) * 100}>
                  <div
                    className={`relative rounded-xl p-6 border flex flex-col gap-4 hover-gold-sheen transition-all duration-500 overflow-hidden ${pack.featured ? "glow-on-hover" : ""}`}
                    style={{
                      background: pack.featured
                        ? `linear-gradient(135deg, rgba(var(--color-theme-accent-rgb), 0.08) 0%, var(--color-theme-card) 100%)`
                        : "var(--color-theme-card)",
                      borderColor: pack.featured ? "rgba(var(--color-theme-accent-rgb), 0.3)" : "var(--color-theme-border)",
                    }}
                  >
                    {pack.featured && (
                      <div
                        className="absolute top-3 right-3 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{ background: "var(--color-theme-accent)", color: "var(--color-theme-bg)" }}
                      >
                        ⭐ Populaire
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{pack.icon}</span>
                      <div>
                        <h3 className="font-serif font-black text-sm leading-tight" style={{ color: "var(--color-theme-fg)" }}>{pack.name}</h3>
                        <p className="text-[10px] mt-0.5" style={{ color: "var(--color-theme-muted)" }}>{pack.shortDescription}</p>
                      </div>
                    </div>

                    {/* Items list */}
                    <ul className="space-y-1.5">
                      {pack.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-[10px]" style={{ color: "var(--color-theme-muted)" }}>
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--color-theme-accent)" }} />
                          {item}
                        </li>
                      ))}
                    </ul>

                    {/* Price */}
                    <div className="mt-auto pt-4 border-t space-y-3" style={{ borderColor: "var(--color-theme-border)" }}>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black font-mono" style={{ color: "var(--color-theme-accent)" }}>
                          {pack.price.toLocaleString("fr-FR")} F CFA
                        </span>
                        {pack.saving > 0 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(var(--color-theme-accent-rgb), 0.15)", color: "var(--color-theme-accent)" }}>
                            −{pack.saving.toLocaleString("fr-FR")} F économisés
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => addItem({
                            productId: pack.id, variantId: null,
                            sku: pack.id.toUpperCase(), name: pack.name,
                            price: pack.price, imageUrl: pack.image
                          })}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                          style={{ borderColor: "var(--color-theme-border)", color: "var(--color-theme-fg)" }}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Panier
                        </button>
                        <a
                          href={getWhatsAppLink(pack.name, pack.price)}
                          target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all"
                          style={{ background: "#25D366", color: "#fff" }}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* ====== LIVRAISON INFO ====== */}
        <ScrollReveal animation="scale-up">
          <div
            className="rounded-xl p-8 border"
            style={{ background: "var(--color-theme-card)", borderColor: "var(--color-theme-border)" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-lg">🚚</span>
              <h3 className="font-sans font-black text-sm uppercase tracking-widest" style={{ color: "var(--color-theme-fg)" }}>
                Frais de Livraison
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LIVRAISON.map((z) => (
                <div
                  key={z.zone}
                  className="flex items-center justify-between p-4 rounded-lg border"
                  style={{ borderColor: "var(--color-theme-border)", background: "var(--color-theme-surface, rgba(var(--color-theme-accent-rgb), 0.02))" }}
                >
                  <div className="flex items-center gap-2">
                    <span>{z.icon}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--color-theme-fg)" }}>{z.zone}</span>
                  </div>
                  <span className="text-sm font-black font-mono" style={{ color: "var(--color-theme-accent)" }}>{z.tarif}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] mt-4 text-center" style={{ color: "var(--color-theme-muted)" }}>
              Paiement à la livraison disponible · WhatsApp :{" "}
              <a href="https://wa.me/2250143655088" className="font-bold" style={{ color: "var(--color-theme-accent)" }}>
                +225 01 43 65 50 88
              </a>
            </p>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
