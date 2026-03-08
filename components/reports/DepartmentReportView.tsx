"use client";

import { useState } from "react";
import CustomTable from "@/components/shared/CustomTable";
import { PersonCell, StatusBadge } from "@/components/overview";
import { Badge } from "@/components/ui/badge";
import ReportDetailDialog from "./ReportDetailDialog";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type DepartmentType = "Sales" | "Finance" | "Procurement" | "Manager";

/* ------------------------------------------------------------------ */
/*  Badge config per department                                         */
/* ------------------------------------------------------------------ */

const departmentBadgeConfig: Record<
  DepartmentType,
  { bg: string; text: string }
> = {
  Sales: { bg: "#DDF6E2", text: "#34C759" },
  Finance: { bg: "#D9EDFF", text: "#0088FF" },
  Procurement: { bg: "#DDDBFF", text: "#6155F5" },
  Manager: { bg: "#FFE5D9", text: "#FF6B35" },
};

/* ------------------------------------------------------------------ */
/*  Summary stats config per department                                 */
/* ------------------------------------------------------------------ */

interface SummaryItem {
  label: string;
  value: string;
  bold?: boolean;
}

function getSummaryStats(dept: DepartmentType): SummaryItem[][] {
  if (dept === "Procurement" || dept === "Manager") {
    return [
      [
        { label: "Total Requests", value: "48", bold: true },
        { label: "Total Approved", value: "12", bold: true },
        { label: "Total Purchases", value: "6", bold: true },
        { label: "Total Procurement Spend", value: "₦323,000,000", bold: true },
      ],
    ];
  }
  // Sales and Finance share the same summary layout
  return [
    [
      { label: "Total Clients Contacted", value: "48", bold: true },
      { label: "Total Inspections", value: "12", bold: true },
      { label: "Total Deals Closed", value: "6", bold: true },
      { label: "Revenue Generated", value: "₦323,000,000", bold: true },
    ],
    [
      { label: "Reports Submitted", value: "3", bold: true },
      { label: "Pending Reports", value: "2", bold: true },
      { label: "Missed Reports", value: "2", bold: true },
    ],
  ];
}

/* ------------------------------------------------------------------ */
/*  Table config per department                                         */
/* ------------------------------------------------------------------ */

function getSalesTableData() {
  const headers = [
    "Staff",
    "Reporting Week",
    "Clients",
    "Inspections",
    "Deals",
    "Status",
  ];
  const headerKeyMap: Record<string, string> = {
    Staff: "staff",
    "Reporting Week": "reportingWeek",
    Clients: "clients",
    Inspections: "inspections",
    Deals: "deals",
    Status: "status",
  };
  const data = [
    {
      id: "1",
      staff: <PersonCell name="John Ibekwe" initials="JI" color="#34c759" />,
      reportingWeek: "Mar 10–16",
      clients: "8",
      inspections: "2",
      deals: "1",
      status: <StatusBadge label="Submitted" />,
    },
    {
      id: "2",
      staff: <PersonCell name="John Ibekwe" initials="JI" color="#0088ff" />,
      reportingWeek: "Mar 10–16",
      clients: "8",
      inspections: "2",
      deals: "1",
      status: <StatusBadge label="Submitted" />,
    },
    {
      id: "3",
      staff: <PersonCell name="John Ibekwe" initials="JI" color="#ff8d28" />,
      reportingWeek: "Mar 10–16",
      clients: "8",
      inspections: "2",
      deals: "1",
      status: <StatusBadge label="Submitted" />,
    },
    {
      id: "4",
      staff: <PersonCell name="John Ibekwe" initials="JI" color="#8a38f5" />,
      reportingWeek: "Mar 10–16",
      clients: "8",
      inspections: "2",
      deals: "1",
      status: <StatusBadge label="Pending" />,
    },
    {
      id: "5",
      staff: <PersonCell name="John Ibekwe" initials="JI" color="#ff383c" />,
      reportingWeek: "Mar 10–16",
      clients: "8",
      inspections: "2",
      deals: "1",
      status: <StatusBadge label="Missed" />,
    },
    {
      id: "6",
      staff: <PersonCell name="John Ibekwe" initials="JI" color="#38c8f5" />,
      reportingWeek: "Mar 10–16",
      clients: "8",
      inspections: "2",
      deals: "1",
      status: <StatusBadge label="Pending" />,
    },
  ];
  return { headers, headerKeyMap, data };
}

function getFinanceTableData() {
  const headers = [
    "Staff",
    "Reporting Week",
    "Invoices",
    "Payments",
    "Expenses",
    "Value Processes",
    "Date",
  ];
  const headerKeyMap: Record<string, string> = {
    Staff: "staff",
    "Reporting Week": "reportingWeek",
    Invoices: "invoices",
    Payments: "payments",
    Expenses: "expenses",
    "Value Processes": "valueProcesses",
    Date: "date",
  };
  const data = Array.from({ length: 6 }, (_, i) => ({
    id: String(i + 1),
    staff: (
      <PersonCell
        name="Grace Obi"
        initials="GO"
        color={
          ["#34c759", "#0088ff", "#ff8d28", "#8a38f5", "#ff383c", "#38c8f5"][i]
        }
      />
    ),
    reportingWeek: "Mar 10–16",
    invoices: "8",
    payments: "2",
    expenses: "1",
    valueProcesses: "₦7,520,000",
    date: "Mar 11, 2026",
  }));
  return { headers, headerKeyMap, data };
}

