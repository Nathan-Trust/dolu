"use client";

import { useState, useMemo } from "react";
import CustomTable from "@/components/shared/CustomTable";
import SearchInput from "@/components/shared/CustomSearchInput";
import CustomMultiSelectFilter from "@/components/shared/CustomMultiSelectFilter";
import { PersonCell } from "@/components/overview";
import { ClientsHeader } from "./ClientsHeader";
import {
  ClientStatusBadge,
  type ClientStatus,
  type SalesStage,
} from "./ClientStatusBadge";
import ClientDetailDialog, { mockClientDetails } from "./ClientDetailDialog";
import AddClientSheet from "./AddClientSheet";
import SuccessDialog from "@/components/shared/SuccessDialog";
import { type UserRole } from "@/util/status";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ClientRecord {
  id: string;
  clientName: string;
  clientCode: string;
  assignedTo: {
    name: string;
    initials: string;
    avatarColor: string;
  };
  currentSalesStage: SalesStage;
  lastActivityDate: string;
  dealValue: string;
  status: ClientStatus;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const mockClients: ClientRecord[] = [
  {
    id: "c1",
    clientName: "Peter Abbey",
    clientCode: "01014",
    assignedTo: { name: "John Ibekwe", initials: "JI", avatarColor: "#8a38f5" },
    currentSalesStage: "Closed",
    lastActivityDate: "Just Now",
    dealValue: "₦5,250,000.00",
    status: "Active",
  },
  {
    id: "c2",
    clientName: "Peter Abbey",
    clientCode: "01014",
    assignedTo: { name: "John Ibekwe", initials: "JI", avatarColor: "#8a38f5" },
    currentSalesStage: "Payment",
    lastActivityDate: "Just Now",
    dealValue: "₦5,250,000.00",
    status: "Active",
  },
  {
    id: "c3",
    clientName: "Peter Abbey",
    clientCode: "01014",
    assignedTo: { name: "John Ibekwe", initials: "JI", avatarColor: "#8a38f5" },
    currentSalesStage: "Negotiation",
    lastActivityDate: "Just Now",
    dealValue: "Undefined",
    status: "Active",
  },
  {
    id: "c4",
    clientName: "Peter Abbey",
    clientCode: "01014",
    assignedTo: { name: "John Ibekwe", initials: "JI", avatarColor: "#8a38f5" },
    currentSalesStage: "Inspection",
    lastActivityDate: "Just Now",
    dealValue: "₦5,250,000.00",
    status: "Active",
  },
  {
    id: "c5",
    clientName: "Peter Abbey",
    clientCode: "01014",
    assignedTo: { name: "John Ibekwe", initials: "JI", avatarColor: "#8a38f5" },
    currentSalesStage: "Interested",
    lastActivityDate: "Just Now",
    dealValue: "Undefined",
    status: "Active",
  },
];

/* ------------------------------------------------------------------ */
/*  Filter options                                                     */
/* ------------------------------------------------------------------ */

const salesStageOptions = [
  { label: "Closed", value: "Closed" },
  { label: "Payment", value: "Payment" },
  { label: "Negotiation", value: "Negotiation" },
  { label: "Inspection", value: "Inspection" },
  { label: "Interested", value: "Interested" },
];

const assignedToOptions = [
  { label: "John Ibekwe", value: "John Ibekwe" },
  { label: "James Agahowa", value: "James Agahowa" },
  { label: "David Okoro", value: "David Okoro" },
];

const inactivityOptions = [
  { label: "Active", value: "Active" },
  { label: "Dormant", value: "Dormant" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface ClientsListViewProps {
  role: UserRole;
  isReadOnly?: boolean;
}

export default function ClientsListView({
  role,
  isReadOnly = false,
}: ClientsListViewProps) {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [submittedClient, setSubmittedClient] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const [salesStageFilter, setSalesStageFilter] = useState<(string | number)[]>(
    [],
  );
  const [assignedToFilter, setAssignedToFilter] = useState<(string | number)[]>(
    [],
  );
  const [inactivityFilter, setInactivityFilter] = useState<(string | number)[]>(
    [],
  );

  /* Role-based data filtering */
  const baseData = useMemo(() => {
    if (role === "staff") {
      // Staff sees only clients assigned to them (mock: "John Ibekwe")
      return mockClients.filter((c) => c.assignedTo.name === "John Ibekwe");
    }
    if (role === "realtor") {
      // Realtor sees only their own clients (mock: "David Okoro")
      return mockClients.filter((c) => c.assignedTo.name === "David Okoro");
    }
    // Chairman & Admin see all
    return mockClients;
  }, [role]);

  const filteredData = useMemo(() => {
    let result = baseData;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.clientName.toLowerCase().includes(q) ||
          c.clientCode.toLowerCase().includes(q) ||
          c.assignedTo.name.toLowerCase().includes(q),
      );
    }

    if (salesStageFilter.length > 0) {
      result = result.filter((c) =>
        salesStageFilter.includes(c.currentSalesStage),
      );
    }

    if (assignedToFilter.length > 0) {
      result = result.filter((c) =>
        assignedToFilter.includes(c.assignedTo.name),
      );
    }

    if (inactivityFilter.length > 0) {
      result = result.filter((c) => inactivityFilter.includes(c.status));
    }

    return result;
  }, [baseData, search, salesStageFilter, assignedToFilter, inactivityFilter]);

  /* Build renderable rows for CustomTable */
  const tableData = filteredData.map((c) => ({
    clientName: c.clientName,
    clientCode: c.clientCode,
    assignedTo: (
      <PersonCell
        name={c.assignedTo.name}
        initials={c.assignedTo.initials}
        color={c.assignedTo.avatarColor}
      />
    ),
    currentSalesStage: c.currentSalesStage,
    lastActivityDate: c.lastActivityDate,
    dealValue: c.dealValue,
    status: <ClientStatusBadge status={c.status} />,
  }));

  const headers = [
    "Client Name",
    "Client Code",
    "Assigned Staff/Realtor",
    "Current Sales Stage",
    "Last Activity Date",
    "Deal Value",
    "Status",
  ];
  const headerKeyMap: Record<string, string> = {
    "Client Name": "clientName",
    "Client Code": "clientCode",
    "Assigned Staff/Realtor": "assignedTo",
    "Current Sales Stage": "currentSalesStage",
    "Last Activity Date": "lastActivityDate",
    "Deal Value": "dealValue",
    Status: "status",
  };

  const canAddClient = role === "admin" || role === "staff";

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <ClientsHeader
        showAddClient={canAddClient && !isReadOnly}
        onAddClient={() => setAddClientOpen(true)}
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
              title="Sales Stage"
              options={salesStageOptions}
              selectedValues={salesStageFilter}
              onApplyFilter={setSalesStageFilter}
            />
            <CustomMultiSelectFilter
              title="Assigned to"
              options={assignedToOptions}
              selectedValues={assignedToFilter}
              onApplyFilter={setAssignedToFilter}
            />
            <CustomMultiSelectFilter
              title="Inactivity"
              options={inactivityOptions}
              selectedValues={inactivityFilter}
              onApplyFilter={setInactivityFilter}
            />
          </div>
        }
        headers={headers}
        data={tableData}
        headerKeyMap={headerKeyMap}
        onRowClick={(row, index) => {
          const client = filteredData[index];
          if (client) {
            setSelectedClientId(client.id);
            setDialogOpen(true);
          }
        }}
      />

      {/* Client detail modal */}
      <ClientDetailDialog
        client={
          selectedClientId
            ? (mockClientDetails[selectedClientId] ?? null)
            : null
        }
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* Add client sheet */}
      <AddClientSheet
        open={addClientOpen}
        onOpenChange={setAddClientOpen}
        onSuccess={(client) => {
          setSubmittedClient(client);
          setSuccessOpen(true);
        }}
      />

      {/* Success dialog after adding client */}
      {submittedClient && (
        <SuccessDialog
          open={successOpen}
          onOpenChange={setSuccessOpen}
          title="New Client Added"
          description={
            <>
              You have successfully added Client{" "}
              <span className="font-bold">
                {submittedClient.name} #{submittedClient.code}
              </span>
            </>
          }
          actionLabel="View Client"
          onAction={() => {
            // TODO: open client detail or navigate
          }}
        />
      )}
    </div>
  );
}
