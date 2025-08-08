import { forwardRef, type SelectHTMLAttributes } from "react";
import InputErrorMessage from "./InputErrorMessage";

type Option<T extends string | number> = {
  value: T;
  label: string;
};

interface SelectFieldProps<T extends string | number>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> {
  id: string;
  label: string;
  name: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  error?: string | null;
  containerClassName?: string;
  className?: string;
}

// Use a generic with default type
const SelectField = forwardRef(
  <T extends string | number = string>(
    {
      id,
      label,
      name,
      value,
      options,
      onChange,
      error,
      containerClassName = "",
      className = "",
      disabled = false,
      ...props
    }: SelectFieldProps<T>,
    ref: React.ForwardedRef<HTMLSelectElement>
  ) => (
    <div
      className={`flex flex-col items-start w-full my-2 px-2 xl:px-16 ${containerClassName}`}
    >
      <label htmlFor={id} className="font-semibold text-sm xl:text-base">
        {label}
      </label>
      <select
        id={id}
        name={name}
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        disabled={disabled}
        className={`bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <InputErrorMessage message={error} label={id} />}
    </div>
  )
);

SelectField.displayName = "SelectField";

export default SelectField;