"use client";

import { useState } from "react";
import { MessageCircle, X, Sparkles, Send, Check } from "lucide-react";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    {
      text: "Quelle cure choisir ?",
      msg: "Bonjour Caroana Minceur, j'aimerais savoir quelle cure (gélules, thé ou tisane) est la plus adaptée pour mon objectif."
    },
    {
      text: "Suivre mon colis",
      msg: "Bonjour Caroana Minceur, je souhaite suivre l'état de livraison de ma commande récente."
    },
    {
      text: "Passer commande directe",
      msg: "Bonjour Caroana Minceur, je souhaite passer une commande rapide en direct sur WhatsApp."
    }
  ];

  const getWhatsAppLink = (message: string) => {
    return `https://wa.me/2250143655088?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-999 md:bottom-8 md:right-8 flex flex-col items-end">
      
      {/* Expanded Floating Box */}
      {isOpen && (
        <div className="w-[310px] sm:w-[340px] bg-theme-card border border-theme-border rounded-xl shadow-2xl p-5 mb-4 animate-scale-up z-9999 text-left">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-theme-border pb-3 mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-theme-fg/5 flex items-center justify-center border border-theme-border">
                  <MessageCircle className="w-5 h-5 text-theme-accent" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-theme-card animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-theme-fg uppercase tracking-wider flex items-center gap-1">
                  Conseil Caroana
                  <Sparkles className="w-3 h-3 text-theme-accent" />
                </h4>
                <p className="text-[9px] text-emerald-500 font-semibold uppercase tracking-widest">En ligne (Abidjan)</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-theme-muted hover:text-theme-fg p-1 transition-smooth cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Welcoming Message */}
          <div className="bg-theme-bg/60 border border-theme-border rounded p-3 text-[11px] text-theme-fg leading-relaxed mb-4">
            Bonjour ! Je suis conseillère en phytothérapie active. Quelle est votre question aujourd'hui ?
          </div>

          {/* Quick choices list */}
          <div className="space-y-2">
            <span className="text-[8px] font-bold text-theme-muted uppercase tracking-widest block mb-1">Options rapides</span>
            {options.map((opt, idx) => (
              <a
                key={idx}
                href={getWhatsAppLink(opt.msg)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-between p-2.5 bg-theme-bg border border-theme-border rounded text-[10px] font-bold uppercase tracking-wider text-theme-fg hover:border-theme-accent hover:text-theme-accent transition-smooth group cursor-pointer"
              >
                <span>{opt.text}</span>
                <Send className="w-3 h-3 text-theme-muted group-hover:text-theme-accent group-hover:translate-x-0.5 transition-smooth" />
              </a>
            ))}
          </div>

          <div className="text-center text-[7px] text-theme-muted uppercase font-mono mt-4 pt-3 border-t border-theme-border">
            Service Client • Réponse sous 15 min
          </div>

        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-theme-accent text-theme-bg flex items-center justify-center shadow-gold transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95 cursor-pointer relative group"
        aria-label="Assistance WhatsApp"
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-6 transition-smooth" />
        )}
        
        {/* Pulsing indicator dot */}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-theme-fg border-2 border-theme-bg flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </span>
        )}
      </button>

    </div>
  );
}
