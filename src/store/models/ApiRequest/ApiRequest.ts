import {
  actionBound,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx"
import type { ApiErrorResponseServer } from "../../../config/api"
import type { ILocalStore } from "../../interfaces"
import type {
  ApiCallParams,
  ApiQueryValue,
  ApiRequestConfig,
  ApiRequestError,
  ApiRequestState,
  ApiResponse,
} from "./types"

const DEFAULT_TIMEOUT_MS = 100_000
const DEFAULT_MOCK_DELAY_MS = 400

const wait = (delayMs: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Request aborted", "AbortError"))
      return
    }

    const handleAbort = () => {
      window.clearTimeout(timeoutId)
      reject(new DOMException("Request aborted", "AbortError"))
    }
    const timeoutId = window.setTimeout(() => {
      signal.removeEventListener("abort", handleAbort)
      resolve()
    }, delayMs)

    signal.addEventListener("abort", handleAbort, { once: true })
  })

const appendQueryValue = (
  searchParams: URLSearchParams,
  key: string,
  value: Exclude<ApiQueryValue, undefined | null>,
) => {
  if (Array.isArray(value)) {
    value.forEach((item) => searchParams.append(key, String(item)))
    return
  }

  searchParams.append(key, String(value))
}

const createRequestUrl = (
  url: string,
  params?: Record<string, ApiQueryValue>,
) => {
  if (!params) return url

  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      appendQueryValue(searchParams, key, value)
    }
  })

  const query = searchParams.toString()
  if (!query) return url

  return `${url}${url.includes("?") ? "&" : "?"}${query}`
}

const parseJson = async <Data>(response: Response): Promise<Data> => {
  try {
    return (await response.json()) as Data
  } catch (cause) {
    throw {
      reason: "invalid-response",
      status: response.status,
      cause,
    } satisfies ApiRequestError
  }
}

type PrivateFields = "_state"

export class ApiRequest<
  ResponseData,
  RequestData = undefined,
  ErrorData = ApiErrorResponseServer,
> implements ILocalStore {
  private readonly _config: Required<
    Pick<ApiRequestConfig<ResponseData, RequestData>, "timeoutMs">
  > &
    Omit<ApiRequestConfig<ResponseData, RequestData>, "timeoutMs">
  private _controller: AbortController | null = null
  private _callId = 0
  private _state: ApiRequestState = "initial"

  constructor(config: ApiRequestConfig<ResponseData, RequestData>) {
    this._config = {
      ...config,
      timeoutMs: config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    }

    makeObservable<this, PrivateFields>(this, {
      _state: observable,
      isLoading: computed,
      call: actionBound,
      cancel: actionBound,
      destroy: actionBound,
    })
  }

  get isLoading() {
    return this._state === "loading"
  }

  async call(
    params: ApiCallParams<RequestData> = {},
  ): Promise<ApiResponse<ResponseData, ErrorData>> {
    this._controller?.abort()

    const callId = ++this._callId
    const controller = new AbortController()
    let didTimeout = false

    this._controller = controller
    this._state = "loading"

    const timeoutId = window.setTimeout(() => {
      didTimeout = true
      controller.abort()
    }, this._config.timeoutMs)

    try {
      if (this._config.mock?.enabled) {
        await wait(
          this._config.mock.delayMs ?? DEFAULT_MOCK_DELAY_MS,
          controller.signal,
        )
        const data = await this._config.mock.response(params)

        if (controller.signal.aborted) {
          throw new DOMException("Request aborted", "AbortError")
        }

        if (callId !== this._callId) {
          return { isError: true, isCancelled: true }
        }

        runInAction(() => {
          this._state = "success"
        })

        return { isError: false, isCancelled: false, data }
      }

      const hasBody = params.data !== undefined
      const response = await fetch(
        createRequestUrl(this._config.url, params.params),
        {
          method: this._config.method,
          headers: {
            ...(hasBody ? { "Content-Type": "application/json" } : {}),
            ...params.headers,
          },
          body: hasBody ? JSON.stringify(params.data) : undefined,
          signal: controller.signal,
        },
      )

      if (callId !== this._callId) {
        return { isError: true, isCancelled: true }
      }

      if (!response.ok) {
        const data = await parseJson<ErrorData>(response).catch(() => undefined)

        if (callId !== this._callId) {
          return { isError: true, isCancelled: true }
        }

        runInAction(() => {
          this._state = "failed"
        })

        return {
          isError: true,
          isCancelled: false,
          error: {
            reason: "http",
            status: response.status,
            data,
          },
        }
      }

      const data = await parseJson<ResponseData>(response)

      if (callId !== this._callId) {
        return { isError: true, isCancelled: true }
      }

      runInAction(() => {
        this._state = "success"
      })

      return { isError: false, isCancelled: false, data }
    } catch (error) {
      if (
        callId !== this._callId ||
        (controller.signal.aborted && !didTimeout)
      ) {
        return { isError: true, isCancelled: true }
      }

      const requestError: ApiRequestError<ErrorData> =
        typeof error === "object" &&
        error !== null &&
        "reason" in error &&
        error.reason === "invalid-response"
          ? (error as ApiRequestError<ErrorData>)
          : {
              reason: didTimeout ? "timeout" : "network",
              status: null,
              cause: error,
            }

      runInAction(() => {
        this._state = "failed"
      })

      return {
        isError: true,
        isCancelled: false,
        error: requestError,
      }
    } finally {
      window.clearTimeout(timeoutId)
      if (callId === this._callId) this._controller = null
    }
  }

  cancel() {
    this._callId += 1
    this._controller?.abort()
    this._controller = null
    this._state = "initial"
  }

  destroy() {
    this.cancel()
  }
}
