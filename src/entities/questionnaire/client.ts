import type { Level, LevelLabel, ResponseFormat } from "./enums"

export type TrainingSectionClient = {
  enabled: boolean
  count: number
}

export type TrainingConfigClient = {
  theory: TrainingSectionClient
  code: TrainingSectionClient
  experience: TrainingSectionClient
  hints: {
    enabled: boolean
    perTask: number
  }
  attemptsPerTask: number
}

export type CreateQuestionnaireParamsClient = {
  topics: string[]
  vacancy: string
  level: Level
  responseFormat: ResponseFormat
  trainingConfig: TrainingConfigClient
}

export type AnswerOptionClient = {
  id: string
  text: string
}

export type QuestionClient = {
  id: number
  type: string
  prompt: string
  answers: AnswerOptionClient[]
  correctAnswerId: string
  explanation: string
}

export type QuestionnaireClient = {
  id: string
  topic: string
  topics: string[]
  level: LevelLabel
  responseFormat: ResponseFormat
  total: number
  questions: QuestionClient[]
}
