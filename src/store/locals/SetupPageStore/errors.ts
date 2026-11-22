import type { ApiErrorResponseServer } from "../../../config/api"
import type { ApiRequestError } from "../../models/ApiRequest"

export const getCreateQuestionnaireErrorMessage = (
  error: ApiRequestError<ApiErrorResponseServer>,
) => {
  if (error.reason === "timeout") {
    return "Генерация заняла слишком много времени. Попробуйте ещё раз."
  }

  if (error.reason === "network") {
    return "Не удалось подключиться к серверу. Проверьте, что backend запущен."
  }

  if (error.reason === "invalid-response") {
    return "Сервер вернул некорректный ответ. Попробуйте ещё раз."
  }

  if (error.status === 502) {
    return "ИИ не смог сгенерировать вопросы. Попробуйте ещё раз."
  }

  if (error.status === 422) {
    const field = error.data?.error?.field
    return `Проверьте настройки тренировки${field ? `: ${field}` : ""}.`
  }

  return error.data?.error?.message ?? "Сервер не смог создать тренировку"
}
