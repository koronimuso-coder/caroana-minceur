import type { MetadataRoute } from "next";
import { ProductRepository } from "@/server/repositories/product.repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://caroana-minceur.com";

  // Static routes
  const routes = ["", "/boutique", "/panier", "/connexion"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic products sitemap
  try {
    const productRepo = new ProductRepository();
    const products = await productRepo.getAll("published");
    const productEntries = products.map((prod) => ({
      url: `${baseUrl}/produit/${prod.slug}`,
      // Check if updatedAt exists and is a Firestore timestamp or Date
      lastModified: prod.updatedAt
        ? new Date(
            typeof prod.updatedAt === "object" && "toDate" in prod.updatedAt
              ? (prod.updatedAt as any).toDate()
              : prod.updatedAt
          )
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
    return [...routes, ...productEntries];
  } catch (err: any) {
    const errMsg = err?.message || "";
    if (errMsg.includes("credential") || errMsg.includes("private key") || errMsg.includes("PEM") || errMsg.includes("projectId")) {
      console.log("ℹ️ Sitemap: Using static routes fallback (Firebase credentials not configured).");
    } else {
      console.error("Failed to generate sitemap for products:", err);
    }
    return routes;
  }
}
