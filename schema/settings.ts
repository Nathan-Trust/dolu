import { z } from "zod";

export const addUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
});

export type AddUserFormValues = z.infer<typeof addUserSchema>;
