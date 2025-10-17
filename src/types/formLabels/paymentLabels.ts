import type { PaymentStatus } from "../ProposalDTO";

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  NOT_APPLICABLE: "Not Applicable",
  NOT_STARTED: "Not Started",
  PENDING: "Pending",
  PROCESSING: "Processing",
  PAID: "Paid",
  PARTIALLY_PAID: "Partially Paid",
  OVERDUE: "Overdue",
  REFUNDED: "Refunded",
};
