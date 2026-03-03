"use client";

import { type UserRole } from "@/util/status";
import {
  PersonStatusBadge,
  PerformanceBadge,
  type PersonStatus,
  type PerformanceLevel,
} from "@/components/people/PersonStatusBadge";

/* ------------------------------------------------------------------ */
/*  Mock data for current user's report                                */
/* ------------------------------------------------------------------ */

interface UserReport {
  name: string;
  initials: string;
  avatarColor: string;
  email: string;
  role: string;
  status: PersonStatus;
  performance: PerformanceLevel;
  lastActivity: string;
  totalSales: string;
  propertiesSold: number;
  clientsManaged: number;
  averageRating: string;
}

const currentReports: Record<"staff" | "realtor" | "manager", UserReport> = {
  staff: {
    name: "John Ibekwe",
    initials: "JI",
    avatarColor: "#8a38f5",
    email: "john.ibekwe@dolu.com",
    role: "Staff",
    status: "Active",
    performance: "Excellent",
    lastActivity: "Jul 10, 2026",
    totalSales: "₦45,000,000",
    propertiesSold: 12,
    clientsManaged: 28,
    averageRating: "4.8/5.0",
  },
  realtor: {
    name: "David Okoro",
    initials: "DO",
    avatarColor: "#f53838",
    email: "david.okoro@dolu.com",
    role: "Realtor",
    status: "Active",
    performance: "Excellent",
    lastActivity: "Jul 10, 2026",
    totalSales: "₦78,500,000",
    propertiesSold: 18,
    clientsManaged: 42,
    averageRating: "4.9/5.0",
  },
  manager: {
    name: "Sarah Johnson",
    initials: "SJ",
    avatarColor: "#ff6b35",
    email: "sarah.johnson@dolu.com",
    role: "Manager",
    status: "Active",
    performance: "Excellent",
    lastActivity: "Jul 10, 2026",
    totalSales: "₦120,000,000",
    propertiesSold: 35,
    clientsManaged: 65,
    averageRating: "4.9/5.0",
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export interface ReportsOwnProfileProps {
  role: UserRole;
}

export default function ReportsOwnProfile({ role }: ReportsOwnProfileProps) {
  const report = currentReports[role as "staff" | "realtor" | "manager"];

  if (!report) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
          My Reports
        </h1>
        <p className="font-montserrat text-xs text-[#6f6d6d]">
          Session <span className="font-bold">Jul 10, 2026</span>
        </p>
      </div>

      {/* Profile summary card */}
      <div className="rounded-lg bg-[#f8f8f8] p-6">
        <div className="flex flex-col gap-6">
          {/* Avatar + name row */}
          <div className="flex items-center gap-4">
            <div
              className="flex size-12 items-center justify-center rounded-full text-lg font-bold text-white"
              style={{ backgroundColor: report.avatarColor }}
            >
              {report.initials}
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-montserrat text-base font-bold text-[#0f0f0f]">
                {report.name}
              </p>
              <p className="font-montserrat text-sm text-[#6f6d6d]">
                {report.role}
              </p>
            </div>
            <div className="ml-auto">
              <PersonStatusBadge status={report.status} />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#e0e0e0]" />

          {/* Performance Section */}
          <div>
            <h2 className="mb-4 font-montserrat text-sm font-bold text-[#0f0f0f]">
              Performance Summary
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Total Sales" value={report.totalSales} />
              <MetricCard
                label="Properties Sold"
                value={String(report.propertiesSold)}
              />
              <MetricCard
                label="Clients Managed"
                value={String(report.clientsManaged)}
              />
              <MetricCard label="Average Rating" value={report.averageRating} />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#e0e0e0]" />

          {/* Details grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem label="Email" value={report.email} />
            <DetailItem
              label="Performance Rating"
              value={<PerformanceBadge level={report.performance} />}
            />
            <DetailItem label="Last Activity" value={report.lastActivity} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <p className="mb-1 font-montserrat text-xs text-[#6f6d6d]">{label}</p>
      <p className="font-montserrat text-lg font-bold text-[#0f0f0f]">
        {value}
      </p>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-montserrat text-xs font-semibold text-[#6f6d6d]">
        {label}
      </p>
      <div className="font-montserrat text-sm text-[#0f0f0f]">{value}</div>
    </div>
  );
}
