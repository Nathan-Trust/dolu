"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Ticket,
  ShoppingCart,
  Scale,
  FileText,
  Banknote,
  Search,
  ArrowRight,
  Plus,
  Filter,
} from "lucide-react";
import CustomTable from "@/components/shared/CustomTable";
import { type UserRole } from "@/util/status";
import type { OverviewData } from "@/services/overview";
import { OverviewHeader, StatusBadge } from "@/components/overview";
import { PersonCell } from "@/components/overview/PersonCell";
import { Badge } from "@/components/ui/badge";

// ─── Donut chart data ───────────────────────────────

const salesByEstateData = [
  { name: "Valley Hills Estate", value: 45, amount: "₦45M" },
  { name: "Green Park Estate", value: 32, amount: "₦32M" },
  { name: "Emerald Gardens", value: 12, amount: "₦12M" },
  { name: "Villa Prestigious", value: 2, amount: "₦2M" },
  { name: "Harcourt Luxé", value: 0.5, amount: "₦0.5M" },
];
const ESTATE_COLORS = ["#8a38f5", "#0088ff", "#34c759", "#ff38e0", "#38c8f5"];

// ─── Table types ────────────────────────────────────

type ExpenseRow = Record<
  string,
  React.ReactNode | string | number | null | object
> & {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: string;
};

type SalaryRow = Record<
  string,
  React.ReactNode | string | number | null | object
> & {
  id: string;
  staff: React.ReactNode;
  month: string;
  netAmount: string;
  status: React.ReactNode;
};

type CommissionRow = Record<
  string,
  React.ReactNode | string | number | null | object
> & {
  id: string;
  realtor: React.ReactNode;
  client: string;
  property: string;
  amount: string;
  dueDate: string;
  status: React.ReactNode;
  action: React.ReactNode;
};

type InvoiceRow = Record<
  string,
  React.ReactNode | string | number | null | object
> & {
  id: string;
  invoiceNumber: string;
  client: string;
  property: string;
  amount: string;
  dueDate: string;
  status: React.ReactNode;
};

// ─── Mock Data ──────────────────────────────────────

const expenseData: ExpenseRow[] = [
  {
    id: "1",
    date: "Jul 13, 2026",
    category: "Equipment",
    description: "Computers",
    amount: "₦450,000",
  },
  {
    id: "2",
    date: "Jul 13, 2026",
    category: "Marketing",
    description: "Billboard Payment",
    amount: "₦450,000",
  },
  {
    id: "3",
    date: "Jul 13, 2026",
    category: "Electricity",
    description: "Electricity",
    amount: "₦450,000",
  },
  {
    id: "4",
    date: "Jul 13, 2026",
    category: "Stationery",
    description: "Carton of Pens",
    amount: "₦450,000",
  },
  {
    id: "5",
    date: "Jul 13, 2026",
    category: "Refreshments",
    description: "Small Chops",
    amount: "₦450,000",
  },
];

const expenseHeaders = ["Date", "Category", "Description", "Amount"];
const expenseHeaderKeyMap: Record<string, string> = {
  Date: "date",
  Category: "category",
  Description: "description",
  Amount: "amount",
};

const salaryData: SalaryRow[] = [
  {
    id: "1",
    staff: <PersonCell name="John Ibekwe" initials="JI" color="#8a38f5" />,
    month: "July",
    netAmount: "₦2,500,000",
    status: <StatusBadge label="Paid" />,
  },
  {
    id: "2",
    staff: <PersonCell name="John Ibekwe" initials="JI" color="#34c759" />,
    month: "July",
    netAmount: "₦2,500,000",
    status: <StatusBadge label="Paid" />,
  },
  {
    id: "3",
    staff: <PersonCell name="John Ibekwe" initials="JI" color="#ff8d28" />,
    month: "July",
    netAmount: "₦2,500,000",
    status: <StatusBadge label="Paid" />,
  },
  {
    id: "4",
    staff: <PersonCell name="John Ibekwe" initials="JI" color="#0088ff" />,
    month: "July",
    netAmount: "₦2,500,000",
    status: <StatusBadge label="Pending" />,
  },
  {
    id: "5",
    staff: <PersonCell name="John Ibekwe" initials="JI" color="#ff383c" />,
    month: "July",
    netAmount: "₦2,500,000",
    status: <StatusBadge label="Paid" />,
  },
];

