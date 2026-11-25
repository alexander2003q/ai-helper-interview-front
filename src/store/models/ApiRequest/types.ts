import type { ApiEndpoint, ApiErrorResponseServer } from "../../../config/api"

export type ApiQueryValue =
  string | number | boolean | null | undefined | (string | number | boolean)[]

export type ApiCallParams<RequestData> = {
  data?: RequestData
  params?: Record<string, ApiQueryValue>
  headers?: Record<string, string>
}

export type ApiMockResponse<ResponseData, RequestData> = (
  params: ApiCallParams<RequestData>,
) => ResponseData | Promise<ResponseData>

export type ApiMockConfig<ResponseData, RequestData> = {
  enabled: boolean
  response: ApiMockResponse<ResponseData, RequestData>
  delayMs?: number
}

export type ApiRequestConfig<ResponseData, RequestData> = ApiEndpoint & {
  timeoutMs?: number
  mock?: ApiMockConfig<ResponseData, RequestData>
}

export type ApiRequestError<ErrorData = ApiErrorResponseServer> = {
  reason: "http" | "network" | "timeout" | "invalid-response"
  status: number | null
  data?: ErrorData
  cause?: unknown
}

export type ApiResponse<ResponseData, ErrorData = ApiErrorResponseServer> =
  | {
      isError: false
      isCancelled: false
      data: ResponseData
    }
  | {
      isError: true
      isCancelled: false
      error: ApiRequestError<ErrorData>
    }
  | {
      isError: true
      isCancelled: true
    }

export type ApiRequestState = "initial" | "loading" | "success" | "failed"
