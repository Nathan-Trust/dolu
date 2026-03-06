/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useEstate } from "@/hooks/useEstate";
import { useEstates } from "@/hooks/useEstates";
import AddUnitSheet from "./AddUnitSheet";
import SuccessDialog from "@/components/shared/SuccessDialog";
import { type UserRole } from "@/util/status";
import { FetchLoadingAndEmptyState } from "@/components/shared/FetchLoadinAndEmptyState";
import { CustomTableSkeleton } from "@/components/shared/CustomTableSkeleton";
import CustomTableEmptyState from "@/components/shared/CustomTableEmptyState";

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

/* ------------------------------------------------------------------ */
/*  Time-ago helper                                                    */
/* ------------------------------------------------------------------ */

function timeAgo(dateStr?: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} Min${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} Hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} Day${days > 1 ? "s" : ""} ago`;
}

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

  const { isLoading: isEstateLoading, data: estateData } = useEstate(estateId);
  const { data: allEstatesData } = useEstates();

  const estateName = estateData?.title ?? estateNameMap[estateId] ?? "Estate";

  /* Map real estates to NewlyAddedEstate cards */
  const newlyAddedEstates: NewlyAddedEstate[] = useMemo(() => {
    const estates = allEstatesData?.data ?? [];
    return estates.map((e) => {
      const props = e.properties ?? [];
      const sold = props.filter((p) => p.status === "Sold").length;
      const available = props.filter((p) => p.status === "Available").length;
      return {
        id: String(e.id),
        name: e.title,
        location: e.location ?? e.city ?? "",
        totalUnits: props.length,
        availableUnits: available,
        sold,
        timeAgo: timeAgo(e.created_at),
      };
    });
  }, [allEstatesData]);

  const canAddUnit = role === "admin";

  /* Data filtering */
  const baseUnits = estateData?.properties ?? [];

  const filteredData = useMemo(() => {
    let result = baseUnits;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p: any) => {
        const unitId = String(p.id ?? "").toLowerCase();
        const type = String(p.property_type ?? p.title ?? "").toLowerCase();
        const agentName = String(p.assigned_agent ?? "").toLowerCase();
        return unitId.includes(q) || type.includes(q) || agentName.includes(q);
      });
    }

    if (assignedFilter.length > 0) {
      result = result.filter((p: any) => {
        const agentName = p.assigned_agent ?? "Nil";
        return (
          assignedFilter.includes(agentName) || assignedFilter.includes("Nil")
        );
      });
    }

    if (statusFilter.length > 0) {
      result = result.filter((p: any) => statusFilter.includes(p.status));
    }

    return result;
  }, [search, assignedFilter, statusFilter, baseUnits]);

  /* Build table rows */
  const tableData = filteredData.map((p: any) => ({
    unitId: String(p.id ?? ""),
    type: p.property_type ?? p.title ?? "-",
    priceRange: p.price ? `₦${p.price.toLocaleString()}` : "N/A",
    status: (
      <UnitStatusBadge status={(p.status as UnitStatus) ?? "Available"} />
    ),
    assignedClient: p.assigned_client ?? "Nil",
    agent: (
      <div className="flex items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-full bg-[#c8c8c8]">
          <span className="font-montserrat text-[8px] font-bold text-white">
            {(String(p.assigned_agent ?? "") || "")
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </span>
        </div>
        <span className="font-montserrat text-sm text-[#0f0f0f]">
          {p.assigned_agent ?? "Nil"}
        </span>
        <RoleBadge role={(p.assigned_agent_role as UserRole) ?? "staff"} />
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

      {/* Inventory table - Always-visible toolbar */}
      <div className="w-full overflow-hidden rounded-lg bg-[#f8f8f8] p-4">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
              {estateName}
            </p>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search"
            />
          </div>
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
        </div>

        <FetchLoadingAndEmptyState
          isLoading={isEstateLoading}
          data={tableData.length}
          numberOfSkeleton={1}
          skeleton={<CustomTableSkeleton headers={headers} rows={5} />}
          emptyState={
            <CustomTableEmptyState
              headers={headers}
              emptyMessage="No units found for this estate."
            />
          }
        >
          <CustomTable
            headers={headers}
            data={tableData}
            headerKeyMap={headerKeyMap}
            onRowClick={(_, index) => {
              const unit = filteredData[index];
              if (unit) {
                setSelectedUnitId(String(unit.id ?? ""));
                setDialogOpen(true);
              }
            }}
          />
        </FetchLoadingAndEmptyState>
      </div>

      {/* Unit detail modal */}
      <UnitDetailDialog
        unit={
          selectedUnitId
            ? (() => {
                const found = (baseUnits as any[]).find(
                  (p) => String(p.id) === String(selectedUnitId),
                );
                if (!found) return mockUnitDetails[selectedUnitId] ?? null;

                return {
                  id: String(found.id),
                  unitId: String(found.id),
                  unitType: found.property_type ?? found.title ?? "",
                  status: (found.status as UnitStatus) ?? "Available",
                  currentStage: found.current_stage ?? "",
                  minimumPrice: found.price
                    ? `₦${found.price.toLocaleString()}`
                    : "",
                  maximumPrice: found.price
                    ? `₦${found.price.toLocaleString()}`
                    : "",
                  agent: {
                    name: found.assigned_agent ?? "",
                    role: (found.assigned_agent_role as UserRole) ?? "staff",
                  },
                  propertyType: found.property_type ?? "",
                  description: found.description ?? "",
                  title: found.title ?? "",
                  location: found.address ?? found.city ?? found.location ?? "",
                  estate: estateData?.title ?? "",
                  heroImage: found.images?.[0] ?? "/fallback-hero.png",
                  mapImage: found.images?.[1] ?? "/fallback-map.png",
                  galleryImages: found.images ?? [],
                  aboutText: found.description ?? "",
                };
              })()
            : null
        }
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* Add Unit Sheet */}
      <AddUnitSheet
        open={addUnitOpen}
        onOpenChange={setAddUnitOpen}
        estateName={estateName}
        estateId={estateId}
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
          {newlyAddedEstates.map((estate) => (
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
