"use client";

import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import {
  addSalaryPaymentSchema,
  type AddSalaryPaymentFormValues,
} from "@/schema/finance";
import { FinanceService } from "@/services/finance";
import { QueryKeys } from "@/models/query";
import { useInvalidateQueries } from "@/hooks/use-invalidate-query";
import { usePeople } from "@/hooks/usePeople";
import { errorToast, successToast } from "@/util/toast";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface AddStaffSalarySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AddStaffSalarySheet({
  open,
  onOpenChange,
  onSuccess,
}: AddStaffSalarySheetProps) {
  /* Fetch staff members */
  const { data: peopleData } = usePeople();
  const staffMembers = useMemo(() => {
    return (peopleData?.data || []).filter(
      (person) =>
        person.role?.name.toLowerCase() === "staff" ||
        person.role?.name.toLowerCase() === "manager",
    );
  }, [peopleData]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddSalaryPaymentFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(addSalaryPaymentSchema as any),
    defaultValues: {
      staffMember: "",
      month: "",
      baseSalary: "",
      bonuses: "0",
      deductions: "0",
      notes: "",
    },
  });

  /* Watch form values for net salary calculation */
  const baseSalary = watch("baseSalary");
  const bonuses = watch("bonuses");
  const deductions = watch("deductions");

  const netSalary = useMemo(() => {
    const base = parseFloat(baseSalary) || 0;
    const bonus = parseFloat(bonuses || "0") || 0;
    const deduct = parseFloat(deductions || "0") || 0;
    return base + bonus - deduct;
  }, [baseSalary, bonuses, deductions]);

  /* Query invalidation */
  const { invalidateQuery } = useInvalidateQueries();

  /* Mutation: add salary payment */
  const addSalaryMutation = useMutation({
    mutationFn: (payload: {
      staff_member_id: string;
      month: string;
      base_salary: number;
      bonuses?: number;
      deductions?: number;
      notes?: string;
    }) => FinanceService.addSalaryPayment(payload),
    onSuccess: () => {
      invalidateQuery([QueryKeys.Get_People]);
      // Add finance-specific query keys when available
    },
  });

  /* Submit */
  const onSubmit = (data: AddSalaryPaymentFormValues) => {
    addSalaryMutation.mutate(
      {
        staff_member_id: data.staffMember,
        month: data.month,
        base_salary: parseFloat(data.baseSalary),
        bonuses: data.bonuses ? parseFloat(data.bonuses) : 0,
        deductions: data.deductions ? parseFloat(data.deductions) : 0,
        notes: data.notes,
      },
      {
        onSuccess: () => {
          successToast({
            title: "Salary Payment",
            message: "Salary payment added successfully",
          });
          reset();
          onSuccess?.();
          onOpenChange(false);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          errorToast({
            title: "Salary Payment",
            message:
              error?.response?.data?.message || "Failed to add salary payment",
          });
        },
      },
    );
  };

  /* Reset form when closing */
  const handleClose = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  return (
    <CustomSheet
      title="Add Staff Salary Payment"
      description="Add a new salary payment for a staff member"
      active={open}
      setActive={handleClose}
      showTrigger={false}
      className="w-full sm:w-3/4 md:w-125 md:min-w-125"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 pb-8 pt-4"
      >
        <FieldGroup>
          {/* ── Staff Member ── */}
          <Field>
            <FieldLabel
              htmlFor="staffMember"
              className="font-montserrat text-base font-normal text-[#0f0f0f]"
            >
              Staff Member
            </FieldLabel>
            <Controller
              control={control}
              name="staffMember"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f]">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers.map((staff) => (
                      <SelectItem
                        key={staff.id}
                        value={staff.id}
                        className="font-montserrat text-sm"
                      >
                        {staff.first_name} {staff.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.staffMember && (
              <FieldError>{errors.staffMember.message}</FieldError>
            )}
          </Field>

          {/* ── Month ── */}
          <Field>
            <FieldLabel
              htmlFor="month"
              className="font-montserrat text-base font-normal text-[#0f0f0f]"
            >
              Month
            </FieldLabel>
            <Input
              id="month"
              type="month"
              className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f]"
              {...register("month")}
              aria-invalid={!!errors.month}
            />
            {errors.month && <FieldError>{errors.month.message}</FieldError>}
          </Field>

          {/* ── Base Salary ── */}
          <Field>
            <FieldLabel
              htmlFor="baseSalary"
              className="font-montserrat text-base font-normal text-[#0f0f0f]"
            >
              Base Salary (₦)
            </FieldLabel>
            <Input
              id="baseSalary"
              type="number"
              min="0"
              step="1000"
              placeholder="500000"
              className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
              {...register("baseSalary")}
              aria-invalid={!!errors.baseSalary}
            />
            {errors.baseSalary && (
              <FieldError>{errors.baseSalary.message}</FieldError>
            )}
          </Field>

          {/* ── Bonuses ── */}
          <Field>
            <FieldLabel
              htmlFor="bonuses"
              className="font-montserrat text-base font-normal text-[#0f0f0f]"
            >
              Bonuses (₦)
            </FieldLabel>
            <Input
              id="bonuses"
              type="number"
              min="0"
              step="1000"
              placeholder="50000"
              className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
              {...register("bonuses")}
              aria-invalid={!!errors.bonuses}
            />
            {errors.bonuses && (
              <FieldError>{errors.bonuses.message}</FieldError>
            )}
          </Field>

          {/* ── Deductions ── */}
          <Field>
            <FieldLabel
              htmlFor="deductions"
              className="font-montserrat text-base font-normal text-[#0f0f0f]"
            >
              Deductions (₦)
            </FieldLabel>
            <Input
              id="deductions"
              type="number"
              min="0"
              step="1000"
              placeholder="25000"
              className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
              {...register("deductions")}
              aria-invalid={!!errors.deductions}
            />
            {errors.deductions && (
              <FieldError>{errors.deductions.message}</FieldError>
            )}
          </Field>

          {/* ── Net Salary (Calculated) ── */}
          <div className="flex flex-col gap-2 rounded-lg bg-[#f8f8f8] p-4">
            <span className="font-montserrat text-sm font-normal text-[#6f6d6d]">
              Net Salary
            </span>
            <span className="font-montserrat text-lg font-bold text-[#0f0f0f]">
              ₦{netSalary.toLocaleString()}
            </span>
          </div>

          {/* ── Notes ── */}
          <Field>
            <FieldLabel
              htmlFor="notes"
              className="font-montserrat text-base font-normal text-[#0f0f0f]"
            >
              Notes (Optional)
            </FieldLabel>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              rows={4}
              className="rounded-lg border-0 bg-[#f3f3f3] px-4 py-2 font-montserrat text-sm text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d] focus-visible:ring-[#8a38f5]"
              {...register("notes")}
            />
            {errors.notes && <FieldError>{errors.notes.message}</FieldError>}
          </Field>

          {/* ── Submit ── */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={addSalaryMutation.isPending}
              className="rounded-lg bg-[#8a38f5] px-6 py-2.5 font-montserrat text-sm font-bold text-[#f8f8f8] hover:bg-[#8a38f5]/90"
            >
              {addSalaryMutation.isPending ? "Adding..." : "Add Payment"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </CustomSheet>
  );
}
