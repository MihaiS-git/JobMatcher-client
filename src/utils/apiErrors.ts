import type { ErrorResponse } from "../types/ErrorResponse";

export function isErrorResponse(err: unknown): err is {
  status: number;
  data: ErrorResponse;
} {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    typeof (err as { status: unknown }).status === "number" &&
    "data" in err &&
    typeof (err as { data: unknown }).data === "object" &&
    err.data !== null &&
    "message" in (err as { data: Record<string, unknown> }).data
  );
}