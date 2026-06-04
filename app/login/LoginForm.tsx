"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, LoaderCircle, LockKeyhole } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/dashboard";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"sign_in" | "sign_up">("sign_in");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    authError === "auth_callback" ? "Accesso non completato. Riprova." : null,
  );
  const [message, setMessage] = useState<string | null>(null);

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

        setMessage("Controlla la mail per confermare l'account, poi accedi.");
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
          : "Non riesco ad accedere in questo momento.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flow-lime-glow min-h-screen overflow-hidden bg-[var(--fc-bg)] text-[var(--fc-text)]" id="main-content" tabIndex={-1}>
      <div className="pointer-events-none fixed inset-0 flow-grid-dark opacity-55" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10 sm:px-6">
        <Link href="/" className="fc-button mb-6 w-fit">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Home
        </Link>

        <section className="fc-panel p-6 sm:p-7">
          <div className="mb-7 flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-[rgba(200,245,66,0.24)] bg-[rgba(200,245,66,0.09)] text-[var(--fc-accent)]">
              <LockKeyhole aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="fc-label">FlowCrew private workspace</p>
              <h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-[var(--fc-text)]">
                {mode === "sign_in" ? "Accedi a FlowCrew" : "Crea il tuo account"}
              </h1>
            </div>
          </div>

          <p className="mb-6 text-sm leading-6 text-[var(--fc-text-muted)]">
            Il tuo command center clienti e privato e collegato solo al tuo account.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-[var(--fc-text)]">
              Email
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
              Password
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
                  Attendi...
                </>
              ) : (
                <>
                  <LockKeyhole aria-hidden="true" className="h-4 w-4" />
                  {mode === "sign_in" ? "Accedi" : "Crea account"}
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
            {mode === "sign_in" ? "Non hai un account? Crealo" : "Hai gia un account? Accedi"}
          </button>

          {error ? (
            <div className="mt-4 flex gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm font-medium leading-6 text-red-100" role="alert">
              <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
              {error}
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
