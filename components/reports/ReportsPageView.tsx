"use client";

import { useState } from "react";
import { type UserRole } from "@/util/status";
import SubmitReportForm from "./SubmitReportForm";
import ViewReportsTab from "./ViewReportsTab";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface ReportsPageViewProps {
  role: UserRole;
}

export default function ReportsPageView({ role }: ReportsPageViewProps) {
  const [activeTab, setActiveTab] = useState<"submit" | "view">("submit");

  // Count badge for View Reports tab (mock)
  const viewReportsCount = 3;

  // Roles that can submit reports (staff/realtor submit their own)
  const canSubmit = ["staff", "realtor"].includes(role);

  // Roles that primarily view reports (admin/chairman/manager/finance/procurement)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const canView = !canSubmit;

  // If user can only view (not submit), default to view tab
  const effectiveTab =
    !canSubmit && activeTab === "submit" ? "view" : activeTab;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
          Reports
        </h1>
        <p className="font-montserrat text-xs text-[#6f6d6d]">
          Session <span className="font-bold">Jul 10, 2026</span>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 rounded-lg bg-[#f8f8f8] p-4">
        <button
          onClick={() => setActiveTab("submit")}
          className={`px-4 py-4 font-montserrat text-base ${
            effectiveTab === "submit"
              ? "border-b-2 border-[#0f0f0f] font-bold text-[#0f0f0f]"
              : "font-normal text-[#6f6d6d]"
          }`}
        >
          Submit Report
        </button>
        <button
          onClick={() => setActiveTab("view")}
          className={`flex items-center gap-2 px-4 py-4 font-montserrat text-base ${
            effectiveTab === "view"
              ? "border-b-2 border-[#0f0f0f] font-bold text-[#0f0f0f]"
              : "font-normal text-[#6f6d6d]"
          }`}
        >
          View Reports
          <span className="flex size-5 items-center justify-center rounded-full bg-[#ff383c] font-montserrat text-[10px] font-bold text-white">
            {viewReportsCount}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg bg-[#f8f8f8] p-4">
        {effectiveTab === "submit" && canSubmit && <SubmitReportForm />}
        {effectiveTab === "view" && <ViewReportsTab />}
        {effectiveTab === "submit" && !canSubmit && <ViewReportsTab />}
      </div>
    </div>
  );
}
