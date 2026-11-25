import { actionBound, computed, makeObservable, observable } from "mobx"
import type { CodeTaskClient } from "../../../entities/questionnaire"
import type { RootStoreType } from "../../globals/root"
import type { ILocalStore } from "../../interfaces"

export type CodeTestState = "idle" | "failed" | "success"

type QuestionnairePageStoreOptions = {
  rootStore: RootStoreType
}

export class QuestionnairePageStore implements ILocalStore {
  private readonly _rootStore: QuestionnairePageStoreOptions["rootStore"]

  taskIndex = 0
  selectedAnswerId: string | null = null
  isChecked = false
  isConditionsOpen = false
  code = ""
  codeAttempt = 1
  revealedCodeHints = 0
  codeTestState: CodeTestState = "idle"

  constructor({ rootStore }: QuestionnairePageStoreOptions) {
    this._rootStore = rootStore
    this.resetTaskState()

    makeObservable(this, {
      taskIndex: observable,
      selectedAnswerId: observable,
      isChecked: observable,
      isConditionsOpen: observable,
      code: observable,
      codeAttempt: observable,
      revealedCodeHints: observable,
      codeTestState: observable,
      questionnaire: computed,
      currentTask: computed,
      currentQuestion: computed,
      currentCodeTask: computed,
      currentNumber: computed,
      totalTasks: computed,
      hintsEnabled: computed,
      hintsPerTask: computed,
      codeHintsLeft: computed,
      maxAttempts: computed,
      attemptsEnded: computed,
      isLastTask: computed,
      selectAnswer: actionBound,
      checkAnswer: actionBound,
      toggleConditions: actionBound,
      nextTask: actionBound,
      setCode: actionBound,
      showCodeHint: actionBound,
      runCodeTests: actionBound,
      destroy: actionBound,
    })
  }

  get questionnaire() {
    return this._rootStore.trainingSessionStore.questionnaire
  }

  get currentTask() {
    return this.questionnaire?.tasks[this.taskIndex] ?? null
  }

  get currentQuestion() {
    return this.currentTask?.kind === "question" ? this.currentTask : null
  }

  get currentCodeTask(): CodeTaskClient | null {
    return this.currentTask?.kind === "code" ? this.currentTask : null
  }

  get currentNumber() {
    return this.taskIndex + 1
  }

  get totalTasks() {
    return this.questionnaire?.tasks.length ?? 0
  }

  get hintsEnabled() {
    const hints =
      this.questionnaire?.hints ??
      this._rootStore.trainingSessionStore.request?.trainingConfig.hints
    return Boolean(hints?.enabled)
  }

  get hintsPerTask() {
    if (!this.hintsEnabled) return 0
    return (
      this.questionnaire?.hints?.perTask ??
      this._rootStore.trainingSessionStore.request?.trainingConfig.hints
        .perTask ??
      0
    )
  }

  get codeHintsLeft() {
    const availableHints = Math.min(
      this.hintsPerTask,
      this.currentCodeTask?.hints.length ?? 0,
    )
    return Math.max(availableHints - this.revealedCodeHints, 0)
  }

  get maxAttempts() {
    return (
      this.questionnaire?.attemptsPerTask ??
      this._rootStore.trainingSessionStore.request?.trainingConfig
        .attemptsPerTask ??
      1
    )
  }

  get attemptsEnded() {
    return (
      this.codeTestState === "failed" && this.codeAttempt >= this.maxAttempts
    )
  }

  get isLastTask() {
    return this.taskIndex === this.totalTasks - 1
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

  nextTask() {
    if (this.isLastTask) return false

    this.taskIndex += 1
    this.resetTaskState()
    return true
  }

  setCode(code: string) {
    if (this.codeTestState === "success" || this.attemptsEnded) return
    this.code = code
    this.codeTestState = "idle"
  }

  showCodeHint() {
    if (!this.hintsEnabled || this.codeHintsLeft <= 0) {
      return
    }

    this.revealedCodeHints += 1
  }

  runCodeTests() {
    if (this.codeTestState === "success" || this.attemptsEnded) return

    const normalized = this.code.replace(/\s/g, "")
    const isSuccessful =
      normalized.includes("newSet(") || normalized.includes(".filter(")

    if (isSuccessful) {
      this.codeTestState = "success"
      return
    }

    this.codeTestState = "failed"
    if (this.codeAttempt < this.maxAttempts) this.codeAttempt += 1
  }

  private resetTaskState() {
    this.selectedAnswerId = null
    this.isChecked = false
    this.isConditionsOpen = false
    this.codeAttempt = 1
    this.revealedCodeHints = 0
    this.codeTestState = "idle"
    this.code = this.currentCodeTask?.starterCode ?? ""
  }

  destroy() {
    return
  }
}
