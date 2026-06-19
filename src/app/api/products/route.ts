import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { Product } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const status = searchParams.get("status") || "published"; // default to published
    const featured = searchParams.get("featured");

    let query: FirebaseFirestore.Query = adminDb.collection("products");

    if (status) {
      query = query.where("status", "==", status);
    }
    if (categoryId) {
      query = query.where("categoryId", "==", categoryId);
    }
    if (featured === "true") {
      query = query.where("featured", "==", true);
    }

    const snapshot = await query.get();
    const products: Product[] = [];

    for (const doc of snapshot.docs) {
      const p = { id: doc.id, ...doc.data() } as Product;
      
      // Fetch variants if they exist
      if (p.variants && p.variants.length > 0) {
        const variantsSnapshot = await adminDb
          .collection("productVariants")
          .where("productId", "==", p.id)
          .get();
        
        const variants = variantsSnapshot.docs.map((vDoc) => ({
          id: vDoc.id,
          ...vDoc.data(),
        }));
        
        (p as any).variantsData = variants;
      }
      
      products.push(p);
    }

    // Sort products by createdAt descending in memory
    products.sort((a, b) => {
      const aTime = a.createdAt && typeof a.createdAt === "object" && "seconds" in a.createdAt
        ? (a.createdAt as any).seconds * 1000
        : new Date(a.createdAt as any).getTime();
      const bTime = b.createdAt && typeof b.createdAt === "object" && "seconds" in b.createdAt
        ? (b.createdAt as any).seconds * 1000
        : new Date(b.createdAt as any).getTime();
      return bTime - aTime;
    });

    // Set Cache-Control for performance
    const response = NextResponse.json({ success: true, products });
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=30");
    return response;
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
