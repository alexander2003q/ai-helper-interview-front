export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type ApiEndpoint = {
  url: string
  method: HttpMethod
}

export type ApiErrorResponseServer = {
  error?: {
    code?: string
    message?: string
    field?: string
  }
}
