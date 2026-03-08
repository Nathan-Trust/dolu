"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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
  Ticket,
  FileText,
  Heart,
  Calculator,
  UserCheck,
  ShoppingCart,
  Coins,
  ClipboardCheck,
  Search,
  ArrowRight,
} from "lucide-react";
import CustomTable from "@/components/shared/CustomTable";
import { type UserRole } from "@/util/status";
import type { OverviewData } from "@/services/overview";
import {
  OverviewHeader,
  MetricCards,
  TogglePill,
  PositionBadge,
  formatYAxisTick,
  type MetricCardData,
} from "@/components/overview";

// ─── Types ──────────────────────────────────────────

interface AlertItem {
  id: number;
  message: string;
  time: string;
  dotColor: string;
}

interface QuickAction {
  label: string;
  href: string;
}

interface SalesContributionRow {
  position: number;
  name: string;
  initials: string;
  sales: number;
  amount: string;
  latestSale: string;
}

type PriorityRow = Record<
  string,
  React.ReactNode | string | number | null | object
> & {
  id: string;
  name: React.ReactNode;
  type: string;
  issue: string;
  duration: string;
};

// ─── Mock Data ──────────────────────────────────────

const getMetricCards = (
  overviewData: OverviewData | null,
  isLoading: boolean,
): MetricCardData[] => [
  {
    label: "Today's Sales",
    value: isLoading
      ? "Loading..."
      : `₦${overviewData?.today_sales?.toLocaleString() || "0"}`,
    icon: Ticket,
  },
  { label: "Missed Reports", value: "520", icon: FileText },
  { label: "Pending Invoices", value: "14", icon: Calculator },
  {
    label: "Total Sales this Month",
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
    label: "Total Expenses",
    value: isLoading
      ? "Loading..."
      : `₦${overviewData?.total_expenses?.toLocaleString() || "0"}`,
    icon: ShoppingCart,
  },
  {
    label: "Pending Commissions",
    value: isLoading
      ? "Loading..."
      : `₦${overviewData?.pending_commissions?.toLocaleString() || "0"}`,
    icon: Coins,
  },
  {
    label: "Pending Expense Approvals",
    value: isLoading
      ? "Loading..."
      : String(overviewData?.pending_expense_approvals || "0"),
    icon: ClipboardCheck,
  },
];

const quickActions: QuickAction[] = [
  { label: "Review Missed Reports", href: "#" },
  { label: "Create Client", href: "#" },
  { label: "Assign Plot", href: "#" },
  { label: "Create Commission", href: "#" },
  { label: "Approve Requests", href: "#" },
];

const salesContributionChartData = [
  { month: "JAN", staff: 500000000, realtors: 400000000 },
  { month: "FEB", staff: 200000000, realtors: 300000000 },
  { month: "MAR", staff: 350000000, realtors: 470000000 },
  { month: "APR", staff: 1020000000, realtors: 950000000 },
  { month: "MAY", staff: 730000000, realtors: 1020000000 },
  { month: "JUN", staff: 620000000, realtors: 1195000000 },
  { month: "JUL", staff: 620000000, realtors: 760000000 },
  { month: "AUG", staff: 450000000, realtors: 1380000000 },
  { month: "SEP", staff: 390000000, realtors: 1080000000 },
  { month: "OCT", staff: 880000000, realtors: 730000000 },
  { month: "NOV", staff: 250000000, realtors: 630000000 },
  { month: "DEC", staff: 1070000000, realtors: 1140000000 },
];

const alertsData: AlertItem[] = [
  {
    id: 1,
    message: "Invoice #1132 overdue",
    time: "JUST NOW",
    dotColor: "#ff383c",
  },
  {
    id: 2,
    message: "Realtor James marked dormant",
    time: "2 HOURS AGO",
    dotColor: "#ff8d28",
  },
  {
    id: 3,
    message: "Sales target at risk",
    time: "5 HOURS AGO",
    dotColor: "#ff383c",
  },
  {
    id: 4,
    message: "Missed report from  Staff Jessica",
    time: "17 HOURS AGO",
    dotColor: "#f5c518",
  },
  {
    id: 5,
    message: "Invoice #1132 overdue",
    time: "3 DAYS AGO",
    dotColor: "#34c759",
  },
  {
    id: 6,
    message: "Invoice #1132 overdue",
    time: "12 DAYS AGO",
    dotColor: "#34c759",
  },
];

