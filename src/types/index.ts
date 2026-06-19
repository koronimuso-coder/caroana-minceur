import { UserRole } from "@/lib/auth/permissions";

export interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

export interface User {
  id: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: UserRole;
  status: "active" | "blocked" | "deleted";
  emailVerified: boolean;
  marketingConsent: boolean;
  preferredLanguage: "fr" | "en";
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  lastLoginAt: Date | Timestamp | null;
}

export interface UserAddress {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  secondaryPhone?: string | null;
  country: string;
  city: string;
  commune: string;
  district: string;
  neighborhood: string;
  landmark: string | null;
  addressLine: string;
  deliveryInstructions?: string | null;
  isDefault: boolean;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortDescription: string;
  description: string;
  productType: "capsules" | "tea" | "herbal_tea" | "bundle";
  status: "draft" | "published" | "archived";
  categoryId: string;
  collectionIds: string[];
  tags: string[];
  images: {
    url: string;
    alt: string;
    order: number;
  }[];
  price: number | null;
  compareAtPrice: number | null;
  costPrice: number | null;
  currency: "XOF";
  taxable: boolean;
  trackInventory: boolean;
  stock: number;
  lowStockThreshold: number;
  allowBackorder: boolean;
  variants: string[];
  benefits: string[];
  ingredients: string[];
  usageInstructions: string[];
  precautions: string[];
  warnings: string[];
  nutritionalInformation: string | null;
  weight: number | null;
  dimensions: {
    length: number | null;
    width: number | null;
    height: number | null;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl: string | null;
  };
  featured: boolean;
  publishedAt: Date | Timestamp | null;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  createdBy: string;
  updatedBy: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  trackInventory: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt: Date | Timestamp;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt: Date | Timestamp;
}

export interface Cart {
  id: string;
  userId: string | null;
  sessionId: string | null;
  currency: "XOF";
  couponCode: string | null;
  status: "active" | "converted" | "abandoned";
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  expiresAt: Date | Timestamp;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  unitPriceSnapshot: number;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  guestEmail: string | null;
  customerSnapshot: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    secondaryPhone: string | null;
  };
  shippingAddressSnapshot: {
    country: string;
    city: string;
    commune: string;
    district: string;
    neighborhood: string;
    landmark: string | null;
    addressLine: string;
    deliveryInstructions: string | null;
  };
  items: {
    productId: string;
    variantId: string | null;
    sku: string;
    name: string;
    imageUrl: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  grandTotal: number;
  currency: "XOF";
  couponCode: string | null;
  paymentMethod: string;
  paymentStatus:
    | "pending"
    | "verification_required"
    | "authorized"
    | "paid"
    | "failed"
    | "refunded";
  fulfillmentStatus:
    | "unfulfilled"
    | "processing"
    | "ready"
    | "shipped"
    | "delivered"
    | "cancelled";
  source: "website" | "whatsapp" | "admin" | "social";
  utm: {
    source: string | null;
    medium: string | null;
    campaign: string | null;
    content: string | null;
    term: string | null;
  };
  customerNotes: string | null;
  internalNotes: string | null;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  paidAt: Date | Timestamp | null;
  shippedAt: Date | Timestamp | null;
  deliveredAt: Date | Timestamp | null;
}

export interface OrderEvent {
  id: string;
  orderId: string;
  type: "status_changed" | "payment_received" | "note_added" | "notification_sent" | "cancelled";
  description: string;
  actorId: string | null;
  actorRole: string | null;
  createdAt: Date | Timestamp;
}

export interface Payment {
  id: string;
  orderId: string;
  provider: string;
  providerTransactionId: string | null;
  method: string;
  amount: number;
  currency: "XOF";
  status: "pending" | "verification_required" | "paid" | "failed" | "refunded";
  idempotencyKey: string;
  proofUrl: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  variantId: string | null;
  type: "purchase" | "sale" | "return" | "adjustment" | "damage" | "correction";
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  referenceId: string | null;
  reason: string;
  createdBy: string;
  createdAt: Date | Timestamp;
}

export interface ShippingZone {
  id: string;
  country: string;
  city: string;
  commune: string;
  district: string;
  neighborhood: string;
  tarif: number;
  minimumOrder: number;
  freeShippingThreshold: number | null;
  deliveryDelay: string;
  status: "active" | "inactive";
  deliveryMethod: "standard" | "express" | "pickup" | "custom";
}

export interface Coupon {
  id: string;
  code: string;
  type: "fixed" | "percentage";
  value: number;
  minSubtotal: number;
  maxDiscount?: number;
  status: "active" | "inactive";
  expiresAt: Date | Timestamp | null;
  usageCount: number;
  maxUsage?: number;
  createdAt: Date | Timestamp;
}

export interface Promotion {
  id: string;
  name: string;
  description?: string;
  type: "fixed" | "percentage" | "free_shipping";
  value: number;
  applyTo: "all" | "category" | "product";
  targetIds: string[];
  status: "active" | "inactive";
  startsAt: Date | Timestamp | null;
  endsAt: Date | Timestamp | null;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string | null;
  rating: number;
  title?: string;
  comment: string;
  status: "pending" | "published" | "rejected";
  featured: boolean;
  createdAt: Date | Timestamp;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  before: unknown;
  after: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date | Timestamp;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: Date | Timestamp;
}
export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: "active" | "unsubscribed";
  createdAt: Date | Timestamp;
}
