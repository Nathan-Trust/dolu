"use client";

import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "lucide-react";

import { addClientSchema, type AddClientFormValues } from "@/schema/clients";
import CustomSheet from "@/components/shared/CustomSheetDrawer";
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
import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

/* ------------------------------------------------------------------ */
/*  Mock options                                                       */
/* ------------------------------------------------------------------ */

const staffOptions = [
  {
    name: "John Ibekwe",
    initials: "JI",
    avatarColor: "#8a38f5",
    role: "Staff" as const,
  },
  {
    name: "James Agahowa",
    initials: "JA",
    avatarColor: "#38a5f5",
    role: "Staff" as const,
  },
  {
    name: "David Okoro",
    initials: "DO",
    avatarColor: "#f53838",
    role: "Realtor" as const,
  },
];

const propertyOptions = [
  "2 Plots of land situate at Ajah, Lagos.",
  "3 Bedroom flat at Victoria Island, Lagos.",
  "4 Bedroom duplex at Lekki Phase 1, Lagos.",
  "1 Plot of land at Ibeju-Lekki, Lagos.",
];

const propertyTypeOptions = ["Land", "Flat", "House", "Commercial"];

const salesStageOptions = [
  "Lead",
  "Contacted",
  "Interested",
  "Inspection",
  "Negotiation",
  "Payment",
  "Closed",
];

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface AddClientSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (client: { name: string; code: string }) => void;
}

export default function AddClientSheet({
  open,
  onOpenChange,
  onSuccess,
}: AddClientSheetProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddClientFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(addClientSchema as any),
    defaultValues: {
      clientName: "",
      email: "",
      phone: "",
      assignedTo: "",
      interestedProperty: "",
      propertyType: "",
      dealValue: "",
      salesStage: "",
      followUpDate: "",
      notes: "",
    },
  });

  const assignedToValue = useWatch({ control, name: "assignedTo" });
  const selectedStaff = staffOptions.find((s) => s.name === assignedToValue);

  /* Submit */
  const onSubmit = (data: AddClientFormValues) => {
    console.log("Add client data:", data);
    const code = crypto.randomUUID().slice(0, 5);
    onSuccess?.({ name: data.clientName || "Peter Abbey", code });
    reset();
    onOpenChange(false);
  };

  return (
    <CustomSheet
      title="Add Client"
      description="Create a new client record"
      active={open}
      setActive={onOpenChange}
      showTrigger={false}
      className="w-full sm:w-3/4 md:w-125 md:min-w-125"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 pb-8 pt-4"
      >
        <FieldGroup>
          {/* ── Client Name ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Client Name
            </FieldLabel>
            <Input
              placeholder="Peter Abbey"
              className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
              {...register("clientName")}
              aria-invalid={!!errors.clientName}
            />
            {errors.clientName && (
              <FieldError>{errors.clientName.message}</FieldError>
            )}
          </Field>

          {/* ── Email Address ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Email Address
            </FieldLabel>
            <Input
              type="email"
              placeholder="peterabbey@email.com"
              className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          {/* ── Phone Number ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Phone Number
            </FieldLabel>
            <div className="flex gap-2">
              <div className="flex w-27.25 items-center rounded-lg bg-[#f3f3f3] p-4">
                <span className="font-montserrat text-sm font-bold text-[#6f6d6d]">
                  +234
                </span>
              </div>
              <Input
                type="tel"
                placeholder="0802 123 1234"
                className="h-12 flex-1 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                {...register("phone")}
                aria-invalid={!!errors.phone}
              />
            </div>
            {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
          </Field>

          {/* ── Assigned To ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Assigned To
            </FieldLabel>
            <Controller
              name="assignedTo"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-14 w-full rounded-lg border-0 bg-[#f3f3f3] px-4 shadow-none focus:ring-0">
                    <SelectValue placeholder="Select staff">
                      {selectedStaff && (
                        <div className="flex items-center gap-1">
                          <div
                            className="flex size-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                            style={{
                              backgroundColor: selectedStaff.avatarColor,
                            }}
                          >
                            {selectedStaff.initials}
                          </div>
                          <span className="font-montserrat text-base font-bold text-[#0f0f0f]">
                            {selectedStaff.name}
                          </span>
                          <Badge className="rounded-lg border-0 bg-[#ddf6e2] px-1 py-0.5 font-montserrat text-[9px] font-semibold text-[#34c759]">
                            {selectedStaff.role}
                          </Badge>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {staffOptions.map((staff) => (
                      <SelectItem key={staff.name} value={staff.name}>
                        <div className="flex items-center gap-2">
                          <div
                            className="flex size-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                            style={{ backgroundColor: staff.avatarColor }}
                          >
                            {staff.initials}
                          </div>
                          <span className="font-montserrat text-sm font-bold text-[#0f0f0f]">
                            {staff.name}
                          </span>
                          <Badge className="rounded-lg border-0 bg-[#ddf6e2] px-1 py-0.5 font-montserrat text-[9px] font-semibold text-[#34c759]">
                            {staff.role}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.assignedTo && (
              <FieldError>{errors.assignedTo.message}</FieldError>
            )}
          </Field>

          {/* ── Interested Property ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Interested Property
            </FieldLabel>
            <Controller
              name="interestedProperty"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-14 w-full rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm text-[#0f0f0f] shadow-none focus:ring-0">
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

          {/* ── Property Type ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Property Type
            </FieldLabel>
            <Controller
              name="propertyType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-14 w-full rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm text-[#0f0f0f] shadow-none focus:ring-0">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypeOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          {/* ── Estimated Deal Value ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Estimated Deal Value
            </FieldLabel>
            <div className="flex items-center gap-1 rounded-lg bg-[#f3f3f3] px-4">
              <span className="font-montserrat text-base font-bold text-[#c8c8c8]">
                ₦
              </span>
              <Input
                placeholder="15,000,000"
                className="h-12 border-0 bg-transparent px-0 font-montserrat text-sm text-[#0f0f0f] shadow-none placeholder:text-[#6f6d6d] focus-visible:ring-0"
                {...register("dealValue")}
              />
            </div>
          </Field>

          {/* ── Sales Stage ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Sales Stage
            </FieldLabel>
            <Controller
              name="salesStage"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-14 w-full rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm text-[#0f0f0f] shadow-none focus:ring-0">
                    <SelectValue placeholder="Lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesStageOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          {/* ── Next Follow-Up Date ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Next Follow-Up Date
            </FieldLabel>
            <div className="flex items-center justify-between rounded-lg bg-[#f3f3f3] px-4">
              <Input
                placeholder="Jan 17, 2026"
                className="h-12 border-0 bg-transparent px-0 font-montserrat text-sm text-[#0f0f0f] shadow-none placeholder:text-[#6f6d6d] focus-visible:ring-0"
                {...register("followUpDate")}
              />
              <Calendar className="size-6 text-[#6f6d6d]" />
            </div>
          </Field>

          {/* ── Notes about this Client ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Notes about this Client
            </FieldLabel>
            <Textarea
              placeholder="Jan 17, 2026"
              rows={6}
              className="min-h-40 resize-none rounded-lg border-0 bg-[#f3f3f3] px-4 py-4 font-montserrat text-sm text-[#0f0f0f] placeholder:text-[#6f6d6d]"
              {...register("notes")}
            />
          </Field>

          {/* ── Submit ── */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-31 rounded-lg bg-[#8a38f5] px-1 py-2 font-montserrat text-sm font-bold text-[#f8f8f8] hover:bg-[#8a38f5]/90"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </CustomSheet>
  );
}