const salesTrendData = [
  { month: "JAN", revenue: 2000000 },
  { month: "FEB", revenue: 3500000 },
  { month: "MAR", revenue: 5000000 },
  { month: "APR", revenue: 8000000 },
  { month: "MAY", revenue: 10000000 },
  { month: "JUN", revenue: 12000000 },
  { month: "JUL", revenue: 11000000 },
  { month: "AUG", revenue: 9000000 },
  { month: "SEP", revenue: 7000000 },
  { month: "OCT", revenue: 6000000 },
  { month: "NOV", revenue: 5500000 },
  { month: "DEC", revenue: 4000000 },
];

const reportsComplianceData = [
  { name: "Submitted", value: 50 },
  { name: "Pending", value: 25 },
  { name: "Missed", value: 25 },
];
const COMPLIANCE_COLORS = ["#0088ff", "#8a38f5", "#d9edff"];

const salesLeaderboard: SalesContributionRow[] = [
  {
    position: 1,
    name: "John Ibekwe",
    initials: "JI",
    sales: 35,
    amount: "₦525,000,000",
    latestSale: "Jul 12, 2026",
  },
  {
    position: 2,
    name: "John Ibekwe",
    initials: "JI",
    sales: 35,
    amount: "₦525,000,000",
    latestSale: "Jul 12, 2026",
  },
  {
    position: 3,
    name: "John Ibekwe",
    initials: "JI",
    sales: 35,
    amount: "₦525,000,000",
    latestSale: "Jul 12, 2026",
  },
  {
    position: 4,
    name: "John Ibekwe",
    initials: "JI",
    sales: 35,
    amount: "₦525,000,000",
    latestSale: "Jul 12, 2026",
  },
  {
    position: 5,
    name: "John Ibekwe",
    initials: "JI",
    sales: 35,
    amount: "₦525,000,000",
    latestSale: "Jul 12, 2026",
  },
];

function PersonCellInline({
  name,
  initials,
}: {
  name: string;
  initials: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex size-4 items-center justify-center rounded-full bg-gray-300">
        <span className="text-[8px] font-bold text-white">{initials}</span>
      </div>
      <span className="font-montserrat text-sm text-[#0f0f0f]">{name}</span>
    </div>
  );
}

const priorityListData: PriorityRow[] = [
  {
    id: "1",
    name: <PersonCellInline name="John Ibekwe" initials="JI" />,
    type: "Staff",
    issue: "Missed Report",
    duration: "25 Mins ago",
  },
  {
    id: "2",
    name: <PersonCellInline name="John Ibekwe" initials="JI" />,
    type: "Realtor",
    issue: "Dormant",
    duration: "19 Hours Ago",
  },
  {
    id: "3",
    name: (
      <span className="font-montserrat text-sm text-[#0f0f0f]">
        Invoice #21021
      </span>
    ),
    type: "Invoice",
    issue: "Overdue",
    duration: "10 Days",
  },
  {
    id: "4",
    name: <PersonCellInline name="John Ibekwe" initials="JI" />,
    type: "Realtor",
    issue: "Dormant",
    duration: "20 Days",
  },
  {
    id: "5",
    name: <PersonCellInline name="John Ibekwe" initials="JI" />,
    type: "Staff",
    issue: "Missed Report",
    duration: "22 Days",
  },
];

// ─── Main Component ─────────────────────────────────

interface ManagerOverviewProps {
  role: UserRole;
  overviewData: OverviewData | null;
  isLoading: boolean;
}

