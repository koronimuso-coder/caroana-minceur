import "./load-env";
import * as fs from "fs";
import * as path from "path";
import { adminDb } from "../src/lib/firebase/admin";

const COLLECTIONS_TO_BACKUP = [
  "users",
  "products",
  "productVariants",
  "orders",
  "orderEvents",
  "payments",
  "inventoryMovements",
  "coupons",
  "shippingZones",
  "auditLogs"
];

async function runBackup() {
  console.log("⏳ Starting Firestore Database Backup...");
  const backupData: Record<string, any[]> = {};
  const summary: Record<string, number> = {};

  try {
    for (const colName of COLLECTIONS_TO_BACKUP) {
      console.log(`fetching collection "${colName}"...`);
      const snapshot = await adminDb.collection(colName).get();
      
      const docs = snapshot.docs.map((doc) => {
        const data = doc.data();
        
        // Convert Firestore Timestamps to ISO strings for JSON compatibility
        const parsedData = { ...data };
        for (const key in parsedData) {
          const value = parsedData[key];
          if (value && typeof value === "object" && "toDate" in value) {
            parsedData[key] = (value as any).toDate().toISOString();
          }
        }
        
        return {
          id: doc.id,
          ...parsedData
        };
      });

      backupData[colName] = docs;
      summary[colName] = docs.length;
    }

    // Create backups directory if it doesn't exist
    const backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Format timestamp
    const date = new Date();
    const timestamp = date.toISOString().replace(/[:.]/g, "-");
    const backupFileName = `backup_${timestamp}.json`;
    const backupFilePath = path.join(backupDir, backupFileName);

    const payload = {
      metadata: {
        timestamp: date.toISOString(),
        version: "1.0",
        summary
      },
      data: backupData
    };

    fs.writeFileSync(backupFilePath, JSON.stringify(payload, null, 2), "utf-8");
    console.log(`\n🎉 Backup successfully created!`);
    console.log(`📁 File saved at: ${backupFilePath}`);
    console.log("📊 Summary of backed up documents:");
    console.table(summary);

    // Log security audit log for backup event
    const auditRef = adminDb.collection("auditLogs").doc();
    await auditRef.set({
      id: auditRef.id,
      action: "database_backup",
      description: `Database backup triggered. Exported: ${JSON.stringify(summary)}`,
      actorId: "system_cli",
      actorRole: "system",
      ipAddress: "127.0.0.1",
      targetId: backupFileName,
      createdAt: new Date()
    });

    process.exit(0);
  } catch (err: any) {
    console.error("❌ Backup failed:", err.message || err);
    process.exit(1);
  }
}

runBackup();
