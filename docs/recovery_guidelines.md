# Procédures de Sauvegarde et de Restauration (Disaster Recovery)

Ce document décrit les procédures de sauvegarde et de restauration des données de la plateforme e-commerce CAROANA MINCEUR.

---

## 1. Procédure de Sauvegarde (Backup)

La sauvegarde s'effectue via un script automatisé qui extrait l'intégralité des données des collections Firestore critiques et les exporte sous forme de fichier JSON horodaté.

### 1.1. Lancer une sauvegarde manuelle
Exécutez la commande suivante à la racine du projet :
```bash
npx tsx scripts/backup.ts
```

Cette commande :
1. Charge les variables de configuration depuis `.env.local`.
2. Extrait les documents de toutes les collections clés.
3. Enregistre un fichier JSON compressé dans le dossier `backups/` à la racine (ex: `backups/backup_2026-06-19T02-30-00-000Z.json`).
4. Crée automatiquement un journal d'audit (`auditLogs`) enregistrant l'action.

### 1.2. Automatisation des sauvegardes (Cron Job)
Il est conseillé de configurer une tâche planifiée (ex. GitHub Action planifiée ou cron serverless) pour exécuter ce script quotidiennement.

---

## 2. Procédure de Restauration (Recovery)

En cas de corruption de données ou de suppression accidentelle, vous pouvez restaurer la base de données à partir d'un fichier de sauvegarde JSON.

### 2.1. Script de Restauration (`scripts/restore.ts`)
Voici le script de restauration à créer si besoin de rétablir les données. Il lit le fichier de sauvegarde et réinjecte les documents dans Firestore de manière idempotente.

```typescript
// scripts/restore.ts
import * as fs from "fs";
import * as path from "path";
import { adminDb } from "../src/lib/firebase/admin";

async function restoreBackup() {
  const args = process.argv.slice(2);
  const backupFile = args[0];

  if (!backupFile) {
    console.error("❌ Spécifiez le fichier de sauvegarde : npx tsx scripts/restore.ts backups/backup_XXX.json");
    process.exit(1);
  }

  const filePath = path.resolve(backupFile);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Fichier introuvable : ${filePath}`);
    process.exit(1);
  }

  console.log(`⏳ Lecture du fichier de sauvegarde ${filePath}...`);
  const rawData = fs.readFileSync(filePath, "utf-8");
  const backup = JSON.parse(rawData);

  const data = backup.data;
  if (!data) {
    console.error("❌ Format de fichier invalide. Pas d'objet 'data'.");
    process.exit(1);
  }

  const collections = Object.keys(data);
  for (const colName of collections) {
    console.log(`Restaurations de la collection : ${colName}...`);
    const docs = data[colName] || [];

    for (const doc of docs) {
      const { id, ...docData } = doc;
      
      // Reconvertir les chaînes de dates ISO en objets Date
      const parsedData = { ...docData };
      for (const key in parsedData) {
        const value = parsedData[key];
        if (value && typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
          parsedData[key] = new Date(value);
        }
      }

      await adminDb.collection(colName).doc(id).set(parsedData, { merge: true });
    }
    console.log(`✅ ${docs.length} documents restaurés dans "${colName}".`);
  }

  console.log("🎉 Restauration terminée avec succès !");
  process.exit(0);
}

restoreBackup().catch(console.error);
```

### 2.2. Exécuter la restauration
Pour restaurer la base de données vers une sauvegarde spécifique :
```bash
npx tsx scripts/restore.ts backups/backup_2026-06-19T02-30-00-000Z.json
```

---

## 3. Checklist en Cas de Sinistre (Disaster Recovery Plan)

1. **Vérifier l'accès à Firebase Console** : Assurez-vous que le projet Firebase est toujours actif.
2. **Récupérer la clé privée Firebase Admin** : Si les clés d'environnement ont été compromises ou perdues, générez une nouvelle clé privée depuis la console Firebase (`Paramètres du projet > Comptes de service`) et mettez à jour la variable `FIREBASE_ADMIN_PRIVATE_KEY` dans vos secrets de production.
3. **Mettre l'application en maintenance** : Modifiez temporairement la règle globale de réécriture pour rediriger les clients vers une page de maintenance afin d'éviter de nouveaux enregistrements de commandes pendant la phase de restauration.
4. **Appliquer les règles de sécurité** : Assurez-vous que les fichiers `firestore.rules` et `storage.rules` sont correctement déployés.
5. **Lancer la restauration** : Exécutez le script de restauration avec le backup le plus récent.
6. **Vérifier l'état de l'application** : Testez une commande de bout en bout en mode Sandbox pour valider le bon fonctionnement général avant de lever le mode maintenance.
