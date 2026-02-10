import { notFound } from "next/navigation";
import { isValidRole, type UserRole } from "@/util/status";
import DashboardShell from "@/components/shared/DashboardShell";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { role } = await params;

  if (!isValidRole(role)) {
    notFound();
  }

  return <DashboardShell role={role as UserRole}>{children}</DashboardShell>;
}
