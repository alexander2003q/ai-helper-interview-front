import { API_URL } from "./apiUrl"
import type { ApiEndpoint, HttpMethod } from "./types"

const createApiEndpoint = (
  path: string,
  method: HttpMethod = "GET",
): ApiEndpoint => ({
  url: `${API_URL}${path}`,
  method,
})

export const ENDPOINTS = {
  questionnaires: {
    create: createApiEndpoint("/api/v1/questionnaires", "POST"),
  },
} as const
