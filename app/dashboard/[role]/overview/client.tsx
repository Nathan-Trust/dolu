"use client";

import { type UserRole } from "@/util/status";
import ChairmanOverview from "@/components/overview/ChairmanOverview";
import AdminOverview from "@/components/overview/AdminOverview";
import StaffOverview from "@/components/overview/StaffOverview";
import RealtorOverview from "@/components/overview/RealtorOverview";
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
  manager: StaffOverview, // Using StaffOverview for manager
};

export default function OverviewClient({ role }: OverviewClientProps) {
  const { data: overviewData, isLoading } = useOverview();
  const Component = overviewByRole[role];

  return (
    <Component role={role} overviewData={overviewData} isLoading={isLoading} />
  );
}
