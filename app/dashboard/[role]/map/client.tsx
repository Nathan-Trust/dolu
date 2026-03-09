"use client";

import { useMemo, useState } from "react";
import { type UserRole } from "@/util/status";
import SearchInput from "@/components/shared/CustomSearchInput";
import CustomMultiSelectFilter from "@/components/shared/CustomMultiSelectFilter";
import MapView, { type EstateMarker } from "@/components/map/MapView";
import { useRolePermissions } from "@/hooks/useRolePermissions";

/* ------------------------------------------------------------------ */
/*  Mock estates – each role sees a subset                             */
/* ------------------------------------------------------------------ */

const allEstates: EstateMarker[] = [
  {
    id: "e1",
    name: "Joy Valley Hills",
    location: "Ibeju Lekki",
    lat: 6.5244,
    lng: 3.3792,
    status: "Available",
    assignedTo: "John Doe",
  },
  {
    id: "e2",
    name: "Lekki Garden Villas",
    location: "Lekki Phase 1",
    lat: 6.51,
    lng: 3.398,
    status: "Partially Sold",
    assignedTo: "Jane Smith",
  },
  {
    id: "e3",
    name: "Ikoyi Sapphire",
    location: "Ikoyi",
    lat: 6.454,
    lng: 3.4305,
    status: "Sold Out",
    assignedTo: "Mike Ross",
  },
  {
    id: "e4",
    name: "Victoria Grand",
    location: "Victoria Island",
    lat: 6.428,
    lng: 3.422,
    status: "Available",
    assignedTo: "John Doe",
  },
  {
    id: "e5",
    name: "Surulere Heights",
    location: "Surulere",
    lat: 6.4927,
    lng: 3.3461,
    status: "Sold Out",
    assignedTo: "Jane Smith",
  },
  {
    id: "e6",
    name: "Yaba Tech Enclave",
    location: "Yaba",
    lat: 6.506,
    lng: 3.37,
    status: "Available",
    assignedTo: "Mike Ross",
  },
  {
    id: "e7",
    name: "Ajah Pearl Estate",
    location: "Ajah",
    lat: 6.4698,
    lng: 3.5852,
    status: "Partially Sold",
    assignedTo: "John Doe",
  },
  {
    id: "e8",
    name: "Ikeja Central Park",
    location: "Ikeja",
    lat: 6.6018,
    lng: 3.3515,
    status: "Available",
    assignedTo: "Jane Smith",
  },
  {
    id: "e9",
    name: "Ogba Green Avenue",
    location: "Ogba",
    lat: 6.63,
    lng: 3.34,
    status: "Sold Out",
    assignedTo: "Mike Ross",
  },
  {
    id: "e10",
    name: "Maryland Estates",
    location: "Maryland",
    lat: 6.57,
    lng: 3.37,
    status: "Partially Sold",
    assignedTo: "John Doe",
  },
];

/* Staff sees only assigned; Realtor sees only linked deals */
const staffAssigned = ["John Doe"];
const realtorLinkedDeals = ["e2", "e5", "e7"];

function getEstatesForRole(role: UserRole): EstateMarker[] {
  switch (role) {
    case "staff":
      return allEstates.filter((e) => staffAssigned.includes(e.assignedTo));
    case "realtor":
      return allEstates.filter((e) => realtorLinkedDeals.includes(e.id));
    default:
      return allEstates;
  }
}

/* ------------------------------------------------------------------ */
/*  Role-based filter visibility                                       */
/*  Chairman  → Status + Location only                                 */
/*  Admin     → All filters (Estate, Location, Assigned to, Status)    */
/*  Staff     → Estate, Location, Status (no Assigned to)              */
/*  Realtor   → Estate, Location, Status (no Assigned to)              */
/* ------------------------------------------------------------------ */

