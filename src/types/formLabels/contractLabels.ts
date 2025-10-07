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
  UPFRONT: "UPFRONT",
  MILESTONE: "MILESTONE",
  UPON_COMPLETION: "UPON_COMPLETION",
  COMMISSION: "COMMISSION",
  NONE: "NONE",
};
