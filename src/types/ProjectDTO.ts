import type { CustomerSummaryDTO } from "./CustomerDTO";
import type { FreelancerSummaryDTO, JobSubcategoryDTO } from "./FreelancerDTO";
import type { JobCategoryDTO } from "./JobCategoryDTO";

export const ProjectStatus = {
  OPEN: "OPEN",
  PROPOSALS_RECEIVED: "PROPOSALS_RECEIVED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  NONE: "NONE",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const PaymentType = {
  UPFRONT: "UPFRONT",
  MILESTONE: "MILESTONE",
  UPON_COMPLETION: "UPON_COMPLETION",
  COMMISSION: "COMMISSION",
  NONE: "NONE",
} as const;

export type PaymentType = typeof PaymentType[keyof typeof PaymentType];

export type ProjectRequestDTO = {
  customerId: string;
  freelancerId?: string;
  title?: string;
  description?: string;
  status?: ProjectStatus;
  budget?: string;
  paymentType?: PaymentType;
  deadline?: string; // ISO date string
  categoryId?: number | null;
  subcategoryIds?: number[];
};

export type ProjectResponseDTO = {
  id: string;
  customer: CustomerSummaryDTO;
  freelancer?: FreelancerSummaryDTO;
  title: string;
  description: string;
  status?: ProjectStatus;
  budget?: number;
  paymentType?: PaymentType;
  deadline?: Date;
  category?: JobCategoryDTO;
  subcategories?: JobSubcategoryDTO[];
};
