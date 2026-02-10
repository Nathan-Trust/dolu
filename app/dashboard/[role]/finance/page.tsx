import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isValidRole, getRoleConfig, type UserRole } from "@/util/status";
import FinanceClient from "./client";

interface FinancePageProps {
  params: Promise<{ role: string }>;
}

export async function generateMetadata({
  params,
}: FinancePageProps): Promise<Metadata> {
  const { role } = await params;

  if (!isValidRole(role)) {
    return { title: "Not Found" };
  }

  const config = getRoleConfig(role as UserRole);

  return {
    title: `Finance - ${config.label} | Dolu`,
    description: `${config.label} financial overview for Real Estate Management System PLUS`,
  };
}

export default async function FinancePage({ params }: FinancePageProps) {
  const { role } = await params;

  if (!isValidRole(role)) {
    notFound();
  }

  // Realtors have no Finance access
  if (role === "realtor") {
    redirect(`/dashboard/${role}/overview`);
  }

  return <FinanceClient role={role as UserRole} />;
}
