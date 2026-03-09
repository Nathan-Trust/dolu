"use client";

import { type UserRole } from "@/util/status";
import ChairmanOverview from "@/components/overview/ChairmanOverview";
import AdminOverview from "@/components/overview/AdminOverview";
import StaffOverview from "@/components/overview/StaffOverview";
import RealtorOverview from "@/components/overview/RealtorOverview";
import ManagerOverview from "@/components/overview/ManagerOverview";
import ProcurementOverview from "@/components/overview/ProcurementOverview";
import FinanceOverview from "@/components/overview/FinanceOverview";
import { useOverview } from "@/hooks/useOverview";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import type { OverviewData } from "@/services/overview";

interface OverviewClientProps {
  role: UserRole;
}

interface OverviewComponentProps {
  role: UserRole;
  overviewData: OverviewData | null;
  isLoading: boolean;
}

const overviewByRole: Record<
  UserRole,
  React.ComponentType<OverviewComponentProps>
> = {
  chairman: ChairmanOverview,
  admin: AdminOverview,
  staff: StaffOverview,
  realtor: RealtorOverview,
  manager: ManagerOverview,
  procurement: ProcurementOverview,
  finance: FinanceOverview,
};

export default function OverviewClient({ role }: OverviewClientProps) {
  const { data: overviewData, isLoading } = useOverview();
  const { canView } = useRolePermissions(role);

  if (!canView("Overview")) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
          Overview
        </h1>
        <p className="font-montserrat text-sm text-[#6f6d6d]">
          You do not have permission to view the overview.
        </p>
      </div>
    );
  }

  const Component = overviewByRole[role];

  return (
    <Component role={role} overviewData={overviewData} isLoading={isLoading} />
  );
}
