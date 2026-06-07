"use client";

import { useLanguage, type Language } from "@/components/LanguageProvider";

const languages: Language[] = ["en", "it"];

export default function LanguageSelector() {
  const { language, setLanguage, copy } = useLanguage();

  return (
    <div
      aria-label={copy.languageLabel}
      className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.025] p-1"
      role="group"
    >
      {languages.map((option) => {
        const isActive = language === option;

        return (
          <button
            aria-pressed={isActive}
            className={`flow-mono rounded-full px-2.5 py-1.5 text-[10px] font-medium tracking-[0.14em] transition ${
              isActive
                ? "bg-[var(--fc-accent)] text-[#080808]"
                : "text-[var(--fc-text-muted)] hover:text-[var(--fc-text)]"
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
