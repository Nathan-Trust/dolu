"use client";

import FinanceOverview from "@/components/finance/FinanceOverview";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import type { UserRole } from "@/util/status";

interface FinanceClientProps {
  role: UserRole;
}

export default function FinanceClient({ role }: FinanceClientProps) {
  const { canView } = useRolePermissions(role);

  if (!canView("Finance")) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
          Finance
        </h1>
        <p className="font-montserrat text-sm text-[#6f6d6d]">
          You do not have permission to view finance.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
          Finance
        </h1>
        <p className="font-montserrat text-xs text-[#6f6d6d]">
          Session <span className="font-bold">Jul 10, 2026</span>
        </p>
      </div>

      <FinanceOverview />
    </div>
  );
}
