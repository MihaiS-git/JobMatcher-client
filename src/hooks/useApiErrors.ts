/* import { useEffect, useState } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { parseApiError, parseValidationErrors } from "@/utils/parseApiError";

type ApiError = FetchBaseQueryError | undefined | null;

export function useApiErrors(...apiErrors: ApiError[]) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    setErrorMessage("");
    setValidationErrors(null);

    for (const err of apiErrors) {
      if (!err) continue;

      // parse validation errors first (more specific)
      const { message, validationErrors: valErrors } = parseValidationErrors(err);
      if (valErrors) {
        setValidationErrors(valErrors);
        setErrorMessage(message);
        return;
      }

      // fallback to general error message parser
      const msg = parseApiError(err);
      if (msg) {
        setErrorMessage(msg);
        return;
      }
    }
  }, [apiErrors]);

    const handleApiError = (err: unknown) => {
    const { message, validationErrors: valErrors } = parseValidationErrors(err);
    if (valErrors) {
      setValidationErrors(valErrors);
      setErrorMessage(message);
    } else {
      const msg = parseApiError(err);
      setErrorMessage(msg || "Unknown error");
      setValidationErrors(null);
    }
  };

  const clearErrors = () => {
    setErrorMessage("");
    setValidationErrors(null);
  };

  return { errorMessage, validationErrors, handleApiError, clearErrors };
}
 */