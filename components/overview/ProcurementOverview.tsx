"use client";

import {
  FileText,
  Ticket,
  CheckSquare,
  Search,
  ArrowRight,
} from "lucide-react";
import CustomTable from "@/components/shared/CustomTable";
import { type UserRole } from "@/util/status";
import type { OverviewData } from "@/services/overview";
import { OverviewHeader, StatusBadge } from "@/components/overview";
import { PersonCell } from "@/components/overview/PersonCell";

// ─── Types ──────────────────────────────────────────

type VerificationRow = Record<
  string,
  React.ReactNode | string | number | null | object
> & {
  id: string;
  reportId: string;
  client: string;
  property: string;
  reportDate: string;
  salesAgent: React.ReactNode;
  status: React.ReactNode;
};

type DocumentRow = Record<
  string,
  React.ReactNode | string | number | null | object
> & {
  id: string;
  client: string;
  requiredDocument: string;
  assignedSalesPerson: React.ReactNode;
  status: React.ReactNode;
};

type ProcurementRow = Record<
  string,
  React.ReactNode | string | number | null | object
> & {
  id: string;
  requestId: string;
  vendor: string;
  category: string;
  requestDate: string;
  amount: string;
  status: React.ReactNode;
};

// ─── Mock Data ──────────────────────────────────────

const verificationData: VerificationRow[] = [
  {
    id: "1",
    reportId: "12321",
    client: "Peter Abbey",
    property: "#123213",
    reportDate: "Jul 13, 2026",
    salesAgent: <PersonCell name="John Ibekwe" initials="JI" color="#8a38f5" />,
    status: <StatusBadge label="Verified" />,
  },
  {
    id: "2",
    reportId: "12321",
    client: "Peter Abbey",
    property: "#123213",
    reportDate: "Jul 13, 2026",
    salesAgent: <PersonCell name="John Ibekwe" initials="JI" color="#ff8d28" />,
    status: <StatusBadge label="Verified" />,
  },
  {
    id: "3",
    reportId: "12321",
    client: "Peter Abbey",
    property: "#123213",
    reportDate: "Jul 13, 2026",
    salesAgent: <PersonCell name="John Ibekwe" initials="JI" color="#34c759" />,
    status: <StatusBadge label="Pending" />,
  },
  {
    id: "4",
    reportId: "12321",
    client: "Peter Abbey",
    property: "#123213",
    reportDate: "Jul 13, 2026",
    salesAgent: <PersonCell name="John Ibekwe" initials="JI" color="#ff383c" />,
    status: <StatusBadge label="Verified" />,
  },
  {
    id: "5",
    reportId: "12321",
    client: "Peter Abbey",
    property: "#123213",
    reportDate: "Jul 13, 2026",
    salesAgent: <PersonCell name="John Ibekwe" initials="JI" color="#0088ff" />,
    status: <StatusBadge label="Pending" />,
  },
];

const verificationHeaders = [
  "Report ID",
  "Client",
  "Property",
  "Report Date",
  "Sales Agent",
  "Status",
];

const verificationHeaderKeyMap: Record<string, string> = {
  "Report ID": "reportId",
  Client: "client",
  Property: "property",
  "Report Date": "reportDate",
  "Sales Agent": "salesAgent",
  Status: "status",
};

const documentData: DocumentRow[] = [
  {
    id: "1",
    client: "Peter Abbey",
    requiredDocument: "Payment Receipt",
    assignedSalesPerson: (
      <PersonCell name="John Ibekwe" initials="JI" color="#8a38f5" />
    ),
    status: <StatusBadge label="Missing" />,
  },
  {
    id: "2",
    client: "Peter Abbey",
    requiredDocument: "NIN Slip",
    assignedSalesPerson: (
      <PersonCell name="John Ibekwe" initials="JI" color="#34c759" />
    ),
    status: <StatusBadge label="Missing" />,
  },
  {
    id: "3",
    client: "Peter Abbey",
    requiredDocument: "Payment Receipt",
    assignedSalesPerson: (
      <PersonCell name="John Ibekwe" initials="JI" color="#ff8d28" />
    ),
    status: <StatusBadge label="Pending" />,
  },
  {
    id: "4",
    client: "Peter Abbey",
    requiredDocument: "Payment Receipt",
    assignedSalesPerson: (
      <PersonCell name="John Ibekwe" initials="JI" color="#0088ff" />
    ),
    status: <StatusBadge label="Missing" />,
  },
  {
    id: "5",
    client: "Peter Abbey",
    requiredDocument: "Recent Utility Bill",
    assignedSalesPerson: (
      <PersonCell name="John Ibekwe" initials="JI" color="#ff383c" />
    ),
    status: <StatusBadge label="Pending" />,
  },
];

