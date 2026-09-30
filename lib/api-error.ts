import { AxiosError } from "axios";

/**
 * Pulls a human-readable message out of an API error, matching the original
 * `error?.response?.data?.message` access with sensible fallbacks.
 */
export function getErrorMessage(error: unknown, fallback?: string): string {
  if (error instanceof AxiosError) {
    return (
      (error.response?.data as { message?: string; description?: string })
        ?.message ??
      (error.response?.data as { description?: string })?.description ??
      error.message ??
      fallback ??
      "Something went wrong"
    );
  }
  if (error instanceof Error) return error.message || (fallback ?? "Something went wrong");
  return fallback ?? "Something went wrong";
}

/**
 * Per-field messages from an API validation error, keyed by dotted path
 * (e.g. `variants.1.hex`) — the global error handler puts them under
 * `error.details`. Empty when the error carries none.
 */
export function getFieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof AxiosError)) return {};
  const details = (
    error.response?.data as { error?: { details?: Record<string, string> } }
  )?.error?.details;
  return details && typeof details === "object" ? details : {};
}

/** The HTTP status of an API error, if it got as far as a response. */
export function getErrorStatus(error: unknown): number | undefined {
  return error instanceof AxiosError ? error.response?.status : undefined;
}
