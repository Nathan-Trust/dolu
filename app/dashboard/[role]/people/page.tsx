import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidRole, getRoleConfig, type UserRole } from "@/util/status";
import PeopleClient from "./client";

interface PeoplePageProps {
  params: Promise<{ role: string }>;
}

export async function generateMetadata({
  params,
}: PeoplePageProps): Promise<Metadata> {
  const { role } = await params;

  if (!isValidRole(role)) {
    return { title: "Not Found" };
  }

  const config = getRoleConfig(role as UserRole);

  return {
    title: `People - ${config.label} | Dolu`,
    description: `${config.label} people management for Real Estate Management System PLUS`,
  };
}

export default async function PeoplePage({ params }: PeoplePageProps) {
  const { role } = await params;

  if (!isValidRole(role)) {
    notFound();
  }

  return <PeopleClient role={role as UserRole} />;
}
