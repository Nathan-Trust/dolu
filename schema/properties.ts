import { z } from "zod";

const unitSchema = z.object({
  nameOfUnit: z.string().min(1, "Unit name is required"),
  unitType: z.string().min(1, "Unit type is required"),
  numberAvailable: z
    .string()
    .min(1, "Number available is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Must be a valid number",
    }),
});

export const addEstateSchema = z.object({
  estateName: z.string().min(1, "Estate name is required"),
  coverPhoto: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 2 * 1024 * 1024,
      "File must be less than 2MB",
    )
    .refine(
      (file) =>
        !file ||
        ["image/png", "image/jpg", "image/jpeg", "image/svg+xml"].includes(
          file.type,
        ),
      "Supported file types: PNG, JPG, JPEG, SVG",
    ),
  estateDescription: z.string().min(1, "Description is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  longitude: z.string().optional(),
  latitude: z.string().optional(),
  units: z.array(unitSchema).min(1, "At least one unit is required"),
});

export type AddEstateFormValues = z.infer<typeof addEstateSchema>;

/* ------------------------------------------------------------------ */
/*  Add Unit schema                                                    */
/* ------------------------------------------------------------------ */

export const addUnitSchema = z.object({
  propertyType: z.string().min(1, "Property type is required"),
  unitType: z.string().min(1, "Unit type is required"),
  media: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) => !files || files.every((f) => f.size <= 5 * 1024 * 1024),
      "Each file must be less than 5MB",
    ),
  unitDetails: z.string().optional(),
  minimumPrice: z
    .string()
    .min(1, "Minimum price is required")
    .refine(
      (val) =>
        !isNaN(Number(val.replace(/,/g, ""))) &&
        Number(val.replace(/,/g, "")) > 0,
      {
        message: "Must be a valid number",
      },
    ),
  maximumPrice: z
    .string()
    .min(1, "Maximum price is required")
    .refine(
      (val) =>
        !isNaN(Number(val.replace(/,/g, ""))) &&
        Number(val.replace(/,/g, "")) > 0,
      {
        message: "Must be a valid number",
      },
    ),
  assignedClient: z.string().optional(),
  agent: z.string().optional(),
});

export type AddUnitFormValues = z.infer<typeof addUnitSchema>;
