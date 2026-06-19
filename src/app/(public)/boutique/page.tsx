"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ShoppingCart, MessageCircle, Heart, Sparkles, Sliders } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function BoutiquePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");

  const addItem = useCart((state) => state.addItem);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products?status=published");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        } else {
          // Fallback initial products if database is empty/not seeded yet
          setProducts([
            {
              id: "p1",
              slug: "gelules-ventre-plat",
              sku: "GVP-01",
              name: "Gélules Ventre Plat",
              shortDescription: "Confort digestif et légèreté au naturel.",
              description: "Gélules naturelles...",
              productType: "capsules",
              status: "published",
              price: null, // Draft price initially
              compareAtPrice: null,
              costPrice: null,
              currency: "XOF",
              taxable: false,
              stock: 100,
              trackInventory: true,
              lowStockThreshold: 10,
              allowBackorder: false,
              images: [{ url: "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop", alt: "Gélules", order: 1 }],
              benefits: [], ingredients: [], usageInstructions: [], precautions: [], warnings: [],
              seo: { title: "", description: "", keywords: [], canonicalUrl: null },
              dimensions: { length: null, width: null, height: null },
              nutritionalInformation: null, weight: null, tags: [], categoryId: "", collectionIds: [],
              featured: true, publishedAt: null, createdAt: new Date() as any, updatedAt: new Date() as any,
              createdBy: "admin", updatedBy: "admin", variants: []
            },
            {
              id: "p2",
              slug: "the-detox",
              sku: "TD-01",
              name: "Thé Détox",
              shortDescription: "Aide à soutenir l'élimination naturelle.",
              description: "Thé détox...",
              productType: "tea",
              status: "published",
              price: null,
              compareAtPrice: null,
              costPrice: null,
              currency: "XOF",
              taxable: false,
              stock: 50,
              trackInventory: true,
              lowStockThreshold: 5,
              allowBackorder: false,
              images: [{ url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop", alt: "Thé Détox", order: 1 }],
              benefits: [], ingredients: [], usageInstructions: [], precautions: [], warnings: [],
              seo: { title: "", description: "", keywords: [], canonicalUrl: null },
              dimensions: { length: null, width: null, height: null },
              nutritionalInformation: null, weight: null, tags: [], categoryId: "", collectionIds: [],
              featured: true, publishedAt: null, createdAt: new Date() as any, updatedAt: new Date() as any,
              createdBy: "admin", updatedBy: "admin", variants: []
            },
            {
              id: "p3",
              slug: "tisane-ventre-plat",
              sku: "TVP-01",
              name: "Tisane Ventre Plat",
              shortDescription: "Formule traditionnelle de plantes et racines.",
              description: "Tisane naturelle...",
              productType: "herbal_tea",
              status: "published",
              price: null,
              compareAtPrice: null,
              costPrice: null,
              currency: "XOF",
              taxable: false,
              stock: 80,
              trackInventory: true,
              lowStockThreshold: 10,
              allowBackorder: false,
              images: [{ url: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop", alt: "Tisane", order: 1 }],
              benefits: [], ingredients: [], usageInstructions: [], precautions: [], warnings: [],
              seo: { title: "", description: "", keywords: [], canonicalUrl: null },
              dimensions: { length: null, width: null, height: null },
              nutritionalInformation: null, weight: null, tags: [], categoryId: "", collectionIds: [],
              featured: true, publishedAt: null, createdAt: new Date() as any, updatedAt: new Date() as any,
              createdBy: "admin", updatedBy: "admin", variants: []
            }
          ]);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Filter & Search Logic
  const filteredProducts = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.shortDescription.toLowerCase().includes(search.toLowerCase());
      const matchType = selectedType === "all" || p.productType === selectedType;
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
      if (sortBy === "alpha") return a.name.localeCompare(b.name);
      return 0; // default recent
    });

  const getWhatsAppLink = (productName: string) => {
    const message = encodeURIComponent(
      `Bonjour CAROANA MINCEUR, je souhaite commander le produit « ${productName} ».`
    );
    return `https://wa.me/2250143655088?text=${message}`;
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return "Tarif à configurer";
    return `${price.toLocaleString("fr-FR")} FCFA`;
  };

  return (
    <div className="pt-16 min-h-screen bg-theme-bg text-theme-fg transition-colors duration-500">
      
      {/* 12-COLUMN MAIN BLUEPRINT GRID */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 grid-blueprint border-b border-theme-border">
        
        {/* ================== LEFT FILTER PANEL (Col 3) ================== */}
        <aside className="col-span-12 md:col-span-3 grid-cell p-8 space-y-8 flex flex-col justify-start md:min-h-screen">
          <div className="flex justify-between items-center border-b border-theme-border pb-4">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-theme-accent" />
              <span className="text-[10px] font-bold tracking-widest uppercase">Paramètres filtres</span>
            </div>
            <span className="text-[8px] font-mono text-theme-fg/30">Index v1.2</span>
          </div>

          {/* Search Module */}
          <div className="space-y-3">
            <label className="text-[8px] font-bold tracking-widest uppercase text-theme-fg/50">Rechercher</label>
            <div className="relative">
              <Search className="w-4 h-4 text-theme-fg/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ex: Gélules, Moringa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-theme-fg/5 pl-10 pr-4 py-3 border border-theme-border text-xs text-theme-fg placeholder:text-theme-fg/30 focus:outline-none focus:border-theme-accent transition-smooth"
              />
            </div>
          </div>

          {/* Categories Tab Selector */}
          <div className="space-y-3">
            <label className="text-[8px] font-bold tracking-widest uppercase text-theme-fg/50 block">Catégorie cible</label>
            <div className="flex flex-col space-y-2">
              {[
                { label: "Tous les rituels", val: "all" },
                { label: "Gélules concentrées", val: "capsules" },
                { label: "Thés détox premium", val: "tea" },
                { label: "Tisanes ancestrales", val: "herbal_tea" },
              ].map((tab) => (
                <button
                  key={tab.val}
                  onClick={() => setSelectedType(tab.val)}
                  className={`w-full text-left text-[10px] font-bold uppercase tracking-widest p-3 transition-smooth border border-theme-border/50 hover:bg-theme-fg/5 cursor-pointer ${
                    selectedType === tab.val
                      ? "text-theme-accent bg-theme-fg/5 border-theme-accent/20"
                      : "text-theme-fg/70"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort selection */}
          <div className="space-y-3">
            <label className="text-[8px] font-bold tracking-widest uppercase text-theme-fg/50 block">Trier les fiches</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-theme-fg/5 border border-theme-border text-theme-fg text-xs p-3 focus:outline-none"
              >
                <option value="recent" className="bg-theme-bg">Le plus récent</option>
                <option value="price-asc" className="bg-theme-bg">Prix croissant</option>
                <option value="price-desc" className="bg-theme-bg">Prix décroissant</option>
                <option value="alpha" className="bg-theme-bg">Ordre alphabétique</option>
              </select>
            </div>
          </div>
        </aside>

        {/* ================== RIGHT CATALOG DISPLAY (Col 9) ================== */}
        <main className="col-span-12 md:col-span-9 flex flex-col items-stretch">
          
          {/* Page Banner Title */}
          <div className="grid-cell p-8 sm:p-12 border-l-0 border-t-0 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-theme-border">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-[9px] font-bold text-theme-accent uppercase bg-theme-accent/5 border border-theme-accent/10 px-2 py-0.5 rounded-full mb-3">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Boutique Officielle</span>
              </div>
              <h1 className="font-sans text-4xl sm:text-5xl font-black uppercase text-theme-fg tracking-tighter">La Boutique Caroana</h1>
              <p className="text-xs text-theme-fg/60 mt-1 max-w-xl leading-relaxed">
                Explorez notre sélection de préparations de phytothérapie traditionnelle. Toutes nos recettes sont élaborées avec le plus grand soin.
              </p>
            </div>
            
            <div className="text-right">
              <span className="text-[8px] font-bold uppercase tracking-widest text-theme-fg/30 block">Résultats</span>
              <span className="text-xl font-black text-theme-accent-hover">{filteredProducts.length} Produits</span>
            </div>
          </div>

          {/* Loading / Grid Display */}
          {loading ? (
            <div className="flex-grow flex items-center justify-center py-40">
              <div className="w-10 h-10 border-4 border-theme-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="flex-grow text-center py-40 p-8">
              <SlidersHorizontal className="w-12 h-12 text-theme-fg/20 mx-auto mb-4" />
              <h3 className="font-serif text-lg font-bold text-theme-fg uppercase">Aucun produit trouvé</h3>
              <p className="text-xs text-theme-fg/50 mt-1 max-w-xs mx-auto leading-relaxed">
                Ajustez vos critères de recherche ou sélectionnez une autre catégorie pour explorer notre catalogue.
              </p>
            </div>
          ) : (
            /* Products grid with Lando-style Tile layouts */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-blueprint border-t-0 border-l-0 border-r-0 border-b-0">
              {filteredProducts.map((p, idx) => {
                const hasPrice = p.price !== null && p.price > 0;
                return (
                  <div
                    key={p.id}
                    className="grid-cell p-0 flex flex-col justify-between min-h-[52vh] hover-gold-sheen group transition-all duration-500 hover:bg-theme-fg/[0.01]"
                  >
                    <ScrollReveal
                      animation="fade-up"
                      delay={(idx % 3) * 120}
                      className="p-8 h-full w-full flex flex-col justify-between flex-grow"
                    >
                      {/* Card Photo Frame */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-theme-bg border border-theme-border rounded-lg mb-6 shadow-2xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.images[0]?.url || ""}
                          alt={p.name}
                          className="object-cover w-full h-full group-hover:scale-[1.03] transition-smooth opacity-90 group-hover:opacity-100"
                        />
                        <button className="absolute top-3 right-3 p-2 rounded bg-theme-bg/80 hover:bg-theme-bg text-theme-fg/60 hover:text-theme-accent border border-theme-border transition-smooth cursor-pointer">
                          <Heart className="w-3.5 h-3.5" />
                        </button>
                        {p.stock <= 0 && (
                          <span className="absolute top-3 left-3 text-[8px] font-bold uppercase tracking-widest bg-danger text-white px-2.5 py-0.5 rounded">
                            Rupture
                          </span>
                        )}
                      </div>

                      {/* Meta Title */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-base sm:text-lg font-bold text-theme-fg group-hover:text-theme-accent transition-smooth">
                            <Link href={`/produit/${p.slug}`}>
                              {p.name}
                            </Link>
                          </h3>
                          <span className="text-xs font-bold text-theme-accent-hover whitespace-nowrap">{formatPrice(p.price)}</span>
                        </div>
                        <p className="text-[11px] text-theme-fg/60 leading-normal line-clamp-2">
                          {p.shortDescription}
                        </p>
                      </div>

                      {/* Actions Panel */}
                      <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-theme-border/50">
                        {hasPrice && p.stock > 0 ? (
                          <button
                            onClick={() =>
                              addItem({
                                productId: p.id,
                                variantId: null,
                                sku: p.sku,
                                name: p.name,
                                price: p.price!,
                                imageUrl: p.images[0]?.url || "",
                              })
                            }
                            className="flex items-center justify-center space-x-1 py-2.5 border border-theme-border hover:border-theme-accent hover:bg-theme-fg/5 text-theme-fg text-[10px] font-bold uppercase tracking-widest transition-smooth cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Panier</span>
                          </button>
                        ) : (
                          <button
                            disabled
                            className="flex items-center justify-center space-x-1 py-2.5 border border-theme-border/50 bg-theme-fg/5 text-theme-fg/20 text-[10px] font-semibold uppercase tracking-widest cursor-not-allowed"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Panier</span>
                          </button>
                        )}

                        <a
                          href={getWhatsAppLink(p.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-1 py-2.5 bg-[#25D366] hover:bg-[#20ba56] text-white text-[10px] font-bold uppercase tracking-widest transition-smooth shadow-md cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </ScrollReveal>
                  </div>
                );
              })}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
