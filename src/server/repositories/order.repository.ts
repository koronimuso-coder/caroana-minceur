import { adminDb } from "@/lib/firebase/admin";
import { Order, OrderEvent } from "@/types";

export class OrderRepository {
  private ordersCol = adminDb.collection("orders");
  private eventsCol = adminDb.collection("orderEvents");
  private countersCol = adminDb.collection("counters");

  async getById(id: string): Promise<Order | null> {
    const doc = await this.ordersCol.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Order;
  }

  async getByNumber(orderNumber: string): Promise<Order | null> {
    const snapshot = await this.ordersCol.where("orderNumber", "==", orderNumber).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    if (!doc) return null;
    return { id: doc.id, ...doc.data() } as Order;
  }

  async getByUser(userId: string): Promise<Order[]> {
    const snapshot = await this.ordersCol
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
  }

  async getAll(): Promise<Order[]> {
    const snapshot = await this.ordersCol.orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
  }

  async getByStatus(paymentStatus?: string, fulfillmentStatus?: string): Promise<Order[]> {
    let query: FirebaseFirestore.Query = this.ordersCol;
    if (paymentStatus) {
      query = query.where("paymentStatus", "==", paymentStatus);
    }
    if (fulfillmentStatus) {
      query = query.where("fulfillmentStatus", "==", fulfillmentStatus);
    }
    const snapshot = await query.orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
  }

  async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const counterRef = this.countersCol.doc(`orders_${year}`);

    return adminDb.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      let nextSeq = 1;

      if (counterDoc.exists) {
        const data = counterDoc.data();
        nextSeq = (data?.sequence || 0) + 1;
      }

      transaction.set(counterRef, { sequence: nextSeq }, { merge: true });

      const paddedSeq = String(nextSeq).padStart(6, "0");
      return `CM-${year}-${paddedSeq}`;
    });
  }

  async create(order: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">): Promise<string> {
    const orderNumber = await this.generateOrderNumber();
    const docRef = this.ordersCol.doc();
    
    const orderData: Order = {
      id: docRef.id,
      orderNumber,
      ...order,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    await docRef.set(orderData);
    await this.logEvent(docRef.id, "status_changed", "Commande créée.", "system", "system");
    return docRef.id;
  }

  async updateStatus(
    id: string,
    updates: {
      paymentStatus?: Order["paymentStatus"];
      fulfillmentStatus?: Order["fulfillmentStatus"];
      customerNotes?: string;
      internalNotes?: string;
    },
    actorId: string,
    actorRole: string
  ): Promise<void> {
    const orderRef = this.ordersCol.doc(id);
    const doc = await orderRef.get();
    if (!doc.exists) throw new Error("Commande non trouvée.");
    const order = doc.data() as Order;

    const dataToUpdate: Record<string, any> = {
      updatedAt: new Date(),
    };

    const events: string[] = [];

    if (updates.paymentStatus && updates.paymentStatus !== order.paymentStatus) {
      dataToUpdate.paymentStatus = updates.paymentStatus;
      if (updates.paymentStatus === "paid") {
        dataToUpdate.paidAt = new Date();
      }
      events.push(`Statut de paiement modifié de ${order.paymentStatus} à ${updates.paymentStatus}.`);
    }

    if (updates.fulfillmentStatus && updates.fulfillmentStatus !== order.fulfillmentStatus) {
      dataToUpdate.fulfillmentStatus = updates.fulfillmentStatus;
      if (updates.fulfillmentStatus === "shipped") {
        dataToUpdate.shippedAt = new Date();
      } else if (updates.fulfillmentStatus === "delivered") {
        dataToUpdate.deliveredAt = new Date();
      }
      events.push(`Statut de livraison modifié de ${order.fulfillmentStatus} à ${updates.fulfillmentStatus}.`);
    }

    if (updates.customerNotes !== undefined) {
      dataToUpdate.customerNotes = updates.customerNotes;
    }
    if (updates.internalNotes !== undefined) {
      dataToUpdate.internalNotes = updates.internalNotes;
    }

    await orderRef.update(dataToUpdate);

    for (const desc of events) {
      await this.logEvent(id, "status_changed", desc, actorId, actorRole);
    }
  }

  async logEvent(
    orderId: string,
    type: OrderEvent["type"],
    description: string,
    actorId: string | null,
    actorRole: string | null
  ): Promise<void> {
    const eventRef = this.eventsCol.doc();
    const eventData: OrderEvent = {
      id: eventRef.id,
      orderId,
      type,
      description,
      actorId,
      actorRole,
      createdAt: new Date(),
    } as any;
    await eventRef.set(eventData);
  }

  async getEvents(orderId: string): Promise<OrderEvent[]> {
    const snapshot = await this.eventsCol
      .where("orderId", "==", orderId)
      .orderBy("createdAt", "asc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as OrderEvent));
  }
}
