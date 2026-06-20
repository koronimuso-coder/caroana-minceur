import "./load-env";
import { adminDb } from "../src/lib/firebase/admin";

import { MOCK_PRODUCTS } from "../src/server/mockDb";

const PRODUCTS = MOCK_PRODUCTS;

const SHIPPING_ZONES = [
  {
    id: "abidjan-communes-int",
    country: "Côte d'Ivoire",
    city: "Abidjan",
    commune: "Cocody",
    district: "Lagunes",
    neighborhood: "All",
    tarif: 1500,
    minimumOrder: 0,
    freeShippingThreshold: 50000, // XOF
    deliveryDelay: "1-2 jours",
    status: "active" as const,
    deliveryMethod: "standard" as const
  },
  {
    id: "abidjan-communes-ext",
    country: "Côte d'Ivoire",
    city: "Abidjan",
    commune: "Yopougon",
    district: "Lagunes",
    neighborhood: "All",
    tarif: 2500,
    minimumOrder: 0,
    freeShippingThreshold: 50000, // XOF
    deliveryDelay: "1-2 jours",
    status: "active" as const,
    deliveryMethod: "standard" as const
  },
  {
    id: "interieur-ci",
    country: "Côte d'Ivoire",
    city: "All",
    commune: "All",
    district: "All",
    neighborhood: "All",
    tarif: 4000,
    minimumOrder: 0,
    freeShippingThreshold: 75000, // XOF
    deliveryDelay: "2-4 jours",
    status: "active" as const,
    deliveryMethod: "standard" as const
  }
];

const COUPONS = [
  {
    id: "welcome10",
    code: "WELCOME10",
    type: "percentage" as const,
    value: 10,
    minSubtotal: 10000, // XOF
    maxDiscount: 5000,
    status: "active" as const,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    usageCount: 0,
    maxUsage: 1000
  }
];

async function seed() {
  console.log("🌱 Starting seed script for CAROANA MINCEUR...");

  // Seed Products
  for (const product of PRODUCTS) {
    const productRef = adminDb.collection("products").doc(product.id);
    const doc = await productRef.get();
    if (!doc.exists) {
      await productRef.set({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ Seeded Product: ${product.name}`);
    } else {
      console.log(`ℹ️ Product ${product.name} already exists. Skipping.`);
    }
  }

  // Seed Shipping Zones
  for (const zone of SHIPPING_ZONES) {
    const zoneRef = adminDb.collection("shippingZones").doc(zone.id);
    const doc = await zoneRef.get();
    if (!doc.exists) {
      await zoneRef.set({
        ...zone,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ Seeded Shipping Zone: ${zone.commune}`);
    } else {
      console.log(`ℹ️ Shipping Zone ${zone.commune} already exists. Skipping.`);
    }
  }

  // Seed Coupons
  for (const coupon of COUPONS) {
    const couponRef = adminDb.collection("coupons").doc(coupon.id);
    const doc = await couponRef.get();
    if (!doc.exists) {
      await couponRef.set({
        ...coupon,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ Seeded Coupon: ${coupon.code}`);
    } else {
      console.log(`ℹ️ Coupon ${coupon.code} already exists. Skipping.`);
    }
  }

  console.log("🎉 Seeding completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
