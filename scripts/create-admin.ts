import "./load-env";
import { adminAuth, adminDb } from "../src/lib/firebase/admin";
import { UserRole } from "../src/lib/auth/permissions";

const VALID_ROLES: UserRole[] = [
  "customer",
  "support",
  "content_editor",
  "inventory_manager",
  "order_manager",
  "administrator",
  "super_admin"
];

// Permission lists matching src/lib/auth/permissions.ts
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  customer: ["read:profile", "write:profile", "read:orders", "create:reviews", "manage:wishlist"],
  support: ["read:profile", "read:orders", "write:order_notes", "read:customers", "read:products", "manage:reviews"],
  content_editor: ["read:profile", "read:products", "manage:cms", "manage:reviews"],
  inventory_manager: ["read:profile", "read:products", "manage:products", "manage:stocks"],
  order_manager: ["read:profile", "read:orders", "manage:orders", "write:order_notes", "write:shipping_status", "read:customers"],
  administrator: [
    "read:profile", "write:profile", "read:orders", "manage:orders", "write:order_notes", 
    "write:shipping_status", "create:reviews", "manage:reviews", "manage:wishlist", 
    "read:customers", "manage:customers", "read:products", "manage:products", 
    "manage:stocks", "manage:cms", "manage:settings"
  ],
  super_admin: [
    "read:profile", "write:profile", "read:orders", "manage:orders", "write:order_notes", 
    "write:shipping_status", "create:reviews", "manage:reviews", "manage:wishlist", 
    "read:customers", "manage:customers", "read:products", "manage:products", 
    "manage:stocks", "manage:cms", "manage:settings", "read:audit", "manage:admins"
  ]
};

async function createAdmin() {
  const args = process.argv.slice(2);
  const uid = args[0];
  const roleInput = args[1];

  if (!uid || !roleInput) {
    console.log("❌ Error: Missing arguments.");
    console.log("Usage: npx tsx scripts/create-admin.ts <UID> <ROLE>");
    console.log(`Available roles: ${VALID_ROLES.join(", ")}`);
    process.exit(1);
  }

  const role = roleInput.toLowerCase() as UserRole;
  if (!VALID_ROLES.includes(role)) {
    console.log(`❌ Error: Invalid role "${roleInput}".`);
    console.log(`Available roles: ${VALID_ROLES.join(", ")}`);
    process.exit(1);
  }

  console.log(`⏳ Setting claims and updating Firestore for UID: ${uid} with role: ${role}...`);

  try {
    // 1. Verify User exists in Firebase Auth
    const userRecord = await adminAuth.getUser(uid);
    console.log(`👤 User found: ${userRecord.email || "No email"}`);

    // 2. Set Custom User Claims
    await adminAuth.setCustomUserClaims(uid, { role });
    console.log("🔑 Custom User Claims updated successfully!");

    // 3. Update Firestore profile document
    const userDocRef = adminDb.collection("users").doc(uid);
    const userDoc = await userDocRef.get();
    
    const permissions = ROLE_PERMISSIONS[role] || [];
    const updates = {
      role,
      permissions,
      updatedAt: new Date()
    };

    if (userDoc.exists) {
      await userDocRef.update(updates);
      console.log("📄 Existing Firestore profile document updated.");
    } else {
      await userDocRef.set({
        id: uid,
        email: userRecord.email || "",
        firstName: "",
        lastName: "",
        phone: userRecord.phoneNumber || "",
        createdAt: new Date(),
        ...updates
      });
      console.log("📄 New Firestore profile document created.");
    }

    // 4. Log security audit log
    const auditRef = adminDb.collection("auditLogs").doc();
    await auditRef.set({
      id: auditRef.id,
      action: "role_assignment",
      description: `Role assigned: "${role}" to user ${userRecord.email || uid}`,
      actorId: "system_cli",
      actorRole: "system",
      ipAddress: "127.0.0.1",
      targetId: uid,
      createdAt: new Date()
    });

    console.log("🎉 User role assignment completed successfully!");
    process.exit(0);
  } catch (err: any) {
    console.error("❌ Failed to assign role:", err.message || err);
    process.exit(1);
  }
}

createAdmin();
