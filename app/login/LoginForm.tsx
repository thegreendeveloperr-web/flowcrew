"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, LoaderCircle, LockKeyhole, Sparkles } from "lucide-react";
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

        setMessage("Controlla la email per confermare l'account, poi accedi.");
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
    <main className="relative min-h-screen overflow-hidden bg-[#f6f8fc] text-slate-950" id="main-content" tabIndex={-1}>
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-14%] top-[-18%] h-[34rem] w-[34rem] rounded-full bg-indigo-300/24 blur-[130px]" />
        <div className="absolute right-[-14%] top-[3%] h-[34rem] w-[34rem] rounded-full bg-cyan-200/26 blur-[130px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/82 px-4 py-2 text-sm font-black text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.06)] backdrop-blur-xl"
        >
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <section className="rounded-[2.25rem] border border-slate-200 bg-white/86 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-500 text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)]">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">FlowCrew</p>
              <h1 className="text-2xl font-black tracking-[-0.05em] text-slate-950">
                {mode === "sign_in" ? "Accedi al workspace" : "Crea account"}
              </h1>
            </div>
          </div>

          <p className="mb-6 text-sm leading-6 text-slate-600">
            I tuoi lead sono privati per account. Dashboard, trial e import richiedono l&apos;accesso.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-black text-slate-700">
              Email
              <input
                autoComplete="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="block text-sm font-black text-slate-700">
              Password
              <input
                autoComplete={mode === "sign_up" ? "new-password" : "current-password"}
                name="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 px-5 py-4 text-sm font-black text-white shadow-[0_18px_40px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Attendi...
                </>
              ) : (
                <>
                  <LockKeyhole className="h-4 w-4" />
                  {mode === "sign_in" ? "Accedi" : "Registrati"}
                </>
              )}
            </button>
          </form>

          <button
            type="button"
            className="mt-4 w-full text-center text-sm font-black text-blue-700 transition hover:text-blue-950"
            onClick={() => {
              setMode(mode === "sign_in" ? "sign_up" : "sign_in");
              setError(null);
              setMessage(null);
            }}
          >
            {mode === "sign_in" ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
          </button>

          {error ? (
            <div className="mt-4 flex gap-3 rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold leading-6 text-rose-800" role="alert">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              {error}
            </div>
          ) : null}

          {message ? (
            <p className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold text-emerald-800" role="status">
              {message}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
