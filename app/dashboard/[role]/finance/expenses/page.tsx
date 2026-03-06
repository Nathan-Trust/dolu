import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isValidRole, getRoleConfig, type UserRole } from "@/util/status";
import ExpensesClient from "./client";

interface ExpensesPageProps {
  params: Promise<{ role: string }>;
}

export async function generateMetadata({
  params,
}: ExpensesPageProps): Promise<Metadata> {
  const { role } = await params;

  if (!isValidRole(role)) {
    return { title: "Not Found" };
  }

  const config = getRoleConfig(role as UserRole);

  return {
    title: `Expenses - ${config.label} | Dolu`,
    description: `${config.label} expense tracking for Real Estate Management System PLUS`,
  };
}

export default async function ExpensesPage({ params }: ExpensesPageProps) {
  const { role } = await params;

  if (!isValidRole(role)) {
    notFound();
  }

  // Only admin can access Expenses
  if (role !== "admin") {
    redirect(`/dashboard/${role}/finance`);
  }

  return <ExpensesClient />;
}
