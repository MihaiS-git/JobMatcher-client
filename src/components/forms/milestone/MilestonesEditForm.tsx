import FeedbackMessage from "@/components/FeedbackMessage";
import InputErrorMessage from "@/components/forms/InputErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  useDeleteMilestoneByIdMutation,
  useGetMilestoneByIdQuery,
  useUpdateMilestoneByIdMutation,
} from "@/features/contracts/milestone/milestoneApi";
import { useCreateInvoiceMutation } from "@/features/invoices/invoiceApi";
import { milestoneSchema, type MilestoneItem } from "@/schemas/milestoneSchema";
import { PriorityLabels } from "@/types/formLabels/proposalLabels";
import { Priority } from "@/types/MilestoneDTO";
import type { Role } from "@/types/UserDTO";
import { formatCurrency } from "@/utils/formatCurrency";
import { parseApiError, parseValidationErrors } from "@/utils/parseApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type MilestoneFormProps = {
  milestoneId: string;
  role: Role;
  contractId: string;
};

const EditableFieldsByRole: Record<Role, (keyof MilestoneItem)[]> = {
  STAFF: [
    "title",
    "description",
    "amount",
    "estimatedDuration",
    "plannedStartDate",
    "notes",
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

const MilestonesEditForm = ({
  milestoneId,
  role,
  contractId,
}: MilestoneFormProps) => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const {
    data: milestoneData,
    isLoading: isLoadingMilestone,
    error: milestoneError,
  } = useGetMilestoneByIdQuery(milestoneId);

  const [
    deleteMilestone,
    { isLoading: isDeletingMilestone, error: deleteError },
  ] = useDeleteMilestoneByIdMutation();

  useEffect(() => {
    if (milestoneError) {
      setApiError(parseApiError(milestoneError));
    }
  }, [milestoneError]);

  const [createInvoice, { isLoading: isCreatingInvoice }] =
    useCreateInvoiceMutation();

  const editableFields = EditableFieldsByRole[role];

  const defaultValues = useMemo<MilestoneItem>(
    () => ({
      title: milestoneData?.title || "",
      description: milestoneData?.description || "",
      amount:
        milestoneData?.amount !== undefined
          ? String(milestoneData.amount)
          : "0",
      penaltyAmount:
        milestoneData?.penaltyAmount !== undefined
          ? String(milestoneData.penaltyAmount)
          : "0",
      bonusAmount:
        milestoneData?.bonusAmount !== undefined
          ? String(milestoneData.bonusAmount)
          : "0",
      estimatedDuration: milestoneData?.estimatedDuration || 0,
      notes: milestoneData?.notes || "",
      plannedStartDate: milestoneData?.plannedStartDate || "",
      actualStartDate: milestoneData?.actualStartDate || "",
      priority: milestoneData?.priority || "LOW" as Priority,
    }),
    [milestoneData]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<MilestoneItem>({
    defaultValues,
    resolver: zodResolver(milestoneSchema),
  });

  const [updateMilestone, { isLoading: isUpdating }] =
    useUpdateMilestoneByIdMutation();

  useEffect(() => {
    if (milestoneData) {
      reset({
        title: milestoneData.title || "",
        description: milestoneData.description || "",
        amount:
          milestoneData.amount !== undefined
            ? String(milestoneData.amount)
            : "0",
        penaltyAmount:
          milestoneData.penaltyAmount !== undefined
            ? String(milestoneData.penaltyAmount)
            : "0",
        bonusAmount:
          milestoneData.bonusAmount !== undefined
            ? String(milestoneData.bonusAmount)
            : "0",
        estimatedDuration: milestoneData.estimatedDuration || 0,
        notes: milestoneData.notes || "",
        plannedStartDate: milestoneData.plannedStartDate || "",
        actualStartDate: milestoneData.actualStartDate || "",
        priority: milestoneData.priority || "LOW" as Priority,
      });
    }
  }, [milestoneData, reset]);

  const clearFieldError = (fieldName: FieldPath<MilestoneItem>) => {
    clearErrors(fieldName);
    setValidationErrors((prev) => {
      if (!prev) return null;
      const updated = { ...prev };
      delete updated[fieldName];
      return Object.keys(updated).length ? updated : null;
    });
  };

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

  const onSubmit = async (data: MilestoneItem) => {
    const payload = {
      title: data.title || "",
      description: data.description || "",
      amount: parseFloat(data.amount || "0"),
      penaltyAmount: parseFloat(data.penaltyAmount || "0"),
      bonusAmount: parseFloat(data.bonusAmount || "0"),
      estimatedDuration: data.estimatedDuration || 0,
      notes: data.notes || "",
      plannedStartDate: data.plannedStartDate || "",
      actualStartDate: data.actualStartDate || "",
      priority: data.priority || "LOW" as Priority,
    };

    try {
      await updateMilestone({
        id: milestoneId,
        updatedMilestone: payload,
      }).unwrap();
      setSuccessMessage("Milestones updated successfully.");
      setApiError("");
      setValidationErrors(null);
      reset(defaultValues);
    } catch (err: unknown) {
      handleValidationApiError(err, setValidationErrors, setApiError);
    }

    reset(defaultValues);
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    try {
      await deleteMilestone(milestoneId).unwrap();
      setSuccessMessage("Milestone deleted successfully.");
      setApiError("");
      setValidationErrors(null);
      navigate(`/contracts/${contractId}/add-milestones`);
    } catch (err: unknown) {
      handleValidationApiError(err, setValidationErrors, setApiError);
    }
  };

  const handleCreateInvoice = async (milestoneId: string) => {
    try {
      const invoice = await createInvoice({ contractId, milestoneId }).unwrap();
      const from = location.pathname;
      sessionStorage.setItem("lastContractMilestonesURL", from);
      setSuccessMessage("Invoice created successfully.");
      setApiError("");
      setValidationErrors(null);
      navigate(`/invoices/${invoice.id}`);
    } catch (error: unknown) {
      setApiError(parseApiError(error));
      setSuccessMessage("");
      setValidationErrors(null);
    }
  };

  useEffect(() => {
    if (deleteError) {
      handleValidationApiError(deleteError, setValidationErrors, setApiError);
    }
  }, [deleteError]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full px-4 flex flex-col items-center"
      >
        {isLoadingMilestone && <LoadingSpinner fullScreen={false} size={24} />}
        {milestoneError && <FeedbackMessage message={apiError} />}
        <section className="w-full max-w-2xl my-4 border border-gray-400 rounded-sm p-4 bg-gray-200 grid grid-cols-2">
          <p className="ms-4 font-light text-sm">
            <span className="font-semibold">Title: </span>
          </p>
          <p className="ms-4 font-light text-sm">
            {milestoneData?.title || "N/A"}
          </p>
          <p className="ms-4 font-light text-sm">
            <span className="font-semibold">Description: </span>
          </p>
          <p className="ms-4 font-light text-sm">
            {milestoneData?.description || "N/A"}
          </p>
          <p className="ms-4 font-light text-sm">
            <span className="font-semibold">Amount: </span>
          </p>
          <p className="ms-4 font-light text-sm">
            {milestoneData?.amount
              ? formatCurrency(milestoneData?.amount)
              : "N/A"}
          </p>
          <p className="ms-4 font-light text-sm">
            <span className="font-semibold">Penalty Amount: </span>
          </p>
          <p className="ms-4 font-light text-sm">
            {milestoneData?.penaltyAmount
              ? formatCurrency(milestoneData?.penaltyAmount)
              : "N/A"}
          </p>
          <p className="ms-4 font-light text-sm">
            <span className="font-semibold">Bonus Amount: </span>
          </p>
          <p className="ms-4 font-light text-sm">
            {milestoneData?.bonusAmount
              ? formatCurrency(milestoneData?.bonusAmount)
              : "N/A"}
          </p>
          <p className="ms-4 font-light text-sm">
            <span className="font-semibold">Estimated Duration: </span>
          </p>
          <p className="ms-4 font-light text-sm">
            {milestoneData?.estimatedDuration || "N/A"} days
          </p>
          <p className="ms-4 font-light text-sm">
            <span className="font-semibold">Planned Start Date: </span>
          </p>
          <p className="ms-4 font-light text-sm">
            {milestoneData?.plannedStartDate || "N/A"}
          </p>
          <p className="ms-4 font-light text-sm">
            <span className="font-semibold">Actual Start Date: </span>
          </p>
          <p className="ms-4 font-light text-sm">
            {milestoneData?.actualStartDate || "N/A"}
          </p>
          <p className="ms-4 font-light text-sm">
            <span className="font-semibold">Priority: </span>
          </p>
          <p className="ms-4 font-light text-sm">
            {PriorityLabels[milestoneData?.priority || "LOW" as Priority] || "N/A"}
          </p>
          <p className="ms-4 font-light text-sm">
            <span className="font-semibold">Notes: </span>
          </p>
          <p className="ms-4 font-light text-sm">
            {milestoneData?.notes || "N/A"}
          </p>
        </section>
        <fieldset
          className="w-full flex flex-col items-center"
          disabled={isUpdating || isLoadingMilestone || isDeletingMilestone}
        >
          <div className="space-y-2 w-full flex flex-col items-center">
            {editableFields.includes("title") && (
              <div className="flex flex-col w-full max-w-2xl items-start my-2 px-2">
                <label
                  htmlFor="title"
                  className="font-semibold text-sm xl:text-base"
                >
                  Title
                </label>
                <input
                  id="title"
                  {...register("title", {
                    onChange: () => clearFieldError("title"),
                    required: "Title required",
                  })}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base resize-y"
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? "title-error" : undefined}
                />
                {(errors?.title || validationErrors?.[".title"]) && (
                  <InputErrorMessage
                    message={
                      typeof errors?.title?.message === "string"
                        ? errors.title!.message
                        : validationErrors?.["title"]
                    }
                    label="title"
                  />
                )}
              </div>
            )}
            {editableFields.includes("description") && (
              <div className="flex flex-col items-start w-full max-w-2xl my-2 px-2">
                <label
                  htmlFor="description"
                  className="font-semibold text-sm xl:text-base"
                >
                  Description
                </label>
                <textarea
                  {...register("description", {
                    onChange: () => clearFieldError("description"),
                    required: "Description required",
                  })}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors.description}
                  aria-describedby={
                    errors.description ? "description-error" : undefined
                  }
                />
                {(errors?.description || validationErrors?.["description"]) && (
                  <InputErrorMessage
                    message={
                      typeof errors?.description?.message === "string"
                        ? errors.description!.message
                        : validationErrors?.["description"]
                    }
                    label="description"
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
                  type="text"
                  {...register("amount", {
                    required: "Amount required",
                    min: 0.01,
                  })}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors.amount}
                  aria-describedby={errors.amount ? "amount-error" : undefined}
                />
                {(errors?.amount || validationErrors?.["amount"]) && (
                  <InputErrorMessage
                    message={
                      typeof errors?.amount?.message === "string"
                        ? errors.amount!.message
                        : validationErrors?.["amount"]
                    }
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
                  type="text"
                  {...register("penaltyAmount")}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors.penaltyAmount}
                  aria-describedby={
                    errors.penaltyAmount ? "penaltyAmount-error" : undefined
                  }
                />
                {errors.penaltyAmount && (
                  <InputErrorMessage
                    message={errors.penaltyAmount?.message}
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
                  type="text"
                  {...register("bonusAmount")}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors.bonusAmount}
                  aria-describedby={
                    errors.bonusAmount ? "bonusAmount-error" : undefined
                  }
                />
                {errors.bonusAmount && (
                  <InputErrorMessage
                    message={errors?.bonusAmount?.message}
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
                  Estimated Duration(in days)
                </label>
                <input
                  type="number"
                  {...register("estimatedDuration", {
                    required: "Estimated duration required",
                    min: 1,
                    valueAsNumber: true,
                  })}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors?.estimatedDuration}
                  aria-describedby={
                    errors?.estimatedDuration
                      ? "estimatedDuration-error"
                      : undefined
                  }
                />
                {errors?.estimatedDuration && (
                  <InputErrorMessage
                    message={errors?.estimatedDuration?.message}
                    label="estimatedDuration"
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
                  type="date"
                  {...register("plannedStartDate", {
                    required: "Planned start date required",
                  })}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors?.plannedStartDate}
                  aria-describedby={
                    errors?.plannedStartDate
                      ? "plannedStartDate-error"
                      : undefined
                  }
                />
                {errors?.plannedStartDate && (
                  <InputErrorMessage
                    message={errors?.plannedStartDate?.message}
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
                  type="date"
                  {...register("actualStartDate", {
                    required: "Actual start date required",
                  })}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors?.actualStartDate}
                  aria-describedby={
                    errors?.actualStartDate
                      ? "actualStartDate-error"
                      : undefined
                  }
                />
                {errors?.actualStartDate && (
                  <InputErrorMessage
                    message={errors?.actualStartDate?.message}
                    label="actualStartDate"
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
                  {...register("notes")}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors?.notes}
                  aria-describedby={errors?.notes ? "notes-error" : undefined}
                />
                {errors?.notes && (
                  <InputErrorMessage
                    message={errors?.notes?.message}
                    label="notes"
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
                  aria-invalid={!!errors?.priority}
                  aria-describedby={
                    errors?.priority ? "priority-error" : undefined
                  }
                >
                  {Object.values(Priority).map((priority) => (
                    <option key={priority} value={priority}>
                      {PriorityLabels[priority]}
                    </option>
                  ))}
                </select>
                {errors?.priority && (
                  <InputErrorMessage
                    message={errors?.priority?.message}
                    label="priority"
                  />
                )}
              </div>
            )}
          </div>
          <section
            className="flex flex-row justify-center gap-2"
            aria-disabled={
              isLoadingMilestone || isUpdating || isDeletingMilestone
            }
          >
            {role === "STAFF" && (
              <div className="flex flex-col items-center gap-3 w-full max-w-2xl my-2 px-2">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => {
                    handleCreateInvoice(milestoneData!.id);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white w-35"
                  disabled={
                    isUpdating ||
                    isLoadingMilestone ||
                    isDeletingMilestone ||
                    isCreatingInvoice ||
                    ["TERMINATED", "CANCELLED"].includes(milestoneData!.status!)
                  }
                >
                  Create Invoice
                </Button>
              </div>
            )}

            <div className="flex flex-col items-center gap-3 w-full max-w-2xl my-2 px-2">
              <Button
                type="submit"
                variant="default"
                className="bg-blue-500 hover:bg-blue-600 text-white w-35"
                disabled={
                  isUpdating || isLoadingMilestone || isDeletingMilestone
                }
              >
                Update
              </Button>
            </div>
            <div className="flex flex-col items-center gap-3 w-full max-w-2xl my-2 px-2">
              <Button
                type="button"
                variant="destructive"
                className="w-35"
                disabled={
                  isUpdating || isLoadingMilestone || isDeletingMilestone
                }
                onClick={() => handleDeleteMilestone(milestoneId)}
              >
                Delete
              </Button>
            </div>
          </section>
        </fieldset>
      </form>

      <fieldset
        className="flex flex-col items-center mt-4 space-y-4 w-full mx-auto"
        disabled={isUpdating || isLoadingMilestone || isDeletingMilestone}
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
        {validationErrors && (
          <div className="text-red-600 mt-4">
            {Object.entries(validationErrors).map(([field, message]) => (
              <div key={field}>
                {field}: {message}
              </div>
            ))}
          </div>
        )}
      </fieldset>
    </>
  );
};

export default MilestonesEditForm;
