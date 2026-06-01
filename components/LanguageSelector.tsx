"use client";

import { useLanguage, type Language } from "@/components/LanguageProvider";

const languages: Language[] = ["en", "it"];

export default function LanguageSelector() {
  const { language, setLanguage, copy } = useLanguage();

  return (
    <div
      aria-label={copy.languageLabel}
      className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.045] p-1 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl"
      role="group"
    >
      {languages.map((option) => {
        const isActive = language === option;

        return (
          <button
            aria-pressed={isActive}
            className={`rounded-full px-2.5 py-1 text-[10px] font-black tracking-[0.18em] transition ${
              isActive
                ? "bg-cyan-300 text-slate-950 shadow-[0_0_18px_rgba(103,232,249,0.28)]"
                : "text-slate-400 hover:text-white"
            }`}
            key={option}
            onClick={() => setLanguage(option)}
            type="button"
          >
            {option.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
