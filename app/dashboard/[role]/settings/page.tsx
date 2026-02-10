import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidRole, getRoleConfig, type UserRole } from "@/util/status";
import SettingsClient from "./client";

interface SettingsPageProps {
  params: Promise<{ role: string }>;
}

export async function generateMetadata({
  params,
}: SettingsPageProps): Promise<Metadata> {
  const { role } = await params;

  if (!isValidRole(role)) {
    return { title: "Not Found" };
  }

  const config = getRoleConfig(role as UserRole);

  return {
    title: `Settings - ${config.label} | Dolu`,
    description: `${config.label} settings for Real Estate Management System PLUS`,
  };
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { role } = await params;

  if (!isValidRole(role)) {
    notFound();
  }

  return <SettingsClient role={role as UserRole} />;
}
