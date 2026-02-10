"use client";

import { TogglePill } from "@/components/overview";

interface PeopleHeaderProps {
  activeTab: number;
  onTabChange: (index: number) => void;
}

export function PeopleHeader({ activeTab, onTabChange }: PeopleHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
          People
        </h1>
        <TogglePill
          options={["Staff", "Realtors"]}
          activeIndex={activeTab}
          onToggle={onTabChange}
        />
      </div>
      <p className="font-montserrat text-xs text-[#6f6d6d]">
        Session <span className="font-bold">Jul 10, 2026</span>
      </p>
    </div>
  );
}
