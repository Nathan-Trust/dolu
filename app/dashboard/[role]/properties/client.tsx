"use client";

import { type UserRole } from "@/util/status";
import PropertiesListView from "@/components/properties/PropertiesListView";

interface PropertiesClientProps {
  role: UserRole;
}

export default function PropertiesClient({ role }: PropertiesClientProps) {
  const isReadOnly = role === "chairman";
  return <PropertiesListView role={role} isReadOnly={isReadOnly} />;
}
