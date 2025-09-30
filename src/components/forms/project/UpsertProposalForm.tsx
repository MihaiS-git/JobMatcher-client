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
  PriorityLabels,
} from "@/types/formLabels/proposalLabels";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
      projectId: existingProposal?.projectId ?? projectId ?? "",
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
    [existingProposal?.projectId, freelancer?.profileId, projectId]
  );

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
        projectId: existingProposal.projectId ?? projectId,
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
        <>
          {existingProposal && (
            <section className="flex flex-col items-start w-full my-2 px-2 xl:px-16 border-b border-gray-500 pb-4 text-sm">
              <p>
                <b>Proposal ID: </b>{" "}
                <Link
                  to={`/proposals/${existingProposal.id}`}
                  className="text-blue-500 hover:text-blue-400 cursor-pointer italic font-light underline"
                >
                  {existingProposal.id}
                </Link>
              </p>
              <p>
                <b>Submitted by:</b>{" "}
                <Link
                  to={`/public_profile/freelancer/${existingProposal?.freelancer.profileId}`}
                  className="text-blue-500 hover:text-blue-400 cursor-pointer italic font-light underline"
                >
                  {existingProposal?.freelancer.username}
                </Link>
              </p>
              <p>
                <b>For Project: </b>{" "}
                <Link
                  to={`/projects/${existingProposal?.projectId}`}
                  className="text-blue-500 hover:text-blue-400 cursor-pointer italic font-light underline"
                >
                  {existingProposal?.projectId}
                </Link>
              </p>
            </section>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full pb-40 flex flex-col items-center"
          >
            <fieldset
              className="flex flex-col items-center mt-4 space-y-4 w-full mx-auto"
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
                <FeedbackMessage
                  id="api-error"
                  message={apiError}
                  type="error"
                />
              )}
            </fieldset>

            {editableFields.includes("coverLetter") && (
              <div className="flex flex-col w-full max-w-2xl items-start my-2 px-2">
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
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full h-40 rounded-sm border border-gray-950 text-sm xl:text-base resize-y"
                  aria-invalid={!!errors.coverLetter}
                  aria-describedby={
                    errors.coverLetter ? "coverLetter-error" : undefined
                  }
                  disabled={
                    existingProposal?.status === "ACCEPTED" ||
                    existingProposal?.status === "REJECTED" ||
                    existingProposal?.status === "WITHDRAWN"
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
            )}

            {editableFields.includes("amount") && (
              <div className="flex flex-col items-start w-full max-w-2xl my-2 px-2">
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
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-2 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors.amount}
                  aria-describedby={errors.amount ? "amount-error" : undefined}
                  disabled={
                    existingProposal?.status === "ACCEPTED" ||
                    existingProposal?.status === "REJECTED" ||
                    existingProposal?.status === "WITHDRAWN"
                  }
                />
                {(errors.amount?.message || validationErrors?.amount) && (
                  <InputErrorMessage
                    message={errors.amount?.message ?? validationErrors?.amount}
                    label="amount"
                  />
                )}
              </div>
            )}

            {editableFields.includes("penaltyAmount") && (
              <div className="flex flex-col items-start w-full max-w-2xl my-2 px-2">
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
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
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
            )}

            {editableFields.includes("bonusAmount") && (
              <div className="flex flex-col items-start w-full max-w-2xl my-2 px-2">
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
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors.bonusAmount}
                  aria-describedby={
                    errors.bonusAmount ? "bonusAmount-error" : undefined
                  }
                />
                {(errors.bonusAmount?.message ||
                  validationErrors?.bonusAmount) && (
                  <InputErrorMessage
                    message={
                      errors.bonusAmount?.message ??
                      validationErrors?.bonusAmount
                    }
                    label="bonusAmount"
                  />
                )}
              </div>
            )}

            {editableFields.includes("estimatedDuration") && (
              <div className="flex flex-col items-start w-full max-w-2xl my-2 px-2">
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
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors.estimatedDuration}
                  aria-describedby={
                    errors.estimatedDuration
                      ? "estimatedDuration-error"
                      : undefined
                  }
                  disabled={
                    existingProposal?.status === "REJECTED" ||
                    existingProposal?.status === "WITHDRAWN"
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
            )}

            {editableFields.includes("notes") && (
              <div className="flex flex-col items-start w-full max-w-2xl my-2 px-2">
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
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full h-40 rounded-sm border border-gray-950 text-sm xl:text-base resize-y"
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
            )}

            {editableFields.includes("plannedStartDate") && (
              <div className="flex flex-col items-start w-full max-w-2xl my-2 px-2">
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
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors.plannedStartDate}
                  aria-describedby={
                    errors.plannedStartDate
                      ? "plannedStartDate-error"
                      : undefined
                  }
                  disabled={
                    existingProposal?.status === "ACCEPTED" ||
                    existingProposal?.status === "REJECTED" ||
                    existingProposal?.status === "WITHDRAWN"
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
            )}

            {editableFields.includes("actualStartDate") && (
              <div className="flex flex-col items-start w-full max-w-2xl my-2 px-2">
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
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors.actualStartDate}
                  aria-describedby={
                    errors.actualStartDate ? "actualStartDate-error" : undefined
                  }
                  disabled={
                    existingProposal?.status === "ACCEPTED" ||
                    existingProposal?.status === "REJECTED" ||
                    existingProposal?.status === "WITHDRAWN"
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
            )}

            {editableFields.includes("priority") && (
              <div className="flex flex-col items-start w-full max-w-2xl my-2 px-2">
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
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
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
            )}

            <div className="flex flex-col items-center gap-3 w-full max-w-2xl my-2 px-2">
              <SubmitButton
                type="submit"
                disabled={
                  isUpdating ||
                  existingProposal?.status === "REJECTED" ||
                  existingProposal?.status === "WITHDRAWN"
                }
                label={buttonText}
                className="cursor-pointer"
              />
              {existingProposal && existingProposal.status === "PENDING" && (
                <Button
                  variant="default"
                  onClick={() => handleProposalAction("accept")}
                  disabled={isUpdating}
                  className="w-80 bg-green-600 text-gray-100 hover:bg-green-500 cursor-pointer"
                >
                  Accept Proposal
                </Button>
              )}
              {existingProposal && existingProposal.status === "PENDING" && (
                <Button
                  variant="destructive"
                  onClick={() => handleProposalAction("reject")}
                  disabled={isUpdating}
                  className="w-80 cursor-pointer"
                >
                  Reject Proposal
                </Button>
              )}
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default UpsertProposalForm;
