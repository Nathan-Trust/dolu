"use client";

import { useState, useMemo } from "react";
import CustomTable from "@/components/shared/CustomTable";
import SearchInput from "@/components/shared/CustomSearchInput";
import CustomMultiSelectFilter from "@/components/shared/CustomMultiSelectFilter";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddStaffSalarySheet from "@/components/finance/AddStaffSalarySheet";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SalaryPaymentRecord {
  [key: string]: React.ReactNode | string | number | null | object;
  id: number;
  staffName: string;
  month: string;
  paymentDate: string;
  netAmount: string;
  status: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const mockSalaryPaymentsData: SalaryPaymentRecord[] = [
  {
    id: 1,
    staffName: "John Doe",
    month: "July 2026",
    paymentDate: "2 Jul, 2026",
    netAmount: "₦550,000",
    status: "Paid",
  },
  {
    id: 2,
    staffName: "Jane Smith",
    month: "July 2026",
    paymentDate: "2 Jul, 2026",
    netAmount: "₦490,000",
    status: "Paid",
  },
  {
    id: 3,
    staffName: "Mike Ross",
    month: "July 2026",
    paymentDate: "2 Jul, 2026",
    netAmount: "₦370,000",
    status: "Pending",
  },
  {
    id: 4,
    staffName: "Sarah Wilson",
    month: "July 2026",
    paymentDate: "2 Jul, 2026",
    netAmount: "₦275,000",
    status: "Pending",
  },
  {
    id: 5,
    staffName: "David Brown",
    month: "July 2026",
    paymentDate: "2 Jul, 2026",
    netAmount: "₦425,000",
    status: "Paid",
  },
  {
    id: 6,
    staffName: "Lisa Anderson",
    month: "July 2026",
    paymentDate: "2 Jul, 2026",
    netAmount: "₦320,000",
    status: "Paid",
  },
  {
    id: 7,
    staffName: "James Taylor",
    month: "July 2026",
    paymentDate: "2 Jul, 2026",
    netAmount: "₦410,000",
    status: "Pending",
  },
  {
    id: 8,
    staffName: "Emma Wilson",
    month: "July 2026",
    paymentDate: "2 Jul, 2026",
    netAmount: "₦380,000",
    status: "Paid",
  },
  {
    id: 9,
    staffName: "Robert Clark",
    month: "July 2026",
    paymentDate: "2 Jul, 2026",
    netAmount: "₦450,000",
    status: "Pending",
  },
  {
    id: 10,
    staffName: "Sophie Davis",
    month: "July 2026",
    paymentDate: "2 Jul, 2026",
    netAmount: "₦290,000",
    status: "Paid",
  },
  {
    id: 11,
    staffName: "Daniel White",
    month: "July 2026",
    paymentDate: "2 Jul, 2026",
    netAmount: "₦350,000",
    status: "Paid",
  },
  {
    id: 12,
    staffName: "Grace Martin",
    month: "July 2026",
    paymentDate: "2 Jul, 2026",
    netAmount: "₦310,000",
    status: "Pending",
  },
];

/* ------------------------------------------------------------------ */
/*  Summary stats                                                      */
/* ------------------------------------------------------------------ */

const summaryStats = {
  totalPaid: "₦1,465,000",
  totalPending: "₦645,000",
};

/* ------------------------------------------------------------------ */
/*  Salary-status badge                                                */
/* ------------------------------------------------------------------ */

const statusStyles: Record<string, { bg: string; text: string }> = {
  Paid: { bg: "bg-[#ddf6e2]", text: "text-[#34c759]" },
  Pending: { bg: "bg-[#f2d5ff]", text: "text-[#8a38f5]" },
  Overdue: { bg: "bg-[#ffe5e5]", text: "text-[#ff383c]" },
};

function SalaryStatusBadge({ status }: { status: string }) {
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
  new Set(mockSalaryPaymentsData.map((r) => r.status)),
).map((s) => ({ label: s, value: s }));

/* ------------------------------------------------------------------ */
/*  Table config                                                       */
/* ------------------------------------------------------------------ */

const headers = ["Staff Name", "Month", "Payment Date", "Net Amount", "Status"];

const headerKeyMap: Record<string, string> = {
  "Staff Name": "staffName",
  Month: "month",
  "Payment Date": "paymentDate",
  "Net Amount": "netAmount",
  Status: "statusBadge",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface SalaryPaymentsProps {
  canCreate?: boolean;
}

export default function SalaryPayments({
  canCreate = false,
}: SalaryPaymentsProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(string | number)[]>([]);
  const [addSalaryOpen, setAddSalaryOpen] = useState(false);

  const tableData = useMemo(() => {
    let rows = mockSalaryPaymentsData;

    /* Search across visible text columns */
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.staffName.toLowerCase().includes(q) ||
          r.month.toLowerCase().includes(q) ||
          r.paymentDate.toLowerCase().includes(q) ||
          r.netAmount.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q),
      );
    }

    /* Status filter */
    if (statusFilter.length > 0) {
      rows = rows.filter((r) => statusFilter.includes(r.status));
    }

    return rows.map((r) => ({
      ...r,
      statusBadge: <SalaryStatusBadge status={r.status} />,
    }));
  }, [search, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      {/* Action button */}
      <div className="flex items-end">
        {canCreate && (
          <Button
            onClick={() => setAddSalaryOpen(true)}
            className="gap-1 rounded-lg bg-[#f3f3f3] px-2 py-1 font-montserrat text-sm font-bold text-[#0f0f0f] hover:bg-[#e0e0e0]"
          >
            <Plus size={18} />
            Add Staff Salary Module
          </Button>
        )}
      </div>

      {/* Summary stats */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4 font-montserrat text-sm text-[#0f0f0f]">
          <span className="font-normal">Total Paid</span>
          <span className="font-bold text-[#34c759]">
            {summaryStats.totalPaid}
          </span>
        </div>
        <div className="flex items-center gap-4 font-montserrat text-sm text-[#0f0f0f]">
          <span className="font-normal">Total Pending</span>
          <span className="font-bold text-[#8a38f5]">
            {summaryStats.totalPending}
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

      {/* Add salary sheet */}
      <AddStaffSalarySheet
        open={addSalaryOpen}
        onOpenChange={setAddSalaryOpen}
        onSuccess={() => {
          // TODO: Refresh data after successful addition
        }}
      />
    </div>
  );
}
