import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isValidRole, getRoleConfig, type UserRole } from "@/util/status";
import CommissionsClient from "./client";

interface CommissionsPageProps {
  params: Promise<{ role: string }>;
}

export async function generateMetadata({
  params,
}: CommissionsPageProps): Promise<Metadata> {
  const { role } = await params;

  if (!isValidRole(role)) {
    return { title: "Not Found" };
  }

  const config = getRoleConfig(role as UserRole);

  return {
    title: `Commissions - ${config.label} | Dolu`,
    description: `${config.label} commission tracking for Real Estate Management System PLUS`,
  };
}

export default async function CommissionsPage({
  params,
}: CommissionsPageProps) {
  const { role } = await params;

  if (!isValidRole(role)) {
    notFound();
  }

  // Only admin can access Commissions
  if (role !== "admin") {
    redirect(`/dashboard/${role}/finance`);
  }

  return <CommissionsClient />;
}
