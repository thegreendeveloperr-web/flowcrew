import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowCrew | AI crew per il caos clienti",
  description:
    "FlowCrew trasforma messaggi, email e richieste clienti in riassunti, priorita, tag, task e risposte pronte.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full bg-[var(--fc-bg)] text-[var(--fc-text)]">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
