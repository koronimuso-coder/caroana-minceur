import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().regex(/^\+?[0-9\s-]{8,15}$/, "Numéro de téléphone invalide"),
  preferredLanguage: z.enum(["fr", "en"]).default("fr"),
});

export const addressSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().regex(/^\+?[0-9\s-]{8,15}$/, "Numéro de téléphone invalide"),
  secondaryPhone: z.string().regex(/^\+?[0-9\s-]{8,15}$/, "Numéro invalide").optional().nullable(),
  country: z.string().min(2, "Pays requis").default("Côte d'Ivoire"),
  city: z.string().min(2, "Ville requise").default("Abidjan"),
  commune: z.string().min(2, "Commune requise (ex: Cocody, Yopougon, Marcory)"),
  district: z.string().min(2, "District / Zone requis"),
  neighborhood: z.string().min(2, "Quartier requis"),
  landmark: z.string().min(3, "Indiquez un point de repère (ex: Pharmacie du Centre, face à la banque)").nullable().optional(),
  addressLine: z.string().min(3, "Adresse précise requise"),
  deliveryInstructions: z.string().max(300, "Maximum 300 caractères").nullable().optional(),
  isDefault: z.boolean().default(false),
});

export const cartItemInputSchema = z.object({
  productId: z.string(),
  variantId: z.string().nullable().optional(),
  quantity: z.number().int().positive("La quantité doit être supérieure à 0"),
});

export const cartCalculationInputSchema = z.object({
  items: z.array(cartItemInputSchema),
  couponCode: z.string().nullable().optional(),
  shippingZoneId: z.string().nullable().optional(),
});

export const checkoutSchema = z.object({
  items: z.array(cartItemInputSchema),
  guestEmail: z.string().email("Adresse email invalide").nullable().optional(),
  customer: z.object({
    firstName: z.string().min(2, "Prénom requis"),
    lastName: z.string().min(2, "Nom requis"),
    email: z.string().email("Email requis"),
    phone: z.string().min(8, "Téléphone requis"),
    secondaryPhone: z.string().optional().nullable(),
  }),
  shippingAddress: addressSchema,
  paymentMethod: z.enum([
    "CashOnDeliveryProvider",
    "ManualPaymentProvider",
    "WhatsAppOrderProvider",
    "MobileMoneyProvider",
    "CardPaymentProvider",
  ]),
  paymentDetails: z.object({
    method: z.enum(["wave", "orange_money", "mtn", "moov", "cash", "card"]).optional(),
    proofUrl: z.string().optional().nullable(),
  }).optional(),
  couponCode: z.string().nullable().optional(),
  shippingZoneId: z.string().nullable().optional(),
  customerNotes: z.string().max(500).nullable().optional(),
  utm: z.object({
    source: z.string().optional().nullable(),
    medium: z.string().optional().nullable(),
    campaign: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
    term: z.string().optional().nullable(),
  }).optional(),
});

export const contactMessageSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(3, "L'objet est requis"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().max(80).optional(),
  comment: z.string().min(5, "Le commentaire doit contenir au moins 5 caractères").max(1000),
});

export const newsletterSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});
