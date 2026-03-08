"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Calendar } from "lucide-react";

import { addClientSchema, type AddClientFormValues } from "@/schema/clients";
import { ClientService } from "@/services/clients";
import { QueryKeys } from "@/models/query";
import { useInvalidateQueries } from "@/hooks/use-invalidate-query";
import CustomSheet from "@/components/shared/CustomSheetDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

/* ------------------------------------------------------------------ */
/*  Select options                                                     */
/* ------------------------------------------------------------------ */

const titleOptions = ["Mr", "Mrs", "Miss", "Dr", "Chief", "Alhaji", "Alhaja"];
const nationalityOptions = ["Nigerian", "Ghanaian", "Other"];
const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
const meansOfIdOptions = [
  "NIN Slip",
  "International Passport",
  "Voter's Card",
  "Driver's License",
];

const purposeOptions = [
  "Residential",
  "Commercial",
  "Buy and Build",
  "Land Banking",
];
const instalmentOptions = ["(0-1 month)", "0-3 Months", "0-6 Months", "Other"];
const howHeardOptions = [
  "Social Media",
  "Radio",
  "Business Representative",
  "Other",
];
const bankOptions = [
  "Zenith Bank",
  "First Bank",
  "GTBank",
  "Access Bank",
  "UBA",
  "Wema Bank",
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function SectionNumber({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-montserrat text-base font-bold text-[#0f0f0f]">
        {number}
      </span>
      <span className="font-montserrat text-base font-bold text-[#0f0f0f]">
        {label}
      </span>
    </div>
  );
}

function SubSectionLabel({ label }: { label: string }) {
  return (
    <p className="font-montserrat text-base font-bold text-[#0f0f0f]">
      {label}
    </p>
  );
}

function FileUploadArea({ label }: { label: string }) {
  return (
    <Field>
      <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
        {label}
      </FieldLabel>
      <div className="flex flex-col items-center gap-2 rounded-lg bg-[#f3f3f3] px-4 py-6">
        <div className="flex flex-col items-center gap-1">
          <div className="size-[72px] rounded-lg bg-[#e8e8e8]" />
          <p className="font-montserrat text-sm text-[#6f6d6d]">
            Choose a file or drag &amp; drop it here
          </p>
        </div>
        <button
          type="button"
          className="rounded border border-[#c8c8c8] px-2 py-0.5 font-montserrat text-[11px] text-[#6f6d6d]"
        >
          Browse Files
        </button>
        <div className="flex flex-col items-center gap-0.5">
          <p className="font-montserrat text-[11px] text-[#6f6d6d]">
            Supported file types: PNG, JPG, JPEG, SVG
          </p>
          <p className="font-montserrat text-[11px] text-[#6f6d6d]">
            2MB Maximum
          </p>
        </div>
      </div>
    </Field>
  );
}

function AddressFields({
  prefix,
  register,
}: {
  prefix: string;
  register: ReturnType<typeof useForm<AddClientFormValues>>["register"];
}) {
  return (
    <div className="flex gap-2">
      <Input
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...register(`${prefix}.street` as any)}
        placeholder="House number and Street"
        className="h-14 flex-1 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
      />
      <Input
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...register(`${prefix}.city` as any)}
        placeholder="City"
        className="h-14 flex-1 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
      />
      <Input
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...register(`${prefix}.state` as any)}
        placeholder="State"
        className="h-14 flex-1 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
      />
    </div>
  );
}

