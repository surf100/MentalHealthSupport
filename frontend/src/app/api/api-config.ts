// Base URL читается из переменной окружения Vite.
// Локально: http://localhost:8080
// На проде: задаётся в Vercel как VITE_API_BASE_URL
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";