function useFiltersForRole(role: UserRole, estates: EstateMarker[]) {
  const estateOptions = useMemo(
    () =>
      Array.from(new Set(estates.map((e) => e.name))).map((n) => ({
        label: n,
        value: n,
      })),
    [estates],
  );

  const locationOptions = useMemo(
    () =>
      Array.from(new Set(estates.map((e) => e.location))).map((l) => ({
        label: l,
        value: l,
      })),
    [estates],
  );

  const assignedToOptions = useMemo(
    () =>
      Array.from(new Set(estates.map((e) => e.assignedTo))).map((a) => ({
        label: a,
        value: a,
      })),
    [estates],
  );

  const statusOptions = useMemo(
    () =>
      Array.from(new Set(estates.map((e) => e.status))).map((s) => ({
        label: s,
        value: s,
      })),
    [estates],
  );

  const showEstate = role !== "chairman";
  const showLocation = true;
  const showAssignedTo = role === "admin";
  const showStatus = true;

  return {
    estateOptions,
    locationOptions,
    assignedToOptions,
    statusOptions,
    showEstate,
    showLocation,
    showAssignedTo,
    showStatus,
  };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MapClient({ role }: { role: UserRole }) {
  const { canView, canEdit } = useRolePermissions(role);
  const roleEstates = useMemo(() => getEstatesForRole(role), [role]);
  const canOpenDetail = canEdit("Maps");

  if (!canView("Maps")) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
          Maps
        </h1>
        <p className="font-montserrat text-sm text-[#6f6d6d]">
          You do not have permission to view the map.
        </p>
      </div>
    );
  }

  /* Filters */
  const [search, setSearch] = useState("");
  const [estateFilter, setEstateFilter] = useState<(string | number)[]>([]);
  const [locationFilter, setLocationFilter] = useState<(string | number)[]>([]);
  const [assignedToFilter, setAssignedToFilter] = useState<(string | number)[]>(
    [],
  );
  const [statusFilter, setStatusFilter] = useState<(string | number)[]>([]);

  const {
    estateOptions,
    locationOptions,
    assignedToOptions,
    statusOptions,
    showEstate,
    showLocation,
    showAssignedTo,
    showStatus,
  } = useFiltersForRole(role, roleEstates);

  /* Filtered markers */
  const filtered = useMemo(() => {
    let rows = roleEstates;

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q),
      );
    }
    if (estateFilter.length > 0) {
      rows = rows.filter((e) => estateFilter.includes(e.name));
    }
    if (locationFilter.length > 0) {
      rows = rows.filter((e) => locationFilter.includes(e.location));
    }
    if (assignedToFilter.length > 0) {
      rows = rows.filter((e) => assignedToFilter.includes(e.assignedTo));
    }
    if (statusFilter.length > 0) {
      rows = rows.filter((e) => statusFilter.includes(e.status));
    }

    return rows;
  }, [
    roleEstates,
    search,
    estateFilter,
    locationFilter,
    assignedToFilter,
    statusFilter,
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
          Maps
        </h1>
        <p className="font-montserrat text-xs text-[#6f6d6d]">
          Session <span className="font-bold">Jul 10, 2026</span>
        </p>
      </div>

      {/* Sub-header */}
      <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
        Map View
      </p>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search" />
        <div className="flex flex-wrap items-center gap-4">
          {showEstate && (
            <CustomMultiSelectFilter
              title="Estate"
              options={estateOptions}
              selectedValues={estateFilter}
              onApplyFilter={setEstateFilter}
            />
          )}
          {showLocation && (
            <CustomMultiSelectFilter
              title="Location"
              options={locationOptions}
              selectedValues={locationFilter}
              onApplyFilter={setLocationFilter}
            />
          )}
          {showAssignedTo && (
            <CustomMultiSelectFilter
              title="Assigned to"
              options={assignedToOptions}
              selectedValues={assignedToFilter}
              onApplyFilter={setAssignedToFilter}
            />
          )}
          {showStatus && (
            <CustomMultiSelectFilter
              title="Status"
              options={statusOptions}
              selectedValues={statusFilter}
              onApplyFilter={setStatusFilter}
            />
          )}
        </div>
      </div>

      {/* Map */}
      <MapView markers={filtered} canOpenDetail={canOpenDetail} />
    </div>
  );
}
