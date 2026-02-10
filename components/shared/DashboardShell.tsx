"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/shared/Sidebar";
import TopNavBar from "@/components/shared/TopNavBar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { type UserRole } from "@/util/status";

interface DashboardShellProps {
  role: UserRole;
  children: React.ReactNode;
}

export default function DashboardShell({
  role,
  children,
}: DashboardShellProps) {
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f3f3f3]">
      {/* Desktop sidebar */}
      {!isMobile && <Sidebar role={role} />}

      {/* Mobile sidebar via Sheet */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="left"
            showCloseButton={false}
            className="w-65.75 max-w-65.75! border-none bg-black p-0"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Sidebar role={role} onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top nav bar */}
        <TopNavBar
          mobileMenuButton={
            isMobile ? (
              <button
                onClick={() => setSidebarOpen(true)}
                className="shrink-0 rounded-lg p-2 hover:bg-[#e0e0e0]"
              >
                <Menu className="size-6 text-[#0f0f0f]" />
              </button>
            ) : undefined
          }
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-hide p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
