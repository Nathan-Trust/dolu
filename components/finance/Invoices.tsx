"use client";

import { useState, useMemo } from "react";
import CustomTable from "@/components/shared/CustomTable";
import SearchInput from "@/components/shared/CustomSearchInput";
import CustomMultiSelectFilter from "@/components/shared/CustomMultiSelectFilter";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import InvoiceDetailDialog from "@/components/finance/InvoiceDetailDialog";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface InvoiceRecord {
  [key: string]: React.ReactNode | string | number | null | object;
  id: number;
  invoiceNumber: string;
  client: string;
  amount: string;
  dueDate: string;
  status: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const mockInvoicesData: InvoiceRecord[] = [
  {
    id: 1,
    invoiceNumber: "1013",
    client: "Peter Abbey",
    amount: "₦15,000,000",
    dueDate: "2 Jul, 2026",
    status: "Paid",
  },
  {
    id: 2,
    invoiceNumber: "1013",
    client: "Peter Abbey",
    amount: "₦15,000,000",
    dueDate: "2 Jul, 2026",
    status: "Paid",
  },
  {
    id: 3,
    invoiceNumber: "1013",
    client: "Peter Abbey",
    amount: "₦15,000,000",
    dueDate: "2 Jul, 2026",
    status: "Pending",
  },
  {
    id: 4,
    invoiceNumber: "1013",
    client: "Peter Abbey",
    amount: "₦15,000,000",
    dueDate: "2 Jul, 2026",
    status: "Paid",
  },
  {
    id: 5,
    invoiceNumber: "1013",
    client: "Peter Abbey",
    amount: "₦15,000,000",
    dueDate: "2 Jul, 2026",
    status: "Overdue",
  },
  {
    id: 6,
    invoiceNumber: "1013",
    client: "Peter Abbey",
    amount: "₦15,000,000",
    dueDate: "2 Jul, 2026",
    status: "Paid",
  },
  {
    id: 7,
    invoiceNumber: "1013",
    client: "Peter Abbey",
    amount: "₦15,000,000",
    dueDate: "2 Jul, 2026",
    status: "Pending",
  },
  {
    id: 8,
    invoiceNumber: "1013",
    client: "Peter Abbey",
    amount: "₦15,000,000",
    dueDate: "2 Jul, 2026",
    status: "Paid",
  },
  {
    id: 9,
    invoiceNumber: "1013",
    client: "Peter Abbey",
    amount: "₦15,000,000",
    dueDate: "2 Jul, 2026",
    status: "Pending",
  },
  {
    id: 10,
    invoiceNumber: "1013",
    client: "Peter Abbey",
    amount: "₦15,000,000",
    dueDate: "2 Jul, 2026",
    status: "Overdue",
  },
  {
    id: 11,
    invoiceNumber: "1013",
    client: "Peter Abbey",
    amount: "₦15,000,000",
    dueDate: "2 Jul, 2026",
    status: "Pending",
  },
  {
    id: 12,
    invoiceNumber: "1013",
    client: "Peter Abbey",
    amount: "₦15,000,000",
    dueDate: "2 Jul, 2026",
    status: "Overdue",
  },
  {
    id: 13,
    invoiceNumber: "1013",
    client: "Peter Abbey",
    amount: "₦15,000,000",
    dueDate: "2 Jul, 2026",
    status: "Overdue",
  },
];

/* ------------------------------------------------------------------ */
/*  Summary stats                                                      */
/* ------------------------------------------------------------------ */

const summaryStats = {
  period: "1 Jan - 30 Jan",
  totalExpenses: "₦134,235,040",
};

/* ------------------------------------------------------------------ */
/*  Invoice-status badge                                               */
/* ------------------------------------------------------------------ */

const statusStyles: Record<string, { bg: string; text: string }> = {
  Paid: { bg: "bg-[#ddf6e2]", text: "text-[#34c759]" },
  Pending: { bg: "bg-[#f2d5ff]", text: "text-[#8a38f5]" },
  Overdue: { bg: "bg-[#ffe5e5]", text: "text-[#ff383c]" },
};

function InvoiceStatusBadge({ status }: { status: string }) {
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
  new Set(mockInvoicesData.map((r) => r.status)),
).map((s) => ({ label: s, value: s }));

/* ------------------------------------------------------------------ */
/*  Table config                                                       */
/* ------------------------------------------------------------------ */

const headers = ["Invoice Number", "Client", "Amount", "Due Date", "Status"];

const headerKeyMap: Record<string, string> = {
  "Invoice Number": "invoiceNumber",
  Client: "client",
  Amount: "amount",
  "Due Date": "dueDate",
  Status: "statusBadge",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Invoices() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(string | number)[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const tableData = useMemo(() => {
    let rows = mockInvoicesData;

    /* Search across visible text columns */
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.invoiceNumber.toLowerCase().includes(q) ||
          r.client.toLowerCase().includes(q) ||
          r.amount.toLowerCase().includes(q) ||
          r.dueDate.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q),
      );
    }

    /* Status filter */
    if (statusFilter.length > 0) {
      rows = rows.filter((r) => statusFilter.includes(r.status));
    }

    return rows.map((r) => ({
      ...r,
      statusBadge: <InvoiceStatusBadge status={r.status} />,
    }));
  }, [search, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      {/* Download button */}
      <div className="flex flex-col items-end">
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
          <span className="font-normal">Total Expenses</span>
          <span className="font-bold">{summaryStats.totalExpenses}</span>
        </div>
      </div>

      {/* Table */}
      <CustomTable
        headers={headers}
        data={tableData}
        headerKeyMap={headerKeyMap}
        onRowClick={(row) => {
          setSelectedInvoice(row as unknown as InvoiceRecord);
          setDialogOpen(true);
        }}
        searchSlot={
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search"
          />
        }
        headerRight={
          <CustomMultiSelectFilter
            title="Status"
            options={statusOptions}
            selectedValues={statusFilter}
            onApplyFilter={setStatusFilter}
          />
        }
      />

      {/* Invoice detail dialog */}
      <InvoiceDetailDialog
        invoice={
          selectedInvoice
            ? {
                invoiceNumber: selectedInvoice.invoiceNumber,
                client: selectedInvoice.client,
                amount: selectedInvoice.amount,
                dueDate: selectedInvoice.dueDate,
                status: selectedInvoice.status,
              }
            : null
        }
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
