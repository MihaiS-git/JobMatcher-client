import type { RefObject } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import InputErrorMessage from "../InputErrorMessage";

type Props = {
  socialLinks: string[];
  setSocialLinks: (links: string[]) => void;
  error: string | null;
  refs?: RefObject<HTMLInputElement>[];
};

const SocialMediaInput = ({
  socialLinks,
  setSocialLinks,
  error,
  refs,
}: Props) => {
  const handleChange = (index: number, value: string) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = value;
    setSocialLinks(updatedLinks);
  };

  const handleAddLink = () => {
    setSocialLinks([...socialLinks, ""]);
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updatedLinks);
  };

  return (
    <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
      <label className="font-semibold text-sm xl:text-base mb-2">
        Social Media URLs:
      </label>

      {socialLinks.map((url, index) => (
        <div key={index} className="mt-2 w-full flex items-center gap-2">
          <input
            type="url"
            placeholder="https://your-social-link.com"
            className="bg-gray-200 text-gray-950 py-2 px-4 rounded-sm border border-gray-950 text-sm xl:text-base grow transition-all duration-200 min-w-0"
            value={url}
            onChange={(e) => handleChange(index, e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? "social-url-error" : undefined}
            ref={refs?.[index] || null}
          />

          {/* {url && ( */}
            <button
              type="button"
              onClick={() => handleRemoveLink(index)}
              aria-label={`Remove social link ${index + 1}`}
              className="p-0 text-xs flex items-center"
            >
              <RiDeleteBin6Line className="w-7 h-7 text-gray-800 dark:text-red-600 hover:text-red-700 border border-gray-800 dark:border-red-600 hover:border-red-700 rounded-xs p-1" />
            </button>
          {/* )} */}
        </div>
      ))}
      {error && <InputErrorMessage message={error} label="social-url" />}
      <button
        type="button"
        onClick={handleAddLink}
        className="mx-auto mt-2 bg-gray-300 text-gray-950 text-sm p-0.5 rounded-sm border border-gray-950 hover:bg-gray-500 hover:text-gray-200 w-40 cursor-pointer"
      >
        + Add Another Link
      </button>
    </div>
  );
};

export default SocialMediaInput;
