"use client";

import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { getRoleConfig, isValidRole, type UserRole } from "@/util/status";
import { use } from "react";
import { useStore } from "@/store/user-store";

interface RoleConfirmationPageProps {
  params: Promise<{ role: string }>;
}

export default function RoleConfirmationPage({
  params,
}: RoleConfirmationPageProps) {
  const { role } = use(params);
  const router = useRouter();
  const { userData } = useStore();

  if (!isValidRole(role)) {
    notFound();
  }

  const validRole = role as UserRole;
  const roleConfig = getRoleConfig(validRole);

  /* Use actual user name from store, fallback gracefully */
  const userName = userData
    ? `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
      "User"
    : "User";

  const handleProceed = () => {
    router.push(`/dashboard/${validRole}/overview`);
  };

  return (
    <div className="rounded-lg bg-[#f8f8f8] p-2">
      <div className="flex flex-col gap-8">
        {/* Welcome section */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <p className="font-montserrat text-base font-bold text-[#0f0f0f]">
              Welcome {userName},
            </p>
            <div className="flex items-center gap-2">
              <p className="font-montserrat text-sm font-normal text-[#6f6d6d]">
                You&apos;re currently logged in as
              </p>
              <RoleBadge role={validRole} />
            </div>
          </div>
          <p className="font-montserrat text-sm font-normal text-[#0f0f0f]">
            {roleConfig.description}
          </p>
        </div>

        {/* Proceed button */}
        <div className="flex flex-col">
          <Button
            onClick={handleProceed}
            className="w-31 bg-[#8a38f5] text-sm font-bold text-[#f8f8f8] hover:bg-[#7a2ed5]"
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
}
