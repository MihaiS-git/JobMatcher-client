import { skipToken, type FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  validateAboutText,
  validateHeadline,
  validateHourlyRate,
  validateName,
  validateSkills,
  validateSocialLinks,
  validateUrl,
} from "@/utils/validation";
import MultiSelect from "@/components/forms/MultiSelect";
import {
  useGetFreelancerByUserIdQuery,
  useSaveFreelancerMutation,
  useUpdateFreelancerMutation,
} from "@/features/profile/freelancerApi";
import { useGetAllJobCategoriesQuery } from "@/features/jobs/jobCategoriesApi";
import { parseApiError, parseValidationErrors } from "@/utils/parseApiError";
import { useGetAllLanguagesQuery } from "@/features/languages/languagesApi";
import type {
  ExperienceLevel,
  FreelancerDetailDTO,
  FreelancerProfileRequestDTO,
} from "@/types/FreelancerDTO";
import focusFirstError from "@/utils/focusFirstError";
import type { SerializedError } from "@reduxjs/toolkit";
import React from "react";
import FormInput from "@/components/forms/FormInput";
import SelectField from "../SelectField";
import TextareaInput from "../TextareaInput";
import RadioSelect from "../RadioSelect";
import SocialMediaInput from "./SocialMediaInput";

interface Option {
  value: number;
  label: string;
}

type Props = {
  userId: string;
};

