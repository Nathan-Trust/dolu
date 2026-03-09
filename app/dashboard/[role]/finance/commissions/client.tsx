"use client";

import Commissions from "@/components/finance/Commissions";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import type { UserRole } from "@/util/status";

interface CommissionsClientProps {
  role: UserRole;
}

export default function CommissionsClient({ role }: CommissionsClientProps) {
  const { canView, canEdit } = useRolePermissions(role);

  if (!canView("Finance")) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
          Finance
        </h1>
        <p className="font-montserrat text-sm text-[#6f6d6d]">
          You do not have permission to view commissions.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header with breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-montserrat text-lg">
          <span className="font-normal text-[#6f6d6d]">Finance</span>
          <span className="font-normal text-[#6f6d6d]">&gt;</span>
          <span className="font-bold text-[#0f0f0f]">Commissions</span>
        </div>
        <p className="font-montserrat text-xs text-[#6f6d6d]">
          Session <span className="font-bold">Jul 10, 2026</span>
        </p>
      </div>

      <Commissions canEdit={canEdit("Finance")} />
    </div>
  );
}
