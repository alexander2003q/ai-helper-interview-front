import { actionBound, computed, makeObservable, observableRef } from "mobx"
import type {
  CreateQuestionnaireParamsClient,
  QuestionnaireClient,
} from "../../../entities/questionnaire"

export class TrainingSessionStore {
  questionnaire: QuestionnaireClient | null = null
  request: CreateQuestionnaireParamsClient | null = null

  constructor() {
    makeObservable(this, {
      questionnaire: observableRef,
      request: observableRef,
      hasQuestionnaire: computed,
      conditions: computed,
      setSession: actionBound,
      reset: actionBound,
    })
  }

  get hasQuestionnaire() {
    return this.questionnaire !== null
  }

  get conditions() {
    const hints = this.request?.trainingConfig.hints

    return {
      format:
        this.request?.responseFormat === "voice"
          ? "Голосовой ответ"
          : "Текстовый ответ",
      hints: hints?.enabled ? hints.perTask : 0,
      attempts: this.request?.trainingConfig.attemptsPerTask ?? 1,
    }
  }

  setSession(
    questionnaire: QuestionnaireClient,
    request: CreateQuestionnaireParamsClient,
  ) {
    this.questionnaire = questionnaire
    this.request = request
  }

  reset() {
    this.questionnaire = null
    this.request = null
  }
}
