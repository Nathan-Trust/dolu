"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Upload, AlertCircle } from "lucide-react";

import {
  submitReportSchema,
  type SubmitReportFormValues,
} from "@/schema/reports";
import { StatusBadge } from "@/components/overview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import ReportSubmittedDialog from "./ReportSubmittedDialog";

/* ------------------------------------------------------------------ */
/*  Mock options                                                       */
/* ------------------------------------------------------------------ */

const clientOptions = ["Peter Abbey", "John Ibekwe", "Grace Obi"];
const propertyOptions = [
  "Joy Prime Estate - 1143",
  "Lekki Gardens - 2204",
  "Victoria Court - 3301",
];
const fileTypes = ["Payment Receipt", "Contracts", "Photos", "Other"] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SubmitReportForm() {
  const [showSubmittedDialog, setShowSubmittedDialog] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubmitReportFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(submitReportSchema as any),
    defaultValues: {
      clientsContacted: "",
      inspections: "",
      dealsClosed: "",
      revenueGenerated: "",
      activitiesDescription: "",
      deals: [{ clientName: "", property: "", saleValue: "" }],
      fileType: "Payment Receipt",
    },
  });

  const { fields, append } = useFieldArray({ control, name: "deals" });

  const onSubmit = (data: SubmitReportFormValues) => {
    console.log("report submitted", data);
    setShowSubmittedDialog(true);
  };

  const handleSubmitAnother = () => {
    setShowSubmittedDialog(false);
    reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Weekly Report Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="font-montserrat text-base font-bold text-[#0f0f0f]">
                Weekly Report
              </p>
              <StatusBadge label="Pending" />
              <p className="font-montserrat text-sm font-normal text-[#0f0f0f]">
                Week 02 <span className="font-bold">Jan 8 – Jan 14</span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-[#8a38f5] px-4 py-2 font-montserrat text-sm font-bold text-white hover:bg-[#8a38f5]/90"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
                <Upload className="size-4" />
              </Button>
              <div className="flex items-center gap-1">
                <AlertCircle className="size-3 text-[#ff383c]" />
                <span className="font-montserrat text-xs font-normal text-[#ff383c]">
                  Deadline in less than 1 week
                </span>
              </div>
            </div>
          </div>
          <p className="font-montserrat text-sm font-normal text-[#6f6d6d]">
            Time Remaining{" "}
            <span className="font-bold text-[#0f0f0f]">3 days 22h 32m</span>
          </p>
        </div>

        {/* Activity Summary */}
        <FieldGroup>
          <p className="font-montserrat text-base font-bold text-[#0f0f0f]">
            Activity Summary
          </p>

          <Field>
            <FieldLabel className="font-montserrat text-sm font-normal text-[#0f0f0f]">
              Client Contacted
            </FieldLabel>
            <Input
              type="number"
              placeholder="0"
              className="h-12 rounded-lg border-[#e0e0e0] bg-white px-4 font-montserrat text-sm text-[#0f0f0f]"
              {...register("clientsContacted")}
              aria-invalid={!!errors.clientsContacted}
            />
            {errors.clientsContacted && (
              <FieldError>{errors.clientsContacted.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel className="font-montserrat text-sm font-normal text-[#0f0f0f]">
              Site Inspections Conducted
            </FieldLabel>
            <Input
              type="number"
              placeholder="0"
              className="h-12 rounded-lg border-[#e0e0e0] bg-white px-4 font-montserrat text-sm text-[#0f0f0f]"
              {...register("inspections")}
              aria-invalid={!!errors.inspections}
            />
            {errors.inspections && (
              <FieldError>{errors.inspections.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel className="font-montserrat text-sm font-normal text-[#0f0f0f]">
              Deals Closed
            </FieldLabel>
            <Input
              type="number"
              placeholder="0"
              className="h-12 rounded-lg border-[#e0e0e0] bg-white px-4 font-montserrat text-sm text-[#0f0f0f]"
              {...register("dealsClosed")}
              aria-invalid={!!errors.dealsClosed}
            />
            {errors.dealsClosed && (
              <FieldError>{errors.dealsClosed.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel className="font-montserrat text-sm font-normal text-[#0f0f0f]">
              Revenue Generated
            </FieldLabel>
            <div className="flex items-center gap-1 rounded-lg border border-[#e0e0e0] bg-white px-4">
              <span className="font-montserrat text-sm text-[#6f6d6d]">₦</span>
              <Input
                placeholder="0"
                className="h-12 border-0 bg-transparent px-0 font-montserrat text-sm text-[#0f0f0f] shadow-none focus-visible:ring-0"
                {...register("revenueGenerated")}
                aria-invalid={!!errors.revenueGenerated}
              />
            </div>
            {errors.revenueGenerated && (
              <FieldError>{errors.revenueGenerated.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel className="font-montserrat text-sm font-normal text-[#0f0f0f]">
              Describe your Activities this Week
            </FieldLabel>
            <Textarea
              placeholder="Met with 4 clients and conducted 2 site inspections..."
              rows={4}
              className="resize-none rounded-lg border-[#e0e0e0] bg-white px-4 py-3 font-montserrat text-sm text-[#0f0f0f]"
              {...register("activitiesDescription")}
              aria-invalid={!!errors.activitiesDescription}
            />
            {errors.activitiesDescription && (
              <FieldError>{errors.activitiesDescription.message}</FieldError>
            )}
          </Field>
        </FieldGroup>

        {/* Deals Closed (optional) */}
        <FieldGroup>
          <p className="font-montserrat text-base font-bold text-[#0f0f0f]">
            Deals Closed (optional)
          </p>

          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-4">
              <Field>
                <FieldLabel className="font-montserrat text-sm font-normal text-[#0f0f0f]">
                  Client Name
                </FieldLabel>
                <Controller
                  name={`deals.${index}.clientName`}
                  control={control}
                  render={({ field: f }) => (
                    <Select value={f.value} onValueChange={f.onChange}>
                      <SelectTrigger className="h-12 w-full rounded-lg border-[#e0e0e0] bg-white px-4 font-montserrat text-sm text-[#0f0f0f]">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientOptions.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel className="font-montserrat text-sm font-normal text-[#0f0f0f]">
                  Property
                </FieldLabel>
                <Controller
                  name={`deals.${index}.property`}
                  control={control}
                  render={({ field: f }) => (
                    <Select value={f.value} onValueChange={f.onChange}>
                      <SelectTrigger className="h-12 w-full rounded-lg border-[#e0e0e0] bg-white px-4 font-montserrat text-sm text-[#0f0f0f]">
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyOptions.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel className="font-montserrat text-sm font-normal text-[#0f0f0f]">
                  Sale Value
                </FieldLabel>
                <div className="flex items-center gap-1 rounded-lg border border-[#e0e0e0] bg-white px-4">
                  <span className="font-montserrat text-sm text-[#6f6d6d]">
                    ₦
                  </span>
                  <Input
                    placeholder="0"
                    className="h-12 border-0 bg-transparent px-0 font-montserrat text-sm text-[#0f0f0f] shadow-none focus-visible:ring-0"
                    {...register(`deals.${index}.saleValue`)}
                  />
                </div>
              </Field>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              append({ clientName: "", property: "", saleValue: "" })
            }
            className="flex w-fit items-center gap-1 rounded-lg border border-[#e0e0e0] bg-white px-3 py-1.5 font-montserrat text-sm font-normal text-[#0f0f0f] transition-colors hover:bg-[#f3f3f3]"
          >
            Add another deal
            <Plus className="size-4" />
          </button>
        </FieldGroup>

        {/* Upload Files */}
        <FieldGroup>
          <p className="font-montserrat text-base font-bold text-[#0f0f0f]">
            Upload Files
          </p>

          <Field>
            <FieldLabel className="font-montserrat text-sm font-normal text-[#0f0f0f]">
              File type
            </FieldLabel>
            <div className="flex items-center gap-6">
              {fileTypes.map((type) => (
                <label
                  key={type}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="radio"
                    value={type}
                    {...register("fileType")}
                    className="size-4 accent-[#8a38f5]"
                  />
                  <span className="font-montserrat text-sm text-[#6f6d6d]">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </Field>

          <Field>
            <FieldLabel className="font-montserrat text-sm font-normal text-[#0f0f0f]">
              Upload File
            </FieldLabel>
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#c8c8c8] bg-[#f8f8f8] py-10">
              <Upload className="size-8 text-[#c8c8c8]" />
              <p className="font-montserrat text-sm text-[#6f6d6d]">
                Choose a file or drag & drop it here
              </p>
              <button
                type="button"
                className="rounded-lg border border-[#0f0f0f] px-3 py-1 font-montserrat text-xs font-normal text-[#0f0f0f] transition-colors hover:bg-[#f3f3f3]"
              >
                Browse Files
              </button>
              <p className="font-montserrat text-[10px] text-[#c8c8c8]">
                SUPPORTED FILE TYPES: PNG, JPG, JPEG, PDF, DOCX, XLSX
              </p>
              <p className="font-montserrat text-[10px] text-[#c8c8c8]">
                5MB MAXIMUM
              </p>
            </div>
          </Field>
        </FieldGroup>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between border-t border-[#e0e0e0] pt-4">
          <Button
            type="button"
            className="rounded-lg bg-[#8a38f5] px-6 py-2 font-montserrat text-sm font-bold text-white hover:bg-[#8a38f5]/90"
          >
            Save Draft
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-[#8a38f5] px-6 py-2 font-montserrat text-sm font-bold text-white hover:bg-[#8a38f5]/90"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>

      <ReportSubmittedDialog
        open={showSubmittedDialog}
        onClose={() => setShowSubmittedDialog(false)}
        onSubmitAnother={handleSubmitAnother}
      />
    </>
  );
}
