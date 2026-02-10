"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import UsersAndRoles from "@/components/settings/UsersAndRoles";
import AccessControl from "@/components/settings/AccessControl";
import SystemPreferences from "@/components/settings/SystemPreferences";
import Security from "@/components/settings/Security";
import { type UserRole } from "@/util/status";

const allSubTabs = [
  { label: "Users & Roles", slug: "user-roles" },
  { label: "Access Control", slug: "access-control" },
  { label: "System Preferences", slug: "system-preferences" },
  { label: "Security", slug: "security" },
  { label: "Audit Logs", slug: "audit-logs" },
] as const;

type TabSlug = (typeof allSubTabs)[number]["slug"];

interface SettingsClientProps {
  role: UserRole;
}

export default function SettingsClient({ role }: SettingsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeSlug = useMemo<TabSlug>(() => {
    const param = searchParams.get("tab");
    const match = allSubTabs.find((t) => t.slug === param);
    return match ? match.slug : "user-roles";
  }, [searchParams]);

  const setActiveTab = (slug: TabSlug) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", slug);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
          Settings
        </h1>
        <p className="font-montserrat text-xs text-[#6f6d6d]">
          Session <span className="font-bold">Jul 10, 2026</span>
        </p>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex gap-4 overflow-x-auto border-b border-[#e0e0e0]">
        {allSubTabs.map((tab) => (
          <button
            key={tab.slug}
            onClick={() => setActiveTab(tab.slug)}
            className={`shrink-0 whitespace-nowrap pb-2 font-montserrat text-sm transition-colors ${
              activeSlug === tab.slug
                ? "border-b-2 border-[#8a38f5] font-bold text-[#8a38f5]"
                : "font-normal text-[#6f6d6d] hover:text-[#0f0f0f]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeSlug === "user-roles" && <UsersAndRoles role={role} />}
      {activeSlug === "access-control" && <AccessControl />}
      {activeSlug === "system-preferences" && <SystemPreferences />}
      {activeSlug === "security" && <Security />}
      {activeSlug === "audit-logs" && (
        <p className="font-montserrat text-sm text-[#6f6d6d]">
          Audit Logs — Coming soon
        </p>
      )}
    </div>
  );
}
