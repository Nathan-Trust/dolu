"use client";

import { Badge } from "@/components/ui/badge";
import { getRoleConfig, type UserRole } from "@/util/status";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = getRoleConfig(role);

  return (
    <Badge
      className={className}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
      }}
    >
      {config.label}
    </Badge>
  );
}
