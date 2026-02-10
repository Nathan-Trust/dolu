import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidRole, getRoleConfig, type UserRole } from "@/util/status";
import ClientsClient from "./client";

interface ClientsPageProps {
  params: Promise<{ role: string }>;
}

export async function generateMetadata({
  params,
}: ClientsPageProps): Promise<Metadata> {
  const { role } = await params;

  if (!isValidRole(role)) {
    return { title: "Not Found" };
  }

  const config = getRoleConfig(role as UserRole);

  return {
    title: `Clients - ${config.label} | Dolu`,
    description: `${config.label} client management for Real Estate Management System PLUS`,
  };
}

export default async function ClientsPage({ params }: ClientsPageProps) {
  const { role } = await params;

  if (!isValidRole(role)) {
    notFound();
  }

  return <ClientsClient role={role as UserRole} />;
}
