import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Submit Report                                                      */
/* ------------------------------------------------------------------ */

const dealSchema = z.object({
  clientName: z.string().optional(),
  property: z.string().optional(),
  saleValue: z.string().optional(),
});

export const submitReportSchema = z.object({
  clientsContacted: z.string().min(1, "Clients contacted is required"),
  inspections: z.string().min(1, "Inspections count is required"),
  dealsClosed: z.string().min(1, "Deals closed count is required"),
  revenueGenerated: z.string().min(1, "Revenue is required"),
  activitiesDescription: z.string().min(1, "Please describe your activities"),
  deals: z.array(dealSchema).optional(),
  fileType: z.enum(["Payment Receipt", "Contracts", "Photos", "Other"]),
});

export type SubmitReportFormValues = z.infer<typeof submitReportSchema>;

/* ------------------------------------------------------------------ */
/*  View / Filter Reports                                              */
/* ------------------------------------------------------------------ */

export const viewReportsFilterSchema = z.object({
  reportMode: z.enum(["Staff Reports", "Department Reports"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  selectedStaff: z.string().optional(),
  selectedDepartment: z.enum(["Sales", "Finance", "Procurement", "Manager"]),
});

export type ViewReportsFilterValues = z.infer<typeof viewReportsFilterSchema>;
