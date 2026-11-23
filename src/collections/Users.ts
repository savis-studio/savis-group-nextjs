import type { CollectionConfig } from "payload";
import { adminOnlyField, isAdmin, isAdminOrSelf } from "../access";
import { auditChange, auditDelete } from "./audit";

const isProd = process.env.NODE_ENV === "production";

export const Users: CollectionConfig = {
  slug: "users",
  admin: { useAsTitle: "email", group: "Security" },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 2 * 60 * 60,
    cookies: { secure: isProd, sameSite: "Lax" },
  },
  access: {
    // Only staff may open the admin panel.
    admin: ({ req }) => isStaffUser(req.user),
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
    unlock: isAdmin,
  },
  hooks: {
    beforeChange: [
      // The very first account created through /admin becomes the administrator.
      async ({ data, operation, req }) => {
        if (operation === "create") {
          const { totalDocs } = await req.payload.count({ collection: "users", overrideAccess: true, req });
          if (totalDocs === 0) data.roles = ["admin"];
        }
        return data;
      },
    ],
    afterChange: [auditChange],
    afterDelete: [auditDelete],
  },
  fields: [
    {
      name: "roles",
      type: "select",
      hasMany: true,
      required: true,
      defaultValue: ["editor"],
      saveToJWT: true,
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      access: { create: adminOnlyField, update: adminOnlyField },
    },
  ],
};

function isStaffUser(user: unknown): boolean {
  const roles = (user as { roles?: unknown } | null)?.roles;
  return Array.isArray(roles) && (roles.includes("admin") || roles.includes("editor"));
}
