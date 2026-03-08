"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Tag,
  TicketCheck,
  FileText,
  Search,
  UserPlus,
  Users,
  HandCoins,
} from "lucide-react";
import CustomTable from "@/components/shared/CustomTable";
import { type UserRole } from "@/util/status";
import type { OverviewData } from "@/services/overview";
import { OverviewHeader } from "@/components/overview";

// ─── Types ──────────────────────────────────────────

type SubmissionRow = Record<
  string,
  React.ReactNode | string | number | null | object
> & {
  id: string;
  clientName: string;
  clientCode: string;
  property: string;
  currentSalesStage: string;
  dateSubmitted: string;
};

// ─── Mock Data ──────────────────────────────────────

const submissionsData: SubmissionRow[] = [
  {
    id: "1",
    clientName: "Peter Abbey",
    clientCode: "01014",
    property: "Land",
    currentSalesStage: "Closed",
    dateSubmitted: "Just Now",
  },
  {
    id: "2",
    clientName: "Peter Abbey",
    clientCode: "01014",
    property: "Residential Building",
    currentSalesStage: "Closed",
    dateSubmitted: "Just Now",
  },
  {
    id: "3",
    clientName: "Peter Abbey",
    clientCode: "01014",
    property: "Land",
    currentSalesStage: "Closed",
    dateSubmitted: "Just Now",
  },
  {
    id: "4",
    clientName: "Peter Abbey",
    clientCode: "01014",
    property: "Commercial Building",
    currentSalesStage: "Closed",
    dateSubmitted: "Just Now",
  },
  {
    id: "5",
    clientName: "Peter Abbey",
    clientCode: "01014",
    property: "Land",
    currentSalesStage: "Closed",
    dateSubmitted: "Just Now",
  },
];

const submissionHeaders = [
  "Client Name",
  "Client Code",
  "Property",
  "Current Sales Stage",
  "Date Submitted",
];

const submissionHeaderKeyMap: Record<string, string> = {
  "Client Name": "clientName",
  "Client Code": "clientCode",
  Property: "property",
  "Current Sales Stage": "currentSalesStage",
  "Date Submitted": "dateSubmitted",
};

const dealStatusData = [
  { name: "Closed", value: 45 },
  { name: "Payment", value: 35 },
  { name: "Negotiation", value: 15 },
  { name: "Inspection", value: 15 },
  { name: "Interested", value: 15 },
];
const DEAL_COLORS = ["#0088ff", "#8a38f5", "#e0c8f0", "#ff38e0", "#38c8f5"];

// ─── Component ──────────────────────────────────────

interface RealtorOverviewProps {
  role: UserRole;
  overviewData: OverviewData | null;
  isLoading: boolean;
}

