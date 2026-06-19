import { adminDb } from "@/lib/firebase/admin";
import { Payment } from "@/types";

export interface CreatePaymentInput {
  orderId: string;
  amount: number;
  currency: "XOF";
  method: string; // "wave" | "orange" | "mtn" | "cash" etc.
  proofUrl?: string | null;
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
}

export interface CreatePaymentResult {
  paymentId: string;
  status: "pending" | "verification_required" | "paid" | "failed";
  redirectUrl?: string;
}

export interface VerifyPaymentInput {
  paymentId: string;
  providerTransactionId?: string;
  metadata?: Record<string, unknown>;
}

export interface VerifyPaymentResult {
  paymentId: string;
  status: "paid" | "failed" | "verification_required" | "pending" | "refunded";
}

export interface WebhookInput {
  body: unknown;
  signature: string;
}

export interface WebhookResult {
  processed: boolean;
  orderId?: string;
  status?: string;
}

export interface RefundPaymentInput {
  paymentId: string;
  amount: number;
  reason: string;
}

export interface RefundPaymentResult {
  success: boolean;
  refundedAmount: number;
}

export interface PaymentProvider {
  name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult>;
  handleWebhook(input: WebhookInput): Promise<WebhookResult>;
  refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult>;
}

// 1. CASH ON DELIVERY PROVIDER
export class CashOnDeliveryProvider implements PaymentProvider {
  name = "CashOnDeliveryProvider";

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const paymentRef = adminDb.collection("payments").doc();
    const payment: Payment = {
      id: paymentRef.id,
      orderId: input.orderId,
      provider: this.name,
      providerTransactionId: null,
      method: "cash",
      amount: input.amount,
      currency: "XOF",
      status: "pending",
      idempotencyKey: input.idempotencyKey,
      proofUrl: null,
      metadata: input.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await paymentRef.set(payment);
    return { paymentId: paymentRef.id, status: "pending" };
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    // Verified manually by delivery person / admin
    return { paymentId: input.paymentId, status: "pending" };
  }

  async handleWebhook(input: WebhookInput): Promise<WebhookResult> {
    return { processed: false };
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult> {
    return { success: true, refundedAmount: input.amount };
  }
}

// 2. MANUAL MOBILE MONEY PROVIDER (Wave, Orange, MTN)
export class ManualPaymentProvider implements PaymentProvider {
  name = "ManualPaymentProvider";

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const paymentRef = adminDb.collection("payments").doc();
    const payment: Payment = {
      id: paymentRef.id,
      orderId: input.orderId,
      provider: this.name,
      providerTransactionId: null,
      method: input.method,
      amount: input.amount,
      currency: "XOF",
      status: "verification_required", // Needs admin verification of receipt upload
      idempotencyKey: input.idempotencyKey,
      proofUrl: input.proofUrl || null,
      metadata: input.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await paymentRef.set(payment);
    return { paymentId: paymentRef.id, status: "verification_required" };
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    // Verified manually by admin in dashboard
    return { paymentId: input.paymentId, status: "verification_required" };
  }

  async handleWebhook(input: WebhookInput): Promise<WebhookResult> {
    return { processed: false };
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult> {
    return { success: true, refundedAmount: input.amount };
  }
}

// 3. WHATSAPP ORDER PROVIDER
export class WhatsAppOrderProvider implements PaymentProvider {
  name = "WhatsAppOrderProvider";

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const paymentRef = adminDb.collection("payments").doc();
    const payment: Payment = {
      id: paymentRef.id,
      orderId: input.orderId,
      provider: this.name,
      providerTransactionId: null,
      method: "whatsapp",
      amount: input.amount,
      currency: "XOF",
      status: "pending",
      idempotencyKey: input.idempotencyKey,
      proofUrl: null,
      metadata: input.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await paymentRef.set(payment);
    return { paymentId: paymentRef.id, status: "pending" };
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    return { paymentId: input.paymentId, status: "pending" };
  }

  async handleWebhook(input: WebhookInput): Promise<WebhookResult> {
    return { processed: false };
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult> {
    return { success: true, refundedAmount: input.amount };
  }
}

// 4. MOBILE MONEY PROVIDER (Sandbox Version)
export class MobileMoneyProvider implements PaymentProvider {
  name = "MobileMoneyProvider";

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const paymentRef = adminDb.collection("payments").doc();
    const payment: Payment = {
      id: paymentRef.id,
      orderId: input.orderId,
      provider: this.name,
      providerTransactionId: "sb_tx_" + Math.random().toString(36).substr(2, 9),
      method: input.method,
      amount: input.amount,
      currency: "XOF",
      status: "pending",
      idempotencyKey: input.idempotencyKey,
      proofUrl: null,
      metadata: input.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await paymentRef.set(payment);
    
    // Redirect to sandbox page to simulate payment gateway redirect
    const redirectUrl = `/api/payments/sandbox?paymentId=${paymentRef.id}&orderId=${input.orderId}`;
    return { paymentId: paymentRef.id, status: "pending", redirectUrl };
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    const paymentRef = adminDb.collection("payments").doc(input.paymentId);
    const paymentDoc = await paymentRef.get();
    if (!paymentDoc.exists) throw new Error("Payment not found");
    const payment = paymentDoc.data() as Payment;
    return { paymentId: input.paymentId, status: payment.status };
  }

  async handleWebhook(input: WebhookInput): Promise<WebhookResult> {
    // Process sandbox webhook callback
    return { processed: true };
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult> {
    return { success: true, refundedAmount: input.amount };
  }
}

// 5. CARD PAYMENT PROVIDER (Sandbox Version)
export class CardPaymentProvider implements PaymentProvider {
  name = "CardPaymentProvider";

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const paymentRef = adminDb.collection("payments").doc();
    const payment: Payment = {
      id: paymentRef.id,
      orderId: input.orderId,
      provider: this.name,
      providerTransactionId: "sb_card_" + Math.random().toString(36).substr(2, 9),
      method: "card",
      amount: input.amount,
      currency: "XOF",
      status: "pending",
      idempotencyKey: input.idempotencyKey,
      proofUrl: null,
      metadata: input.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await paymentRef.set(payment);
    
    const redirectUrl = `/api/payments/sandbox?paymentId=${paymentRef.id}&orderId=${input.orderId}`;
    return { paymentId: paymentRef.id, status: "pending", redirectUrl };
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    const paymentRef = adminDb.collection("payments").doc(input.paymentId);
    const paymentDoc = await paymentRef.get();
    if (!paymentDoc.exists) throw new Error("Payment not found");
    const payment = paymentDoc.data() as Payment;
    return { paymentId: input.paymentId, status: payment.status };
  }

  async handleWebhook(input: WebhookInput): Promise<WebhookResult> {
    return { processed: true };
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult> {
    return { success: true, refundedAmount: input.amount };
  }
}

// Payment Manager to dynamically resolve the active provider
export class PaymentService {
  static getProvider(name: string): PaymentProvider {
    switch (name) {
      case "CashOnDeliveryProvider":
        return new CashOnDeliveryProvider();
      case "ManualPaymentProvider":
        return new ManualPaymentProvider();
      case "WhatsAppOrderProvider":
        return new WhatsAppOrderProvider();
      case "MobileMoneyProvider":
        return new MobileMoneyProvider();
      case "CardPaymentProvider":
        return new CardPaymentProvider();
      default:
        throw new Error(`Fournisseur de paiement inconnu: ${name}`);
    }
  }
}
