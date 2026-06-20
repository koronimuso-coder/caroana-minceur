"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Conseil Cures",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setStatus("error");
      return;
    }

    setStatus("submitting");

    // Simulate API request
    setTimeout(() => {
      setStatus("success");
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "Conseil Cures",
        message: "",
      });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === "error") setStatus("idle");
  };

  return (
    <div className="pt-16 min-h-screen" style={{ background: "var(--color-theme-bg)", color: "var(--color-theme-fg)" }}>
      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden py-20 border-b" style={{ borderColor: "var(--color-theme-border)" }}>
        {/* Orbs background */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(var(--color-theme-accent-rgb), 0.08) 0%, transparent 70%)", filter: "blur(60px)", transform: "translate(20%, -20%)" }} />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(var(--color-theme-accent-rgb), 0.04) 0%, transparent 70%)", filter: "blur(50px)", transform: "translate(-20%, 20%)" }} />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-5">
          <ScrollReveal animation="scale-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest mb-2"
              style={{ background: "rgba(var(--color-theme-accent-rgb), 0.1)", color: "var(--color-theme-accent)", border: "1px solid rgba(var(--color-theme-accent-rgb), 0.2)" }}>
              <MessageSquare className="w-3 h-3" />
              Service Client Caroana
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={80}>
            <h1 className="font-sans text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none">
              Contact & <span style={{ color: "var(--color-theme-accent)" }}>Conseil Minceur</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto" style={{ color: "var(--color-theme-muted)" }}>
              Vous avez des questions sur nos cures minceur ? Besoin d&apos;aide pour passer commande ? Notre équipe herboriste vous répond en moins de 15 minutes.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ====== MAIN CONTACT AREA ====== */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT: Info & WhatsApp */}
            <div className="lg:col-span-5 space-y-8">
              <ScrollReveal animation="fade-up">
                <div className="space-y-6">
                  <h2 className="text-2xl font-black uppercase tracking-tight" style={{ color: "var(--color-theme-fg)" }}>
                    Discutons <span style={{ color: "var(--color-theme-accent)" }}>Directement</span>
                  </h2>
                  <p className="text-xs sm:text-sm" style={{ color: "var(--color-theme-muted)" }}>
                    Pour une assistance ultra-rapide ou pour commander sans passer par le site, cliquez ci-dessous pour ouvrir une conversation WhatsApp sécurisée.
                  </p>
                </div>
              </ScrollReveal>

              {/* WhatsApp Premium CTA */}
              <ScrollReveal animation="scale-up" delay={100}>
                <a
                  href="https://wa.me/2250143655088?text=Bonjour%20Caroana%20Minceur%2C%20je%20souhaite%20commander%20une%20cure%20!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-6 rounded-2xl border text-center transition-all duration-300 relative group overflow-hidden"
                  style={{
                    borderColor: "rgba(37, 211, 102, 0.3)",
                    background: "rgba(37, 211, 102, 0.05)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(37, 211, 102, 0.8)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 15px 35px rgba(37, 211, 102, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(37, 211, 102, 0.3)";
                    (e.currentTarget as HTMLElement).style.transform = "";
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                  }}
                >
                  <span className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center text-2xl font-bold mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    💬
                  </span>
                  <span className="font-sans font-black text-sm uppercase tracking-wider text-[#25D366]">
                    WhatsApp Officiel
                  </span>
                  <span className="text-[16px] font-black mt-1" style={{ color: "var(--color-theme-fg)" }}>
                    +225 01 43 65 50 88
                  </span>
                  <span className="text-[10px] mt-2 font-bold" style={{ color: "var(--color-theme-muted)" }}>
                    Disponible 7j/7 • Réponses instantanées
                  </span>
                </a>
              </ScrollReveal>

              {/* Classic Contact Info */}
              <ScrollReveal animation="fade-up" delay={150}>
                <div className="rounded-2xl p-6 border space-y-6" style={{ background: "var(--color-theme-card)", borderColor: "var(--color-theme-border)" }}>
                  <h3 className="font-sans font-black text-xs uppercase tracking-widest text-theme-fg border-b pb-3" style={{ borderColor: "var(--color-theme-border)" }}>
                    Informations Pratiques
                  </h3>

                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center border" style={{ borderColor: "var(--color-theme-border)" }}>
                        <Phone className="w-4 h-4" style={{ color: "var(--color-theme-accent)" }} />
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-theme-muted)" }}>Ligne Standard</div>
                        <a href="tel:+2250143655088" className="text-xs font-bold hover:underline">+225 01 43 65 50 88</a>
                      </div>
                    </li>

                    <li className="flex gap-4">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center border" style={{ borderColor: "var(--color-theme-border)" }}>
                        <Mail className="w-4 h-4" style={{ color: "var(--color-theme-accent)" }} />
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-theme-muted)" }}>E-mail Support</div>
                        <a href="mailto:contact@caroana-minceur.com" className="text-xs font-bold hover:underline">contact@caroana-minceur.com</a>
                      </div>
                    </li>

                    <li className="flex gap-4">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center border" style={{ borderColor: "var(--color-theme-border)" }}>
                        <Clock className="w-4 h-4" style={{ color: "var(--color-theme-accent)" }} />
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-theme-muted)" }}>Heures d&apos;ouverture</div>
                        <div className="text-xs font-bold">Lundi - Samedi : 8h00 - 19h00</div>
                      </div>
                    </li>

                    <li className="flex gap-4">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center border" style={{ borderColor: "var(--color-theme-border)" }}>
                        <MapPin className="w-4 h-4" style={{ color: "var(--color-theme-accent)" }} />
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-theme-muted)" }}>Bureau / Livraison</div>
                        <div className="text-xs font-bold">Abidjan, Côte d&apos;Ivoire</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </ScrollReveal>
            </div>

            {/* RIGHT: Contact Form */}
            <div className="lg:col-span-7">
              <ScrollReveal animation="fade-up" delay={100}>
                <div className="rounded-3xl p-6 sm:p-10 border" style={{ background: "var(--color-theme-card)", borderColor: "var(--color-theme-border)" }}>
                  
                  {status === "success" ? (
                    <div className="text-center py-12 space-y-6">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto animate-bounce">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="font-sans text-2xl font-black uppercase tracking-tight">
                        Message Envoyé !
                      </h3>
                      <p className="text-xs sm:text-sm max-w-md mx-auto" style={{ color: "var(--color-theme-muted)" }}>
                        Merci pour votre message. Notre conseillère herboriste étudie votre demande et vous recontactera par téléphone ou WhatsApp dans quelques instants.
                      </p>
                      <button
                        onClick={() => setStatus("idle")}
                        className="px-6 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-widest transition-all"
                        style={{ borderColor: "var(--color-theme-border)" }}
                      >
                        Envoyer un autre message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-xl font-black uppercase tracking-tight">
                          Écrivez-nous
                        </h2>
                        <p className="text-[10px]" style={{ color: "var(--color-theme-muted)" }}>
                          Remplissez le formulaire ci-dessous et obtenez une réponse rapide.
                        </p>
                      </div>

                      {status === "error" && (
                        <div className="p-4 rounded-xl flex items-center gap-3 text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          Veuillez remplir tous les champs obligatoires (*).
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-theme-muted)" }}>
                            Nom complet <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Votre nom"
                            className="w-full px-4 py-3 rounded-lg border text-xs bg-transparent focus:outline-none transition-all"
                            style={{ borderColor: "var(--color-theme-border)", color: "var(--color-theme-fg)" }}
                            onFocus={e => e.target.style.borderColor = "var(--color-theme-accent)"}
                            onBlur={e => e.target.style.borderColor = "var(--color-theme-border)"}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-theme-muted)" }}>
                            Numéro WhatsApp <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Ex: +225 07 00 00 00 00"
                            className="w-full px-4 py-3 rounded-lg border text-xs bg-transparent focus:outline-none transition-all"
                            style={{ borderColor: "var(--color-theme-border)", color: "var(--color-theme-fg)" }}
                            onFocus={e => e.target.style.borderColor = "var(--color-theme-accent)"}
                            onBlur={e => e.target.style.borderColor = "var(--color-theme-border)"}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-theme-muted)" }}>
                            Adresse E-mail
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="votre@email.com"
                            className="w-full px-4 py-3 rounded-lg border text-xs bg-transparent focus:outline-none transition-all"
                            style={{ borderColor: "var(--color-theme-border)", color: "var(--color-theme-fg)" }}
                            onFocus={e => e.target.style.borderColor = "var(--color-theme-accent)"}
                            onBlur={e => e.target.style.borderColor = "var(--color-theme-border)"}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-theme-muted)" }}>
                            Sujet de votre message
                          </label>
                          <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border text-xs bg-transparent focus:outline-none transition-all"
                            style={{ borderColor: "var(--color-theme-border)", color: "var(--color-theme-fg)", background: "var(--color-theme-card)" }}
                            onFocus={e => e.target.style.borderColor = "var(--color-theme-accent)"}
                            onBlur={e => e.target.style.borderColor = "var(--color-theme-border)"}
                          >
                            <option value="Conseil Cures">Conseil Cures Minceur</option>
                            <option value="Suivi Commande">Suivi de ma commande</option>
                            <option value="Recrutement Distributeurs">Partenariat & Distribution</option>
                            <option value="Autre">Autre demande</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-theme-muted)" }}>
                          Votre Message <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          placeholder="Décrivez votre objectif ou votre question..."
                          className="w-full px-4 py-3 rounded-lg border text-xs bg-transparent focus:outline-none transition-all resize-none"
                          style={{ borderColor: "var(--color-theme-border)", color: "var(--color-theme-fg)" }}
                          onFocus={e => e.target.style.borderColor = "var(--color-theme-accent)"}
                          onBlur={e => e.target.style.borderColor = "var(--color-theme-border)"}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300"
                        style={{
                          background: "var(--color-theme-accent)",
                          color: "var(--color-theme-bg)",
                          opacity: status === "submitting" ? 0.7 : 1,
                          cursor: status === "submitting" ? "not-allowed" : "pointer"
                        }}
                      >
                        {status === "submitting" ? (
                          <>
                            <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                            Traitement en cours...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Envoyer ma Demande
                            <Sparkles className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ====== MAP SECTION ====== */}
      <section className="py-16 border-t" style={{ borderColor: "var(--color-theme-border)" }}>
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <ScrollReveal animation="fade-up">
            <h3 className="font-sans text-xl font-black uppercase tracking-tight">
              Zone de Livraison & <span style={{ color: "var(--color-theme-accent)" }}>Bureaux</span>
            </h3>
            <p className="text-xs max-w-md mx-auto" style={{ color: "var(--color-theme-muted)" }}>
              Nous livrons tous nos produits à Abidjan sous 24h et à l&apos;intérieur du pays sous 48h.
            </p>
          </ScrollReveal>

          {/* Styled SVG Map Mockup */}
          <ScrollReveal animation="scale-up" delay={100}>
            <div className="rounded-3xl border overflow-hidden p-6 sm:p-10 relative" style={{ borderColor: "var(--color-theme-border)", background: "var(--color-theme-card)" }}>
              <svg className="w-full max-w-lg mx-auto opacity-70" viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Abidjan districts silhouette */}
                <path d="M50 150 C80 120, 120 180, 160 140 C200 100, 250 170, 290 120 C330 70, 390 110, 420 90 C450 70, 480 120, 450 180 C420 240, 320 220, 280 250 C240 280, 160 210, 120 230 C80 250, 20 180, 50 150 Z" fill="var(--color-theme-accent)" fillOpacity="0.05" stroke="var(--color-theme-accent)" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="4 4" />
                {/* Ebrié lagoon abstract paths */}
                <path d="M10 200 Q150 180, 230 210 T400 180 T490 220" stroke="var(--color-theme-border)" strokeWidth="4" strokeLinecap="round" />
                <path d="M110 180 Q190 160, 220 185 T310 170" stroke="var(--color-theme-border)" strokeWidth="2.5" strokeLinecap="round" />
                {/* Delivery pins */}
                <g transform="translate(180, 110)" className="animate-bounce">
                  <path d="M12 0 C5.37 0 0 5.37 0 12 C0 21 12 32 12 32 C12 32 24 21 24 12 C24 5.37 18.63 0 12 0 Z" fill="var(--color-theme-accent)" />
                  <circle cx="12" cy="12" r="5" fill="var(--color-theme-bg)" />
                </g>
                <text x="180" y="155" textAnchor="middle" fill="var(--color-theme-fg)" className="text-[10px] font-black tracking-widest uppercase">ABIDJAN (HQ)</text>
                <text x="320" y="90" textAnchor="middle" fill="var(--color-theme-muted)" className="text-[8px] font-bold">Cocody</text>
                <text x="120" y="120" textAnchor="middle" fill="var(--color-theme-muted)" className="text-[8px] font-bold">Yopougon</text>
                <text x="260" y="160" textAnchor="middle" fill="var(--color-theme-muted)" className="text-[8px] font-bold">Marcory</text>
              </svg>
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-between gap-2 text-[10px] font-bold">
                <span style={{ color: "var(--color-theme-muted)" }}>🏙️ Abidjan : 1 000 - 1 500 F CFA</span>
                <span style={{ color: "var(--color-theme-muted)" }}>🌍 Côte d&apos;Ivoire : 2 500 F CFA</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
