"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { RoleBadge } from "@/components/shared/RoleBadge";
import CustomDialog from "@/components/shared/CustomDialog";
import { Pause, RefreshCw, KeyRound, Trash2 } from "lucide-react";
import { type UserRole } from "@/util/status";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface UserDetail {
  name: string;
  avatarUrl?: string;
  initials: string;
  avatarColor: string;
  role: UserRole;
  performance: string;
  status: "Active" | "Suspended";
  lastActivity: string;
  accountCreated: string;
  weeklyReports: number;
  missedReports: number;
}

interface UserDetailDialogProps {
  user: UserDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuspend?: (user: { name: string; role: UserRole }) => void;
}

/* ------------------------------------------------------------------ */
/*  Status badge                                                       */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: "Active" | "Suspended" }) {
  const isActive = status === "Active";
  return (
    <Badge
      className="font-montserrat text-xs font-medium"
      style={{
        backgroundColor: isActive ? "#e8f9ee" : "#fff3e0",
        color: isActive ? "#34c759" : "#f5a623",
      }}
    >
      {status}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail row                                                         */
/* ------------------------------------------------------------------ */

function DetailRow({
  label,
  value,
  borderBottom = true,
}: {
  label: string;
  value: React.ReactNode;
  borderBottom?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${borderBottom ? "border-b border-[#e0e0e0]" : ""}`}
    >
      <span className="font-montserrat text-sm text-[#0f0f0f]">{label}</span>
      <span className="font-montserrat text-sm font-semibold text-[#0f0f0f]">
        {value}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function UserDetailDialog({
  user,
  open,
  onOpenChange,
  onSuspend,
}: UserDetailDialogProps) {
  if (!user) return null;

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      showTrigger={false}
      contentClassName="max-w-lg bg-white p-6"
    >
      {/* Header: Avatar + Name + Role */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-[#e0e0e0]"
          style={{ backgroundColor: user.avatarColor }}
        >
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-montserrat text-lg font-bold text-white">
              {user.initials}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-montserrat text-base font-bold text-[#0f0f0f]">
            {user.name}
          </h3>
          <RoleBadge role={user.role} />
        </div>
      </div>

      {/* Detail rows */}
      <div className="mt-4">
        <DetailRow label="Performance" value={user.performance} />
        <DetailRow
          label="Status"
          value={<StatusBadge status={user.status} />}
        />
        <DetailRow label="Last Activity" value={user.lastActivity} />
        <DetailRow label="Account Created" value={user.accountCreated} />

        {/* Reports/Activity section */}
        <p className="mt-4 font-montserrat text-xs font-medium tracking-wide text-[#6f6d6d] uppercase">
          Reports/Activity
        </p>
        <DetailRow label="Weekly Reports" value={user.weeklyReports} />
        <DetailRow
          label="Missed Reports"
          value={user.missedReports}
          borderBottom={false}
        />
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => {
            onOpenChange(false);
            onSuspend?.({
              name: user.name,
              role: user.role,
            } as unknown as { name: string; role: UserRole });
          }}
          className="flex items-center gap-1.5 rounded-full border border-[#8a38f5] px-4 py-2 font-montserrat text-xs font-medium text-[#8a38f5] transition-colors hover:bg-[#f2d5ff]"
        >
          <Pause className="h-3.5 w-3.5" />
          Suspend
        </button>
        <button className="flex items-center gap-1.5 rounded-full border border-[#8a38f5] px-4 py-2 font-montserrat text-xs font-medium text-[#8a38f5] transition-colors hover:bg-[#f2d5ff]">
          <RefreshCw className="h-3.5 w-3.5" />
          Update Role
        </button>
        <button className="flex items-center gap-1.5 rounded-full border border-[#8a38f5] px-4 py-2 font-montserrat text-xs font-medium text-[#8a38f5] transition-colors hover:bg-[#f2d5ff]">
          <KeyRound className="h-3.5 w-3.5" />
          Reset Password
        </button>
        <button className="flex items-center gap-1.5 rounded-full border border-[#ff383c] px-4 py-2 font-montserrat text-xs font-medium text-[#ff383c] transition-colors hover:bg-red-50">
          <Trash2 className="h-3.5 w-3.5" />
          Delete User
        </button>
      </div>
    </CustomDialog>
  );
}
