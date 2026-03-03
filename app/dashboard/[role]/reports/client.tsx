"use client";

import { type UserRole } from "@/util/status";
import ReportsListView from "@/components/reports/ReportsListView";
import ReportsOwnProfile from "@/components/reports/ReportsOwnProfile";

interface ReportsClientProps {
  role: UserRole;
}

/**
 * Role-Based Visibility Rules:
 * - Chairman: Read-only, summary-heavy (full list view)
 * - Admin: Full visibility (full list view)
 * - Manager: Full visibility (full list view)
 * - Staff: Can only see own profile/reports
 * - Realtor: Can only see own profile/reports
 */
const reportsByRole: Record<
  UserRole,
  React.ComponentType<{ role: UserRole }>
> = {
  chairman: (props) => <ReportsListView {...props} isReadOnly />,
  admin: ReportsListView,
  manager: ReportsListView,
  staff: ReportsOwnProfile,
  realtor: ReportsOwnProfile,
};

export default function ReportsClient({ role }: ReportsClientProps) {
  const Component = reportsByRole[role];
  return <Component role={role} />;
}
