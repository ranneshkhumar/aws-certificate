import { ApiError } from "./types";

const BASE_URL = "/api";

async function request<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      statusCode: response.status,
      error: response.statusText,
      message: `Request failed with status ${response.status}`,
    }));
    throw error;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
};