export default function RealtorOverview({
  role,
  overviewData,
  isLoading,
}: RealtorOverviewProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <OverviewHeader role={role} />

      {/* Status row */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <p className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Status: Active
            </p>
            <span className="size-2 rounded-full bg-[#34c759]" />
          </div>
          <p className="font-montserrat text-xs font-normal text-[#6f6d6d]">
            You are active. Keep submitting deals!
          </p>
        </div>
        <p className="font-montserrat text-xs font-normal text-[#6f6d6d]">
          Last Activity: 19 Hours Ago
        </p>
      </div>

      {/* Metric cards row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
        {/* Deals Submitted */}
        <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4">
          <div className="flex flex-col gap-1">
            <p className="font-montserrat text-base font-normal text-[#6f6d6d]">
              Deals Submitted
            </p>
            <p className="font-montserrat text-lg font-bold text-[#0f0f0f]">
              120
            </p>
            <p className="font-montserrat text-xs font-normal text-[#6f6d6d]">
              This month
            </p>
          </div>
          <Tag className="size-6 text-[#8a38f5]" />
        </div>

        {/* Total Sales */}
        <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4">
          <div className="flex flex-col gap-1">
            <p className="font-montserrat text-base font-normal text-[#6f6d6d]">
              Total Sales
            </p>
            <p className="font-montserrat text-lg font-bold text-[#0f0f0f]">
              ₦80,325,000
            </p>
            <p className="font-montserrat text-xs font-normal text-[#6f6d6d]">
              This month
            </p>
          </div>
          <TicketCheck className="size-6 text-[#8a38f5]" />
        </div>

        {/* Last Submission */}
        <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4">
          <div className="flex flex-col gap-1">
            <p className="font-montserrat text-base font-normal text-[#6f6d6d]">
              Last Submission
            </p>
            <p className="font-montserrat text-lg font-bold text-[#0f0f0f]">
              Jul 12, 2026
            </p>
            <p className="font-montserrat text-xs font-normal text-[#6f6d6d]">
              19 Hours Ago
            </p>
          </div>
          <FileText className="size-6 text-[#8a38f5]" />
        </div>
      </div>

      {/* Second row of metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
        {/* My Clients */}
        <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4">
          <div className="flex flex-col gap-2">
            <p className="font-montserrat text-base font-normal text-[#6f6d6d]">
              My Clients
            </p>
            <p className="font-montserrat text-lg font-bold text-[#0f0f0f]">
              14
            </p>
          </div>
          <Users className="size-6 text-[#8a38f5]" />
        </div>

        {/* Pending Commissions */}
        <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4">
          <div className="flex flex-col gap-1">
            <p className="font-montserrat text-base font-normal text-[#6f6d6d]">
              Pending Commissions
            </p>
            <p className="font-montserrat text-lg font-bold text-[#0f0f0f]">
              ₦10,325,000
            </p>
          </div>
          <HandCoins className="size-6 text-[#8a38f5]" />
        </div>

        {/* My Commissions Earned */}
        <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4">
          <div className="flex flex-col gap-1">
            <p className="font-montserrat text-base font-normal text-[#6f6d6d]">
              My Commissions Earned
            </p>
            <p className="font-montserrat text-lg font-bold text-[#0f0f0f]">
              ₦10,325,000
            </p>
          </div>
          <HandCoins className="size-6 text-[#8a38f5]" />
        </div>
      </div>

      {/* Recent Submissions table */}
      <CustomTable
        title="Recent Submissions"
        headers={submissionHeaders}
        data={submissionsData}
        headerKeyMap={submissionHeaderKeyMap}
        searchSlot={
          <div className="flex items-center gap-2 rounded-lg bg-[#f3f3f3] p-1">
            <Search className="size-4 text-[#6f6d6d]" />
            <input
              type="text"
              placeholder="Search"
              className="w-full max-w-90.5 bg-transparent font-montserrat text-sm font-normal text-[#0f0f0f] placeholder-[#6f6d6d] outline-none"
            />
          </div>
        }
        headerRight={
          <div className="flex items-center gap-4">
            <span className="font-montserrat text-xs font-normal text-black">
              All
            </span>
            <button className="flex w-auto items-center justify-center gap-1 rounded-lg bg-[#8a38f5] px-3 py-1 font-montserrat text-base font-bold text-[#f8f8f8] transition-colors hover:bg-[#8a38f5]/90">
              Submit Client
              <UserPlus className="size-6" />
            </button>
          </div>
        }
      />

      {/* Deal Status donut (left-aligned, standalone) */}
      <div className="flex w-full max-w-105.25 flex-col gap-4 rounded-lg bg-[#f8f8f8] p-2 md:gap-12">
        <div className="flex items-center justify-between">
          <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
            Deal Status
          </p>
          <span className="rounded-lg bg-[#e0e0e0] px-1 py-0.5 font-montserrat text-xs font-normal text-[#0f0f0f]">
            Jan
          </span>
        </div>
        <div className="flex items-center justify-center gap-4 md:gap-16">
          <div className="relative size-39">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dealStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {dealStatusData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={DEAL_COLORS[index % DEAL_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-montserrat text-xs font-normal text-[#0f0f0f]">
                Total Deals
              </span>
              <span className="font-montserrat text-xs font-bold text-[#0f0f0f]">
                100
              </span>
            </div>
          </div>
          {/* Legend */}
          <div className="flex flex-col gap-2.5">
            {dealStatusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div
                  className="size-4 rounded-full"
                  style={{
                    backgroundColor: DEAL_COLORS[index % DEAL_COLORS.length],
                  }}
                />
                <span className="font-montserrat text-xs font-normal text-[#0f0f0f]">
                  {entry.name}
                </span>
                <span className="font-montserrat text-xs font-bold text-[#0f0f0f]">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
