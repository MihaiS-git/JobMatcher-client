import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { ErrorResponse } from "../types/ErrorResponse";

function isErrorResponse(data: unknown): data is ErrorResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "status" in data &&
    typeof (data as Record<string, unknown>).status === "number" &&
    "message" in data &&
    typeof (data as Record<string, unknown>).message === "string"
  );
}

function hasErrorField(data: unknown): data is { error: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof (data as Record<string, unknown>).error === "string"
  );
}

export function parseApiError(err: unknown): string {
  if (typeof err === "object" && err !== null && "status" in err) {
    const e = err as FetchBaseQueryError;

    if (e.status === "FETCH_ERROR") {
      return "Network error: Unable to reach the server.";
    }

    if (e.status === "TIMEOUT_ERROR") {
      return "Request timed out. Please try again later.";
    }

    if (e.status === "PARSING_ERROR") {
      return "Failed to parse server response.";
    }

    if (e.status === "CUSTOM_ERROR" && hasErrorField(e)) {
      return e.error;
    }

    if (typeof e.status === "number") {
      if (isErrorResponse(e.data)) {
        return e.data.message || e.data.error || `Error ${e.status}`;
      }
      // fallback
      return `Error ${e.status}`;
    }

    if (hasErrorField(e)) {
      return (e as { error: string }).error;
    }
  }

  if (err instanceof Error) {
    if (err.message === "Failed to fetch") {
      return "Network error: Unable to connect to the server.";
    }
    return err.message;
  }

  return "An unknown error occurred. Please try again later.";
}
