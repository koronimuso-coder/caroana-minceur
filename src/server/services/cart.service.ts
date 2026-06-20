import { adminDb } from "@/lib/firebase/admin";
import { Product, ProductVariant, Coupon, ShippingZone } from "@/types";

const LOCAL_PRODUCTS: Record<string, { price: number; name: string; sku: string; stock: number }> = {
  "gelules-ventre-plat": { price: 10000, name: "Gélules Ventre Plat", sku: "GVP-01", stock: 100 },
  "p1": { price: 10000, name: "Gélules Ventre Plat", sku: "GVP-01", stock: 100 },
  "gelules-kaylie": { price: 25000, name: "Gélules Minceur Kaylie", sku: "GK-01", stock: 50 },
  "p-kaylie": { price: 25000, name: "Gélules Minceur Kaylie", sku: "GK-01", stock: 50 },
  "gelules-skinny": { price: 15000, name: "Gélules Minceur Skinny", sku: "GS-01", stock: 80 },
  "p-skinny": { price: 15000, name: "Gélules Minceur Skinny", sku: "GS-01", stock: 80 },
  "the-detox": { price: 5000, name: "Thé Détox", sku: "TD-01", stock: 100 },
  "p2": { price: 5000, name: "Thé Détox", sku: "TD-01", stock: 100 },
  "tisane-ventre-plat": { price: 5000, name: "Tisane Ventre Plat", sku: "TVP-01", stock: 100 },
  "p3": { price: 5000, name: "Tisane Ventre Plat", sku: "TVP-01", stock: 100 },
  "tisane-minceur": { price: 8000, name: "Tisane Minceur", sku: "TM-01", stock: 100 },
  "p-tisane-m": { price: 8000, name: "Tisane Minceur", sku: "TM-01", stock: 100 },
  "produit-minceur": { price: 8000, name: "Produit Minceur", sku: "PM-01", stock: 60 },
  "p-produit-m": { price: 8000, name: "Produit Minceur", sku: "PM-01", stock: 60 },
  "p-gelules-nourrice": { price: 10000, name: "Gélules Ventre Plat Nourrice", sku: "GVPN-01", stock: 100 },
  "gelules-ventre-plat-nourrice": { price: 10000, name: "Gélules Ventre Plat Nourrice", sku: "GVPN-01", stock: 100 },
  "p-caolin-nourrice": { price: 5000, name: "Caolin Ventre Plat Nourrice", sku: "CVPN-01", stock: 100 },
  "caolin-ventre-plat-nourrice": { price: 5000, name: "Caolin Ventre Plat Nourrice", sku: "CVPN-01", stock: 100 },
  "p-tisane-nourrice": { price: 5000, name: "Tisane Ventre Plat Nourrice", sku: "TVPN-01", stock: 100 },
  "tisane-ventre-plat-nourrice": { price: 5000, name: "Tisane Ventre Plat Nourrice", sku: "TVPN-01", stock: 100 },
};

const LOCAL_PACKS: Record<string, { price: number; name: string; sku: string }> = {
  "pack-1": { price: 14000, name: "Pack Gélules Ventre Plat + Thé Détox", sku: "PK-01" },
  "pack-2": { price: 14000, name: "Pack Gélules Ventre Plat + Tisane Ventre Plat", sku: "PK-02" },
  "pack-3": { price: 10000, name: "Pack Thé Détox + Tisane Ventre Plat", sku: "PK-03" },
  "pack-4": { price: 19000, name: "Pack Complet 3 Produits", sku: "PK-04" },
  "pack-5": { price: 30000, name: "Pack Gélules Kaylie + Thé Détox", sku: "PK-05" },
  "pack-6": { price: 33000, name: "Pack Gélules Kaylie + Tisane Minceur", sku: "PK-06" },
  "pack-7": { price: 20000, name: "Pack Gélules Skinny + Thé Détox", sku: "PK-07" },
  "pack-8": { price: 23000, name: "Pack Gélules Skinny + Tisane Minceur", sku: "PK-08" },
  "pack-nourrice-1": { price: 14000, name: "Pack Gélules Nourrice + Caolin Nourrice", sku: "PKN-01" },
  "pack-nourrice-2": { price: 14000, name: "Pack Gélules Nourrice + Tisane Nourrice", sku: "PKN-02" },
  "pack-nourrice-3": { price: 10000, name: "Pack Caolin Nourrice + Tisane Nourrice", sku: "PKN-03" },
  "pack-nourrice-4": { price: 20000, name: "Pack Complet 3 Produits Nourrice", sku: "PKN-04" },
  "pack-nourrice-kit": { price: 15000, name: "Kit Ventre Plat Nourrice (Promo)", sku: "PKN-KIT" },
};

const LOCAL_SHIPPING_ZONES: Record<string, number> = {
  "zone-abidjan-std": 1000,
  "zone-abidjan-exp": 1500,
  "zone-civ-interieur": 2500,
};

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

    let useLocalFallback = false;
    try {
      // Test firestore connection
      await adminDb.collection("products").limit(1).get();
    } catch (e) {
      console.warn("Firestore connection failed, using local fallback data");
      useLocalFallback = true;
    }

    // 1. Process items
    for (const item of input.items) {
      if (item.quantity <= 0) continue;

      let unitPrice = 0;
      let sku = "";
      let name = "";
      let imageUrl = "https://images.unsplash.com/photo-1611070973770-b1a672610042?q=80&w=600&auto=format&fit=crop";

      if (useLocalFallback) {
        const localProduct = LOCAL_PRODUCTS[item.productId] || LOCAL_PACKS[item.productId];
        if (!localProduct) {
          throw new Error(`Le produit avec l'ID ${item.productId} n'existe pas.`);
        }
        unitPrice = localProduct.price;
        sku = localProduct.sku;
        name = localProduct.name;
      } else {
        const productDoc = await adminDb.collection("products").doc(item.productId).get();
        if (!productDoc.exists) {
          throw new Error(`Le produit avec l'ID ${item.productId} n'existe pas.`);
        }
        const product = { id: productDoc.id, ...productDoc.data() } as Product;

        if (product.status !== "published") {
          throw new Error(`Le produit "${product.name}" n'est plus en vente.`);
        }

        sku = product.sku;
        name = product.name;
        imageUrl = product.images[0]?.url || "";

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
      if (useLocalFallback) {
        if (input.couponCode.trim().toUpperCase() === "CAROANA10") {
          discountTotal = Math.round(subtotal * 0.1);
          appliedCoupon = { code: "CAROANA10", type: "percentage", value: 10 };
        }
      } else {
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
    }

    // 3. Process Shipping Zone
    let shippingTotal = 0;
    if (input.shippingZoneId) {
      if (useLocalFallback) {
        shippingTotal = LOCAL_SHIPPING_ZONES[input.shippingZoneId] || 1500;
      } else {
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
    }

    // 4. Process Taxes (standard 0%)
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
