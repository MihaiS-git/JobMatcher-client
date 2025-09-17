import FeedbackMessage from "@/components/FeedbackMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGetFreelancerByUserIdQuery } from "@/features/profile/freelancerApi";
import {
  useCreateProposalMutation,
  useGetProposalByIdQuery,
  useUpdateProposalByIdMutation,
} from "@/features/proposal/proposalApi";
import useAuth from "@/hooks/useAuth";
import useAutoClear from "@/hooks/useAutoClear";
import type { ProposalFormValues } from "@/schemas/proposalSchema";
import {
  PaymentStatus,
  Priority,
  ProposalStatus,
  type ProposalRequestDTO,
} from "@/types/ProposalDTO";
import { parseValidationErrors } from "@/utils/parseApiError";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import InputErrorMessage from "../InputErrorMessage";
import SubmitButton from "@/components/SubmitButton";
import type { Role } from "@/types/UserDTO";
import {
  PaymentStatusLabels,
  PriorityLabels,
  ProposalStatusLabels,
} from "@/types/formLabels/proposalLabels";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { Link } from "react-router-dom";

type ProposalProps = {
  proposalId?: string;
  projectId?: string;
};

const EditableFieldsByRole: Record<Role, (keyof ProposalFormValues)[]> = {
  STAFF: [
    "coverLetter",
    "amount",
    "estimatedDuration",
    "notes",
    "plannedStartDate",
  ],
  CUSTOMER: [
    "penaltyAmount",
    "bonusAmount",
    "notes",
    "plannedStartDate",
    "actualStartDate",
    "priority",
  ],
  ADMIN: [],
};

