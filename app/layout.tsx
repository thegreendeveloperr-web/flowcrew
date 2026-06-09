import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://flowcrew.vercel.app"),
  title: {
    default: "FlowCrew",
    template: "%s | FlowCrew",
  },
  description:
    "Turn messy client messages into structured leads, next actions, follow-ups, and proposal notes with FlowCrew.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full bg-[var(--fc-bg)] text-[var(--fc-text)]">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <LanguageProvider>{children}</LanguageProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
