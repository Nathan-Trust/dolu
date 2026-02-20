"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomDialog from "@/components/shared/CustomDialog";
import { PersonStatusBadge } from "./PersonStatusBadge";
import { TogglePill } from "@/components/overview";
import { formatYAxisTick } from "@/components/overview/formatters";
import { Badge } from "@/components/ui/badge";
import { usePerson } from "@/hooks/usePerson";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PersonDetail {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  roleBadge: string;
  performance: string;
  status: "Active" | "Dormant";
  lastActivity: string;
  kpi: { salesValue: string; dealsCount: number };
  reports:
    | { weeklyReports: number; missedReports: number }
    | { dealsSubmitted: number };
  deals: {
    closed: number;
    payment: number;
    negotiation: number;
    inspection: number;
    interested: number;
  };
  salesPerformance: { month: string; revenue: number }[];
}

/* ------------------------------------------------------------------ */
/*  Mock enriched data                                                 */
/* ------------------------------------------------------------------ */

const salesChartData = [
  { month: "JAN", revenue: 2_000_000 },
  { month: "FEB", revenue: 3_500_000 },
  { month: "MAR", revenue: 3_000_000 },
  { month: "APR", revenue: 4_500_000 },
  { month: "MAY", revenue: 5_000_000 },
  { month: "JUN", revenue: 6_000_000 },
  { month: "JUL", revenue: 7_500_000 },
  { month: "AUG", revenue: 8_500_000 },
  { month: "SEP", revenue: 10_000_000 },
  { month: "OCT", revenue: 12_000_000 },
  { month: "NOV", revenue: 9_000_000 },
  { month: "DEC", revenue: 8_000_000 },
];

