import "./load-env";
import { adminDb } from "../src/lib/firebase/admin";

const PRODUCTS = [
  {
    id: "gelules-ventre-plat",
    name: "Gélules Ventre Plat",
    slug: "gelules-ventre-plat",
    description: "Complément alimentaire naturel formulé à base de plantes locales sélectionnées pour accompagner votre confort digestif et soutenir une sensation de légèreté au quotidien.",
    price: null, // Set to null as requested; requires admin review to publish
    compareAtPrice: null,
    images: ["https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800"],
    status: "draft",
    featured: true,
    categoryId: "complements",
    stock: 50,
    trackInventory: true,
    allowBackorder: false,
    sku: "CM-GVP-01",
    weight: 0.1, // kg
    metadata: {
      ingredients: ["Plantes locales ivoiriennes", "Fibres naturelles"],
      dosage: "2 gélules par jour le matin avec un grand verre d'eau."
    }
  },
  {
    id: "the-detox",
    name: "Thé Détox",
    slug: "the-detox",
    description: "Une infusion rafraîchissante et purifiante, alliance subtile de plantes traditionnelles africaines pour purifier l'organisme en douceur.",
    price: null,
    compareAtPrice: null,
    images: ["https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800"],
    status: "draft",
    featured: true,
    categoryId: "infusions",
    stock: 100,
    trackInventory: true,
    allowBackorder: false,
    sku: "CM-TD-01",
    weight: 0.15,
    metadata: {
      ingredients: ["Kinkeliba", "Citronnelle", "Gingembre"],
      dosage: "1 sachet à infuser matin et soir après les repas."
    }
  },
  {
    id: "tisane-ventre-plat",
    name: "Tisane Ventre Plat",
    slug: "tisane-ventre-plat",
    description: "Infusion douce favorisant le bien-être digestif et contribuant à atténuer les sensations de ballonnements de manière naturelle.",
    price: null,
    compareAtPrice: null,
    images: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800"],
    status: "draft",
    featured: false,
    categoryId: "infusions",
    stock: 80,
    trackInventory: true,
    allowBackorder: false,
    sku: "CM-TVP-01",
    weight: 0.15,
    metadata: {
      ingredients: ["Feuilles de séné", "Menthe poivrée", "Plantes bien-être"],
      dosage: "1 tasse en infusion le soir au coucher."
    }
  }
];

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
