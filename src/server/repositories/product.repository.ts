import { adminDb, FieldValue, isFirebaseConfigured } from "@/lib/firebase/admin";
import { Product, ProductVariant } from "@/types";
import { MOCK_PRODUCTS } from "../mockDb";

export class ProductRepository {
  private productsCol = adminDb.collection("products");
  private variantsCol = adminDb.collection("productVariants");

  async getById(id: string): Promise<Product | null> {
    if (!isFirebaseConfigured()) {
      return MOCK_PRODUCTS.find((p) => p.id === id) || null;
    }
    const doc = await this.productsCol.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Product;
  }

  async getBySlug(slug: string): Promise<Product | null> {
    if (!isFirebaseConfigured()) {
      return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
    }
    const snapshot = await this.productsCol.where("slug", "==", slug).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    if (!doc) return null;
    return { id: doc.id, ...doc.data() } as Product;
  }

  async getAll(status?: "draft" | "published" | "archived"): Promise<Product[]> {
    if (!isFirebaseConfigured()) {
      const list = MOCK_PRODUCTS.filter((p) => !status || p.status === status);
      return [...list].sort((a, b) => {
        const aTime = new Date(a.createdAt as any).getTime();
        const bTime = new Date(b.createdAt as any).getTime();
        return bTime - aTime;
      });
    }
    let query: FirebaseFirestore.Query = this.productsCol;
    if (status) {
      query = query.where("status", "==", status);
    }
    const snapshot = await query.get();
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
    products.sort((a, b) => {
      const aTime = a.createdAt && typeof a.createdAt === "object" && "seconds" in a.createdAt
        ? (a.createdAt as any).seconds * 1000
        : new Date(a.createdAt as any).getTime();
      const bTime = b.createdAt && typeof b.createdAt === "object" && "seconds" in b.createdAt
        ? (b.createdAt as any).seconds * 1000
        : new Date(b.createdAt as any).getTime();
      return bTime - aTime;
    });
    return products;
  }

  async getByCategory(categoryId: string, status: "published" = "published"): Promise<Product[]> {
    if (!isFirebaseConfigured()) {
      const list = MOCK_PRODUCTS.filter((p) => p.categoryId === categoryId && p.status === status);
      return [...list].sort((a, b) => {
        const aTime = new Date(a.createdAt as any).getTime();
        const bTime = new Date(b.createdAt as any).getTime();
        return bTime - aTime;
      });
    }
    const snapshot = await this.productsCol
      .where("categoryId", "==", categoryId)
      .where("status", "==", status)
      .get();
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
    products.sort((a, b) => {
      const aTime = a.createdAt && typeof a.createdAt === "object" && "seconds" in a.createdAt
        ? (a.createdAt as any).seconds * 1000
        : new Date(a.createdAt as any).getTime();
      const bTime = b.createdAt && typeof b.createdAt === "object" && "seconds" in b.createdAt
        ? (b.createdAt as any).seconds * 1000
        : new Date(b.createdAt as any).getTime();
      return bTime - aTime;
    });
    return products;
  }

  async getFeatured(limit = 4): Promise<Product[]> {
    if (!isFirebaseConfigured()) {
      return MOCK_PRODUCTS.filter((p) => p.featured && p.status === "published").slice(0, limit);
    }
    const snapshot = await this.productsCol
      .where("featured", "==", true)
      .where("status", "==", "published")
      .limit(limit)
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
  }

  async create(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<string> {
    if (product.status === "published" && (product.price === null || product.price <= 0)) {
      throw new Error("Impossible de publier un produit sans prix configuré.");
    }
    const docRef = await this.productsCol.add({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  }

  async update(id: string, updates: Partial<Product>): Promise<void> {
    const current = await this.getById(id);
    if (!current) throw new Error("Produit non trouvé.");

    const finalStatus = updates.status || current.status;
    const finalPrice = updates.price !== undefined ? updates.price : current.price;

    if (finalStatus === "published" && (finalPrice === null || finalPrice <= 0)) {
      throw new Error("Impossible de publier un produit sans prix configuré.");
    }

    await this.productsCol.doc(id).update({
      ...updates,
      updatedAt: new Date(),
    });
  }

  async getVariants(productId: string): Promise<ProductVariant[]> {
    if (!isFirebaseConfigured()) {
      return [];
    }
    const snapshot = await this.variantsCol.where("productId", "==", productId).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ProductVariant));
  }

  async addVariant(variant: Omit<ProductVariant, "id">): Promise<string> {
    const docRef = await this.variantsCol.add(variant);
    await this.productsCol.doc(variant.productId).update({
      variants: FieldValue.arrayUnion(docRef.id) as any,
      updatedAt: new Date(),
    });
    return docRef.id;
  }
}
