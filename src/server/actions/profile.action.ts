"use server";
import { adminDb } from "@/lib/firebase/admin";
import { OrderRepository } from "../repositories/order.repository";
import { User, UserAddress } from "@/types";

const orderRepo = new OrderRepository();

export async function getUserProfile(userId: string) {
  try {
    const userDoc = await adminDb.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return { success: false, error: "Profil non trouvé" };
    }
    return { success: true, profile: { id: userDoc.id, ...userDoc.data() } as User };
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: error.message };
  }
}

export async function updateUserProfile(userId: string, data: { firstName: string; lastName: string; phone: string }) {
  try {
    const userRef = adminDb.collection("users").doc(userId);
    const doc = await userRef.get();
    
    const profileData = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      updatedAt: new Date(),
    };

    if (!doc.exists) {
      // Create profile if doesn't exist yet
      await userRef.set({
        ...profileData,
        id: userId,
        role: "customer",
        status: "active",
        createdAt: new Date(),
      });
    } else {
      await userRef.update(profileData);
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return { success: false, error: error.message };
  }
}

export async function getAddresses(userId: string) {
  try {
    const doc = await adminDb.collection("users").doc(userId).get();
    if (!doc.exists) return { success: true, addresses: [] };
    const data = doc.data();
    return { success: true, addresses: (data?.addresses || []) as UserAddress[] };
  } catch (error: any) {
    console.error("Error fetching addresses:", error);
    return { success: false, error: error.message };
  }
}

export async function saveAddress(userId: string, address: Omit<UserAddress, "userId" | "createdAt" | "updatedAt">) {
  try {
    const userRef = adminDb.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    let addresses: UserAddress[] = [];
    if (userDoc.exists) {
      addresses = userDoc.data()?.addresses || [];
    }

    const now = new Date();
    
    // If setting as default, make all others non-default
    if (address.isDefault) {
      addresses = addresses.map((a) => ({ ...a, isDefault: false }));
    }

    // If address has ID, it's an update, otherwise insert new
    const existingIndex = address.id ? addresses.findIndex((a) => a.id === address.id) : -1;

    if (existingIndex > -1) {
      // Update
      const existing = addresses[existingIndex]!;
      addresses[existingIndex] = {
        ...existing,
        ...address,
        updatedAt: now,
      } as UserAddress;
    } else {
      // Add new
      const newAddress: UserAddress = {
        ...address,
        id: address.id || Math.random().toString(36).substring(2, 9),
        userId,
        createdAt: now,
        updatedAt: now,
      };
      // If it's the first address, make it default automatically
      if (addresses.length === 0) {
        newAddress.isDefault = true;
      }
      addresses.push(newAddress);
    }

    if (!userDoc.exists) {
      await userRef.set({
        id: userId,
        role: "customer",
        status: "active",
        addresses,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      await userRef.update({ addresses, updatedAt: now });
    }

    return { success: true, addresses };
  } catch (error: any) {
    console.error("Error saving address:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAddress(userId: string, addressId: string) {
  try {
    const userRef = adminDb.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return { success: false, error: "Profil inexistant" };

    let addresses: UserAddress[] = userDoc.data()?.addresses || [];
    const wasDefault = addresses.find((a) => a.id === addressId)?.isDefault;

    addresses = addresses.filter((a) => a.id !== addressId);

    // If we deleted the default address, make the first remaining address the default
    if (wasDefault && addresses.length > 0 && addresses[0]) {
      addresses[0].isDefault = true;
    }

    await userRef.update({ addresses, updatedAt: new Date() });
    return { success: true, addresses };
  } catch (error: any) {
    console.error("Error deleting address:", error);
    return { success: false, error: error.message };
  }
}

export async function setDefaultAddress(userId: string, addressId: string) {
  try {
    const userRef = adminDb.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return { success: false, error: "Profil inexistant" };

    let addresses: UserAddress[] = userDoc.data()?.addresses || [];
    addresses = addresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));

    await userRef.update({ addresses, updatedAt: new Date() });
    return { success: true, addresses };
  } catch (error: any) {
    console.error("Error setting default address:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserOrders(userId: string) {
  try {
    const orders = await orderRepo.getByUser(userId);
    // Convert Dates/Timestamps to plain objects for next.js serialization
    const serializedOrders = orders.map((o) => ({
      ...o,
      createdAt: o.createdAt && typeof o.createdAt === "object" && "seconds" in o.createdAt
        ? new Date((o.createdAt as any).seconds * 1000).toLocaleDateString("fr-FR")
        : new Date(o.createdAt as any).toLocaleDateString("fr-FR"),
      updatedAt: o.updatedAt && typeof o.updatedAt === "object" && "seconds" in o.updatedAt
        ? new Date((o.updatedAt as any).seconds * 1000).toLocaleDateString("fr-FR")
        : new Date(o.updatedAt as any).toLocaleDateString("fr-FR"),
    }));
    return { success: true, orders: serializedOrders };
  } catch (error: any) {
    console.error("Error fetching user orders:", error);
    return { success: false, error: error.message };
  }
}
