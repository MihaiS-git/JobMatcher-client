import type { PaymentStatus, Priority, ProposalStatus } from "../Proposal";

export const ProposalStatusLabels: Record<ProposalStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
  NONE: "None",
};

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  UNPAID: "Unpaid",
  PAID: "Paid",
  OVERDUE: "Overdue",
  NONE: "None",
};

export const PriorityLabels: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
  NONE: "None",
};