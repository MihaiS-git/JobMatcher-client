import type { CustomerSummaryDTO } from "./CustomerDTO";
import type { FreelancerSummaryDTO, JobSubcategoryDTO } from "./FreelancerDTO";
import type { JobCategoryDTO } from "./JobCategoryDTO";
import type { ProposalSummaryDTO } from "./ProposalDTO";

export const ProjectStatus = {
  OPEN: "OPEN",
  PROPOSALS_RECEIVED: "PROPOSALS_RECEIVED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  NONE: "NONE",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const JobFeederProjectStatus = {
  OPEN: "OPEN",
  PROPOSALS_RECEIVED: "PROPOSALS_RECEIVED",
  CANCELLED: "CANCELLED",
  NONE: "NONE",
} as const;

export type JobFeederProjectStatus =
  (typeof JobFeederProjectStatus)[keyof typeof JobFeederProjectStatus];

export const PaymentType = {
  UPFRONT: "UPFRONT",
  MILESTONE: "MILESTONE",
  UPON_COMPLETION: "UPON_COMPLETION",
  COMMISSION: "COMMISSION",
  NONE: "NONE",
} as const;

export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

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

export type ProjectSummaryDTO = {
  id: string;
  customerId: string;
  freelancerId?: string;
  title: string;
  description: string;
  status?: ProjectStatus;
  budget?: number;
  paymentType?: PaymentType;
  deadline?: Date;
  category?: JobCategoryDTO;
  subcategories?: JobSubcategoryDTO[];
  createdAt: Date;
  lastUpdate: Date;
};

export type ProjectDetailDTO = {
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
  proposals?: ProposalSummaryDTO[];
  createdAt: Date;
  lastUpdate: Date;
};
