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
} from "./PropertyDetailDialog";
import AddEstateSheet from "./AddEstateSheet";
import SuccessDialog from "@/components/shared/SuccessDialog";
import { type UserRole } from "@/util/status";

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
  isReadOnly?: boolean;
}

export default function PropertiesListView({
  role,
  isReadOnly = false,
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

  /* Role-based data filtering */
  const baseData = useMemo(() => {
    // Chairman & Admin see all estates
    // Staff sees only assigned estates (mock: all for now)
    // Realtor sees own client estates (mock: all for now)
    return mockEstates;
  }, []);

  const filteredData = useMemo(() => {
    let result = baseData;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.estateName.toLowerCase().includes(q) ||
          e.estateCode.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q),
      );
    }

    if (locationFilter.length > 0) {
      result = result.filter((e) => locationFilter.includes(e.location));
    }

    if (availabilityFilter.length > 0) {
      result = result.filter((e) => availabilityFilter.includes(e.status));
    }

    return result;
  }, [baseData, search, locationFilter, availabilityFilter]);

  /* Build renderable rows for CustomTable */
  const tableData = filteredData.map((e) => ({
    estateName: (
      <button
        type="button"
        className="cursor-pointer font-montserrat text-sm font-bold text-[#8a38f5] underline-offset-2 hover:underline"
        onClick={(ev) => {
          ev.stopPropagation();
          router.push(`/dashboard/${currentRole}/properties/${e.id}/inventory`);
        }}
      >
        {e.estateName}
      </button>
    ),
    estateCode: e.estateCode,
    location: e.location,
    totalUnits: e.totalUnits,
    unitsSold: e.unitsSold,
    unitsAvailable: e.unitsAvailable,
    averagePrice: e.averagePrice,
    status: <PropertyStatusBadge status={e.status} />,
  }));

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

  const canAddEstate = role === "admin";

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <PropertiesHeader
        showAddEstate={canAddEstate && !isReadOnly}
        onAddEstate={() => setAddEstateOpen(true)}
      />

      {/* Table */}
      <CustomTable
        title="Staff"
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
        }
        headers={headers}
        data={tableData}
        headerKeyMap={headerKeyMap}
        onRowClick={(row, index) => {
          const estate = filteredData[index];
          if (estate) {
            setSelectedPropertyId(estate.id);
            setDialogOpen(true);
          }
        }}
      />

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
      <PropertyDetailDialog
        property={
          selectedPropertyId
            ? (mockPropertyDetails[selectedPropertyId] ?? null)
            : null
        }
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
