import { z } from "zod";

export const addClientSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  assignedTo: z.string().min(1, "Please select a staff member"),
  interestedProperty: z.string().optional(),
  propertyType: z.string().optional(),
  dealValue: z.string().optional(),
  salesStage: z.string().optional(),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

export type AddClientFormValues = z.infer<typeof addClientSchema>;
