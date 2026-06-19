import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_APPCHECK_KEY: z.string().optional(),
  NEXT_PUBLIC_PHONE_NUMBER: z.string().min(1),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().min(1),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),
  NEXT_PUBLIC_TIKTOK_PIXEL_ID: z.string().optional(),
});

const serverEnvSchema = z.object({
  FIREBASE_ADMIN_PROJECT_ID: z.string().min(1),
  FIREBASE_ADMIN_CLIENT_EMAIL: z.string().email(),
  FIREBASE_ADMIN_PRIVATE_KEY: z.string().min(1),
  PAYMENT_PROVIDER: z.enum([
    "CashOnDeliveryProvider",
    "ManualPaymentProvider",
    "WhatsAppOrderProvider",
    "MobileMoneyProvider",
    "CardPaymentProvider",
  ]),
  PAYMENT_PUBLIC_KEY: z.string().min(1),
  PAYMENT_SECRET_KEY: z.string().min(1),
  PAYMENT_WEBHOOK_SECRET: z.string().optional(),
  EMAIL_PROVIDER: z.string().min(1),
  EMAIL_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().min(1),
});

const isServer = typeof window === "undefined";

function validateEnv() {
  const clientData = {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    NEXT_PUBLIC_FIREBASE_APPCHECK_KEY: process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_KEY,
    NEXT_PUBLIC_PHONE_NUMBER: process.env.NEXT_PUBLIC_PHONE_NUMBER || "2250719172371",
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2250143655088",
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    NEXT_PUBLIC_TIKTOK_PIXEL_ID: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
  };

  const clientParsed = clientEnvSchema.safeParse(clientData);

  if (!clientParsed.success) {
    console.error("❌ Invalid client environment variables:", clientParsed.error.format());
    throw new Error("Invalid client environment variables");
  }

  if (isServer) {
    const serverData = {
      FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
      FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
      PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER,
      PAYMENT_PUBLIC_KEY: process.env.PAYMENT_PUBLIC_KEY,
      PAYMENT_SECRET_KEY: process.env.PAYMENT_SECRET_KEY,
      PAYMENT_WEBHOOK_SECRET: process.env.PAYMENT_WEBHOOK_SECRET,
      EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
      EMAIL_API_KEY: process.env.EMAIL_API_KEY,
      EMAIL_FROM: process.env.EMAIL_FROM,
    };

    const serverParsed = serverEnvSchema.safeParse(serverData);

    if (!serverParsed.success) {
      console.error("❌ Invalid server environment variables:", serverParsed.error.format());
      throw new Error("Invalid server environment variables");
    }

    return { ...clientParsed.data, ...serverParsed.data };
  }

  return { ...clientParsed.data } as any;
}

export const env = validateEnv();
export type Env = typeof env;
