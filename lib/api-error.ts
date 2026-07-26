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
