import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidRole, getRoleConfig, type UserRole } from "@/util/status";
import InvoicesClient from "./client";

interface InvoicesPageProps {
  params: Promise<{ role: string }>;
}

export async function generateMetadata({
  params,
}: InvoicesPageProps): Promise<Metadata> {
  const { role } = await params;

  if (!isValidRole(role)) {
    return { title: "Not Found" };
  }

  const config = getRoleConfig(role as UserRole);

  return {
    title: `Invoices - ${config.label} | Dolu`,
    description: `${config.label} invoice management for Real Estate Management System PLUS`,
  };
}

export default async function InvoicesPage({ params }: InvoicesPageProps) {
  const { role } = await params;

  if (!isValidRole(role)) {
    notFound();
  }

  return <InvoicesClient role={role as UserRole} />;
}
