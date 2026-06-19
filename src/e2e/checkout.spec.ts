import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// 1. Load env variables manually for Firebase Admin context in E2E tests
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2]?.trim() || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      if (key) {
        process.env[key] = value;
      }
    }
  }
}

import { adminDb } from "../lib/firebase/admin";

test.beforeAll(async () => {
  // Create a published test product
  await adminDb.collection("products").doc("e2e-test-product").set({
    id: "e2e-test-product",
    name: "Produit Test E2E",
    slug: "produit-test-e2e",
    sku: "TEST-E2E-01",
    shortDescription: "Description de test",
    description: "Description de test complete.",
    productType: "tea",
    status: "published",
    categoryId: "test",
    collectionIds: [],
    tags: [],
    images: [{ url: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800", alt: "Test Image", order: 0 }],
    price: 5000,
    compareAtPrice: null,
    costPrice: 2000,
    currency: "XOF",
    taxable: false,
    trackInventory: true,
    stock: 20,
    lowStockThreshold: 2,
    allowBackorder: false,
    variants: [],
    benefits: [],
    ingredients: [],
    usageInstructions: [],
    precautions: [],
    warnings: [],
    nutritionalInformation: null,
    weight: 0.1,
    dimensions: { length: null, width: null, height: null },
    seo: { title: "Test E2E", description: "Test E2E", keywords: [], canonicalUrl: null },
    featured: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "e2e-tester",
    updatedBy: "e2e-tester",
  });
  
  // Seed a shipping zone
  await adminDb.collection("shippingZones").doc("abidjan-communes-int").set({
    id: "abidjan-communes-int",
    country: "Côte d'Ivoire",
    city: "Abidjan",
    commune: "Cocody",
    district: "Lagunes",
    neighborhood: "All",
    tarif: 1500,
    minimumOrder: 0,
    freeShippingThreshold: 50000,
    deliveryDelay: "1-2 jours",
    status: "active",
    deliveryMethod: "standard",
  });
});

test.afterAll(async () => {
  // Clean up product
  await adminDb.collection("products").doc("e2e-test-product").delete();
  
  // Clean up shipping zone
  await adminDb.collection("shippingZones").doc("abidjan-communes-int").delete();
  
  // Clean up any test orders created
  const ordersSnapshot = await adminDb.collection("orders").where("customerSnapshot.email", "==", "e2e-customer@example.com").get();
  for (const doc of ordersSnapshot.docs) {
    // Delete orderEvents
    const eventsSnapshot = await adminDb.collection("orderEvents").where("orderId", "==", doc.id).get();
    for (const eventDoc of eventsSnapshot.docs) {
      await eventDoc.ref.delete();
    }
    // Delete payments
    const paymentsSnapshot = await adminDb.collection("payments").where("orderId", "==", doc.id).get();
    for (const payDoc of paymentsSnapshot.docs) {
      await payDoc.ref.delete();
    }
    // Delete order
    await doc.ref.delete();
  }
});

test("Customer can search, add to cart, fill checkout and complete sandbox payment", async ({ page }) => {
  // 1. Visit boutique and verify test product is listed
  await page.goto("/boutique");
  await page.waitForLoadState("networkidle");
  await expect(page.locator("text=Produit Test E2E")).toBeVisible();

  // 2. Click on the product to go to details
  await page.click("text=Produit Test E2E");
  await page.waitForURL("**/produit/produit-test-e2e");
  await expect(page.locator("h1")).toContainText("Produit Test E2E");

  // 3. Add to cart
  await page.click("button:has-text('Ajouter au panier')");
  
  // 4. Navigate to cart page
  await page.goto("/panier");
  await expect(page.locator("text=Produit Test E2E")).toBeVisible();
  
  // Verify price subtotal is 5 000 F CFA
  await expect(page.locator("text=5 000")).toBeVisible();

  // 5. Click checkout button
  await page.click("a:has-text('Commander')");
  await page.waitForURL("**/paiement");

  // 6. Fill Checkout Form
  await page.fill('input[name="firstName"]', "Jean");
  await page.fill('input[name="lastName"]', "Koffi");
  await page.fill('input[name="email"]', "e2e-customer@example.com");
  await page.fill('input[name="phone"]', "2250707070707");
  await page.fill('input[name="addressLine"]', "Rue des Jardins");
  await page.fill('input[name="neighborhood"]', "Angré");
  await page.fill('input[name="district"]', "Cocody");
  await page.fill('input[name="city"]', "Abidjan");
  
  // Select shipping zone (Wait for loading if dynamic)
  await page.selectOption('select[name="shippingZoneId"]', "abidjan-communes-int");
  
  // Choose Mobile Money payment (Sandbox automated)
  await page.click('input[value="MobileMoneyProvider"]');

  // Submit order
  await page.click("button:has-text('Confirmer la commande')");

  // 7. Should redirect to sandbox payment screen
  await page.waitForURL("**/paiement/sandbox?*");
  await expect(page.locator("text=Simulateur de Paiement")).toBeVisible();

  // Click Simuler succès de paiement
  await page.click("button:has-text('Simuler un Paiement Réussi')");

  // 8. Should redirect to order confirmation
  await page.waitForURL("**/commande/confirmation/*");
  await expect(page.locator("text=Merci pour votre commande")).toBeVisible();
  await expect(page.locator("text=TEST-E2E-01")).toBeVisible();
});
