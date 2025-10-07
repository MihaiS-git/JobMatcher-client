import type { PaymentStatus, Priority } from "./ProposalDTO";

export type MilestoneRequestDTO = {
  contractId: string;
  title?: string;
  description?: string;
  amount?: number;
  penaltyAmount?: number;
  bonusAmount?: number;
  estimatedDuration?: number; // in days
  status?: MilestoneStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
  plannedStartDate?: string; // ISO date string
  plannedEndDate?: string; // ISO date string
  actualStartDate?: string; // ISO date string
  actualEndDate?: string; // ISO date string
  priority?: Priority;
};

export type MilestoneResponseDTO = {
  id: string;
  contractId: string;
  title?: string;
  description?: string;
  amount?: number;
  penaltyAmount?: number;
  bonusAmount?: number;
  estimatedDuration?: number; // in days
  status?: MilestoneStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
  plannedStartDate?: string; // ISO date string
  plannedEndDate?: string; // ISO date string
  actualStartDate?: string; // ISO date string
  actualEndDate?: string; // ISO date string
  priority?: Priority;
};

export type MilestoneStatus =
  | "PROPOSED"
  | "APPROVED"
  | "REJECTED"
  | "PENDING"
  | "PROGRESS"
  | "COMPLETED"
  | "CANCELED"
  | "OVERDUE"
  | "NONE";