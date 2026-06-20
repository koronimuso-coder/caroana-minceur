"use server";

import { OrderRepository } from "@/server/repositories/order.repository";
import { adminDb } from "@/lib/firebase/admin";
import { Order } from "@/types";

export type TrackingResult = {
  success: boolean;
  order?: {
    orderNumber: string;
    customerName: string;
    createdAt: string;
    paymentMethod: string;
    paymentStatus: string;
    fulfillmentStatus: string;
    commune: string;
    items: Array<{ name: string; quantity: number }>;
    grandTotal: number;
    shippedAt?: string | null;
    deliveredAt?: string | null;
  } | null;
  error?: string;
};

export async function getTrackingOrder(searchQuery: string): Promise<TrackingResult> {
  const cleanQuery = searchQuery.trim();
  if (!cleanQuery) {
    return { success: false, error: "Veuillez entrer un numéro de commande ou de téléphone." };
  }

  const orderRepo = new OrderRepository();

  try {
    let order: Order | null = null;

    // Case 1: Searching by order number (starts with CM-)
    if (cleanQuery.toUpperCase().startsWith("CM-") || cleanQuery.toUpperCase().startsWith("CMD-")) {
      order = await orderRepo.getByNumber(cleanQuery.toUpperCase());
    } else {
      // Case 2: Searching by phone number
      // We will look up orders where `customerSnapshot.phone` contains or equals the query
      // Let's normalize phone numbers (remove spaces, etc.)
      const phoneClean = cleanQuery.replace(/\s+/g, "");
      
      const ordersCol = adminDb.collection("orders");
      // Search exact matches first
      let snapshot = await ordersCol
        .where("customerSnapshot.phone", "==", phoneClean)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();

      if (snapshot.empty) {
        // Try with leading/trailing spaces or other common formats (like adding country code)
        snapshot = await ordersCol
          .where("customerSnapshot.phone", "==", cleanQuery)
          .orderBy("createdAt", "desc")
          .limit(1)
          .get();
      }

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        if (doc) {
          order = { id: doc.id, ...doc.data() } as Order;
        }
      }
    }

    if (!order) {
      return { success: false, error: "Aucune commande correspondante n'a été trouvée. Veuillez vérifier vos informations." };
    }

    // Convert dates safely
    const formatFirebaseDate = (d: any) => {
      if (!d) return null;
      if (d.toDate) return d.toDate().toISOString();
      if (d.seconds) return new Date(d.seconds * 1000).toISOString();
      return new Date(d).toISOString();
    };

    return {
      success: true,
      order: {
        orderNumber: order.orderNumber,
        customerName: `${order.customerSnapshot.firstName} ${order.customerSnapshot.lastName.slice(0, 1)}.`,
        createdAt: formatFirebaseDate(order.createdAt) || new Date().toISOString(),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        commune: order.shippingAddressSnapshot.commune,
        items: order.items.map((it) => ({ name: it.name, quantity: it.quantity })),
        grandTotal: order.grandTotal,
        shippedAt: formatFirebaseDate(order.shippedAt),
        deliveredAt: formatFirebaseDate(order.deliveredAt),
      },
    };
  } catch (err: any) {
    console.error("Order tracking failed:", err);
    return { success: false, error: "Une erreur est survenue lors de la recherche." };
  }
}
