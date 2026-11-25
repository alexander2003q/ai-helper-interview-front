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
  kind: "question"
  id: number
  type: string
  prompt: string
  answers: AnswerOptionServer[]
  correctAnswerId: string
  explanation: string
}

export type LegacyQuestionServer = Omit<QuestionServer, "kind">

export type CodeTaskLanguageServer = "javascript" | "typescript"

export type CodeTaskServer = {
  kind: "code"
  id: number
  type: string
  title: string
  description: string
  language: CodeTaskLanguageServer
  fileName: string
  starterCode: string
  examples: Array<{
    input: string
    output: string
  }>
  tests: Array<{
    id: string
    title: string
  }>
  hints: string[]
  solution: {
    code: string
    explanation: string
  }
}

export type TrainingTaskServer = QuestionServer | CodeTaskServer

type QuestionnaireBaseServer = {
  id: string
  topic: string
  topics: string[]
  level: LevelLabel
  responseFormat: ResponseFormat
  total: number
}

export type QuestionnaireTasksServer = QuestionnaireBaseServer & {
  tasks: TrainingTaskServer[]
  questions?: never
}

export type QuestionnaireLegacyServer = QuestionnaireBaseServer & {
  questions: LegacyQuestionServer[]
  tasks?: never
}

/**
 * `questions` keeps the current backend response working during migration.
 * New responses should use the heterogeneous `tasks` array.
 */
export type QuestionnaireServer =
  QuestionnaireTasksServer | QuestionnaireLegacyServer
