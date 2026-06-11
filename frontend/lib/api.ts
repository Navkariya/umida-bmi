/**
 * Thin client for the BMI backend REST API.
 * Base URL comes from NEXT_PUBLIC_API_URL (falls back to local dev).
 */
const DEFAULT_BASE_URL = "http://localhost:8000";

/** Backend base URL without a trailing slash. */
export function apiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_BASE_URL;
  return base.replace(/\/+$/, "");
}

/** Build a full API URL from a path, tolerating a missing leading slash. */
export function apiUrl(path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl()}${suffix}`;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

/** Call the backend health endpoint. Throws on a non-2xx response. */
export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(apiUrl("/api/health/"), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }
  return (await response.json()) as HealthResponse;
}
