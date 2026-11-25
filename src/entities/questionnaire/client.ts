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
  kind: "question"
  id: number
  type: string
  prompt: string
  answers: AnswerOptionClient[]
  correctAnswerId: string
  explanation: string
}

export type CodeTaskLanguageClient = "javascript" | "typescript"

export type CodeTaskExampleClient = {
  input: string
  output: string
}

export type CodeTaskTestClient = {
  id: string
  title: string
}

export type CodeTaskClient = {
  kind: "code"
  id: number
  type: string
  title: string
  description: string
  language: CodeTaskLanguageClient
  fileName: string
  starterCode: string
  examples: CodeTaskExampleClient[]
  tests: CodeTaskTestClient[]
  hints: string[]
  solution: {
    code: string
    explanation: string
  }
}

export type TrainingTaskClient = QuestionClient | CodeTaskClient

export type QuestionnaireClient = {
  id: string
  topic: string
  topics: string[]
  level: LevelLabel
  responseFormat: ResponseFormat
  total: number
  tasks: TrainingTaskClient[]
}
