"use client";

import { useState } from "react";
import Procurements from "@/components/finance/Procurements";
import SalaryPayments from "@/components/finance/SalaryPayments";

const subTabs = ["Procurements", "Salary Payments"] as const;
type ExpensesSubTab = (typeof subTabs)[number];

export default function ExpensesClient() {
  const [activeTab, setActiveTab] = useState<ExpensesSubTab>("Procurements");

  return (
    <div className="flex flex-col gap-6">
      {/* Page header with breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-montserrat text-lg">
          <span className="font-normal text-[#6f6d6d]">Finance</span>
          <span className="font-normal text-[#6f6d6d]">&gt;</span>
          <span className="font-bold text-[#0f0f0f]">Expenses</span>
        </div>
        <p className="font-montserrat text-xs text-[#6f6d6d]">
          Session <span className="font-bold">Jul 10, 2026</span>
        </p>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex gap-4 border-b border-[#e0e0e0]">
        {subTabs.map((tab) => (
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

      {/* Tab content */}
      {activeTab === "Procurements" && <Procurements />}
      {activeTab === "Salary Payments" && <SalaryPayments />}
    </div>
  );
}
