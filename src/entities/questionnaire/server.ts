import type { Level, LevelLabel, ResponseFormat } from "./enums"

export type TrainingSectionServer = {
  enabled: boolean
  count: number
}

export type TrainingConfigServer = {
  theory: TrainingSectionServer
  code: TrainingSectionServer
  experience: TrainingSectionServer
  hints: {
    enabled: boolean
    perTask: number
  }
  attemptsPerTask: number
}

export type CreateQuestionnaireRequestServer = {
  topics: string[]
  vacancy: string
  level: Level
  responseFormat: ResponseFormat
  trainingConfig: TrainingConfigServer
}

export type AnswerOptionServer = {
  id: string
  text: string
}

export type QuestionServer = {
  id: number
  type: string
  prompt: string
  answers: AnswerOptionServer[]
  correctAnswerId: string
  explanation: string
}

export type QuestionnaireServer = {
  id: string
  topic: string
  topics: string[]
  level: LevelLabel
  responseFormat: ResponseFormat
  total: number
  questions: QuestionServer[]
}
