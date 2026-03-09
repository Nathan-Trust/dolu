"use client";

import { type UserRole } from "@/util/status";
import ClientsListView from "@/components/clients/ClientsListView";
import { useRolePermissions } from "@/hooks/useRolePermissions";

interface ClientsClientProps {
  role: UserRole;
}

export default function ClientsClient({ role }: ClientsClientProps) {
  const { canView, canCreate } = useRolePermissions(role);

  if (!canView("Clients")) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
          Clients
        </h1>
        <p className="font-montserrat text-sm text-[#6f6d6d]">
          You do not have permission to view clients.
        </p>
      </div>
    );
  }

  return <ClientsListView role={role} canCreate={canCreate("Clients")} />;
}
