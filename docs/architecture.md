# Architecture Technique — CAROANA MINCEUR

Ce document décrit l'architecture logicielle de la plateforme e-commerce CAROANA MINCEUR.

---

## 1. Stack Technique

- **Framework principal** : Next.js 15+ (App Router)
- **Langage** : TypeScript (mode strict activé)
- **Base de données & Authentification** : Firebase (Firestore, Auth, Storage) avec Firebase Admin SDK côté serveur.
- **Gestion du style** : Tailwind CSS v4 (Design system déclaré dans `globals.css`)
- **Gestion d'état client** : Zustand (panier persistant avec persistance locale)
- **Validation de données** : Zod (validation des formulaires et des variables d'environnement au démarrage)
- **Outils de test** : Vitest (tests unitaires) & Playwright (tests E2E de bout en bout)

---

## 2. Modèle de Données Firestore

Les collections clés suivantes sont déclarées et indexées :

### 2.1. `users`
Représente les profils clients et administrateurs.
- `id` : string (UID Firebase Auth)
- `email` : string
- `phone` : string | null
- `firstName` : string
- `lastName` : string
- `role` : UserRole (`customer` | `support` | `content_editor` | `inventory_manager` | `order_manager` | `administrator` | `super_admin`)
- `permissions` : string[] (droits d'accès granulaires)
- `createdAt` / `updatedAt` : Timestamp

### 2.2. `products`
- `id` : string (slug ou id auto)
- `name` : string
- `slug` : string (unique)
- `sku` : string
- `description` : string
- `price` : number | null (un prix nul à la création empêche la publication)
- `status` : `"draft" | "published" | "archived"`
- `stock` : number
- `trackInventory` : boolean
- `allowBackorder` : boolean
- `images` : `{ url: string, alt: string, order: number }[]`

### 2.3. `orders`
- `id` : string (id unique)
- `orderNumber` : string (ex: `CM-2026-0001` séquentiel)
- `userId` : string | null (ou `guest`)
- `customerSnapshot` : snapshot de l'acheteur
- `shippingAddressSnapshot` : adresse de livraison ivoirienne détaillée
- `items` : `{ productId, name, quantity, unitPrice, totalPrice }[]`
- `subtotal` / `discountTotal` / `shippingTotal` / `grandTotal` : number
- `paymentMethod` / `paymentStatus` : string
- `fulfillmentStatus` : string (`unfulfilled` | `processing` | `ready` | `shipped` | `delivered` | `cancelled`)

---

## 3. Mécanisme de Réservation de Stock et Sécurité des Prix

Pour éviter les tricheries sur les prix côté client ou les ruptures de stock en cas de commandes concurrentes :
1. Le client envoie uniquement l'ID des produits et les quantités au serveur.
2. Le serveur exécute une **Transaction Firestore** (`adminDb.runTransaction`) :
   - Lit l'état de stock actuel de chaque produit directement depuis Firestore.
   - Si le stock est suffisant (ou si les commandes en attente de réapprovisionnement sont autorisées), soustrait la quantité demandée.
   - Écrit le mouvement de stock dans `inventoryMovements`.
   - Calcule le total de la commande côté serveur (avec les zones de livraison et coupons vérifiés dans `CartService`).
   - Crée le document de commande dans `orders` et son événement associé dans `orderEvents`.
3. Si une seule de ces opérations échoue (ex: plus de stock), toute la transaction est annulée, garantissant l'intégrité des données.

---

## 4. Matrice des Rôles & Permissions

L'accès est restreint par rôles applicatifs (`src/lib/auth/permissions.ts`) :
- `customer` : consulte son profil, ses commandes, gère sa wishlist et dépose des avis.
- `support` : consulte les commandes et clients, ajoute des notes de suivi.
- `inventory_manager` : gère le catalogue de produits, ajuste les stocks.
- `order_manager` : traite les commandes (changement de statut, validation de paiement).
- `administrator` / `super_admin` : tous les droits de gestion et d'audit.

Les permissions sont vérifiées à deux niveaux :
- **Sécurité Firestore** (`firebase/firestore.rules`) : Restreint les lectures/écritures directes du client.
- **Middleware Next.js** (`src/middleware.ts`) : Protège l'accès aux pages `/admin` et `/compte`.
