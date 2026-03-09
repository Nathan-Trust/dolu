"use client";

import { type UserRole } from "@/util/status";
import ReportsPageView from "@/components/reports/ReportsPageView";
import { useRolePermissions } from "@/hooks/useRolePermissions";

interface ReportsClientProps {
  role: UserRole;
}

export default function ReportsClient({ role }: ReportsClientProps) {
  const { canView, canCreate } = useRolePermissions(role);

  if (!canView("Reports")) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
          Reports
        </h1>
        <p className="font-montserrat text-sm text-[#6f6d6d]">
          You do not have permission to view reports.
        </p>
      </div>
    );
  }

  return <ReportsPageView canCreate={canCreate("Reports")} />;
}