const FreelancerForm = ({ userId }: Props) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [username, setUsername] = useState("");
  const [headline, setHeadline] = useState("");
  const [hourlyRate, setHourlyRate] = useState(0.0);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [skills, setSkills] = useState("");
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel>("JUNIOR");
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [about, setAbout] = useState("");
  const [textCounter, setTextCounter] = useState(0);
  const [socialLinks, setSocialLinks] = useState<string[]>([]);
  const [availableForHire, setAvailableForHire] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);

  // job categories
  const {
    data: categories,
    error: categoriesApiError,
    isLoading: isLoadingCategories,
  } = useGetAllJobCategoriesQuery();

  useEffect(() => {
    if (categoriesApiError) {
      setApiError(parseApiError(categoriesApiError));
    }
  }, [categoriesApiError]);

  const subcategories =
    categories?.flatMap((c) =>
      c.subcategories.map((s) => ({ id: s.id, name: s.name }))
    ) ?? [];
  const tagOptions: Option[] = subcategories?.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));

  // languages
  const {
    data: languages,
    error: languagesApiError,
    isLoading: isLoadingLanguages,
  } = useGetAllLanguagesQuery();

  useEffect(() => {
    if (languagesApiError) {
      setApiError(parseApiError(languagesApiError));
    }
  }, [languagesApiError]);

  const languageOptions: Option[] =
    languages?.map((tag) => ({
      value: tag.id,
      label: tag.name,
    })) ?? [];

  const [errors, setErrors] = useState<{
    username?: string | null;
    headline?: string | null;
    hourlyRate?: string | null;
    websiteUrl?: string | null;
    skills?: string | null;
    about?: string | null;
    socialLinks?: (string | null)[] | null;
  }>({});

  const refsGeneral: {
    username: RefObject<HTMLInputElement | null>;
    headline: RefObject<HTMLInputElement | null>;
    hourlyRate: RefObject<HTMLInputElement | null>;
    websiteUrl: RefObject<HTMLInputElement | null>;
    jobCategories: RefObject<HTMLInputElement | null>;
    skills: RefObject<HTMLInputElement | null>;
    experienceLevel: RefObject<HTMLSelectElement | null>;
    languages: RefObject<HTMLInputElement | null>;
    about: RefObject<HTMLTextAreaElement | null>;
  } = {
    username: useRef<HTMLInputElement>(null),
    headline: useRef<HTMLInputElement>(null),
    hourlyRate: useRef<HTMLInputElement>(null),
    websiteUrl: useRef<HTMLInputElement>(null),
    jobCategories: useRef<HTMLInputElement>(null),
    skills: useRef<HTMLInputElement>(null),
    experienceLevel: useRef<HTMLSelectElement>(null),
    languages: useRef<HTMLInputElement>(null),
    about: useRef<HTMLTextAreaElement>(null),
  };

  const socialLinkRefs = useRef<React.RefObject<HTMLInputElement | null>[]>([]);

  // Initialize refs for social media links before rendering
  useEffect(() => {
    // If refs length doesn’t match socialLinks length, recreate refs
    if (socialLinkRefs.current.length !== socialLinks.length) {
      socialLinkRefs.current = Array(socialLinks.length)
        .fill(null)
        .map(() => React.createRef<HTMLInputElement>());
    }
  }, [socialLinks.length]);

  const queryArgs = useMemo(() => (userId ? userId : skipToken), [userId]);

  const {
    data: profile,
    isLoading,
    error: freelancerApiError,
  } = useGetFreelancerByUserIdQuery(queryArgs);

  const [saveProfile, { isLoading: saveLoading }] = useSaveFreelancerMutation();
  const [updateProfile, { isLoading: updateLoading }] =
    useUpdateFreelancerMutation();

  useEffect(() => {
    if (freelancerApiError) {
      setApiError(parseApiError(freelancerApiError));
    }
  }, [freelancerApiError]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setHeadline(profile.headline || "");
      setHourlyRate(profile.hourlyRate || 0);
      setWebsiteUrl(profile.websiteUrl || "");
      setSelectedCategories(profile.jobSubcategories.map((js) => js.id) || []);
      setSkills(
        profile.skills ? profile.skills.map((s) => s.name).join(", ") : ""
      );
      setExperienceLevel(profile.experienceLevel || "");
      setSelectedLanguages(profile.languages.map((l) => l.id) || []);
      setAbout(profile.about || "");
      setTextCounter((profile.about ?? "").length);
      setSocialLinks(profile.socialMedia || []);
      setAvailableForHire(Boolean(profile.availableForHire));
    }
  }, [profile]);

  const validateForm = () => {
    const errors = {
      username: validateName(username),
      headline: validateHeadline(headline),
      hourlyRate: validateHourlyRate(hourlyRate),
      websiteUrl: validateUrl(websiteUrl),
      skills: validateSkills(skills),
      about: validateAboutText(about),
      socialLinks: [...validateSocialLinks(socialLinks)],
    };
    setErrors(errors);
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setValidationErrors(null);
    setErrors({});
    setSuccessMessage("");

    const validationErrors = validateForm();
    const hasError = Object.values(validationErrors).some((error) => {
      if (Array.isArray(error)) {
        return error.some((item) => Boolean(item));
      }
      return Boolean(error);
    });
    if (hasError) {
      focusFirstError(validationErrors, refsGeneral, {
        socialLinks: socialLinkRefs.current,
      });
      return;
    }

    const skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload: FreelancerProfileRequestDTO = {
      userId,
      username: username.trim(),
      experienceLevel: experienceLevel as ExperienceLevel,
      headline: headline.trim(),
      jobSubcategoryIds: selectedCategories,
      hourlyRate,
      availableForHire: availableForHire || false,
      skills: skillsArray,
      languageIds: selectedLanguages,
      about: about.trim(),
      socialMedia: socialLinks.map((s) => s.trim()),
      websiteUrl: websiteUrl.trim(),
    };

    try {
      let result:
        | { data: FreelancerDetailDTO; error?: undefined }
        | { data?: undefined; error: FetchBaseQueryError | SerializedError };
      if (!profile?.profileId) {
        result = await saveProfile(payload);
        if ("data" in result) {
          setSuccessMessage("Profile saved successfully.");
        } else {
          const errorResult = parseValidationErrors(result.error);

          if (errorResult.validationErrors) {
            setValidationErrors(errorResult.validationErrors);
            setApiError("");
          } else {
            setApiError(errorResult.message);
            setValidationErrors(null);
          }
        }
      } else {
        result = await updateProfile({ id: profile!.profileId, data: payload });
        if ("data" in result) {
          setSuccessMessage("Profile updated successfully.");
        } else {
          const errorResult = parseValidationErrors(result.error);

          if (errorResult.validationErrors) {
            setValidationErrors(errorResult.validationErrors);
            setApiError("");
          } else {
            setApiError(errorResult.message);
            setValidationErrors(null);
          }
        }
      }
    } catch (err: unknown) {
      setApiError(parseApiError(err));
    }
  };

  let submitButtonText: string;
  if (profile?.profileId) {
    submitButtonText = updateLoading ? "Updating..." : "Update";
  } else {
    submitButtonText = saveLoading ? "Saving..." : "Save";
  }

  const hasClientErrors = Object.values(errors).some((err) => {
    if (Array.isArray(err)) {
      return err.some((item) => Boolean(item));
    }
    return Boolean(err);
  });

  const hasServerErrors =
    apiError && Object.keys(apiError).length > 0;

  const hasValidationErrors = Boolean(hasClientErrors || hasServerErrors);

  if (isLoading) return <div>Loading user profile...</div>;

  return (
    <form
      className="flex flex-col items-center w-full mb-8"
      onSubmit={handleSubmit}
      aria-describedby={apiError ? "api-error" : undefined}
      noValidate
    >
      <section className="mx-auto">
        <FormInput
          id="username"
          label="Username:"
          type="text"
          name="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setErrors((prev) => ({ ...prev, username: null }));
            setApiError("");
          }}
          onBlur={() => {
            const err = validateName(username);
            setErrors((prev) => ({ ...prev, username: err }));
          }}
          error={errors.username}
          autoComplete="off"
          aria-required="true"
          ref={refsGeneral.username}
          disabled={isLoading}
        />

        <FormInput
          id="headline"
          label="Headline:"
          type="text"
          name="headline"
          value={headline}
          onChange={(e) => {
            setHeadline(e.target.value);
            setErrors((prev) => ({ ...prev, headline: null }));
            setApiError("");
          }}
          onBlur={() => {
            const err = validateHeadline(headline);
            setErrors((prev) => ({ ...prev, headline: err }));
          }}
          error={errors.headline}
          autoComplete="off"
          aria-required="true"
          ref={refsGeneral.headline}
          disabled={isLoading}
        />

        <FormInput
          id="hourlyRate"
          label="Hourly Rate:"
          type="number"
          name="hourlyRate"
          step="0.01"
          value={hourlyRate}
          onChange={(e) => {
            const parsedValue = parseFloat(e.target.value);
            setHourlyRate(isNaN(parsedValue) ? 0.0 : parsedValue);
            setErrors((prev) => ({ ...prev, hourlyRate: null }));
            setApiError("");
          }}
          onBlur={() => {
            const err = validateHourlyRate(hourlyRate);
            setErrors((prev) => ({ ...prev, hourlyRate: err }));
          }}
          error={errors.hourlyRate}
          autoComplete="off"
          aria-required="true"
          ref={refsGeneral.hourlyRate}
          disabled={isLoading}
        />

        <FormInput
          id="websiteUrl"
          label="Website URL:"
          type="text"
          name="websiteUrl"
          value={websiteUrl}
          onChange={(e) => {
            setWebsiteUrl(e.target.value);
            setErrors((prev) => ({ ...prev, websiteUrl: null }));
            setApiError("");
          }}
          onBlur={() => {
            const err = validateUrl(websiteUrl);
            setErrors((prev) => ({ ...prev, websiteUrl: err }));
          }}
          error={errors.websiteUrl}
          autoComplete="off"
          aria-required="true"
          ref={refsGeneral.websiteUrl}
          disabled={isLoading}
        />

        <FormInput
          id="skills"
          label="Skills:"
          type="text"
          name="skills"
          value={skills}
          onChange={(e) => {
            setSkills(e.target.value);
            setErrors((prev) => ({ ...prev, skills: null }));
            setApiError("");
          }}
          onBlur={() => {
            const err = validateSkills(skills);
            setErrors((prev) => ({ ...prev, skills: err }));
          }}
          error={errors.skills}
          autoComplete="off"
          aria-required="true"
          ref={refsGeneral.skills}
          disabled={isLoading}
        />

        <MultiSelect
          id="jobCategories"
          name="jobCategories"
          label="Project categories"
          options={tagOptions}
          selectedValues={selectedCategories}
          onChange={(values) => {
            if (values.length <= 5) {
              setSelectedCategories(values);
              setErrors((prev) => ({ ...prev, jobCategories: undefined }));
              setApiError("");
            } else {
              setErrors((prev) => ({
                ...prev,
                jobCategories: "You can select up to 5 categories only.",
              }));
            }
          }}
          isDisabled={isLoading}
          isLoading={isLoadingCategories}
          ref={refsGeneral.jobCategories}
        />

        <MultiSelect
          id="languages"
          name="languages"
          label="Languages"
          options={languageOptions}
          selectedValues={selectedLanguages}
          onChange={(values) => {
            if (values.length <= 5) {
              setSelectedLanguages(values);
              setErrors((prev) => ({ ...prev, languages: undefined }));
              setApiError("");
            } else {
              setErrors((prev) => ({
                ...prev,
                languages: "You can select up to 5 languages only.",
              }));
            }
          }}
          isDisabled={isLoading}
          isLoading={isLoadingLanguages}
          ref={refsGeneral.languages}
        />

        <SelectField
          id="experienceLevel"
          name="experienceLevel"
          label="Experience Level"
          value={experienceLevel}
          options={[
            { value: "JUNIOR", label: "Junior" },
            { value: "MID", label: "Mid" },
            { value: "SENIOR", label: "Senior" },
          ]}
          onChange={(value: ExperienceLevel) => {
            setExperienceLevel(value);
            setErrors((prev) => ({ ...prev, experienceLevel: null }));
            setApiError("");
          }}
          selectRef={refsGeneral.experienceLevel}
          disabled={isLoading}
        />

        <TextareaInput
          id="about"
          name="about"
          label="About:"
          value={about}
          onChange={(val) => {
            setAbout(val);
            setTextCounter(val.length);
            setErrors((prev) => ({ ...prev, about: null }));
            setApiError("");
          }}
          onBlur={() => {
            const err = validateAboutText(about);
            setErrors((prev) => ({ ...prev, about: err }));
          }}
          error={errors.about}
          characterCount={textCounter}
          showCharacterCount
        />

        <SocialMediaInput
          socialLinks={socialLinks}
          setSocialLinks={setSocialLinks}
          errors={errors.socialLinks || []}
          setApiError={setApiError}
          setErrors={(newErrors) =>
            setErrors((prev) => ({ ...prev, socialLinks: newErrors }))
          }
          refs={socialLinkRefs.current}
        />

        <RadioSelect
          label="Available for hire"
          id1="available"
          label1="Available"
          id2="notAvailable"
          label2="Not available"
          name="availableForHire"
          value={availableForHire}
          setValue={setAvailableForHire}
        />
      </section>
      <button
        type="submit"
        className="bg-blue-500 text-gray-200 p-2 rounded-sm border border-gray-200 disabled:bg-red-400 disabled:cursor-default hover:bg-blue-400 mt-8 w-80 cursor-pointer"
        disabled={isLoading || saveLoading || updateLoading || hasValidationErrors}
      >
        {submitButtonText}
      </button>
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
      {apiError && (
        <p
          id="api-error-general"
          className="text-red-600 dark:text-red-400 text-center my-4"
          role="alert"
          aria-live="assertive"
        >
          {apiError}
        </p>
      )}
      {validationErrors && (
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
      )}
    </form>
  );
};

export default FreelancerForm;
