/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import CustomTable from "@/components/shared/CustomTable";
import SearchInput from "@/components/shared/CustomSearchInput";
import CustomMultiSelectFilter from "@/components/shared/CustomMultiSelectFilter";
import { PersonCell } from "@/components/overview";
import { ReportsHeader } from "./ReportsHeader";
import {
  PersonStatusBadge,
  PerformanceBadge,
  type PersonStatus,
  type PerformanceLevel,
} from "@/components/people/PersonStatusBadge";
import { type UserRole } from "@/util/status";
import { usePeople } from "@/hooks/usePeople";
import { FetchLoadingAndEmptyState } from "@/components/shared/FetchLoadinAndEmptyState";
import { CustomTableSkeleton } from "@/components/shared/CustomTableSkeleton";
import CustomTableEmptyState from "@/components/shared/CustomTableEmptyState";
import { PersonDetailDialogWrapper } from "@/components/people/PersonDetailDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ReportType = "Sales Performance" | "Activity Report" | "Attendance Report";

/* ------------------------------------------------------------------ */
/*  Filter options                                                     */
/* ------------------------------------------------------------------ */

const reportTypeOptions: { label: string; value: ReportType }[] = [
  { label: "Sales Performance", value: "Sales Performance" },
  { label: "Activity Report", value: "Activity Report" },
  { label: "Attendance Report", value: "Attendance Report" },
];

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Dormant", value: "Dormant" },
];

const performanceOptions = [
  { label: "Excellent", value: "Excellent" },
  { label: "Satisfactory", value: "Satisfactory" },
  { label: "Unsatisfactory", value: "Unsatisfactory" },
];

const roleFilterOptions = [
  { label: "Staff", value: "Staff" },
  { label: "Realtor", value: "Realtor" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface ReportsListViewProps {
  role: UserRole;
  isReadOnly?: boolean;
}

export default function ReportsListView({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  role,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isReadOnly = false,
}: ReportsListViewProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] =
    useState<ReportType>("Sales Performance");
  const [statusFilter, setStatusFilter] = useState<(string | number)[]>([]);
  const [performanceFilter, setPerformanceFilter] = useState<
    (string | number)[]
  >([]);
  const [roleFilter, setRoleFilter] = useState<(string | number)[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  /* Fetch people from API */
  const { isLoading, data: peopleData } = usePeople();

  /* Filter by role tab */
  const rawData = useMemo(() => {
    const people = (peopleData?.data ?? []) as any[];
    if (activeTab === 0) {
      // Staff tab - filter for role containing 'Staff'
      return people.filter((p: any) =>
        (p.role?.name || "").toLowerCase().includes("staff"),
      );
    } else {
      // Realtors tab - filter for role containing 'Realtor'
      return people.filter((p: any) =>
        (p.role?.name || "").toLowerCase().includes("realtor"),
      );
    }
  }, [peopleData, activeTab]);

  const filteredData = useMemo(() => {
    let result = rawData;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((m: any) => {
        const name = `${m.first_name ?? ""} ${m.last_name ?? ""}`.toLowerCase();
        return (
          name.includes(q) || (m.role?.name ?? "").toLowerCase().includes(q)
        );
      });
    }

    if (statusFilter.length > 0) {
      result = result.filter((m: any) => statusFilter.includes(m.status));
    }

    if (performanceFilter.length > 0) {
      result = result.filter((m: any) =>
        performanceFilter.includes(m.performance),
      );
    }

    if (roleFilter.length > 0) {
      result = result.filter((m: any) =>
        roleFilter.some((r) =>
          (m.role?.name ?? "")
            .toLowerCase()
            .includes((r as string).toLowerCase()),
        ),
      );
    }

    return result;
  }, [rawData, search, statusFilter, performanceFilter, roleFilter]);

  /* Build renderable rows for CustomTable */
  const tableData = filteredData.map((m: any) => {
    const name =
      `${m.first_name ?? ""} ${m.last_name ?? ""}`.trim() ||
      m.email ||
      "Unknown";
    const initials = name
      .split(" ")
      .map((p: string) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return {
      _id: String(m.id ?? ""),
      name: <PersonCell name={name} initials={initials} color="#8a38f5" />,
      role: m.role?.name || "Unknown",
      status: (
        <PersonStatusBadge status={(m.status as PersonStatus) ?? "Active"} />
      ),
      performance: (
        <PerformanceBadge
          level={(m.performance as PerformanceLevel) ?? "Satisfactory"}
        />
      ),
      lastActivity: m.last_active ?? m.updated_at ?? "-",
    };
  });

  const headers = ["Name", "Role", "Status", "Perfomance", "Last Activity"];
  const headerKeyMap: Record<string, string> = {
    Name: "name",
    Role: "role",
    Status: "status",
    Perfomance: "performance",
    "Last Activity": "lastActivity",
  };

  /* Report Type Dropdown */
  const ReportDropdown = (
    <div className="flex items-center gap-2">
      <span className="font-montserrat text-sm font-bold text-[#0f0f0f]">
        Report
      </span>
      <Select
        value={selectedReport}
        onValueChange={(value) => setSelectedReport(value as ReportType)}
      >
        <SelectTrigger className="h-auto w-auto min-w-[140px] rounded-lg border border-[#e0e0e0] bg-white px-2 py-1 font-montserrat text-xs text-[#6f6d6d] shadow-none hover:border-[#c8c8c8]">
          <SelectValue placeholder="Select report" />
        </SelectTrigger>
        <SelectContent>
          {reportTypeOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="font-montserrat text-xs"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <ReportsHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Always-visible toolbar */}
      <div className="w-full overflow-hidden rounded-lg bg-[#f8f8f8] p-4">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            {ReportDropdown}
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search"
            />
          </div>
          <div className="flex items-center gap-2">
            <CustomMultiSelectFilter
              title="Report Type"
              options={reportTypeOptions}
              selectedValues={[]}
              onApplyFilter={() => {}}
            />
            <CustomMultiSelectFilter
              title="Status"
              options={statusOptions}
              selectedValues={statusFilter}
              onApplyFilter={setStatusFilter}
            />
            <CustomMultiSelectFilter
              title="Role"
              options={roleFilterOptions}
              selectedValues={roleFilter}
              onApplyFilter={setRoleFilter}
            />
            <CustomMultiSelectFilter
              title="Date Range"
              options={[]}
              selectedValues={[]}
              onApplyFilter={() => {}}
            />
          </div>
        </div>

        <FetchLoadingAndEmptyState
          isLoading={isLoading}
          data={tableData.length}
          numberOfSkeleton={1}
          skeleton={<CustomTableSkeleton headers={headers} rows={5} />}
          emptyState={
            <CustomTableEmptyState
              headers={headers}
              emptyMessage={`No ${activeTab === 0 ? "staff" : "realtor"} reports found.`}
            />
          }
        >
          {/* Table */}
          <CustomTable
            headers={headers}
            data={tableData}
            headerKeyMap={headerKeyMap}
            onRowClick={(row) => {
              const id = row._id as string;
              setSelectedPersonId(id);
              setDialogOpen(true);
            }}
          />
        </FetchLoadingAndEmptyState>
      </div>

      {/* Person report detail dialog */}
      <PersonDetailDialogWrapper
        selectedPersonId={selectedPersonId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
