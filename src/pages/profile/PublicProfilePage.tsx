import PageContent from "@/components/PageContent";
import useAuth from "@/hooks/useAuth";
import { skipToken, type FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import FormInput from "./FormInput";
import {
  validateAboutText,
  validateHeadline,
  validateHourlyRate,
  validateName,
  validateSkills,
  validateSocialLinks,
  validateUrl,
} from "@/utils/validation";
import MultiSelect from "@/components/MultiSelect";
import { RiDeleteBin6Line } from "react-icons/ri";
import InputErrorMessage from "@/components/forms/InputErrorMessage";
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

interface Option {
  value: number;
  label: string;
}

const PublicProfilePage = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [username, setUsername] = useState("");
  const [headline, setHeadline] = useState("");
  const [hourlyRate, setHourlyRate] = useState(0.0);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [skills, setSkills] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [about, setAbout] = useState("");
  const [textCounter, setTextCounter] = useState(0);
  const [socialLinks, setSocialLinks] = useState<string[]>([]);
  const [availableForHire, setAvailableForHire] = useState<boolean | null>(
    null
  );
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

  const socialLinkRefs = useRef<React.RefObject<HTMLInputElement>[]>([]);

  useEffect(() => {
    socialLinkRefs.current = socialLinks.map(
      (_, i) => socialLinkRefs.current[i] || React.createRef<HTMLInputElement>()
    );
  }, [socialLinks]);

  const auth = useAuth();
  const authUser = auth?.user;
  const userId = authUser?.id;

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

  const handleRemoveLink = (index: number) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    const newErrors = errors.socialLinks?.filter((_, i) => i !== index) || [];
    setSocialLinks(newLinks);
    setErrors((prev) => ({ ...prev, socialLinks: newErrors }));
  };

  if (!authUser?.id) return <div>Loading user session...</div>;
  if (isLoading) return <div>Loading user profile...</div>;

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-4"
        aria-labelledby="edit-profile-heading"
      >
        <h1 id="edit-profile-heading" className="text-xl font-bold">
          Public Profile
        </h1>
        <img
          className="text-xs font-light m-4 w-80 h-80"
          src={authUser?.pictureUrl || "user_icon.png"}
          alt="User profile picture"
          aria-label="user-profile-picture"
        />

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

            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <label
                htmlFor="experienceLevel"
                className="font-semibold text-sm xl:text-base"
              >
                Experience level:
              </label>
              <select
                className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
                name="experienceLevel"
                id="experienceLevel"
                value={experienceLevel}
                ref={refsGeneral.experienceLevel}
                onChange={(e) => {
                  setExperienceLevel(e.target.value);
                }}
              >
                <option value="JUNIOR">Junior</option>
                <option value="MID">Mid</option>
                <option value="SENIOR">Senior</option>
              </select>
            </div>

            <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
              <label
                htmlFor="about"
                className="font-semibold text-sm xl:text-base"
              >
                About:
              </label>
              <textarea
                name="about"
                id="about"
                className="bg-gray-200 text-gray-950 py-2 px-4 w-80 h-40 rounded-sm border border-gray-950 text-sm xl:text-base resize-y"
                value={about}
                onChange={(e) => {
                  setAbout(e.target.value);
                  setTextCounter((e.target.value ?? "").length);
                  setErrors((prev) => ({ ...prev, about: null }));
                }}
                onBlur={() => {
                  const err = validateAboutText(about);
                  setErrors((prev) => ({ ...prev, about: err }));
                }}
                aria-invalid={!!errors.about}
                aria-describedby={errors.about ? "about-error" : undefined}
              />
              <p
                id="charactersCounter"
                className="text-gray-200 text-xs mt-0.5"
                role="alert"
                aria-live="assertive"
              >
                Characters typed: {textCounter}
              </p>
              {errors.about && (
                <InputErrorMessage message={errors.about} label="about" />
              )}
            </div>

            <div className="flex flex-col items-left w-full my-2 px-2 xl:px-16">
              <label className="font-semibold text-sm xl:text-base mb-2">
                Social Media URLs:
              </label>
              {socialLinks.map((url, index) => (
                <div key={index} className="mb-4 w-full">
                  <input
                    type="url"
                    placeholder="https://your-social-link.com"
                    className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
                    value={url}
                    onChange={(e) => {
                      const newLinks = [...socialLinks];
                      newLinks[index] = e.target.value;
                      setSocialLinks(newLinks);
                      setErrors((prev) => ({ ...prev, socialLinks: null }));
                    }}
                    onBlur={() => {
                      const error = validateSocialLinks(socialLinks);
                      setErrors((prev) => ({ ...prev, socialLinks: error }));
                    }}
                    aria-invalid={!!errors?.socialLinks?.[index]}
                    aria-describedby={
                      errors.socialLinks?.[index]
                        ? `social-url-error-${index}`
                        : undefined
                    }
                    ref={socialLinkRefs.current[index]}
                  />
                  {url && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(index)}
                      aria-label={`Remove social link ${index + 1}`}
                      className="ml-2  p-0 rounded text-xs align-middle"
                    >
                      <RiDeleteBin6Line className="w-7 h-7 text-gray-800 dark:text-red-600 hover:text-red-700 rounded-xs border border-gray-800 dark:border-red-600 hover:border-red-700 p-1" />
                    </button>
                  )}
                  {errors.socialLinks && errors.socialLinks?.[index] && (
                    <InputErrorMessage
                      message={errors.socialLinks[index]}
                      label="social-url"
                    />
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setSocialLinks((prev) => [...prev, ""]);
                  setErrors((prev) => ({
                    ...prev,
                    socialLinks: [...(prev.socialLinks || []), null],
                  }));
                }}
                className="mx-auto bg-gray-300 text-gray-950 text-sm p-0.5 rounded-sm border-1 border-gray-950 hover:bg-gray-500 hover:text-gray-200 w-40 cursor-pointer"
              >
                + Add Another Link
              </button>
            </div>
            <div className="flex flex-col items-left w-full my-2 px-2 xl:px-16">
              <fieldset>
                <legend className="font-semibold text-sm xl:text-base mb-2">
                  Available for hire:
                </legend>
              </fieldset>
              <div>
                <input
                  type="radio"
                  id="available"
                  name="availableForHire"
                  checked={availableForHire === true}
                  onChange={() => setAvailableForHire(true)}
                />
                <label
                  htmlFor="available"
                  className="p-2 font-light text-sm xl:text-base mb-2"
                >
                  Available
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="notAvailable"
                  name="availableForHire"
                  checked={availableForHire === false}
                  onChange={() => setAvailableForHire(false)}
                />
                <label
                  htmlFor="notAvailable"
                  className="p-2 font-light text-sm xl:text-base mb-2"
                >
                  Not available
                </label>
              </div>
            </div>
          </section>
          <button
            type="submit"
            className="bg-blue-500 text-gray-200 p-2 rounded-sm border border-gray-200 hover:bg-blue-400 mt-8 w-80 cursor-pointer"
            disabled={isLoading || saveLoading || updateLoading}
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
      </section>
    </PageContent>
  );
};

export default PublicProfilePage;
