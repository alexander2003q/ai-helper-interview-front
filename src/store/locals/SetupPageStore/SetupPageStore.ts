import {
  actionBound,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx"
import { API_MOCK_FLAGS, ENDPOINTS } from "../../../config/api"
import { createQuestionnaireMock } from "../../../config/api/mocks"
import type { ApiErrorResponseServer } from "../../../config/api"
import {
  normalizeCreateQuestionnaireRequest,
  normalizeQuestionnaire,
} from "../../../entities/questionnaire"
import type {
  CreateQuestionnaireParamsClient,
  CreateQuestionnaireRequestServer,
  Level,
  QuestionnaireServer,
  ResponseFormat,
  TrainingConfigClient,
} from "../../../entities/questionnaire"
import type { RootStoreType } from "../../globals/root"
import type { ILocalStore } from "../../interfaces"
import type { ApiRequest } from "../../models/ApiRequest"
import { MAX_TOPICS, popularTopics, topicGroups } from "./config"
import { getCreateQuestionnaireErrorMessage } from "./errors"
import type { TrainingSectionKey } from "./types"

type SetupPageStoreOptions = {
  rootStore: RootStoreType
}

export class SetupPageStore implements ILocalStore {
  private readonly _rootStore: SetupPageStoreOptions["rootStore"]
  private readonly _requests: {
    create: ApiRequest<
      QuestionnaireServer,
      CreateQuestionnaireRequestServer,
      ApiErrorResponseServer
    >
  }

  topics = ["React"]
  topicSearch = ""
  isTopicListOpen = false
  vacancy = ""
  level: Level = "middle"
  responseFormat: ResponseFormat = "text"
  isSettingsOpen = false
  error: string | null = null
  trainingConfig: TrainingConfigClient = {
    theory: { enabled: true, count: 8 },
    code: { enabled: true, count: 2 },
    hints: { enabled: true, perTask: 2 },
    attemptsPerTask: 3,
  }

  constructor({ rootStore }: SetupPageStoreOptions) {
    this._rootStore = rootStore
    this._requests = {
      create: this._rootStore.apiStore.createExtendedRequest<
        QuestionnaireServer,
        CreateQuestionnaireRequestServer,
        ApiErrorResponseServer
      >({
        ...ENDPOINTS.questionnaires.create,
        mock: {
          enabled: API_MOCK_FLAGS.questionnaires.create,
          response: createQuestionnaireMock,
          delayMs: 500,
        },
      }),
    }

    makeObservable(this, {
      topics: observable,
      topicSearch: observable,
      isTopicListOpen: observable,
      vacancy: observable,
      level: observable,
      responseFormat: observable,
      isSettingsOpen: observable,
      error: observable,
      trainingConfig: observable,
      isSubmitting: computed,
      canSubmit: computed,
      trainingSummary: computed,
      visibleTopics: computed,
      filteredTopicGroups: computed,
      isTopicLimitReached: computed,
      toggleTopic: actionBound,
      setTopicSearch: actionBound,
      toggleTopicList: actionBound,
      setVacancy: actionBound,
      setLevel: actionBound,
      setResponseFormat: actionBound,
      toggleSettings: actionBound,
      setSectionEnabled: actionBound,
      setSectionCount: actionBound,
      setHintsEnabled: actionBound,
      setHintsPerTask: actionBound,
      setAttemptsPerTask: actionBound,
      createQuestionnaire: actionBound,
      destroy: actionBound,
    })
  }

  get isSubmitting() {
    return this._requests.create.isLoading
  }

  get canSubmit() {
    const { theory, code } = this.trainingConfig
    const hasRequestedTask =
      (theory.enabled && theory.count > 0) || (code.enabled && code.count > 0)

    return this.topics.length > 0 && hasRequestedTask && !this.isSubmitting
  }

  get trainingSummary() {
    const sectionKeys: TrainingSectionKey[] = ["theory", "code"]
    const taskCount = sectionKeys.reduce((total, key) => {
      const section = this.trainingConfig[key]
      return total + (section.enabled ? section.count : 0)
    }, 0)

    return {
      tasks: taskCount,
      minutes: Math.max(5, Math.round((taskCount * 1.9) / 5) * 5),
    }
  }

  get visibleTopics() {
    const selectedExtras = this.topics.filter(
      (topic) => !popularTopics.includes(topic),
    )
    return [...popularTopics, ...selectedExtras]
  }

  get filteredTopicGroups() {
    const query = this.topicSearch.trim().toLowerCase()

    return topicGroups
      .map((group) => ({
        title: group.title,
        topics: group.topics.filter((topic) =>
          topic.toLowerCase().includes(query),
        ),
      }))
      .filter((group) => group.topics.length > 0)
  }

  get isTopicLimitReached() {
    return this.topics.length >= MAX_TOPICS
  }

  isPopularTopic(topic: string) {
    return popularTopics.includes(topic)
  }

  toggleTopic(topic: string) {
    if (this.topics.includes(topic)) {
      this.topics = this.topics.filter((item) => item !== topic)
      return
    }

    if (!this.isTopicLimitReached) {
      this.topics = [...this.topics, topic]
    }
  }

  setTopicSearch(search: string) {
    this.topicSearch = search
  }

  toggleTopicList() {
    this.isTopicListOpen = !this.isTopicListOpen
  }

  setVacancy(vacancy: string) {
    this.vacancy = vacancy
  }

  setLevel(level: Level) {
    this.level = level
  }

  setResponseFormat(responseFormat: ResponseFormat) {
    this.responseFormat = responseFormat
  }

  toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen
  }

  setSectionEnabled(key: TrainingSectionKey, enabled: boolean) {
    this.trainingConfig[key].enabled = enabled
  }

  setSectionCount(key: TrainingSectionKey, count: number) {
    this.trainingConfig[key].count = count
  }

  setHintsEnabled(enabled: boolean) {
    this.trainingConfig.hints.enabled = enabled
  }

  setHintsPerTask(perTask: number) {
    this.trainingConfig.hints.perTask = perTask
  }

  setAttemptsPerTask(attempts: number) {
    this.trainingConfig.attemptsPerTask = attempts
  }

  async createQuestionnaire() {
    if (!this.canSubmit) return false

    this.error = null

    const params: CreateQuestionnaireParamsClient = {
      topics: [...this.topics],
      vacancy: this.vacancy,
      level: this.level,
      responseFormat: this.responseFormat,
      trainingConfig: {
        theory: { ...this.trainingConfig.theory },
        code: { ...this.trainingConfig.code },
        hints: { ...this.trainingConfig.hints },
        attemptsPerTask: this.trainingConfig.attemptsPerTask,
      },
    }
    const response = await this._requests.create.call({
      data: normalizeCreateQuestionnaireRequest(params),
    })

    if (response.isCancelled) return false

    if (response.isError) {
      runInAction(() => {
        this.error = getCreateQuestionnaireErrorMessage(response.error)
      })
      return false
    }

    runInAction(() => {
      this._rootStore.trainingSessionStore.setSession(
        normalizeQuestionnaire(response.data),
        params,
      )
    })
    return true
  }

  destroy() {
    this._requests.create.destroy()
  }
}
