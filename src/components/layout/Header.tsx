"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, User as UserIcon, Sun, Moon } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import InteractiveText from "@/components/ui/InteractiveText";
import { useTheme } from "@/components/ui/ThemeProvider";

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const getItemCount = useCart((state) => state.getItemCount);
  const [cartCount, setCartCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Avoid hydration mismatch for dynamic client state
  useEffect(() => {
    setCartCount(getItemCount());
  }, [getItemCount]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Boutique", href: "/boutique" },
    { name: "À propos", href: "/a-propos" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-theme-bg/95 backdrop-blur-md border-b border-theme-border transition-colors duration-500">
      {/* Scroll Progress Bar */}
      <div 
        className="absolute bottom-0 left-0 h-[2px] bg-theme-accent transition-all duration-75 ease-out z-50 pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
      />
      <div className="w-full grid grid-cols-12 items-stretch h-16">
        
        {/* Cell 1: Logo */}
        <div className="col-span-6 md:col-span-3 border-r border-theme-border flex items-center px-6">
          <Link href="/" className="flex flex-col select-none group">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-theme-fg group-hover:text-theme-accent transition-smooth">
              CAROANA
            </span>
            <span className="text-[8px] tracking-[0.25em] font-bold text-theme-accent uppercase -mt-1">
              Minceur
            </span>
          </Link>
        </div>

        {/* Cell 2: Desktop Navigation Links */}
        <div className="hidden md:flex col-span-6 items-stretch border-r border-theme-border">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex-1 flex items-center justify-center text-[10px] font-bold tracking-widest uppercase border-r border-theme-border last:border-r-0 transition-smooth hover:bg-theme-fg/5 ${
                isActive(link.href) ? "text-theme-accent bg-theme-fg/[0.02]" : "text-theme-fg/85 hover:text-theme-accent"
              }`}
            >
              <InteractiveText text={link.name} />
            </Link>
          ))}
        </div>

        {/* Cell 3: Right Action Icons */}
        <div className="col-span-6 md:col-span-3 flex items-stretch justify-end">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center border-l border-theme-border text-theme-fg/80 hover:text-theme-accent transition-smooth hover:bg-theme-fg/5 cursor-pointer"
            aria-label="Changer de thème"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 animate-spin-slow" style={{ animationDuration: "10s" }} />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* User Profile */}
          <Link
            href="/compte"
            className="flex-1 flex items-center justify-center border-l border-theme-border text-theme-fg/80 hover:text-theme-accent transition-smooth hover:bg-theme-fg/5"
            aria-label="Mon compte"
          >
            <UserIcon className="w-4 h-4" />
          </Link>

          {/* Cart */}
          <Link
            href="/panier"
            className="flex-1 flex items-center justify-center border-l border-theme-border text-theme-fg/80 hover:text-theme-accent transition-smooth hover:bg-theme-fg/5 relative"
            aria-label="Panier"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-theme-accent text-theme-bg font-bold text-[9px] flex items-center justify-center shadow-gold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center px-6 border-l border-theme-border text-theme-fg focus:outline-none hover:bg-theme-fg/5"
            aria-label="Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-theme-border bg-theme-bg/95 backdrop-blur-xl animate-fade-in">
          <nav className="flex flex-col divide-y divide-theme-border">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`py-4 px-6 text-xs font-bold tracking-widest uppercase transition-smooth ${
                  isActive(link.href) ? "text-theme-accent bg-theme-fg/[0.02]" : "text-theme-fg/85 hover:text-theme-accent"
                }`}
              >
                <InteractiveText text={link.name} />
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
