"use client";

import { type UserRole } from "@/util/status";
import ChairmanOverview from "@/components/overview/ChairmanOverview";
import AdminOverview from "@/components/overview/AdminOverview";
import StaffOverview from "@/components/overview/StaffOverview";
import RealtorOverview from "@/components/overview/RealtorOverview";

interface OverviewClientProps {
  role: UserRole;
}

const overviewByRole: Record<
  UserRole,
  React.ComponentType<{ role: UserRole }>
> = {
  chairman: ChairmanOverview,
  admin: AdminOverview,
  staff: StaffOverview,
  realtor: RealtorOverview,
};

export default function OverviewClient({ role }: OverviewClientProps) {
  const Component = overviewByRole[role];
  return <Component role={role} />;
}
