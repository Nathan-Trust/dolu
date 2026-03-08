"use client";

import { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "lucide-react";

import {
  viewReportsFilterSchema,
  type ViewReportsFilterValues,
} from "@/schema/reports";
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
import DepartmentReportView, {
  type DepartmentType,
} from "./DepartmentReportView";

/* ------------------------------------------------------------------ */
/*  Mock options                                                       */
/* ------------------------------------------------------------------ */

const staffOptions = ["Peter Abbey", "John Ibekwe", "Grace Obi"];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ViewReportsTab() {
  const [generated, setGenerated] = useState(false);
  const [filterSnapshot, setFilterSnapshot] =
    useState<ViewReportsFilterValues | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ViewReportsFilterValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(viewReportsFilterSchema as any),
    defaultValues: {
      reportMode: "Staff Reports",
      startDate: "2026-07-01",
      endDate: "2026-07-01",
      selectedStaff: "",
      selectedDepartment: "Sales",
    },
  });

  const reportMode = useWatch({ control, name: "reportMode" });

  const onSubmit = (data: ViewReportsFilterValues) => {
    setFilterSnapshot(data);
    setGenerated(true);
  };

  if (generated && filterSnapshot) {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setGenerated(false)}
          className="w-fit font-montserrat text-sm text-[#8a38f5] underline"
        >
          ← Back to filters
        </button>
        <DepartmentReportView
          department={
            filterSnapshot.reportMode === "Department Reports"
              ? filterSnapshot.selectedDepartment
              : "Sales"
          }
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGroup>
        {/* Select Report */}
        <Field>
          <FieldLabel className="font-montserrat text-sm font-bold text-[#0f0f0f]">
            Select Report
          </FieldLabel>
          <div className="flex gap-4">
            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg bg-[#f8f8f8] p-3">
              <input
                type="radio"
                value="Staff Reports"
                {...register("reportMode")}
                className="size-4 accent-[#8a38f5]"
              />
              <span className="font-montserrat text-sm text-[#0f0f0f]">
                Staff Reports
              </span>
            </label>
            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg bg-[#f8f8f8] p-3">
              <input
                type="radio"
                value="Department Reports"
                {...register("reportMode")}
                className="size-4 accent-[#8a38f5]"
              />
              <span className="font-montserrat text-sm text-[#0f0f0f]">
                Department Reports
              </span>
            </label>
          </div>
        </Field>

        {/* Date Range */}
        <div className="flex flex-col gap-3">
          <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
            Date Range
          </p>
          <div className="flex gap-4">
            <Field>
              <div className="relative flex-1">
                <Input
                  type="date"
                  className="h-12 w-full rounded-lg border-[#e0e0e0] bg-white px-4 font-montserrat text-sm text-[#0f0f0f]"
                  {...register("startDate")}
                  aria-invalid={!!errors.startDate}
                />
                <Calendar className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#6f6d6d]" />
              </div>
              {errors.startDate && (
                <FieldError>{errors.startDate.message}</FieldError>
              )}
            </Field>
            <Field>
              <div className="relative flex-1">
                <Input
                  type="date"
                  className="h-12 w-full rounded-lg border-[#e0e0e0] bg-white px-4 font-montserrat text-sm text-[#0f0f0f]"
                  {...register("endDate")}
                  aria-invalid={!!errors.endDate}
                />
                <Calendar className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#6f6d6d]" />
              </div>
              {errors.endDate && (
                <FieldError>{errors.endDate.message}</FieldError>
              )}
            </Field>
          </div>
        </div>

        {/* Staff / Department Selector */}
        {reportMode === "Staff Reports" ? (
          <Field>
            <FieldLabel className="font-montserrat text-sm font-bold text-[#0f0f0f]">
              Staff
            </FieldLabel>
            <Controller
              name="selectedStaff"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-12 w-full rounded-lg border-[#e0e0e0] bg-white px-4 font-montserrat text-sm text-[#0f0f0f]">
                    <SelectValue placeholder="Select staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        ) : (
          <Field>
            <FieldLabel className="font-montserrat text-sm font-bold text-[#0f0f0f]">
              Department
            </FieldLabel>
            <Controller
              name="selectedDepartment"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-12 w-full rounded-lg border-[#e0e0e0] bg-white px-4 font-montserrat text-sm text-[#0f0f0f]">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      [
                        "Sales",
                        "Finance",
                        "Procurement",
                        "Manager",
                      ] as DepartmentType[]
                    ).map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        )}
      </FieldGroup>

      {/* Generate Button */}
      <Button
        type="submit"
        className="w-fit rounded-lg bg-[#8a38f5] px-6 py-2 font-montserrat text-sm font-bold text-white hover:bg-[#8a38f5]/90"
      >
        Generate
      </Button>
    </form>
  );
}
