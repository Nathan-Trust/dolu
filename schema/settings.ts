import { z } from "zod";

const validRoles = ["chairman", "admin", "staff", "realtor"] as const;

export const addUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  role: z
    .string()
    .min(1, "Role is required")
    .refine((v) => validRoles.includes(v as (typeof validRoles)[number]), {
      message: "Invalid role",
    }),
});

export type AddUserFormValues = z.infer<typeof addUserSchema>;
