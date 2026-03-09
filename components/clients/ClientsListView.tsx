/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { ClientDetailDialogWrapper } from "./ClientDetailDialog";
import AddClientSheet from "./AddClientSheet";
import AddClientOptionDialog from "./AddClientOptionDialog";
import SendSubscriptionSheet from "./SendSubscriptionSheet";
import SuccessDialog from "@/components/shared/SuccessDialog";
import { type UserRole } from "@/util/status";
import { useClients } from "@/hooks/useClients";
import { useClient } from "@/hooks/useClient";
import { FetchLoadingAndEmptyState } from "@/components/shared/FetchLoadinAndEmptyState";
import { CustomTableSkeleton } from "@/components/shared/CustomTableSkeleton";
import CustomTableEmptyState from "@/components/shared/CustomTableEmptyState";

/* We'll fetch clients from API using `useClients` */

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
  canCreate?: boolean;
}

export default function ClientsListView({
  role,
  canCreate = false,
}: ClientsListViewProps) {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [optionDialogOpen, setOptionDialogOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
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
  const { isLoading, data: clientsData } = useClients();
  const { data: clientDetailData } = useClient(selectedClientId ?? undefined);

  /* Role-based data filtering */
  const baseData = useMemo(() => {
    const list: any[] = (clientsData?.data ?? []) as any[];
    if (role === "staff") {
      return list.filter((c) => (c.assigned_staff || "").includes("John"));
    }
    if (role === "realtor") {
      return list.filter((c) => (c.assigned_staff || "").includes("David"));
    }
    return list;
  }, [clientsData, role]);

  const filteredData = useMemo(() => {
    let result = baseData;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c: any) => {
        const name = `${c.first_name ?? ""} ${c.last_name ?? ""}`.toLowerCase();
        return (
          name.includes(q) ||
          String(c.id).toLowerCase().includes(q) ||
          (c.assigned_staff || "").toLowerCase().includes(q) ||
          (c.email || "").toLowerCase().includes(q)
        );
      });
    }

    if (salesStageFilter.length > 0) {
      result = result.filter((c: any) =>
        salesStageFilter.includes(c.sales_stage),
      );
    }

    if (assignedToFilter.length > 0) {
      result = result.filter((c: any) =>
        assignedToFilter.includes(c.assigned_staff),
      );
    }

    if (inactivityFilter.length > 0) {
      result = result.filter((c: any) => inactivityFilter.includes(c.status));
    }

    return result;
  }, [baseData, search, salesStageFilter, assignedToFilter, inactivityFilter]);

  /* Build renderable rows for CustomTable */
  const tableData = filteredData.map((c: any) => {
    const name =
      `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim() ||
      c.email ||
      "Unknown";
    const initials = name
      .split(" ")
      .map((p: string) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return {
      clientName: name,
      clientCode: String(c.id ?? ""),
      assignedTo: (
        <PersonCell
          name={c.assigned_staff ?? ""}
          initials={initials}
          color="#8a38f5"
        />
      ),
      currentSalesStage:
        (c.sales_stage as SalesStage) ?? ("Interested" as SalesStage),
      lastActivityDate: c.last_active ?? c.updated_at ?? "-",
      dealValue: c.deal_value ? `₦${c.deal_value}` : "Undefined",
      status: (
        <ClientStatusBadge status={(c.status as ClientStatus) ?? "Active"} />
      ),
    };
  });

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

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <ClientsHeader
        showAddClient={canCreate}
        onAddClient={() => setOptionDialogOpen(true)}
      />

      {/* Always-visible toolbar */}
      <div className="w-full overflow-hidden rounded-lg bg-[#f8f8f8] p-4">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
              Staff
            </p>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search"
            />
          </div>
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
        </div>

        <FetchLoadingAndEmptyState
          isLoading={isLoading}
          data={tableData.length}
          numberOfSkeleton={5}
          skeleton={<CustomTableSkeleton headers={headers} rows={5} />}
          emptyState={
            <CustomTableEmptyState
              headers={headers}
              emptyMessage="No clients found. Add a new client to get started."
            />
          }
        >
          <CustomTable
            headers={headers}
            data={tableData}
            headerKeyMap={headerKeyMap}
            onRowClick={(row, index) => {
              const clientId = tableData[index]?.clientCode;
              if (clientId) {
                setSelectedClientId(clientId);
                setDialogOpen(true);
              }
            }}
          />
        </FetchLoadingAndEmptyState>
      </div>

      {/* Client detail modal */}
      <ClientDetailDialogWrapper
        selectedClientId={selectedClientId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* Add client option dialog */}
      <AddClientOptionDialog
        open={optionDialogOpen}
        onOpenChange={setOptionDialogOpen}
        onAddManually={() => setAddClientOpen(true)}
        onSendSubscription={() => setSubscriptionOpen(true)}
      />

      {/* Add client sheet (manual) */}
      <AddClientSheet
        open={addClientOpen}
        onOpenChange={setAddClientOpen}
        onSuccess={(client) => {
          setSubmittedClient(client);
          setSuccessOpen(true);
        }}
      />

      {/* Send subscription sheet */}
      <SendSubscriptionSheet
        open={subscriptionOpen}
        onOpenChange={setSubscriptionOpen}
        onSuccess={() => {
          setSubmittedClient({ name: "Client", code: "SENT" });
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
