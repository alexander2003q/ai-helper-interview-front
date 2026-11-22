import { actionBound, computed, makeObservable, observable } from "mobx"
import type { RootStoreType } from "../../globals/root"
import type { ILocalStore } from "../../interfaces"

type QuestionnairePageStoreOptions = {
  rootStore: RootStoreType
}

export class QuestionnairePageStore implements ILocalStore {
  private readonly _rootStore: QuestionnairePageStoreOptions["rootStore"]

  questionIndex = 0
  selectedAnswerId: string | null = null
  isChecked = false
  isConditionsOpen = false

  constructor({ rootStore }: QuestionnairePageStoreOptions) {
    this._rootStore = rootStore

    makeObservable(this, {
      questionIndex: observable,
      selectedAnswerId: observable,
      isChecked: observable,
      isConditionsOpen: observable,
      questionnaire: computed,
      currentQuestion: computed,
      currentNumber: computed,
      isLastQuestion: computed,
      selectAnswer: actionBound,
      checkAnswer: actionBound,
      toggleConditions: actionBound,
      nextQuestion: actionBound,
      destroy: actionBound,
    })
  }

  get questionnaire() {
    return this._rootStore.trainingSessionStore.questionnaire
  }

  get currentQuestion() {
    return this.questionnaire?.questions[this.questionIndex] ?? null
  }

  get currentNumber() {
    return this.questionIndex + 1
  }

  get isLastQuestion() {
    return (
      this.questionIndex === (this.questionnaire?.questions.length ?? 0) - 1
    )
  }

  selectAnswer(answerId: string) {
    if (!this.isChecked) this.selectedAnswerId = answerId
  }

  checkAnswer() {
    if (this.selectedAnswerId) this.isChecked = true
  }

  toggleConditions() {
    this.isConditionsOpen = !this.isConditionsOpen
  }

  nextQuestion() {
    if (this.isLastQuestion) return false

    this.questionIndex += 1
    this.selectedAnswerId = null
    this.isChecked = false
    return true
  }

  destroy() {
    return
  }
}
