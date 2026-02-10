"use client";

import { PersonStatusBadge, PerformanceBadge } from "./PersonStatusBadge";
import { type UserRole } from "@/util/status";

/* ------------------------------------------------------------------ */
/*  Mock "current user" data – replace with real auth / API later       */
/* ------------------------------------------------------------------ */

const currentProfiles: Record<
  "staff" | "realtor",
  {
    name: string;
    initials: string;
    avatarColor: string;
    email: string;
    phone: string;
    role: string;
    status: "Active" | "Dormant";
    performance: "Excellent" | "Satisfactory" | "Unsatisfactory";
    lastActivity: string;
    joinedDate: string;
  }
> = {
  staff: {
    name: "John Ibekwe",
    initials: "JI",
    avatarColor: "#8a38f5",
    email: "john.ibekwe@dolu.com",
    phone: "+234 801 234 5678",
    role: "Staff",
    status: "Active",
    performance: "Excellent",
    lastActivity: "Jul 10, 2026",
    joinedDate: "Jan 15, 2025",
  },
  realtor: {
    name: "David Okoro",
    initials: "DO",
    avatarColor: "#f53838",
    email: "david.okoro@dolu.com",
    phone: "+234 803 456 7890",
    role: "Realtor",
    status: "Active",
    performance: "Excellent",
    lastActivity: "Jul 10, 2026",
    joinedDate: "Mar 02, 2025",
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface PeopleOwnProfileProps {
  role: UserRole;
}

export default function PeopleOwnProfile({ role }: PeopleOwnProfileProps) {
  const profile = currentProfiles[role as "staff" | "realtor"];

  if (!profile) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
          My Profile
        </h1>
        <p className="font-montserrat text-xs text-[#6f6d6d]">
          Session <span className="font-bold">Jul 10, 2026</span>
        </p>
      </div>

      {/* Profile card */}
      <div className="rounded-lg bg-[#f8f8f8] p-6">
        <div className="flex flex-col gap-6">
          {/* Avatar + name row */}
          <div className="flex items-center gap-4">
            <div
              className="flex size-12 items-center justify-center rounded-full text-lg font-bold text-white"
              style={{ backgroundColor: profile.avatarColor }}
            >
              {profile.initials}
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-montserrat text-base font-bold text-[#0f0f0f]">
                {profile.name}
              </p>
              <p className="font-montserrat text-sm text-[#6f6d6d]">
                {profile.role}
              </p>
            </div>
            <div className="ml-auto">
              <PersonStatusBadge status={profile.status} />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#e0e0e0]" />

          {/* Details grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem label="Email" value={profile.email} />
            <DetailItem label="Phone" value={profile.phone} />
            <DetailItem label="Joined" value={profile.joinedDate} />
            <DetailItem
              label="Performance"
              value={<PerformanceBadge level={profile.performance} />}
            />
            <DetailItem label="Last Activity" value={profile.lastActivity} />
          </div>
        </div>
      </div>
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
