"use client";

import { useState, useMemo } from "react";
import CustomTable from "@/components/shared/CustomTable";
import SearchInput from "@/components/shared/CustomSearchInput";
import CustomMultiSelectFilter from "@/components/shared/CustomMultiSelectFilter";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddStaffSalarySheet from "@/components/finance/AddStaffSalarySheet";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SalaryPaymentRecord {
  [key: string]: React.ReactNode | string | number | null | object;
  id: number;
  month: string;
  staffMember: string;
  role: string;
  baseSalary: string;
  bonuses: string;
  deductions: string;
  netSalary: string;
  status: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const mockSalaryPaymentsData: SalaryPaymentRecord[] = [
  {
    id: 1,
    month: "July 2026",
    staffMember: "John Doe",
    role: "Sales Manager",
    baseSalary: "₦500,000",
    bonuses: "₦100,000",
    deductions: "₦50,000",
    netSalary: "₦550,000",
    status: "Paid",
  },
  {
    id: 2,
    month: "July 2026",
    staffMember: "Jane Smith",
    role: "Marketing Lead",
    baseSalary: "₦450,000",
    bonuses: "₦80,000",
    deductions: "₦40,000",
    netSalary: "₦490,000",
    status: "Paid",
  },
  {
    id: 3,
    month: "July 2026",
    staffMember: "Mike Ross",
    role: "Property Consultant",
    baseSalary: "₦350,000",
    bonuses: "₦50,000",
    deductions: "₦30,000",
    netSalary: "₦370,000",
    status: "Pending",
  },
  {
    id: 4,
    month: "July 2026",
    staffMember: "Sarah Wilson",
    role: "Admin Officer",
    baseSalary: "₦280,000",
    bonuses: "₦20,000",
    deductions: "₦25,000",
    netSalary: "₦275,000",
    status: "Pending",
  },
  {
    id: 5,
    month: "July 2026",
    staffMember: "David Brown",
    role: "Finance Officer",
    baseSalary: "₦400,000",
    bonuses: "₦60,000",
    deductions: "₦35,000",
    netSalary: "₦425,000",
    status: "Paid",
  },
];

/* ------------------------------------------------------------------ */
/*  Summary stats                                                      */
/* ------------------------------------------------------------------ */

const summaryStats = {
  period: "July 2026",
  totalSalaries: "₦2,110,000",
  totalPaid: "₦1,465,000",
  totalPending: "₦645,000",
  totalBonuses: "₦310,000",
  totalDeductions: "₦180,000",
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

const roleOptions = Array.from(
  new Set(mockSalaryPaymentsData.map((r) => r.role)),
).map((role) => ({ label: role, value: role }));

const statusOptions = Array.from(
  new Set(mockSalaryPaymentsData.map((r) => r.status)),
).map((s) => ({ label: s, value: s }));

/* ------------------------------------------------------------------ */
/*  Table config                                                       */
/* ------------------------------------------------------------------ */

const headers = [
  "Month",
  "Staff Member",
  "Role",
  "Base Salary",
  "Bonuses",
  "Deductions",
  "Net Salary",
  "Status",
];

const headerKeyMap: Record<string, string> = {
  Month: "month",
  "Staff Member": "staffMember",
  Role: "role",
  "Base Salary": "baseSalary",
  Bonuses: "bonuses",
  Deductions: "deductions",
  "Net Salary": "netSalary",
  Status: "statusBadge",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SalaryPayments() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<(string | number)[]>([]);
  const [statusFilter, setStatusFilter] = useState<(string | number)[]>([]);
  const [addSalaryOpen, setAddSalaryOpen] = useState(false);

  const tableData = useMemo(() => {
    let rows = mockSalaryPaymentsData;

    /* Search across visible text columns */
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.month.toLowerCase().includes(q) ||
          r.staffMember.toLowerCase().includes(q) ||
          r.role.toLowerCase().includes(q) ||
          r.baseSalary.toLowerCase().includes(q) ||
          r.netSalary.toLowerCase().includes(q) ||
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
      statusBadge: <SalaryStatusBadge status={r.status} />,
    }));
  }, [search, roleFilter, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      {/* Action buttons */}
      <div className="flex flex-col items-end gap-2 sm:flex-row">
        <Button
          onClick={() => setAddSalaryOpen(true)}
          className="gap-1 rounded-lg bg-[#f3f3f3] px-2 py-1 font-montserrat text-sm font-bold text-[#0f0f0f] hover:bg-[#e0e0e0]"
        >
          <Plus size={18} />
          Add Salary Payment
        </Button>
        <Button className="gap-1 rounded-lg bg-[#8a38f5] px-2 py-1 font-montserrat text-sm font-bold text-[#f8f8f8] hover:bg-[#7828e0]">
          Download Report
          <Download size={18} />
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        <div className="flex items-center gap-4 font-montserrat text-sm text-[#0f0f0f]">
          <span className="font-normal">Period</span>
          <span className="font-bold">{summaryStats.period}</span>
        </div>
        <div className="flex items-center gap-4 font-montserrat text-sm text-[#0f0f0f]">
          <span className="font-normal">Total Salaries</span>
          <span className="font-bold">{summaryStats.totalSalaries}</span>
        </div>
        <div className="flex items-center gap-4 font-montserrat text-sm text-[#0f0f0f]">
          <span className="font-normal">Paid</span>
          <span className="font-bold text-[#34c759]">
            {summaryStats.totalPaid}
          </span>
        </div>
        <div className="flex items-center gap-4 font-montserrat text-sm text-[#0f0f0f]">
          <span className="font-normal">Pending</span>
          <span className="font-bold text-[#8a38f5]">
            {summaryStats.totalPending}
          </span>
        </div>
        <div className="flex items-center gap-4 font-montserrat text-sm text-[#0f0f0f]">
          <span className="font-normal">Bonuses</span>
          <span className="font-bold">{summaryStats.totalBonuses}</span>
        </div>
        <div className="flex items-center gap-4 font-montserrat text-sm text-[#0f0f0f]">
          <span className="font-normal">Deductions</span>
          <span className="font-bold">{summaryStats.totalDeductions}</span>
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
