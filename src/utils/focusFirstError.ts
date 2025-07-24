  const focusFirstError = (
    errors: Record<string, string | null | undefined>,
    refs: Record<string, React.RefObject<HTMLInputElement | null>>
  ) => {
    for (const key of Object.keys(errors)) {
      if (errors[key]) {
        refs[key]?.current?.focus();
        break;
      }
    }
  };

  export default focusFirstError;