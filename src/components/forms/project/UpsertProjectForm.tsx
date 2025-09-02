import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PaymentType,
  ProjectStatus,
  type ProjectRequestDTO,
} from "@/types/ProjectDTO";
import type { ProjectFormValues } from "@/schemas/projectSchema";
import projectSchema from "@/schemas/projectSchema";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useGetCustomerByUserIdQuery } from "@/features/profile/customerApi";
import { parseApiError, parseValidationErrors } from "@/utils/parseApiError";
import {
  useCreateProjectMutation,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
} from "@/features/projects/projectsApi";
import FeedbackMessage from "@/components/FeedbackMessage";
import { useGetAllJobCategoriesQuery } from "@/features/jobs/jobCategoriesApi";
import type { JobCategoryDTO, JobSubcategoryDTO } from "@/types/JobCategoryDTO";
import Select from "react-select";
import { useMemo } from "react";
import InputErrorMessage from "../InputErrorMessage";
import useAutoClear from "@/hooks/useAutoClear";
import LoadingSpinner from "@/components/LoadingSpinner";
import SubmitButton from "@/components/SubmitButton";
import {
  ProjectPaymentTypeLabel,
  ProjectStatusLabels,
} from "@/types/formLabels/projectLabels";

type ProjectProps = {
  projectId?: string;
};

