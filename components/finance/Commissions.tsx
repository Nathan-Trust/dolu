"use client";

import { useState, useMemo } from "react";
import CustomTable from "@/components/shared/CustomTable";
import SearchInput from "@/components/shared/CustomSearchInput";
import CustomMultiSelectFilter from "@/components/shared/CustomMultiSelectFilter";
import { Download, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfigureCommissionsDialog from "@/components/finance/ConfigureCommissionsDialog";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CommissionRecord {
  [key: string]: React.ReactNode | string | number | null | object;
  id: number;
  realtorName: string;
  property: string;
  client: string;
  saleValue: string;
  commission: string;
  status: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const mockCommissionsData: CommissionRecord[] = [
  {
    id: 1,
    realtorName: "Sodiq Egbon",
    property: "001",
    client: "Peter Abbey",
    saleValue: "₦15,000,000",
    commission: "₦750,000",
    status: "Paid",
  },
  {
    id: 2,
    realtorName: "Sodiq Egbon",
    property: "001",
    client: "Peter Abbey",
    saleValue: "₦15,000,000",
    commission: "₦750,000",
    status: "Paid",
  },
  {
    id: 3,
    realtorName: "Sodiq Egbon",
    property: "001",
    client: "Peter Abbey",
    saleValue: "₦15,000,000",
    commission: "₦750,000",
    status: "Pending",
  },
  {
    id: 4,
    realtorName: "Sodiq Egbon",
    property: "001",
    client: "Peter Abbey",
    saleValue: "₦15,000,000",
    commission: "₦750,000",
    status: "Paid",
  },
  {
    id: 5,
    realtorName: "Sodiq Egbon",
    property: "001",
    client: "Peter Abbey",
    saleValue: "₦15,000,000",
    commission: "₦750,000",
    status: "Overdue",
  },
  {
    id: 6,
    realtorName: "Sodiq Egbon",
    property: "001",
    client: "Peter Abbey",
    saleValue: "₦15,000,000",
    commission: "₦750,000",
    status: "Paid",
  },
  {
    id: 7,
    realtorName: "Sodiq Egbon",
    property: "001",
    client: "Peter Abbey",
    saleValue: "₦15,000,000",
    commission: "₦750,000",
    status: "Pending",
  },
  {
    id: 8,
    realtorName: "Sodiq Egbon",
    property: "001",
    client: "Peter Abbey",
    saleValue: "₦15,000,000",
    commission: "₦750,000",
    status: "Overdue",
  },
  {
    id: 9,
    realtorName: "Sodiq Egbon",
    property: "001",
    client: "Peter Abbey",
    saleValue: "₦15,000,000",
    commission: "₦750,000",
    status: "Pending",
  },
  {
    id: 10,
    realtorName: "Sodiq Egbon",
    property: "001",
    client: "Peter Abbey",
    saleValue: "₦15,000,000",
    commission: "₦750,000",
    status: "Pending",
  },
  {
    id: 11,
    realtorName: "Sodiq Egbon",
    property: "001",
    client: "Peter Abbey",
    saleValue: "₦15,000,000",
    commission: "₦750,000",
    status: "Overdue",
  },
  {
    id: 12,
    realtorName: "Sodiq Egbon",
    property: "001",
    client: "Peter Abbey",
    saleValue: "₦15,000,000",
    commission: "₦750,000",
    status: "Overdue",
  },
  {
    id: 13,
    realtorName: "Sodiq Egbon",
    property: "001",
    client: "Peter Abbey",
    saleValue: "₦15,000,000",
    commission: "₦750,000",
    status: "Paid",
  },
];

/* ------------------------------------------------------------------ */
/*  Summary stats                                                      */
/* ------------------------------------------------------------------ */

const summaryStats = {
  period: "1 Jan - 30 Jan",
  totalCommissionsPaid: "₦30,000,000",
  totalCommissionsPending: "₦5,000,000",
};

/* ------------------------------------------------------------------ */
/*  Commission-status badge                                            */
/* ------------------------------------------------------------------ */

const statusStyles: Record<string, { bg: string; text: string }> = {
  Paid: { bg: "bg-[#ddf6e2]", text: "text-[#34c759]" },
  Pending: { bg: "bg-[#f2d5ff]", text: "text-[#8a38f5]" },
  Overdue: { bg: "bg-[#ffe5e5]", text: "text-[#ff383c]" },
};

function CommissionStatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] ?? {
    bg: "bg-[#f3f3f3]",
    text: "text-[#6f6d6d]",
  };
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg px-1 py-0.5 font-montserrat text-[9px] font-semibold ${style.bg} ${style.text}`}
    >
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Filter options                                                     */
/* ------------------------------------------------------------------ */

const statusOptions = Array.from(
  new Set(mockCommissionsData.map((r) => r.status)),
).map((s) => ({ label: s, value: s }));

/* ------------------------------------------------------------------ */
/*  Table config                                                       */
/* ------------------------------------------------------------------ */

const headers = [
  "Realtor Name",
  "Property",
  "Client",
  "Sale Value",
  "Commission (₦)",
  "Status",
];

const headerKeyMap: Record<string, string> = {
  "Realtor Name": "realtorName",
  Property: "property",
  Client: "client",
  "Sale Value": "saleValue",
  "Commission (₦)": "commission",
  Status: "statusBadge",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface CommissionsProps {
  canEdit?: boolean;
}

export default function Commissions({ canEdit = false }: CommissionsProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(string | number)[]>([]);
  const [configureOpen, setConfigureOpen] = useState(false);

  const tableData = useMemo(() => {
    let rows = mockCommissionsData;

    /* Search across visible text columns */
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.realtorName.toLowerCase().includes(q) ||
          r.property.toLowerCase().includes(q) ||
          r.client.toLowerCase().includes(q) ||
          r.saleValue.toLowerCase().includes(q) ||
          r.commission.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q),
      );
    }

    /* Status filter */
    if (statusFilter.length > 0) {
      rows = rows.filter((r) => statusFilter.includes(r.status));
    }

    return rows.map((r) => ({
      ...r,
      statusBadge: <CommissionStatusBadge status={r.status} />,
    }));
  }, [search, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      {/* Action buttons */}
      <div className="flex items-end gap-2">
        {canEdit && (
          <Button
            onClick={() => setConfigureOpen(true)}
            className="gap-1 rounded-lg bg-[#f3f3f3] px-2 py-1 font-montserrat text-sm font-bold text-[#0f0f0f] hover:bg-[#e0e0e0]"
          >
            Configure Commissions
            <SlidersHorizontal size={18} />
          </Button>
        )}
        <Button className="gap-1 rounded-lg bg-[#8a38f5] px-2 py-1 font-montserrat text-sm font-bold text-[#f8f8f8] hover:bg-[#7828e0]">
          Download Report
          <Download size={18} />
        </Button>
      </div>

      {/* Summary stats */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4 font-montserrat text-sm text-[#0f0f0f]">
          <span className="font-normal">Period</span>
          <span className="font-bold">{summaryStats.period}</span>
        </div>
        <div className="flex items-center gap-4 font-montserrat text-sm text-[#0f0f0f]">
          <span className="font-normal">Total Commissions Paid</span>
          <span className="font-bold">{summaryStats.totalCommissionsPaid}</span>
        </div>
        <div className="flex items-center gap-4 font-montserrat text-sm text-[#0f0f0f]">
          <span className="font-normal">Total Commissions Pending</span>
          <span className="font-bold">
            {summaryStats.totalCommissionsPending}
          </span>
        </div>
      </div>

      {/* Table with always-visible toolbar */}
      <div className="w-full overflow-hidden rounded-lg bg-[#f8f8f8] p-4">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search"
            />
          </div>
          <CustomMultiSelectFilter
            title="Status"
            options={statusOptions}
            selectedValues={statusFilter}
            onApplyFilter={setStatusFilter}
          />
        </div>

        <CustomTable
          headers={headers}
          data={tableData}
          headerKeyMap={headerKeyMap}
        />
      </div>

      {/* Configure commissions dialog */}
      <ConfigureCommissionsDialog
        open={configureOpen}
        onOpenChange={setConfigureOpen}
      />
    </div>
  );
}
