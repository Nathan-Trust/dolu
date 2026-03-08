import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Address sub-schema                                                 */
/* ------------------------------------------------------------------ */

const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

/* ------------------------------------------------------------------ */
/*  Add Client (comprehensive bio-data form)                           */
/* ------------------------------------------------------------------ */

export const addClientSchema = z.object({
  /* ── Personal ── */
  passportPhoto: z.any().optional(),
  title: z.string().min(1, "Title is required"),
  surname: z.string().min(1, "Surname is required"),
  firstName: z.string().min(1, "First name is required"),
  otherName: z.string().optional(),
  nationality: z.string().min(1, "Nationality is required"),
  maritalStatus: z.string().min(1, "Marital status is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  dateOfBirth: z.string().optional(),
  permanentAddress: addressSchema.optional(),
  residentialAddress: addressSchema.optional(),
  homePhone: z.string().optional(),
  mobilePhone: z.string().min(1, "Mobile phone is required"),

  /* ── Next of Kin ── */
  nextOfKin: z
    .object({
      fullName: z.string().optional(),
      relationship: z.string().optional(),
      address: addressSchema.optional(),
      phone: z.string().optional(),
    })
    .optional(),

  /* ── Current Employer ── */
  employer: z
    .object({
      name: z.string().optional(),
      jobRole: z.string().optional(),
      address: addressSchema.optional(),
      phone: z.string().optional(),
    })
    .optional(),

  /* ── Identification ── */
  meansOfId: z.string().optional(),
  identityCard: z.any().optional(),

  /* ── Step 2: Purchase Details ── */
  purposeOfPurchase: z.array(z.string()).optional(),
  numberOfPlots: z.string().optional(),
  amountOfProperty: z.string().optional(),
  outright: z.string().optional(),
  instalments: z.string().optional(),
  nameOnDocuments: z.string().optional(),
  howDidYouHear: z.string().optional(),

  /* ── Client Bank Details ── */
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
});

export type AddClientFormValues = z.infer<typeof addClientSchema>;
