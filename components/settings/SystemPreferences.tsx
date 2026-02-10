"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ------------------------------------------------------------------ */
/*  Option data                                                        */
/* ------------------------------------------------------------------ */

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const currencies = [
  { label: "₦ (NGN)", value: "NGN" },
  { label: "$ (USD)", value: "USD" },
  { label: "€ (EUR)", value: "EUR" },
  { label: "£ (GBP)", value: "GBP" },
] as const;

const dateFormats = [
  "DD-MM-YY",
  "MM-DD-YY",
  "YY-MM-DD",
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "YYYY-MM-DD",
] as const;

const timeZones = [
  { label: "GMT +01:00 (West Africa Time)", value: "Africa/Lagos" },
  { label: "GMT +00:00 (UTC)", value: "UTC" },
  { label: "GMT -05:00 (Eastern Time)", value: "America/New_York" },
  { label: "GMT -08:00 (Pacific Time)", value: "America/Los_Angeles" },
  { label: "GMT +02:00 (Central Africa Time)", value: "Africa/Johannesburg" },
  { label: "GMT +05:30 (India Standard Time)", value: "Asia/Kolkata" },
] as const;

const dashboardViews = [
  "Overview",
  "People",
  "Clients",
  "Properties",
  "Finance",
  "Map",
  "Reports",
  "Settings",
] as const;

/* ------------------------------------------------------------------ */
/*  Preference row                                                     */
/* ------------------------------------------------------------------ */

function PreferenceRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#e0e0e0] py-4 last:border-b-0 md:flex-row md:items-center md:justify-between md:gap-0">
      <div className="flex flex-col gap-0.5">
        <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
          {title}
        </p>
        <p className="font-montserrat text-xs text-[#6f6d6d]">
          {description}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline select (compact, right-aligned)                             */
/* ------------------------------------------------------------------ */

function InlineSelect({
  value,
  onValueChange,
  options,
  label,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: readonly { label: string; value: string }[];
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="font-montserrat text-xs font-bold text-[#0f0f0f]">
          {label}
        </span>
      )}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-8 w-auto min-w-28 gap-1 border-none bg-transparent px-2 font-montserrat text-sm text-[#0f0f0f] shadow-none focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="font-montserrat text-sm"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function SystemPreferences() {
  const [weekStart, setWeekStart] = useState("Monday");
  const [currency, setCurrency] = useState("NGN");
  const [dateFormat, setDateFormat] = useState("DD-MM-YY");
  const [timeZone, setTimeZone] = useState("Africa/Lagos");
  const [adminDashboard, setAdminDashboard] = useState("Overview");
  const [staffDashboard, setStaffDashboard] = useState("Overview");
  const [realtorDashboard, setRealtorDashboard] = useState("Overview");

  /* Map simple string arrays to { label, value } shape */
  const weekDayOptions = weekDays.map((d) => ({ label: d, value: d }));
  const dateFormatOptions = dateFormats.map((f) => ({ label: f, value: f }));
  const viewOptions = dashboardViews.map((v) => ({ label: v, value: v }));

  return (
    <div className="flex flex-col">
      {/* Default Reporting Week Starts On */}
      <PreferenceRow
        title="Default Reporting Week Starts On"
        description="Determines the first day of the reporting week"
      >
        <InlineSelect
          value={weekStart}
          onValueChange={setWeekStart}
          options={weekDayOptions}
        />
      </PreferenceRow>

      {/* System Currency */}
      <PreferenceRow
        title="System Currency"
        description="Controls currency formatting across the platform"
      >
        <InlineSelect
          value={currency}
          onValueChange={setCurrency}
          options={[...currencies]}
        />
      </PreferenceRow>

      {/* Date Format */}
      <PreferenceRow
        title="Date Format"
        description="How dates appear throughout the system"
      >
        <InlineSelect
          value={dateFormat}
          onValueChange={setDateFormat}
          options={dateFormatOptions}
        />
      </PreferenceRow>

      {/* Time Zone */}
      <PreferenceRow
        title="Time Zone"
        description="Used for deadlines, reports, and audit logs"
      >
        <InlineSelect
          value={timeZone}
          onValueChange={setTimeZone}
          options={[...timeZones]}
        />
      </PreferenceRow>

      {/* Default Dashboard per Role */}
      <PreferenceRow
        title="Default Dashboard per Role"
        description="Sets the first screen users see after login"
      >
        <InlineSelect
          value={adminDashboard}
          onValueChange={setAdminDashboard}
          options={viewOptions}
          label="Admin"
        />
        <InlineSelect
          value={staffDashboard}
          onValueChange={setStaffDashboard}
          options={viewOptions}
          label="Staff"
        />
        <InlineSelect
          value={realtorDashboard}
          onValueChange={setRealtorDashboard}
          options={viewOptions}
          label="Realtor"
        />
      </PreferenceRow>
    </div>
  );
}
