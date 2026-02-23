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
import { Ticket, UserCheck, Heart, Building2, Search } from "lucide-react";
import CustomTable from "@/components/shared/CustomTable";
import { type UserRole } from "@/util/status";
import type { OverviewData } from "@/services/overview";
import {
  OverviewHeader,
  MetricCards,
  TogglePill,
  PersonCell,
  StatusBadge,
  PriorityBadge,
  ActionMenu,
  formatYAxisTick,
  type MetricCardData,
} from "@/components/overview";

// ─── Types ──────────────────────────────────────────

type ReportRow = Record<
  string,
  React.ReactNode | string | number | null | object
> & {
  id: string;
  title: React.ReactNode;
  from: React.ReactNode;
  age: string;
  status: React.ReactNode;
  priority: React.ReactNode;
  action: React.ReactNode;
};

// ─── Mock Data ──────────────────────────────────────

const inventoryData = [
  { name: "Sold", value: 65 },
  { name: "Available", value: 35 },
];
const INVENTORY_COLORS = ["#3b82f6", "#e0e0e0"];

const reportPeople = [
  { name: "John Ibekwe", initials: "JI", color: "#f59e0b" },
  { name: "James Agahowa", initials: "JA", color: "#10b981" },
  { name: "Lilian Tamuno", initials: "LT", color: "#8b5cf6" },
  { name: "Ebiere William", initials: "EW", color: "#ec4899" },
  { name: "Samson Tosin", initials: "ST", color: "#06b6d4" },
];

const reportTitles = [
  "Business Performance Report",
  "Sales Performance Report",
  "Staff Accountability Report",
  "Realtor Activity Report",
  "Financial Summary Report",
];

// ─── Main Component ─────────────────────────────────

interface ChairmanOverviewProps {
  role: UserRole;
  overviewData: OverviewData | null;
  isLoading: boolean;
}

export default function ChairmanOverview({
  role,
  overviewData,
  isLoading,
}: ChairmanOverviewProps) {
  const [salesToggle, setSalesToggle] = useState(0);
  const [inventoryToggle, setInventoryToggle] = useState(0);

  const metricCards: MetricCardData[] = [
    {
      label: "Total Sales",
      value: isLoading
        ? "Loading..."
        : `₦${overviewData?.today_sales?.toLocaleString() || "0"}`,
      icon: Ticket,
    },
    {
      label: "Active Staff",
      value: isLoading
        ? "Loading..."
        : String(overviewData?.active_staff_count || "0"),
      icon: UserCheck,
    },
    {
      label: "Active Realtors",
      value: isLoading
        ? "Loading..."
        : String(overviewData?.active_realtors_count || "0"),
      icon: Heart,
    },
    {
      label: "Available Properties",
      value: isLoading
        ? "Loading..."
        : String(overviewData?.available_properties || "0"),
      icon: Building2,
    },
  ];

  // Transform sales_trend from API into chart format
  const salesTrendData = overviewData?.sales_trend
    ? overviewData.sales_trend.map((value, index) => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        return { month: days[index] || `Day ${index + 1}`, revenue: value };
      })
    : [
        { month: "Mon", revenue: 0 },
        { month: "Tue", revenue: 0 },
        { month: "Wed", revenue: 0 },
        { month: "Thu", revenue: 0 },
        { month: "Fri", revenue: 0 },
        { month: "Sat", revenue: 0 },
        { month: "Sun", revenue: 0 },
      ];

  // Build report table data
  const reportsData: ReportRow[] = reportTitles.map((title, i) => {
    const person = reportPeople[i];
    return {
      id: String(i + 1),
      title: <span className="font-bold text-[#0f0f0f]">{title}</span>,
      from: (
        <PersonCell
          name={person.name}
          initials={person.initials}
          color={person.color}
        />
      ),
      age: "25 Mins ago",
      status: <StatusBadge label="Pending Review" />,
      priority: <PriorityBadge label="High" />,
      action: <ActionMenu />,
    };
  });

  const tableHeaders = ["Title", "From", "Age", "Status", "Priority", "Action"];
  const tableHeaderKeyMap: Record<string, string> = {
    Title: "title",
    From: "from",
    Age: "age",
    Status: "status",
    Priority: "priority",
    Action: "action",
  };

  return (
    <div className="flex flex-col gap-8">
      <OverviewHeader role={role} />

      <MetricCards cards={metricCards} />

      {/* ─── Charts Row ──────────────────────── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.5fr_1fr]">
        {/* Sales Trend */}
        <div className="flex flex-col gap-2 rounded-lg bg-[#f8f8f8] p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[#0f0f0f]">
              <span className="font-montserrat font-bold">Sales Trend</span>
              <span className="font-montserrat">
                <span className="text-[#c8c8c8]">Daily/</span>
                <span>Monthly</span>
              </span>
            </div>
            <TogglePill
              options={["Revenue", "Properties"]}
              activeIndex={salesToggle}
              onToggle={setSalesToggle}
            />
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesTrendData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8a38f5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8a38f5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e0e0e0"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 9, fill: "#6f6d6d" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatYAxisTick}
                tick={{ fontSize: 9, fill: "#6f6d6d" }}
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
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Overview */}
        <div className="flex flex-col gap-2 rounded-lg bg-[#f8f8f8] p-2">
          <div className="flex items-center justify-between">
            <span className="font-montserrat text-sm font-bold text-[#0f0f0f]">
              Inventory Overview
            </span>
            <TogglePill
              options={["Land", "Buildings"]}
              activeIndex={inventoryToggle}
              onToggle={setInventoryToggle}
            />
          </div>

          <div className="flex items-center justify-center gap-4 md:gap-16">
            <ResponsiveContainer width={156} height={156}>
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {inventoryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={INVENTORY_COLORS[index]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5">
                <div className="size-4 rounded-full bg-[#3b82f6]" />
                <span className="font-montserrat text-xs font-normal text-[#0f0f0f]">
                  Sold
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-4 rounded-full bg-[#e0e0e0]" />
                <span className="font-montserrat text-xs font-normal text-[#0f0f0f]">
                  Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Reports Table ───────────────────── */}
      <CustomTable
        title="Reports"
        searchSlot={
          <div className="flex items-center gap-2 rounded-lg bg-[#f3f3f3] p-1">
            <Search className="size-4 text-[#6f6d6d]" />
            <input
              type="text"
              placeholder="Find Report"
              className="w-full max-w-90.5 bg-transparent font-montserrat text-sm font-normal text-[#0f0f0f] placeholder-[#6f6d6d] outline-none"
            />
          </div>
        }
        headerRight={
          <span className="font-montserrat text-xs font-normal text-black">
            All
          </span>
        }
        headers={tableHeaders}
        data={reportsData}
        headerKeyMap={tableHeaderKeyMap}
      />
    </div>
  );
}
