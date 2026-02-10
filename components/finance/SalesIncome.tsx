"use client";

import { useState, useMemo } from "react";
import CustomTable from "@/components/shared/CustomTable";
import SearchInput from "@/components/shared/CustomSearchInput";
import CustomMultiSelectFilter from "@/components/shared/CustomMultiSelectFilter";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SalesRecord {
  id: number;
  date: string;
  client: string;
  propertyEstate: string;
  amount: string;
  status: string;
  assignedTo: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const mockSalesData: SalesRecord[] = [
  {
    id: 1,
    date: "2 Jul, 2026",
    client: "Peter Abbey",
    propertyEstate: "2 Bedroom Duplex/Joy Prime Hills",
    amount: "₦15,000,000",
    status: "Fully Paid",
    assignedTo: "John Doe",
  },
  {
    id: 2,
    date: "2 Jul, 2026",
    client: "Peter Abbey",
    propertyEstate: "Joy Prime Hills",
    amount: "₦15,000,000",
    status: "Fully Paid",
    assignedTo: "Jane Smith",
  },
  {
    id: 3,
    date: "2 Jul, 2026",
    client: "Peter Abbey",
    propertyEstate: "Joy Prime Hills",
    amount: "₦15,000,000",
    status: "Fully Paid",
    assignedTo: "John Doe",
  },
  {
    id: 4,
    date: "2 Jul, 2026",
    client: "Peter Abbey",
    propertyEstate: "Joy Prime Hills",
    amount: "₦15,000,000",
    status: "Fully Paid",
    assignedTo: "Jane Smith",
  },
  {
    id: 5,
    date: "2 Jul, 2026",
    client: "Peter Abbey",
    propertyEstate: "Joy Prime Hills",
    amount: "₦15,000,000",
    status: "Partly Paid",
    assignedTo: "Mike Ross",
  },
  {
    id: 6,
    date: "2 Jul, 2026",
    client: "Peter Abbey",
    propertyEstate: "Joy Prime Hills",
    amount: "₦15,000,000",
    status: "Fully Paid",
    assignedTo: "John Doe",
  },
  {
    id: 7,
    date: "2 Jul, 2026",
    client: "Peter Abbey",
    propertyEstate: "Joy Prime Hills",
    amount: "₦15,000,000",
    status: "Fully Paid",
    assignedTo: "Jane Smith",
  },
  {
    id: 8,
    date: "2 Jul, 2026",
    client: "Peter Abbey",
    propertyEstate: "Joy Prime Hills",
    amount: "₦15,000,000",
    status: "Fully Paid",
    assignedTo: "Mike Ross",
  },
  {
    id: 9,
    date: "2 Jul, 2026",
    client: "Peter Abbey",
    propertyEstate: "Joy Prime Hills",
    amount: "₦15,000,000",
    status: "Pending",
    assignedTo: "John Doe",
  },
  {
    id: 10,
    date: "2 Jul, 2026",
    client: "Peter Abbey",
    propertyEstate: "Joy Prime Hills",
    amount: "₦15,000,000",
    status: "Fully Paid",
    assignedTo: "Jane Smith",
  },
  {
    id: 11,
    date: "2 Jul, 2026",
    client: "Peter Abbey",
    propertyEstate: "Joy Prime Hills",
    amount: "₦15,000,000",
    status: "Fully Paid",
    assignedTo: "John Doe",
  },
  {
    id: 12,
    date: "2 Jul, 2026",
    client: "Peter Abbey",
    propertyEstate: "Joy Prime Hills",
    amount: "₦15,000,000",
    status: "Fully Paid",
    assignedTo: "Mike Ross",
  },
];

/* ------------------------------------------------------------------ */
/*  Summary stats                                                      */
/* ------------------------------------------------------------------ */

const summaryStats = {
  period: "1 Jan - 30 Jan",
  totalSalesIncome: "₦160,325,078",
  numberOfDeals: "143",
};

/* ------------------------------------------------------------------ */
/*  Payment-status badge                                               */
/* ------------------------------------------------------------------ */

const statusStyles: Record<string, { bg: string; text: string }> = {
  "Fully Paid": { bg: "bg-[#ddf6e2]", text: "text-[#34c759]" },
  "Partly Paid": { bg: "bg-[#fff4cc]", text: "text-[#ac7f5e]" },
  Pending: { bg: "bg-[#d9edff]", text: "text-[#0088ff]" },
  Overdue: { bg: "bg-[#ffe5e5]", text: "text-[#ff383c]" },
};

function PaymentStatusBadge({ status }: { status: string }) {
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
/*  Filter option helpers                                              */
/* ------------------------------------------------------------------ */

const assignedToOptions = Array.from(
  new Set(mockSalesData.map((r) => r.assignedTo)),
).map((name) => ({ label: name, value: name }));

const statusOptions = Array.from(
  new Set(mockSalesData.map((r) => r.status)),
).map((s) => ({ label: s, value: s }));

/* ------------------------------------------------------------------ */
/*  Table config                                                       */
/* ------------------------------------------------------------------ */

const headers = ["Date", "Client", "Property/Estate", "Amount", "Status"];

const headerKeyMap: Record<string, string> = {
  Date: "date",
  Client: "client",
  "Property/Estate": "propertyEstate",
  Amount: "amount",
  Status: "statusBadge",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SalesIncome() {
  const [search, setSearch] = useState("");
  const [assignedFilter, setAssignedFilter] = useState<(string | number)[]>([]);
  const [statusFilter, setStatusFilter] = useState<(string | number)[]>([]);

  /* Filtered + badge-enhanced rows */
  const tableData = useMemo(() => {
    let rows = mockSalesData;

    /* Search across visible text columns */
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.date.toLowerCase().includes(q) ||
          r.client.toLowerCase().includes(q) ||
          r.propertyEstate.toLowerCase().includes(q) ||
          r.amount.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q),
      );
    }

    /* Assigned-to filter */
    if (assignedFilter.length > 0) {
      rows = rows.filter((r) => assignedFilter.includes(r.assignedTo));
    }

    /* Status filter */
    if (statusFilter.length > 0) {
      rows = rows.filter((r) => statusFilter.includes(r.status));
    }

    return rows.map((r) => ({
      ...r,
      statusBadge: <PaymentStatusBadge status={r.status} />,
    }));
  }, [search, assignedFilter, statusFilter]);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="flex flex-col gap-4">
      {/* Section title + Download button */}
      <div className="flex flex-col gap-4 items-end">
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
          <span className="font-normal">Total Sales Income</span>
          <span className="font-bold">{summaryStats.totalSalesIncome}</span>
        </div>
        <div className="flex items-center gap-4 font-montserrat text-sm text-[#0f0f0f]">
          <span className="font-normal">Number of Deals</span>
          <span className="font-bold">{summaryStats.numberOfDeals}</span>
        </div>
      </div>

      {/* Table */}
      <CustomTable
        headers={headers}
        data={tableData}
        headerKeyMap={headerKeyMap}
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
      />
    </div>
  );
}
