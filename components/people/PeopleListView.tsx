"use client";

import { useState, useMemo } from "react";
import CustomTable from "@/components/shared/CustomTable";
import SearchInput from "@/components/shared/CustomSearchInput";
import CustomMultiSelectFilter from "@/components/shared/CustomMultiSelectFilter";
import { PersonCell } from "@/components/overview";
import { PeopleHeader } from "./PeopleHeader";
import {
  PersonStatusBadge,
  PerformanceBadge,
  type PersonStatus,
  type PerformanceLevel,
} from "./PersonStatusBadge";
import { type UserRole } from "@/util/status";
import PersonDetailDialog, {
  mockPersonDetails,
  type PersonDetail,
  PersonDetailDialogWrapper,
} from "./PersonDetailDialog";
import { usePeople } from "@/hooks/usePeople";
import { FetchLoadingAndEmptyState } from "@/components/shared/FetchLoadinAndEmptyState";
import { CustomTableSkeleton } from "@/components/shared/CustomTableSkeleton";
import CustomTableEmptyState from "@/components/shared/CustomTableEmptyState";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface StaffMember {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  role: string;
  status: PersonStatus;
  performance: PerformanceLevel;
  lastActivity: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const staffMembers: StaffMember[] = [
  {
    id: "1",
    name: "John Ibekwe",
    initials: "JI",
    avatarColor: "#8a38f5",
    role: "Staff",
    status: "Active",
    performance: "Excellent",
    lastActivity: "Jul 10, 2026",
  },
  {
    id: "2",
    name: "James Agahowa",
    initials: "JA",
    avatarColor: "#38a5f5",
    role: "Staff",
    status: "Active",
    performance: "Satisfactory",
    lastActivity: "Jul 09, 2026",
  },
  {
    id: "3",
    name: "Lilian Tamuno",
    initials: "LT",
    avatarColor: "#f538a5",
    role: "Staff",
    status: "Dormant",
    performance: "Unsatisfactory",
    lastActivity: "Jun 28, 2026",
  },
  {
    id: "4",
    name: "Ebiere William",
    initials: "EW",
    avatarColor: "#f5a538",
    role: "Staff",
    status: "Active",
    performance: "Excellent",
    lastActivity: "Jul 10, 2026",
  },
  {
    id: "5",
    name: "Samson Tosin",
    initials: "ST",
    avatarColor: "#38f5a5",
    role: "Staff",
    status: "Active",
    performance: "Satisfactory",
    lastActivity: "Jul 08, 2026",
  },
];

const realtorMembers: StaffMember[] = [
  {
    id: "6",
    name: "David Okoro",
    initials: "DO",
    avatarColor: "#f53838",
    role: "Realtor",
    status: "Active",
    performance: "Excellent",
    lastActivity: "Jul 10, 2026",
  },
  {
    id: "7",
    name: "Grace Adeyemi",
    initials: "GA",
    avatarColor: "#3838f5",
    role: "Realtor",
    status: "Active",
    performance: "Satisfactory",
    lastActivity: "Jul 09, 2026",
  },
  {
    id: "8",
    name: "Tunde Balogun",
    initials: "TB",
    avatarColor: "#a538f5",
    role: "Realtor",
    status: "Dormant",
    performance: "Unsatisfactory",
    lastActivity: "Jun 20, 2026",
  },
];

/* ------------------------------------------------------------------ */
/*  Filter options                                                     */
/* ------------------------------------------------------------------ */

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Dormant", value: "Dormant" },
];

const performanceOptions = [
  { label: "Excellent", value: "Excellent" },
  { label: "Satisfactory", value: "Satisfactory" },
  { label: "Unsatisfactory", value: "Unsatisfactory" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface PeopleListViewProps {
  role: UserRole;
}

export default function PeopleListView({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  role,
}: PeopleListViewProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(string | number)[]>([]);
  const [performanceFilter, setPerformanceFilter] = useState<
    (string | number)[]
  >([]);
  const [selectedPerson, setSelectedPerson] = useState<PersonDetail | null>(
    null,
  );
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

    return result;
  }, [rawData, search, statusFilter, performanceFilter]);

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

  const handleRowClick = (row: Record<string, unknown>) => {
    const id = row._id as string;
    setSelectedPersonId(id);
    setDialogOpen(true);
  };

  const headers = ["Name", "Role", "Status", "Performance", "Last Activity"];
  const headerKeyMap: Record<string, string> = {
    Name: "name",
    Role: "role",
    Status: "status",
    Performance: "performance",
    "Last Activity": "lastActivity",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <PeopleHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Always-visible toolbar */}
      <div className="w-full overflow-hidden rounded-lg bg-[#f8f8f8] p-4">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
              {activeTab === 0 ? "Staff" : "Realtors"}
            </p>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by name..."
            />
          </div>
          <div className="flex items-center gap-2">
            <CustomMultiSelectFilter
              title="Status"
              options={statusOptions}
              selectedValues={statusFilter}
              onApplyFilter={setStatusFilter}
            />
            <CustomMultiSelectFilter
              title="Performance"
              options={performanceOptions}
              selectedValues={performanceFilter}
              onApplyFilter={setPerformanceFilter}
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
              emptyMessage={`No ${activeTab === 0 ? "staff members" : "realtors"} found.`}
            />
          }
        >
          {/* Table */}
          <CustomTable
            headers={headers}
            data={tableData}
            headerKeyMap={headerKeyMap}
            onRowClick={handleRowClick}
          />
        </FetchLoadingAndEmptyState>
      </div>

      {/* Person detail dialog */}
      <PersonDetailDialogWrapper
        selectedPersonId={selectedPersonId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
