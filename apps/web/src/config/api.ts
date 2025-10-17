export const API_BASE_URL =
  (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_API_BASE_URL ??
  'http://localhost:4000/api'
