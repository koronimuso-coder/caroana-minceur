"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Veuillez entrer un email valide.");
      return;
    }
    // Store locally / redirect to WhatsApp
    const msg = encodeURIComponent(`Bonjour Caroana Minceur 🌿, je souhaite m'inscrire à vos actualités avec l'email : ${email}`);
    window.open(`https://wa.me/2250143655088?text=${msg}`, "_blank");
    setSent(true);
    setError("");
  };

  return (
    <section
      className="py-20 border-t relative overflow-hidden"
      style={{ borderColor: "var(--color-theme-border)", background: "var(--color-theme-bg)" }}
    >
      {/* Glow bg */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[200px] rounded-full" style={{
          background: "radial-gradient(ellipse, rgba(var(--color-theme-accent-rgb), 0.07) 0%, transparent 70%)",
          filter: "blur(50px)"
        }} />
      </div>

      <div className="max-w-2xl mx-auto px-6 text-center relative z-10 space-y-6">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
          style={{ background: "rgba(var(--color-theme-accent-rgb), 0.1)", color: "var(--color-theme-accent)" }}
        >
          <Mail className="w-5 h-5" />
        </div>

        <div>
          <span className="text-[9px] font-black uppercase tracking-[0.35em]" style={{ color: "var(--color-theme-accent)" }}>
            Restez informée
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl font-black uppercase tracking-tight mt-1" style={{ color: "var(--color-theme-fg)" }}>
            Recevez nos promos & conseils<br />
            <span style={{ color: "var(--color-theme-accent)" }}>bien-être exclusifs</span>
          </h2>
          <p className="text-xs mt-2" style={{ color: "var(--color-theme-muted)" }}>
            Nos nouveautés, cures saisonnières et offres spéciales directement sur WhatsApp.
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="flex-1 px-4 py-3 rounded-lg border text-sm focus:outline-none transition-all"
              style={{
                background: "var(--color-theme-card)",
                borderColor: "var(--color-theme-border)",
                color: "var(--color-theme-fg)",
              }}
              onFocus={e => (e.target.style.borderColor = "var(--color-theme-accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--color-theme-border)")}
            />
            <button
              type="submit"
              className="btn-accent flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider"
            >
              S&apos;inscrire <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-lg max-w-md mx-auto"
            style={{ background: "rgba(var(--color-theme-accent-rgb), 0.1)", color: "var(--color-theme-accent)" }}
          >
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-bold">Merci ! Vous recevrez nos actualités sur WhatsApp.</span>
          </div>
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}

        <p className="text-[9px]" style={{ color: "var(--color-theme-muted)" }}>
          Pas de spam · Vous pouvez vous désinscrire à tout moment
        </p>
      </div>
    </section>
  );
}
