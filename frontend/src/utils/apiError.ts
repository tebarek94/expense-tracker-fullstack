import { AxiosError } from "axios";

interface ErrorPayload {
  message?: string;
  error?: Record<string, string[] | string> | string;
}

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError<ErrorPayload>;
  const data = axiosError.response?.data;

  if (!data) {
    return fallback;
  }

  if (typeof data.error === "string" && data.error.trim()) {
    return data.error;
  }

  if (data.error && typeof data.error === "object") {
    const firstField = Object.values(data.error)[0];
    if (Array.isArray(firstField) && firstField[0]) {
      return firstField[0];
    }
    if (typeof firstField === "string" && firstField.trim()) {
      return firstField;
    }
  }

  return data.message ?? fallback;
};