const UpsertProjectForm = ({ projectId }: ProjectProps) => {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const {
    data: existingProject,
    isLoading: isExistingProjectLoading,
    error: existingProjectError,
  } = useGetProjectByIdQuery(projectId!, { skip: !projectId });

  useEffect(() => {
    if (!isExistingProjectLoading && existingProjectError) {
      setApiError(parseApiError(existingProjectError));
    }
  }, [isExistingProjectLoading, existingProjectError]);

  const auth = useAuth();
  const userId = auth.user.id;

  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetCustomerByUserIdQuery(userId);

  useEffect(() => {
    if (!isProfileLoading && profileError) {
      setApiError(parseApiError(profileError));
    }
  }, [isProfileLoading, profileError]);

  const customerId = profile?.profileId ?? "";

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  // get job category options
  const { data: jobCategories, isLoading: isLoadingCategories } =
    useGetAllJobCategoriesQuery();
  const categoryOptions: Array<JobCategoryDTO> = useMemo(
    () => jobCategories ?? [],
    [jobCategories]
  );

  const defaultValues = useMemo<ProjectFormValues>(
    () => ({
      title: "",
      description: "",
      status: ProjectStatus.NONE,
      budget: "0",
      paymentType: PaymentType.NONE,
      deadline: new Date().toISOString().slice(0, 10),
      categoryId: null,
      subcategoryIds: [],
    }),
    []
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    clearErrors,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    if (existingProject) {
      reset({
        title: existingProject.title ?? "",
        description: existingProject.description ?? "",
        status: existingProject.status ?? ProjectStatus.NONE,
        budget: existingProject.budget?.toString() ?? "0",
        paymentType: existingProject.paymentType ?? PaymentType.NONE,
        deadline: existingProject.deadline
          ? new Date(existingProject.deadline).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        categoryId: existingProject.category?.id ?? null,
        subcategoryIds: existingProject.subcategories?.map((s) => s.id) ?? [],
      });
    }
  }, [existingProject, reset]);

  const selectedCategoryId = watch("categoryId");

  // get subcategory options
  const jobSubcategoryMap = useMemo(() => {
    const map: Record<number, JobSubcategoryDTO[]> = {};
    (jobCategories ?? []).forEach((cat) => {
      map[cat.id] = cat.subcategories ?? [];
    });
    return map;
  }, [jobCategories]);

  const subcategoryOptions = useMemo(() => {
    return selectedCategoryId
      ? jobSubcategoryMap[selectedCategoryId] ?? []
      : [];
  }, [selectedCategoryId, jobSubcategoryMap]);

  const onSubmit = async (data: ProjectFormValues) => {
    if (!data) return;
    const payload: ProjectRequestDTO = {
      ...data,
      budget: data.budget.toString(),
      status: data.status as ProjectStatus,
      paymentType: data.paymentType as PaymentType,
      deadline: data.deadline
        ? new Date(data.deadline).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      customerId,
    };
    if (projectId) {
      try {
        await updateProject({ id: projectId!, data: payload }).unwrap();
        setApiError("");
        setValidationErrors(null);
        setSuccessMessage("Project updated successfully!");
        reset(defaultValues);
      } catch (error: unknown) {
        handleValidationApiError(error, setValidationErrors, setApiError);
      }
    } else {
      try {
        await createProject(payload).unwrap();
        setApiError("");
        setValidationErrors(null);
        setSuccessMessage("Project created successfully!");
        reset(defaultValues);
      } catch (error: unknown) {
        handleValidationApiError(error, setValidationErrors, setApiError);
      }
    }
  };

  let buttonText;
  if (projectId) {
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

  const clearFieldError = (fieldName: keyof ProjectFormValues) => {
    clearErrors(fieldName);
    setValidationErrors((prev) => {
      if (!prev) return null;
      const updated = { ...prev };
      delete updated[fieldName];
      return Object.keys(updated).length ? updated : null;
    });
  };

  if (isExistingProjectLoading || isLoadingCategories) {
    return <LoadingSpinner fullScreen={true} size={36} />;
  }

  return (
    <>
      {existingProjectError ? (
        <FeedbackMessage
          id="existing-project-error"
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

          <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
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
              })}
              className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {(errors.title || validationErrors?.title) && (
              <InputErrorMessage
                message={errors.title?.message ?? validationErrors?.title}
                label="title"
              />
            )}
          </div>

          <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
            <label
              htmlFor="description"
              className="font-semibold text-sm xl:text-base"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description", {
                onChange: () => clearFieldError("description"),
              })}
              className="bg-gray-200 text-gray-950 py-2 px-4 w-80 h-40 rounded-sm border border-gray-950 text-sm xl:text-base resize-y"
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
            />
            {(errors.description || validationErrors?.description) && (
              <InputErrorMessage
                message={
                  (typeof errors.description?.message === "string"
                    ? errors.description?.message
                    : undefined) ?? validationErrors?.description
                }
                label={"description"}
              />
            )}
          </div>

          <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
            <label
              htmlFor="categoryId"
              className="font-semibold text-sm xl:text-base"
            >
              Category
            </label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <select
                  id="categoryId"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                    clearFieldError("categoryId");
                  }}
                  className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors.categoryId}
                  aria-describedby={
                    errors.categoryId ? "categoryId-error" : undefined
                  }
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {(errors.categoryId || validationErrors?.categoryId) && (
              <InputErrorMessage
                message={
                  (typeof errors.categoryId?.message === "string"
                    ? errors.categoryId?.message
                    : undefined) ?? validationErrors?.categoryId
                }
                label={"categoryId"}
              />
            )}
          </div>

          <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
            <label
              htmlFor="subcategoryIds"
              className="font-semibold text-sm xl:text-base"
            >
              Subcategories
            </label>
            <Controller
              control={control}
              name="subcategoryIds"
              render={({ field }) => (
                <Select
                  id="subcategoryIds"
                  isMulti
                  options={subcategoryOptions.map((sub) => ({
                    value: sub.id,
                    label: sub.name,
                  }))}
                  value={subcategoryOptions
                    .filter((sub) => (field.value ?? []).includes(sub.id))
                    .map((sub) => ({ value: sub.id, label: sub.name }))}
                  onChange={(selected) => {
                    const values = selected.map((opt) => opt.value);
                    field.onChange(values);
                    clearFieldError("subcategoryIds");
                  }}
                  className="react-select-container bg-gray-200 text-gray-950 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
                  classNamePrefix="react-select"
                  placeholder="Select subcategories"
                  aria-invalid={!!errors.subcategoryIds}
                  aria-describedby={
                    errors.subcategoryIds ? "subcategoryIds-error" : undefined
                  }
                  inputId="subcategoryIds"
                  aria-labelledby="subcategoryIds-label"
                />
              )}
            />
            {(errors.subcategoryIds || validationErrors?.subcategoryIds) && (
              <InputErrorMessage
                message={
                  (typeof errors.subcategoryIds?.message === "string"
                    ? errors.subcategoryIds.message
                    : undefined) ?? validationErrors?.subcategoryIds
                }
                label="subcategoryIds"
              />
            )}
          </div>

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
              {Object.values(ProjectStatus).map((status) => (
                <option key={status} value={status}>
                  {ProjectStatusLabels[status]}
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

          <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
            <label
              htmlFor="paymentType"
              className="font-semibold text-sm xl:text-base"
            >
              Payment Type
            </label>
            <select
              id="paymentType"
              {...register("paymentType", {
                onChange: () => clearFieldError("paymentType"),
              })}
              className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
              aria-invalid={!!errors.paymentType}
              aria-describedby={
                errors.paymentType ? "paymentType-error" : undefined
              }
            >
              {Object.values(PaymentType).map((type) => (
                <option key={type} value={type}>
                  {ProjectPaymentTypeLabel[type]}
                </option>
              ))}
            </select>
            {(typeof errors.paymentType?.message === "string" ||
              validationErrors?.paymentType) && (
              <InputErrorMessage
                message={
                  (typeof errors.paymentType?.message === "string"
                    ? errors.paymentType.message
                    : undefined) ?? validationErrors?.paymentType
                }
                label={"paymentType"}
              />
            )}
          </div>

          <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
            <label
              htmlFor="budget"
              className="font-semibold text-sm xl:text-base"
            >
              Budget
            </label>
            <input
              id="budget"
              type="text"
              {...register("budget", {
                required: "Budget is required",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message:
                    "Budget must be a valid number with up to 2 decimal places",
                },
                onChange: () => clearFieldError("budget"),
              })}
              className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
              aria-invalid={!!errors.budget}
              aria-describedby={errors.budget ? "budget-error" : undefined}
            />
            {(errors.budget?.message || validationErrors?.budget) && (
              <InputErrorMessage
                message={errors.budget?.message ?? validationErrors?.budget}
                label="budget"
              />
            )}
          </div>

          <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
            <label
              htmlFor="deadline"
              className="font-semibold text-sm xl:text-base"
            >
              Deadline
            </label>
            <input
              id="deadline"
              type="date"
              {...register("deadline", {
                onChange: () => clearFieldError("deadline"),
              })}
              className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
              aria-invalid={!!errors.deadline}
              aria-describedby={errors.deadline ? "deadline-error" : undefined}
            />
            {(errors.deadline?.message || validationErrors?.deadline) && (
              <InputErrorMessage
                message={errors.deadline?.message ?? validationErrors?.deadline}
                label="deadline"
              />
            )}
          </div>

          <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
            <SubmitButton
              type="submit"
              disabled={isUpdating}
              label={buttonText}
            />
          </div>
        </form>
      )}
    </>
  );
};

export default UpsertProjectForm;
