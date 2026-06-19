export type UserRole =
  | "customer"
  | "support"
  | "content_editor"
  | "inventory_manager"
  | "order_manager"
  | "administrator"
  | "super_admin";

export type Permission =
  | "read:profile"
  | "write:profile"
  | "read:orders"
  | "manage:orders"
  | "write:order_notes"
  | "write:shipping_status"
  | "create:reviews"
  | "manage:reviews"
  | "manage:wishlist"
  | "read:customers"
  | "manage:customers"
  | "read:products"
  | "manage:products"
  | "manage:stocks"
  | "manage:cms"
  | "manage:settings"
  | "read:audit"
  | "manage:admins";

const rolePermissions: Record<UserRole, Permission[]> = {
  customer: [
    "read:profile",
    "write:profile",
    "read:orders",
    "create:reviews",
    "manage:wishlist",
  ],
  support: [
    "read:profile",
    "read:orders",
    "write:order_notes",
    "read:customers",
    "read:products",
    "manage:reviews",
  ],
  content_editor: [
    "read:profile",
    "read:products",
    "manage:cms",
    "manage:reviews",
  ],
  inventory_manager: [
    "read:profile",
    "read:products",
    "manage:products",
    "manage:stocks",
  ],
  order_manager: [
    "read:profile",
    "read:orders",
    "manage:orders",
    "write:order_notes",
    "write:shipping_status",
    "read:customers",
  ],
  administrator: [
    "read:profile",
    "write:profile",
    "read:orders",
    "manage:orders",
    "write:order_notes",
    "write:shipping_status",
    "create:reviews",
    "manage:reviews",
    "manage:wishlist",
    "read:customers",
    "manage:customers",
    "read:products",
    "manage:products",
    "manage:stocks",
    "manage:cms",
    "manage:settings",
  ],
  super_admin: [
    "read:profile",
    "write:profile",
    "read:orders",
    "manage:orders",
    "write:order_notes",
    "write:shipping_status",
    "create:reviews",
    "manage:reviews",
    "manage:wishlist",
    "read:customers",
    "manage:customers",
    "read:products",
    "manage:products",
    "manage:stocks",
    "manage:cms",
    "manage:settings",
    "read:audit",
    "manage:admins",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = rolePermissions[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

export function getRoleHierarchyLevel(role: UserRole): number {
  switch (role) {
    case "super_admin":
      return 6;
    case "administrator":
      return 5;
    case "order_manager":
      return 4;
    case "inventory_manager":
      return 3;
    case "content_editor":
      return 2;
    case "support":
      return 1;
    case "customer":
    default:
      return 0;
  }
}

export function canModifyRole(actorRole: UserRole, targetRole: UserRole): boolean {
  if (actorRole === "super_admin") return true;
  if (actorRole === "administrator") {
    return targetRole !== "super_admin" && targetRole !== "administrator";
  }
  return false;
}
