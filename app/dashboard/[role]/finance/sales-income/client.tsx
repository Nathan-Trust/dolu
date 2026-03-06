"use client";

import SalesIncome from "@/components/finance/SalesIncome";

export default function SalesIncomeClient() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header with breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-montserrat text-lg">
          <span className="font-normal text-[#6f6d6d]">Finance</span>
          <span className="font-normal text-[#6f6d6d]">&gt;</span>
          <span className="font-bold text-[#0f0f0f]">Sales Income</span>
        </div>
        <p className="font-montserrat text-xs text-[#6f6d6d]">
          Session <span className="font-bold">Jul 10, 2026</span>
        </p>
      </div>

      <SalesIncome />
    </div>
  );
}
