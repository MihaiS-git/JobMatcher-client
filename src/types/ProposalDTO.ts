import type { FreelancerSummaryDTO } from "./FreelancerDTO";

export const ProposalStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN",
  NONE: "NONE",
} as const;

export type ProposalStatus =
  (typeof ProposalStatus)[keyof typeof ProposalStatus];

export const PaymentStatus = {
  NOT_APPLICABLE: "NOT_APPLICABLE",
  NOT_STARTED: "NOT_STARTED",
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  PAID: "PAID",
  PARTIALLY_PAID: "PARTIALLY_PAID",
  OVERDUE: "OVERDUE",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const Priority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
  NONE: "NONE",
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];

export type ProposalRequestDTO = {
  projectId: string;
  freelancerId: string;
  coverLetter?: string;
  amount?: string;
  penaltyAmount?: string;
  bonusAmount?: string;
  estimatedDuration?: number; // in days
  status?: ProposalStatus;
  notes?: string;
  plannedStartDate?: string; // ISO date string
  plannedEndDate?: string; // ISO date string
  actualStartDate?: string; // ISO date string
  actualEndDate?: string; // ISO date string
  priority?: Priority;
};

export type ProposalDetailDTO = {
  id: string;
  projectId: string;
  freelancer: FreelancerSummaryDTO;
  coverLetter: string;
  amount: number;
  penaltyAmount: number;
  bonusAmount: number;
  estimatedDuration: number; // in days
  status: ProposalStatus;
  notes: string;
  plannedStartDate: string; // ISO date string
  plannedEndDate: string; // ISO date string
  actualStartDate: string;
  actualEndDate: string;
  priority: Priority;
  createdAt: string; // ISO date string
  lastUpdate: string; // ISO date string
};

export type ProposalSummaryDTO = {
  id: string;
  projectId: string;
  freelancer: FreelancerSummaryDTO;
  coverLetter: string;
  amount: number;
  penaltyAmount: number;
  bonusAmount: number;
  estimatedDuration: number; // in days
  status: ProposalStatus;
  notes: string;
  plannedStartDate: string; // ISO date string
  plannedEndDate: string; // ISO date string
  actualStartDate: string;
  actualEndDate: string;
  priority: Priority;
  createdAt: string; // ISO date string
  lastUpdate: string; // ISO date string
};
