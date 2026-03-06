"use client";

import { useState, useMemo } from "react";
import CustomTable from "@/components/shared/CustomTable";
import SearchInput from "@/components/shared/CustomSearchInput";
import CustomMultiSelectFilter from "@/components/shared/CustomMultiSelectFilter";
import { Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfigureCommissionsDialog from "@/components/finance/ConfigureCommissionsDialog";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CommissionRecord {
  [key: string]: React.ReactNode | string | number | null | object;
  id: number;
  date: string;
  staffRealtor: string;
  client: string;
  property: string;
  saleAmount: string;
  commission: string;
  status: string;
  role: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const mockCommissionsData: CommissionRecord[] = [
  {
    id: 1,
    date: "2 Jul, 2026",
    staffRealtor: "John Doe",
    client: "Peter Abbey",
    property: "2 Bedroom Duplex/Joy Prime Hills",
    saleAmount: "₦15,000,000",
    commission: "₦750,000",
    status: "Paid",
    role: "Staff",
  },
  {
    id: 2,
    date: "5 Jul, 2026",
    staffRealtor: "Jane Smith",
    client: "Mary Johnson",
    property: "3 Bedroom Flat/Lekki Heights",
    saleAmount: "₦25,000,000",
    commission: "₦1,250,000",
    status: "Pending",
    role: "Realtor",
  },
  {
    id: 3,
    date: "8 Jul, 2026",
    staffRealtor: "Mike Ross",
    client: "David Brown",
    property: "5 Bedroom Mansion/Victoria Island",
    saleAmount: "₦85,000,000",
    commission: "₦4,250,000",
    status: "Paid",
    role: "Realtor",
  },
  {
    id: 4,
    date: "10 Jul, 2026",
    staffRealtor: "Sarah Wilson",
    client: "James Taylor",
    property: "2 Bedroom Flat/Ikoyi Estate",
    saleAmount: "₦18,000,000",
    commission: "₦900,000",
    status: "Pending",
    role: "Staff",
  },
  {
    id: 5,
    date: "12 Jul, 2026",
    staffRealtor: "John Doe",
    client: "Lisa Anderson",
    property: "4 Bedroom Duplex/Banana Island",
    saleAmount: "₦120,000,000",
    commission: "₦6,000,000",
    status: "Paid",
    role: "Staff",
  },
];

/* ------------------------------------------------------------------ */
/*  Summary stats                                                      */
/* ------------------------------------------------------------------ */

const summaryStats = {
  period: "1 Jan - 30 Jan",
  totalCommissions: "₦22,150,000",
  paidCommissions: "₦15,950,000",
  pendingCommissions: "₦6,200,000",
};

/* ------------------------------------------------------------------ */
/*  Commission-status badge                                            */
/* ------------------------------------------------------------------ */

const statusStyles: Record<string, { bg: string; text: string }> = {
  Paid: { bg: "bg-[#ddf6e2]", text: "text-[#34c759]" },
  Pending: { bg: "bg-[#f2d5ff]", text: "text-[#8a38f5]" },
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

const roleOptions = Array.from(
  new Set(mockCommissionsData.map((r) => r.role)),
).map((role) => ({ label: role, value: role }));

const statusOptions = Array.from(
  new Set(mockCommissionsData.map((r) => r.status)),
).map((s) => ({ label: s, value: s }));

/* ------------------------------------------------------------------ */
/*  Table config                                                       */
/* ------------------------------------------------------------------ */

const headers = [
  "Date",
  "Staff/Realtor",
  "Client",
  "Property",
  "Sale Amount",
  "Commission",
  "Status",
];

const headerKeyMap: Record<string, string> = {
  Date: "date",
  "Staff/Realtor": "staffRealtor",
  Client: "client",
  Property: "property",
  "Sale Amount": "saleAmount",
  Commission: "commission",
  Status: "statusBadge",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Commissions() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<(string | number)[]>([]);
  const [statusFilter, setStatusFilter] = useState<(string | number)[]>([]);
  const [configureOpen, setConfigureOpen] = useState(false);

  const tableData = useMemo(() => {
    let rows = mockCommissionsData;

    /* Search across visible text columns */
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.date.toLowerCase().includes(q) ||
          r.staffRealtor.toLowerCase().includes(q) ||
          r.client.toLowerCase().includes(q) ||
          r.property.toLowerCase().includes(q) ||
          r.saleAmount.toLowerCase().includes(q) ||
          r.commission.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q),
      );
    }

    /* Role filter */
    if (roleFilter.length > 0) {
      rows = rows.filter((r) => roleFilter.includes(r.role));
    }

    /* Status filter */
    if (statusFilter.length > 0) {
      rows = rows.filter((r) => statusFilter.includes(r.status));
    }

    return rows.map((r) => ({
      ...r,
      statusBadge: <CommissionStatusBadge status={r.status} />,
    }));
  }, [search, roleFilter, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      {/* Action buttons */}
      <div className="flex flex-col items-end gap-2 sm:flex-row">
        <Button
          onClick={() => setConfigureOpen(true)}
          className="gap-1 rounded-lg bg-[#f3f3f3] px-2 py-1 font-montserrat text-sm font-bold text-[#0f0f0f] hover:bg-[#e0e0e0]"
        >
          <Settings size={18} />
          Configure Rates
        </Button>
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
          <span className="font-normal">Total Commissions</span>
          <span className="font-bold">{summaryStats.totalCommissions}</span>
        </div>
        <div className="flex items-center gap-4 font-montserrat text-sm text-[#0f0f0f]">
          <span className="font-normal">Paid</span>
          <span className="font-bold text-[#34c759]">
            {summaryStats.paidCommissions}
          </span>
        </div>
        <div className="flex items-center gap-4 font-montserrat text-sm text-[#0f0f0f]">
          <span className="font-normal">Pending</span>
          <span className="font-bold text-[#8a38f5]">
            {summaryStats.pendingCommissions}
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
          <div className="flex items-center gap-4">
            <CustomMultiSelectFilter
              title="Role"
              options={roleOptions}
              selectedValues={roleFilter}
              onApplyFilter={setRoleFilter}
            />
            <CustomMultiSelectFilter
              title="Status"
              options={statusOptions}
              selectedValues={statusFilter}
              onApplyFilter={setStatusFilter}
            />
          </div>
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
