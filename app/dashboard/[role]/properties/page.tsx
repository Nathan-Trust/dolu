import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidRole, getRoleConfig, type UserRole } from "@/util/status";
import PropertiesClient from "./client";

interface PropertiesPageProps {
  params: Promise<{ role: string }>;
}

export async function generateMetadata({
  params,
}: PropertiesPageProps): Promise<Metadata> {
  const { role } = await params;

  if (!isValidRole(role)) {
    return { title: "Not Found" };
  }

  const config = getRoleConfig(role as UserRole);

  return {
    title: `Properties - ${config.label} | Dolu`,
    description: `${config.label} property management for Real Estate Management System PLUS`,
  };
}

export default async function PropertiesPage({ params }: PropertiesPageProps) {
  const { role } = await params;

  if (!isValidRole(role)) {
    notFound();
  }

  return <PropertiesClient role={role as UserRole} />;
}
