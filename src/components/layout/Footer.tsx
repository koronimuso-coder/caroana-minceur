"use client";

import Link from "next/link";
import { Phone, MessageCircle, Mail, MapPin, Instagram, Facebook, ArrowRight, Sparkles, Leaf } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const shopLinks = [
    { name: "Gélules Ventre Plat — 10 000 F", href: "/boutique" },
    { name: "Gélules Kaylie — 25 000 F", href: "/boutique" },
    { name: "Gélules Skinny — 15 000 F", href: "/boutique" },
    { name: "Thé Détox — 5 000 F", href: "/boutique" },
    { name: "Tisane Ventre Plat — 5 000 F", href: "/boutique" },
    { name: "Pack Complet 3 Produits — 19 000 F", href: "/boutique" },
  ];

  const infoLinks = [
    { name: "À Propos de Caroana", href: "/a-propos" },
    { name: "FAQ — Questions fréquentes", href: "/#faq" },
    { name: "Contact & Commande", href: "/contact" },
    { name: "Politique de Livraison", href: "/contact" },
    { name: "Conditions Générales", href: "/contact" },
  ];

  const socials = [
    { icon: <MessageCircle className="w-4 h-4" />, href: "https://wa.me/2250143655088", label: "WhatsApp", color: "#25D366" },
    { icon: <Instagram className="w-4 h-4" />, href: "https://instagram.com", label: "Instagram", color: "#E4405F" },
    { icon: <Facebook className="w-4 h-4" />, href: "https://facebook.com", label: "Facebook", color: "#1877F2" },
  ];

  return (
    <footer
      className="w-full mt-0 transition-colors duration-500 relative overflow-hidden"
      style={{ background: "var(--color-theme-bg)", color: "var(--color-theme-fg)", borderTop: "1px solid var(--color-theme-border)" }}
    >
      {/* Ambient glow at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(var(--color-theme-accent-rgb), 0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* === MAIN FOOTER GRID === */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">

        {/* Col 1: Brand */}
        <div className="space-y-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, var(--color-theme-accent) 0%, rgba(var(--color-theme-accent-rgb), 0.5) 100%)",
                boxShadow: "0 0 15px rgba(var(--color-theme-accent-rgb), 0.35)",
              }}
            >
              <span className="text-base">🌿</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg font-bold" style={{ color: "var(--color-theme-fg)" }}>CAROANA</span>
              <span className="text-[8px] font-black tracking-[0.3em] uppercase" style={{ color: "var(--color-theme-accent)" }}>Minceur</span>
            </div>
          </Link>

          <p className="text-xs leading-relaxed" style={{ color: "var(--color-theme-muted)" }}>
            Marque ivoirienne de bien-être naturel. Inspirée des plantes africaines pour accompagner votre silhouette au quotidien.
          </p>

          {/* Tagline badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
            style={{ background: "rgba(var(--color-theme-accent-rgb), 0.08)", color: "var(--color-theme-accent)", border: "1px solid rgba(var(--color-theme-accent-rgb), 0.2)" }}
          >
            <Leaf className="w-3 h-3" />
            100% Naturel · Made in CIV
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  border: "1px solid var(--color-theme-border)",
                  background: "var(--color-theme-card)",
                  color: "var(--color-theme-muted)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = s.color;
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                  (e.currentTarget as HTMLElement).style.borderColor = s.color;
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "var(--color-theme-card)";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-theme-muted)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-theme-border)";
                  (e.currentTarget as HTMLElement).style.transform = "";
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Col 2: Boutique */}
        <div className="space-y-5">
          <h3
            className="text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2"
            style={{ color: "var(--color-theme-accent)" }}
          >
            <span className="w-3 h-px" style={{ background: "var(--color-theme-accent)" }} />
            Nos Produits
          </h3>
          <ul className="space-y-3">
            {shopLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-xs transition-all duration-300 flex items-center gap-2 group"
                  style={{ color: "var(--color-theme-muted)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--color-theme-accent)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--color-theme-muted)"}
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300" style={{ color: "var(--color-theme-accent)" }} />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Info links */}
        <div className="space-y-5">
          <h3
            className="text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2"
            style={{ color: "var(--color-theme-accent)" }}
          >
            <span className="w-3 h-px" style={{ background: "var(--color-theme-accent)" }} />
            Informations
          </h3>
          <ul className="space-y-3">
            {infoLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-xs transition-all duration-300 flex items-center gap-2 group"
                  style={{ color: "var(--color-theme-muted)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--color-theme-accent)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--color-theme-muted)"}
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300" style={{ color: "var(--color-theme-accent)" }} />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Contact + CTA */}
        <div className="space-y-5">
          <h3
            className="text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2"
            style={{ color: "var(--color-theme-accent)" }}
          >
            <span className="w-3 h-px" style={{ background: "var(--color-theme-accent)" }} />
            Nous Contacter
          </h3>
          <ul className="space-y-3.5">
            <li className="flex items-start gap-3">
              <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--color-theme-accent)" }} />
              <span className="text-xs" style={{ color: "var(--color-theme-muted)" }}>Abidjan, Côte d&apos;Ivoire</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--color-theme-accent)" }} />
              <a href="tel:+2250143655088" className="text-xs transition-all" style={{ color: "var(--color-theme-muted)" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--color-theme-accent)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--color-theme-muted)"}>
                +225 01 43 65 50 88
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#25D366" }} />
              <a href="https://wa.me/2250143655088" target="_blank" rel="noopener noreferrer"
                className="text-xs font-bold transition-all" style={{ color: "#25D366" }}>
                Commander sur WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--color-theme-accent)" }} />
              <a href="mailto:contact@caroana-minceur.com" className="text-xs transition-all" style={{ color: "var(--color-theme-muted)" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--color-theme-accent)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--color-theme-muted)"}>
                contact@caroana-minceur.com
              </a>
            </li>
          </ul>

          {/* WhatsApp CTA big */}
          <a
            href="https://wa.me/2250143655088?text=Bonjour%20Caroana%20Minceur%20%F0%9F%8C%BF%2C%20je%20souhaite%20commander%20!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300"
            style={{ background: "#25D366", color: "#fff" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 20px rgba(37,211,102,0.35)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow = "";
            }}
          >
            💬 Commander maintenant
          </a>

          {/* Livraison info */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[10px]">
              <span style={{ color: "var(--color-theme-muted)" }}>🏙️ Livraison Abidjan</span>
              <span className="font-bold" style={{ color: "var(--color-theme-accent)" }}>1 000 – 1 500 F</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span style={{ color: "var(--color-theme-muted)" }}>🌍 Hors Abidjan</span>
              <span className="font-bold" style={{ color: "var(--color-theme-accent)" }}>2 500 F</span>
            </div>
          </div>
        </div>
      </div>

      {/* === BOTTOM BAR === */}
      <div
        className="relative z-10 border-t px-6 py-4"
        style={{ borderColor: "var(--color-theme-border)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[9px]" style={{ color: "var(--color-theme-muted)" }}>
            Les produits Caroana ne remplacent pas l&apos;avis d&apos;un professionnel de santé.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-[9px]" style={{ color: "var(--color-theme-muted)", opacity: 0.5 }}>
              © {currentYear} CAROANA MINCEUR
            </span>
            <span className="flex items-center gap-1 text-[9px] font-bold" style={{ color: "var(--color-theme-accent)" }}>
              <Sparkles className="w-2.5 h-2.5" />
              Élégance & Pureté Naturelle
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
