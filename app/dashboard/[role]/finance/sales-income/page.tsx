import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isValidRole, getRoleConfig, type UserRole } from "@/util/status";
import SalesIncomeClient from "./client";

interface SalesIncomePageProps {
  params: Promise<{ role: string }>;
}

export async function generateMetadata({
  params,
}: SalesIncomePageProps): Promise<Metadata> {
  const { role } = await params;

  if (!isValidRole(role)) {
    return { title: "Not Found" };
  }

  const config = getRoleConfig(role as UserRole);

  return {
    title: `Sales Income - ${config.label} | Dolu`,
    description: `${config.label} sales income tracking for Real Estate Management System PLUS`,
  };
}

export default async function SalesIncomePage({
  params,
}: SalesIncomePageProps) {
  const { role } = await params;

  if (!isValidRole(role)) {
    notFound();
  }

  // Only admin and staff can access Sales Income
  if (role === "realtor" || role === "chairman" || role === "manager") {
    redirect(`/dashboard/${role}/finance`);
  }

  return <SalesIncomeClient />;
}
