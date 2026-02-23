"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Target,
  TicketCheck,
  Medal,
  Search,
  ArrowRight,
  FileText,
  ShieldAlert,
  UserPlus,
} from "lucide-react";
import CustomTable from "@/components/shared/CustomTable";
import { type UserRole } from "@/util/status";
import type { OverviewData } from "@/services/overview";
import {
  OverviewHeader,
  TogglePill,
  formatYAxisTick,
} from "@/components/overview";

// ─── Types ──────────────────────────────────────────

type ClientRow = Record<
  string,
  React.ReactNode | string | number | null | object
> & {
  id: string;
  clientName: string;
  clientCode: string;
  currentSalesStage: React.ReactNode;
  lastActivityDate: string;
};

// ─── Mock Data ──────────────────────────────────────

const salesPerformanceData = [
  { month: "JAN", revenue: 2000000 },
  { month: "FEB", revenue: 3500000 },
  { month: "MAR", revenue: 5000000 },
  { month: "APR", revenue: 4500000 },
  { month: "MAY", revenue: 6000000 },
  { month: "JUN", revenue: 7500000 },
  { month: "JUL", revenue: 10000000 },
  { month: "AUG", revenue: 9000000 },
  { month: "SEP", revenue: 8000000 },
  { month: "OCT", revenue: 7500000 },
  { month: "NOV", revenue: 10000000 },
  { month: "DEC", revenue: 12000000 },
];

const dealCountData = [
  { name: "Active Deals", value: 45 },
  { name: "Closed", value: 35 },
  { name: "Lost", value: 15 },
];
const DEAL_COLORS = ["#0088ff", "#8a38f5", "#c8c8c8"];

const clientsData: ClientRow[] = [
  {
    id: "1",
    clientName: "Peter Abbey",
    clientCode: "01014",
    currentSalesStage: "Closed",
    lastActivityDate: "Just Now",
  },
  {
    id: "2",
    clientName: "Peter Abbey",
    clientCode: "01014",
    currentSalesStage: "Interested",
    lastActivityDate: "25 Mins ago",
  },
  {
    id: "3",
    clientName: "Peter Abbey",
    clientCode: "01014",
    currentSalesStage: "Offer Accepted",
    lastActivityDate: "5 Days Ago",
  },
  {
    id: "4",
    clientName: "Peter Abbey",
    clientCode: "01014",
    currentSalesStage: "Payment in Progress",
    lastActivityDate: "Jan 1, 2026",
  },
  {
    id: "5",
    clientName: "Peter Abbey",
    clientCode: "01014",
    currentSalesStage: "Contacted",
    lastActivityDate: "Jan 13, 2026",
  },
];

const clientHeaders = [
  "Client Name",
  "Client Code",
  "Current Sales Stage",
  "Last Activity Date",
];

const clientHeaderKeyMap: Record<string, string> = {
  "Client Name": "clientName",
  "Client Code": "clientCode",
  "Current Sales Stage": "currentSalesStage",
  "Last Activity Date": "lastActivityDate",
};

// ─── Component ──────────────────────────────────────

interface StaffOverviewProps {
  role: UserRole;
  overviewData: OverviewData | null;
  isLoading: boolean;
}

