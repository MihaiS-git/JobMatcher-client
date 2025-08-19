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
import { parseApiError } from "@/utils/parseApiError";
import { useCreateProjectMutation } from "@/features/projects/projectsApi";
import FeedbackMessage from "@/components/FeedbackMessage";
import { useGetAllJobCategoriesQuery } from "@/features/jobs/jobCategoriesApi";
import type { JobCategoryDTO, JobSubcategoryDTO } from "@/types/JobCategoryDTO";
import Select from "react-select";
import { useMemo } from "react";

const CreateProjectForm = () => {
  const [apiError, setApiError] = useState<string>("");

  const auth = useAuth();
  const userId = auth.user.id;

  useEffect(() => {
    if (!userId) {
      return;
    }
  }, [userId]);

  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetCustomerByUserIdQuery(userId);
  useEffect(() => {
    if (profileError) {
      setApiError(parseApiError(profileError));
    }
    if (isProfileLoading) return;
  }, [isProfileLoading, profileError]);
  const customerId = profile?.profileId ?? "";

  const [createProject, { isLoading: isCreating, error: createError }] =
    useCreateProjectMutation();

  // get job category options
  const { data: jobCategories } = useGetAllJobCategoriesQuery();
  useEffect(() => {
    if (!jobCategories) return;
  }, [jobCategories]);
  const categoryOptions: Array<JobCategoryDTO> = useMemo(
    () => [...(jobCategories ?? [])],
    [jobCategories]
  );

  // get subcategory options
  const subcategoryOptions: Array<JobSubcategoryDTO> = useMemo(
    () =>
      categoryOptions.flatMap((subcategory) => subcategory.subcategories ?? []),
    [categoryOptions]
  );

  const defaultValues = useMemo<ProjectFormValues>(
    () => ({
      customerId: customerId,
      title: "",
      description: "",
      status: ProjectStatus.NONE,
      budget: 0,
      paymentType: PaymentType.NONE,
      deadline: new Date().toISOString().slice(0, 10),
      categoryId: categoryOptions[0]?.id,
      subcategoryIds: [],
    }),
    [customerId, categoryOptions]
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    if (categoryOptions.length > 0 && customerId) {
      reset({
        ...defaultValues,
        customerId,
        categoryId: categoryOptions[0].id,
      });
    }
  }, [categoryOptions, customerId, defaultValues, reset]);

  const onSubmit = (data: ProjectFormValues) => {
    console.log("Form submitted:", data);
    if (!data) return;
    const payload: ProjectRequestDTO = {
      ...data,
      budget: data.budget.toString(),
      status: data.status as ProjectStatus,
      paymentType: data.paymentType as PaymentType,
      deadline: data.deadline ? new Date(data.deadline).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    };
    createProject(payload);
  };

  useEffect(() => {
    if (createError) {
      setApiError(parseApiError(createError));
    }
  }, [createError]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Title</label>
        <input {...register("title")} />
        {errors.title && <p>{errors.title.message}</p>}
      </div>

      <div>
        <label>Description</label>
        <textarea {...register("description")} />
        {errors.description && <p>{errors.description.message}</p>}
      </div>

      <div>
        <label>Status</label>
        <select {...register("status")}>
          {Object.values(ProjectStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {errors.status && <p>{errors.status.message}</p>}
      </div>

      <div>
        <label>Budget</label>
        <input type="number" {...register("budget", { valueAsNumber: true })} />
        {errors.budget && <p>{errors.budget.message}</p>}
      </div>

      <div>
        <label>Payment Type</label>
        <select {...register("paymentType")}>
          {Object.values(PaymentType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.paymentType && <p>{errors.paymentType.message}</p>}
      </div>

      <div>
        <label>Deadline</label>
        <input type="date" {...register("deadline")} />
        {errors.deadline && <p>{errors.deadline.message}</p>}
      </div>

      <div>
        <label>Category</label>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <select
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="border p-2 rounded w-full"
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
        {errors.categoryId && <p>{errors.categoryId.message}</p>}
      </div>

      <div>
        <label>Subcategories</label>
        <Controller
          control={control}
          name="subcategoryIds"
          render={({ field }) => (
            <Select
              isMulti
              options={subcategoryOptions.map((sub) => ({
                value: sub.id,
                label: sub.name,
              }))}
              value={subcategoryOptions
                .filter((sub) => (field.value ?? []).includes(sub.id))
                .map((sub) => ({ value: sub.id, label: sub.name }))}
              onChange={(selected) =>
                field.onChange(selected.map((opt) => opt.value))
              }
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select subcategories"
            />
          )}
        />
        {errors.subcategoryIds && <p>{errors.subcategoryIds.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isCreating}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        Submit
      </button>

      {apiError && (
        <FeedbackMessage
          id="api-error"
          message={apiError}
          type="error"
          className="text-red-600 dark:text-red-400 text-xs mt-0.25 mb-2 break-words whitespace-normal max-w-80"
        />
      )}
    </form>
  );
};

export default CreateProjectForm;
