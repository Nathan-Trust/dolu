import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidRole, getRoleConfig, type UserRole } from "@/util/status";
import OverviewClient from "./client";

interface OverviewPageProps {
  params: Promise<{ role: string }>;
}

export async function generateMetadata({
  params,
}: OverviewPageProps): Promise<Metadata> {
  const { role } = await params;

  if (!isValidRole(role)) {
    return { title: "Not Found" };
  }

  const config = getRoleConfig(role as UserRole);

  return {
    title: `Overview - ${config.label} | Dolu`,
    description: `${config.label} dashboard overview for Real Estate Management System PLUS`,
  };
}

export default async function OverviewPage({ params }: OverviewPageProps) {
  const { role } = await params;

  if (!isValidRole(role)) {
    notFound();
  }

  return <OverviewClient role={role as UserRole} />;
}
