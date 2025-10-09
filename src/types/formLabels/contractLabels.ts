import type { ContractStatus } from "../ContractDTO";
import type { PaymentType } from "../ProjectDTO";

export const ContractStatusLabels: Record<ContractStatus, string> = {
  ACTIVE: "Active",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  TERMINATED: "Terminated",
  ON_HOLD: "On Hold",
};

export const PaymentTypeLabels: Record<PaymentType, string> = {
  UPFRONT: "Upfront",
  MILESTONE: "Milestone",
  UPON_COMPLETION: "Upon Completion",
  COMMISSION: "Commission",
  NONE: "None",
};
