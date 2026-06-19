import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://caroana-minceur.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/compte/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
