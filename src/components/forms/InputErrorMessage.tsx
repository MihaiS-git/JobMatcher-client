const InputErrorMessage = ({message, label}:  {message: string, label: string}) => {
  return (
    <p
      id={`${label}-error`}
      className="w-80 break-words text-red-300 dark:text-red-600 text-sm mt-0.5"
      role="alert"
      aria-live="assertive"
    >
      {message}
    </p>
  );
};

export default InputErrorMessage;
