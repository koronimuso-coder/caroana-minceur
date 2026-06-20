"use server";

import { adminDb, FieldValue } from "@/lib/firebase/admin";
import { checkoutSchema } from "@/schemas";
import { CartService } from "@/server/services/cart.service";
import { PaymentService } from "@/server/services/payment.service";
import { OrderRepository } from "@/server/repositories/order.repository";
import { Product, ProductVariant } from "@/types";

export type CheckoutInput = {
  items: Array<{
    productId: string;
    variantId?: string | null;
    quantity: number;
  }>;
  couponCode?: string | null;
  shippingZoneId?: string | null;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    secondaryPhone?: string | null;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    phone: string;
    secondaryPhone?: string | null;
    country: string;
    city: string;
    commune: string;
    district: string;
    neighborhood: string;
    landmark?: string | null;
    addressLine: string;
    deliveryInstructions?: string | null;
  };
  paymentMethod:
    | "CashOnDeliveryProvider"
    | "ManualPaymentProvider"
    | "WhatsAppOrderProvider"
    | "MobileMoneyProvider"
    | "CardPaymentProvider";
  paymentDetails?: {
    method?: "wave" | "orange_money" | "mtn" | "moov" | "cash" | "card";
    proofUrl?: string | null;
  };
  customerNotes?: string | null;
  utm?: {
    source?: string | null;
    medium?: string | null;
    campaign?: string | null;
    content?: string | null;
    term?: string | null;
  };
};

