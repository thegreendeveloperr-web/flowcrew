import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowCrew | AI crew for client work",
  description:
    "FlowCrew is a premium AI client workspace that turns messy WhatsApp, Gmail and client conversations into clear briefs, tags, replies and follow-ups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full bg-[#f7f9fc] text-slate-950">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
