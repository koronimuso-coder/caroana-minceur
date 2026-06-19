"use client";

import Link from "next/link";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const shopLinks = [
    { name: "Tous les produits", href: "/boutique" },
    { name: "Gélules Ventre Plat", href: "/boutique?type=capsules" },
    { name: "Thés Détox", href: "/boutique?type=tea" },
    { name: "Tisanes Ventre Plat", href: "/boutique?type=herbal_tea" },
  ];

  const policyLinks = [
    { name: "Conditions Générales de Vente", href: "/conditions-generales" },
    { name: "Politique de Confidentialité", href: "/confidentialite" },
    { name: "Mentions Légales", href: "/mentions-legales" },
    { name: "Politique de Livraison", href: "/livraison" },
    { name: "Retours & Remboursements", href: "/retours" },
  ];

  return (
    <footer className="bg-theme-bg text-theme-fg border-t border-theme-border w-full mt-20 transition-colors duration-500">
      <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
        
        {/* Col 1: Brand Info */}
        <div className="col-span-12 md:col-span-3 border-b md:border-b-0 md:border-r border-theme-border p-8 sm:p-10 space-y-4 flex flex-col justify-between">
          <div>
            <span className="font-serif text-xl font-bold tracking-wider text-theme-accent">
              CAROANA MINCEUR
            </span>
            <p className="text-xs text-theme-fg/70 leading-relaxed mt-4">
              Marque ivoirienne de bien-être naturel. Inspirée des plantes africaines pour accompagner votre silhouette au quotidien.
            </p>
          </div>
          <div className="flex space-x-3 pt-4">
            {/* WhatsApp */}
            <a
              href="https://wa.me/2250143655088"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 border border-theme-border rounded-full flex items-center justify-center hover:bg-theme-accent hover:text-theme-bg hover:border-theme-accent transition-smooth"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            {/* Phone */}
            <a
              href="tel:+2250719172371"
              className="w-8 h-8 border border-theme-border rounded-full flex items-center justify-center hover:bg-theme-accent hover:text-theme-bg hover:border-theme-accent transition-smooth"
              aria-label="Phone"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Boutique */}
        <div className="col-span-12 md:col-span-3 border-b md:border-b-0 md:border-r border-theme-border p-8 sm:p-10">
          <h3 className="text-theme-accent font-bold tracking-widest uppercase text-[10px] mb-6">
            Boutique
          </h3>
          <ul className="space-y-3.5">
            {shopLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-xs text-theme-fg/80 hover:text-theme-accent transition-smooth"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Informations */}
        <div className="col-span-12 md:col-span-3 border-b md:border-b-0 md:border-r border-theme-border p-8 sm:p-10">
          <h3 className="text-theme-accent font-bold tracking-widest uppercase text-[10px] mb-6">
            Informations
          </h3>
          <ul className="space-y-3.5">
            {policyLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-xs text-theme-fg/80 hover:text-theme-accent transition-smooth"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Contact details */}
        <div className="col-span-12 md:col-span-3 p-8 sm:p-10 space-y-6">
          <h3 className="text-theme-accent font-bold tracking-widest uppercase text-[10px]">
            Contact Officiel
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3 text-xs text-theme-fg/80">
              <MapPin className="w-4 h-4 text-theme-accent flex-shrink-0" />
              <span>Abidjan, Côte d&apos;Ivoire</span>
            </li>
            <li className="flex items-center space-x-3 text-xs text-theme-fg/80">
              <Phone className="w-4 h-4 text-theme-accent flex-shrink-0" />
              <a href="tel:+2250719172371" className="hover:text-theme-accent transition-smooth">
                +225 07 19 17 23 71
              </a>
            </li>
            <li className="flex items-center space-x-3 text-xs text-theme-fg/80">
              <MessageCircle className="w-4 h-4 text-theme-accent flex-shrink-0" />
              <a
                href="https://wa.me/2250143655088"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-theme-accent transition-smooth"
              >
                WhatsApp: +225 01 43 65 50 88
              </a>
            </li>
            <li className="flex items-center space-x-3 text-xs text-theme-fg/80">
              <Mail className="w-4 h-4 text-theme-accent flex-shrink-0" />
              <a
                href="mailto:contact@caroana-minceur.com"
                className="hover:text-theme-accent transition-smooth"
              >
                contact@caroana-minceur.com
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Responsible Disclaimer row */}
      <div className="border-t border-theme-border py-6 px-8 text-center text-[10px] text-theme-fg/40 leading-relaxed">
        Les informations présentées sur ce site ne remplacent pas l’avis d’un professionnel de santé. Respectez les conseils d’utilisation et les précautions indiquées sur le produit.
      </div>

      {/* Copyright row */}
      <div className="border-t border-theme-border px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-[10px] text-theme-fg/50">
        <span>&copy; {currentYear} CAROANA MINCEUR. Tous droits réservés.</span>
        <span className="mt-2 sm:mt-0 uppercase tracking-widest">Élégance & Pureté Naturelle</span>
      </div>
    </footer>
  );
}
