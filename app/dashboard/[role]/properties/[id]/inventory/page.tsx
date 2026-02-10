import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidRole, getRoleConfig, type UserRole } from "@/util/status";
import InventoryClient from "./client";

interface InventoryPageProps {
  params: Promise<{ role: string; id: string }>;
}

export async function generateMetadata({
  params,
}: InventoryPageProps): Promise<Metadata> {
  const { role } = await params;

  if (!isValidRole(role)) {
    return { title: "Not Found" };
  }

  const config = getRoleConfig(role as UserRole);

  return {
    title: `Inventory - ${config.label} | Dolu`,
    description: `${config.label} estate inventory management for Real Estate Management System PLUS`,
  };
}

export default async function InventoryPage({ params }: InventoryPageProps) {
  const { role, id } = await params;

  if (!isValidRole(role)) {
    notFound();
  }

  return <InventoryClient role={role as UserRole} estateId={id} />;
}
