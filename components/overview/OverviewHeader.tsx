import { RoleBadge } from "@/components/shared/RoleBadge";
import { type UserRole } from "@/util/status";

interface OverviewHeaderProps {
  role: UserRole;
}

export function OverviewHeader({ role }: OverviewHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
          Overview
        </h1>
        <RoleBadge role={role} />
      </div>
      <p className="font-montserrat text-xs text-[#6f6d6d]">
        Session <span className="font-bold">Jul 10, 2026</span>
      </p>
    </div>
  );
}
