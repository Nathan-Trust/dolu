"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChartSquare,
  UserId,
  GraphUp,
  UsersGroupTwoRounded,
  HomeAddAngle,
  MoneyBag,
  Map as SolarMap,
  SettingsMinimalistic,
  Logout3,
  AltArrowRight,
} from "@solar-icons/react";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { type UserRole } from "@/util/status";
import { useStore } from "@/store/user-store";

interface SidebarProps {
  role: UserRole;
  /** Called after a navigation action — used to close the mobile sheet */
  onNavigate?: () => void;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  subItems?: { label: string; href: string }[];
}

const getMenuItems = (role: UserRole): MenuItem[] => [
  {
    icon: ChartSquare,
    label: "Overview",
    href: `/dashboard/${role}/overview`,
  },
  { icon: UserId, label: "People", href: `/dashboard/${role}/people` },
  { icon: GraphUp, label: "Reports", href: `/dashboard/${role}/reports` },
  { icon: UsersGroupTwoRounded, label: "Clients", href: `/dashboard/${role}/clients` },
  { icon: HomeAddAngle, label: "Properties", href: `/dashboard/${role}/properties` },
  // Finance is hidden for realtors
  ...(role !== "realtor"
    ? [
        {
          icon: MoneyBag,
          label: "Finance",
          subItems: [
            { label: "Overview", href: `/dashboard/${role}/finance` },
            // Chairman sees Overview only; Admin sees all; Staff sees Sales Income
            ...(role === "admin"
              ? [
                  {
                    label: "Sales Income",
                    href: `/dashboard/${role}/finance/sales-income`,
                  },
                  {
                    label: "Commissions",
                    href: `/dashboard/${role}/finance/commissions`,
                  },
                  {
                    label: "Expenses",
                    href: `/dashboard/${role}/finance/expenses`,
                  },
                  {
                    label: "Invoices",
                    href: `/dashboard/${role}/finance/invoices`,
                  },
                ]
              : role === "staff"
                ? [
                    {
                      label: "Sales Income",
                      href: `/dashboard/${role}/finance/sales-income`,
                    },
                  ]
                : []),
          ],
        },
      ]
    : []),
  { icon: SolarMap, label: "Map", href: `/dashboard/${role}/map` },
  { icon: SettingsMinimalistic, label: "Settings", href: `/dashboard/${role}/settings` },
];

export default function Sidebar({ role, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { userData } = useStore();
  const menuItems = getMenuItems(role);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const userName = userData
    ? `${userData.first_name ?? ""} ${userData.last_name ?? ""}`.trim() ||
      "User"
    : "User";
  const userEmail = userData?.email ?? "";
  const userInitials = userName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const isActiveSubItem = (href: string) => pathname === href;

  const isMenuActive = (item: MenuItem) => {
    if (item.subItems) {
      return item.subItems.some((sub) => pathname.startsWith(sub.href));
    }
    return item.href ? pathname === item.href : false;
  };

  return (
    <aside className="flex h-full w-65.75 flex-col gap-16 bg-black py-8">
      {/* Logo */}
      <div className="flex justify-center">
        <div className="relative h-12 w-24.5">
          <Image
            src="/ca02524960676ea485d89a4976f63978296ff29e.svg"
            alt="Dolu Logo"
            fill
            className="object-contain brightness-0 invert"
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex min-h-0 flex-1 flex-col justify-between pl-8">
        <nav className="flex flex-col gap-6 overflow-y-auto scrollbar-hide pr-2">
          {menuItems.map((item) => {
            const isExpanded = expandedItems.includes(item.label);
            const isActive = isMenuActive(item);

            return (
              <div key={item.label} className="flex flex-col gap-2">
                {/* Menu item */}
                <button
                  onClick={() => {
                    if (item.subItems) {
                      toggleExpand(item.label);
                    } else if (item.href) {
                      router.push(item.href);
                      onNavigate?.();
                    }
                  }}
                  className={`flex items-center justify-between rounded-l p-1 transition-colors ${
                    isActive ? "bg-[#f2d5ff]" : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <item.icon
                      weight="BoldDuotone"
                      className={`size-6 ${isActive ? "text-[#8a38f5]" : "text-[#f3f3f3]"}`}
                    />
                    <span
                      className={`font-montserrat text-base ${
                        isActive
                          ? "font-bold text-[#8a38f5]"
                          : "font-normal text-[#f3f3f3]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {item.subItems && (
                    <AltArrowRight
                      weight="BoldDuotone"
                      className={`size-6 transition-transform ${
                        isActive ? "text-[#8a38f5]" : "text-[#f3f3f3]"
                      } ${isExpanded ? "rotate-90" : ""}`}
                    />
                  )}
                  {!item.subItems && (
                    <AltArrowRight
                      weight="BoldDuotone"
                      className={`size-6 ${isActive ? "text-[#8a38f5]" : "text-[#f3f3f3]"}`}
                    />
                  )}
                </button>

                {/* Sub items */}
                {item.subItems && isExpanded && (
                  <div className="flex flex-col gap-2 pl-8 text-sm">
                    {item.subItems.map((subItem) => {
                      const isSubActive = isActiveSubItem(subItem.href);
                      return (
                        <button
                          key={subItem.label}
                          onClick={() => {
                            router.push(subItem.href);
                            onNavigate?.();
                          }}
                          className={`text-left font-montserrat ${
                            isSubActive
                              ? "font-bold text-[#9e76f8]"
                              : "font-normal text-[#f3f3f3]"
                          }`}
                        >
                          {subItem.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User profile + Log out */}
        <div className="flex flex-col gap-4">
          {/* User info */}
          <div className="flex items-center gap-1">
            <div className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-[#d9edff]">
              <span
                className="font-montserrat text-[27px] font-bold text-[#0088ff]"
                suppressHydrationWarning
              >
                {userInitials}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <RoleBadge role={role} />
              <p
                className="font-montserrat text-base font-bold text-[#f8f8f8]"
                suppressHydrationWarning
              >
                {userName}
              </p>
              <p
                className="font-montserrat text-xs font-normal text-[#c8c8c8]"
                suppressHydrationWarning
              >
                {userEmail}
              </p>
            </div>
          </div>

          {/* Log out */}
          <button
            onClick={() => router.push("/sign-in")}
            className="flex items-center gap-1 rounded-l p-1 hover:bg-white/5"
          >
            <Logout3 weight="BoldDuotone" className="size-6 text-[#f3f3f3]" />
            <span className="font-montserrat text-base font-normal text-[#f3f3f3]">
              Log Out
            </span>
            <AltArrowRight weight="BoldDuotone" className="ml-auto size-6 text-[#f3f3f3]" />
          </button>
        </div>
      </div>
    </aside>
  );
}
