import { notFound } from "next/navigation";
import { isValidRole, type UserRole } from "@/util/status";
import Sidebar from "@/components/shared/Sidebar";
import TopNavBar from "@/components/shared/TopNavBar";

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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f3f3f3]">
      {/* Sidebar */}
      <Sidebar role={role as UserRole} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top nav bar */}
        <TopNavBar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
