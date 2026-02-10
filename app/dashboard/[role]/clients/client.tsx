"use client";

import { type UserRole } from "@/util/status";
import ClientsListView from "@/components/clients/ClientsListView";

interface ClientsClientProps {
  role: UserRole;
}

export default function ClientsClient({ role }: ClientsClientProps) {
  const isReadOnly = role === "chairman";
  return <ClientsListView role={role} isReadOnly={isReadOnly} />;
}
