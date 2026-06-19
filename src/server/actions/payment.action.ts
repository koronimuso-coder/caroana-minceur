"use server";

import { adminDb } from "@/lib/firebase/admin";
import { OrderRepository } from "@/server/repositories/order.repository";
import { Payment } from "@/types";

export async function simulateSandboxPayment(paymentId: string, success: boolean) {
  const paymentRef = adminDb.collection("payments").doc(paymentId);
  const paymentSnapshot = await paymentRef.get();
  
  if (!paymentSnapshot.exists) {
    throw new Error("Paiement introuvable.");
  }
  
  const payment = paymentSnapshot.data() as Payment;
  const orderRepo = new OrderRepository();

  if (success) {
    // 1. Update Payment status
    await paymentRef.update({
      status: "paid",
      providerTransactionId: "sb_confirmed_" + Math.random().toString(36).substr(2, 9),
      updatedAt: new Date(),
    });

    // 2. Update Order status
    await orderRepo.updateStatus(
      payment.orderId,
      { paymentStatus: "paid" },
      "system",
      "system"
    );

    // 3. Log event
    await orderRepo.logEvent(
      payment.orderId,
      "payment_received",
      `Paiement simulé réussi (${payment.provider}).`,
      "system",
      "system"
    );
  } else {
    // 1. Update Payment status
    await paymentRef.update({
      status: "failed",
      updatedAt: new Date(),
    });

    // 2. Update Order status
    await orderRepo.updateStatus(
      payment.orderId,
      { paymentStatus: "failed" },
      "system",
      "system"
    );

    // 3. Log event
    await orderRepo.logEvent(
      payment.orderId,
      "status_changed",
      `Paiement simulé échoué (${payment.provider}).`,
      "system",
      "system"
    );
  }

  return { success: true };
}
