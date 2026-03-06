"use client";

import { useState, useMemo } from "react";
import CustomTable from "@/components/shared/CustomTable";
import SearchInput from "@/components/shared/CustomSearchInput";
import CustomMultiSelectFilter from "@/components/shared/CustomMultiSelectFilter";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ProcurementRecord {
  [key: string]: React.ReactNode | string | number | null | object;
  id: number;
  date: string;
  vendor: string;
  item: string;
  quantity: string;
  unitPrice: string;
  totalAmount: string;
  status: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const mockProcurementsData: ProcurementRecord[] = [
  {
    id: 1,
    date: "2 Jul, 2026",
    vendor: "Office Depot Ltd",
    item: "Office Furniture",
    quantity: "10 Units",
    unitPrice: "₦150,000",
    totalAmount: "₦1,500,000",
    status: "Delivered",
  },
  {
    id: 2,
    date: "5 Jul, 2026",
    vendor: "Tech Solutions Co",
    item: "Computers & Laptops",
    quantity: "5 Units",
    unitPrice: "₦350,000",
    totalAmount: "₦1,750,000",
    status: "Pending",
  },
  {
    id: 3,
    date: "8 Jul, 2026",
    vendor: "Construction Materials Inc",
    item: "Building Materials",
    quantity: "1 Lot",
    unitPrice: "₦5,000,000",
    totalAmount: "₦5,000,000",
    status: "Delivered",
  },
  {
    id: 4,
    date: "10 Jul, 2026",
    vendor: "Marketing Agency",
    item: "Billboard Advertising",
    quantity: "3 Months",
    unitPrice: "₦400,000",
    totalAmount: "₦1,200,000",
    status: "Pending",
  },
  {
    id: 5,
    date: "12 Jul, 2026",
    vendor: "Vehicle Rentals Ltd",
    item: "Company Vehicles",
    quantity: "2 Units",
    unitPrice: "₦800,000",
    totalAmount: "₦1,600,000",
    status: "Delivered",
  },
];

/* ------------------------------------------------------------------ */
/*  Summary stats                                                      */
/* ------------------------------------------------------------------ */

const summaryStats = {
  period: "1 Jan - 30 Jan",
  totalProcurements: "₦24,050,000",
  delivered: "₦18,100,000",
  pending: "₦5,950,000",
};

/* ------------------------------------------------------------------ */
/*  Procurement-status badge                                           */
/* ------------------------------------------------------------------ */

const statusStyles: Record<string, { bg: string; text: string }> = {
  Delivered: { bg: "bg-[#ddf6e2]", text: "text-[#34c759]" },
  Pending: { bg: "bg-[#f2d5ff]", text: "text-[#8a38f5]" },
  Cancelled: { bg: "bg-[#ffe5e5]", text: "text-[#ff383c]" },
};

function ProcurementStatusBadge({ status }: { status: string }) {
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
  new Set(mockProcurementsData.map((r) => r.status)),
).map((s) => ({ label: s, value: s }));

/* ------------------------------------------------------------------ */
/*  Table config                                                       */
/* ------------------------------------------------------------------ */

const headers = [
  "Date",
  "Vendor",
  "Item",
  "Quantity",
  "Unit Price",
  "Total Amount",
  "Status",
];

const headerKeyMap: Record<string, string> = {
  Date: "date",
  Vendor: "vendor",
  Item: "item",
  Quantity: "quantity",
  "Unit Price": "unitPrice",
  "Total Amount": "totalAmount",
  Status: "statusBadge",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Procurements() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(string | number)[]>([]);

  const tableData = useMemo(() => {
    let rows = mockProcurementsData;

    /* Search across visible text columns */
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.date.toLowerCase().includes(q) ||
          r.vendor.toLowerCase().includes(q) ||
          r.item.toLowerCase().includes(q) ||
          r.quantity.toLowerCase().includes(q) ||
          r.unitPrice.toLowerCase().includes(q) ||
          r.totalAmount.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q),
      );
    }

    /* Status filter */
    if (statusFilter.length > 0) {
      rows = rows.filter((r) => statusFilter.includes(r.status));
    }

    return rows.map((r) => ({
      ...r,
      statusBadge: <ProcurementStatusBadge status={r.status} />,
    }));
  }, [search, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      {/* Action buttons */}
      <div className="flex flex-col items-end gap-2 sm:flex-row">
        <Button className="gap-1 rounded-lg bg-[#f3f3f3] px-2 py-1 font-montserrat text-sm font-bold text-[#0f0f0f] hover:bg-[#e0e0e0]">
          <Plus size={18} />
          Add Procurement
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
          <span className="font-normal">Total Procurements</span>
          <span className="font-bold">{summaryStats.totalProcurements}</span>
        </div>
        <div className="flex items-center gap-4 font-montserrat text-sm text-[#0f0f0f]">
          <span className="font-normal">Delivered</span>
          <span className="font-bold text-[#34c759]">
            {summaryStats.delivered}
          </span>
        </div>
        <div className="flex items-center gap-4 font-montserrat text-sm text-[#0f0f0f]">
          <span className="font-normal">Pending</span>
          <span className="font-bold text-[#8a38f5]">
            {summaryStats.pending}
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
    </div>
  );
}
