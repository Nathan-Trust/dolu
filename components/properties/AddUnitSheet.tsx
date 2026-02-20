"use client";

import { useRef, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";

import { addUnitSchema, type AddUnitFormValues } from "@/schema/properties";
import { PropertyService } from "@/services/properties";
import { QueryKeys } from "@/models/query";
import { useInvalidateQueries } from "@/hooks/use-invalidate-query";
import { errorToast, successToast } from "@/util/toast";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { type UserRole } from "@/util/status";

/* ------------------------------------------------------------------ */
/*  Select options                                                     */
/* ------------------------------------------------------------------ */

const propertyTypeOptions = [
  { label: "Building", value: "Building" },
  { label: "Land", value: "Land" },
  { label: "Commercial", value: "Commercial" },
];

const unitTypeOptions = [
  { label: "2 Bedroom Duplex", value: "2 Bedroom Duplex" },
  { label: "3 Bedroom Duplex", value: "3 Bedroom Duplex" },
  { label: "4 Bedroom Duplex", value: "4 Bedroom Duplex" },
  { label: "1 Bedroom Flat", value: "1 Bedroom Flat" },
  { label: "2 Bedroom Flat", value: "2 Bedroom Flat" },
  { label: "Penthouse", value: "Penthouse" },
];

const clientOptions = [
  { label: "Nil", value: "Nil" },
  { label: "Peter Abbey", value: "Peter Abbey" },
  { label: "Jane Doe", value: "Jane Doe" },
];

const agentOptions: { label: string; value: string; role: UserRole }[] = [
  { label: "John Ibekwe", value: "John Ibekwe", role: "staff" },
  { label: "Ada Obi", value: "Ada Obi", role: "realtor" },
];

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface AddUnitSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estateName: string;
  estateId?: number | string;
  onSuccess?: (unit: { type: string; estate: string }) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AddUnitSheet({
  open,
  onOpenChange,
  estateName,
  estateId,
  onSuccess,
}: AddUnitSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddUnitFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(addUnitSchema as any),
    defaultValues: {
      propertyType: "",
      unitType: "",
      unitDetails: "",
      minimumPrice: "",
      maximumPrice: "",
      assignedClient: "Nil",
      agent: "",
    },
  });

  /* Media handling */
  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const newFiles = Array.from(files);
      const allFiles = [...mediaFiles, ...newFiles];
      setMediaFiles(allFiles);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) =>
          setMediaPreviews((prev) => [...prev, e.target?.result as string]);
        reader.readAsDataURL(file);
      });
    },
    [mediaFiles],
  );

  const removeMedia = useCallback((index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /* Query invalidation */
  const { invalidateQuery } = useInvalidateQueries();

  /* Mutation: create property/unit via POST /properties + upload images */
  const createUnitMutation = useMutation({
    mutationFn: async (data: AddUnitFormValues) => {
      const res = await PropertyService.createProperty({
        title: data.unitType,
        address: estateName,
        property_type: data.propertyType,
        estate_id: Number(estateId) || 0,
      });

      /* Upload media files if any */
      if (res.data?.id && mediaFiles.length > 0) {
        for (const file of mediaFiles) {
          await PropertyService.uploadPropertyImages(res.data.id, file);
        }
      }

      return res;
    },
    onSuccess: () => {
      invalidateQuery([QueryKeys.Get_Properties]);
      invalidateQuery([QueryKeys.Get_Estates]);
      invalidateQuery([QueryKeys.Get_Estate]);
    },
  });

  /* Submit */
  const onSubmit = (data: AddUnitFormValues) => {
    createUnitMutation.mutate(data, {
      onSuccess: () => {
        successToast({ title: "Unit", message: "Unit added successfully" });
        onSuccess?.({ type: data.unitType, estate: estateName });
        reset();
        setMediaPreviews([]);
        setMediaFiles([]);
        onOpenChange(false);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        errorToast({
          title: "Unit",
          message: error?.response?.data?.message || "Failed to add unit",
        });
      },
    });
  };

  return (
    <CustomSheet
      title={`Add Unit to ${estateName}`}
      description="Create inventory"
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
                  <SelectTrigger className="h-14 w-full rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm text-[#0f0f0f]">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.propertyType && (
              <FieldError>{errors.propertyType.message}</FieldError>
            )}
          </Field>

          {/* ── Unit Type ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Unit Type
            </FieldLabel>
            <Controller
              name="unitType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-14 w-full rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm text-[#0f0f0f]">
                    <SelectValue placeholder="Select unit type" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitTypeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.unitType && (
              <FieldError>{errors.unitType.message}</FieldError>
            )}
          </Field>

          {/* ── Media ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Media
            </FieldLabel>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpg,image/jpeg,image/svg+xml"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {/* Gallery previews */}
            {mediaPreviews.length > 0 && (
              <div className="flex gap-4 overflow-x-auto">
                {mediaPreviews.map((src, i) => (
                  <div
                    key={i}
                    className="relative h-40 w-60 shrink-0 overflow-hidden rounded-lg"
                  >
                    <Image
                      src={src}
                      alt={`Media ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeMedia(i)}
                      className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-fit items-center gap-1 rounded-lg bg-[#e0e0e0] px-1 py-2 font-montserrat text-xs text-[#6f6d6d]"
            >
              Upload Media
              <Upload className="size-4 text-[#6f6d6d]" />
            </button>

            {errors.media && <FieldError>{errors.media.message}</FieldError>}
          </Field>

          {/* ── Unit Details ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Unit Details
            </FieldLabel>
            <Textarea
              id="unitDetails"
              placeholder="Jan 17, 2026"
              rows={6}
              className="min-h-40 rounded-lg border-0 bg-[#f3f3f3] px-4 py-4 font-montserrat text-sm text-[#0f0f0f] placeholder:text-[#0f0f0f]"
              {...register("unitDetails")}
            />
          </Field>

          {/* ── Price Range ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Price Range
            </FieldLabel>
            <div className="flex gap-2">
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-4 rounded-lg bg-[#f3f3f3] px-4">
                  <span className="font-montserrat text-sm text-[#c8c8c8]">
                    Minimum
                  </span>
                  <Input
                    placeholder="15,000,000"
                    className="h-14 border-0 bg-transparent px-0 font-montserrat text-sm text-[#0f0f0f] shadow-none placeholder:text-[#0f0f0f] focus-visible:ring-0"
                    {...register("minimumPrice")}
                    aria-invalid={!!errors.minimumPrice}
                  />
                </div>
                {errors.minimumPrice && (
                  <FieldError>{errors.minimumPrice.message}</FieldError>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-4 rounded-lg bg-[#f3f3f3] px-4">
                  <span className="font-montserrat text-sm text-[#c8c8c8]">
                    Maximum
                  </span>
                  <Input
                    placeholder="20,000,000"
                    className="h-14 border-0 bg-transparent px-0 font-montserrat text-sm text-[#0f0f0f] shadow-none placeholder:text-[#0f0f0f] focus-visible:ring-0"
                    {...register("maximumPrice")}
                    aria-invalid={!!errors.maximumPrice}
                  />
                </div>
                {errors.maximumPrice && (
                  <FieldError>{errors.maximumPrice.message}</FieldError>
                )}
              </div>
            </div>
          </Field>

          {/* ── Assigned Client ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Assigned Client
            </FieldLabel>
            <Controller
              name="assignedClient"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-14 w-full rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm text-[#0f0f0f]">
                    <SelectValue placeholder="Nil" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          {/* ── Agent ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Agent
            </FieldLabel>
            <Controller
              name="agent"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-14 w-full rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm text-[#0f0f0f]">
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agentOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <div className="flex size-6 items-center justify-center rounded-full bg-[#c8c8c8]">
                            <span className="text-[8px] font-bold text-white">
                              {opt.label
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <span className="font-bold">{opt.label}</span>
                          <RoleBadge role={opt.role} />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          {/* ── Submit ── */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={createUnitMutation.isPending}
              className="w-31 rounded-lg bg-[#8a38f5] px-1 py-2 font-montserrat text-sm font-bold text-[#f8f8f8] hover:bg-[#8a38f5]/90"
            >
              {createUnitMutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </CustomSheet>
  );
}
