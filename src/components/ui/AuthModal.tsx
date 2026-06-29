"use client";

import { useState, useId, useRef, useEffect, type FormEvent } from "react";
import { X, Mail, Lock, Phone, User, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { ConfirmationResult } from "firebase/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "login" | "register" | "forgot" | "phone" | "phone-otp";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Optional redirect after successful auth */
  onSuccess?: () => void;
  defaultMode?: Mode;
}

// ─── Google SVG Logo ──────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  defaultMode = "login",
}: AuthModalProps) {
  const uid = useId();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaId = `recaptcha-${uid}`;

  const {
    loading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
    sendPhoneOtp,
    confirmPhoneOtp,
    clearError,
    user,
  } = useAuth();

  // Close when user becomes authenticated
  useEffect(() => {
    if (user && isOpen) {
      onSuccess?.();
      onClose();
    }
  }, [user, isOpen, onClose, onSuccess]);

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setSuccessMsg(null);
      clearError();
      setOtp("");
      setPhoneNumber("");
      setConfirmationResult(null);
    }
  }, [isOpen, defaultMode, clearError]);

  if (!isOpen) return null;

  // ── Handlers ─────────────────────────────────────────────────────────────

  async function handleEmailAuth(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccessMsg(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    if (mode === "login") {
      await signInWithEmail(email, password);
    } else if (mode === "register") {
      const displayName = (form.elements.namedItem("displayName") as HTMLInputElement)?.value;
      await signUpWithEmail(email, password, displayName);
    }
  }

  async function handleForgotPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    await resetPassword(email);
    if (!error) {
      setSuccessMsg("Un email de réinitialisation a été envoyé. Vérifiez votre boîte mail.");
    }
  }

  async function handleSendOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const confirmation = await sendPhoneOtp(phoneNumber, recaptchaId);
      setConfirmationResult(confirmation);
      setMode("phone-otp");
    } catch {
      // error is set in hook
    }
  }

  async function handleConfirmOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!confirmationResult) return;
    await confirmPhoneOtp(confirmationResult, otp);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const titles: Record<Mode, string> = {
    login: "Connexion",
    register: "Créer un compte",
    forgot: "Mot de passe oublié",
    phone: "Connexion par SMS",
    "phone-otp": "Entrez le code SMS",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
        aria-label={titles[mode]}
      >
        {/* Panel */}
        <div
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top gradient bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-forest via-solar to-terracotta" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-foreground/40 hover:text-foreground transition-colors cursor-pointer z-10"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="px-8 py-8">
            {/* Back arrow for nested modes */}
            {(mode === "forgot" || mode === "phone" || mode === "phone-otp") && (
              <button
                onClick={() => {
                  setMode("login");
                  clearError();
                  setSuccessMsg(null);
                }}
                className="flex items-center gap-1.5 text-xs text-forest/60 hover:text-forest mb-4 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Retour
              </button>
            )}

            {/* Title */}
            <h2 className="font-serif text-2xl font-bold text-forest mb-1">{titles[mode]}</h2>
            <p className="text-xs text-foreground/50 mb-6">
              {mode === "login" && "Accédez à votre espace personnel CAROANA MINCEUR"}
              {mode === "register" && "Rejoignez la communauté CAROANA MINCEUR"}
              {mode === "forgot" && "Recevez un lien de réinitialisation par email"}
              {mode === "phone" && "Entrez votre numéro avec indicatif (+225...)"}
              {mode === "phone-otp" && `Code envoyé au ${phoneNumber}`}
            </p>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                <span>{error.message}</span>
              </div>
            )}

            {/* Success banner */}
            {successMsg && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-xs text-green-700 flex items-start gap-2">
                <span className="mt-0.5">✅</span>
                <span>{successMsg}</span>
              </div>
            )}

            {/* ── LOGIN / REGISTER ─────────────────────────────────────── */}
            {(mode === "login" || mode === "register") && (
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {mode === "register" && (
                  <Field label="Prénom / Nom" icon={<User className="w-4 h-4" />}>
                    <input
                      id={`${uid}-displayName`}
                      name="displayName"
                      type="text"
                      placeholder="Mariam Kouamé"
                      autoComplete="name"
                      className="input-auth"
                    />
                  </Field>
                )}

                <Field label="Adresse email" icon={<Mail className="w-4 h-4" />}>
                  <input
                    id={`${uid}-email`}
                    name="email"
                    type="email"
                    required
                    placeholder="vous@email.com"
                    autoComplete={mode === "login" ? "email" : "new-email"}
                    className="input-auth"
                  />
                </Field>

                <Field
                  label="Mot de passe"
                  icon={<Lock className="w-4 h-4" />}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-foreground/40 hover:text-foreground cursor-pointer"
                      aria-label={showPassword ? "Masquer" : "Afficher"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                >
                  <input
                    id={`${uid}-password`}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder={mode === "register" ? "Minimum 6 caractères" : "••••••••"}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    className="input-auth"
                  />
                </Field>

                {mode === "login" && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => { setMode("forgot"); clearError(); }}
                      className="text-[11px] text-solar hover:underline cursor-pointer"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {mode === "login" ? "Se connecter" : "Créer mon compte"}
                </button>
              </form>
            )}

            {/* ── FORGOT PASSWORD ───────────────────────────────────────── */}
            {mode === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <Field label="Adresse email" icon={<Mail className="w-4 h-4" />}>
                  <input
                    id={`${uid}-email-forgot`}
                    name="email"
                    type="email"
                    required
                    placeholder="vous@email.com"
                    className="input-auth"
                  />
                </Field>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Envoyer le lien
                </button>
              </form>
            )}

            {/* ── PHONE NUMBER INPUT ────────────────────────────────────── */}
            {mode === "phone" && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div id={recaptchaId} />
                <Field label="Numéro de téléphone" icon={<Phone className="w-4 h-4" />}>
                  <input
                    id={`${uid}-phone`}
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+225 07 00 00 00 00"
                    className="input-auth"
                  />
                </Field>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Envoyer le code SMS
                </button>
              </form>
            )}

            {/* ── OTP CONFIRMATION ──────────────────────────────────────── */}
            {mode === "phone-otp" && (
              <form onSubmit={handleConfirmOtp} className="space-y-4">
                <Field label="Code de vérification" icon={<Phone className="w-4 h-4" />}>
                  <input
                    id={`${uid}-otp`}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="input-auth tracking-widest text-center font-bold text-lg"
                  />
                </Field>
                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Confirmer
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("phone"); clearError(); setOtp(""); }}
                  className="w-full text-xs text-forest/50 hover:text-forest cursor-pointer"
                >
                  Renvoyer le code
                </button>
              </form>
            )}

            {/* ── Social / Divider ─────────────────────────────────────── */}
            {(mode === "login" || mode === "register") && (
              <>
                <div className="my-5 flex items-center gap-3">
                  <div className="flex-1 h-px bg-forest/10" />
                  <span className="text-[11px] text-foreground/40 font-medium">ou continuer avec</span>
                  <div className="flex-1 h-px bg-forest/10" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={signInWithGoogle}
                    disabled={loading}
                    className="btn-social"
                    id="auth-google-btn"
                  >
                    <GoogleIcon />
                    <span>Google</span>
                  </button>

                  {/* Phone */}
                  <button
                    type="button"
                    onClick={() => { setMode("phone"); clearError(); }}
                    disabled={loading}
                    className="btn-social"
                    id="auth-phone-btn"
                  >
                    <Phone className="w-4 h-4 text-forest" />
                    <span>Téléphone</span>
                  </button>
                </div>
              </>
            )}

            {/* ── Toggle Login / Register ───────────────────────────────── */}
            {(mode === "login" || mode === "register") && (
              <p className="text-center text-xs text-foreground/50 mt-6">
                {mode === "login" ? "Pas encore de compte ?" : "Vous avez déjà un compte ?"}{" "}
                <button
                  type="button"
                  onClick={() => { setMode(mode === "login" ? "register" : "login"); clearError(); }}
                  className="text-solar font-semibold hover:underline cursor-pointer"
                >
                  {mode === "login" ? "Créer un compte" : "Se connecter"}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Inline styles for auth-specific classes */}
      <style jsx global>{`
        .input-auth {
          width: 100%;
          border: 1px solid rgba(var(--color-forest-rgb, 52, 78, 65), 0.15);
          border-radius: 0.5rem;
          padding: 0.6rem 0.875rem;
          font-size: 0.8125rem;
          outline: none;
          background: white;
          color: inherit;
          transition: border-color 0.15s;
        }
        .input-auth:focus {
          border-color: var(--color-solar, #d4a853);
        }
        .btn-primary {
          background: var(--color-forest, #344e41);
          color: #f9f5eb;
          border: none;
          border-radius: 0.5rem;
          padding: 0.7rem 1.25rem;
          font-size: 0.8125rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s, opacity 0.15s;
        }
        .btn-primary:hover:not(:disabled) {
          background: #2d4438;
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-social {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: 1px solid rgba(52, 78, 65, 0.15);
          border-radius: 0.5rem;
          padding: 0.6rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #344e41;
          background: white;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .btn-social:hover:not(:disabled) {
          background: rgba(52, 78, 65, 0.04);
          border-color: rgba(52, 78, 65, 0.3);
        }
        .btn-social:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out both;
        }
      `}</style>
    </>
  );
}

// ─── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
  label,
  icon,
  suffix,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-forest uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-foreground/30 pointer-events-none">{icon}</span>
        )}
        <div className={`flex-1 ${icon ? "[&_input]:pl-9" : ""} ${suffix ? "[&_input]:pr-9" : ""}`}>
          {children}
        </div>
        {suffix && <span className="absolute right-3">{suffix}</span>}
      </div>
    </div>
  );
}
