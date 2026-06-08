import type { Metadata } from "next";
import HomeLanding from "@/components/HomeLanding";

const title = "FlowCrew — AI Client Intake for Freelancers and Agencies";
const description =
  "Turn messy client messages into structured leads, next actions, follow-ups, and proposal notes with FlowCrew.";

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  keywords: [
    "AI client intake",
    "client intake software",
    "lead organization",
    "AI CRM for freelancers",
    "freelance client management",
    "project brief generator",
    "client message organizer",
    "follow-up planning",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    siteName: "FlowCrew",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FlowCrew",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://flowcrew.vercel.app",
  description,
  audience: {
    "@type": "Audience",
    audienceType:
      "Freelancers, small agencies, consultants, and service providers",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Free trial",
      price: "0",
      priceCurrency: "EUR",
      description: "One real client lead analysis.",
    },
    {
      "@type": "Offer",
      name: "FlowCrew Pro",
      price: "19",
      priceCurrency: "EUR",
      description: "Ongoing client intake and lead organization.",
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <HomeLanding />
    </>
  );
}