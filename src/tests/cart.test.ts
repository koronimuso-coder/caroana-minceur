import { describe, it, expect, vi } from "vitest";
import { CartService } from "@/server/services/cart.service";

// Mock data tables
const mockProducts: Record<string, any> = {
  "gelules-ventre-plat": {
    name: "Gélules Ventre Plat",
    sku: "CM-GVP-01",
    price: 15000,
    status: "published",
    images: [{ url: "image-gvp.jpg" }],
    trackInventory: true,
    stock: 50,
  },
  "the-detox": {
    name: "Thé Détox",
    sku: "CM-TD-01",
    price: 8000,
    status: "published",
    images: [{ url: "image-td.jpg" }],
    trackInventory: true,
    stock: 10,
  },
  "draft-product": {
    name: "Draft Product",
    sku: "CM-DP-01",
    price: null,
    status: "draft",
    images: [],
    trackInventory: false,
    stock: 0,
  }
};

const mockVariants: Record<string, any> = {
  "variant-1": {
    productId: "gelules-ventre-plat",
    name: "Lot de 2",
    sku: "CM-GVP-01-L2",
    price: 28000,
    trackInventory: true,
    stock: 20,
  }
};

const mockCoupons: Record<string, any> = {
  "WELCOME10": {
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minSubtotal: 10000,
    maxDiscount: 5000,
    status: "active",
    expiresAt: null,
    usageCount: 0,
  },
  "FIXED5000": {
    code: "FIXED5000",
    type: "fixed",
    value: 5000,
    minSubtotal: 15000,
    status: "active",
    expiresAt: null,
    usageCount: 0,
  }
};

const mockShippingZones: Record<string, any> = {
  "abidjan-communes-int": {
    name: "Abidjan (Communes Intérieures)",
    tarif: 1500,
    freeShippingThreshold: 50000,
    status: "active",
  }
};

// Inject mock for Firebase Admin SDK
vi.mock("@/lib/firebase/admin", () => {
  return {
    adminDb: {
      collection: (colName: string) => {
        return {
          doc: (docId: string) => {
            return {
              get: async () => {
                let data = null;
                if (colName === "products") data = mockProducts[docId];
                if (colName === "productVariants") data = mockVariants[docId];
                if (colName === "shippingZones") data = mockShippingZones[docId];
                
                return {
                  exists: !!data,
                  id: docId,
                  data: () => data,
                };
              }
            };
          },
          where: (field: string, op: string, val: any) => {
            return {
              where: (f: string, o: string, v: any) => {
                return {
                  limit: (l: number) => {
                    return {
                      get: async () => {
                        const docs: any[] = [];
                        if (colName === "coupons") {
                          const coupon = mockCoupons[val];
                          if (coupon) {
                            docs.push({
                              exists: true,
                              id: coupon.code,
                              data: () => coupon,
                            });
                          }
                        }
                        return {
                          empty: docs.length === 0,
                          docs,
                        };
                      }
                    };
                  }
                };
              }
            };
          }
        };
      }
    }
  };
});

describe("CartService", () => {
  const cartService = new CartService();

  it("calculates subtotals and totals correctly for simple items", async () => {
    const result = await cartService.calculateCart({
      items: [
        { productId: "gelules-ventre-plat", quantity: 2 },
        { productId: "the-detox", quantity: 1 }
      ]
    });

    expect(result.subtotal).toBe(38000); // 15000 * 2 + 8000
    expect(result.discountTotal).toBe(0);
    expect(result.shippingTotal).toBe(0);
    expect(result.grandTotal).toBe(38000);
    expect(result.items.length).toBe(2);
    expect(result.items[0]?.name).toBe("Gélules Ventre Plat");
    expect(result.items[0]?.lineTotal).toBe(30000);
  });

  it("applies percentage discount coupon successfully", async () => {
    const result = await cartService.calculateCart({
      items: [
        { productId: "gelules-ventre-plat", quantity: 2 }
      ],
      couponCode: "WELCOME10"
    });

    expect(result.subtotal).toBe(30000);
    expect(result.discountTotal).toBe(3000); // 10% of 30000
    expect(result.grandTotal).toBe(27000);
    expect(result.appliedCoupon?.code).toBe("WELCOME10");
  });

  it("applies fixed discount coupon successfully", async () => {
    const result = await cartService.calculateCart({
      items: [
        { productId: "gelules-ventre-plat", quantity: 2 }
      ],
      couponCode: "FIXED5000"
    });

    expect(result.subtotal).toBe(30000);
    expect(result.discountTotal).toBe(5000);
    expect(result.grandTotal).toBe(25000);
  });

  it("applies shipping tariff and triggers free shipping threshold", async () => {
    // 1. Without free shipping threshold (subtotal = 15000)
    const resultWithShipping = await cartService.calculateCart({
      items: [
        { productId: "gelules-ventre-plat", quantity: 1 }
      ],
      shippingZoneId: "abidjan-communes-int"
    });
    expect(resultWithShipping.shippingTotal).toBe(1500);
    expect(resultWithShipping.grandTotal).toBe(16500);

    // 2. With free shipping threshold (subtotal = 60000 > 50000 free shipping limit)
    const resultFreeShipping = await cartService.calculateCart({
      items: [
        { productId: "gelules-ventre-plat", quantity: 4 }
      ],
      shippingZoneId: "abidjan-communes-int"
    });
    expect(resultFreeShipping.shippingTotal).toBe(0);
    expect(resultFreeShipping.grandTotal).toBe(60000);
  });

  it("blocks purchasing draft products", async () => {
    await expect(
      cartService.calculateCart({
        items: [{ productId: "draft-product", quantity: 1 }]
      })
    ).rejects.toThrow("n'est plus en vente");
  });

  it("blocks purchasing when stock is insufficient", async () => {
    await expect(
      cartService.calculateCart({
        items: [{ productId: "the-detox", quantity: 15 }] // stock is 10
      })
    ).rejects.toThrow("Stock insuffisant");
  });
});
