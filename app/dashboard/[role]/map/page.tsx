import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidRole, getRoleConfig, type UserRole } from "@/util/status";
import MapClient from "./client";

interface MapPageProps {
  params: Promise<{ role: string }>;
}

export async function generateMetadata({
  params,
}: MapPageProps): Promise<Metadata> {
  const { role } = await params;

  if (!isValidRole(role)) {
    return { title: "Not Found" };
  }

  const config = getRoleConfig(role as UserRole);

  return {
    title: `Maps - ${config.label} | Dolu`,
    description: `${config.label} estate map view for Real Estate Management System PLUS`,
  };
}

export default async function MapPage({ params }: MapPageProps) {
  const { role } = await params;

  if (!isValidRole(role)) {
    notFound();
  }

  return <MapClient role={role as UserRole} />;
}
