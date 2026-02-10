"use client";

import { useRef, useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Plus, MapPin, X } from "lucide-react";
import Image from "next/image";

import { addEstateSchema, type AddEstateFormValues } from "@/schema/properties";
import CustomSheet from "@/components/shared/CustomSheetDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface AddEstateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (estate: { name: string; code: string }) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AddEstateSheet({
  open,
  onOpenChange,
  onSuccess,
}: AddEstateSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddEstateFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(addEstateSchema as any),
    defaultValues: {
      estateName: "",
      estateDescription: "",
      city: "",
      state: "",
      country: "",
      longitude: "",
      latitude: "",
      units: [{ nameOfUnit: "", unitType: "", numberAvailable: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "units",
  });

  /* File handling */
  const handleFile = useCallback(
    (file: File) => {
      setValue("coverPhoto", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    },
    [setValue],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const removePhoto = useCallback(() => {
    setValue("coverPhoto", undefined, { shouldValidate: true });
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [setValue]);

  /* Submit */
  const onSubmit = (data: AddEstateFormValues) => {
    console.log("Add estate data:", data);
    const code = crypto.randomUUID().slice(0, 5);
    onSuccess?.({ name: data.estateName, code });
    reset();
    setPreview(null);
    onOpenChange(false);
  };

  return (
    <CustomSheet
      title="Add Estate"
      description="Create a new client record"
      active={open}
      setActive={onOpenChange}
      className="w-full sm:w-3/4 md:w-125 md:min-w-125"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 pb-8 pt-4"
      >
        <FieldGroup>
          {/* ── Estate Name ── */}
          <Field>
            <FieldLabel
              htmlFor="estateName"
              className="font-montserrat text-base font-normal text-[#0f0f0f]"
            >
              Estate Name
            </FieldLabel>
            <Input
              id="estateName"
              placeholder="Joy Valley Hills"
              className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
              {...register("estateName")}
              aria-invalid={!!errors.estateName}
            />
            {errors.estateName && (
              <FieldError>{errors.estateName.message}</FieldError>
            )}
          </Field>

          {/* ── Upload Cover Photo ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Upload Cover Photo
            </FieldLabel>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpg,image/jpeg,image/svg+xml"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />

            {preview ? (
              /* Photo preview */
              <div className="relative h-40 w-full overflow-hidden rounded-lg">
                <Image
                  src={preview}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              /* Drop zone */
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`flex flex-col items-center gap-4 rounded-lg border border-dashed p-4 transition-colors ${
                  isDragging
                    ? "border-[#8a38f5] bg-[#f2d5ff]/20"
                    : "border-[#c8c8c8] bg-[#f3f3f3]"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <ImagePlus className="size-16 text-[#c8c8c8]" />
                  <p className="font-montserrat text-sm font-bold text-[#6f6d6d]">
                    Choose a file or drag &amp; drop it here
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg border border-[#8a38f5] px-2 py-1 font-montserrat text-[9px] font-semibold text-[#6f6d6d]"
                >
                  Browse Files
                </button>
                <div className="flex flex-col items-center gap-1 uppercase">
                  <span className="font-montserrat text-[9px] font-normal text-[#c8c8c8]">
                    Supported file types: PNG, JPG, JPEG, SVG
                  </span>
                  <span className="font-montserrat text-[9px] font-normal text-[#c8c8c8]">
                    2MB Maximum
                  </span>
                </div>
              </div>
            )}

            {errors.coverPhoto && (
              <FieldError>{errors.coverPhoto.message}</FieldError>
            )}
          </Field>

          {/* ── Estate Description ── */}
          <Field>
            <FieldLabel
              htmlFor="estateDescription"
              className="font-montserrat text-base font-normal text-[#0f0f0f]"
            >
              Estate Description
            </FieldLabel>
            <Textarea
              id="estateDescription"
              placeholder="Joy Valley Hills"
              rows={7}
              className="min-h-50 rounded-lg border-0 bg-[#f3f3f3] px-4 py-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
              {...register("estateDescription")}
              aria-invalid={!!errors.estateDescription}
            />
            {errors.estateDescription && (
              <FieldError>{errors.estateDescription.message}</FieldError>
            )}
          </Field>

          {/* ── Location (City, State, Country) ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Location
            </FieldLabel>
            <div className="flex gap-2">
              <div className="flex flex-1 flex-col gap-1">
                <Input
                  placeholder="City"
                  className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                  {...register("city")}
                  aria-invalid={!!errors.city}
                />
                {errors.city && <FieldError>{errors.city.message}</FieldError>}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <Input
                  placeholder="State"
                  className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                  {...register("state")}
                  aria-invalid={!!errors.state}
                />
                {errors.state && (
                  <FieldError>{errors.state.message}</FieldError>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <Input
                  placeholder="Country"
                  className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                  {...register("country")}
                  aria-invalid={!!errors.country}
                />
                {errors.country && (
                  <FieldError>{errors.country.message}</FieldError>
                )}
              </div>
            </div>
          </Field>

          {/* ── Precise Location (Longitude, Latitude + Map) ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Precise Location
            </FieldLabel>
            <div className="flex gap-2">
              <Input
                placeholder="Longitude"
                className="h-12 flex-1 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                {...register("longitude")}
              />
              <Input
                placeholder="Latitude"
                className="h-12 flex-1 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                {...register("latitude")}
              />
            </div>

            {/* Map preview */}
            <div className="relative h-37.5 w-full overflow-hidden rounded-lg bg-white">
              <Image
                src="/cf12a255d3dbcf184c44c0f9f40603bf0e4b97a4.png"
                alt="Map preview"
                fill
                className="object-cover"
              />
              {/* View in Maps button */}
              <div className="absolute bottom-3 right-3 flex flex-col items-center gap-1">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#8a38f5]">
                  <MapPin className="size-5 text-white" />
                </div>
                <div className="rounded bg-[#f8f8f8] px-2 py-0.5 shadow-md">
                  <span className="font-montserrat text-[9px] font-semibold text-[#0f0f0f]">
                    View in Maps
                  </span>
                </div>
              </div>
            </div>
          </Field>

          {/* ── Update Units ── */}
          <Field>
            <FieldLabel className="font-montserrat text-base font-normal text-[#0f0f0f]">
              Update Units
            </FieldLabel>

            <div className="flex flex-col gap-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex flex-1 gap-2">
                    <div className="flex flex-1 flex-col gap-1">
                      <Input
                        placeholder="Name of Unit"
                        className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                        {...register(`units.${index}.nameOfUnit`)}
                        aria-invalid={!!errors.units?.[index]?.nameOfUnit}
                      />
                      {errors.units?.[index]?.nameOfUnit && (
                        <FieldError>
                          {errors.units[index].nameOfUnit.message}
                        </FieldError>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <Input
                        placeholder="Unit Type"
                        className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                        {...register(`units.${index}.unitType`)}
                        aria-invalid={!!errors.units?.[index]?.unitType}
                      />
                      {errors.units?.[index]?.unitType && (
                        <FieldError>
                          {errors.units[index].unitType.message}
                        </FieldError>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <Input
                        placeholder="Number Available"
                        className="h-12 rounded-lg border-0 bg-[#f3f3f3] px-4 font-montserrat text-sm font-bold text-[#0f0f0f] placeholder:font-bold placeholder:text-[#6f6d6d]"
                        {...register(`units.${index}.numberAvailable`)}
                        aria-invalid={!!errors.units?.[index]?.numberAvailable}
                      />
                      {errors.units?.[index]?.numberAvailable && (
                        <FieldError>
                          {errors.units[index].numberAvailable.message}
                        </FieldError>
                      )}
                    </div>
                  </div>

                  {/* Remove button (only for rows beyond the first) */}
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="mt-3 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f3f3f3] text-[#6f6d6d] hover:bg-[#e0e0e0]"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {/* Add Unit button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    append({
                      nameOfUnit: "",
                      unitType: "",
                      numberAvailable: "",
                    })
                  }
                  className="flex flex-col items-center gap-1"
                >
                  <div className="flex size-6 items-center justify-center rounded-full bg-[#f3f3f3]">
                    <Plus className="size-4 text-[#6f6d6d]" />
                  </div>
                  <span className="font-montserrat text-[9px] font-semibold text-[#6f6d6d] opacity-50">
                    Add Unit
                  </span>
                </button>
              </div>
            </div>

            {errors.units?.root && (
              <FieldError>{errors.units.root.message}</FieldError>
            )}
          </Field>

          {/* ── Submit ── */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-31 rounded-lg bg-[#8a38f5] px-1 py-2 font-montserrat text-sm font-bold text-[#f8f8f8] hover:bg-[#8a38f5]/90"
            >
              {isSubmitting ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </CustomSheet>
  );
}
