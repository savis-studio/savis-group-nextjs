import type { Access, FieldAccess } from "payload";

export type Role = "admin" | "editor";

const hasRole = (user: unknown, role: Role): boolean => {
  const roles = (user as { roles?: unknown } | null)?.roles;
  return Array.isArray(roles) && roles.includes(role);
};

/** Admins manage users, security settings and deletions. */
export const isAdmin: Access = ({ req }) => hasRole(req.user, "admin");

/** Admins and editors may change content. */
export const isStaff: Access = ({ req }) => hasRole(req.user, "admin") || hasRole(req.user, "editor");

/** Admins see every user; everyone else only sees their own record. */
export const isAdminOrSelf: Access = ({ req }) => {
  if (hasRole(req.user, "admin")) return true;
  if (req.user) return { id: { equals: req.user.id } };
  return false;
};

export const publicRead: Access = () => true;
export const nobody: Access = () => false;

/** Field-level: only admins may set roles. */
export const adminOnlyField: FieldAccess = ({ req }) => hasRole(req.user, "admin");
