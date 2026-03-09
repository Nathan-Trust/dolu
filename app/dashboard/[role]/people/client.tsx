"use client";

import { type UserRole } from "@/util/status";
import PeopleListView from "@/components/people/PeopleListView";
import PeopleOwnProfile from "@/components/people/PeopleOwnProfile";
import { useRolePermissions } from "@/hooks/useRolePermissions";

interface PeopleClientProps {
  role: UserRole;
}

export default function PeopleClient({ role }: PeopleClientProps) {
  const { canView } = useRolePermissions(role);

  // Roles that cannot view people see their own profile only
  if (!canView("People")) {
    return <PeopleOwnProfile role={role} />;
  }

  return <PeopleListView role={role} />;
}
