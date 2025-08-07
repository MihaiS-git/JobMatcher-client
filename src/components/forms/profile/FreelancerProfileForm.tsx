import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { freelancerProfileSchema } from "@/schemas/freelancerProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../FormInput";
import { useEffect, useMemo, useRef, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import {
  useGetFreelancerByUserIdQuery,
  useSaveFreelancerMutation,
  useUpdateFreelancerMutation,
} from "@/features/profile/freelancerApi";
import { parseApiError, parseValidationErrors } from "@/utils/parseApiError";
import MultiSelect from "../MultiSelect";
import SelectField from "../SelectField";
import TextareaInput from "../TextareaInput";
import SocialMediaInput from "./SocialMediaInput";
import type {
  ExperienceLevel,
  FreelancerDetailDTO,
  FreelancerProfileRequestDTO,
  SkillDTO,
} from "@/types/FreelancerDTO";
import { useApiErrors } from "@/hooks/useApiErrors";
import useJobSubcategories from "@/hooks/useJobSubcategories";
import useLanguages from "@/hooks/useLanguages";
import InputErrorMessage from "../InputErrorMessage";
import type { JobSubcategoryDTO } from "@/types/JobCategoryDTO";
import type { LanguageDTO } from "@/types/LanguageDTO";

type FreelancerProfileFormData = z.output<typeof freelancerProfileSchema>;

type Props = {
  userId: string;
};

const FreelancerProfileForm = ({ userId }: Props) => {
  const formResettingRef = useRef(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { errorMessage, handleApiError, clearErrors } = useApiErrors();
  const [hasServerValidationErrors, setHasServerValidationErrors] =
    useState(false);
  const queryArgs = useMemo(() => (userId ? userId : skipToken), [userId]);
  const {
    data: profile,
    isLoading,
    error: freelancerApiError,
  } = useGetFreelancerByUserIdQuery(queryArgs);
  const [saveProfile, { isLoading: saveLoading }] = useSaveFreelancerMutation();
  const [updateProfile, { isLoading: updateLoading }] =
    useUpdateFreelancerMutation();
  const {
    tagOptions,
    isLoading: isLoadingJobCategories,
    error: jobCategoriesApiError,
  } = useJobSubcategories();
  const {
    languageOptions,
    isLoading: isLoadingLanguages,
    error: languagesApiError,
  } = useLanguages();

  // freelancer profile form data
  const mapProfileToDefaultValues = (
    profile: FreelancerDetailDTO | undefined
  ): Partial<FreelancerProfileFormData> => {
    if (!profile) return {};
    return {
      username: profile.username || "",
      headline: profile.headline || "",
      hourlyRate: profile.hourlyRate || 0.0,
      websiteUrl: profile.websiteUrl || "",
      jobSubcategoryIds: profile.jobSubcategories
        ? profile.jobSubcategories.map((js: JobSubcategoryDTO) => js.id)
        : [],
      skills: profile.skills
        ? profile.skills.map((s: SkillDTO) => s.name).join(", ")
        : "",
      experienceLevel: profile.experienceLevel || "JUNIOR",
      languageIds: profile.languages
        ? profile.languages.map((l: LanguageDTO) => l.id)
        : [],
      about: profile.about || "",
      socialMedia: profile.socialMedia || [""],
      availableForHire: profile.availableForHire ?? false,
    };
  };

  const defaultValues = useMemo(
    () => mapProfileToDefaultValues(profile),
    [profile]
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
    watch,
    setError,
  } = useForm<FreelancerProfileFormData>({
    resolver: zodResolver(freelancerProfileSchema),
    mode: "onBlur",
    defaultValues,
  });

  // Reset the form with mapped profile defaults
  useEffect(() => {
    if (profile && !hasServerValidationErrors) {
      formResettingRef.current = true;
      reset(mapProfileToDefaultValues(profile));
      setTimeout(() => {
        formResettingRef.current = false;
      }, 50);
    }
  }, [profile, reset, hasServerValidationErrors]);

  // Auto-clear success message on real form change (not reset)
  useEffect(() => {
    const subscription = watch(() => {
      if (!formResettingRef.current && isDirty && successMessage) {
        setSuccessMessage("");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, isDirty, successMessage]);

  // Auto-dismiss success message after 5s
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const onSubmit = async (data: FreelancerProfileFormData) => {
    clearErrors();
    setSuccessMessage("");

    const skillsArray = data.skills
      ?.split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload: FreelancerProfileRequestDTO = {
      userId,
      username: data.username,
      experienceLevel: (data.experienceLevel as ExperienceLevel) || "JUNIOR",
      headline: data.headline || "",
      jobSubcategoryIds: data.jobSubcategoryIds || [],
      hourlyRate: data.hourlyRate || 0.0,
      availableForHire: data.availableForHire ?? false,
      skills: skillsArray || [],
      languageIds: data.languageIds || [],
      about: data.about || "",
      socialMedia: data.socialMedia || [],
      websiteUrl: data.websiteUrl || "",
    };

    try {
      const action = !profile?.profileId
        ? saveProfile(payload)
        : updateProfile({ id: profile.profileId, data: payload });

      const result = await action;

      if ("data" in result) {
        setSuccessMessage(
          !profile?.profileId
            ? "Profile saved successfully."
            : "Profile updated successfully."
        );
        clearErrors();
        setHasServerValidationErrors(false);
      } else {
        const { validationErrors } = parseValidationErrors(result.error);
        if (validationErrors) {
          setHasServerValidationErrors(true);
          Object.entries(validationErrors).forEach(([field, message]) => {
            setError(field as keyof FreelancerProfileFormData, {
              type: "server",
              message,
            });
          });
        } else {
          handleApiError(result.error);
        }
      }
    } catch (err: unknown) {
      handleApiError(err);
    }
  };

  let submitButtonText: string;
  if (profile?.profileId) {
    submitButtonText = updateLoading ? "Updating..." : "Update";
  } else {
    submitButtonText = saveLoading ? "Saving..." : "Save";
  }

  if (isLoading) return <div>Loading user profile...</div>;
  if (freelancerApiError) return <div>{parseApiError(freelancerApiError)}</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center w-full mb-8"
      noValidate
    >
      <section className="mx-auto">
        <FormInput
          id="username"
          label="Username"
          error={errors.username?.message}
          {...register("username")}
        />

        <FormInput
          id="headline"
          label="Headline"
          error={errors.headline?.message}
          {...register("headline")}
        />

        <FormInput
          id="hourlyRate"
          label="Hourly rate"
          type="number"
          step="0.01"
          error={errors.hourlyRate?.message}
          {...register("hourlyRate", { valueAsNumber: true })}
        />

        <FormInput
          id="websiteUrl"
          label="Website URL"
          error={errors.websiteUrl?.message}
          {...register("websiteUrl")}
        />

        <FormInput
          id="skills"
          label="Skills"
          error={errors.skills?.message}
          {...register("skills")}
        />

        {jobCategoriesApiError && (
          <InputErrorMessage
            message={"Failed to load job categories. Try again later."}
            label={"jobCategoryOptions"}
          />
        )}
        {!jobCategoriesApiError && !isLoadingJobCategories && (
          <Controller
            name="jobSubcategoryIds"
            control={control}
            render={({ field }) => (
              <MultiSelect
                id="jobCategories"
                name={field.name}
                label="Project categories"
                options={tagOptions}
                selectedValues={field.value || []}
                onChange={(values) => field.onChange(values)}
                isDisabled={isSubmitting}
                isLoading={isLoadingJobCategories}
                error={errors.jobSubcategoryIds?.message}
              />
            )}
          />
        )}

        {languagesApiError && (
          <InputErrorMessage
            message={"Failed to load languages. Try again later."}
            label={"languageOptions"}
          />
        )}
        {!languagesApiError && !isLoadingLanguages && (
          <Controller
            name="languageIds"
            control={control}
            render={({ field }) => (
              <MultiSelect
                id="languages"
                name={field.name}
                label="Languages"
                options={languageOptions}
                selectedValues={field.value || []}
                onChange={(values) => field.onChange(values)}
                isDisabled={isSubmitting}
                isLoading={isLoadingLanguages}
                error={errors.languageIds?.message}
              />
            )}
          />
        )}

        <Controller
          name="experienceLevel"
          control={control}
          render={({ field }) => (
            <SelectField
              id="experienceLevel"
              name={field.name}
              label="Experience Level"
              value={field.value}
              onChange={field.onChange}
              disabled={isLoading}
              options={[
                { value: "JUNIOR", label: "Junior" },
                { value: "MID", label: "Mid" },
                { value: "SENIOR", label: "Senior" },
              ]}
            />
          )}
        />

        <Controller
          name="about"
          control={control}
          render={({ field, fieldState }) => (
            <TextareaInput
              id="about"
              name={field.name}
              label="About"
              value={field.value || ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message ?? null}
              characterCount={field.value ? field.value.length : 0}
              showCharacterCount
              disabled={isSubmitting}
            />
          )}
        />

        <Controller
          name="socialMedia"
          control={control}
          render={({ field, fieldState }) => (
            <SocialMediaInput
              socialLinks={field.value || [""]}
              setSocialLinks={field.onChange}
              error={fieldState.error?.message ?? null}
            />
          )}
        />

        <div className="flex flex-col items-left w-full my-2 mt-8 px-2 xl:px-16">
          <label
            htmlFor="availableForHire"
            className="font-semibold text-sm xl:text-base ms-2 mb-2"
          >
            <input
              className="me-2"
              type="checkbox"
              id="availableForHire"
              {...register("availableForHire")}
            />
            Available for hire
          </label>
          {errors.availableForHire && (
            <InputErrorMessage
              message={errors.availableForHire.message!}
              label={"availableForHire"}
            />
          )}
        </div>

        <div className="flex flex-col items-left w-full my-2 px-2 xl:px-16">
          <button
            type="submit"
            className="bg-blue-500 text-gray-200 p-2 rounded-sm border border-gray-200 hover:bg-blue-400 disabled:bg-blue-300 mt-8 w-80 cursor-pointer"
            disabled={
              !isDirty ||
              isLoading ||
              saveLoading ||
              updateLoading ||
              isSubmitting
            }
          >
            {submitButtonText}
          </button>
        </div>
      </section>
      <section className="mx-auto">
        {successMessage && (
          <p
            id="api-error-address"
            className="text-green-400 text-center my-4"
            role="alert"
            aria-live="assertive"
          >
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p
            id="api-error-general"
            className="text-red-600 dark:text-red-400 text-center my-4"
            role="alert"
            aria-live="assertive"
          >
            {errorMessage}
          </p>
        )}
        {/* {validationErrors && (
          <div
            id="api-error-validation"
            className="text-red-600 dark:text-red-400 text-center my-4"
            role="alert"
            aria-live="assertive"
          >
            {Object.values(validationErrors).map((msg, idx) => (
              <p key={idx}>{msg}</p>
            ))}
          </div>
        )} */}
      </section>
    </form>
  );
};

export default FreelancerProfileForm;
