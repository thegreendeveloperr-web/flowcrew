import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/pricing", "/trial", "/chat", "/privacy", "/terms"],
      disallow: [
        "/api/",
        "/auth/",
        "/dashboard",
        "/leads",
        "/import",
        "/integrations",
        "/login",
      ],
    },
    sitemap: "https://flowcrew.vercel.app/sitemap.xml",
    host: "https://flowcrew.vercel.app",
  };
}
