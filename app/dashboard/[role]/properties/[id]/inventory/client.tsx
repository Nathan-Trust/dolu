"use client";

import { type UserRole } from "@/util/status";
import InventoryListView from "@/components/properties/InventoryListView";

interface InventoryClientProps {
  role: UserRole;
  estateId: string;
}

export default function InventoryClient({
  role,
  estateId,
}: InventoryClientProps) {
  const isReadOnly = role === "chairman";
  return (
    <InventoryListView
      role={role}
      estateId={estateId}
      isReadOnly={isReadOnly}
    />
  );
}