const documentHeaders = [
  "Client",
  "Required Document",
  "Assigned Sales Person",
  "Status",
];

const documentHeaderKeyMap: Record<string, string> = {
  Client: "client",
  "Required Document": "requiredDocument",
  "Assigned Sales Person": "assignedSalesPerson",
  Status: "status",
};

const procurementData: ProcurementRow[] = [
  {
    id: "1",
    requestId: "PR-101",
    vendor: "ABC Computers",
    category: "Equipment",
    requestDate: "Jul 13, 2026",
    amount: "₦450,000",
    status: <StatusBadge label="Paid" />,
  },
  {
    id: "2",
    requestId: "PR-101",
    vendor: "PH Media",
    category: "Marketing",
    requestDate: "Jul 13, 2026",
    amount: "₦450,000",
    status: <StatusBadge label="Approved" />,
  },
  {
    id: "3",
    requestId: "PR-101",
    vendor: "ABC Computers",
    category: "Electricity",
    requestDate: "Jul 13, 2026",
    amount: "₦450,000",
    status: <StatusBadge label="Pending" />,
  },
  {
    id: "4",
    requestId: "PR-101",
    vendor: "ABC Computers",
    category: "Stationery",
    requestDate: "Jul 13, 2026",
    amount: "₦450,000",
    status: <StatusBadge label="Approved" />,
  },
  {
    id: "5",
    requestId: "PR-101",
    vendor: "ABC Computers",
    category: "Refreshments",
    requestDate: "Jul 13, 2026",
    amount: "₦450,000",
    status: <StatusBadge label="Pending" />,
  },
];

const procurementHeaders = [
  "Request ID",
  "Vendor",
  "Category",
  "Request Date",
  "Amount",
  "Status",
];

const procurementHeaderKeyMap: Record<string, string> = {
  "Request ID": "requestId",
  Vendor: "vendor",
  Category: "category",
  "Request Date": "requestDate",
  Amount: "amount",
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

// ─── Component ──────────────────────────────────────

interface ProcurementOverviewProps {
  role: UserRole;
  overviewData: OverviewData | null;
  isLoading: boolean;
}

export default function ProcurementOverview({
  role,
}: ProcurementOverviewProps) {
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

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
        {/* Clients Awaiting Documentation */}
        <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4">
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

        {/* Pending Client Payments */}
        <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4">
          <div className="flex flex-col gap-1">
            <p className="font-montserrat text-base font-normal text-[#6f6d6d]">
              Pending Client Payments
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

        {/* Verified Payments */}
        <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4">
          <div className="flex flex-col gap-1">
            <p className="font-montserrat text-base font-normal text-[#6f6d6d]">
              Verified Payments
            </p>
            <p className="font-montserrat text-lg font-bold text-[#0f0f0f]">
              3,423
            </p>
          </div>
          <CheckSquare className="size-6 text-[#8a38f5]" />
        </div>
      </div>

      {/* Sales Verification Queue */}
      <CustomTable
        title="Sales Verification Queue"
        headers={verificationHeaders}
        data={verificationData}
        headerKeyMap={verificationHeaderKeyMap}
        searchSlot={<SearchInput />}
        headerRight={
          <span className="font-montserrat text-xs font-normal text-black">
            All
          </span>
        }
      />

      {/* Client Documentation Queue */}
      <CustomTable
        title="Client Documentation Queue"
        headers={documentHeaders}
        data={documentData}
        headerKeyMap={documentHeaderKeyMap}
        searchSlot={<SearchInput />}
        headerRight={
          <span className="font-montserrat text-xs font-normal text-black">
            All
          </span>
        }
      />

      {/* Vendor Procurement Requests */}
      <CustomTable
        title="Vendor Procurement Requests"
        headers={procurementHeaders}
        data={procurementData}
        headerKeyMap={procurementHeaderKeyMap}
        searchSlot={<SearchInput />}
        headerRight={
          <div className="flex items-center gap-4">
            <span className="font-montserrat text-xs font-normal text-black">
              All
            </span>
            <button className="flex w-auto items-center justify-center gap-1 rounded-lg bg-[#8a38f5] px-3 py-1 font-montserrat text-base font-bold text-[#f8f8f8] transition-colors hover:bg-[#8a38f5]/90">
              Submit Procurement Request
              <ArrowRight className="size-6" />
            </button>
          </div>
        }
      />
    </div>
  );
}
