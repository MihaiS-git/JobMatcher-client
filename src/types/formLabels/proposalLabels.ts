import type { PaymentStatus, Priority, ProposalStatus } from "../ProposalDTO";

export const ProposalStatusLabels: Record<ProposalStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  PAID: "Paid",
  REFUNDED: "Refunded",
  FAILED: "Failed",
};

export const PriorityLabels: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
  NONE: "None",
};