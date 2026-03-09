"use client";

import { type UserRole } from "@/util/status";
import PropertiesListView from "@/components/properties/PropertiesListView";
import { useRolePermissions } from "@/hooks/useRolePermissions";

interface PropertiesClientProps {
  role: UserRole;
}

export default function PropertiesClient({ role }: PropertiesClientProps) {
  const { canView, canCreate } = useRolePermissions(role);

  if (!canView("Properties")) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
          Properties
        </h1>
        <p className="font-montserrat text-sm text-[#6f6d6d]">
          You do not have permission to view properties.
        </p>
      </div>
    );
  }

  return <PropertiesListView role={role} canCreate={canCreate("Properties")} />;
}
