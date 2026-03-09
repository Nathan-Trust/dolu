"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import CustomTable from "@/components/shared/CustomTable";
import SearchInput from "@/components/shared/CustomSearchInput";
import CustomMultiSelectFilter from "@/components/shared/CustomMultiSelectFilter";
import { PropertiesHeader } from "./PropertiesHeader";
import {
  PropertyStatusBadge,
  type PropertyStatus,
} from "./PropertyStatusBadge";
import { SalesSummaryChart } from "./SalesSummaryChart";
import PropertyDetailDialog, {
  mockPropertyDetails,
  PropertyDetailDialogWrapper,
} from "./PropertyDetailDialog";
import AddEstateSheet from "./AddEstateSheet";
import SuccessDialog from "@/components/shared/SuccessDialog";
import { type UserRole } from "@/util/status";
import { useEstates } from "@/hooks/useEstates";
import { FetchLoadingAndEmptyState } from "@/components/shared/FetchLoadinAndEmptyState";
import { CustomTableSkeleton } from "@/components/shared/CustomTableSkeleton";
import CustomTableEmptyState from "@/components/shared/CustomTableEmptyState";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface EstateRecord {
  id: string;
  estateName: string;
  estateCode: string;
  location: string;
  totalUnits: number;
  unitsSold: number;
  unitsAvailable: number;
  averagePrice: string;
  status: PropertyStatus;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const mockEstates: EstateRecord[] = [
  {
    id: "e1",
    estateName: "Joy Valley Hills",
    estateCode: "01014",
    location: "Ibeju Lekki",
    totalUnits: 24,
    unitsSold: 20,
    unitsAvailable: 4,
    averagePrice: "₦5,250,000.00",
    status: "Available",
  },
  {
    id: "e2",
    estateName: "Joy Valley Hills",
    estateCode: "01014",
    location: "Ibeju Lekki",
    totalUnits: 24,
    unitsSold: 20,
    unitsAvailable: 4,
    averagePrice: "₦5,250,000.00",
    status: "Selling Fast",
  },
  {
    id: "e3",
    estateName: "Joy Valley Hills",
    estateCode: "01014",
    location: "Ibeju Lekki",
    totalUnits: 24,
    unitsSold: 20,
    unitsAvailable: 4,
    averagePrice: "₦5,250,000.00",
    status: "Available",
  },
  {
    id: "e4",
    estateName: "Joy Valley Hills",
    estateCode: "01014",
    location: "Ibeju Lekki",
    totalUnits: 24,
    unitsSold: 20,
    unitsAvailable: 4,
    averagePrice: "₦5,250,000.00",
    status: "Sold Out",
  },
  {
    id: "e5",
    estateName: "Joy Valley Hills",
    estateCode: "01014",
    location: "Ibeju Lekki",
    totalUnits: 24,
    unitsSold: 20,
    unitsAvailable: 4,
    averagePrice: "₦5,250,000.00",
    status: "Available",
  },
];

/* ------------------------------------------------------------------ */
/*  Filter options                                                     */
/* ------------------------------------------------------------------ */

const locationOptions = [
  { label: "Ibeju Lekki", value: "Ibeju Lekki" },
  { label: "Lekki Phase 1", value: "Lekki Phase 1" },
  { label: "Ajah", value: "Ajah" },
  { label: "Epe", value: "Epe" },
];

const availabilityOptions = [
  { label: "Available", value: "Available" },
  { label: "Selling Fast", value: "Selling Fast" },
  { label: "Sold Out", value: "Sold Out" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface PropertiesListViewProps {
  role: UserRole;
  canCreate?: boolean;
}

export default function PropertiesListView({
  role,
  canCreate = false,
}: PropertiesListViewProps) {
  const router = useRouter();
  const params = useParams();
  const currentRole = params.role as string;

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );
  const [addEstateOpen, setAddEstateOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [submittedEstate, setSubmittedEstate] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const [locationFilter, setLocationFilter] = useState<(string | number)[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState<
    (string | number)[]
  >([]);

  /* Fetch estates from API */
  const { isLoading, data: estatesData } = useEstates();

  /* Role-based data filtering */
  const baseData = useMemo(() => {
    // Chairman & Admin see all estates
    // Staff sees only assigned estates (mock: all for now)
    // Realtor sees own client estates (mock: all for now)
    return (estatesData?.data ?? []) as any[];
  }, [estatesData]);

  const filteredData = useMemo(() => {
    let result = baseData;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e: any) =>
          (e.title || e.estateName || "").toLowerCase().includes(q) ||
          (e.location || "").toLowerCase().includes(q),
      );
    }

    if (locationFilter.length > 0) {
      result = result.filter((e: any) => locationFilter.includes(e.location));
    }

    if (availabilityFilter.length > 0) {
      result = result.filter((e: any) => availabilityFilter.includes(e.status));
    }

    return result;
  }, [baseData, search, locationFilter, availabilityFilter]);

  /* Build renderable rows for CustomTable */
  const tableData = filteredData.map((e: any) => {
    const statValue = e.status || "Available";

    return {
      estateName: (
        <button
          type="button"
          className="cursor-pointer font-montserrat text-sm font-bold text-[#8a38f5] underline-offset-2 hover:underline"
          onClick={(ev) => {
            ev.stopPropagation();
            router.push(
              `/dashboard/${currentRole}/properties/${e.id}/inventory`,
            );
          }}
        >
          {e.title || e.estateName || "Unknown"}
        </button>
      ),
      estateCode: String(e.id ?? ""),
      location: e.location || "Unknown",
      totalUnits: e.total_units ?? 0,
      unitsSold: e.units_sold ?? 0,
      unitsAvailable: (e.total_units ?? 0) - (e.units_sold ?? 0),
      averagePrice: e.average_price ? `₦${e.average_price}` : "N/A",
      status: <PropertyStatusBadge status={statValue as PropertyStatus} />,
    };
  });

  const headers = [
    "Estate Name",
    "Estate Code",
    "Location",
    "Total Units",
    "Units Sold",
    "Units Available",
    "Average Price",
    "Status",
  ];

  const headerKeyMap: Record<string, string> = {
    "Estate Name": "estateName",
    "Estate Code": "estateCode",
    Location: "location",
    "Total Units": "totalUnits",
    "Units Sold": "unitsSold",
    "Units Available": "unitsAvailable",
    "Average Price": "averagePrice",
    Status: "status",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <PropertiesHeader
        showAddEstate={canCreate}
        onAddEstate={() => setAddEstateOpen(true)}
      />

      {/* Always-visible toolbar */}
      <div className="w-full overflow-hidden rounded-lg bg-[#f8f8f8] p-4">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
              Estates
            </p>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search"
            />
          </div>
          <div className="flex items-center gap-4">
            <CustomMultiSelectFilter
              title="Location"
              options={locationOptions}
              selectedValues={locationFilter}
              onApplyFilter={setLocationFilter}
            />
            <CustomMultiSelectFilter
              title="Availability"
              options={availabilityOptions}
              selectedValues={availabilityFilter}
              onApplyFilter={setAvailabilityFilter}
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
              emptyMessage="No estates or properties found."
            />
          }
        >
          {/* Table */}
          <CustomTable
            headers={headers}
            data={tableData}
            headerKeyMap={headerKeyMap}
            onRowClick={(row, index) => {
              const estate = filteredData[index];
              if (estate) {
                setSelectedPropertyId(String(estate.id ?? ""));
                setDialogOpen(true);
              }
            }}
          />
        </FetchLoadingAndEmptyState>
      </div>

      {/* Sales Summary chart */}
      <SalesSummaryChart />

      {/* Add estate sheet */}
      <AddEstateSheet
        open={addEstateOpen}
        onOpenChange={setAddEstateOpen}
        onSuccess={(estate) => {
          setSubmittedEstate(estate);
          setSuccessOpen(true);
        }}
      />

      {/* Success dialog after adding estate */}
      {submittedEstate && (
        <SuccessDialog
          open={successOpen}
          onOpenChange={setSuccessOpen}
          title="New Estate Added"
          description={
            <>
              You have successfully added Estate{" "}
              <span className="font-bold">
                {submittedEstate.name} #{submittedEstate.code}
              </span>
            </>
          }
          actionLabel="View Estate"
          onAction={() => {
            // TODO: open estate detail or navigate
          }}
        />
      )}

      {/* Property detail modal */}
      <PropertyDetailDialogWrapper
        selectedPropertyId={selectedPropertyId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
