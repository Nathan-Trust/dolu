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
  const Component = overviewByRole[role];

  return (
    <Component role={role} overviewData={overviewData} isLoading={isLoading} />
  );
}
