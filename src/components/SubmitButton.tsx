
type Props = {
    type: "submit" | "button";
    disabled?: boolean;
    className?: string;
    label: string;
};

const SubmitButton = ({type, disabled, className, label}: Props) => {
  return (
        <button
          type={type}
          disabled={disabled}
          className={`bg-blue-500 text-gray-200 p-2 rounded-sm border border-gray-200 hover:bg-blue-400 mt-4 w-80 disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
        >
          {label}
        </button>
  );
};

export default SubmitButton;
