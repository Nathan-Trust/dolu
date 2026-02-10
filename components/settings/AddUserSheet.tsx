"use client";

import { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Check } from "lucide-react";

import { addUserSchema, type AddUserFormValues } from "@/schema/settings";
import CustomSheet from "@/components/shared/CustomSheetDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleBadge } from "@/components/shared/RoleBadge";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { type UserRole } from "@/util/status";

/* ------------------------------------------------------------------ */
/*  Password generator                                                 */
/* ------------------------------------------------------------------ */

function generateTempPassword(role: string): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `@${role}2026${suffix}`;
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface AddUserSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (user: { name: string; email: string; role: UserRole }) => void;
}

/* ------------------------------------------------------------------ */
/*  Role options                                                       */
/* ------------------------------------------------------------------ */

const roleOptions: { label: string; value: UserRole }[] = [
  { label: "Chairman", value: "chairman" },
  { label: "Admin", value: "admin" },
  { label: "Staff", value: "staff" },
  { label: "Realtor", value: "realtor" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AddUserSheet({
  open,
  onOpenChange,
  onSuccess,
}: AddUserSheetProps) {
  const [tempPassword, setTempPassword] = useState(() =>
    generateTempPassword("staff"),
  );
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddUserFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(addUserSchema as any),
    defaultValues: {
      fullName: "",
      email: "",
      role: undefined,
    },
  });

  /* Regenerate password when role changes */
  const handleRoleChange = useCallback(
    (value: string, onChange: (v: string) => void) => {
      onChange(value);
      setTempPassword(generateTempPassword(value));
      setCopied(false);
    },
    [],
  );

  /* Copy to clipboard */
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [tempPassword]);

  /* Submit */
  const onSubmit = (data: AddUserFormValues) => {
    console.log("Add user data:", data, "temp password:", tempPassword);
    onSuccess?.({
      name: data.fullName,
      email: data.email,
      role: data.role as UserRole,
    });
    reset();
    setTempPassword(generateTempPassword("staff"));
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <CustomSheet
      title="Add New User"
      description="Add a new user to the platform"
      active={open}
      setActive={onOpenChange}
      className="w-full sm:w-3/4 md:w-125 md:min-w-125"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 pb-8 pt-4"
      >
        <FieldGroup>
          {/* ── Full Name ── */}
          <Field>
            <FieldLabel
              htmlFor="fullName"
              className="font-montserrat text-base font-normal text-[#0f0f0f]"
            >
              Full Name
            </FieldLabel>
            <Input
              id="fullName"
              placeholder="John Ibekwe"
              className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
              {...register("fullName")}
              aria-invalid={!!errors.fullName}
            />
            {errors.fullName && (
              <FieldError>{errors.fullName.message}</FieldError>
            )}
          </Field>

          {/* ── Email Address ── */}
          <Field>
            <FieldLabel
              htmlFor="email"
              className="font-montserrat text-base font-normal text-[#0f0f0f]"
            >
              Email Address
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="peterabbey@email.com"
              className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          {/* ── Role ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Role
            </FieldLabel>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(v) => handleRoleChange(v, field.onChange)}
                >
                  <SelectTrigger className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f]">
                    <SelectValue placeholder="Select a role">
                      {field.value && (
                        <RoleBadge role={field.value as UserRole} />
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((opt) => (
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
              )}
            />
            {errors.role && <FieldError>{errors.role.message}</FieldError>}
          </Field>

          {/* ── Temporary Password (Auto-generated) ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Temporary Password (Auto-generated)
            </FieldLabel>
            <div className="relative">
              <Input
                readOnly
                value={tempPassword}
                className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 pr-12 font-montserrat text-sm font-bold text-[#0f0f0f]"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6f6d6d] transition-colors hover:text-[#0f0f0f]"
                aria-label="Copy password"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-[#34c759]" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </Field>

          {/* ── Submit ── */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[#8a38f5] px-6 py-2.5 font-montserrat text-sm font-bold text-[#f8f8f8] hover:bg-[#8a38f5]/90"
            >
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </CustomSheet>
  );
}
