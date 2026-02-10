"use client";

import { Bell, Search } from "lucide-react";

interface TopNavBarProps {
  userName?: string;
  userEmail?: string;
  userInitials?: string;
  /** Slot for the mobile hamburger button */
  mobileMenuButton?: React.ReactNode;
}

export default function TopNavBar({
  userName = "Sim Tommy",
  userEmail = "simtommy@email.com",
  userInitials = "ST",
  mobileMenuButton,
}: TopNavBarProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] px-4 py-4">
      {/* Left: hamburger (mobile) + search */}
      <div className="flex flex-1 items-center gap-2">
        {mobileMenuButton}
        <div className="flex w-full max-w-172.5 items-center gap-2 rounded-lg bg-[#f3f3f3] p-2">
          <Search className="size-5 shrink-0 text-[#6f6d6d] md:size-6" />
          <input
            type="text"
            placeholder="Search anything"
            className="w-full bg-transparent font-montserrat text-sm font-normal text-[#0f0f0f] placeholder-[#6f6d6d] outline-none"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative shrink-0">
          <Bell className="size-5 text-[#0f0f0f] md:size-6" />
          <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[#8a38f5]" />
        </button>

        {/* User info */}
        <div className="flex items-center gap-1">
          <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[#d9edff] md:size-12">
            <span className="font-montserrat text-xl font-bold text-[#0088ff] md:text-[27px]">
              {userInitials}
            </span>
          </div>
          <div className="hidden flex-col gap-0.5 md:flex">
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
