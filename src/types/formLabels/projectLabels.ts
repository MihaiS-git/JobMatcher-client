import type { PaymentType, ProjectStatus } from "../ProjectDTO";

  export const ProjectStatusLabels: Record<ProjectStatus, string> = {
    OPEN: "Open",
    PROPOSALS_RECEIVED: "Proposals received",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    NONE: "None",
  };

  export const ProjectPaymentTypeLabel: Record<PaymentType, string> = {
    UPFRONT: "Upfront",
    MILESTONE: "Milestone",
    UPON_COMPLETION: "Upon Completion",
    COMMISSION: "Commission",
    NONE: "None",
  };