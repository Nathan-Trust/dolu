"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Repeat2, FileText, ChevronDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & mock data                                                  */
/* ------------------------------------------------------------------ */

interface FinanceMetric {
  label: string;
  value: string;
  valueColor?: string;
  icon: React.ElementType;
  iconColor: string;
}

interface SnapshotMetric {
  label: string;
  value: string;
  icon: React.ElementType;
  iconColor: string;
}

interface MonthData {
  month: string;
  income: number;
  expenses: number;
}

const financeSummary: FinanceMetric[] = [
  {
    label: "Total Income",
    value: "₦453,520,001",
    icon: TicketPercentIcon,
    iconColor: "#34c759",
  },
  {
    label: "Total Expenses",
    value: "₦134,235,040",
    icon: UserCheckIcon,
    iconColor: "#8a38f5",
  },
  {
    label: "Net Position",
    value: "₦319,284,961",
    valueColor: "#34c759",
    icon: Repeat2,
    iconColor: "#6f6d6d",
  },
];

const outstandingSnapshot: SnapshotMetric[] = [
  {
    label: "Pending Invoices",
    value: "520",
    icon: FileText,
    iconColor: "#ff9500",
  },
  {
    label: "Overdue Invoices",
    value: "520",
    icon: FileText,
    iconColor: "#8a38f5",
  },
  {
    label: "Total Outstanding",
    value: "520",
    icon: FileText,
    iconColor: "#6f6d6d",
  },
];

const monthlyData: MonthData[] = [
  { month: "JAN", income: 390, expenses: 500 },
  { month: "FEB", income: 285, expenses: 200 },
  { month: "MAR", income: 470, expenses: 355 },
  { month: "APR", income: 950, expenses: 1020 },
  { month: "MAY", income: 1020, expenses: 730 },
  { month: "JUN", income: 1195, expenses: 620 },
  { month: "JUL", income: 760, expenses: 620 },
  { month: "AUG", income: 1380, expenses: 450 },
  { month: "SEP", income: 1080, expenses: 390 },
  { month: "OCT", income: 730, expenses: 880 },
  { month: "NOV", income: 630, expenses: 250 },
  { month: "DEC", income: 1140, expenses: 1070 },
];

/* ------------------------------------------------------------------ */
/*  Custom grouped bar shape                                           */
/* ------------------------------------------------------------------ */

function RoundedBar(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
}) {
  const { x = 0, y = 0, width = 0, height = 0, fill } = props;
  const radius = 4;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      rx={radius}
      ry={radius}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Y-axis tick formatter                                              */
/* ------------------------------------------------------------------ */

function formatYAxis(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}B`;
  if (value >= 1) return `${value}M`;
  return String(value);
}

/* ------------------------------------------------------------------ */
/*  Inline icon components (avoid import-only usage flagged by linter) */
/* ------------------------------------------------------------------ */

function TicketPercentIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}

function UserCheckIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FinanceOverview() {
  return (
    <div className="flex flex-col gap-8">
      {/* ── Top metric cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
        {financeSummary.map((m) => (
          <div
            key={m.label}
            className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4"
          >
            <div className="flex flex-col gap-2">
              <p className="font-montserrat text-base font-normal text-[#6f6d6d]">
                {m.label}
              </p>
              <p
                className="font-montserrat text-lg font-bold"
                style={{ color: m.valueColor ?? "#0f0f0f" }}
              >
                {m.value}
              </p>
            </div>
            <m.icon className="size-6" style={{ color: m.iconColor }} />
          </div>
        ))}
      </div>

      {/* ── Outstanding Snapshot ── */}
      <div className="flex flex-col gap-4">
        <p className="font-montserrat text-sm font-bold text-black">
          Outstanding Snapshot
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {outstandingSnapshot.map((m) => (
            <div
              key={m.label}
              className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4"
            >
              <div className="flex flex-col gap-2">
                <p className="font-montserrat text-base font-normal text-[#6f6d6d]">
                  {m.label}
                </p>
                <p className="font-montserrat text-lg font-bold text-[#0f0f0f]">
                  {m.value}
                </p>
              </div>
              <m.icon className="size-6" style={{ color: m.iconColor }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Income vs Expenses Chart ── */}
      <div className="flex flex-col gap-2 rounded-lg bg-[#f8f8f8] p-2">
        {/* Chart header */}
        <div className="flex items-center gap-2">
          <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
            Income vs Expenses
          </p>
          <button className="flex items-center gap-1 rounded-lg bg-[#e0e0e0] px-1 py-1">
            <span className="font-montserrat text-[9px] font-semibold text-[#6f6d6d]">
              This Month
            </span>
            <ChevronDown className="size-4 text-[#6f6d6d]" />
          </button>
        </div>

        {/* Bar chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 8, right: 8, bottom: 0, left: -10 }}
              barCategoryGap="25%"
              barGap={2}
            >
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
                tickFormatter={formatYAxis}
                tick={{
                  fontSize: 9,
                  fill: "#6f6d6d",
                  fontFamily: "Montserrat",
                }}
                axisLine={false}
                tickLine={false}
                domain={[0, 1500]}
                ticks={[0, 500, 1000, 1500]}
              />
              <Bar dataKey="income" shape={<RoundedBar />} barSize={10}>
                {monthlyData.map((_, idx) => (
                  <Cell key={idx} fill="#34c759" />
                ))}
              </Bar>
              <Bar dataKey="expenses" shape={<RoundedBar />} barSize={10}>
                {monthlyData.map((_, idx) => (
                  <Cell key={idx} fill="#ff383c" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <div className="size-4 rounded-full bg-[#34c759]" />
            <span className="font-montserrat text-xs font-normal text-[#0f0f0f]">
              Income
            </span>
            <span className="font-montserrat text-xs font-bold text-[#0f0f0f]">
              ₦453,520,001
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-4 rounded-full bg-[#ff383c]" />
            <span className="font-montserrat text-xs font-normal text-[#0f0f0f]">
              Expenses
            </span>
            <span className="font-montserrat text-xs font-bold text-[#0f0f0f]">
              ₦134,235,040
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
