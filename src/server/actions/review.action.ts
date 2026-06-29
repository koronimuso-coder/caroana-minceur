"use server";
import { adminDb } from "@/lib/firebase/admin";

export type ReviewInput = {
  productId: string;
  userId: string | null;
  name: string;
  rating: number;
  comment: string;
};

export async function getProductReviews(productId: string) {
  try {
    const snapshot = await adminDb
      .collection("reviews")
      .where("productId", "==", productId)
      .orderBy("createdAt", "desc")
      .get();

    const reviews = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        productId: data.productId,
        userId: data.userId || null,
        name: data.name,
        rating: data.rating,
        comment: data.comment,
        verified: data.verified || false,
        createdAt: data.createdAt && typeof data.createdAt === "object" && "seconds" in data.createdAt
          ? new Date((data.createdAt as any).seconds * 1000).toLocaleDateString("fr-FR")
          : new Date(data.createdAt as any).toLocaleDateString("fr-FR"),
      };
    });

    // Compute average rating
    const total = reviews.length;
    const avg = total > 0 ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)) : 5.0;

    return { success: true, reviews, averageRating: avg, totalReviews: total };
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return { success: false, error: error.message, reviews: [], averageRating: 5.0, totalReviews: 0 };
  }
}

export async function submitProductReview(input: ReviewInput) {
  try {
    if (input.rating < 1 || input.rating > 5) {
      return { success: false, error: "La note doit être comprise entre 1 et 5 étoiles." };
    }
    if (!input.comment.trim()) {
      return { success: false, error: "Le commentaire ne peut pas être vide." };
    }

    let verified = false;

    // Verify buyer if userId is provided
    if (input.userId) {
      const ordersSnapshot = await adminDb
        .collection("orders")
        .where("userId", "==", input.userId)
        .get();
      
      // Look if any order has this product
      for (const doc of ordersSnapshot.docs) {
        const orderData = doc.data();
        const items = orderData.items || [];
        const hasProduct = items.some((item: any) => item.productId === input.productId);
        if (hasProduct) {
          verified = true;
          break;
        }
      }
    }

    const reviewRef = adminDb.collection("reviews").doc();
    const reviewData = {
      id: reviewRef.id,
      productId: input.productId,
      userId: input.userId,
      name: input.name,
      rating: input.rating,
      comment: input.comment,
      verified,
      createdAt: new Date(),
    };

    await reviewRef.set(reviewData);

    return { success: true, reviewId: reviewRef.id };
  } catch (error: any) {
    console.error("Error submitting review:", error);
    return { success: false, error: error.message };
  }
}
