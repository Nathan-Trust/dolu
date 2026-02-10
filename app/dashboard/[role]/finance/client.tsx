"use client";

import { useMemo, useState } from "react";
import FinanceOverview from "@/components/finance/FinanceOverview";
import SalesIncome from "@/components/finance/SalesIncome";
import Expenses from "@/components/finance/Expenses";
import Invoices from "@/components/finance/Invoices";
import { type UserRole } from "@/util/status";

/* ------------------------------------------------------------------ */
/*  Role-based sub-tab visibility                                      */
/*  Chairman  → Overview only                                          */
/*  Admin     → All tabs                                               */
/*  Staff     → Overview + Sales Income                                */
/*  Realtor   → No access (redirected at page level)                   */
/* ------------------------------------------------------------------ */

const allSubTabs = [
  "Overview",
  "Sales Income",
  "Expenses",
  "Invoices",
] as const;
type FinanceSubTab = (typeof allSubTabs)[number];

const tabsByRole: Record<UserRole, readonly FinanceSubTab[]> = {
  admin: allSubTabs,
  chairman: ["Overview"],
  staff: ["Overview", "Sales Income"],
  realtor: [], // never rendered — realtor is redirected
};

interface FinanceClientProps {
  role: UserRole;
}

export default function FinanceClient({ role }: FinanceClientProps) {
  const visibleTabs = useMemo(() => tabsByRole[role] ?? ["Overview"], [role]);
  const [activeTab, setActiveTab] = useState<FinanceSubTab>(
    visibleTabs[0] ?? "Overview",
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
          Finance
        </h1>
        <p className="font-montserrat text-xs text-[#6f6d6d]">
          Session <span className="font-bold">Jul 10, 2026</span>
        </p>
      </div>

      {/* Sub-tab navigation (hidden when only one tab) */}
      {visibleTabs.length > 1 && (
        <div className="flex gap-4 overflow-x-auto border-b border-[#e0e0e0]">
          {visibleTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 whitespace-nowrap pb-2 font-montserrat text-sm transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-[#8a38f5] font-bold text-[#8a38f5]"
                  : "font-normal text-[#6f6d6d] hover:text-[#0f0f0f]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      {activeTab === "Overview" && <FinanceOverview />}
      {activeTab === "Sales Income" && <SalesIncome />}
      {activeTab === "Expenses" && <Expenses />}
      {activeTab === "Invoices" && <Invoices />}
    </div>
  );
}