const salaryHeaders = ["Staff", "Month", "Net Amount", "Status"];
const salaryHeaderKeyMap: Record<string, string> = {
  Staff: "staff",
  Month: "month",
  "Net Amount": "netAmount",
  Status: "status",
};

function ApproveButton({ disabled = false }: { disabled?: boolean }) {
  return (
    <Badge
      className={`cursor-pointer rounded-lg border-0 px-1 py-0.5 font-montserrat text-[9px] font-semibold ${
        disabled ? "bg-[#f3f3f3] text-[#c8c8c8]" : "bg-[#f2d5ff] text-[#8a38f5]"
      }`}
    >
      Approve
    </Badge>
  );
}

const commissionData: CommissionRow[] = [
  {
    id: "1",
    realtor: <PersonCell name="Lilian Tamuno" initials="LT" color="#8a38f5" />,
    client: "Peter Abbey",
    property: "#123213",
    amount: "₦2,500,000",
    dueDate: "July 10",
    status: <StatusBadge label="Pending" />,
    action: <ApproveButton />,
  },
  {
    id: "2",
    realtor: <PersonCell name="Lilian Tamuno" initials="LT" color="#34c759" />,
    client: "Peter Abbey",
    property: "#123213",
    amount: "₦2,500,000",
    dueDate: "July 10",
    status: <StatusBadge label="Pending" />,
    action: <ApproveButton />,
  },
  {
    id: "3",
    realtor: <PersonCell name="Lilian Tamuno" initials="LT" color="#ff8d28" />,
    client: "Peter Abbey",
    property: "#123213",
    amount: "₦2,500,000",
    dueDate: "July 10",
    status: <StatusBadge label="Pending" />,
    action: <ApproveButton />,
  },
  {
    id: "4",
    realtor: <PersonCell name="Lilian Tamuno" initials="LT" color="#0088ff" />,
    client: "Peter Abbey",
    property: "#123213",
    amount: "₦2,500,000",
    dueDate: "July 10",
    status: <StatusBadge label="Pending" />,
    action: <ApproveButton />,
  },
  {
    id: "5",
    realtor: <PersonCell name="Lilian Tamuno" initials="LT" color="#ff383c" />,
    client: "Peter Abbey",
    property: "#123213",
    amount: "₦2,500,000",
    dueDate: "July 10",
    status: <StatusBadge label="Paid" />,
    action: <ApproveButton disabled />,
  },
];

const commissionHeaders = [
  "Realtor",
  "Client",
  "Property",
  "Amount",
  "Due Date",
  "Status",
  "Action",
];
const commissionHeaderKeyMap: Record<string, string> = {
  Realtor: "realtor",
  Client: "client",
  Property: "property",
  Amount: "amount",
  "Due Date": "dueDate",
  Status: "status",
  Action: "action",
};

const invoiceData: InvoiceRow[] = [
  {
    id: "1",
    invoiceNumber: "1013",
    client: "Peter Abbey",
    property: "#123432",
    amount: "₦15,000,000",
    dueDate: "2 Jul, 2026",
    status: <StatusBadge label="Paid" />,
  },
  {
    id: "2",
    invoiceNumber: "1013",
    client: "Peter Abbey",
    property: "#123432",
    amount: "₦15,000,000",
    dueDate: "2 Jul, 2026",
    status: <StatusBadge label="Paid" />,
  },
  {
    id: "3",
    invoiceNumber: "1013",
    client: "Peter Abbey",
    property: "#123432",
    amount: "₦15,000,000",
    dueDate: "2 Jul, 2026",
    status: <StatusBadge label="Pending" />,
  },
  {
    id: "4",
    invoiceNumber: "1013",
    client: "Peter Abbey",
    property: "#123432",
    amount: "₦15,000,000",
    dueDate: "2 Jul, 2026",
    status: <StatusBadge label="Paid" />,
  },
  {
    id: "5",
    invoiceNumber: "1013",
    client: "Peter Abbey",
    property: "#123432",
    amount: "₦15,000,000",
    dueDate: "2 Jul, 2026",
    status: <StatusBadge label="Overdue" />,
  },
];

const invoiceHeaders = [
  "Invoice Number",
  "Client",
  "Property",
  "Amount",
  "Due Date",
  "Status",
];
const invoiceHeaderKeyMap: Record<string, string> = {
  "Invoice Number": "invoiceNumber",
  Client: "client",
  Property: "property",
  Amount: "amount",
  "Due Date": "dueDate",
  Status: "status",
};

