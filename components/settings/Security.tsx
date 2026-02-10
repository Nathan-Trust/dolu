"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
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

const sessionTimeouts = [
  { label: "15 Minutes", value: "15" },
  { label: "30 Minutes", value: "30" },
  { label: "1 Hour", value: "60" },
  { label: "2 Hours", value: "120" },
  { label: "4 Hours", value: "240" },
] as const;

const minLengths = [
  { label: "6 Characters", value: "6" },
  { label: "8 Characters", value: "8" },
  { label: "10 Characters", value: "10" },
  { label: "12 Characters", value: "12" },
  { label: "16 Characters", value: "16" },
] as const;

const expiryDurations = [
  { label: "30 Days", value: "30" },
  { label: "60 Days", value: "60" },
  { label: "90 Days", value: "90" },
  { label: "180 Days", value: "180" },
  { label: "Never", value: "never" },
] as const;

/* ------------------------------------------------------------------ */
/*  Row helpers                                                        */
/* ------------------------------------------------------------------ */

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#e0e0e0] py-4 last:border-b-0 md:flex-row md:items-center md:justify-between md:gap-0">
      <div className="flex flex-col gap-0.5">
        <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
          {title}
        </p>
        {description && (
          <p className="font-montserrat text-xs text-[#6f6d6d]">
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function InlineSelect({
  value,
  onValueChange,
  options,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: readonly { label: string; value: string }[];
}) {
  return (
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
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function Security() {
  /* Toggle states */
  const [forceReset, setForceReset] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);

  /* Select states */
  const [sessionTimeout, setSessionTimeout] = useState("60");

  /* Password policy */
  const [minLength, setMinLength] = useState("8");
  const [expiryDuration, setExpiryDuration] = useState("30");
  const [complexityRequired, setComplexityRequired] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      {/* General security settings */}
      <div className="flex flex-col">
        <SettingRow
          title="Force Password Reset on First Login"
          description="Requires new users to change password immediately"
        >
          <Switch
            checked={forceReset}
            onCheckedChange={setForceReset}
            className="data-[state=checked]:bg-[#34c759]"
          />
        </SettingRow>

        <SettingRow
          title="Password Strength Requirement"
          description="Passwords must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
        >
          <Switch
            checked={passwordStrength}
            onCheckedChange={setPasswordStrength}
            className="data-[state=checked]:bg-[#34c759]"
          />
        </SettingRow>

        <SettingRow
          title="Session Timeout Duration"
          description="Automatically logs users out after inactivity"
        >
          <InlineSelect
            value={sessionTimeout}
            onValueChange={setSessionTimeout}
            options={[...sessionTimeouts]}
          />
        </SettingRow>

        <SettingRow
          title="Two-Factor Authentication (2FA)"
          description="Adds an extra layer of login security"
        >
          <Switch
            checked={twoFactor}
            onCheckedChange={setTwoFactor}
            className="data-[state=checked]:bg-[#34c759]"
          />
        </SettingRow>
      </div>

      {/* Password Policy section */}
      <div className="flex flex-col">
        <p className="mb-2 font-montserrat text-sm font-bold text-[#0f0f0f]">
          Password Policy
        </p>

        <SettingRow title="Minimum Length">
          <InlineSelect
            value={minLength}
            onValueChange={setMinLength}
            options={[...minLengths]}
          />
        </SettingRow>

        <SettingRow title="Password Expiry Duration">
          <InlineSelect
            value={expiryDuration}
            onValueChange={setExpiryDuration}
            options={[...expiryDurations]}
          />
        </SettingRow>

        <SettingRow title="Uppercase, lowercase, number, special character">
          <Switch
            checked={complexityRequired}
            onCheckedChange={setComplexityRequired}
            className="data-[state=checked]:bg-[#34c759]"
          />
        </SettingRow>
      </div>
    </div>
  );
}
