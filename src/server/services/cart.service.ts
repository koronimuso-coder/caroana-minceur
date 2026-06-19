import { adminDb } from "@/lib/firebase/admin";
import { Product, ProductVariant, Coupon, ShippingZone } from "@/types";

export type CartItemInput = {
  productId: string;
  variantId?: string | null | undefined;
  quantity: number;
};

export type CartCalculationInput = {
  items: CartItemInput[];
  couponCode?: string | null | undefined;
  shippingZoneId?: string | null | undefined;
};

export type CartCalculationResult = {
  items: Array<{
    productId: string;
    variantId: string | null;
    quantity: number;
    sku: string;
    name: string;
    imageUrl: string;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  grandTotal: number;
  currency: "XOF";
  appliedCoupon: {
    code: string;
    type: "fixed" | "percentage";
    value: number;
  } | null;
};

export class CartService {
  async calculateCart(input: CartCalculationInput): Promise<CartCalculationResult> {
    const calculatedItems: CartCalculationResult["items"] = [];
    let subtotal = 0;

    // 1. Process items
    for (const item of input.items) {
      if (item.quantity <= 0) continue;

      const productDoc = await adminDb.collection("products").doc(item.productId).get();
      if (!productDoc.exists) {
        throw new Error(`Le produit avec l'ID ${item.productId} n'existe pas.`);
      }
      const product = { id: productDoc.id, ...productDoc.data() } as Product;

      if (product.status !== "published") {
        throw new Error(`Le produit "${product.name}" n'est plus en vente.`);
      }

      let unitPrice = 0;
      let sku = product.sku;
      let name = product.name;
      const imageUrl = product.images[0]?.url || "";

      if (item.variantId) {
        const variantDoc = await adminDb.collection("productVariants").doc(item.variantId).get();
        if (!variantDoc.exists) {
          throw new Error(`La variante de produit n'existe pas.`);
        }
        const variant = { id: variantDoc.id, ...variantDoc.data() } as ProductVariant;
        unitPrice = variant.price;
        sku = variant.sku;
        name = `${product.name} - ${variant.name}`;

        // Verify stock
        if (variant.trackInventory && variant.stock < item.quantity) {
          throw new Error(`Stock insuffisant pour la variante "${name}".`);
        }
      } else {
        if (product.price === null) {
          throw new Error(`Le prix du produit "${product.name}" n'est pas configuré.`);
        }
        unitPrice = product.price;

        // Verify stock
        if (product.trackInventory && product.stock < item.quantity) {
          throw new Error(`Stock insuffisant pour le produit "${name}".`);
        }
      }

      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      calculatedItems.push({
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity,
        sku,
        name,
        imageUrl,
        unitPrice,
        lineTotal,
      });
    }

    // 2. Process Coupon Code
    let discountTotal = 0;
    let appliedCoupon: CartCalculationResult["appliedCoupon"] = null;

    if (input.couponCode) {
      const couponSnapshot = await adminDb
        .collection("coupons")
        .where("code", "==", input.couponCode.trim().toUpperCase())
        .where("status", "==", "active")
        .limit(1)
        .get();

      if (!couponSnapshot.empty) {
        const couponDoc = couponSnapshot.docs[0];
        if (couponDoc) {
          const coupon = { id: couponDoc.id, ...couponDoc.data() } as Coupon;
                    
          // Verify expiration
          let expired = false;
          if (coupon.expiresAt) {
            const exp = coupon.expiresAt as any;
            const expireDate = typeof exp.toDate === "function" ? exp.toDate() : new Date(exp);
            if (expireDate.getTime() < Date.now()) {
              expired = true;
            }
          }

          const hasCapacity = coupon.maxUsage ? coupon.usageCount < coupon.maxUsage : true;

          if (!expired && hasCapacity && subtotal >= coupon.minSubtotal) {
            if (coupon.type === "percentage") {
              discountTotal = Math.round(subtotal * (coupon.value / 100));
              if (coupon.maxDiscount && discountTotal > coupon.maxDiscount) {
                discountTotal = coupon.maxDiscount;
              }
            } else {
              discountTotal = coupon.value;
            }
            // Cap discount to subtotal
            discountTotal = Math.min(discountTotal, subtotal);
            
            appliedCoupon = {
              code: coupon.code,
              type: coupon.type,
              value: coupon.value,
            };
          }
        }
      }
    }

    // 3. Process Shipping Zone
    let shippingTotal = 0;
    if (input.shippingZoneId) {
      const zoneDoc = await adminDb.collection("shippingZones").doc(input.shippingZoneId).get();
      if (zoneDoc.exists) {
        const zone = { id: zoneDoc.id, ...zoneDoc.data() } as ShippingZone;
        if (zone.status === "active") {
          shippingTotal = zone.tarif;
          // Apply free shipping threshold
          if (zone.freeShippingThreshold !== null && (subtotal - discountTotal) >= zone.freeShippingThreshold) {
            shippingTotal = 0;
          }
        }
      }
    }

    // 4. Process Taxes (standard 18% VAT if applicable, here we set 0% as base for wellness food products)
    const taxTotal = 0; 

    // 5. Final Grand Total
    const grandTotal = Math.max(0, subtotal - discountTotal + shippingTotal + taxTotal);

    return {
      items: calculatedItems,
      subtotal,
      discountTotal,
      shippingTotal,
      taxTotal,
      grandTotal,
      currency: "XOF",
      appliedCoupon,
    };
  }
}
