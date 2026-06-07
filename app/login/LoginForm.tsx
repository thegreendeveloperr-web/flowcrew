"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, LoaderCircle, LockKeyhole } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/components/LanguageProvider";
import { createClient } from "@/lib/supabase/client";

const loginCopy = {
  it: {
    authCallbackError: "Accesso non completato. Riprova.",
    confirmEmail: "Controlla la mail per confermare l'account, poi accedi.",
    genericError: "Non riesco ad accedere in questo momento.",
    home: "Home",
    label: "Workspace privato FlowCrew",
    signInTitle: "Accedi a FlowCrew",
    signUpTitle: "Crea il tuo account",
    body: "Il tuo command center clienti è privato e collegato solo al tuo account.",
    email: "Email",
    password: "Password",
    loading: "Attendi...",
    signIn: "Accedi",
    signUp: "Crea account",
    switchToSignUp: "Non hai un account? Crealo",
    switchToSignIn: "Hai già un account? Accedi",
  },
  en: {
    authCallbackError: "Sign-in was not completed. Try again.",
    confirmEmail: "Check your email to confirm the account, then sign in.",
    genericError: "I can't sign you in right now.",
    home: "Home",
    label: "FlowCrew private workspace",
    signInTitle: "Sign in to FlowCrew",
    signUpTitle: "Create your account",
    body: "Your client command center is private and connected only to your account.",
    email: "Email",
    password: "Password",
    loading: "Please wait...",
    signIn: "Sign in",
    signUp: "Create account",
    switchToSignUp: "No account yet? Create one",
    switchToSignIn: "Already have an account? Sign in",
  },
} as const;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const copy = loginCopy[language];
  const nextPath = searchParams.get("next") ?? "/dashboard";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"sign_in" | "sign_up">("sign_in");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const visibleError = error ?? (authError === "auth_callback" ? copy.authCallbackError : null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();

      if (mode === "sign_up") {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
          },
        });

        if (signUpError) throw signUpError;

        setMessage(copy.confirmEmail);
        setMode("sign_in");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) throw signInError;

      router.push(nextPath.startsWith("/") ? nextPath : "/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : copy.genericError,
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flow-lime-glow min-h-screen overflow-hidden bg-[var(--fc-bg)] text-[var(--fc-text)]" id="main-content" tabIndex={-1}>
      <div className="pointer-events-none fixed inset-0 flow-grid-dark opacity-55" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link href="/" className="fc-button w-fit">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {copy.home}
          </Link>
          <LanguageSelector />
        </div>

        <section className="fc-panel p-6 sm:p-7">
          <div className="mb-7 flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-[rgba(200,245,66,0.24)] bg-[rgba(200,245,66,0.09)] text-[var(--fc-accent)]">
              <LockKeyhole aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="fc-label">{copy.label}</p>
              <h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-[var(--fc-text)]">
                {mode === "sign_in" ? copy.signInTitle : copy.signUpTitle}
              </h1>
            </div>
          </div>

          <p className="mb-6 text-sm leading-6 text-[var(--fc-text-muted)]">
            {copy.body}
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-[var(--fc-text)]">
              {copy.email}
              <input
                autoComplete="email"
                className="fc-input mt-2"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </label>

            <label className="block text-sm font-semibold text-[var(--fc-text)]">
              {copy.password}
              <input
                autoComplete={mode === "sign_up" ? "new-password" : "current-password"}
                className="fc-input mt-2"
                minLength={8}
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>

            <button type="submit" disabled={isLoading} className="fc-button fc-button-primary w-full">
              {isLoading ? (
                <>
                  <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                  {copy.loading}
                </>
              ) : (
                <>
                  <LockKeyhole aria-hidden="true" className="h-4 w-4" />
                  {mode === "sign_in" ? copy.signIn : copy.signUp}
                </>
              )}
            </button>
          </form>

          <button
            type="button"
            className="mt-4 w-full text-center text-sm font-semibold text-[var(--fc-accent)] transition hover:text-[var(--fc-accent-strong)]"
            onClick={() => {
              setMode(mode === "sign_in" ? "sign_up" : "sign_in");
              setError(null);
              setMessage(null);
            }}
          >
            {mode === "sign_in" ? copy.switchToSignUp : copy.switchToSignIn}
          </button>

          {visibleError ? (
            <div className="mt-4 flex gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm font-medium leading-6 text-red-100" role="alert">
              <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
              {visibleError}
            </div>
          ) : null}

          {message ? (
            <p className="mt-4 rounded-xl border border-[rgba(139,255,197,0.22)] bg-[rgba(139,255,197,0.08)] p-4 text-sm font-medium text-[var(--fc-mint)]" role="status">
              {message}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