export default function ManagerOverview({
  role,
  overviewData,
  isLoading,
}: ManagerOverviewProps) {
  const [salesContribToggle, setSalesContribToggle] = useState(0);
  const [salesTrendToggle, setSalesTrendToggle] = useState(0);
  const [complianceToggle, setComplianceToggle] = useState(0);
  const [leaderboardToggle, setLeaderboardToggle] = useState(0);

  const priorityHeaders = ["Name", "Type", "Issue", "Duration"];
  const priorityHeaderKeyMap: Record<string, string> = {
    Name: "name",
    Type: "type",
    Issue: "issue",
    Duration: "duration",
  };

  return (
    <div className="flex flex-col gap-8">
      <OverviewHeader role={role} />

      <MetricCards
        cards={getMetricCards(overviewData, isLoading)}
        columns={3}
      />

      {/* ─── Quick Actions ───────────────────── */}
      <div className="flex flex-wrap gap-2 md:gap-8">
        {quickActions.map((action) => (
          <button
            key={action.label}
            className="flex items-center gap-2 rounded border border-[#c8c8c8] bg-[#f8f8f8] p-2"
          >
            <span className="font-montserrat text-sm font-normal text-[#6f6d6d]">
              {action.label}
            </span>
            <ArrowRight className="size-4 text-[#6f6d6d]" />
          </button>
        ))}
      </div>

      {/* ─── Sales Contribution Chart + Alerts ─ */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        {/* Sales Contribution Bar Chart */}
        <div className="flex w-full flex-col gap-2 rounded-lg bg-[#f8f8f8] p-2 md:flex-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[#0f0f0f]">
              <span className="font-montserrat font-bold">
                Sales Contribution
              </span>
              <span className="font-montserrat">
                <span className="text-[#c8c8c8]">Daily/</span>
                <span>Monthly</span>
              </span>
            </div>
            <TogglePill
              options={["Revenue", "Properties"]}
              activeIndex={salesContribToggle}
              onToggle={setSalesContribToggle}
            />
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={salesContributionChartData}
              barGap={0}
              barCategoryGap="30%"
            >
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
                domain={[0, 1500000000]}
                ticks={[0, 500000000, 1000000000, 1500000000]}
              />
              <Tooltip
                formatter={(value) => [`₦${Number(value).toLocaleString()}`]}
              />
              <Bar
                dataKey="staff"
                fill="#0088ff"
                name="Staff"
                radius={[4, 4, 0, 0]}
                barSize={10}
              />
              <Bar
                dataKey="realtors"
                fill="#d9edff"
                name="Realtors"
                radius={[4, 4, 0, 0]}
                barSize={10}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <div className="size-4 rounded-full bg-[#0088ff]" />
              <span className="font-montserrat text-xs text-[#0f0f0f]">
                Staff
              </span>
              <span className="font-montserrat text-xs font-bold text-[#0f0f0f]">
                ₦750M Monthly
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-4 rounded-full bg-[#d9edff]" />
              <span className="font-montserrat text-xs text-[#0f0f0f]">
                Realtors
              </span>
              <span className="font-montserrat text-xs font-bold text-[#0f0f0f]">
                ₦900M Monthly
              </span>
            </div>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="flex flex-1 flex-col gap-2 rounded-lg bg-[#f8f8f8] p-4">
          <div className="flex items-center justify-between">
            <p className="font-montserrat text-base font-bold text-[#0f0f0f]">
              Alerts
            </p>
            <p className="font-montserrat text-sm font-normal text-[#6f6d6d]">
              See all
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {alertsData.map((alert, idx) => (
              <div
                key={alert.id}
                className={`flex items-end justify-between rounded px-1 py-2 ${
                  idx % 2 !== 0 ? "bg-[#f3f3f3]" : ""
                }`}
              >
                <div className="flex flex-1 items-center gap-1">
                  <div
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: alert.dotColor }}
                  />
                  <p className="font-montserrat text-sm font-normal text-[#6f6d6d]">
                    {alert.message}
                  </p>
                </div>
                <p className="shrink-0 font-montserrat text-[9px] font-normal uppercase text-[#6f6d6d]">
                  {alert.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Sales Trend + Reports Compliance ── */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {/* Sales Trend */}
        <div className="flex h-70 w-full flex-col gap-2 rounded-lg bg-[#f8f8f8] p-2 md:flex-2">
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
              activeIndex={salesTrendToggle}
              onToggle={setSalesTrendToggle}
            />
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesTrendData}>
              <defs>
                <linearGradient
                  id="colorManagerRevenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
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
                domain={[0, 15000000]}
                ticks={[0, 5000000, 10000000, 15000000]}
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
                fill="url(#colorManagerRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Reports Compliance */}
        <div className="flex h-70 flex-1 flex-col items-center gap-4 rounded-lg bg-[#f8f8f8] p-2 md:gap-12">
          <div className="flex w-full items-center justify-between">
            <span className="font-montserrat text-sm font-bold text-[#0f0f0f]">
              Reports Compliance
            </span>
            <TogglePill
              options={["Staff", "Others"]}
              activeIndex={complianceToggle}
              onToggle={setComplianceToggle}
            />
          </div>

          <div className="flex items-center gap-4 md:gap-16">
            <ResponsiveContainer width={156} height={156}>
              <PieChart>
                <Pie
                  data={reportsComplianceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {reportsComplianceData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COMPLIANCE_COLORS[index]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5">
                <div className="size-4 rounded-full bg-[#0088ff]" />
                <span className="font-montserrat text-xs text-[#0f0f0f]">
                  Submitted
                </span>
                <span className="font-montserrat text-xs font-bold text-[#0f0f0f]">
                  50%
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-4 rounded-full bg-[#8a38f5]" />
                <span className="font-montserrat text-xs text-[#0f0f0f]">
                  Pending
                </span>
                <span className="font-montserrat text-xs font-bold text-[#0f0f0f]">
                  25%
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-4 rounded-full bg-[#d9edff]" />
                <span className="font-montserrat text-xs text-[#0f0f0f]">
                  Missed
                </span>
                <span className="font-montserrat text-xs font-bold text-[#0f0f0f]">
                  25%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Sales Contribution Leaderboard ──── */}
      <div className="flex flex-col gap-2.5 rounded-lg bg-[#f8f8f8] p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
            <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
              Sales Contribution
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-[#f3f3f3] p-1">
              <Search className="size-4 text-[#6f6d6d]" />
              <input
                type="text"
                placeholder="Search"
                className="w-full max-w-90.5 bg-transparent font-montserrat text-sm font-normal text-[#0f0f0f] placeholder-[#6f6d6d] outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <TogglePill
              options={["Staff", "Others"]}
              activeIndex={leaderboardToggle}
              onToggle={setLeaderboardToggle}
            />
            <p className="font-montserrat text-xs text-[#6f6d6d]">
              Sort by <span className="text-[#0f0f0f]">Amount</span>
            </p>
          </div>
        </div>

        {/* Scrollable table area */}
        <div className="overflow-x-auto">
          {/* Table header */}
          <div className="grid min-w-125 grid-cols-[64px_1fr_1fr_1fr_1fr] items-center rounded px-1 py-2 font-montserrat text-sm font-bold text-[#0f0f0f]">
            <span>Position</span>
            <span>Name</span>
            <span>Sales</span>
            <span>Amount</span>
            <span>Latest Sale</span>
          </div>

          {/* Table rows */}
          {salesLeaderboard.map((row, idx) => (
            <div key={row.position}>
              <div className="grid min-w-125 grid-cols-[64px_1fr_1fr_1fr_1fr] items-center rounded px-1 py-1">
                <PositionBadge position={row.position} />
                <div className="flex items-center gap-1">
                  <div className="flex size-4 items-center justify-center rounded-full bg-gray-300">
                    <span className="text-[8px] font-bold text-white">
                      {row.initials}
                    </span>
                  </div>
                  <span className="font-montserrat text-sm text-[#6f6d6d]">
                    {row.name}
                  </span>
                </div>
                <span className="font-montserrat text-sm text-[#0f0f0f]">
                  {row.sales}
                </span>
                <span className="font-montserrat text-sm text-[#0f0f0f]">
                  {row.amount}
                </span>
                <span className="font-montserrat text-sm text-[#0f0f0f]">
                  {row.latestSale}
                </span>
              </div>
              {idx < salesLeaderboard.length - 1 && (
                <div className="h-px w-full bg-[#e0e0e0]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Priority List Table ─────────────── */}
      <CustomTable
        title="Priority List"
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
          <span className="font-montserrat text-xs font-normal text-black">
            All
          </span>
        }
        headers={priorityHeaders}
        data={priorityListData}
        headerKeyMap={priorityHeaderKeyMap}
      />
    </div>
  );
}
