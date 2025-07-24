import { forwardRef, type InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  containerClassName?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, id, containerClassName = "", className = "", ...props }, ref) => {
    return (
      <div className={`flex flex-col items-start w-full my-2 px-2 xl:px-16 ${containerClassName}`}>
        <label htmlFor={id} className="font-semibold text-sm xl:text-base">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border text-sm xl:text-base border-gray-950 ${className}`}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="text-red-600 dark:text-red-400 text-xs mt-0.25 mb-2">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;