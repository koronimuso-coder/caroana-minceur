"use client";

import {
  useState,
  useEffect,
  useContext,
  createContext,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
  type ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

// ─── Types ───────────────────────────────────────────────────────────────────

export type AuthError = {
  code: string;
  message: string;
};

export type AuthState = {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
};

export type AuthContextValue = AuthState & {
  // Email / Password
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  // Google
  signInWithGoogle: () => Promise<void>;
  // Phone
  sendPhoneOtp: (phoneNumber: string, recaptchaContainerId: string) => Promise<ConfirmationResult>;
  confirmPhoneOtp: (confirmation: ConfirmationResult, otp: string) => Promise<void>;
  // Common
  logout: () => Promise<void>;
  clearError: () => void;
};

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // ── Auth state listener ────────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleError = useCallback((err: unknown) => {
    const firebaseErr = err as { code?: string; message?: string };
    setError({
      code: firebaseErr.code ?? "unknown",
      message: translateFirebaseError(firebaseErr.code ?? ""),
    });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // ── Email / Password ────────────────────────────────────────────────────────

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName?: string) => {
      setLoading(true);
      setError(null);
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(credential.user, { displayName });
        }
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const resetPassword = useCallback(
    async (email: string) => {
      setError(null);
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (err) {
        handleError(err);
      }
    },
    [handleError]
  );

  // ── Google ─────────────────────────────────────────────────────────────────

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // ── Phone ──────────────────────────────────────────────────────────────────

  const sendPhoneOtp = useCallback(
    async (phoneNumber: string, recaptchaContainerId: string): Promise<ConfirmationResult> => {
      setError(null);
      // Destroy existing verifier to avoid duplicate widgets
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
      const verifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
        size: "invisible",
        callback: () => {},
      });
      recaptchaVerifierRef.current = verifier;
      try {
        const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
        return confirmation;
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    [handleError]
  );

  const confirmPhoneOtp = useCallback(
    async (confirmation: ConfirmationResult, otp: string) => {
      setLoading(true);
      setError(null);
      try {
        await confirmation.confirm(otp);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // ── Sign Out ───────────────────────────────────────────────────────────────

  const logout = useCallback(async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signUpWithEmail,
        signInWithEmail,
        resetPassword,
        signInWithGoogle,
        sendPhoneOtp,
        confirmPhoneOtp,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// ─── Error translations ───────────────────────────────────────────────────────

function translateFirebaseError(code: string): string {
  const map: Record<string, string> = {
    "auth/email-already-in-use": "Cette adresse email est déjà utilisée.",
    "auth/invalid-email": "Adresse email invalide.",
    "auth/user-not-found": "Aucun compte trouvé avec cet email.",
    "auth/wrong-password": "Mot de passe incorrect.",
    "auth/weak-password": "Le mot de passe doit comporter au moins 6 caractères.",
    "auth/too-many-requests": "Trop de tentatives. Veuillez réessayer plus tard.",
    "auth/popup-closed-by-user": "La fenêtre de connexion a été fermée.",
    "auth/network-request-failed": "Erreur réseau. Vérifiez votre connexion internet.",
    "auth/invalid-verification-code": "Code de vérification incorrect.",
    "auth/invalid-phone-number": "Numéro de téléphone invalide. Utilisez le format international (+225...).",
    "auth/code-expired": "Le code a expiré. Veuillez en demander un nouveau.",
    "auth/unauthorized-domain": "Ce domaine n'est pas autorisé pour l'authentification.",
    "auth/operation-not-allowed": "Cette méthode de connexion n'est pas activée.",
    "auth/account-exists-with-different-credential":
      "Un compte existe déjà avec cet email via un autre fournisseur.",
  };
  return map[code] ?? "Une erreur inattendue s'est produite. Veuillez réessayer.";
}
