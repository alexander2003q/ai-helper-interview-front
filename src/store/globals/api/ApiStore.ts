import type { ApiErrorResponseServer } from "../../../config/api"
import { ApiRequest } from "../../models/ApiRequest"
import type { ApiRequestConfig } from "../../models/ApiRequest"

export class ApiStore {
  createExtendedRequest<
    ResponseData,
    RequestData = undefined,
    ErrorData = ApiErrorResponseServer,
  >(config: ApiRequestConfig) {
    return new ApiRequest<ResponseData, RequestData, ErrorData>(config)
  }
}
