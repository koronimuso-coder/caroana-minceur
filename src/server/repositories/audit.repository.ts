import { adminDb } from "@/lib/firebase/admin";
import { AuditLog } from "@/types";

export class AuditRepository {
  private col = adminDb.collection("auditLogs");

  async log(logEntry: Omit<AuditLog, "id" | "createdAt">): Promise<string> {
    const docRef = this.col.doc();
    const entry: AuditLog = {
      id: docRef.id,
      ...logEntry,
      createdAt: new Date(),
    };
    await docRef.set(entry);
    return docRef.id;
  }

  async getAll(): Promise<AuditLog[]> {
    const snapshot = await this.col.orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AuditLog));
  }

  async getByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    const snapshot = await this.col
      .where("entityType", "==", entityType)
      .where("entityId", "==", entityId)
      .orderBy("createdAt", "desc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AuditLog));
  }
}