export const mockPersonDetails: Record<string, PersonDetail> = {
  "1": {
    id: "1",
    name: "John Ibekwe",
    initials: "JI",
    avatarColor: "#8a38f5",
    roleBadge: "Staff",
    performance: "Excellent",
    status: "Active",
    lastActivity: "26-10-26 10:35:23",
    kpi: { salesValue: "₦432,014,234.61", dealsCount: 32 },
    reports: { weeklyReports: 34, missedReports: 4 },
    deals: {
      closed: 34,
      payment: 4,
      negotiation: 4,
      inspection: 4,
      interested: 4,
    },
    salesPerformance: salesChartData,
  },
  "2": {
    id: "2",
    name: "James Agahowa",
    initials: "JA",
    avatarColor: "#38a5f5",
    roleBadge: "Staff",
    performance: "Satisfactory",
    status: "Active",
    lastActivity: "26-10-26 09:12:45",
    kpi: { salesValue: "₦218,500,000.00", dealsCount: 18 },
    reports: { weeklyReports: 30, missedReports: 8 },
    deals: {
      closed: 18,
      payment: 3,
      negotiation: 2,
      inspection: 5,
      interested: 6,
    },
    salesPerformance: salesChartData,
  },
  "3": {
    id: "3",
    name: "Lilian Tamuno",
    initials: "LT",
    avatarColor: "#f538a5",
    roleBadge: "Staff",
    performance: "Unsatisfactory",
    status: "Dormant",
    lastActivity: "26-06-28 14:20:00",
    kpi: { salesValue: "₦45,200,000.00", dealsCount: 5 },
    reports: { weeklyReports: 12, missedReports: 22 },
    deals: {
      closed: 5,
      payment: 1,
      negotiation: 0,
      inspection: 1,
      interested: 2,
    },
    salesPerformance: salesChartData,
  },
  "4": {
    id: "4",
    name: "Ebiere William",
    initials: "EW",
    avatarColor: "#f5a538",
    roleBadge: "Staff",
    performance: "Excellent",
    status: "Active",
    lastActivity: "26-10-26 11:00:10",
    kpi: { salesValue: "₦380,000,000.00", dealsCount: 28 },
    reports: { weeklyReports: 34, missedReports: 0 },
    deals: {
      closed: 28,
      payment: 6,
      negotiation: 3,
      inspection: 2,
      interested: 5,
    },
    salesPerformance: salesChartData,
  },
  "5": {
    id: "5",
    name: "Samson Tosin",
    initials: "ST",
    avatarColor: "#38f5a5",
    roleBadge: "Staff",
    performance: "Satisfactory",
    status: "Active",
    lastActivity: "26-10-26 08:45:00",
    kpi: { salesValue: "₦195,800,000.00", dealsCount: 15 },
    reports: { weeklyReports: 28, missedReports: 6 },
    deals: {
      closed: 15,
      payment: 2,
      negotiation: 4,
      inspection: 3,
      interested: 4,
    },
    salesPerformance: salesChartData,
  },
  /* Realtors */
  "6": {
    id: "6",
    name: "David Okoro",
    initials: "DO",
    avatarColor: "#f53838",
    roleBadge: "Realtor",
    performance: "Excellent",
    status: "Active",
    lastActivity: "26-10-26 10:00:00",
    kpi: { salesValue: "₦310,000,000.00", dealsCount: 24 },
    reports: { dealsSubmitted: 30 },
    deals: {
      closed: 24,
      payment: 5,
      negotiation: 3,
      inspection: 2,
      interested: 6,
    },
    salesPerformance: salesChartData,
  },
  "7": {
    id: "7",
    name: "Grace Adeyemi",
    initials: "GA",
    avatarColor: "#3838f5",
    roleBadge: "Realtor",
    performance: "Satisfactory",
    status: "Active",
    lastActivity: "26-10-26 09:30:00",
    kpi: { salesValue: "₦150,000,000.00", dealsCount: 12 },
    reports: { dealsSubmitted: 26 },
    deals: {
      closed: 12,
      payment: 3,
      negotiation: 2,
      inspection: 3,
      interested: 4,
    },
    salesPerformance: salesChartData,
  },
  "8": {
    id: "8",
    name: "Tunde Balogun",
    initials: "TB",
    avatarColor: "#a538f5",
    roleBadge: "Realtor",
    performance: "Unsatisfactory",
    status: "Dormant",
    lastActivity: "26-06-20 16:00:00",
    kpi: { salesValue: "₦32,000,000.00", dealsCount: 3 },
    reports: { dealsSubmitted: 8 },
    deals: {
      closed: 3,
      payment: 0,
      negotiation: 1,
      inspection: 0,
      interested: 1,
    },
    salesPerformance: salesChartData,
  },
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Divider() {
  return <div className="h-px w-full bg-[#e0e0e0]" />;
}

function InfoRow({
  label,
  value,
  labelSize = "sm",
}: {
  label: string;
  value: React.ReactNode;
  labelSize?: "sm" | "xs";
}) {
  return (
    <div className="flex w-full items-center justify-between">
      <p
        className={`font-montserrat font-normal text-[#0f0f0f] ${
          labelSize === "xs" ? "text-xs" : "text-sm"
        }`}
      >
        {label}
      </p>
      <div className="font-montserrat text-sm font-bold text-[#0f0f0f]">
        {value}
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <p className="font-montserrat text-[9px] font-normal uppercase text-[#6f6d6d]">
      {title}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface PersonDetailDialogProps {
  person: PersonDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PersonDetailDialog({
  person,
  open,
  onOpenChange,
}: PersonDetailDialogProps) {
  const [chartToggle, setChartToggle] = useState(0);

  if (!person) return null;

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      showTrigger={false}
      contentClassName="!w-full !max-w-[759px] !p-0 !gap-0 !border-0 !bg-transparent !shadow-none"
    >
      <div className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto rounded-lg bg-[#f8f8f8] p-4">
        {/* ── Header: Avatar + Name + Role badge ── */}
        <div className="flex items-center gap-2">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
            style={{ backgroundColor: person.avatarColor }}
          >
            {person.initials}
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
              {person.name}
            </p>
            <Badge className="w-fit rounded-lg border-0 bg-[#ddf6e2] px-1 py-0.5 font-montserrat text-[9px] font-semibold text-[#34c759]">
              {person.roleBadge}
            </Badge>
          </div>
        </div>

        {/* ── Quick info rows ── */}
        <div className="flex flex-col gap-2 w-full">
          <InfoRow label="Performance" value={person.performance} />
          <Divider />
          <InfoRow
            label="Status"
            value={<PersonStatusBadge status={person.status} />}
          />
          <Divider />
          <InfoRow label="Last Activity" value={person.lastActivity} />
        </div>

        {/* ── KPI Summary ── */}
        <div className="flex flex-col gap-1 w-full">
          <SectionHeader title="KPI Summary" />
          <div className="flex flex-col gap-2 w-full">
            <InfoRow label="Sales value" value={person.kpi.salesValue} />
            <Divider />
            <InfoRow label="Deals Count" value={person.kpi.dealsCount} />
          </div>
        </div>

        {/* ── Reports / Activity ── */}
        <div className="flex flex-col gap-1 w-full">
          <SectionHeader title="Reports/activity" />
          <div className="flex flex-col gap-2 w-full">
            {"dealsSubmitted" in person.reports ? (
              <InfoRow
                label="Deals Submitted"
                value={person.reports.dealsSubmitted}
              />
            ) : (
              <>
                <InfoRow
                  label="Weekly Reports"
                  value={person.reports.weeklyReports}
                />
                <Divider />
                <InfoRow
                  label="Missed Reports"
                  value={person.reports.missedReports}
                />
              </>
            )}
          </div>
        </div>

        {/* ── Deals ── */}
        <div className="flex flex-col gap-1 w-full">
          <SectionHeader title="Deals" />
          <div className="flex flex-col gap-2 w-full">
            <InfoRow
              label="Closed"
              labelSize="xs"
              value={person.deals.closed}
            />
            <Divider />
            <InfoRow
              label="Payment"
              labelSize="xs"
              value={person.deals.payment}
            />
            <Divider />
            <InfoRow
              label="Negotiation"
              labelSize="xs"
              value={person.deals.negotiation}
            />
            <Divider />
            <InfoRow
              label="Inspection"
              labelSize="xs"
              value={person.deals.inspection}
            />
            <Divider />
            <InfoRow
              label="Interested"
              labelSize="xs"
              value={person.deals.interested}
            />
          </div>
        </div>

        {/* ── Sales Performance chart ── */}
        <div className="flex flex-col gap-2 rounded-lg bg-[#f8f8f8] p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-montserrat text-sm text-[#0f0f0f]">
              <span className="font-bold">Sales Performance</span>
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
              <AreaChart data={person.salesPerformance}>
                <defs>
                  <linearGradient
                    id="personDetailGradient"
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
                  fill="url(#personDetailGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </CustomDialog>
  );
}

/* ── Wrapper component that uses the usePerson hook ── */
interface PersonDetailDialogWrapperProps {
  selectedPersonId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PersonDetailDialogWrapper({
  selectedPersonId,
  open,
  onOpenChange,
}: PersonDetailDialogWrapperProps) {
  const { data: personData } = usePerson(selectedPersonId || undefined);

  const salesChartData = [
    { month: "JAN", revenue: 2_000_000 },
    { month: "FEB", revenue: 3_500_000 },
    { month: "MAR", revenue: 3_000_000 },
    { month: "APR", revenue: 4_500_000 },
    { month: "MAY", revenue: 5_000_000 },
    { month: "JUN", revenue: 6_000_000 },
    { month: "JUL", revenue: 7_500_000 },
    { month: "AUG", revenue: 8_500_000 },
    { month: "SEP", revenue: 10_000_000 },
    { month: "OCT", revenue: 12_000_000 },
    { month: "NOV", revenue: 9_000_000 },
    { month: "DEC", revenue: 8_000_000 },
  ];

  /* Map API person to component PersonDetail */
  const person: PersonDetail | null = personData
    ? {
        id: personData.id,
        name: `${personData.first_name} ${personData.last_name}`.trim(),
        initials:
          `${personData.first_name?.[0] || ""}${personData.last_name?.[0] || ""}`.toUpperCase(),
        avatarColor: "#8a38f5",
        roleBadge: personData.role?.name || "Staff",
        performance: personData.performance || "Satisfactory",
        status: (personData.status === "suspended" ? "Dormant" : "Active") as
          | "Active"
          | "Dormant",
        lastActivity: personData.last_active
          ? new Date(personData.last_active).toLocaleString()
          : "-",
        kpi: {
          salesValue: personData.sales_value
            ? `₦${personData.sales_value.toLocaleString()}`
            : "₦0",
          dealsCount: personData.deals_count || 0,
        },
        reports: { weeklyReports: 0, missedReports: 0 },
        deals: {
          closed: personData.deals_closed || 0,
          payment: 0,
          negotiation: 0,
          inspection: 0,
          interested: 0,
        },
        salesPerformance: salesChartData,
      }
    : selectedPersonId
      ? (mockPersonDetails[selectedPersonId] ?? null)
      : null;

  return (
    <PersonDetailDialog
      person={person}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}
