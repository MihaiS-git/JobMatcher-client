import { PaymentType, ProjectStatus } from "@/types/ProjectDTO";
import { z } from "zod";

const projectSchema = z.object({
  customerId: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  status: z
    .enum(Object.values(ProjectStatus) as [string, ...string[]])
    .optional(),
  budget: z.number().min(0, "Budget must be a positive number"),
  paymentType: z
    .enum(Object.values(PaymentType) as [string, ...string[]])
    .optional(),
  deadline: z.string().refine((dateStr) => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && date > new Date();
  }, "Deadline must be in the future"),
  categoryId: z.number(),
  subcategoryIds: z.array(z.number()),
});

export default projectSchema;
export type ProjectFormValues = z.infer<typeof projectSchema>;
