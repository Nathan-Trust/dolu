"use client";

import { Bell, Search } from "lucide-react";

interface TopNavBarProps {
  userName?: string;
  userEmail?: string;
  userInitials?: string;
}

export default function TopNavBar({
  userName = "Sim Tommy",
  userEmail = "simtommy@email.com",
  userInitials = "ST",
}: TopNavBarProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] px-4 py-4">
      {/* Search bar */}
      <div className="flex w-[690px] items-center gap-2 rounded-lg bg-[#f3f3f3] p-2">
        <Search className="size-6 text-[#6f6d6d]" />
        <input
          type="text"
          placeholder="Search anything"
          className="w-full bg-transparent font-montserrat text-sm font-normal text-[#0f0f0f] placeholder-[#6f6d6d] outline-none"
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative">
          <Bell className="size-6 text-[#0f0f0f]" />
          <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[#8a38f5]" />
        </button>

        {/* User info */}
        <div className="flex items-center gap-1">
          <div className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-[#d9edff]">
            <span className="font-montserrat text-[27px] font-bold text-[#0088ff]">
              {userInitials}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="font-montserrat text-base font-bold text-[#0f0f0f]">
              {userName}
            </p>
            <p className="font-montserrat text-xs font-normal text-[#6f6d6d]">
              {userEmail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
