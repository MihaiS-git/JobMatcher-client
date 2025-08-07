import type { RefObject } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import InputErrorMessage from "../InputErrorMessage";
import { validateSocialLinks } from "@/utils/validation";

type Props = {
  socialLinks: string[];
  setSocialLinks: (links: string[]) => void;
  errors: (string | null)[];
  setErrors: (errors: (string | null)[]) => void;
  refs?: RefObject<HTMLInputElement>[];
};

const SocialMediaInput = ({
  socialLinks,
  setSocialLinks,
  errors,
  setErrors,
  refs,
}: Props) => {
  const handleChange = (index: number, value: string) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = value;
    setSocialLinks(updatedLinks);
    setErrors(errors.map((e, i) => (i === index ? null : e)));
  };

  const handleBlur = () => {
    const error = validateSocialLinks(socialLinks);
    setErrors(error);
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index);
    const updatedErrors = errors.filter((_, i) => i !== index);
    setSocialLinks(updatedLinks);
    setErrors(updatedErrors);
  };

  const handleAddLink = () => {
    setSocialLinks([...socialLinks, ""]);
    setErrors([...errors, null]);
  };

  return (
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
            onChange={(e) => handleChange(index, e.target.value)}
            onBlur={handleBlur}
            aria-invalid={!!errors[index]}
            aria-describedby={errors[index] ? `social-url-error-${index}` : undefined}
            ref={refs?.[index] || null}
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
          {errors[index] && (
            <InputErrorMessage
              message={errors[index]!}
              label={`social-url-${index}`}
            />
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddLink}
        className="mx-auto bg-gray-300 text-gray-950 text-sm p-0.5 rounded-sm border-1 border-gray-950 hover:bg-gray-500 hover:text-gray-200 w-40 cursor-pointer"
      >
        + Add Another Link
      </button>
    </div>
  );
};

export default SocialMediaInput;