function PhoneField({
  registerField,
  error,
}: {
  registerField: ReturnType<
    ReturnType<typeof useForm<AddClientFormValues>>["register"]
  >;
  error?: string;
}) {
  return (
    <Field>
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
          {...registerField}
        />
      </div>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

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
  const [step, setStep] = useState<1 | 2>(1);

  const {
    register,
    handleSubmit,
    control,
    reset,
    trigger,
    formState: { errors },
  } = useForm<AddClientFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(addClientSchema as any),
    defaultValues: {
      title: "",
      surname: "",
      firstName: "",
      otherName: "",
      nationality: "",
      maritalStatus: "",
      email: "",
      dateOfBirth: "",
      permanentAddress: { street: "", city: "", state: "" },
      residentialAddress: { street: "", city: "", state: "" },
      homePhone: "",
      mobilePhone: "",
      nextOfKin: {
        fullName: "",
        relationship: "",
        address: { street: "", city: "", state: "" },
        phone: "",
      },
      employer: {
        name: "",
        jobRole: "",
        address: { street: "", city: "", state: "" },
        phone: "",
      },
      meansOfId: "",
      purposeOfPurchase: [],
      numberOfPlots: "",
      amountOfProperty: "",
      outright: "",
      instalments: "",
      nameOnDocuments: "",
      howDidYouHear: "",
      bankName: "",
      accountName: "",
      accountNumber: "",
    },
  });

  const { invalidateQuery } = useInvalidateQueries();

  const addClientMutation = useMutation({
    mutationFn: (data: AddClientFormValues) => ClientService.createClient(data),
    onSuccess: () => {
      invalidateQuery([QueryKeys.Get_Clients]);
    },
  });

  const onSubmit = (data: AddClientFormValues) => {
    addClientMutation.mutate(data, {
      onSuccess: () => {
        const name = `${data.surname} ${data.firstName}`.trim() || "Client";
        const code = crypto.randomUUID().slice(0, 5);
        onSuccess?.({ name, code });
        reset();
        setStep(1);
        onOpenChange(false);
      },
    });
  };

  const handleNext = async () => {
    const valid = await trigger([
      "title",
      "surname",
      "firstName",
      "nationality",
      "maritalStatus",
      "email",
      "mobilePhone",
    ]);
    if (valid) setStep(2);
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
        className="flex flex-col gap-6 pb-8 pt-4"
      >
        {step === 1 && (
          <>
            {/* ── Section 1: Bio-data ── */}
            <SectionNumber number="1" label="Bio-data" />

            {/* ── Personal ── */}
            <SubSectionLabel label="Personal" />

            <FieldGroup>
              {/* Passport Photograph */}
              <FileUploadArea label="Upload Passport Photograph" />

              {/* Title */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Title
                </FieldLabel>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-14 w-full rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm text-[#0f0f0f] shadow-none focus:ring-0">
                        <SelectValue placeholder="Select title" />
                      </SelectTrigger>
                      <SelectContent>
                        {titleOptions.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.title && (
                  <FieldError>{errors.title.message}</FieldError>
                )}
              </Field>

              {/* Surname */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Surname
                </FieldLabel>
                <Input
                  placeholder="Peter"
                  className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                  {...register("surname")}
                  aria-invalid={!!errors.surname}
                />
                {errors.surname && (
                  <FieldError>{errors.surname.message}</FieldError>
                )}
              </Field>

              {/* First Name */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  First Name
                </FieldLabel>
                <Input
                  placeholder="Peter"
                  className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                  {...register("firstName")}
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && (
                  <FieldError>{errors.firstName.message}</FieldError>
                )}
              </Field>

              {/* Other Name */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Other Name
                </FieldLabel>
                <Input
                  placeholder="Peter"
                  className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                  {...register("otherName")}
                />
              </Field>

              {/* Nationality */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Nationality
                </FieldLabel>
                <Controller
                  name="nationality"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-14 w-full rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm text-[#0f0f0f] shadow-none focus:ring-0">
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        {nationalityOptions.map((n) => (
                          <SelectItem key={n} value={n}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.nationality && (
                  <FieldError>{errors.nationality.message}</FieldError>
                )}
              </Field>

              {/* Marital Status */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Marital Status
                </FieldLabel>
                <Controller
                  name="maritalStatus"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-14 w-full rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm text-[#0f0f0f] shadow-none focus:ring-0">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {maritalStatusOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.maritalStatus && (
                  <FieldError>{errors.maritalStatus.message}</FieldError>
                )}
              </Field>

              {/* Email Address */}
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
                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </Field>

              {/* Date of Birth */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Date of Birth
                </FieldLabel>
                <div className="flex items-center justify-between rounded-lg bg-[#f3f3f3] px-4">
                  <Input
                    placeholder="dd/mm/yy"
                    className="h-14 border-0 bg-transparent px-0 font-montserrat text-sm text-[#0f0f0f] shadow-none placeholder:text-[#6f6d6d] focus-visible:ring-0"
                    {...register("dateOfBirth")}
                  />
                  <Calendar className="size-6 text-[#6f6d6d]" />
                </div>
              </Field>

              {/* Permanent Address */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Permanent Address
                </FieldLabel>
                <AddressFields prefix="permanentAddress" register={register} />
              </Field>

              {/* Residential Address */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Residential Address
                </FieldLabel>
                <AddressFields
                  prefix="residentialAddress"
                  register={register}
                />
              </Field>

              {/* Home Phone Number */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Home Phone Number
                </FieldLabel>
                <PhoneField registerField={register("homePhone")} />
              </Field>

              {/* Mobile Phone Number */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Mobile Phone Number
                </FieldLabel>
                <PhoneField
                  registerField={register("mobilePhone")}
                  error={errors.mobilePhone?.message}
                />
              </Field>
            </FieldGroup>

            {/* ── Next of Kin ── */}
            <SubSectionLabel label="Next of Kin" />

            <FieldGroup>
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Full Name
                </FieldLabel>
                <Input
                  placeholder="Peter"
                  className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                  {...register("nextOfKin.fullName")}
                />
              </Field>

              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Relationship
                </FieldLabel>
                <Input
                  placeholder="Brother"
                  className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                  {...register("nextOfKin.relationship")}
                />
              </Field>

              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Address
                </FieldLabel>
                <AddressFields prefix="nextOfKin.address" register={register} />
              </Field>

              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Phone number
                </FieldLabel>
                <PhoneField registerField={register("nextOfKin.phone")} />
              </Field>
            </FieldGroup>

            {/* ── Current Employer ── */}
            <SubSectionLabel label="Current Employer" />

            <FieldGroup>
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Name
                </FieldLabel>
                <Input
                  placeholder="Company Name"
                  className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                  {...register("employer.name")}
                />
              </Field>

              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Job Role
                </FieldLabel>
                <Input
                  placeholder="Banker"
                  className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                  {...register("employer.jobRole")}
                />
              </Field>

              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Address
                </FieldLabel>
                <AddressFields prefix="employer.address" register={register} />
              </Field>

              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Phone number
                </FieldLabel>
                <PhoneField registerField={register("employer.phone")} />
              </Field>
            </FieldGroup>

            {/* ── Identification ── */}
            <SubSectionLabel label="Identification" />

            <FieldGroup>
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Means of Identification
                </FieldLabel>
                <Controller
                  name="meansOfId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-14 w-full rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm text-[#0f0f0f] shadow-none focus:ring-0">
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        {meansOfIdOptions.map((id) => (
                          <SelectItem key={id} value={id}>
                            {id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              {/* Upload Identity Card */}
              <FileUploadArea label="Upload Identity Card" />
            </FieldGroup>

            {/* ── Step 1 Actions ── */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                onClick={() => {
                  reset();
                  setStep(1);
                  onOpenChange(false);
                }}
                className="w-31 rounded-lg bg-[#0f0f0f] font-montserrat text-sm font-bold text-[#f8f8f8] hover:bg-[#0f0f0f]/90"
              >
                Main
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                className="w-31 rounded-lg bg-[#8a38f5] px-1 py-2 font-montserrat text-sm font-bold text-[#f8f8f8] hover:bg-[#8a38f5]/90"
              >
                Next
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {/* ── Section 2: Purchase Details ── */}
            <SectionNumber number="2" label="Purchase Details" />

            <FieldGroup>
              {/* Purpose of Purchase */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-bold text-[#0f0f0f]">
                  Purpose of Purchase (Please tick appropriately)
                </FieldLabel>
                <Controller
                  name="purposeOfPurchase"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-4">
                      {purposeOptions.map((opt) => {
                        const checked = (field.value ?? []).includes(opt);
                        return (
                          <label
                            key={opt}
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(c) => {
                                const current = field.value ?? [];
                                field.onChange(
                                  c
                                    ? [...current, opt]
                                    : current.filter((v: string) => v !== opt),
                                );
                              }}
                              className="size-5 rounded border-[#c8c8c8] data-[state=checked]:border-[#8a38f5] data-[state=checked]:bg-[#8a38f5]"
                            />
                            <span className="font-montserrat text-sm text-[#0f0f0f]">
                              {opt}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                />
              </Field>

              {/* Number of Plots + Amount of Property */}
              <div className="flex gap-4">
                <Field className="flex-1">
                  <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                    Number of Plots
                  </FieldLabel>
                  <Input
                    placeholder="4"
                    className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                    {...register("numberOfPlots")}
                  />
                </Field>
                <Field className="flex-1">
                  <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                    Amount of Property
                  </FieldLabel>
                  <div className="flex items-center gap-1 rounded-lg bg-[#f3f3f3] px-4">
                    <span className="font-montserrat text-base font-bold text-[#c8c8c8]">
                      ₦
                    </span>
                    <Input
                      placeholder="15,000,000"
                      className="h-12 border-0 bg-transparent px-0 font-montserrat text-sm text-[#0f0f0f] shadow-none placeholder:text-[#6f6d6d] focus-visible:ring-0"
                      {...register("amountOfProperty")}
                    />
                  </div>
                </Field>
              </div>

              {/* Outright */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-bold text-[#0f0f0f]">
                  Outright (Please tick appropriately)
                </FieldLabel>
                <Controller
                  name="outright"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="outright"
                          value="Immediate (0-1 month)"
                          checked={field.value === "Immediate (0-1 month)"}
                          onChange={field.onChange}
                          className="size-4 accent-[#8a38f5]"
                        />
                        <span className="font-montserrat text-sm text-[#0f0f0f]">
                          Immediate (0-1 month)
                        </span>
                      </label>
                    </div>
                  )}
                />
              </Field>

              {/* Instalments */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Instalments
                </FieldLabel>
                <Controller
                  name="instalments"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap items-center gap-4">
                      {instalmentOptions.map((opt) => (
                        <label
                          key={opt}
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <input
                            type="radio"
                            name="instalments"
                            value={opt}
                            checked={field.value === opt}
                            onChange={field.onChange}
                            className="size-4 accent-[#8a38f5]"
                          />
                          <span className="font-montserrat text-sm text-[#0f0f0f]">
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                />
              </Field>

              {/* Name to be written on Documents */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Name to be written on Documents
                </FieldLabel>
                <Input
                  placeholder="Enter Name"
                  className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                  {...register("nameOnDocuments")}
                />
              </Field>

              {/* How did you Hear about Us? */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  How did you Hear about Us?
                </FieldLabel>
                <Controller
                  name="howDidYouHear"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap items-center gap-4">
                      {howHeardOptions.map((opt) => (
                        <label
                          key={opt}
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <input
                            type="radio"
                            name="howDidYouHear"
                            value={opt}
                            checked={field.value === opt}
                            onChange={field.onChange}
                            className="size-4 accent-[#8a38f5]"
                          />
                          <span className="font-montserrat text-sm text-[#0f0f0f]">
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                />
              </Field>
            </FieldGroup>

            {/* ── Client Bank Details ── */}
            <SubSectionLabel label="Client Bank Details" />

            <FieldGroup>
              {/* Bank Name */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Bank Name
                </FieldLabel>
                <Controller
                  name="bankName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-14 w-full rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm text-[#0f0f0f] shadow-none focus:ring-0">
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {bankOptions.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              {/* Account Name */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Account Name
                </FieldLabel>
                <Input
                  placeholder="Enter Account Name"
                  className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                  {...register("accountName")}
                />
              </Field>

              {/* Account Number */}
              <Field>
                <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
                  Account Number
                </FieldLabel>
                <Input
                  placeholder="Enter Account Number"
                  className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                  {...register("accountNumber")}
                />
              </Field>
            </FieldGroup>

            {/* ── Step 2 Actions ── */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="w-31 rounded-lg border-[#8a38f5] font-montserrat text-sm font-bold text-[#8a38f5]"
              >
                Prev
              </Button>
              <Button
                type="submit"
                disabled={addClientMutation.isPending}
                className="w-31 rounded-lg bg-[#8a38f5] px-1 py-2 font-montserrat text-sm font-bold text-[#f8f8f8] hover:bg-[#8a38f5]/90"
              >
                {addClientMutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </>
        )}
      </form>
    </CustomSheet>
  );
}
