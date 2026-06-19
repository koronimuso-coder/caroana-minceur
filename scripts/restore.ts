import "./load-env";
import * as fs from "fs";
import * as path from "path";
import { adminDb } from "../src/lib/firebase/admin";

async function restoreBackup() {
  const args = process.argv.slice(2);
  const backupFile = args[0];

  if (!backupFile) {
    console.error("❌ Error: Missing backup file argument.");
    console.error("Usage: npx tsx scripts/restore.ts <path_to_backup_file>");
    process.exit(1);
  }

  const filePath = path.resolve(backupFile);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: Backup file not found at: ${filePath}`);
    process.exit(1);
  }

  console.log(`⏳ Reading backup file: ${filePath}...`);
  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    const backup = JSON.parse(rawData);

    const data = backup.data;
    if (!data) {
      console.error("❌ Error: Invalid backup format. Missing 'data' object.");
      process.exit(1);
    }

    const collections = Object.keys(data);
    for (const colName of collections) {
      console.log(`⏳ Restoring collection: "${colName}"...`);
      const docs = data[colName] || [];

      for (const doc of docs) {
        const { id, ...docData } = doc;
        
        // Reconvert ISO date strings back into Date objects for Firestore compatibility
        const parsedData = { ...docData };
        for (const key in parsedData) {
          const value = parsedData[key];
          if (value && typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
            parsedData[key] = new Date(value);
          }
        }

        await adminDb.collection(colName).doc(id).set(parsedData, { merge: true });
      }
      console.log(`✅ Restored ${docs.length} documents into "${colName}".`);
    }

    // Log security audit log for restore event
    const auditRef = adminDb.collection("auditLogs").doc();
    await auditRef.set({
      id: auditRef.id,
      action: "database_restore",
      description: `Database restore triggered using: ${backupFile}`,
      actorId: "system_cli",
      actorRole: "system",
      ipAddress: "127.0.0.1",
      targetId: backupFile,
      createdAt: new Date()
    });

    console.log("\n🎉 Database restoration completed successfully!");
    process.exit(0);
  } catch (err: any) {
    console.error("❌ Restoration failed:", err.message || err);
    process.exit(1);
  }
}

restoreBackup();
