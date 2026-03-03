import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidRole, getRoleConfig, type UserRole } from "@/util/status";
import ReportsClient from "./client";

interface ReportsPageProps {
  params: Promise<{ role: string }>;
}

export async function generateMetadata({
  params,
}: ReportsPageProps): Promise<Metadata> {
  const { role } = await params;

  if (!isValidRole(role)) {
    return { title: "Not Found" };
  }

  const config = getRoleConfig(role as UserRole);

  return {
    title: `Reports - ${config.label} | Dolu`,
    description: `${config.label} reports for Real Estate Management System PLUS`,
  };
}

export default async function ReportsPage({ params }: ReportsPageProps) {
  const { role } = await params;

  if (!isValidRole(role)) {
    notFound();
  }

  return <ReportsClient role={role as UserRole} />;
}
