"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomTable from "@/components/shared/CustomTable";
import SearchInput from "@/components/shared/CustomSearchInput";
import CustomMultiSelectFilter from "@/components/shared/CustomMultiSelectFilter";
import { UnitStatusBadge, type UnitStatus } from "./UnitStatusBadge";
import { RoleBadge } from "@/components/shared/RoleBadge";
import {
  NewlyAddedEstateCard,
  type NewlyAddedEstate,
} from "./NewlyAddedEstateCard";
import UnitDetailDialog, { mockUnitDetails } from "./UnitDetailDialog";
import AddUnitSheet from "./AddUnitSheet";
import SuccessDialog from "@/components/shared/SuccessDialog";
import { type UserRole } from "@/util/status";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface UnitRecord {
  id: string;
  unitId: string;
  type: string;
  priceRange: string;
  status: UnitStatus;
  assignedClient: string;
  agent: {
    name: string;
    role: UserRole;
    avatar?: string;
  };
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const mockUnits: UnitRecord[] = [
  {
    id: "u1",
    unitId: "001",
    type: "2 Bedroom Duplex",
    priceRange: "₦15,000,000 - ₦20,000,000",
    status: "Available",
    assignedClient: "Nil",
    agent: { name: "John Ibekwe", role: "realtor" },
  },
  {
    id: "u2",
    unitId: "001",
    type: "2 Bedroom Duplex",
    priceRange: "₦15,000,000 - ₦20,000,000",
    status: "Reserved",
    assignedClient: "Peter Abbey",
    agent: { name: "John Ibekwe", role: "staff" },
  },
  {
    id: "u3",
    unitId: "001",
    type: "2 Bedroom Duplex",
    priceRange: "₦15,000,000 - ₦20,000,000",
    status: "Sold",
    assignedClient: "Peter Abbey",
    agent: { name: "John Ibekwe", role: "realtor" },
  },
  {
    id: "u4",
    unitId: "001",
    type: "2 Bedroom Duplex",
    priceRange: "₦15,000,000 - ₦20,000,000",
    status: "Available",
    assignedClient: "Nil",
    agent: { name: "John Ibekwe", role: "staff" },
  },
  {
    id: "u5",
    unitId: "001",
    type: "2 Bedroom Duplex",
    priceRange: "₦15,000,000 - ₦20,000,000",
    status: "Available",
    assignedClient: "Nil",
    agent: { name: "John Ibekwe", role: "staff" },
  },
];

const mockNewEstates: NewlyAddedEstate[] = [
  {
    id: "ne1",
    name: "Peace Prime Estate",
    location: "Asokoro, Abuja",
    totalUnits: 24,
    availableUnits: 4,
    sold: 20,
    timeAgo: "Just now",
  },
  {
    id: "ne2",
    name: "Peace Prime Estate",
    location: "Asokoro, Abuja",
    totalUnits: 24,
    availableUnits: 4,
    sold: 20,
    timeAgo: "Just now",
  },
  {
    id: "ne3",
    name: "Peace Prime Estate",
    location: "Asokoro, Abuja",
    totalUnits: 24,
    availableUnits: 4,
    sold: 20,
    timeAgo: "2 Mins ago",
  },
  {
    id: "ne4",
    name: "Peace Prime Estate",
    location: "Asokoro, Abuja",
    totalUnits: 24,
    availableUnits: 4,
    sold: 20,
    timeAgo: "2 Days ago",
  },
];

/* Estate name lookup (mock) */
const estateNameMap: Record<string, string> = {
  e1: "Joy Valley Hills",
  e2: "Joy Valley Hills",
  e3: "Joy Valley Hills",
  e4: "Joy Valley Hills",
  e5: "Joy Valley Hills",
};

/* ------------------------------------------------------------------ */
/*  Filter options                                                     */
/* ------------------------------------------------------------------ */

const assignedToOptions = [
  { label: "John Ibekwe", value: "John Ibekwe" },
  { label: "Peter Abbey", value: "Peter Abbey" },
  { label: "Nil", value: "Nil" },
];

const statusOptions = [
  { label: "Available", value: "Available" },
  { label: "Reserved", value: "Reserved" },
  { label: "Sold", value: "Sold" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface InventoryListViewProps {
  role: UserRole;
  estateId: string;
  isReadOnly?: boolean;
}

export default function InventoryListView({
  role,
  estateId,
  isReadOnly = false,
}: InventoryListViewProps) {
  const router = useRouter();
  const params = useParams();
  const currentRole = params.role as string;

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [assignedFilter, setAssignedFilter] = useState<(string | number)[]>([]);
  const [statusFilter, setStatusFilter] = useState<(string | number)[]>([]);
  const [addUnitOpen, setAddUnitOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [submittedUnit, setSubmittedUnit] = useState<{
    type: string;
    estate: string;
  } | null>(null);

  const estateName = estateNameMap[estateId] ?? "Estate";

  const canAddUnit = role === "admin";

  /* Data filtering */
  const filteredData = useMemo(() => {
    let result = mockUnits;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.unitId.toLowerCase().includes(q) ||
          u.type.toLowerCase().includes(q) ||
          u.assignedClient.toLowerCase().includes(q) ||
          u.agent.name.toLowerCase().includes(q),
      );
    }

    if (assignedFilter.length > 0) {
      result = result.filter(
        (u) =>
          assignedFilter.includes(u.agent.name) ||
          assignedFilter.includes(u.assignedClient),
      );
    }

    if (statusFilter.length > 0) {
      result = result.filter((u) => statusFilter.includes(u.status));
    }

    return result;
  }, [search, assignedFilter, statusFilter]);

  /* Build table rows */
  const tableData = filteredData.map((u) => ({
    unitId: u.unitId,
    type: u.type,
    priceRange: u.priceRange,
    status: <UnitStatusBadge status={u.status} />,
    assignedClient: u.assignedClient,
    agent: (
      <div className="flex items-center gap-2">
        {/* Avatar placeholder */}
        <div className="flex size-6 items-center justify-center rounded-full bg-[#c8c8c8]">
          <span className="font-montserrat text-[8px] font-bold text-white">
            {u.agent.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>
        <span className="font-montserrat text-sm text-[#0f0f0f]">
          {u.agent.name}
        </span>
        <RoleBadge role={u.agent.role} />
      </div>
    ),
  }));

  const headers = [
    "Unit ID",
    "Type",
    "Price Range",
    "Status",
    "Assigned Client",
    "Agent",
  ];

  const headerKeyMap: Record<string, string> = {
    "Unit ID": "unitId",
    Type: "type",
    "Price Range": "priceRange",
    Status: "status",
    "Assigned Client": "assignedClient",
    Agent: "agent",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
            Properties
          </h1>
          <p className="font-montserrat text-xs text-[#6f6d6d]">
            Session <span className="font-bold">Jul 10, 2026</span>
          </p>
        </div>

        {canAddUnit && !isReadOnly && (
          <div className="flex justify-end">
            <Button
              onClick={() => setAddUnitOpen(true)}
              className="gap-1 rounded-lg bg-[#8a38f5] px-1 py-1 font-montserrat text-sm font-bold text-[#f8f8f8] hover:bg-[#7a2de0]"
            >
              Add Unit
              <Building2 className="size-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Inventory table */}
      <CustomTable
        title={estateName}
        searchSlot={
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search"
          />
        }
        headerRight={
          <div className="flex items-center gap-4">
            <CustomMultiSelectFilter
              title="Assigned to"
              options={assignedToOptions}
              selectedValues={assignedFilter}
              onApplyFilter={setAssignedFilter}
            />
            <CustomMultiSelectFilter
              title="Status"
              options={statusOptions}
              selectedValues={statusFilter}
              onApplyFilter={setStatusFilter}
            />
          </div>
        }
        headers={headers}
        data={tableData}
        headerKeyMap={headerKeyMap}
        onRowClick={(_, index) => {
          const unit = filteredData[index];
          if (unit) {
            setSelectedUnitId(unit.id);
            setDialogOpen(true);
          }
        }}
      />

      {/* Unit detail modal */}
      <UnitDetailDialog
        unit={selectedUnitId ? (mockUnitDetails[selectedUnitId] ?? null) : null}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* Add Unit Sheet */}
      <AddUnitSheet
        open={addUnitOpen}
        onOpenChange={setAddUnitOpen}
        estateName={estateName}
        onSuccess={(unit) => {
          setSubmittedUnit(unit);
          setSuccessOpen(true);
        }}
      />

      {/* Success Dialog */}
      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Success! New Unit Added"
        description={
          submittedUnit
            ? `You have successfully added ${submittedUnit.type} to ${submittedUnit.estate}`
            : ""
        }
        actionLabel="View Unit"
        onAction={() => setSuccessOpen(false)}
      />

      {/* Newly Added Estates */}
      <div className="flex flex-col gap-2.5">
        <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
          Newly Added Estates
        </p>
        <div className="flex gap-5.5 overflow-x-auto">
          {mockNewEstates.map((estate) => (
            <NewlyAddedEstateCard
              key={estate.id}
              estate={estate}
              onExplore={(id) => {
                router.push(
                  `/dashboard/${currentRole}/properties/${id}/inventory`,
                );
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
