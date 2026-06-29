"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  Menu, 
  X, 
  User as UserIcon, 
  Sun, 
  Moon, 
  Sparkles, 
  Search, 
  Heart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  ShoppingBagIcon, 
  ChevronRight,
  Info,
  LogOut,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useTheme } from "@/components/ui/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/ui/AuthModal";
import { MOCK_PRODUCTS, MOCK_BLOG_POSTS } from "@/server/mockDb";

interface SearchableItem {
  id: string;
  name: string;
  href: string;
  type: string;
  price: number | null;
  compareAtPrice: number | null;
  image: string;
  isProduct: boolean;
  sku: string;
  slug: string;
  product?: any;
  readTime?: string;
  category?: string;
  isUtil?: boolean;
  emoji?: string;
}

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Cart store details
  const { items, updateQuantity, removeItem, getSubtotal, addItem } = useCart();
  const getItemCount = useCart((state) => state.getItemCount);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist details
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Recovery toast details
  const [showRecovery, setShowRecovery] = useState(false);

  // Auth
  const { user, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Prepare searchable items from mock data
  const searchableItems = useMemo<SearchableItem[]>(() => {
    const products = MOCK_PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      href: `/produit/${p.slug}`,
      type: p.productType === "bundle" ? "Pack Promo" : p.productType === "capsules" ? "Complément" : "Infusion",
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      image: p.images[0]?.url || "",
      isProduct: true,
      sku: p.sku,
      slug: p.slug,
      product: p
    }));

    const blogPosts = MOCK_BLOG_POSTS.map(post => ({
      id: post.id,
      name: post.title,
      href: `/blog/${post.slug}`,
      type: "Article de Blog",
      price: null,
      compareAtPrice: null,
      image: post.imageUrl || "",
      isProduct: false,
      sku: "",
      slug: post.slug,
      readTime: post.readTime,
      category: post.category
    }));

    const utils = [
      {
        id: "bilan",
        name: "Bilan Minceur & IMC",
        href: "/bilan-minceur",
        type: "Diagnostic",
        price: null,
        compareAtPrice: null,
        image: "",
        isProduct: false,
        sku: "",
        slug: "bilan-minceur",
        isUtil: true,
        emoji: "📋"
      },
      {
        id: "routine",
        name: "Routine Minceur Sur-Mesure",
        href: "/routine-perso",
        type: "Outil Minceur",
        price: null,
        compareAtPrice: null,
        image: "",
        isProduct: false,
        sku: "",
        slug: "routine-perso",
        isUtil: true,
        emoji: "✨"
      },
      {
        id: "defi",
        name: "Défi Minceur 14 Jours",
        href: "/defi-14-jours",
        type: "Motivation",
        price: null,
        compareAtPrice: null,
        image: "",
        isProduct: false,
        sku: "",
        slug: "defi-14-jours",
        isUtil: true,
        emoji: "🏆"
      },
      {
        id: "herbier",
        name: "L'Herbier Caroana (Botanique)",
        href: "/herbier",
        type: "Éducation",
        price: null,
        compareAtPrice: null,
        image: "",
        isProduct: false,
        sku: "",
        slug: "herbier",
        isUtil: true,
        emoji: "🍃"
      },
      {
        id: "resultats",
        name: "Résultats & Témoignages (Avant/Après)",
        href: "/resultats",
        type: "Preuve Sociale",
        price: null,
        compareAtPrice: null,
        image: "",
        isProduct: false,
        sku: "",
        slug: "resultats",
        isUtil: true,
        emoji: "⭐"
      },
      {
        id: "engagement",
        name: "Charte d'Engagement & Sourcing",
        href: "/engagement",
        type: "Notre Vision",
        price: null,
        compareAtPrice: null,
        image: "",
        isProduct: false,
        sku: "",
        slug: "engagement",
        isUtil: true,
        emoji: "🌍"
      },
      {
        id: "suivi",
        name: "Suivi de Cure",
        href: "/suivi-cure",
        type: "Calendrier",
        price: null,
        compareAtPrice: null,
        image: "",
        isProduct: false,
        sku: "",
        slug: "suivi-cure",
        isUtil: true,
        emoji: "📅"
      },
      {
        id: "timer",
        name: "Rituel Infusion & Minuteur",
        href: "/rituel-timer",
        type: "Outil Minceur",
        price: null,
        compareAtPrice: null,
        image: "",
        isProduct: false,
        sku: "",
        slug: "rituel-timer",
        isUtil: true,
        emoji: "⏱️"
      }
    ];

    return [...products, ...blogPosts, ...utils];
  }, []);

  const handleAddProductToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: item.id,
      variantId: null,
      sku: item.sku,
      name: item.name,
      price: item.price,
      imageUrl: item.image
    });
    // Open cart drawer and close search overlay
    setIsSearchOpen(false);
    setIsCartOpen(true);
  };

  useEffect(() => {
    setCartCount(getItemCount());
  }, [getItemCount, items]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { 
    setIsOpen(false); 
    setIsCartOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Wishlist Listener
  useEffect(() => {
    const handleWishlistUpdate = () => {
      const saved = localStorage.getItem("caroana-wishlist");
      if (saved) {
        try { setWishlist(JSON.parse(saved)); } catch (e) {}
      } else {
        setWishlist([]);
      }
    };
    window.addEventListener("caroana-wishlist-update", handleWishlistUpdate);
    handleWishlistUpdate();
    return () => window.removeEventListener("caroana-wishlist-update", handleWishlistUpdate);
  }, []);

  // Recovery Alert
  useEffect(() => {
    const dismissed = sessionStorage.getItem("caroana-recovery-dismissed");
    if (items.length > 0 && !dismissed && pathname !== "/panier" && pathname !== "/paiement") {
      const timer = setTimeout(() => setShowRecovery(true), 3500);
      return () => clearTimeout(timer);
    }
  }, [items, pathname]);

  const handleDismissRecovery = () => {
    setShowRecovery(false);
    sessionStorage.setItem("caroana-recovery-dismissed", "true");
  };

  const navLinks = [
    { name: "Accueil", href: "/", emoji: "🏠" },
    { name: "Boutique", href: "/boutique", emoji: "🛍️" },
    { name: "Routine", href: "/routine-perso", emoji: "✨" },
    { name: "Défi 14J", href: "/defi-14-jours", emoji: "🏆" },
    { name: "Herbier", href: "/herbier", emoji: "🍃" },
    { name: "Résultats", href: "/resultats", emoji: "⭐" },
    { name: "Engagements", href: "/engagement", emoji: "🌍" },
    { name: "Bilan Minceur", href: "/bilan-minceur", emoji: "📋" },
    { name: "Blog", href: "/blog", emoji: "📝" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Filter search matches
  const searchResults = searchQuery.trim()
    ? searchableItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const subtotal = getSubtotal();
  const freeShippingThreshold = 30000;
  const missingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <>
      {/* === HEADER MAIN === */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: isScrolled
            ? "rgba(var(--header-bg-rgb, 7,8,9), 0.97)"
            : "rgba(var(--header-bg-rgb, 7,8,9), 0.85)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: isScrolled
            ? "1px solid rgba(var(--color-theme-accent-rgb), 0.15)"
            : "1px solid var(--color-theme-border)",
          boxShadow: isScrolled
            ? "0 4px 30px rgba(0,0,0,0.3), 0 1px 0 rgba(var(--color-theme-accent-rgb), 0.1)"
            : "none",
        }}
      >
        <div className="max-w-[1600px] mx-auto flex items-center h-16 px-4 sm:px-6">

          {/* === LOGO === */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group mr-6">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center relative"
              style={{
                background: "linear-gradient(135deg, var(--color-theme-accent) 0%, rgba(var(--color-theme-accent-rgb), 0.6) 100%)",
                boxShadow: "0 0 15px rgba(var(--color-theme-accent-rgb), 0.4)",
              }}
            >
              <span className="text-sm">🌿</span>
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  border: "2px solid rgba(var(--color-theme-accent-rgb), 0.4)",
                  animation: "ping-soft 3s ease-in-out infinite",
                }}
              />
            </div>

            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg font-bold tracking-wide transition-all duration-300" style={{ color: "var(--color-theme-fg)" }}>
                CAROANA
              </span>
              <span className="text-[8px] font-black tracking-[0.3em] uppercase -mt-0.5" style={{ color: "var(--color-theme-accent)" }}>
                Minceur
              </span>
            </div>
          </Link>

          {/* === DESKTOP NAV === */}
          <nav className="hidden xl:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3.5 py-2 text-[10px] font-bold tracking-widest uppercase rounded-lg transition-all duration-300"
                  style={{
                    color: active ? "var(--color-theme-accent)" : "var(--color-theme-fg)",
                    opacity: active ? 1 : 0.75,
                    background: active ? "rgba(var(--color-theme-accent-rgb), 0.08)" : "transparent",
                  }}
                >
                  {link.name}
                  {active && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
                      style={{
                        width: "60%",
                        background: "var(--color-theme-accent)",
                        boxShadow: "0 0 6px rgba(var(--color-theme-accent-rgb), 0.8)",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* === RIGHT CONTROLS === */}
          <div className="flex items-center gap-1.5 ml-auto">

            {/* Instant Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Recherche"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 relative cursor-pointer"
              style={{
                border: "1px solid var(--color-theme-border)",
                background: "var(--color-theme-card)",
                color: "var(--color-theme-fg)",
              }}
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Changer de thème"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer relative overflow-hidden"
              style={{
                border: "1px solid var(--color-theme-border)",
                background: "var(--color-theme-card)",
                color: "var(--color-theme-fg)",
              }}
            >
              <span className="transition-transform duration-500" style={{ transform: theme === "dark" ? "rotate(0deg)" : "rotate(180deg)" }}>
                {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </span>
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/boutique"
              aria-label="Mes Favoris"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 relative"
              style={{
                border: "1px solid var(--color-theme-border)",
                background: "var(--color-theme-card)",
                color: "var(--color-theme-fg)",
              }}
            >
              <Heart className={`w-3.5 h-3.5 ${wishlist.length > 0 ? "fill-red-500 stroke-red-500 text-red-500" : ""}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full font-black text-[9px] flex items-center justify-center bg-red-500 text-white shadow">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon (Triggers Drawer instead of going to cart page directly!) */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Panier"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 relative cursor-pointer"
              style={{
                border: "1px solid var(--color-theme-border)",
                background: "var(--color-theme-card)",
                color: "var(--color-theme-fg)",
              }}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full font-black text-[9px] flex items-center justify-center"
                  style={{
                    background: "var(--color-theme-accent)",
                    color: "var(--color-theme-bg)",
                    boxShadow: "0 0 8px rgba(var(--color-theme-accent-rgb), 0.6)",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account */}
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowUserMenu((v) => !v)}
                  aria-label="Mon compte"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden cursor-pointer"
                  style={{
                    border: "1px solid var(--color-theme-border)",
                    background: "var(--color-theme-accent)",
                    color: "var(--color-theme-bg)",
                  }}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName ?? ""} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[11px] font-black">
                      {(user.displayName ?? user.email ?? "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </button>
                {showUserMenu && (
                  <div
                    className="absolute right-0 top-12 w-48 rounded-xl shadow-2xl overflow-hidden z-50"
                    style={{ background: "var(--color-theme-card)", border: "1px solid var(--color-theme-border)" }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: "var(--color-theme-border)" }}>
                      <p className="text-[11px] font-bold" style={{ color: "var(--color-theme-fg)" }}>
                        {user.displayName ?? "Mon compte"}
                      </p>
                      <p className="text-[10px] opacity-50" style={{ color: "var(--color-theme-fg)" }}>
                        {user.email ?? user.phoneNumber}
                      </p>
                    </div>
                    <Link
                      href="/compte"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-semibold transition-colors hover:bg-forest/10"
                      style={{ color: "var(--color-theme-fg)" }}
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      Mon espace
                    </Link>
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-[11px] font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                aria-label="Se connecter"
                id="header-auth-btn"
                className="hidden md:flex w-9 h-9 rounded-full items-center justify-center transition-all duration-300 cursor-pointer"
                style={{
                  border: "1px solid var(--color-theme-border)",
                  background: "var(--color-theme-card)",
                  color: "var(--color-theme-fg)",
                }}
              >
                <UserIcon className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
              aria-label="Menu"
              style={{
                border: "1px solid var(--color-theme-border)",
                background: "var(--color-theme-card)",
                color: "var(--color-theme-fg)",
              }}
            >
              <span className="transition-all duration-300" style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>
                {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </span>
            </button>
          </div>
        </div>

        {/* ====== BREADCRUMBS ROW (SEO & Comfort) ====== */}
        {pathname !== "/" && (
          <div className="border-t border-b bg-stone-50/50 dark:bg-neutral-900/30" style={{ borderColor: "var(--color-theme-border)" }}>
            <div className="max-w-[1600px] mx-auto px-6 py-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest opacity-60">
              <Link href="/" className="hover:text-emerald-500 transition-colors">Accueil</Link>
              {pathname.split("/").filter(Boolean).map((part, idx, arr) => {
                const href = "/" + arr.slice(0, idx + 1).join("/");
                const isLast = idx === arr.length - 1;
                const label = decodeURIComponent(part.replace("-", " "));
                return (
                  <span key={href} className="flex items-center gap-1.5">
                    <ChevronRight className="w-2.5 h-2.5 opacity-50" />
                    {isLast ? (
                      <span style={{ color: "var(--color-theme-accent)" }}>{label}</span>
                    ) : (
                      <Link href={href} className="hover:text-emerald-500 transition-colors">{label}</Link>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* ====== MOBILE NAV DRAWER ====== */}
        {isOpen && (
          <div className="xl:hidden border-t" style={{ background: "rgba(var(--header-bg-rgb, 7,8,9), 0.99)", borderColor: "var(--color-theme-border)" }}>
            <nav className="p-4 space-y-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                    style={{
                      background: active ? "rgba(var(--color-theme-accent-rgb), 0.08)" : "transparent",
                      color: active ? "var(--color-theme-accent)" : "var(--color-theme-fg)",
                      border: active ? "1px solid rgba(var(--color-theme-accent-rgb), 0.15)" : "1px solid transparent",
                    }}
                  >
                    <span>{link.emoji}</span>
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              {/* Quick Checkout & Contact */}
              <div className="grid grid-cols-2 gap-2 pt-3">
                <Link
                  href="/boutique"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-wider text-white"
                  style={{ background: "var(--color-theme-accent)" }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Boutique
                </Link>
                <a
                  href="https://wa.me/2250143655088"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider text-white bg-green-500"
                >
                  💬 WhatsApp
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* === SLIDE-OVER CART DRAWER (Amélioration 1) === */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer container */}
          <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
            <div 
              className="w-screen max-w-md border-l flex flex-col h-full shadow-2xl relative transition-transform duration-300"
              style={{ background: "var(--color-theme-card)", borderColor: "var(--color-theme-border)" }}
            >
              {/* Header */}
              <div className="px-5 py-4 border-b flex justify-between items-center" style={{ borderColor: "var(--color-theme-border)" }}>
                <h3 className="font-serif text-lg font-bold flex items-center gap-2">
                  <ShoppingBagIcon className="w-5 h-5 text-emerald-500" />
                  Votre Panier ({cartCount})
                </h3>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Free Shipping Progress Indicator (Amélioration 31) */}
              <div className="px-5 py-3 border-b bg-stone-50/50 dark:bg-neutral-900/20" style={{ borderColor: "var(--color-theme-border)" }}>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  {missingForFreeShipping > 0 ? (
                    <>
                      <span>Plus que <strong className="text-emerald-500">{missingForFreeShipping.toLocaleString("fr-FR")} F</strong> pour la livraison gratuite</span>
                      <span className="opacity-60">{Math.round(freeShippingProgress)}%</span>
                    </>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      🎉 Félicitations ! Votre livraison standard est offerte !
                    </span>
                  )}
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <span className="text-5xl">🛒</span>
                    <h4 className="font-serif text-base font-bold">Votre panier est vide</h4>
                    <p className="text-xs opacity-60 max-w-xs mx-auto">
                      Découvrez nos cures minceur naturelles formulées à base de plantes africaines pour affiner votre sangle abdominale.
                    </p>
                    <Link 
                      href="/boutique" 
                      onClick={() => setIsCartOpen(false)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white"
                      style={{ background: "var(--color-theme-accent)" }}
                    >
                      Aller à la boutique
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div 
                      key={`${item.productId}-${item.variantId}`}
                      className="flex gap-3 pb-4 border-b"
                      style={{ borderColor: "var(--color-theme-border)" }}
                    >
                      {/* Product Thumbnail */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Product Data */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold truncate leading-snug">{item.name}</h4>
                          <span className="text-[10px] opacity-60 font-mono tracking-wider">{item.sku}</span>
                        </div>
                        
                        {/* Adjusters */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 border rounded-lg px-2 py-1" style={{ borderColor: "var(--color-theme-border)" }}>
                            <button 
                              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                              className="text-theme-fg/60 hover:text-emerald-500 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                              className="text-theme-fg/60 hover:text-emerald-500 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <strong className="text-xs font-mono">{(item.price * item.quantity).toLocaleString("fr-FR")} F</strong>
                            <button 
                              onClick={() => removeItem(item.productId, item.variantId)}
                              className="text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                              aria-label="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Section */}
              {items.length > 0 && (
                <div className="p-5 border-t space-y-4" style={{ borderColor: "var(--color-theme-border)", background: "rgba(var(--header-bg-rgb, 7,8,9), 0.02)" }}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-60">Sous-total :</span>
                    <strong className="text-lg font-serif text-emerald-600 dark:text-emerald-400">
                      {subtotal.toLocaleString("fr-FR")} FCFA
                    </strong>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      href="/panier"
                      onClick={() => setIsCartOpen(false)}
                      className="py-3 px-4 rounded-xl border text-center font-bold text-[10px] uppercase tracking-widest transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
                      style={{ borderColor: "var(--color-theme-border)" }}
                    >
                      Modifier Panier
                    </Link>
                    <Link
                      href="/paiement"
                      onClick={() => setIsCartOpen(false)}
                      className="py-3 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest text-center text-white flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
                      style={{ background: "var(--color-theme-accent)", boxShadow: "0 4px 15px rgba(var(--color-theme-accent-rgb), 0.3)" }}
                    >
                      Paiement
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* === INSTANT SEARCH OVERLAY (Amélioration 2) === */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto" style={{ background: "rgba(var(--header-bg-rgb, 7,8,9), 0.98)", backdropFilter: "blur(20px)" }}>
          {/* Header row */}
          <div className="max-w-6xl mx-auto w-full px-6 py-8 flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="font-serif text-2xl font-bold tracking-wide" style={{ color: "var(--color-theme-fg)" }}>Recherche Prédictive</h3>
              <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold">Caroana Minceur & Phytothérapie</span>
            </div>
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="w-10 h-10 rounded-full flex items-center justify-center border hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              style={{ borderColor: "var(--color-theme-border)", color: "var(--color-theme-fg)" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="max-w-4xl mx-auto w-full px-6 pt-6 pb-12 flex-1 flex flex-col">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
              <input
                type="text"
                autoFocus
                placeholder="Ex: Ventre plat, Kinkéliba, Kaylie, allaitement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border rounded-2xl text-base focus:outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
                style={{
                  background: "var(--color-theme-card)",
                  borderColor: "var(--color-theme-accent)",
                  color: "var(--color-theme-fg)",
                }}
              />
            </div>

            {/* Search Suggestions & Results */}
            <div className="mt-8 flex-1">
              {searchQuery.trim() === "" ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-40">Recherches populaires</span>
                    <div className="flex flex-wrap gap-2">
                      {["Ventre Plat", "Kinkéliba", "Kaylie", "Nourrice", "Allaitement", "Pack", "Détox"].map(kw => (
                        <button
                          key={kw}
                          onClick={() => setSearchQuery(kw)}
                          className="px-3.5 py-1.5 border rounded-lg text-xs font-semibold hover:border-emerald-500 hover:text-emerald-500 cursor-pointer transition-colors"
                          style={{ borderColor: "var(--color-theme-border)", color: "var(--color-theme-fg)" }}
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div className="p-5 rounded-2xl border bg-stone-50/10 dark:bg-neutral-900/10 flex items-start gap-3" style={{ borderColor: "var(--color-theme-border)" }}>
                      <span className="text-2xl">🌱</span>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold">100% Naturel</h4>
                        <p className="text-[10px] opacity-60">Plantes sauvages d'Afrique de l'Ouest sélectionnées avec soin.</p>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl border bg-stone-50/10 dark:bg-neutral-900/10 flex items-start gap-3" style={{ borderColor: "var(--color-theme-border)" }}>
                      <span className="text-2xl">🍼</span>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold">Spécial Nourrices</h4>
                        <p className="text-[10px] opacity-60">Cures douces sans stimulants, idéales pour l'allaitement.</p>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl border bg-stone-50/10 dark:bg-neutral-900/10 flex items-start gap-3" style={{ borderColor: "var(--color-theme-border)" }}>
                      <span className="text-2xl">📋</span>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold">Bilan Gratuit</h4>
                        <p className="text-[10px] opacity-60">Calculez votre IMC et recevez des conseils minceur personnalisés.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-20 text-sm opacity-60 flex flex-col items-center gap-2">
                  <span className="text-3xl">🔍</span>
                  <span>Aucun résultat trouvé pour « {searchQuery} »</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Column 1: Products */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-2 mb-2" style={{ borderColor: "var(--color-theme-border)" }}>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Cures & Produits Minceur</span>
                      <span className="text-[10px] font-mono opacity-50">{searchResults.filter(r => r.isProduct).length} trouvés</span>
                    </div>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                      {searchResults.filter(r => r.isProduct).length === 0 ? (
                        <p className="text-xs opacity-50 py-4">Aucune cure ne correspond à votre recherche.</p>
                      ) : (
                        searchResults.filter(r => r.isProduct).map((res) => (
                          <div
                            key={res.id}
                            className="p-3 rounded-xl border flex gap-3 items-center transition-all hover:bg-forest/5"
                            style={{ borderColor: "var(--color-theme-border)", background: "var(--color-theme-card)" }}
                          >
                            <Link href={res.href} onClick={() => setIsSearchOpen(false)} className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 relative">
                              <img src={res.image} alt={res.name} className="w-full h-full object-cover" />
                            </Link>

                            <div className="flex-1 min-w-0">
                              <Link href={res.href} onClick={() => setIsSearchOpen(false)} className="block group">
                                <h4 className="text-xs font-bold truncate group-hover:text-emerald-500 transition-colors">{res.name}</h4>
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-neutral-100 dark:bg-neutral-800 opacity-80" style={{ color: "var(--color-theme-accent)" }}>
                                  {res.type}
                                </span>
                                <span className="text-xs font-mono font-bold">
                                  {res.price?.toLocaleString("fr-FR")} FCFA
                                </span>
                                {res.compareAtPrice && (
                                  <span className="text-[10px] line-through opacity-40 font-mono">
                                    {res.compareAtPrice.toLocaleString("fr-FR")} FCFA
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={(e) => handleAddProductToCart(e, res)}
                              className="px-3 py-2 rounded-lg font-bold text-[9px] uppercase tracking-wider text-white transition-all hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
                              style={{ background: "var(--color-theme-accent)" }}
                            >
                              Ajouter
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Column 2: Blog & Diagnostic */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-2 mb-2" style={{ borderColor: "var(--color-theme-border)" }}>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Blog, Conseils & Diagnostics</span>
                      <span className="text-[10px] font-mono opacity-50">{searchResults.filter(r => !r.isProduct).length} trouvés</span>
                    </div>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                      {searchResults.filter(r => !r.isProduct).length === 0 ? (
                        <p className="text-xs opacity-50 py-4">Aucun article ou outil ne correspond.</p>
                      ) : (
                        searchResults.filter(r => !r.isProduct).map((res) => (
                          <Link
                            key={res.id}
                            href={res.href}
                            onClick={() => setIsSearchOpen(false)}
                            className="p-3 rounded-xl border flex gap-3 items-center transition-all hover:bg-forest/5"
                            style={{ borderColor: "var(--color-theme-border)", background: "var(--color-theme-card)" }}
                          >
                            {res.isUtil ? (
                              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/20 text-2xl flex-shrink-0">
                                {res.emoji}
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100">
                                <img src={res.image} alt={res.name} className="w-full h-full object-cover" />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold truncate">{res.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-neutral-100 dark:bg-neutral-800 opacity-80">
                                  {res.type}
                                </span>
                                {res.readTime && (
                                  <span className="text-[9px] opacity-50">
                                    ⏱️ {res.readTime}
                                  </span>
                                )}
                              </div>
                            </div>

                            <ChevronRight className="w-4 h-4 opacity-50 flex-shrink-0" />
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* === ABANDONED CART RECOVERY TOAST (Amélioration 8) === */}
      {showRecovery && (
        <div 
          className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border shadow-xl p-4 transition-all duration-500 animate-slide-in-right"
          style={{ 
            background: "var(--color-theme-card)", 
            borderColor: "var(--color-theme-accent)",
          }}
        >
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-emerald-500/10 text-emerald-600">
              <Info className="w-4 h-4" />
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="text-xs font-bold leading-snug">Votre panier vous attend !</h4>
              <p className="text-[10px] opacity-75 leading-relaxed">
                Vous avez laissé des articles dans votre panier lors de votre dernière visite. Reprenez votre cure pour atteindre vos objectifs silhouette.
              </p>
              <div className="flex gap-2 justify-end pt-1">
                <button 
                  onClick={handleDismissRecovery}
                  className="px-2.5 py-1.5 rounded-lg border text-[9px] font-bold uppercase tracking-wider hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer"
                  style={{ borderColor: "var(--color-theme-border)" }}
                >
                  Ignorer
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(true);
                    handleDismissRecovery();
                  }}
                  className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider text-white flex items-center gap-1 cursor-pointer"
                  style={{ background: "var(--color-theme-accent)" }}
                >
                  Reprendre
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === AUTH MODAL === */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Click-outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
}
