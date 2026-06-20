"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingCart, 
  MessageCircle, 
  Sparkles, 
  Tag, 
  Package, 
  Zap, 
  ArrowRight, 
  Star, 
  Clock, 
  Heart, 
  ArrowUpDown, 
  ChevronRight, 
  Check, 
  X, 
  AlertCircle,
  Copy,
  Scale
} from "lucide-react";
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
    stock: 12,
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
    stock: 4,
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
    stock: 8,
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
    stock: 35,
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
    stock: 18,
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
    stock: 22,
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
    stock: 3,
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
    stock: 15,
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
    stock: 19,
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
    stock: 14,
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
  const [sortOption, setSortOption] = useState<"default" | "price-asc" | "price-desc">("default");
  const addItem = useCart((state) => state.addItem);

  // Wishlist State (Amélioration 3, 4)
  const [wishlist, setWishlist] = useState<string[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem("caroana-wishlist");
    if (saved) {
      try { setWishlist(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const toggleWishlist = (id: string) => {
    let updated;
    if (wishlist.includes(id)) {
      updated = wishlist.filter(item => item !== id);
    } else {
      updated = [...wishlist, id];
    }
    setWishlist(updated);
    localStorage.setItem("caroana-wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("caroana-wishlist-update"));
  };

  // Comparator State (Amélioration 15)
  const [compareList, setCompareList] = useState<any[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const toggleCompare = (prod: any) => {
    if (compareList.some(item => item.id === prod.id)) {
      setCompareList(compareList.filter(item => item.id !== prod.id));
    } else {
      if (compareList.length >= 3) {
        alert("Vous pouvez comparer un maximum de 3 produits simultanément.");
        return;
      }
      setCompareList([...compareList, prod]);
    }
  };

  // Dynamic Dispatch Timer (Amélioration 48)
  const [dispatchTime, setDispatchTime] = useState("");
  useEffect(() => {
    const calcTime = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(17, 0, 0, 0); // Dispatches at 17:00 CIV time
      let diff = target.getTime() - now.getTime();
      if (diff < 0) {
        target.setDate(target.getDate() + 1);
        diff = target.getTime() - now.getTime();
      }
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setDispatchTime(`${hrs}h ${mins}m`);
    };
    calcTime();
    const interval = setInterval(calcTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Promo Banner Countdown (Amélioration 7)
  const [promoCountdown, setPromoCountdown] = useState("02:45:12");
  useEffect(() => {
    let secs = 9912; // simulated countdown seconds
    const interval = setInterval(() => {
      secs--;
      if (secs <= 0) secs = 9912;
      const h = Math.floor(secs / 3600).toString().padStart(2, "0");
      const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
      const s = (secs % 60).toString().padStart(2, "0");
      setPromoCountdown(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Quick Add handler (Amélioration 12)
  const handleQuickAdd = (p: any) => {
    addItem({
      productId: p.id,
      variantId: null,
      sku: p.sku || "PK-NEW",
      name: p.name,
      price: p.price,
      imageUrl: p.image,
      quantity: 1
    });
    alert(`« ${p.name} » a été ajouté à votre panier !`);
  };

  // Copy Promo Code (Amélioration 16)
  const [copiedCode, setCopiedCode] = useState(false);
  const handleCopyCode = () => {
    navigator.clipboard.writeText("CAROANA10");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getWhatsAppLink = (name: string, price: number) => {
    const msg = encodeURIComponent(
      `Bonjour CAROANA MINCEUR 🌿, je souhaite commander : « ${name} » à ${price.toLocaleString("fr-FR")} F CFA. Merci de me confirmer la disponibilité.`
    );
    return `https://wa.me/2250143655088?text=${msg}`;
  };

  // Filtering products
  let filteredProduits = PRODUITS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeTab === "all" || activeTab === "solo" ||
      (activeTab === "capsules" && p.productType === "capsules") ||
      (activeTab === "infusions" && (p.productType === "tea" || p.productType === "herbal_tea" || p.productType === "supplement"));
    return matchSearch && matchCat;
  });

  // Sorting products
  if (sortOption === "price-asc") {
    filteredProduits = [...filteredProduits].sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-desc") {
    filteredProduits = [...filteredProduits].sort((a, b) => b.price - a.price);
  }

  // Filter packs
  const filteredPacks = PACKS.filter((p) => {
    return p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase());
  });

  const showSolo = activeTab === "all" || activeTab === "solo" || activeTab === "capsules" || activeTab === "infusions";
  const showPacks = activeTab === "all" || activeTab === "packs";

  return (
    <div className="pt-16 min-h-screen transition-colors duration-500 relative" style={{ background: "var(--color-theme-bg)", color: "var(--color-theme-fg)" }}>

      {/* ====== PROMO BANNER WITH COUNTDOWN (Amélioration 7) ====== */}
      <div
        className="w-full py-3 px-4 text-center text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 flex-wrap"
        style={{
          background: "var(--color-theme-accent)",
          color: "var(--color-theme-bg)",
        }}
      >
        <Tag className="w-3.5 h-3.5" />
        <span>🎁 PROMO : Kit Ventre Plat Nourrice à 15 000 F au lieu de 20 000 F ! Expire dans :</span>
        <span className="font-mono bg-black/20 px-2 py-0.5 rounded text-glow">{promoCountdown}</span>
      </div>

      {/* ====== HEADER SECTION ====== */}
      <div className="border-b" style={{ borderColor: "var(--color-theme-border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
          
          {/* Dispatch Countdown Alert (Amélioration 48) */}
          <div className="p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold bg-emerald-500/5" style={{ borderColor: "rgba(16,185,129,0.2)" }}>
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500 animate-bounce" />
              <span>Commandez dans les <strong className="font-mono text-emerald-600 dark:text-emerald-400">{dispatchTime}</strong> pour une expédition aujourd'hui !</span>
            </span>
            <span className="hidden sm:inline opacity-60">Livraison Abidjan Express dispo</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <ScrollReveal animation="fade-up">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3" style={{ color: "var(--color-theme-accent)" }} />
                <span className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: "var(--color-theme-accent)" }}>
                  Boutique Officielle
                </span>
              </div>
              <h1 className="font-sans text-3xl sm:text-5xl font-black uppercase tracking-tighter" style={{ color: "var(--color-theme-fg)" }}>
                La Boutique<br />
                <span style={{ color: "var(--color-theme-accent)" }}>Caroana Minceur</span>
              </h1>
            </ScrollReveal>

            {/* Interactive Coupon Code card (Amélioration 16, 34) */}
            <div 
              onClick={handleCopyCode}
              className="p-3 border rounded-xl flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all select-none shadow-sm"
              style={{ borderColor: "var(--color-theme-border)", background: "var(--color-theme-card)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-yellow-500/10 text-yellow-600">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider block opacity-50">Coupon de bienvenue</span>
                  <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">CAROANA10</span>
                </div>
              </div>
              <button className="p-1.5 rounded-lg border hover:bg-neutral-100 transition-colors">
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 opacity-60" />}
              </button>
            </div>
          </div>

          {/* Search bar & Sorting Dropdown (Amélioration 18) */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Rechercher un produit ou un pack..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 border rounded-lg text-xs focus:outline-none transition-all"
                style={{
                  background: "var(--color-theme-card)",
                  borderColor: "var(--color-theme-border)",
                  color: "var(--color-theme-fg)",
                }}
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1 px-3 py-2 border rounded-lg text-xs bg-theme-card" style={{ borderColor: "var(--color-theme-border)" }}>
                <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="bg-transparent text-xs font-bold focus:outline-none border-none cursor-pointer outline-none"
                >
                  <option value="default" className="text-black">Recommandé</option>
                  <option value="price-asc" className="text-black">Prix : Croissant</option>
                  <option value="price-desc" className="text-black">Prix : Décroissant</option>
                </select>
              </div>
            </div>
          </div>

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

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-20">

        {/* ====== COMPONENT: PRODUCT COMPARATOR BANNER (Amélioration 15) ====== */}
        {compareList.length > 0 && (
          <div className="fixed bottom-6 left-6 z-40 bg-theme-card border shadow-2xl p-4 rounded-2xl max-w-sm flex items-center justify-between gap-4 animate-slide-in-left" style={{ borderColor: "var(--color-theme-accent)" }}>
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Comparateur</span>
              <p className="text-xs font-bold mt-0.5">{compareList.length} produit{compareList.length > 1 ? "s" : ""} sélectionné{compareList.length > 1 ? "s" : ""}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCompareList([])}
                className="p-2 border rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                style={{ borderColor: "var(--color-theme-border)" }}
              >
                <X className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsCompareOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-black text-white uppercase tracking-wider bg-theme-accent hover:scale-102 transition-transform cursor-pointer"
              >
                Comparer
              </button>
            </div>
          </div>
        )}

        {/* ====== PRODUITS INDIVIDUELS ====== */}
        {showSolo && filteredProduits.length > 0 && (
          <section className="space-y-10">
            <ScrollReveal animation="fade-up">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1" style={{ background: "var(--color-theme-border)" }} />
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" style={{ color: "var(--color-theme-accent)" }} />
                  <h2 className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--color-theme-accent)" }}>
                    Produits Individuels ({filteredProduits.length})
                  </h2>
                </div>
                <div className="h-px flex-1" style={{ background: "var(--color-theme-border)" }} />
              </div>
            </ScrollReveal>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProduits.map((p, idx) => {
                const inWishlist = wishlist.includes(p.id);
                const isComparing = compareList.some(item => item.id === p.id);
                const stockLeftPercent = Math.max(10, (p.stock / 40) * 100);

                return (
                  <ScrollReveal key={p.id} animation="fade-up" delay={idx * 50}>
                    <div className="border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-theme-card relative group" style={{ borderColor: "var(--color-theme-border)" }}>
                      
                      {/* Thumbnail frame */}
                      <div className="aspect-square w-full relative bg-stone-100/50 dark:bg-neutral-900/50 overflow-hidden">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-500" />
                        
                        {/* Wishlist toggle (Amélioration 3, 42) */}
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/80 dark:bg-black/60 shadow backdrop-blur-sm transition-transform cursor-pointer active:scale-90"
                        >
                          <Heart className={`w-4 h-4 transition-colors ${inWishlist ? "fill-red-500 stroke-red-500 text-red-500" : "text-neutral-500 dark:text-neutral-300"}`} />
                        </button>

                        {/* Comparator check (Amélioration 15, 37) */}
                        <button
                          onClick={() => toggleCompare(p)}
                          className="absolute bottom-3 left-3 px-2 py-1.5 rounded-lg flex items-center gap-1 bg-white/90 dark:bg-black/80 shadow backdrop-blur-sm text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                        >
                          <Scale className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{isComparing ? "Sélectionné" : "Comparer"}</span>
                        </button>

                        {p.badge && (
                          <div className="absolute top-3 left-3 bg-emerald-600 text-white font-black text-[9px] uppercase tracking-widest px-2 py-1 rounded">
                            {p.badge}
                          </div>
                        )}
                      </div>

                      {/* Content panel */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-serif text-base font-bold leading-snug">{p.name}</h3>
                            <span className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400">
                              {p.price.toLocaleString("fr-FR")} F
                            </span>
                          </div>
                          
                          <p className="text-[11px] opacity-75 mt-1.5 leading-relaxed h-12 overflow-hidden text-ellipsis">
                            {p.shortDescription}
                          </p>

                          {/* Urgency Stock Gauge (Amélioration 11, 16) */}
                          <div className="mt-3 pt-2">
                            <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider mb-1">
                              {p.stock <= 5 ? (
                                <span className="text-red-500 dark:text-red-400 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 animate-pulse" />
                                  Plus que {p.stock} en stock !
                                </span>
                              ) : (
                                <span className="opacity-40">Stock Disponible</span>
                              )}
                              <span className="opacity-40">{p.stock} pces</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 ${p.stock <= 5 ? "bg-red-500" : "bg-emerald-500"}`}
                                style={{ width: `${stockLeftPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Add to Cart Actions */}
                        <div className="flex items-center gap-2 border-t pt-3" style={{ borderColor: "var(--color-theme-border)" }}>
                          <Link
                            href={`/produit/${p.slug}`}
                            className="flex-1 text-center py-2 border rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
                            style={{ borderColor: "var(--color-theme-border)" }}
                          >
                            Détails
                          </Link>

                          {/* Quick Add (Amélioration 12) */}
                          <button
                            onClick={() => handleQuickAdd(p)}
                            className="px-3.5 py-2.5 rounded-xl font-bold text-xs bg-theme-accent text-theme-bg hover:scale-102 cursor-pointer transition-transform flex items-center justify-center gap-1.5"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </section>
        )}

        {/* ====== COMPONENT: PRODUCTS COMPARATOR MODAL (Amélioration 15) ====== */}
        {isCompareOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCompareOpen(false)} />
            
            <div className="bg-theme-card border rounded-3xl w-full max-w-4xl p-6 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto" style={{ borderColor: "var(--color-theme-border)" }}>
              <div className="flex justify-between items-center mb-6 pb-4 border-b" style={{ borderColor: "var(--color-theme-border)" }}>
                <h3 className="font-serif text-xl font-black uppercase tracking-wider">Comparatif de nos cures minceur</h3>
                <button 
                  onClick={() => setIsCompareOpen(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {compareList.map((prod) => (
                  <div key={prod.id} className="p-4 border rounded-2xl flex flex-col justify-between space-y-4" style={{ borderColor: "var(--color-theme-border)" }}>
                    <div className="space-y-3">
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-neutral-100">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-serif text-base font-bold">{prod.name}</h4>
                      <strong className="text-emerald-500 font-mono text-sm block">{prod.price.toLocaleString("fr-FR")} FCFA</strong>
                      
                      <div className="space-y-2 border-t pt-3 text-[11px]" style={{ borderColor: "var(--color-theme-border)" }}>
                        <div>
                          <strong className="opacity-50 uppercase tracking-wider text-[9px] block">Cible</strong>
                          <p className="font-medium mt-0.5">{prod.shortDescription}</p>
                        </div>
                        <div>
                          <strong className="opacity-50 uppercase tracking-wider text-[9px] block">Format</strong>
                          <p className="font-medium mt-0.5">{prod.productType === "capsules" ? "💊 Gélules" : "🌿 Tisane/Infusion"}</p>
                        </div>
                        <div>
                          <strong className="opacity-50 uppercase tracking-wider text-[9px] block">Disponibilité</strong>
                          <p className="font-medium mt-0.5 text-emerald-600 dark:text-emerald-400">{prod.stock} unités restantes</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleQuickAdd(prod);
                        setIsCompareOpen(false);
                      }}
                      className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-theme-accent text-theme-bg text-center cursor-pointer"
                    >
                      Ajouter au panier
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ====== CURES SYNERGIQUES (PACKS) ====== */}
        {showPacks && filteredPacks.length > 0 && (
          <section className="space-y-10">
            <ScrollReveal animation="fade-up">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1" style={{ background: "var(--color-theme-border)" }} />
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" style={{ color: "var(--color-theme-accent)" }} />
                  <h2 className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--color-theme-accent)" }}>
                    Cures Synergiques & Packs
                  </h2>
                </div>
                <div className="h-px flex-1" style={{ background: "var(--color-theme-border)" }} />
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPacks.map((pack, idx) => (
                <ScrollReveal key={pack.id} animation="fade-up" delay={idx * 100}>
                  <div
                    className="rounded-2xl border p-6 flex flex-col md:flex-row justify-between gap-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden bg-theme-card"
                    style={{ borderColor: "var(--color-theme-border)" }}
                  >
                    {/* Inner color glow */}
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[40px] opacity-10 bg-gradient-to-br ${pack.color}`} />

                    {/* Left: Pack Info */}
                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{pack.icon}</span>
                          {pack.saving > 0 && (
                            <span className="bg-red-500 text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">
                              Économie: {pack.saving.toLocaleString("fr-FR")} F
                            </span>
                          )}
                          {pack.badge && (
                            <span className="bg-emerald-600 text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">
                              {pack.badge}
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-lg font-black">{pack.name}</h3>
                        <p className="text-[11px] opacity-75 mt-1">{pack.shortDescription}</p>

                        <div className="space-y-1.5 mt-3 border-t pt-3" style={{ borderColor: "var(--color-theme-border)" }}>
                          <span className="text-[9px] font-bold opacity-45 uppercase tracking-wider block">Ce que comprend ce pack :</span>
                          <ul className="space-y-1">
                            {pack.items.map((it, k) => (
                              <li key={k} className="text-[10px] flex items-center gap-1.5">
                                <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                <span className="opacity-85">{it}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-end gap-3 pt-2">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold uppercase tracking-wider opacity-40">Prix total</span>
                          <div className="flex items-baseline gap-2">
                            <strong className="text-xl font-mono text-emerald-600 dark:text-emerald-400">
                              {pack.price.toLocaleString("fr-FR")} F
                            </strong>
                            {pack.compareAtPrice && pack.compareAtPrice > pack.price && (
                              <span className="text-xs line-through opacity-40 font-mono">
                                {pack.compareAtPrice.toLocaleString("fr-FR")} F
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="md:w-1/3 flex flex-col justify-between items-center md:items-end">
                      <div className="w-full aspect-square md:w-28 md:h-28 rounded-xl overflow-hidden bg-neutral-100">
                        <img src={pack.image} alt={pack.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex flex-row md:flex-col gap-2 w-full mt-4 md:mt-0">
                        {/* Quick Add */}
                        <button
                          onClick={() => {
                            addItem({
                              productId: pack.id,
                              variantId: null,
                              sku: "PK-NEW",
                              name: pack.name,
                              price: pack.price,
                              imageUrl: pack.image,
                              quantity: 1
                            });
                            alert(`« ${pack.name} » a été ajouté à votre panier !`);
                          }}
                          className="flex-1 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-wider text-center text-white cursor-pointer"
                          style={{ background: "var(--color-theme-accent)" }}
                        >
                          Ajouter au Panier
                        </button>
                        <a
                          href={getWhatsAppLink(pack.name, pack.price)}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 px-3 py-2 border rounded-xl text-[9px] font-bold uppercase tracking-wider text-center text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/5 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                          Commander
                        </a>
                      </div>
                    </div>

                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
