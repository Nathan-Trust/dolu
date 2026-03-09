"use client";

import { type UserRole } from "@/util/status";
import InventoryListView from "@/components/properties/InventoryListView";
import { useRolePermissions } from "@/hooks/useRolePermissions";

interface InventoryClientProps {
  role: UserRole;
  estateId: string;
}

export default function InventoryClient({
  role,
  estateId,
}: InventoryClientProps) {
  const { canView, canCreate } = useRolePermissions(role);

  if (!canView("Properties")) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
          Properties
        </h1>
        <p className="font-montserrat text-sm text-[#6f6d6d]">
          You do not have permission to view this inventory.
        </p>
      </div>
    );
  }

  return (
    <InventoryListView
      role={role}
      estateId={estateId}
      canCreate={canCreate("Properties")}
    />
  );
}