function getProcurementTableData() {
  const headers = [
    "Staff",
    "Reporting Week",
    "Invoices",
    "Payments",
    "Expenses",
    "Value Processes",
    "Date",
  ];
  const headerKeyMap: Record<string, string> = {
    Staff: "staff",
    "Reporting Week": "reportingWeek",
    Invoices: "invoices",
    Payments: "payments",
    Expenses: "expenses",
    "Value Processes": "valueProcesses",
    Date: "date",
  };
  const data = Array.from({ length: 6 }, (_, i) => ({
    id: String(i + 1),
    staff: (
      <PersonCell
        name="Grace Obi"
        initials="GO"
        color={
          ["#34c759", "#0088ff", "#ff8d28", "#8a38f5", "#ff383c", "#38c8f5"][i]
        }
      />
    ),
    reportingWeek: "Mar 10–16",
    invoices: "8",
    payments: "2",
    expenses: "1",
    valueProcesses: "₦7,520,000",
    date: "Mar 11, 2026",
  }));
  return { headers, headerKeyMap, data };
}

function getTableConfig(dept: DepartmentType): {
  headers: string[];
  headerKeyMap: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
} {
  switch (dept) {
    case "Sales":
      return getSalesTableData();
    case "Finance":
      return getFinanceTableData();
    case "Procurement":
    case "Manager":
      return getProcurementTableData();
  }
}

/* ------------------------------------------------------------------ */
/*  Pagination                                                         */
/* ------------------------------------------------------------------ */

function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = [1, 2, 3];
  const totalPages = 68;

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        className="flex items-center gap-1 font-montserrat text-sm text-[#c8c8c8] disabled:cursor-not-allowed"
      >
        ← Previous
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => setCurrentPage(p)}
          className={`flex size-8 items-center justify-center rounded-lg font-montserrat text-sm ${
            currentPage === p
              ? "bg-[#8a38f5] text-white"
              : "text-[#0f0f0f] hover:bg-[#f3f3f3]"
          }`}
        >
          {p}
        </button>
      ))}
      <span className="font-montserrat text-sm text-[#6f6d6d]">...</span>
      <button
        onClick={() => setCurrentPage(67)}
        className="flex size-8 items-center justify-center rounded-lg font-montserrat text-sm text-[#0f0f0f] hover:bg-[#f3f3f3]"
      >
        67
      </button>
      <button
        onClick={() => setCurrentPage(totalPages)}
        className="flex size-8 items-center justify-center rounded-lg font-montserrat text-sm text-[#0f0f0f] hover:bg-[#f3f3f3]"
      >
        68
      </button>
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        className="flex items-center gap-1 font-montserrat text-sm text-[#0f0f0f] disabled:cursor-not-allowed disabled:text-[#c8c8c8]"
      >
        Next →
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface DepartmentReportViewProps {
  department: DepartmentType;
}

export default function DepartmentReportView({
  department,
}: DepartmentReportViewProps) {
  const badgeConfig = departmentBadgeConfig[department];
  const summaryRows = getSummaryStats(department);
  const { headers, headerKeyMap, data } = getTableConfig(department);
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Report Summary */}
      <div className="flex flex-col gap-3 rounded-lg bg-[#f8f8f8] p-4">
        <div className="flex items-center gap-3">
          <p className="font-montserrat text-base font-bold text-[#0f0f0f]">
            Report Summary
          </p>
          <p className="font-montserrat text-sm font-normal text-[#0f0f0f]">
            Week 02 <span className="font-bold">Jan 8 – Jan 14</span>
          </p>
          <Badge
            className="rounded-lg border-0 px-2 py-0.5 font-montserrat text-xs font-semibold"
            style={{ backgroundColor: badgeConfig.bg, color: badgeConfig.text }}
          >
            {department}
          </Badge>
        </div>

        {summaryRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap items-center gap-6">
            {row.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className="font-montserrat text-sm font-normal text-[#0f0f0f]">
                  {item.label}
                </span>
                <span className="font-montserrat text-sm font-bold text-[#0f0f0f]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Data Table */}
      <CustomTable
        headers={headers}
        data={data}
        headerKeyMap={headerKeyMap}
        onRowClick={
          department === "Sales" ? () => setDetailOpen(true) : undefined
        }
      />

      {/* Pagination */}
      <Pagination />

      {/* Sales Detail Dialog */}
      {department === "Sales" && (
        <ReportDetailDialog
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </div>
  );
}