// ─── Search Slot ────────────────────────────────────

function SearchInput() {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-[#f3f3f3] p-1">
      <Search className="size-4 text-[#6f6d6d]" />
      <input
        type="text"
        placeholder="Search"
        className="w-full max-w-90.5 bg-transparent font-montserrat text-sm font-normal text-[#0f0f0f] placeholder-[#6f6d6d] outline-none"
      />
    </div>
  );
}

function StatusFilter() {
  return (
    <div className="flex items-center gap-1">
      <span className="font-montserrat text-xs font-normal text-[#6f6d6d]">
        Status
      </span>
      <Filter className="size-4 text-[#6f6d6d]" />
    </div>
  );
}

// ─── Alerts ─────────────────────────────────────────

const alerts = [
  { count: 3, label: "Invoices overdue" },
  { count: 5, label: "Commission payments loading" },
  { count: 35, label: "Salary payments due in 3 days" },
];

// ─── Component ──────────────────────────────────────

interface FinanceOverviewProps {
  role: UserRole;
  overviewData: OverviewData | null;
  isLoading: boolean;
}

export default function FinanceOverview({ role }: FinanceOverviewProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <OverviewHeader role={role} />

      {/* Status row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <p className="font-montserrat text-base font-normal text-[#0f0f0f]">
            Status: Active
          </p>
          <span className="size-2 rounded-full bg-[#34c759]" />
        </div>
        <p className="font-montserrat text-xs font-normal text-[#6f6d6d]">
          Last Activity: 19 Hours Ago
        </p>
      </div>

      {/* Metric cards - Row 1 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
        {/* Total Revenue (Sales Income) */}
        <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4">
          <div className="flex flex-col gap-1">
            <p className="font-montserrat text-base font-normal text-[#6f6d6d]">
              Total Revenue (Sales Income)
            </p>
            <p className="font-montserrat text-lg font-bold text-[#0f0f0f]">
              ₦80,325,000
            </p>
            <p className="font-montserrat text-xs font-normal text-[#6f6d6d]">
              This month
            </p>
          </div>
          <Ticket className="size-6 text-[#8a38f5]" />
        </div>

        {/* Total Expenses */}
        <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4">
          <div className="flex flex-col gap-2">
            <p className="font-montserrat text-base font-normal text-[#6f6d6d]">
              Total Expenses
            </p>
            <p className="font-montserrat text-lg font-bold text-[#0f0f0f]">
              ₦520,001
            </p>
          </div>
          <ShoppingCart className="size-6 text-[#8a38f5]" />
        </div>

        {/* Net Position */}
        <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4">
          <div className="flex flex-col gap-1">
            <p className="font-montserrat text-base font-normal text-[#6f6d6d]">
              Net Position (Revenue - Expenses)
            </p>
            <p className="font-montserrat text-lg font-bold text-[#0f0f0f]">
              ₦80,325,000
            </p>
          </div>
          <Scale className="size-6 text-[#8a38f5]" />
        </div>
      </div>

      {/* Metric cards - Row 2 */}
      <div className="flex gap-6">
        {/* Clients Awaiting Documentation */}
        <div className="flex w-full max-w-[347px] items-center justify-between rounded-lg bg-[#f8f8f8] p-4">
          <div className="flex flex-col gap-1">
            <p className="font-montserrat text-base font-normal text-[#6f6d6d]">
              Clients Awaiting Documentation
            </p>
            <p className="font-montserrat text-lg font-bold text-[#0f0f0f]">
              120
            </p>
            <p className="font-montserrat text-xs font-normal text-[#6f6d6d]">
              This month
            </p>
          </div>
          <FileText className="size-6 text-[#8a38f5]" />
        </div>

        {/* Pending Payments */}
        <div className="flex w-full max-w-[347px] items-center justify-between rounded-lg bg-[#f8f8f8] p-4">
          <div className="flex flex-col gap-1">
            <p className="font-montserrat text-base font-normal text-[#6f6d6d]">
              Pending Payments
            </p>
            <p className="font-montserrat text-lg font-bold text-[#0f0f0f]">
              5
            </p>
            <p className="font-montserrat text-xs font-normal text-[#6f6d6d]">
              This month
            </p>
          </div>
          <Banknote className="size-6 text-[#8a38f5]" />
        </div>
      </div>

      {/* Sales Income by Estate - Donut chart */}
      <div className="flex w-full max-w-[421px] flex-col gap-12 rounded-lg bg-[#f8f8f8] p-2">
        <div className="flex items-center justify-between">
          <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
            Sales Income by Estate
          </p>
          <span className="rounded-lg bg-[#e0e0e0] px-1 py-0.5 font-montserrat text-xs font-normal text-[#0f0f0f]">
            Jan
          </span>
        </div>
        <div className="flex items-center justify-center gap-16">
          <div className="relative size-39">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByEstateData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {salesByEstateData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={ESTATE_COLORS[index % ESTATE_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-montserrat text-xs font-normal text-[#0f0f0f]">
                Total Deals
              </p>
              <p className="font-montserrat text-xs font-bold text-[#0f0f0f]">
                100
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {salesByEstateData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span
                  className="size-4 rounded-full"
                  style={{
                    backgroundColor:
                      ESTATE_COLORS[index % ESTATE_COLORS.length],
                  }}
                />
                <span className="font-montserrat text-xs font-normal text-[#0f0f0f]">
                  {entry.name}
                </span>
                <span className="font-montserrat text-xs font-bold text-[#0f0f0f]">
                  {entry.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expense Tracker Panel */}
      <CustomTable
        title="Expense Tracker Panel"
        headers={expenseHeaders}
        data={expenseData}
        headerKeyMap={expenseHeaderKeyMap}
        searchSlot={<SearchInput />}
        headerRight={
          <button className="flex w-auto items-center justify-center gap-1 rounded-lg bg-[#8a38f5] px-3 py-1 font-montserrat text-base font-bold text-[#f8f8f8] transition-colors hover:bg-[#8a38f5]/90">
            Add Expense
            <ArrowRight className="size-6" />
          </button>
        }
      />

      {/* Salary Payments Panel */}
      <CustomTable
        title="Salary Payments Panel"
        headers={salaryHeaders}
        data={salaryData}
        headerKeyMap={salaryHeaderKeyMap}
        searchSlot={<SearchInput />}
        headerRight={
          <div className="flex items-center gap-4">
            <StatusFilter />
            <button className="flex w-auto items-center justify-center gap-1 rounded-lg bg-[#8a38f5] px-3 py-1 font-montserrat text-sm font-bold text-[#f8f8f8] transition-colors hover:bg-[#8a38f5]/90">
              Add Salary Module
              <Plus className="size-6" />
            </button>
          </div>
        }
      />

      {/* Realtor Commission Panel */}
      <CustomTable
        title="Realtor Commission Panel"
        headers={commissionHeaders}
        data={commissionData}
        headerKeyMap={commissionHeaderKeyMap}
        searchSlot={<SearchInput />}
        headerRight={<StatusFilter />}
      />

      {/* Client Invoice Tracker */}
      <CustomTable
        title="Client Invoice Tracker"
        headers={invoiceHeaders}
        data={invoiceData}
        headerKeyMap={invoiceHeaderKeyMap}
        searchSlot={<SearchInput />}
        headerRight={
          <div className="flex items-center gap-4">
            <StatusFilter />
            <button className="flex w-auto items-center justify-center gap-1 rounded-lg bg-[#8a38f5] px-3 py-1 font-montserrat text-sm font-bold text-[#f8f8f8] transition-colors hover:bg-[#8a38f5]/90">
              Create Invoice
              <Plus className="size-6" />
            </button>
          </div>
        }
      />

      {/* Alerts */}
      <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <p className="font-montserrat text-base font-bold text-[#6f6d6d]">
              Alerts
            </p>
            <div className="flex items-end gap-1 rounded-lg bg-[#f3f3f3] p-1">
              <span className="font-montserrat text-sm font-normal text-[#6f6d6d]">
                Week 02
              </span>
              <span className="font-montserrat text-sm font-bold text-[#6f6d6d]">
                Jan 8 – Jan 14
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-start gap-4">
            {alerts.map((alert) => (
              <div
                key={alert.label}
                className="flex items-end gap-1 rounded-lg bg-[#f6e9dd] p-2"
              >
                <span className="font-montserrat text-sm font-bold text-[#ff8d28]">
                  {alert.count}
                </span>
                <span className="font-montserrat text-sm font-normal text-[#ff8d28]">
                  {alert.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
