"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, User as UserIcon, Sun, Moon, Sparkles } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useTheme } from "@/components/ui/ThemeProvider";

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const getItemCount = useCart((state) => state.getItemCount);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getItemCount());
  }, [getItemCount]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  const navLinks = [
    { name: "Accueil", href: "/", emoji: "🏠" },
    { name: "Boutique", href: "/boutique", emoji: "🛍️" },
    { name: "Bilan Minceur", href: "/bilan-minceur", emoji: "📋" },
    { name: "Rituel Infusion", href: "/rituel-timer", emoji: "⏱️" },
    { name: "Suivi Commande", href: "/suivi-commande", emoji: "📦" },
    { name: "À Propos", href: "/a-propos", emoji: "🌿" },
    { name: "Contact", href: "/contact", emoji: "📞" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className="fixed top-8 left-0 right-0 z-50 transition-all duration-500"
        style={{
          top: isScrolled ? "0" : "0",
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
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group mr-8">
            {/* Logo icon */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center relative"
              style={{
                background: "linear-gradient(135deg, var(--color-theme-accent) 0%, rgba(var(--color-theme-accent-rgb), 0.6) 100%)",
                boxShadow: "0 0 15px rgba(var(--color-theme-accent-rgb), 0.4)",
              }}
            >
              <span className="text-sm">🌿</span>
              {/* Pulsing ring */}
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  border: "2px solid rgba(var(--color-theme-accent-rgb), 0.4)",
                  animation: "ping-soft 3s ease-in-out infinite",
                }}
              />
            </div>

            <div className="flex flex-col leading-none">
              <span
                className="font-serif text-lg font-bold tracking-wide transition-all duration-300"
                style={{ color: "var(--color-theme-fg)" }}
              >
                CAROANA
              </span>
              <span
                className="text-[8px] font-black tracking-[0.3em] uppercase -mt-0.5 transition-all"
                style={{ color: "var(--color-theme-accent)" }}
              >
                Minceur
              </span>
            </div>
          </Link>

          {/* === DESKTOP NAV === */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-[11px] font-bold tracking-widest uppercase rounded-lg transition-all duration-300 group"
                  style={{
                    color: active ? "var(--color-theme-accent)" : "var(--color-theme-fg)",
                    opacity: active ? 1 : 0.75,
                    background: active ? "rgba(var(--color-theme-accent-rgb), 0.08)" : "transparent",
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.opacity = "1";
                      (e.currentTarget as HTMLElement).style.color = "var(--color-theme-accent)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(var(--color-theme-accent-rgb), 0.05)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.opacity = "0.75";
                      (e.currentTarget as HTMLElement).style.color = "var(--color-theme-fg)";
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }
                  }}
                >
                  {link.name}
                  {/* Active underline */}
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

          {/* === CTA BOUTIQUE (desktop) === */}
          <Link
            href="/boutique"
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 mr-4 flex-shrink-0"
            style={{
              background: "var(--color-theme-accent)",
              color: "var(--color-theme-bg)",
              boxShadow: "0 0 15px rgba(var(--color-theme-accent-rgb), 0.3)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px) scale(1.02)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 25px rgba(var(--color-theme-accent-rgb), 0.5)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 15px rgba(var(--color-theme-accent-rgb), 0.3)";
            }}
          >
            <Sparkles className="w-3 h-3" />
            Commander
          </Link>

          {/* === RIGHT ICONS === */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">

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
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-theme-accent)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-theme-accent)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-theme-border)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-theme-fg)";
              }}
            >
              <span className="transition-transform duration-500" style={{ transform: theme === "dark" ? "rotate(0deg)" : "rotate(180deg)" }}>
                {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </span>
            </button>

            {/* Cart */}
            <Link
              href="/panier"
              aria-label="Panier"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 relative"
              style={{
                border: "1px solid var(--color-theme-border)",
                background: "var(--color-theme-card)",
                color: "var(--color-theme-fg)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-theme-accent)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-theme-accent)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-theme-border)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-theme-fg)";
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
                    animation: "ping-soft 2s ease-in-out infinite",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href="/compte"
              aria-label="Mon compte"
              className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center transition-all duration-300"
              style={{
                border: "1px solid var(--color-theme-border)",
                background: "var(--color-theme-card)",
                color: "var(--color-theme-fg)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-theme-accent)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-theme-accent)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-theme-border)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-theme-fg)";
              }}
            >
              <UserIcon className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
              aria-label="Menu"
              style={{
                border: "1px solid var(--color-theme-border)",
                background: "var(--color-theme-card)",
                color: "var(--color-theme-fg)",
              }}
            >
              <span
                className="transition-all duration-300"
                style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
              >
                {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </span>
            </button>
          </div>
        </div>

        {/* === MOBILE MENU === */}
        <div
          className="md:hidden overflow-hidden transition-all duration-400 ease-in-out"
          style={{
            maxHeight: isOpen ? "400px" : "0",
            borderTop: isOpen ? "1px solid var(--color-theme-border)" : "none",
          }}
        >
          <nav
            className="p-4 space-y-2"
            style={{ background: "rgba(var(--header-bg-rgb, 7,8,9), 0.98)" }}
          >
            {navLinks.map((link, i) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300"
                  style={{
                    background: active
                      ? "rgba(var(--color-theme-accent-rgb), 0.1)"
                      : "transparent",
                    color: active ? "var(--color-theme-accent)" : "var(--color-theme-fg)",
                    border: active
                      ? "1px solid rgba(var(--color-theme-accent-rgb), 0.2)"
                      : "1px solid transparent",
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  <span>{link.emoji}</span>
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Mobile CTA */}
            <Link
              href="/boutique"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest mt-3"
              style={{
                background: "var(--color-theme-accent)",
                color: "var(--color-theme-bg)",
              }}
            >
              <Sparkles className="w-4 h-4" />
              Commander maintenant
            </Link>

            {/* Mobile WhatsApp */}
            <a
              href="https://wa.me/2250143655088?text=Bonjour%20Caroana%20Minceur%20%F0%9F%8C%BF"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-widest"
              style={{ background: "#25D366", color: "#fff" }}
            >
              💬 WhatsApp · +225 01 43 65 50 88
            </a>
          </nav>
        </div>
      </header>

      {/* Mobile menu backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
