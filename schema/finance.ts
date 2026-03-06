import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Add Salary Payment Schema                                          */
/* ------------------------------------------------------------------ */

export const addSalaryPaymentSchema = z.object({
  staffMember: z.string().min(1, "Please select a staff member"),
  month: z.string().min(1, "Month is required"),
  baseSalary: z
    .string()
    .min(1, "Base salary is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Base salary must be a positive number",
    }),
  bonuses: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "Bonuses must be a valid number",
    }),
  deductions: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "Deductions must be a valid number",
    }),
  notes: z.string().optional(),
});

export type AddSalaryPaymentFormValues = z.infer<typeof addSalaryPaymentSchema>;

/* ------------------------------------------------------------------ */
/*  Configure Commissions Schema                                       */
/* ------------------------------------------------------------------ */

export const configureCommissionsSchema = z.object({
  rates: z.array(
    z.object({
      role: z.string().min(1, "Role is required"),
      rate: z
        .string()
        .min(1, "Rate is required")
        .refine(
          (val) => {
            const num = Number(val);
            return !isNaN(num) && num >= 0 && num <= 100;
          },
          {
            message: "Rate must be between 0 and 100",
          },
        ),
    }),
  ),
});

export type ConfigureCommissionsFormValues = z.infer<
  typeof configureCommissionsSchema
>;

/* ------------------------------------------------------------------ */
/*  Add Procurement Schema                                             */
/* ------------------------------------------------------------------ */

export const addProcurementSchema = z.object({
  vendor: z.string().min(1, "Vendor name is required"),
  item: z.string().min(1, "Item is required"),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Quantity must be a positive number",
    }),
  unitPrice: z
    .string()
    .min(1, "Unit price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Unit price must be a positive number",
    }),
  orderDate: z.string().min(1, "Order date is required"),
  expectedDelivery: z.string().min(1, "Expected delivery date is required"),
  notes: z.string().optional(),
});

export type AddProcurementFormValues = z.infer<typeof addProcurementSchema>;