export default function StaffOverview({
  role,
  overviewData,
  isLoading,
}: StaffOverviewProps) {
  const [chartToggle, setChartToggle] = useState(0);

  /* ── Metric cards (3 cards) ── */
  const targetProgress = 51.2; // percentage

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <OverviewHeader role={role} />

      {/* Metric cards row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
        {/* Monthly Sales Target */}
        <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4">
          <div className="flex flex-col gap-1">
            <p className="font-montserrat text-base font-normal text-[#6f6d6d]">
              Monthly Sales Target
            </p>
            <p className="font-montserrat text-lg font-bold text-[#0f0f0f]">
              ₦150,000,000
            </p>
            <p className="font-montserrat text-xs font-normal text-[#ff8d28]">
              12 days left
            </p>
          </div>
          <Target className="size-6 text-[#8a38f5]" />
        </div>

        {/* Sales Achieved */}
        <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4">
          <div className="flex flex-col gap-1">
            <p className="font-montserrat text-base font-normal text-[#6f6d6d]">
              Sales Achieved
            </p>
            <p className="font-montserrat text-lg font-bold text-[#0f0f0f]">
              ₦75,325,000
            </p>
            <p className="font-montserrat text-xs font-normal text-[#ff8d28]">
              51.2% Achieved
            </p>
          </div>
          <TicketCheck className="size-6 text-[#8a38f5]" />
        </div>

        {/* Target Progress */}
        <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4">
          <div className="flex flex-col gap-1">
            <p className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Target Progress
            </p>
            {/* Progress bar */}
            <div className="h-2.5 w-full overflow-hidden rounded bg-[#f6e9dd]">
              <div
                className="h-full rounded bg-[#ff8d28]"
                style={{ width: `${targetProgress}%` }}
              />
            </div>
            <p className="font-montserrat text-xs font-normal text-[#6f6d6d]">
              Satisfactory Performance
            </p>
          </div>
          <Medal className="size-6 text-[#8a38f5]" />
        </div>
      </div>

      {/* View Missed Reports */}
      <div className="flex items-center justify-end">
        <button className="flex items-center gap-2 rounded border border-[#c8c8c8] bg-[#f8f8f8] px-2 py-2 font-montserrat text-sm font-normal text-[#6f6d6d] transition-colors hover:bg-[#f3f3f3]">
          View Missed Reports
          <ArrowRight className="size-4" />
        </button>
      </div>

      {/* Weekly Report */}
      <div className="flex flex-col gap-4 rounded bg-[#f8f8f8] p-4 md:flex-row md:items-center md:justify-between md:gap-0">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            <div className="flex items-end gap-4">
              <p className="font-montserrat text-base font-bold text-[#6f6d6d]">
                Weekly Report
              </p>
              <span className="rounded-lg bg-[#f6e9dd] px-1 py-0.5 font-montserrat text-[9px] font-semibold text-[#ff8d28]">
                Pending
              </span>
            </div>
            <div className="flex items-end gap-1 font-montserrat text-sm text-[#6f6d6d]">
              <span className="font-normal">Week 02</span>
              <span className="font-bold">Jan 8 – Jan 14</span>
            </div>
          </div>
          <div className="flex items-end gap-2 rounded-lg bg-[#f3f3f3] p-2 font-montserrat text-sm text-[#6f6d6d]">
            <span className="font-normal">Time Remaining</span>
            <span className="font-bold">3 days 22h 32m</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button className="flex items-center gap-2 rounded-lg bg-[#8a38f5] px-1 py-1 font-montserrat text-sm font-bold text-[#f8f8f8] transition-colors hover:bg-[#8a38f5]/90">
            Submit Report
            <FileText className="size-6" />
          </button>
          <div className="flex items-center gap-1">
            <ShieldAlert className="size-4 text-[#ff383c]" />
            <p className="font-montserrat text-xs font-normal text-[#ff383c]">
              Deadline in less than 1 week
            </p>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* My Sales Performance */}
        <div className="flex w-full flex-col gap-2 rounded-lg bg-[#f8f8f8] p-2 md:flex-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-montserrat text-sm text-[#0f0f0f]">
              <span className="font-bold">My Sales Performance</span>
              <span>
                <span className="text-[#c8c8c8]">Daily/</span>
                <span className="font-normal">Monthly</span>
              </span>
            </div>
            <TogglePill
              options={["Revenue", "Properties"]}
              activeIndex={chartToggle}
              onToggle={setChartToggle}
            />
          </div>
          <div className="h-52.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesPerformanceData}>
                <defs>
                  <linearGradient
                    id="staffSalesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#8a38f5" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8a38f5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e0e0e0"
                />
                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 9,
                    fill: "#6f6d6d",
                    fontFamily: "Montserrat",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => formatYAxisTick(v as number)}
                  tick={{
                    fontSize: 9,
                    fill: "#6f6d6d",
                    fontFamily: "Montserrat",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [
                    `₦${Number(value).toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8a38f5"
                  strokeWidth={2}
                  fill="url(#staffSalesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deal Count donut */}
        <div className="flex flex-1 flex-col gap-4 rounded-lg bg-[#f8f8f8] p-2 md:gap-12">
          <div className="flex items-center justify-between">
            <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
              Deal Count
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
                    data={dealCountData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    {dealCountData.map((entry, index) => (
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
              {dealCountData.map((entry, index) => (
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

      {/* My Clients table */}
      <CustomTable
        title="My Clients"
        headers={clientHeaders}
        data={clientsData}
        headerKeyMap={clientHeaderKeyMap}
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
            <button className="flex items-center gap-1 rounded-lg bg-[#8a38f5] px-1 py-1 font-montserrat text-sm font-bold text-[#f8f8f8] transition-colors hover:bg-[#8a38f5]/90">
              Add Client
              <UserPlus className="size-6" />
            </button>
          </div>
        }
      />
    </div>
  );
}