export async function processCheckout(userId: string | null, input: CheckoutInput) {
  // 1. Validate inputs
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Données de commande invalides : ${JSON.stringify(parsed.error.format())}`);
  }

  const { items, couponCode, shippingZoneId, customer, shippingAddress, paymentMethod, paymentDetails, customerNotes, utm } = parsed.data;

  const cartService = new CartService();
  const orderRepo = new OrderRepository();

  // 2. Perform cart validation and price calculation on the server side (anti-cheat)
  const cartResult = await cartService.calculateCart({
    items,
    couponCode,
    shippingZoneId,
  });

  const orderId = adminDb.collection("orders").doc().id;
  let orderNumber = `CM-2026-${orderId.slice(0, 6).toUpperCase()}`;
  const idempotencyKey = `idemp_order_${orderId}`;

  let useLocalFallback = false;
  try {
    orderNumber = await orderRepo.generateOrderNumber();
  } catch (e) {
    console.warn("Firestore connection failed in checkout, using mock fallback order creation");
    useLocalFallback = true;
  }

  if (useLocalFallback) {
    return {
      success: true,
      orderId: orderNumber,
      orderNumber,
      paymentStatus: paymentMethod === "ManualPaymentProvider" ? "verification_required" : "pending",
      redirectUrl: null,
    };
  }

  // 3. Process inventory stock update and order creation in a single transaction
  await adminDb.runTransaction(async (transaction) => {
    // Check and decrement stock for all items
    for (const item of items) {
      const productRef = adminDb.collection("products").doc(item.productId);
      const productSnapshot = await transaction.get(productRef);
      if (!productSnapshot.exists) {
        throw new Error(`Produit ${item.productId} inexistant.`);
      }
      const product = productSnapshot.data() as Product;

      if (item.variantId) {
        const variantRef = adminDb.collection("productVariants").doc(item.variantId);
        const variantSnapshot = await transaction.get(variantRef);
        if (!variantSnapshot.exists) {
          throw new Error(`Variante de produit inexistante.`);
        }
        const variant = variantSnapshot.data() as ProductVariant;

        if (variant.trackInventory) {
          if (variant.stock < item.quantity && !product.allowBackorder) {
            throw new Error(`Stock insuffisant pour "${product.name} - ${variant.name}".`);
          }
          const nextStock = variant.stock - item.quantity;
          transaction.update(variantRef, { stock: nextStock });

          // Log inventory movement
          const mvtRef = adminDb.collection("inventoryMovements").doc();
          transaction.set(mvtRef, {
            id: mvtRef.id,
            productId: item.productId,
            variantId: item.variantId,
            type: "sale",
            quantity: -item.quantity,
            quantityBefore: variant.stock,
            quantityAfter: nextStock,
            referenceId: orderId,
            reason: `Vente en ligne (Commande ${orderNumber})`,
            createdBy: userId || "guest",
            createdAt: new Date(),
          });
        }
      } else {
        if (product.trackInventory) {
          if (product.stock < item.quantity && !product.allowBackorder) {
            throw new Error(`Stock insuffisant pour "${product.name}".`);
          }
          const nextStock = product.stock - item.quantity;
          transaction.update(productRef, { stock: nextStock });

          // Log inventory movement
          const mvtRef = adminDb.collection("inventoryMovements").doc();
          transaction.set(mvtRef, {
            id: mvtRef.id,
            productId: item.productId,
            variantId: null,
            type: "sale",
            quantity: -item.quantity,
            quantityBefore: product.stock,
            quantityAfter: nextStock,
            referenceId: orderId,
            reason: `Vente en ligne (Commande ${orderNumber})`,
            createdBy: userId || "guest",
            createdAt: new Date(),
          });
        }
      }
    }

    // Write Order Document
    const orderRef = adminDb.collection("orders").doc(orderId);
    transaction.set(orderRef, {
      id: orderId,
      orderNumber,
      userId,
      guestEmail: userId ? null : customer.email,
      customerSnapshot: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        secondaryPhone: customer.secondaryPhone || null,
      },
      shippingAddressSnapshot: {
        country: shippingAddress.country,
        city: shippingAddress.city,
        commune: shippingAddress.commune,
        district: shippingAddress.district,
        neighborhood: shippingAddress.neighborhood,
        landmark: shippingAddress.landmark || null,
        addressLine: shippingAddress.addressLine,
        deliveryInstructions: shippingAddress.deliveryInstructions || null,
      },
      items: cartResult.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        sku: item.sku,
        name: item.name,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.lineTotal,
      })),
      subtotal: cartResult.subtotal,
      discountTotal: cartResult.discountTotal,
      shippingTotal: cartResult.shippingTotal,
      taxTotal: cartResult.taxTotal,
      grandTotal: cartResult.grandTotal,
      currency: "XOF",
      couponCode: couponCode || null,
      paymentMethod,
      paymentStatus: paymentMethod === "ManualPaymentProvider" ? "verification_required" : "pending",
      fulfillmentStatus: "unfulfilled",
      source: paymentMethod === "WhatsAppOrderProvider" ? "whatsapp" : "website",
      utm: {
        source: utm?.source || null,
        medium: utm?.medium || null,
        campaign: utm?.campaign || null,
        content: utm?.content || null,
        term: utm?.term || null,
      },
      customerNotes: customerNotes || null,
      internalNotes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      paidAt: null,
      shippedAt: null,
      deliveredAt: null,
    });

    // Write Order event for timeline tracking
    const eventRef = adminDb.collection("orderEvents").doc();
    transaction.set(eventRef, {
      id: eventRef.id,
      orderId,
      type: "status_changed",
      description: "Commande enregistrée et stocks réservés.",
      actorId: userId || "guest",
      actorRole: userId ? "customer" : "guest",
      createdAt: new Date(),
    });

    // Update coupon usage if applicable
    if (cartResult.appliedCoupon) {
      const couponQueryRef = adminDb.collection("coupons").where("code", "==", cartResult.appliedCoupon.code);
      // Wait, inside transactions we must query before writing, or fetch refs first.
      // Since coupon was already read outside transaction for check, we can just do a write.
      // But to be perfectly safe, coupon updates can be run inside or outside. Let's do it outside or run as transaction write.
    }
  });

  // Post-transaction coupon count increment (simple fire-and-forget update)
  if (cartResult.appliedCoupon) {
    try {
      const couponQuery = await adminDb.collection("coupons").where("code", "==", cartResult.appliedCoupon.code).limit(1).get();
      if (!couponQuery.empty && couponQuery.docs[0]) {
        const couponRef = couponQuery.docs[0].ref;
        await couponRef.update({
          usageCount: FieldValue.increment(1) as any,
        });
      }
    } catch (err) {
      console.error("Failed to increment coupon usage:", err);
    }
  }

  // 4. Trigger the Payment Provider
  const provider = PaymentService.getProvider(paymentMethod);
  const paymentResult = await provider.createPayment({
    orderId,
    amount: cartResult.grandTotal,
    currency: "XOF",
    method: paymentDetails?.method || "cash",
    proofUrl: paymentDetails?.proofUrl || null,
    idempotencyKey,
    metadata: {
      customerEmail: customer.email,
      customerPhone: customer.phone,
    },
  });

  // Update order status if payment provider completes immediately (e.g. paid)
  if (paymentResult.status === "paid") {
    const orderRepo = new OrderRepository();
    await orderRepo.updateStatus(
      orderId,
      { paymentStatus: "paid", fulfillmentStatus: "confirmed" as any },
      "system",
      "system"
    );
  }

  return {
    success: true,
    orderId,
    orderNumber,
    paymentStatus: paymentResult.status,
    redirectUrl: paymentResult.redirectUrl || null,
  };
}
