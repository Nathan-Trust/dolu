export type UserRole =
  | "chairman"
  | "admin"
  | "staff"
  | "realtor"
  | "manager"
  | "procurement"
  | "finance"
  | "sales";

export interface RoleConfig {
  label: string;
  bgColor: string;
  textColor: string;
  description: string;
}

export const roleConfigs: Record<UserRole, RoleConfig> = {
  chairman: {
    label: "Chairman",
    bgColor: "#FFFEC0",
    textColor: "#AC7F5E",
    description:
      "You have read-only access to performance, sales, and financial summaries.",
  },
  admin: {
    label: "Admin",
    bgColor: "#D9EDFF",
    textColor: "#0088FF",
    description: "You manage users, operations, and system settings.",
  },
  staff: {
    label: "Staff",
    bgColor: "#DDF6E2",
    textColor: "#34C759",
    description:
      "You are responsible for client management, reporting, and sales tracking.",
  },
  realtor: {
    label: "Realtor",
    bgColor: "#F2DDF6",
    textColor: "#CB30E0",
    description: "You can submit deals and track your activity.",
  },
  manager: {
    label: "Manager",
    bgColor: "#FFE5D9",
    textColor: "#FF6B35",
    description: "You oversee team operations and coordinate activities.",
  },
  procurement: {
    label: "Procurement",
    bgColor: "#DDDBFF",
    textColor: "#6155F5",
    description:
      "You manage procurement, documentation, and payment verification.",
  },
  finance: {
    label: "Finance",
    bgColor: "#D9EDFF",
    textColor: "#0088FF",
    description:
      "You manage revenue tracking, expenses, salaries, and financial reporting.",
  },
  sales: {
    label: "Sales",
    bgColor: "#FFF3D9",
    textColor: "#E6A817",
    description: "You manage sales activities and client acquisitions.",
  },
};

export function getRoleConfig(role: UserRole): RoleConfig {
  return roleConfigs[role] || roleConfigs.staff;
}

export function isValidRole(role: string): role is UserRole {
  return [
    "chairman",
    "admin",
    "staff",
    "realtor",
    "manager",
    "procurement",
    "finance",
    "sales",
  ].includes(role);
}