const UpsertProposalForm = ({ projectId, proposalId }: ProposalProps) => {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const {
    data: existingProposal,
    isLoading: isLoadingProposal,
    error: existingProposalError,
  } = useGetProposalByIdQuery(proposalId!, {
    skip: !proposalId,
  });

  useEffect(() => {
    if (!isLoadingProposal && existingProposalError) {
      setApiError("Failed to load proposal data.");
    }
  }, [isLoadingProposal, existingProposalError]);

  const auth = useAuth();
  const userId = auth.user?.id;
  const role = auth.user?.role as Role;

  const {
    data: freelancer,
    isLoading: isLoadingFreelancer,
    error: freelancerError,
  } = useGetFreelancerByUserIdQuery(userId);

  useEffect(() => {
    if (!isLoadingFreelancer && freelancerError) {
      setApiError("Failed to load freelancer data.");
    }
  }, [isLoadingFreelancer, freelancerError]);

  const [createProposal, { isLoading: isCreating }] =
    useCreateProposalMutation();
  const [updateProposal, { isLoading: isUpdating }] =
    useUpdateProposalByIdMutation();

  const defaultValues = useMemo<ProposalFormValues>(
    () => ({
      projectId: existingProposal?.project.id ?? projectId ?? "",
      freelancerId: freelancer?.profileId ?? "",
      coverLetter: "",
      amount: "0",
      penaltyAmount: "0",
      bonusAmount: "0",
      estimatedDuration: 0,
      status: ProposalStatus.PENDING,
      paymentStatus: PaymentStatus.NONE,
      notes: "",
      plannedStartDate: "",
      plannedEndDate: "",
      actualStartDate: "",
      actualEndDate: "",
      priority: Priority.NONE,
    }),
    [existingProposal?.project.id, freelancer?.profileId, projectId]
  );

  
  console.log("Project ID:", defaultValues.projectId);
  

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<ProposalFormValues>({ defaultValues });

  useEffect(() => {
    if (freelancer?.profileId) {
      reset((prev) => ({ ...prev, freelancerId: freelancer.profileId }));
    }
  }, [freelancer, reset]);

  useEffect(() => {
    if (existingProposal) {
      reset({
        projectId: existingProposal.project.id ?? projectId,
        freelancerId: existingProposal?.freelancer.profileId ?? "",
        coverLetter: existingProposal.coverLetter ?? "",
        amount: existingProposal.amount.toString() ?? "0",
        penaltyAmount: existingProposal.penaltyAmount.toString() ?? "0",
        bonusAmount: existingProposal.bonusAmount.toString() ?? "0",
        estimatedDuration: existingProposal.estimatedDuration ?? 0,
        status: existingProposal.status ?? ProposalStatus.PENDING,
        paymentStatus: existingProposal.paymentStatus ?? PaymentStatus.NONE,
        notes: existingProposal.notes ?? "",
        plannedStartDate: existingProposal.plannedStartDate ?? "",
        plannedEndDate: existingProposal.plannedEndDate ?? "",
        actualStartDate: existingProposal.actualStartDate ?? "",
        actualEndDate: existingProposal.actualEndDate ?? "",
        priority: existingProposal.priority ?? Priority.NONE,
      });
    }
  }, [existingProposal, projectId, reset]);

  let buttonText;
  if (proposalId) {
    buttonText = isUpdating ? "Updating..." : "Update";
  } else {
    buttonText = isCreating ? "Saving..." : "Save";
  }

  function handleValidationApiError(
    err: unknown,
    setValidationErrors: React.Dispatch<
      React.SetStateAction<Record<string, string> | null>
    >,
    setApiError: React.Dispatch<React.SetStateAction<string>>,
    apiError?: string
  ) {
    const errorResult = parseValidationErrors(err);
    if (errorResult.validationErrors) {
      setValidationErrors(errorResult.validationErrors);
      setApiError(apiError || "Validation error");
    } else {
      setApiError(errorResult.message);
      setValidationErrors(null);
    }
    return;
  }

  useAutoClear(successMessage, setSuccessMessage);
  useAutoClear(apiError, setApiError);
  useAutoClear(validationErrors, () => setValidationErrors(null));

  const clearFieldError = (fieldName: keyof ProposalFormValues) => {
    clearErrors(fieldName);
    setValidationErrors((prev) => {
      if (!prev) return null;
      const updated = { ...prev };
      delete updated[fieldName];
      return Object.keys(updated).length ? updated : null;
    });
  };

  const onSubmit = async (data: ProposalFormValues) => {
    if (!data) return;
    const payload: ProposalRequestDTO = {
      ...data,
      status: data.status as ProposalStatus,
      paymentStatus: data.paymentStatus as PaymentStatus,
      plannedStartDate: data.plannedStartDate
        ? new Date(data.plannedStartDate).toISOString().slice(0, 10)
        : undefined,
      plannedEndDate: data.plannedEndDate
        ? new Date(data.plannedEndDate).toISOString().slice(0, 10)
        : undefined,
      actualStartDate: data.actualStartDate
        ? new Date(data.actualStartDate).toISOString().slice(0, 10)
        : undefined,
      actualEndDate: data.actualEndDate
        ? new Date(data.actualEndDate).toISOString().slice(0, 10)
        : undefined,
      priority: data.priority as Priority,
    };

    if (proposalId) {
      try {
        await updateProposal({
          id: proposalId,
          updatedProposal: payload,
        }).unwrap();
        setSuccessMessage("Proposal updated successfully.");
        setApiError("");
        setValidationErrors(null);
        reset(defaultValues);
      } catch (err: unknown) {
        handleValidationApiError(err, setValidationErrors, setApiError);
      }
    } else {
      try {
        await createProposal(payload).unwrap();
        setSuccessMessage("Proposal created successfully.");
        setApiError("");
        setValidationErrors(null);
        reset(defaultValues);
      } catch (err: unknown) {
        handleValidationApiError(err, setValidationErrors, setApiError);
      }
    }
  };

  const editableFields = EditableFieldsByRole[role];

  if (isLoadingProposal || isLoadingFreelancer) {
    return <LoadingSpinner fullScreen={true} size={36} />;
  }

  function handleProposalAction(action: "accept" | "reject") {
    if (!existingProposal) return;

    const updatedProposal = {
      status:
        action === "accept" ? ProposalStatus.ACCEPTED : ProposalStatus.REJECTED,
    };

    updateProposal({ id: existingProposal.id, updatedProposal })
      .unwrap()
      .then(() => {
        setSuccessMessage(`Proposal ${action}ed successfully.`);
        setApiError("");
        setValidationErrors(null);
        reset(defaultValues);
      })
      .catch((err: unknown) => {
        handleValidationApiError(err, setValidationErrors, setApiError);
      });
  }

  return (
    <>
      {existingProposalError ? (
        <FeedbackMessage
          id="existing-proposal-error"
          message={apiError}
          type="error"
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-40">
          <fieldset
            className="flex flex-col items-center mt-4 space-y-4"
            disabled={isUpdating}
          >
            {successMessage && (
              <FeedbackMessage
                id="success-message"
                message={successMessage}
                type="success"
              />
            )}
            {apiError && (
              <FeedbackMessage id="api-error" message={apiError} type="error" />
            )}
          </fieldset>

          {existingProposal && (
            <div className="flex flex-col items-center w-full my-2 px-2 xl:px-16">
              <p className="text-center">
                <b>Proposal ID: <br /></b> {existingProposal.id}
              </p>
              <p className="text-center">
                <b>Submitted by:</b> <Link to={`/profile/${existingProposal?.freelancer.profileId}`}>{existingProposal?.freelancer.username}</Link>
              </p>
              <p className="text-center">
                <b>For Project: <br /></b> {existingProposal?.project.title}
              </p>
            </div>
          )}

          {editableFields.includes("coverLetter") ? (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <label
                htmlFor="coverLetter"
                className="font-semibold text-sm xl:text-base"
              >
                Cover Letter
              </label>
              <textarea
                id="coverLetter"
                {...register("coverLetter", {
                  onChange: () => clearFieldError("coverLetter"),
                })}
                className="bg-gray-200 text-gray-950 py-2 px-4 w-80 h-40 rounded-sm border border-gray-950 text-sm xl:text-base resize-y"
                aria-invalid={!!errors.coverLetter}
                aria-describedby={
                  errors.coverLetter ? "coverLetter-error" : undefined
                }
              />
              {(errors.coverLetter || validationErrors?.coverLetter) && (
                <InputErrorMessage
                  message={
                    (typeof errors.coverLetter?.message === "string"
                      ? errors.coverLetter?.message
                      : undefined) ?? validationErrors?.coverLetter
                  }
                  label="coverLetter"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <p>
                <b>Cover Letter:</b>
              </p>
              <p>
                {existingProposal?.coverLetter ?? "No cover letter provided."}
              </p>
            </div>
          )}

          {editableFields.includes("amount") ? (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <label
                htmlFor="amount"
                className="font-semibold text-sm xl:text-base"
              >
                Amount
              </label>
              <input
                id="amount"
                type="text"
                {...register("amount", {
                  required: "Amount is required",
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message:
                      "Amount must be a valid number with up to 2 decimal places",
                  },
                  onChange: () => clearFieldError("amount"),
                })}
                className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
                aria-invalid={!!errors.amount}
                aria-describedby={errors.amount ? "amount-error" : undefined}
              />
              {(errors.amount?.message || validationErrors?.amount) && (
                <InputErrorMessage
                  message={errors.amount?.message ?? validationErrors?.amount}
                  label="amount"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <p>
                <b>Amount:</b>{" "}
                {existingProposal?.amount
                  ? formatCurrency(existingProposal.amount)
                  : "N/A"}
              </p>
            </div>
          )}

          {editableFields.includes("penaltyAmount") ? (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <label
                htmlFor="penaltyAmount"
                className="font-semibold text-sm xl:text-base"
              >
                Penalty Amount
              </label>
              <input
                id="penaltyAmount"
                type="text"
                {...register("penaltyAmount", {
                  required: "Penalty Amount is required",
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message:
                      "Penalty Amount must be a valid number with up to 2 decimal places",
                  },
                  onChange: () => clearFieldError("penaltyAmount"),
                })}
                className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
                aria-invalid={!!errors.penaltyAmount}
                aria-describedby={
                  errors.penaltyAmount ? "penaltyAmount-error" : undefined
                }
              />
              {(errors.penaltyAmount?.message ||
                validationErrors?.penaltyAmount) && (
                <InputErrorMessage
                  message={
                    errors.penaltyAmount?.message ??
                    validationErrors?.penaltyAmount
                  }
                  label="penaltyAmount"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <p>
                <b>Penalty Amount:</b>{" "}
                {existingProposal?.penaltyAmount
                  ? formatCurrency(existingProposal.penaltyAmount)
                  : "N/A"}
              </p>
            </div>
          )}

          {editableFields.includes("bonusAmount") ? (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <label
                htmlFor="bonusAmount"
                className="font-semibold text-sm xl:text-base"
              >
                Bonus Amount
              </label>
              <input
                id="bonusAmount"
                type="text"
                {...register("bonusAmount", {
                  required: "Bonus Amount is required",
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message:
                      "Bonus Amount must be a valid number with up to 2 decimal places",
                  },
                  onChange: () => clearFieldError("bonusAmount"),
                })}
                className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
                aria-invalid={!!errors.bonusAmount}
                aria-describedby={
                  errors.bonusAmount ? "bonusAmount-error" : undefined
                }
              />
              {(errors.bonusAmount?.message ||
                validationErrors?.bonusAmount) && (
                <InputErrorMessage
                  message={
                    errors.bonusAmount?.message ?? validationErrors?.bonusAmount
                  }
                  label="bonusAmount"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <p>
                <b>Bonus Amount:</b>{" "}
                {existingProposal?.bonusAmount
                  ? formatCurrency(existingProposal.bonusAmount)
                  : "N/A"}
              </p>
            </div>
          )}

          {editableFields.includes("estimatedDuration") ? (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <label
                htmlFor="estimatedDuration"
                className="font-semibold text-sm xl:text-base"
              >
                Estimated Duration (in days)
              </label>
              <input
                id="estimatedDuration"
                type="number"
                {...register("estimatedDuration", {
                  required: "Estimated Duration is required",
                  min: {
                    value: 0,
                    message: "Estimated Duration cannot be negative",
                  },
                  onChange: () => clearFieldError("estimatedDuration"),
                  valueAsNumber: true, // important: ensures RHF gives a number
                })}
                className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
                aria-invalid={!!errors.estimatedDuration}
                aria-describedby={
                  errors.estimatedDuration
                    ? "estimatedDuration-error"
                    : undefined
                }
              />
              {(errors.estimatedDuration?.message ||
                validationErrors?.estimatedDuration) && (
                <InputErrorMessage
                  message={
                    errors.estimatedDuration?.message ??
                    validationErrors?.estimatedDuration
                  }
                  label="estimatedDuration"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <p>
                <b>Estimated Duration:</b>{" "}
                {existingProposal?.estimatedDuration ?? "N/A"} days
              </p>
            </div>
          )}

          {editableFields.includes("status") ? (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <label
                htmlFor="status"
                className="font-semibold text-sm xl:text-base"
              >
                Status
              </label>
              <select
                id="status"
                {...register("status", {
                  onChange: () => clearFieldError("status"),
                })}
                className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
                aria-invalid={!!errors.status}
                aria-describedby={errors.status ? "status-error" : undefined}
              >
                {Object.values(ProposalStatus).map((status) => (
                  <option key={status} value={status}>
                    {ProposalStatusLabels[status]}
                  </option>
                ))}
              </select>
              {(typeof errors.status?.message === "string" ||
                validationErrors?.status) && (
                <InputErrorMessage
                  message={
                    (typeof errors.status?.message === "string"
                      ? errors.status.message
                      : undefined) ?? validationErrors?.status
                  }
                  label={"status"}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <p>
                <b>Status:</b>{" "}
                {existingProposal?.status
                  ? ProposalStatusLabels[existingProposal.status]
                  : "N/A"}
              </p>
            </div>
          )}

          {editableFields.includes("paymentStatus") ? (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <label
                htmlFor="paymentStatus"
                className="font-semibold text-sm xl:text-base"
              >
                Payment Status
              </label>
              <select
                id="paymentStatus"
                {...register("paymentStatus", {
                  onChange: () => clearFieldError("paymentStatus"),
                })}
                className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
                aria-invalid={!!errors.paymentStatus}
                aria-describedby={
                  errors.paymentStatus ? "paymentStatus-error" : undefined
                }
              >
                {Object.values(PaymentStatus).map((paymentStatus) => (
                  <option key={paymentStatus} value={paymentStatus}>
                    {PaymentStatusLabels[paymentStatus]}
                  </option>
                ))}
              </select>
              {(typeof errors.paymentStatus?.message === "string" ||
                validationErrors?.paymentStatus) && (
                <InputErrorMessage
                  message={
                    (typeof errors.paymentStatus?.message === "string"
                      ? errors.paymentStatus.message
                      : undefined) ?? validationErrors?.paymentStatus
                  }
                  label={"paymentStatus"}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <p>
                <b>Payment Status:</b>{" "}
                {existingProposal?.paymentStatus
                  ? PaymentStatusLabels[existingProposal.paymentStatus]
                  : "N/A"}
              </p>
            </div>
          )}

          {editableFields.includes("notes") ? (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <label
                htmlFor="notes"
                className="font-semibold text-sm xl:text-base"
              >
                Notes
              </label>
              <textarea
                id="notes"
                {...register("notes", {
                  onChange: () => clearFieldError("notes"),
                })}
                className="bg-gray-200 text-gray-950 py-2 px-4 w-80 h-40 rounded-sm border border-gray-950 text-sm xl:text-base resize-y"
                aria-invalid={!!errors.notes}
                aria-describedby={errors.notes ? "notes-error" : undefined}
              />
              {(errors.notes || validationErrors?.notes) && (
                <InputErrorMessage
                  message={
                    (typeof errors.notes?.message === "string"
                      ? errors.notes?.message
                      : undefined) ?? validationErrors?.notes
                  }
                  label="notes"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <p>
                <b>Notes:</b> {existingProposal?.notes ?? "N/A"}
              </p>
            </div>
          )}

          {editableFields.includes("plannedStartDate") ? (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <label
                htmlFor="plannedStartDate"
                className="font-semibold text-sm xl:text-base"
              >
                Planned Start Date
              </label>
              <input
                id="plannedStartDate"
                type="date"
                {...register("plannedStartDate", {
                  onChange: () => clearFieldError("plannedStartDate"),
                })}
                className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
                aria-invalid={!!errors.plannedStartDate}
                aria-describedby={
                  errors.plannedStartDate ? "plannedStartDate-error" : undefined
                }
              />
              {(errors.plannedStartDate?.message ||
                validationErrors?.plannedStartDate) && (
                <InputErrorMessage
                  message={
                    errors.plannedStartDate?.message ??
                    validationErrors?.plannedStartDate
                  }
                  label="plannedStartDate"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <p>
                <b>Planned Start Date:</b>{" "}
                {existingProposal?.plannedStartDate
                  ? formatDate(existingProposal?.plannedStartDate)
                  : "N/A"}
              </p>
            </div>
          )}

          {editableFields.includes("plannedEndDate") ? (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <label
                htmlFor="plannedEndDate"
                className="font-semibold text-sm xl:text-base"
              >
                Planned End Date
              </label>
              <input
                id="plannedEndDate"
                type="date"
                {...register("plannedEndDate", {
                  onChange: () => clearFieldError("plannedEndDate"),
                })}
                className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
                aria-invalid={!!errors.plannedEndDate}
                aria-describedby={
                  errors.plannedEndDate ? "plannedEndDate-error" : undefined
                }
              />
              {(errors.plannedEndDate?.message ||
                validationErrors?.plannedEndDate) && (
                <InputErrorMessage
                  message={
                    errors.plannedEndDate?.message ??
                    validationErrors?.plannedEndDate
                  }
                  label="plannedEndDate"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <p>
                <b>Planned End Date:</b>{" "}
                {existingProposal?.plannedEndDate
                  ? formatDate(existingProposal?.plannedEndDate)
                  : "N/A"}
              </p>
            </div>
          )}

          {editableFields.includes("actualStartDate") ? (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <label
                htmlFor="actualStartDate"
                className="font-semibold text-sm xl:text-base"
              >
                Actual Start Date
              </label>
              <input
                id="actualStartDate"
                type="date"
                {...register("actualStartDate", {
                  onChange: () => clearFieldError("actualStartDate"),
                })}
                className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
                aria-invalid={!!errors.actualStartDate}
                aria-describedby={
                  errors.actualStartDate ? "actualStartDate-error" : undefined
                }
              />
              {(errors.actualStartDate?.message ||
                validationErrors?.actualStartDate) && (
                <InputErrorMessage
                  message={
                    errors.actualStartDate?.message ??
                    validationErrors?.actualStartDate
                  }
                  label="actualStartDate"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <p>
                <b>Actual Start Date:</b>{" "}
                {existingProposal?.actualStartDate
                  ? formatDate(existingProposal?.actualStartDate)
                  : "N/A"}
              </p>
            </div>
          )}

          {editableFields.includes("actualEndDate") ? (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <label
                htmlFor="actualEndDate"
                className="font-semibold text-sm xl:text-base"
              >
                Actual End Date
              </label>
              <input
                id="actualEndDate"
                type="date"
                {...register("actualEndDate", {
                  onChange: () => clearFieldError("actualEndDate"),
                })}
                className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
                aria-invalid={!!errors.actualEndDate}
                aria-describedby={
                  errors.actualEndDate ? "actualEndDate-error" : undefined
                }
              />
              {(errors.actualEndDate?.message ||
                validationErrors?.actualEndDate) && (
                <InputErrorMessage
                  message={
                    errors.actualEndDate?.message ??
                    validationErrors?.actualEndDate
                  }
                  label="actualEndDate"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <p>
                <b>Actual End Date:</b>{" "}
                {existingProposal?.actualEndDate
                  ? formatDate(existingProposal?.actualEndDate)
                  : "N/A"}
              </p>
            </div>
          )}

          {editableFields.includes("priority") ? (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <label
                htmlFor="priority"
                className="font-semibold text-sm xl:text-base"
              >
                Priority
              </label>
              <select
                id="priority"
                {...register("priority", {
                  onChange: () => clearFieldError("priority"),
                })}
                className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
                aria-invalid={!!errors.priority}
                aria-describedby={
                  errors.priority ? "priority-error" : undefined
                }
              >
                {Object.values(Priority).map((priority) => (
                  <option key={priority} value={priority}>
                    {PriorityLabels[priority]}
                  </option>
                ))}
              </select>
              {(typeof errors.priority?.message === "string" ||
                validationErrors?.priority) && (
                <InputErrorMessage
                  message={
                    (typeof errors.priority?.message === "string"
                      ? errors.priority.message
                      : undefined) ?? validationErrors?.priority
                  }
                  label={"priority"}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <p>
                <b>Priority:</b>{" "}
                {existingProposal?.priority
                  ? PriorityLabels[existingProposal.priority]
                  : "N/A"}
              </p>
            </div>
          )}

          <br className="" />

          <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
            <SubmitButton
              type="submit"
              disabled={isUpdating}
              label={buttonText}
            />
          </div>
          {existingProposal && (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <SubmitButton
                type="button"
                disabled={isUpdating}
                label="Accept Proposal"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleProposalAction("accept")}
              />
            </div>
          )}
          {existingProposal && (
            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <SubmitButton
                type="button"
                disabled={isUpdating}
                label="Reject Proposal"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleProposalAction("reject")}
              />
            </div>
          )}
        </form>
      )}
    </>
  );
};

export default UpsertProposalForm;
