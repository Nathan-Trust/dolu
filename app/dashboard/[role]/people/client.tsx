"use client";

import { type UserRole } from "@/util/status";
import PeopleListView from "@/components/people/PeopleListView";
import PeopleOwnProfile from "@/components/people/PeopleOwnProfile";

interface PeopleClientProps {
  role: UserRole;
}

const peopleByRole: Record<
  UserRole,
  React.ComponentType<{ role: UserRole }>
> = {
  chairman: (props) => <PeopleListView {...props} isReadOnly />,
  admin: PeopleListView,
  staff: PeopleListView,
  realtor: PeopleOwnProfile,
  manager: PeopleListView,
};

export default function PeopleClient({ role }: PeopleClientProps) {
  const Component = peopleByRole[role];
  return <Component role={role} />;
}
